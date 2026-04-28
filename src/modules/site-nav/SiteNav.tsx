import { useEffect, useState, useCallback } from 'react'
import { useSiteStore } from './siteStore'
import { SiteGroup } from './SiteGroup'
import { AddSiteModal } from './AddSiteModal'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Site } from '@/types'
import { useI18n } from '@/i18n'

const PAGE_SIZE = 12

export function SiteNav() {
  const {
    sites,
    groups,
    activeGroupId,
    setActiveGroup,
    loadSites,
    addSite,
    updateSite,
    deleteSite,
  } = useSiteStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const { t } = useI18n()

  useEffect(() => {
    loadSites()
  }, [loadSites])

  // Reset page when group or search changes
  useEffect(() => {
    setPage(1)
  }, [activeGroupId, searchQuery])

  const filteredSites = sites.filter((s) => {
    const matchesGroup = activeGroupId === 'all' || s.groupId === activeGroupId
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.url.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesGroup && matchesSearch
  })

  const totalPages = Math.ceil(filteredSites.length / PAGE_SIZE)
  const paginatedSites = filteredSites.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  const handleAdd = useCallback(
    (site: { title: string; url: string; groupId: string }) => {
      addSite(site)
    },
    [addSite]
  )

  const handleEdit = useCallback(
    (id: string, updates: { title: string; url: string; groupId: string }) => {
      updateSite(id, updates)
    },
    [updateSite]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteSite(id)
    },
    [deleteSite]
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          {t('siteNav.title')}
        </h2>
        <div className="flex-1 max-w-md relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            className="w-full pl-9 pr-8 py-2 rounded-lg text-sm border"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-card-bg)',
              color: 'var(--color-text)',
            }}
            placeholder={t('siteNav.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-white"
          style={{ background: 'var(--color-accent)' }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          {t('siteNav.addSite')}
        </button>
      </div>

      {/* Group filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            activeGroupId === 'all' ? 'font-medium' : ''
          }`}
          style={{
            background: activeGroupId === 'all' ? 'var(--color-accent)' : 'var(--color-panel)',
            color: activeGroupId === 'all' ? '#fff' : 'var(--color-text)',
          }}
          onClick={() => setActiveGroup('all')}
        >
          {t('siteNav.all')}
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              activeGroupId === g.id ? 'font-medium' : ''
            }`}
            style={{
              background: activeGroupId === g.id ? 'var(--color-accent)' : 'var(--color-panel)',
              color: activeGroupId === g.id ? '#fff' : 'var(--color-text)',
            }}
            onClick={() => setActiveGroup(g.id)}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Sites list */}
      <div className="flex-1 overflow-y-auto">
        {activeGroupId === 'all' ? (
          groups.map((group) => {
            const groupSites = paginatedSites.filter((s) => s.groupId === group.id)
            if (groupSites.length === 0) return null
            return (
              <SiteGroup
                key={group.id}
                group={group}
                sites={groupSites}
                onDeleteSite={handleDelete}
                onEditSite={setEditingSite}
              />
            )
          })
        ) : (
          <div>
            {(() => {
              const group = groups.find((g) => g.id === activeGroupId)
              if (!group) return null
              return (
                <SiteGroup
                  group={group}
                  sites={paginatedSites}
                  onDeleteSite={handleDelete}
                  onEditSite={setEditingSite}
                />
              )
            })()}
          </div>
        )}
        {filteredSites.length === 0 && (
          <div
            className="flex items-center justify-center h-40 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t('siteNav.noSites')}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4 py-2">
          <button
            className="p-1 rounded disabled:opacity-30"
            style={{ color: 'var(--color-text-muted)' }}
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {page} / {totalPages}
          </span>
          <button
            className="p-1 rounded disabled:opacity-30"
            style={{ color: 'var(--color-text-muted)' }}
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {showAddModal && (
        <AddSiteModal
          groups={groups}
          onAdd={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {editingSite && (
        <AddSiteModal
          groups={groups}
          onAdd={handleAdd}
          onClose={() => setEditingSite(null)}
          editingSite={editingSite}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}
