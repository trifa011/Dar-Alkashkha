<script setup>
import FeedbackCard from './FeedbackCard.vue'
import { useLanguage } from '../composables/useLanguage'

defineProps({
  items: { type: Array, required: true },
  hasLoaded: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
  isLoadingMore: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

defineEmits(['retry', 'load-more'])

const { t } = useLanguage()
</script>

<template>
  <div class="feedback-list">
    <div v-if="isLoading && !hasLoaded" class="feedback-state" role="status">
      <span class="spinner" aria-hidden="true"></span>
      <p>{{ t('feedback.loading') }}</p>
    </div>

    <div v-else-if="error && items.length === 0" class="feedback-state feedback-state--error" role="alert">
      <p>{{ error }}</p>
      <button type="button" class="btn btn--outline" @click="$emit('retry')">{{ t('feedback.tryAgain') }}</button>
    </div>

    <div v-else-if="hasLoaded && items.length === 0" class="feedback-state">
      <p class="feedback-state__title">{{ t('feedback.emptyTitle') }}</p>
      <p>{{ t('feedback.emptyText') }}</p>
    </div>

    <template v-else>
      <ul class="feedback-grid">
        <li v-for="item in items" :key="item.id">
          <FeedbackCard :item="item" />
        </li>
      </ul>

      <p v-if="error" class="form-alert form-alert--error" role="alert">{{ error }}</p>

      <div v-if="hasMore" class="feedback-more">
        <button type="button" class="btn btn--outline" :disabled="isLoadingMore" @click="$emit('load-more')">
          {{ isLoadingMore ? t('feedback.loadingMore') : t('feedback.loadMore') }}
        </button>
      </div>
    </template>
  </div>
</template>