<script setup>
defineProps({
  name: { type: String, required: true },
})
</script>

<template>
  <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <template v-if="name === 'instagram'">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </template>
    <template v-else-if="name === 'whatsapp'">
      <path
        d="M3.5 20.5l1.2-4.1A8.5 8.5 0 1 1 8 19.3z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linejoin="round"
      />
      <path
        d="M9 8.5c0 3.6 2.9 6.5 6.5 6.5l.9-1.2-2-.8-.8.9c-1-.4-2-1.4-2.4-2.4l.9-.8-.8-2z"
        fill="currentColor"
      />
    </template>
    <template v-else-if="name === 'telegram'">
      <path
        d="M2.5 11.2 20.6 4.1c.8-.3 1.6.2 1.4 1.1l-3.1 14.6c-.2.9-1.1 1.2-1.8.7l-4.5-3.3-2.2 2.1c-.3.3-.8.1-.9-.3l-.8-4.3-4.1-1.3c-.9-.3-.9-1.5.5-2.1z"
        fill="currentColor"
      />
    </template>
    <template v-else-if="name === 'tiktok'">
      <path
        d="M16.5 3h-3v12.2a2.8 2.8 0 1 1-2.8-2.8c.3 0 .5 0 .8.1V9.2a6 6 0 0 0-.8-.1 5.9 5.9 0 1 0 5.9 5.9V8.9a7.4 7.4 0 0 0 4.3 1.4V7.2a4.3 4.3 0 0 1-4.3-4.2z"
        fill="currentColor"
      />
    </template>
    <template v-else-if="name === 'snapchat'">
      <path
        d="M12 3c-2.6 0-4.4 1.9-4.4 4.6v1.7c-.6.3-1.3.5-2 .5-.4 0-.6.4-.3.7.7.6 1.6 1 2.4 1.1-.6 1.3-1.6 2-2.9 2.3-.4.1-.3.7.2.8 1 .2 1.8.7 2.1 1.4.2.6.8.6 1.2.5.9-.3 2.1-.4 2.7.1.9.8 2 1 2.6 1s1.7-.2 2.6-1c.6-.5 1.8-.4 2.7-.1.4.1 1 .1 1.2-.5.3-.7 1.1-1.2 2.1-1.4.5-.1.6-.7.2-.8-1.3-.3-2.3-1-2.9-2.3.8-.1 1.7-.5 2.4-1.1.3-.3.1-.7-.3-.7-.7 0-1.4-.2-2-.5V7.6C16.4 4.9 14.6 3 12 3z"
        fill="currentColor"
      />
    </template>
  </svg>
</template>