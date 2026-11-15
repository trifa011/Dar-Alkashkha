<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

const leftLinks = computed(() => [
  { href: '#home', label: t('nav.home') },
  { href: '#about', label: t('nav.about') },
])

const rightLinks = computed(() => [
  { href: '#connect', label: t('nav.connect') },
  { href: '#feedback', label: t('nav.feedback') },
])

const allLinks = computed(() => [...leftLinks.value, ...rightLinks.value])

const menuOpen = ref(false)
const scrolled = ref(false)

function closeMenu() {
  menuOpen.value = false
}

function onKeydown(e) {
  if (e.key === 'Escape') closeMenu()
}

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="navbar" :class="{ 'is-scrolled': scrolled }">
    <div class="container navbar__inner">
      <nav class="navbar__side navbar__side--left" :aria-label="t('aria.mainNav')">
        <ul>
          <li v-for="link in leftLinks" :key="link.href">
            <a :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <nav class="navbar__side navbar__side--right" :aria-label="t('aria.secondaryNav')">
        <ul>
          <li v-for="link in rightLinks" :key="link.href">
            <a :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        class="navbar__toggle"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        :aria-label="menuOpen ? t('aria.closeMenu') : t('aria.openMenu')"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" :size="24" />
        <Menu v-else :size="24" />
      </button>
    </div>

    <nav id="mobile-nav" class="navbar__mobile" :class="{ 'is-open': menuOpen }" :aria-label="t('aria.mobileNav')">
      <ul>
        <li v-for="link in allLinks" :key="link.href">
          <a :href="link.href" @click="closeMenu">{{ link.label }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>