import { ref } from 'vue'
import { listFeedback, createFeedback, FEEDBACK_LIMITS } from '../services/feedbackService'
import { useLanguage } from './useLanguage'

const COOLDOWN_MS = 10 * 1000
const COOLDOWN_KEY = 'dar-alkashxa-feedback-last-submit'

function cooldownRemaining() {
  try {
    const last = Number(window.localStorage.getItem(COOLDOWN_KEY) || 0)
    return Math.max(0, COOLDOWN_MS - (Date.now() - last))
  } catch {
    return 0
  }
}

export function useFeedback() {
    const { t, locale } = useLanguage()

  const items = ref([])
  const page = ref(0)
  const hasMore = ref(false)
  const hasLoaded = ref(false)
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const loadError = ref('')
  const isSubmitting = ref(false)

  function mergeUnique(newItems) {
    const known = new Set(items.value.map((i) => i.id))
    items.value.push(...newItems.filter((i) => !known.has(i.id)))
  }

  function errorText(code) {
    switch (code) {
      case 'name':
        return t('errors.name_required')
      case 'name_long':
        return t('errors.name_long', { max: FEEDBACK_LIMITS.nameMax })
      case 'rating':
        return t('errors.rating_required')
      case 'message_short':
        return t('errors.message_short', { min: FEEDBACK_LIMITS.messageMin })
      case 'message_long':
        return t('errors.message_long', { max: FEEDBACK_LIMITS.messageMax })
      case 'storage':
        return t('errors.cannot_save')
      default:
        return t('errors.generic')
    }
  }

  async function loadFirstPage() {
    isLoading.value = true
    loadError.value = ''
    try {
      const result = await listFeedback({ page: 1 })
      items.value = result.items
      page.value = 1
      hasMore.value = result.hasMore
    } catch {
      loadError.value = t('errors.load_failed')
    } finally {
      isLoading.value = false
      hasLoaded.value = true
    }
  }

  async function loadMore() {
    if (isLoadingMore.value || !hasMore.value) return
    isLoadingMore.value = true
    loadError.value = ''
    try {
      const result = await listFeedback({ page: page.value + 1 })
      mergeUnique(result.items)
      page.value += 1
      hasMore.value = result.hasMore
    } catch {
      loadError.value = t('errors.more_failed')
    } finally {
      isLoadingMore.value = false
    }
  }

  // Returns { ok, error } so the form can show a translated message.
  async function submit(payload) {
    if (isSubmitting.value) return { ok: false, error: t('errors.busy') }

    const wait = cooldownRemaining()
    if (wait > 0) {
      return { ok: false, error: t('errors.cooldown', { s: Math.ceil(wait / 1000) }) }
    }

    isSubmitting.value = true
    try {
            const saved = await createFeedback({ ...payload, language: locale.value })
      items.value.unshift(saved)
      try {
        window.localStorage.setItem(COOLDOWN_KEY, String(Date.now()))
      } catch {
        /* ignore storage errors */
      }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: errorText(err?.code) }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    items,
    hasMore,
    hasLoaded,
    isLoading,
    isLoadingMore,
    loadError,
    isSubmitting,
    loadFirstPage,
    loadMore,
    submit,
    limits: FEEDBACK_LIMITS,
  }
}