import { useState } from 'react'
import { FONT_SIZES, THEMES } from '../lib/storage.js'

const FONT_LABELS = { large: '大', xlarge: '較大', xxlarge: '更大', xxxlarge: '特大', xxxxlarge: '最大' }
const THEME_LABELS = { light: '淺色', dark: '深色', highContrast: '高對比' }

export default function SettingsScreen({ settings, onChange, onClearRecent, onBack }) {
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClearClick = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
      return
    }
    onClearRecent()
    setConfirmClear(false)
  }

  return (
    <>
      <div className="screen-header">
        <button className="icon-btn" onClick={onBack} aria-label="返回">
          ←
        </button>
        <h1 className="screen-title">設定</h1>
      </div>

      <div className="settings-screen">
        <div className="settings-row">
          <span className="settings-label">字體大小</span>
          <div className="segmented">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                className={settings.fontSize === size ? 'active' : ''}
                onClick={() => onChange({ fontSize: size })}
              >
                {FONT_LABELS[size]}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-row">
          <span className="settings-label">主題色調</span>
          <div className="segmented">
            {THEMES.map((theme) => (
              <button
                key={theme}
                className={settings.theme === theme ? 'active' : ''}
                onClick={() => onChange({ theme })}
              >
                {THEME_LABELS[theme]}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-row">
          <span className="settings-label">最近用過的字句</span>
          <button className="danger-btn" onClick={handleClearClick}>
            {confirmClear ? '再撳一次確認清除' : '清除全部'}
          </button>
        </div>

        <p className="settings-note">
          呢個 App 而家淨係將設定同最近用過嘅字句存喺呢部裝置嘅瀏覽器入面，唔會上傳去任何伺服器。
          如果清除瀏覽器資料、換機或者解除安裝，呢啲記錄會跟住不見晒。
        </p>
      </div>
    </>
  )
}
