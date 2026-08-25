export default function CategoryScreen({ category, onBack, onPick }) {
  return (
    <>
      <div className="screen-header">
        <button className="icon-btn" onClick={onBack} aria-label="返回">
          ←
        </button>
        <h1 className="screen-title">
          {category.icon} {category.label}
        </h1>
      </div>
      <div className="phrase-grid">
        {category.phrases.map((phrase) => (
          <button key={phrase} className="phrase-card" onClick={() => onPick(phrase)}>
            {phrase}
          </button>
        ))}
      </div>
    </>
  )
}
