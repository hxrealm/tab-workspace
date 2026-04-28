import { useCallback } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import type { CacheClearOptions } from '@/types'
import { useI18n } from '@/i18n'
import type { Translations } from '@/i18n/translations'

const OPTIONS: { key: keyof CacheClearOptions; labelKey: keyof Translations }[] = [
  { key: 'cookies', labelKey: 'cache.cookies' },
  { key: 'localStorage', labelKey: 'cache.localStorage' },
  { key: 'sessionStorage', labelKey: 'cache.sessionStorage' },
  { key: 'indexedDB', labelKey: 'cache.indexedDB' },
  { key: 'cache', labelKey: 'cache.cache' },
  { key: 'cacheStorage', labelKey: 'cache.cacheStorage' },
  { key: 'serviceWorkers', labelKey: 'cache.serviceWorkers' },
]

export function CachePanel() {
  const { cacheOptions, updateSetting } = useSettingsStore()
  const { t } = useI18n()

  const handleToggle = useCallback(
    (key: keyof CacheClearOptions) => {
      updateSetting('cacheOptions', { ...cacheOptions, [key]: !cacheOptions[key] })
    },
    [cacheOptions, updateSetting]
  )

  return (
    <div className="text-sm space-y-4" style={{ color: 'var(--color-text)' }}>
      <div>
        <h4 className="font-medium mb-1">{t('cache.title')}</h4>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
          {t('cache.description')}
        </p>

        <div className="space-y-2">
          {OPTIONS.map(({ key, labelKey }) => (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer select-none"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--color-panel)',
              }}
            >
              <input
                type="checkbox"
                checked={cacheOptions[key]}
                onChange={() => handleToggle(key)}
                className="accent-[var(--color-accent)]"
              />
              <span>{t(labelKey)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
