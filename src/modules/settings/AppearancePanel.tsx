import { useCallback } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { useI18n } from '@/i18n'

const PRESET_COLORS = [
  '#e8a87c', // warm orange
  '#667eea', // blue
  '#27ae60', // green
  '#e74c3c', // red
  '#8e44ad', // purple
]

export function AppearancePanel() {
  const { theme, updateSetting } = useSettingsStore()
  const { t } = useI18n()

  const handleColorChange = useCallback(
    (color: string) => {
      updateSetting('theme', { ...theme, primaryColor: color })
      document.documentElement.style.setProperty('--color-accent', color)
    },
    [theme, updateSetting]
  )

  const handleFontSizeChange = useCallback(
    (size: 'small' | 'medium' | 'large') => {
      updateSetting('theme', { ...theme, fontSize: size })
      const sizes = { small: '14px', medium: '16px', large: '18px' }
      document.documentElement.style.fontSize = sizes[size]
    },
    [theme, updateSetting]
  )

  return (
    <div className="space-y-6">
      {/* Theme color */}
      <div>
        <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
        {t('appearance.color')}
        </h4>
        <div className="flex gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                background: color,
                borderColor: theme.primaryColor === color ? color : 'transparent',
              }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </div>
      </div>

      {/* Font size */}
      <div>
        <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
        {t('appearance.fontSize')}
        </h4>
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              className={`px-4 py-2 rounded-lg text-sm ${
                theme.fontSize === size ? 'font-medium' : ''
              }`}
              style={{
                background:
                  theme.fontSize === size
                    ? 'var(--color-accent)'
                    : 'var(--color-panel)',
                color: theme.fontSize === size ? '#fff' : 'var(--color-text)',
              }}
              onClick={() => handleFontSizeChange(size)}
            >
              {size === 'small' ? t('appearance.small') : size === 'medium' ? t('appearance.medium') : t('appearance.large')}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
