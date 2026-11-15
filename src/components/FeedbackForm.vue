<script setup>
import { reactive, ref, computed } from 'vue'
import { Star, CheckCircle2 } from 'lucide-vue-next'
import { FEEDBACK_LIMITS } from '../services/feedbackService'
import { useLanguage } from '../composables/useLanguage'

const props = defineProps({
  onSubmit: { type: Function, required: true },
  isSubmitting: { type: Boolean, default: false },
})

const { t } = useLanguage()

const form = reactive({ name: '', rating: 0, message: '' })
const errors = reactive({ name: '', rating: '', message: '', form: '' })
const successMessage = ref('')
const hoverRating = ref(0)
// Honeypot: hidden from people, usually filled in by bots.
const website = ref('')

const ratingLabel = computed(() => {
  const shown = hoverRating.value || form.rating
  return shown ? t('feedback.ratingOut', { n: shown }) : t('feedback.ratingNone')
})

const messageCount = computed(() => form.message.length)

function validate() {
  errors.name = ''
  errors.rating = ''
  errors.message = ''
  errors.form = ''

  const name = form.name.trim()
  const message = form.message.trim()

  if (!name) errors.name = t('errors.name_required')
  else if (name.length > FEEDBACK_LIMITS.nameMax)
    errors.name = t('errors.name_long', { max: FEEDBACK_LIMITS.nameMax })

  if (!form.rating) errors.rating = t('errors.rating_required')

  if (!message) errors.message = t('errors.message_required')
  else if (message.length < FEEDBACK_LIMITS.messageMin)
    errors.message = t('errors.message_short', { min: FEEDBACK_LIMITS.messageMin })
  else if (message.length > FEEDBACK_LIMITS.messageMax)
    errors.message = t('errors.message_long', { max: FEEDBACK_LIMITS.messageMax })

  return !errors.name && !errors.rating && !errors.message
}

function resetForm() {
  form.name = ''
  form.rating = 0
  form.message = ''
}

async function handleSubmit() {
  successMessage.value = ''
  if (props.isSubmitting) return
  if (website.value) {
    resetForm()
    return
  }
  if (!validate()) return

  const result = await props.onSubmit({
    customer_name: form.name.trim(),
    rating: form.rating,
    message: form.message.trim(),
  })

  if (result.ok) {
    resetForm()
    successMessage.value = t('feedback.success')
  } else {
    errors.form = result.error
  }
}
</script>

<template>
  <form class="feedback-form" novalidate @submit.prevent="handleSubmit">
    <p class="notice">{{ t('feedback.notice') }}</p>

    <div class="field" :class="{ 'has-error': errors.name }">
      <label for="feedback-name">{{ t('feedback.nameLabel') }} <span class="required" aria-hidden="true">*</span></label>
      <input
        id="feedback-name"
        v-model="form.name"
        type="text"
        autocomplete="name"
        :maxlength="FEEDBACK_LIMITS.nameMax"
        :aria-invalid="Boolean(errors.name)"
        aria-describedby="feedback-name-error"
        required
      />
      <p v-if="errors.name" id="feedback-name-error" class="field__error">{{ errors.name }}</p>
    </div>

    <fieldset class="field star-field" :class="{ 'has-error': errors.rating }" aria-describedby="feedback-rating-error">
      <legend>{{ t('feedback.ratingLegend') }} <span class="required" aria-hidden="true">*</span></legend>
      <div class="stars" role="radiogroup" :aria-label="t('feedback.starsAria')" @mouseleave="hoverRating = 0">
        <label
          v-for="n in 5"
          :key="n"
          class="star"
          :class="{ 'is-active': n <= (hoverRating || form.rating) }"
          @mouseenter="hoverRating = n"
        >
          <input v-model.number="form.rating" type="radio" name="rating" :value="n" class="sr-only" />
          <Star :size="32" :fill="n <= (hoverRating || form.rating) ? 'currentColor' : 'none'" aria-hidden="true" />
          <span class="sr-only">{{ t('feedback.starLabel', { n }) }}</span>
        </label>
      </div>
      <p class="rating-label" aria-live="polite">{{ ratingLabel }}</p>
      <p v-if="errors.rating" id="feedback-rating-error" class="field__error">{{ errors.rating }}</p>
    </fieldset>

    <div class="field" :class="{ 'has-error': errors.message }">
      <label for="feedback-message">{{ t('feedback.messageLabel') }} <span class="required" aria-hidden="true">*</span></label>
      <textarea
        id="feedback-message"
        v-model="form.message"
        rows="5"
        :maxlength="FEEDBACK_LIMITS.messageMax"
        :aria-invalid="Boolean(errors.message)"
        aria-describedby="feedback-message-error feedback-message-count"
        required
      ></textarea>
      <div class="field__meta">
        <p v-if="errors.message" id="feedback-message-error" class="field__error">{{ errors.message }}</p>
        <span v-else></span>
        <span id="feedback-message-count" class="counter">{{ messageCount }}/{{ FEEDBACK_LIMITS.messageMax }}</span>
      </div>
    </div>

    <div class="hp" aria-hidden="true">
      <label for="feedback-website">{{ t('feedback.website') }}</label>
      <input id="feedback-website" v-model="website" type="text" tabindex="-1" autocomplete="off" />
    </div>

    <p v-if="errors.form" class="form-alert form-alert--error" role="alert">{{ errors.form }}</p>
    <p v-if="successMessage" class="form-alert form-alert--success" role="status">
      <CheckCircle2 :size="18" aria-hidden="true" />
      {{ successMessage }}
    </p>

    <button type="submit" class="btn btn--primary btn--block" :disabled="isSubmitting" :aria-busy="isSubmitting">
      {{ isSubmitting ? t('feedback.submitting') : t('feedback.submit') }}
    </button>
  </form>
</template>