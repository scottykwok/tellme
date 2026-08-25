export default function RecentScreen({ recent, onBack, onPick }) {
  return (
    <>
      <div className="screen-header">
        <button className="icon-btn" onClick={onBack} aria-label="返回">
          ←
        </button>
        <h1 className="screen-title">最近用過</h1>
      </div>
      {recent.length === 0 ? (
        <div className="empty-note">仲未有用過嘅字句</div>
      ) : (
        <div className="recent-list">
          {recent.map((m) => (
            <button key={m.id} className="recent-item" onClick={() => onPick(m)}>
              {m.text}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
