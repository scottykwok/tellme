import { useEffect, useRef, useState } from 'react'
import { predictPhrases } from '../lib/predict.js'

export default function TextPanel({ allPhrases, recent, onSend }) {
  const [query, setQuery] = useState('')
  const textareaRef = useRef(null)

  const suggestions = predictPhrases(query, allPhrases, recent, 8)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  const submitTyped = () => {
    const text = query.trim()
    if (!text) return
    onSend(text)
    setQuery('')
  }

  const clearTyped = () => {
    setQuery('')
    textareaRef.current?.focus()
  }

  return (
    <div className="text-panel">
      <div className="text-input-row">
        <textarea
          ref={textareaRef}
          className="big-input"
          rows={3}
          placeholder="（輸入）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submitTyped()
            }
          }}
        />
        <div className="text-input-actions">
          <button className="clear-btn" onClick={clearTyped} disabled={!query}>
            清除
          </button>
          <button className="send-btn" onClick={submitTyped} disabled={!query.trim()}>
            顯示
          </button>
        </div>
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
    </div>
  )
}
