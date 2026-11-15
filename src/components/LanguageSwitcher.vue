<script setup>
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { locale, languages, setLocale, t } = useLanguage()

// Short label for each language, shown in its own script so it's easy to recognise
const shortLabels = { en: 'ENG', ar: 'عربي', ku: 'کوردی' }

const currentLabel = computed(() => shortLabels[locale.value] ?? 'ENG')

// The language that the button will switch to on the next tap
const nextCode = computed(() => {
  const i = languages.findIndex((l) => l.code === locale.value)
  return languages[(i + 1) % languages.length].code
})

function cycleLanguage() {
  setLocale(nextCode.value)
}
</script>

<template>
  <button
    type="button"
    class="lang-btn"
    :lang="locale"
    :aria-label="`${t('aria.language')}: ${currentLabel}`"
    @click="cycleLanguage"
  >
    {{ currentLabel }}
  </button>
</template>