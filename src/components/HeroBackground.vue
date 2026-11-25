<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { brand } from '../data/brand'

const ridge =
  'M0 180 C120 110 240 230 400 170 S680 100 800 180 L800 300 L0 300 Z'

const layers = [
  { height: '58%', fill: 'rgba(154, 42, 51, 0.55)', duration: '90s', edge: false },
  { height: '42%', fill: 'rgba(110, 24, 32, 0.75)', duration: '55s', edge: false },
  { height: '26%', fill: 'rgba(60, 10, 16, 0.95)', duration: '32s', edge: true },
]

const rootEl = ref(null)
const videoEl = ref(null)
const videoFailed = ref(false)
const showVideo = computed(() => Boolean(brand.heroVideo) && !videoFailed.value)

const unlocked = ref(false) // browser allows sound (after first tap or click)
const inView = ref(true) // hero is mostly on screen
const pageVisible = ref(true) // visitor is still on this page

let observer = null
const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchstart']

function applySound() {
  const v = videoEl.value
  if (!v) return

  // Leaving the page: stop the video completely
  if (!pageVisible.value) {
    v.muted = true
    v.pause()
    return
  }

  v.muted = !(unlocked.value && inView.value)
  if (v.paused) v.play().catch(() => {})
}

function unlock() {
  unlocked.value = true
  applySound()
}

function onVisibilityChange() {
  pageVisible.value = !document.hidden
  applySound()
}

function onPageHide() {
  pageVisible.value = false
  applySound()
}

function onPageShow() {
  pageVisible.value = true
  applySound()
}

function onVideoError() {
  videoFailed.value = true
}

onMounted(async () => {
  const v = videoEl.value
  if (v) {
    v.muted = false
    try {
      await v.play()
      unlocked.value = true
    } catch {
      v.muted = true
      v.play().catch(() => {})
    }
  }

  UNLOCK_EVENTS.forEach((evt) => window.addEventListener(evt, unlock, { once: true, passive: true }))
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('pagehide', onPageHide)
  window.addEventListener('pageshow', onPageShow)

  if ('IntersectionObserver' in window && rootEl.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        inView.value = entry.isIntersecting && entry.intersectionRatio >= 0.3
        applySound()
      },
      { threshold: [0, 0.3, 0.6, 1] },
    )
    observer.observe(rootEl.value)
  }

  applySound()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  UNLOCK_EVENTS.forEach((evt) => window.removeEventListener(evt, unlock))
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('pagehide', onPageHide)
  window.removeEventListener('pageshow', onPageShow)
})
</script>

<template>
  <div ref="rootEl" class="hero-bg">
    <video
      v-if="showVideo"
      ref="videoEl"
      class="hero-bg__video"
      :src="brand.heroVideo"
      loop
      playsinline
      aria-hidden="true"
      @error="onVideoError"
    ></video>

    <div
      v-else-if="brand.heroImage"
      class="hero-bg__photo"
      :style="{ backgroundImage: `url('${brand.heroImage}')` }"
    ></div>

    <template v-else>
      <div class="hero-bg__sky"></div>
      <div class="hero-bg__sun"></div>

      <div
        v-for="(layer, i) in layers"
        :key="i"
        class="hero-bg__layer"
        :style="{ '--h': layer.height, '--dur': layer.duration }"
      >
        <div class="hero-bg__track">
          <svg viewBox="0 0 800 300" preserveAspectRatio="none">
            <path :d="ridge" :style="{ fill: layer.fill }" />
          </svg>
          <svg viewBox="0 0 800 300" preserveAspectRatio="none">
            <path :d="ridge" :style="{ fill: layer.fill }" />
          </svg>
        </div>
      </div>

      <div class="hero-bg__mist"></div>
    </template>

    <div class="hero-bg__shade"></div>
  </div>
</template>