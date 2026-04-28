import { useMemo, useState, useCallback, useEffect } from 'react'
import { useTabStore } from './tabStore'
import { useTabs } from './useTabs'
import { TabCard } from './TabCard'
import { Search, XCircle, CheckSquare, Square } from 'lucide-react'
import { useToastStore } from '@/components/Toast'
import { useI18n } from '@/i18n'

export function TabManager() {
  const { tabs, activeWorkspaceId, selectedTabIds, selectTab, selectAll, clearSelection, pinnedTabIds, togglePinnedTab, loadPinnedTabs } = useTabStore()
  const { closeTab, closeTabs, activateTab } = useTabs()
  const { showToast } = useToastStore()
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadPinnedTabs()
  }, [loadPinnedTabs])

  const searchFilteredTabs = useMemo(() => {
    if (!searchQuery) return tabs
    const q = searchQuery.toLowerCase()
    return tabs.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.url.toLowerCase().includes(q)
    )
  }, [tabs, searchQuery])

  // Pinned tabs are excluded from the "all" column
  const pinnedList = searchFilteredTabs.filter((t) => pinnedTabIds.has(t.id))
  const allTabs = searchFilteredTabs.filter((t) => !pinnedTabIds.has(t.id))

  const handleSearchClear = useCallback(() => {
    setSearchQuery('')
  }, [])

  const handleTogglePinned = useCallback(
    (id: number) => {
      togglePinnedTab(id)
      const isPinned = pinnedTabIds.has(id)
      showToast(isPinned ? t('tabManager.unpinnedSuccess') : t('tabManager.pinnedSuccess'), 'success')
    },
    [togglePinnedTab, pinnedTabIds, showToast]
  )

  const handleCloseSelected = useCallback(async () => {
    for (const id of Array.from(selectedTabIds)) {
      const tab = tabs.find((t) => t.id === id)
      if (tab) {
        const { addClosedTab, removePinnedTabIds } = useTabStore.getState()
        addClosedTab(tab)
        removePinnedTabIds([id])
      }
    }
    await chrome.tabs.remove(Array.from(selectedTabIds))
    clearSelection()
  }, [selectedTabIds, tabs, clearSelection])

  const handleOpenSelected = useCallback(async () => {
    for (const id of Array.from(selectedTabIds)) {
      await chrome.tabs.update(id, { active: false })
    }
    clearSelection()
  }, [selectedTabIds, clearSelection])

  const handleOpenAll = useCallback(async () => {
    for (const tab of allTabs) {
      await chrome.tabs.update(tab.id, { active: false })
    }
  }, [allTabs])

  const handleCloseAll = useCallback(async () => {
    const tabsToClose = allTabs.map((t) => t.id)
    for (const tab of allTabs) {
      const { addClosedTab, removePinnedTabIds } = useTabStore.getState()
      addClosedTab(tab)
      removePinnedTabIds([tab.id])
    }
    await chrome.tabs.remove(tabsToClose)
  }, [allTabs])

  return (
    <div className="h-full flex flex-col">
      {/* Header: title + search */}
      <div className="flex items-center justify-between mb-4 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
            {t('tabManager.title')}
          </h2>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: 'var(--color-active-bg)',
              color: 'var(--color-accent)',
            }}
          >
            {tabs.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            className="w-full pl-9 pr-8 py-2 rounded-xl text-sm border transition-colors focus:outline-none"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-card-bg)',
              color: 'var(--color-text)',
            }}
            placeholder={t('tabManager.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
              style={{ color: 'var(--color-text-muted)' }}
              onClick={handleSearchClear}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between mb-3">
        {/* Selected count - left */}
        {selectedTabIds.size > 0 && (
          <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
            {t('tabActions.selected', { count: selectedTabIds.size })}
          </span>
        )}
        <div className="flex-1" />

        {/* Action buttons - right */}
        <div className="flex items-center gap-4">
          {selectedTabIds.size > 0 && (
            <>
              <button
                className="text-xs font-medium hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-accent)' }}
                onClick={handleOpenSelected}
              >
                {t('tabActions.openBatch')}
              </button>
              <button
                className="text-xs font-medium hover:opacity-70 transition-opacity"
                style={{ color: '#e74c3c' }}
                onClick={handleCloseSelected}
              >
                {t('tabActions.closeBatch')}
              </button>
            </>
          )}
          {allTabs.length > 0 && (
            <>
              <button
                className="text-xs font-medium hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-accent)' }}
                onClick={handleOpenAll}
              >
                {t('tabActions.openAll')}
              </button>
              <button
                className="text-xs font-medium hover:opacity-70 transition-opacity"
                style={{ color: '#e74c3c' }}
                onClick={async () => {
                  if (confirm(t('tabManager.confirmCloseAll', { count: allTabs.length }))) {
                    await handleCloseAll()
                  }
                }}
              >
                {t('tabActions.closeAll')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left: All tabs */}
        <div className="flex-1 flex flex-col overflow-hidden rounded-xl" style={{ background: 'var(--color-panel)' }}>
          {/* Column header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {t('tabManager.all')}
              </h3>
              <span
                className="px-1.5 py-0.5 rounded-md text-xs font-medium"
                style={{
                  background: 'var(--color-active-bg)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {allTabs.length}
              </span>
            </div>
            {allTabs.length > 0 && (
              <button
                className="p-1 rounded-lg hover:bg-[var(--color-border)] transition-colors"
                onClick={() => {
                  if (selectedTabIds.size === allTabs.length) {
                    clearSelection()
                  } else {
                    selectAll(allTabs.map((t) => t.id))
                  }
                }}
              >
                {selectedTabIds.size === allTabs.length ? (
                  <CheckSquare size={16} style={{ color: 'var(--color-accent)' }} />
                ) : (
                  <Square size={16} style={{ color: 'var(--color-text-muted)' }} />
                )}
              </button>
            )}
          </div>
          {/* Tab list */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1.5">
              {allTabs.map((tab) => (
                <TabCard
                  key={tab.id}
                  tab={tab}
                  selected={selectedTabIds.has(tab.id)}
                  pinned={pinnedTabIds.has(tab.id)}
                  onSelect={selectTab}
                  onClose={closeTab}
                  onActivate={activateTab}
                  onTogglePinned={handleTogglePinned}
                />
              ))}
            </div>
            {allTabs.length === 0 && (
              <div
                className="flex items-center justify-center h-32 text-sm"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {searchQuery ? t('tabManager.noResults') : t('tabManager.noTabs')}
              </div>
            )}
          </div>
        </div>

        {/* Right: Pinned / Save for later */}
        <div
          className="w-72 flex-shrink-0 flex flex-col overflow-hidden rounded-xl"
          style={{ background: 'var(--color-panel)' }}
        >
          {/* Column header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {t('tabManager.pinned')}
              </h3>
              <span
                className="px-1.5 py-0.5 rounded-md text-xs font-medium"
                style={{
                  background: 'var(--color-active-bg)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {pinnedList.length}
              </span>
            </div>
            {pinnedList.length > 0 && (
              <button
                className="p-1 rounded-lg hover:bg-[var(--color-border)] transition-colors"
                onClick={() => {
                  const pinnedIds = pinnedList.map((t) => t.id)
                  const allPinnedSelected = pinnedIds.every((id) => selectedTabIds.has(id))
                  if (allPinnedSelected) {
                    clearSelection()
                  } else {
                    selectAll(pinnedIds)
                  }
                }}
              >
                {(() => {
                  const pinnedIds = pinnedList.map((t) => t.id)
                  const allPinnedSelected = pinnedIds.every((id) => selectedTabIds.has(id))
                  return allPinnedSelected ? (
                    <CheckSquare size={16} style={{ color: 'var(--color-accent)' }} />
                  ) : (
                    <Square size={16} style={{ color: 'var(--color-text-muted)' }} />
                  )
                })()}
              </button>
            )}
          </div>
          {/* Tab list */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1.5">
              {pinnedList.map((tab) => (
                <TabCard
                  key={tab.id}
                  tab={tab}
                  selected={selectedTabIds.has(tab.id)}
                  pinned={pinnedTabIds.has(tab.id)}
                  onSelect={selectTab}
                  onClose={closeTab}
                  onActivate={activateTab}
                  onTogglePinned={handleTogglePinned}
                />
              ))}
            </div>
            {pinnedList.length === 0 && (
              <div className="flex items-center justify-center h-32 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {searchQuery ? t('tabManager.noResults') : t('tabManager.noPinned')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
