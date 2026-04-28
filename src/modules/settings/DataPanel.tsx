import { useCallback } from 'react'
import { useToastStore } from '@/components/Toast'
import { useI18n } from '@/i18n'

export function DataPanel() {
  const { showToast } = useToastStore()
  const { t } = useI18n()

  const handleExport = useCallback(async () => {
    const data = {
      settings: localStorage.getItem('ai-tab-settings'),
      sites: localStorage.getItem('ai-tab-sites'),
      groups: localStorage.getItem('ai-tab-site-groups'),
      albums: localStorage.getItem('ai-tab-albums'),
      photosMeta: localStorage.getItem('ai-tab-photos-meta'),
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-tab-workspace-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast(t('data.exportSuccess'), 'success')
  }, [showToast])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      try {
        const data = JSON.parse(text)
        if (data.settings) localStorage.setItem('ai-tab-settings', data.settings)
        if (data.sites) localStorage.setItem('ai-tab-sites', data.sites)
        if (data.groups) localStorage.setItem('ai-tab-site-groups', data.groups)
        if (data.albums) localStorage.setItem('ai-tab-albums', data.albums)
        if (data.photosMeta) localStorage.setItem('ai-tab-photos-meta', data.photosMeta)
        showToast(t('data.importSuccess'), 'success')
      } catch {
        showToast(t('data.importError'), 'error')
      }
    }
    input.click()
  }, [showToast])

  const handleClearAll = useCallback(() => {
    if (confirm(t('data.confirmClear'))) {
      localStorage.clear()
      showToast(t('data.clearSuccess'), 'success')
    }
  }, [showToast])

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          {t('data.exportTitle')}
        </h4>
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
          {t('data.exportDesc')}
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm text-white"
          style={{ background: 'var(--color-accent)' }}
          onClick={handleExport}
        >
          {t('data.exportBtn')}
        </button>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
          {t('data.importTitle')}
        </h4>
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
          {t('data.importDesc')}
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm text-white"
          style={{ background: 'var(--color-text)' }}
          onClick={handleImport}
        >
          {t('data.importBtn')}
        </button>
      </div>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <h4 className="text-sm font-medium mb-2 text-red-600">
          {t('data.dangerTitle')}
        </h4>
        <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
          {t('data.dangerDesc')}
        </p>
        <button
          className="px-4 py-2 rounded-lg text-sm text-white bg-red-500 hover:bg-red-600"
          onClick={handleClearAll}
        >
          {t('data.clearAll')}
        </button>
      </div>
    </div>
  )
}
