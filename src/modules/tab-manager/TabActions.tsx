import { useCallback } from 'react'
import { useTabStore } from './tabStore'
import { useTabs } from './useTabs'
import { useI18n } from '@/i18n'

export function TabActions() {
  const { selectedTabIds, clearSelection } = useTabStore()
  const { closeTabs } = useTabs()
  const { t } = useI18n()

  const count = selectedTabIds.size

  const handleCloseSelected = useCallback(async () => {
    await closeTabs(Array.from(selectedTabIds))
    clearSelection()
  }, [selectedTabIds, closeTabs, clearSelection])

  if (count === 0) return null

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
      style={{
        background: 'var(--color-active-bg)',
        border: '1px solid var(--color-accent)',
      }}
    >
      <span className="text-sm" style={{ color: 'var(--color-accent)' }}>
        {t('tabActions.selected', { count })}
      </span>
      <div className="flex gap-2 ml-auto">
        <button
          className="text-xs px-3 py-1 rounded"
          style={{
            background: '#e74c3c',
            color: '#fff',
          }}
          onClick={handleCloseSelected}
        >
          {t('tabActions.closeBatch')}
        </button>
      </div>
    </div>
  )
}
