import { useState, useCallback, useEffect } from 'react'
import type { Site, SiteGroup } from '@/types'
import { X } from 'lucide-react'
import { useI18n } from '@/i18n'

interface AddSiteModalProps {
  groups: SiteGroup[]
  onAdd: (site: { title: string; url: string; groupId: string }) => void
  onClose: () => void
  editingSite?: Site | null
  onEdit?: (id: string, updates: { title: string; url: string; groupId: string }) => void
}

export function AddSiteModal({ groups, onAdd, onClose, editingSite, onEdit }: AddSiteModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [groupId, setGroupId] = useState(groups[0]?.id ?? '')
  const { t } = useI18n()

  const isEditMode = !!editingSite && !!onEdit

  useEffect(() => {
    if (editingSite) {
      setTitle(editingSite.title)
      setUrl(editingSite.url)
      setGroupId(editingSite.groupId)
    } else {
      setTitle('')
      setUrl('')
      setGroupId(groups[0]?.id ?? '')
    }
  }, [editingSite, groups])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || !url.trim()) return
      let processedUrl = url.trim()
      if (!processedUrl.startsWith('http')) {
        processedUrl = 'https://' + processedUrl
      }
      if (isEditMode && editingSite) {
        onEdit!(editingSite.id, { title: title.trim(), url: processedUrl, groupId })
      } else {
        onAdd({ title: title.trim(), url: processedUrl, groupId })
      }
      onClose()
    },
    [title, url, groupId, onAdd, onEdit, onClose, isEditMode, editingSite]
  )

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.3)' }}
    >
      <div
        className="w-96 rounded-xl p-6"
        style={{
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            {isEditMode ? t('addSite.editTitle') : t('addSite.addTitle')}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-[var(--color-panel)]">
            <X size={16} style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
              {t('addSite.name')}
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg text-sm border"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
              placeholder={t('addSite.namePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
              {t('addSite.url')}
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg text-sm border"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
              {t('addSite.group')}
            </label>
            <select
              className="w-full px-3 py-2 rounded-lg text-sm border"
              style={{
                borderColor: 'var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
              }}
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg text-sm font-medium text-white mt-2"
            style={{
              background: 'var(--color-accent)',
            }}
          >
            {isEditMode ? t('addSite.save') : t('addSite.add')}
          </button>
        </form>
      </div>
    </div>
  )
}
