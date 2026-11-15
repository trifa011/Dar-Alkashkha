<script setup>
import { brand } from '../data/brand'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <img :src="brand.logo" alt="" class="footer__logo" />
      <p class="footer__name">{{ t('Dar Alkashkha') }}</p>
      <p class="footer__copy">©2022</p>
    </div>
  </footer>
</template>