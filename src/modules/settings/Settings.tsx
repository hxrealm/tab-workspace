import { useState } from 'react'
import { AppearancePanel } from './AppearancePanel'
import { DataPanel } from './DataPanel'
import { CachePanel } from './CachePanel'
import { useI18n } from '@/i18n'

type SettingsTab = 'appearance' | 'data' | 'cache' | 'about'

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance')
  const { t, locale, changeLocale, LOCALE_NAMES } = useI18n()

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'appearance', label: t('settings.appearance') },
    { id: 'data', label: t('settings.data') },
    { id: 'cache', label: t('settings.cache') },
    { id: 'about', label: t('settings.about') },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header with language selector */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          {t('settings.title')}
        </h2>
        <select
          className="px-2 py-1 rounded-lg text-sm border"
          style={{
            borderColor: 'var(--color-border)',
            background: 'var(--color-card-bg)',
            color: 'var(--color-text)',
          }}
          value={locale}
          onChange={(e) => changeLocale(e.target.value as 'en' | 'zh-CN' | 'zh-TW')}
        >
          {Object.entries(LOCALE_NAMES).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === tab.id ? 'font-medium' : ''
            }`}
            style={{
              background: activeTab === tab.id ? 'var(--color-accent)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text-muted)',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto max-w-lg">
        {activeTab === 'appearance' && <AppearancePanel />}
        {activeTab === 'data' && <DataPanel />}
        {activeTab === 'cache' && <CachePanel />}
        {activeTab === 'about' && <AboutPanel />}
      </div>
    </div>
  )
}

function AboutPanel() {
  const { t } = useI18n()

  return (
    <div className="text-sm space-y-3" style={{ color: 'var(--color-text)' }}>
      <p>
        <strong>Tab Workspace</strong> {t('about.version')}
      </p>
      <p style={{ color: 'var(--color-text-muted)' }}>
        {t('about.description')}
      </p>
      <p>
        {t('about.browsers')}
      </p>
    </div>
  )
}
