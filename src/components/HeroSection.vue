<script setup>
import { brand } from '../data/brand'
import { useLanguage } from '../composables/useLanguage'
import HeroBackground from './HeroBackground.vue'

const { t, locale } = useLanguage()
</script>

<template>
  <section id="home" class="hero" aria-labelledby="hero-title">
    <HeroBackground />

    <div class="hero__content">
      <div class="hero__top">
      
        <h1 id="hero-title" class="hero__script" :class="{ 'is-native': locale !== 'en' }">
          {{ t('brand.name') }}
        </h1>
      </div>

      <p class="hero__title">{{ t('hero.slogan') }}</p>
      <p class="hero__intro">{{ t('hero.intro') }}</p>
      <div class="hero__actions">
        <a href="#about" class="btn btn--primary">{{ t('hero.about') }}</a>
        <a href="#feedback" class="btn btn--ghost">{{ t('hero.feedback') }}</a>
      </div>
    </div>

    <a href="#about" class="hero__scroll" :aria-label="t('hero.scroll')">
      <span class="hero__scroll-line" aria-hidden="true"></span>
    </a>
  </section>
</template>