import TextPanel from './TextPanel.jsx'
import { fitFontSize } from '../lib/textFit.js'

export default function HomeScreen({
  mode,
  onModeChange,
  categories,
  allPhrases,
  recent,
  onSelectCategory,
  onOpenRecent,
  onOpenSettings,
  onSend,
}) {
  return (
    <>
      <div className="topbar">
        <div className="mode-toggle" role="tablist" aria-label="輸入模式">
          <button
            className={`icon-btn mode-btn${mode === 'card' ? ' active' : ''}`}
            onClick={() => onModeChange('card')}
            aria-pressed={mode === 'card'}
            aria-label="揀字"
          >
            選🔍
          </button>
          <button
            className={`icon-btn mode-btn${mode === 'text' ? ' active' : ''}`}
            onClick={() => onModeChange('text')}
            aria-pressed={mode === 'text'}
            aria-label="打字"
          >
            寫✍️
          </button>
        </div>
        <button className="icon-btn" onClick={onOpenRecent} aria-label="最近用過">
          🕘
        </button>
        <button className="icon-btn" onClick={onOpenSettings} aria-label="設定">
          ⚙
        </button>
      </div>

      {mode === 'card' ? (
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn accent-${cat.accent}${cat.id === 'emergency' ? ' emergency' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-label" style={{ fontSize: fitFontSize(cat.label) }}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <TextPanel allPhrases={allPhrases} recent={recent} onSend={onSend} />
      )}
    </>
  )
}
