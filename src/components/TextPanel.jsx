import { useState } from 'react'
import { predictPhrases } from '../lib/predict.js'

export default function TextPanel({ allPhrases, recent, onSend }) {
  const [query, setQuery] = useState('')

  const suggestions = predictPhrases(query, allPhrases, recent, 8)

  const submitTyped = () => {
    const text = query.trim()
    if (!text) return
    onSend(text)
    setQuery('')
  }

  return (
    <div className="text-panel">
      <div className="text-input-row">
        <input
          className="big-input"
          type="text"
          inputMode="text"
          placeholder="喺呢度打字（可用手寫輸入）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitTyped()
          }}
        />
        <button className="send-btn" onClick={submitTyped} disabled={!query.trim()}>
          顯示
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="panel-section">
          <h2>建議</h2>
          <div className="chip-list">
            {suggestions.map((s) => (
              <button key={s.text} className="chip" onClick={() => onSend(s.text)}>
                {s.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="panel-section">
        <h2>最近用過</h2>
        {recent.length === 0 ? (
          <div className="empty-note">仲未有用過嘅字句</div>
        ) : (
          <div className="chip-list">
            {recent.map((m) => (
              <button key={m.id} className="chip" onClick={() => onSend(m.text)}>
                {m.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
