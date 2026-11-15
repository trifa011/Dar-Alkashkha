<script setup>
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

const values = computed(() =>
  [1, 2, 3].map((i) => ({
    title: t(`about.value${i}Title`),
    text: t(`about.value${i}Text`),
  })),
)
</script>

<template>
  <section id="about" class="section about" aria-labelledby="about-title">
    <div class="container">
      <header class="section__header">
        <p class="eyebrow">{{ t('brand.name') }}</p>
        <h2 id="about-title" class="section__title">{{ t('about.title') }}</h2>
      </header>

      <div class="about__grid">
        <article class="about__block">
          <h3>{{ t('about.storyTitle') }}</h3>
          <p>{{ t('about.storyText') }}</p>
        </article>
        <article class="about__block">
          <h3>{{ t('about.identityTitle') }}</h3>
          <p>{{ t('about.identityText') }}</p>
        </article>
        <article class="about__block">
          <h3>{{ t('about.visionTitle') }}</h3>
          <p>{{ t('about.visionText') }}</p>
        </article>
      </div>

      <h3 class="about__values-title">{{ t('about.valuesTitle') }}</h3>
      <ul class="about__values">
        <li v-for="value in values" :key="value.title" class="value-card">
          <span class="value-card__title">{{ value.title }}</span>
          <p v-if="value.text">{{ value.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>