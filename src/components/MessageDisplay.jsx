export default function MessageDisplay({ text, onDismiss }) {
  return (
    <div
      className="message-overlay"
      onClick={onDismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onDismiss()
      }}
    >
      <div className="dismiss-hint">← 返回</div>
      <div className="message-text">{text}</div>
    </div>
  )
}
