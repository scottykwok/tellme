import { useEffect, useMemo, useState } from 'react'
import vocabulary from './data/vocabulary.json'
import { flattenVocabulary } from './lib/predict.js'
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  loadRecent,
  saveRecent,
  clearRecent,
  addRecentMessage,
} from './lib/storage.js'
import HomeScreen from './components/HomeScreen.jsx'
import CategoryScreen from './components/CategoryScreen.jsx'
import RecentScreen from './components/RecentScreen.jsx'
import SettingsScreen from './components/SettingsScreen.jsx'
import MessageDisplay from './components/MessageDisplay.jsx'

function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function App() {
  const [settings, setSettings] = useState(() => loadSettings())
  const [recent, setRecent] = useState(() => loadRecent())
  const [screen, setScreen] = useState('home') // 'home' | 'category' | 'recent' | 'settings'
  const [message, setMessage] = useState(null)

  const allPhrases = useMemo(() => flattenVocabulary(vocabulary), [])
  const activeCategory = vocabulary.categories.find((c) => c.id === settings.lastCategoryId) || null

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
    document.documentElement.setAttribute('data-fontsize', settings.fontSize)
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    saveRecent(recent)
  }, [recent])

  const updateSettings = (patch) => setSettings((s) => ({ ...s, ...patch }))

  const showMessage = (text, { source = 'card', categoryId = null } = {}) => {
    setMessage(text)
    setRecent((list) =>
      addRecentMessage(list, {
        id: makeId(),
        text,
        source,
        categoryId,
        timestamp: new Date().toISOString(),
      }),
    )
  }

  const handleSelectCategory = (categoryId) => {
    updateSettings({ lastCategoryId: categoryId })
    setScreen('category')
  }

  const handlePickPhrase = (text) => {
    showMessage(text, { source: 'card', categoryId: activeCategory?.id ?? null })
  }

  const handleSendTyped = (text) => {
    showMessage(text, { source: 'text', categoryId: null })
  }

  const handlePickRecent = (entry) => {
    showMessage(entry.text, { source: entry.source, categoryId: entry.categoryId })
  }

  let body
  if (screen === 'category' && activeCategory) {
    body = (
      <CategoryScreen category={activeCategory} onBack={() => setScreen('home')} onPick={handlePickPhrase} />
    )
  } else if (screen === 'recent') {
    body = <RecentScreen recent={recent} onBack={() => setScreen('home')} onPick={handlePickRecent} />
  } else if (screen === 'settings') {
    body = (
      <SettingsScreen
        settings={settings}
        onChange={updateSettings}
        onClearRecent={() => {
          clearRecent()
          setRecent([])
        }}
        onBack={() => setScreen('home')}
      />
    )
  } else {
    body = (
      <HomeScreen
        mode={settings.lastMode}
        onModeChange={(mode) => updateSettings({ lastMode: mode })}
        categories={vocabulary.categories}
        allPhrases={allPhrases}
        recent={recent}
        onSelectCategory={handleSelectCategory}
        onOpenRecent={() => setScreen('recent')}
        onOpenSettings={() => setScreen('settings')}
        onSend={handleSendTyped}
      />
    )
  }

  return (
    <div className="app-root">
      {body}
      {message !== null && (
        <MessageDisplay
          text={message}
          onDismiss={() => {
            setMessage(null)
            setScreen('home')
          }}
        />
      )}
    </div>
  )
}
