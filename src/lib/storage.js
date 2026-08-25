const SETTINGS_KEY = 'tm_settings'
const RECENT_KEY = 'tm_recent'

export const FONT_SIZES = ['large', 'xlarge', 'xxlarge', 'xxxlarge', 'xxxxlarge']
export const THEMES = ['light', 'dark', 'highContrast']

export const DEFAULT_SETTINGS = {
  fontSize: 'large',
  theme: 'light',
  lastMode: 'card',
  lastCategoryId: null,
}

const RECENT_LIMIT = 20

function safeGet(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // localStorage unavailable (private mode, quota) — settings/recent just won't persist
  }
}

export function loadSettings() {
  const raw = safeGet(SETTINGS_KEY)
  if (!raw) return { ...DEFAULT_SETTINGS }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  safeSet(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadRecent() {
  const raw = safeGet(RECENT_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveRecent(list) {
  safeSet(RECENT_KEY, JSON.stringify(list))
}

export function clearRecent() {
  safeSet(RECENT_KEY, JSON.stringify([]))
}

export function addRecentMessage(list, { text, source, categoryId, id, timestamp }) {
  const withoutDupe = list.filter((m) => m.text !== text)
  const entry = { id, text, source, categoryId: categoryId ?? null, timestamp }
  return [entry, ...withoutDupe].slice(0, RECENT_LIMIT)
}
