<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
import { socialLinks } from '../data/socialLinks'
import { useLanguage } from '../composables/useLanguage'
import SocialIcon from './SocialIcon.vue'

const { t } = useLanguage()
</script>

<template>
  <section id="connect" class="section connect" aria-labelledby="connect-title">
    <div class="container">
      <header class="section__header section__header--light">
        <p class="eyebrow">{{ t('connect.eyebrow') }}</p>
        <h2 id="connect-title" class="section__title">{{ t('connect.title') }}</h2>
      </header>

      <ul class="connect__grid">
        <li v-for="link in socialLinks" :key="link.id">
          <a
            :href="link.url"
            class="connect__card"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${t('connect.' + link.id)} ${t('connect.newTab')}`"
          >
            <span class="connect__icon">
            <SocialIcon :name="link.icon || link.id.split('-')[0]" />
            </span>
            <span class="connect__text">
              <span class="connect__label">{{ link.label }}</span>
              <span class="connect__cta">{{ t('connect.' + link.id) }}</span>
            </span>
            <ArrowUpRight class="connect__arrow" :size="20" aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>