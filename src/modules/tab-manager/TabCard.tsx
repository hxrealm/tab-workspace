import { useCallback, useState } from 'react'
import type { TabInfo } from '@/types'
import { getFaviconUrl } from '@/utils/favicon'
import { X, Bookmark, Eraser, ArrowRight } from 'lucide-react'
import { useToastStore } from '@/components/Toast'
import { useSettingsStore } from '@/store/settingsStore'
import { isExtensionApiAvailable } from '@/utils/browser'
import { useI18n } from '@/i18n'

interface TabCardProps {
  tab: TabInfo
  selected: boolean
  pinned: boolean
  onSelect: (id: number) => void
  onClose: (id: number) => void
  onActivate: (id: number) => void
  onTogglePinned: (id: number) => void
}

function getSiteOrigin(url: string): string | null {
  try {
    const { origin } = new URL(url)
    return origin
  } catch {
    return null
  }
}

async function clearSiteCache(origin: string): Promise<void> {
  if (!isExtensionApiAvailable()) {
    throw new Error('Extension API not available')
  }

  const { cacheOptions } = useSettingsStore.getState()
  const { cookies, localStorage: ls, sessionStorage: ss, cache, cacheStorage, indexedDB: idbEnabled, serviceWorkers } = cacheOptions

  if (cookies) {
    try {
      const { hostname } = new URL(origin)
      await chrome.cookies.getAll({ domain: hostname }).then(async (cookieList) => {
        for (const c of cookieList) {
          const url = `http${c.secure ? 's' : ''}://${c.domain}${c.path}`
          await chrome.cookies.remove({ url, name: c.name, storeId: c.storeId })
        }
      })
    } catch {
      // skip
    }
  }

  if (ls) {
    try {
      const [tab] = await chrome.tabs.query({ url: `${origin}/*`, active: false })
      if (tab && tab.id) {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => localStorage.clear() })
      }
    } catch {
      // skip
    }
  }

  if (ss) {
    try {
      const [tab] = await chrome.tabs.query({ url: `${origin}/*`, active: false })
      if (tab && tab.id) {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => sessionStorage.clear() })
      }
    } catch {
      // skip
    }
  }

  if (idbEnabled) {
    try {
      const [tab] = await chrome.tabs.query({ url: `${origin}/*`, active: false })
      if (tab && tab.id) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: async () => {
            const idb = indexedDB as IDBFactory & { databases?: () => Promise<IDBDatabaseInfo[]> }
            if (idb.databases) {
              for (const db of await idb.databases()) {
                if (db.name) idb.deleteDatabase(db.name)
              }
            }
          },
        })
      }
    } catch {
      // skip
    }
  }

  if (cache || cacheStorage || serviceWorkers) {
    await chrome.browsingData.remove(
      { since: 0, origins: [origin] },
      { appcache: false, cache, cacheStorage, serviceWorkers, cookies: false, fileSystems: false, indexedDB: false, localStorage: false, webSQL: false }
    )
  }
}

export function TabCard({ tab, selected, pinned, onSelect, onClose, onActivate, onTogglePinned }: TabCardProps) {
  const [hovered, setHovered] = useState(false)
  const [clearing, setClearing] = useState(false)
  const { showToast } = useToastStore()
  const { t } = useI18n()

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onSelect(tab.id)
    },
    [tab.id, onSelect]
  )

  const handleClearCache = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation()
      const origin = getSiteOrigin(tab.url)
      if (!origin) {
        showToast(t('tabCard.cacheNoAddress'), 'error')
        return
      }
      setClearing(true)
      try {
        await clearSiteCache(origin)
        showToast(t('tabCard.cacheCleared'), 'success')
      } catch (err) {
        console.error('Failed to clear site cache:', err)
        showToast(t('tabCard.cacheFailed'), 'error')
      } finally {
        setClearing(false)
      }
    },
    [tab.url, showToast, t]
  )

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 group"
      style={{
        background: selected
          ? 'var(--color-active-bg)'
          : hovered
            ? 'var(--color-card-bg)'
            : 'transparent',
        border: selected
          ? '1px solid var(--color-accent)'
          : hovered
            ? '1px solid var(--color-border)'
            : '1px solid transparent',
        boxShadow: hovered && !selected ? 'var(--shadow-sm)' : 'none',
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Selection indicator */}
      {selected && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ background: 'var(--color-accent)' }}
        />
      )}

      {/* Favicon */}
      <img
        src={tab.favIconUrl || getFaviconUrl(tab.url, 16)}
        alt=""
        className="w-4 h-4 rounded-sm flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getFaviconUrl('https://example.com', 16)
        }}
      />

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate" style={{ color: 'var(--color-text)' }}>
          {tab.title}
        </div>
        <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
          {(() => {
            try { return new URL(tab.url).hostname } catch { return tab.url }
          })()}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          title="Open tab"
          className="p-1 rounded-lg hover:bg-[var(--color-border)]"
          onClick={(e) => { e.stopPropagation(); onActivate(tab.id) }}
        >
          <ArrowRight size={14} style={{ color: 'var(--color-accent)' }} />
        </button>
        <button
          title={pinned ? t('tabCard.removeLater') : t('tabCard.saveForLater')}
          className="p-1 rounded-lg hover:bg-[var(--color-border)]"
          onClick={(e) => { e.stopPropagation(); onTogglePinned(tab.id) }}
        >
          <Bookmark size={14} fill={pinned ? 'var(--color-accent)' : 'none'} style={{ color: pinned ? 'var(--color-accent)' : 'var(--color-text-muted)' }} />
        </button>
        <button
          title={t('tabCard.clearCache')}
          className="p-1 rounded-lg hover:bg-[var(--color-border)] disabled:opacity-30"
          disabled={clearing}
          onClick={handleClearCache}
        >
          <Eraser size={14} style={{ color: 'var(--color-text-muted)' }} />
        </button>
        <button
          title={t('tabCard.close')}
          className="p-1 rounded-lg hover:bg-[var(--color-border)]"
          onClick={(e) => { e.stopPropagation(); onClose(tab.id) }}
        >
          <X size={14} style={{ color: 'var(--color-text-muted)' }} />
        </button>
      </div>
    </div>
  )
}
