import TextPanel from './TextPanel.jsx'

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
            className={mode === 'card' ? 'active' : ''}
            onClick={() => onModeChange('card')}
            aria-pressed={mode === 'card'}
          >
            揀字
          </button>
          <button
            className={mode === 'text' ? 'active' : ''}
            onClick={() => onModeChange('text')}
            aria-pressed={mode === 'text'}
          >
            打字
          </button>
        </div>
        <button className="icon-btn" onClick={onOpenRecent} aria-label="最近用過">
          🕘
        </button>
        <button className="icon-btn settings-btn" onClick={onOpenSettings} aria-label="設定">
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
              <span className="cat-label">{cat.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <TextPanel allPhrases={allPhrases} recent={recent} onSend={onSend} />
      )}
    </>
  )
}
