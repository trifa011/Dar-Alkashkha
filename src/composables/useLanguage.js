import { ref, computed, watch } from 'vue'
import { messages, languages } from '../data/translations'

const STORAGE_KEY = 'dar-alkashxa-lang'

function readSaved() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const saved = readSaved()
const locale = ref(messages[saved] ? saved : 'en')
const current = computed(() => languages.find((l) => l.code === locale.value))

function applyDocument() {
  document.documentElement.lang = locale.value
  document.documentElement.dir = current.value.dir
}

applyDocument()

watch(locale, (code) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* ignore storage errors */
  }
  applyDocument()
})

function setLocale(code) {
  if (messages[code]) locale.value = code
}

// Looks up a key such as 'nav.home' and fills in {placeholders}.
// Falls back to English if a translation is missing.
function t(key, params = {}) {
  const read = (source) => key.split('.').reduce((obj, part) => obj?.[part], source)
  let text = read(messages[locale.value])
  if (typeof text !== 'string') text = read(messages.en)
  if (typeof text !== 'string') return key
  return text.replace(/\{(\w+)\}/g, (_, name) => (params[name] ?? ''))
}

export function useLanguage() {
  return { locale, current, languages, setLocale, t }
}