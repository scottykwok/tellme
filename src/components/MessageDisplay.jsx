import { useLayoutEffect, useRef } from 'react'

export default function MessageDisplay({ text, onDismiss }) {
  const overlayRef = useRef(null)
  const textRef = useRef(null)

  useLayoutEffect(() => {
    const el = textRef.current
    const overlay = overlayRef.current
    if (!el || !overlay) return

    const fit = () => {
      const style = getComputedStyle(overlay)
      const paddingTop = parseFloat(style.paddingTop) || 0
      const paddingBottom = parseFloat(style.paddingBottom) || 0
      const availableHeight = window.innerHeight - paddingTop - paddingBottom
      const targetHeight = availableHeight * 0.7
      let low = 16
      let high = 400
      for (let i = 0; i < 18; i++) {
        const mid = (low + high) / 2
        el.style.fontSize = `${mid}px`
        if (el.scrollHeight <= targetHeight) {
          low = mid
        } else {
          high = mid
        }
      }
      el.style.fontSize = `${low}px`
    }

    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [text])

  return (
    <div
      className="message-overlay"
      ref={overlayRef}
      onClick={onDismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onDismiss()
      }}
    >
      <div className="dismiss-hint">← 返回</div>
      <div className="message-text" ref={textRef}>
        {text}
      </div>
    </div>
  )
}
