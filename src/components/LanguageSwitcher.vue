<script setup>
import { useLanguage } from '../composables/useLanguage'

const { locale, languages, setLocale, t } = useLanguage()

// Short labels that fit on a phone
const shortLabels = { en: 'ENG', ar: 'عربي', ku: 'کوردی' }
</script>

<template>
  <div class="lang-group" role="group" :aria-label="t('aria.language')">
    <button
      v-for="l in languages"
      :key="l.code"
      type="button"
      class="lang-group__btn"
      :class="{ 'is-active': locale === l.code }"
      :aria-pressed="locale === l.code"
      :lang="l.code"
      @click="setLocale(l.code)"
    >
      {{ shortLabels[l.code] }}
    </button>
  </div>
</template>