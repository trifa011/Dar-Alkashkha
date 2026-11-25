<script setup>
import { computed } from 'vue'
import { Star, Quote } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'

const props = defineProps({
  item: { type: Object, required: true },
})

const { t } = useLanguage()

// Always: 26 Nov 2026, 12:21 AM (Baghdad time), in every language
const dateLabel = computed(() => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Baghdad',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(new Date(props.item.created_at))

  const get = (type) => parts.find((p) => p.type === type)?.value ?? ''

  return `${get('day')} ${get('month')} ${get('year')}, ${get('hour')}:${get('minute')} ${get('dayPeriod').toUpperCase()}`
})
</script>

<template>
  <article class="feedback-card">
    <Quote class="feedback-card__quote" :size="28" aria-hidden="true" />
    <p class="feedback-card__message">{{ item.message }}</p>
    <div class="feedback-card__stars" role="img" :aria-label="t('card.rated', { n: item.rating })">
      <Star
        v-for="n in 5"
        :key="n"
        :size="16"
        :class="{ 'is-filled': n <= item.rating }"
        :fill="n <= item.rating ? 'currentColor' : 'none'"
        aria-hidden="true"
      />
    </div>
    <footer class="feedback-card__footer">
      <span class="feedback-card__name">{{ item.customer_name }}</span>
      <time :datetime="item.created_at" dir="ltr" class="feedback-card__date">{{ dateLabel }}</time>
    </footer>
  </article>
</template>