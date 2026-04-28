import { useState, useCallback } from 'react'
import { useTabStore } from './tabStore'
import { Plus, Folder } from 'lucide-react'
import { useI18n } from '@/i18n'

export function WorkspacePanel() {
  const { workspaces, activeWorkspaceId, setActiveWorkspace, addWorkspace } = useTabStore()
  const [showInput, setShowInput] = useState(false)
  const [name, setName] = useState('')
  const { t } = useI18n()

  const handleCreate = useCallback(() => {
    if (name.trim()) {
      addWorkspace(name.trim())
      setName('')
      setShowInput(false)
    }
  }, [name, addWorkspace])

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`px-2 py-1.5 rounded-md cursor-pointer text-sm ${
          activeWorkspaceId === 'all' ? 'font-medium' : ''
        }`}
        style={{
          background: activeWorkspaceId === 'all' ? 'var(--color-active-bg)' : 'transparent',
          color: activeWorkspaceId === 'all' ? 'var(--color-accent)' : 'var(--color-text)',
        }}
        onClick={() => setActiveWorkspace('all')}
      >
        <div className="flex items-center gap-2">
          <Folder size={14} />
          <span>{t('workspace.allTabs')}</span>
        </div>
      </div>

      {workspaces.map((w) => (
        <div
          key={w.id}
          className={`px-2 py-1.5 rounded-md cursor-pointer text-sm ${
            activeWorkspaceId === w.id ? 'font-medium' : ''
          }`}
          style={{
            background: activeWorkspaceId === w.id ? 'var(--color-active-bg)' : 'transparent',
            color: activeWorkspaceId === w.id ? 'var(--color-accent)' : 'var(--color-text)',
          }}
          onClick={() => setActiveWorkspace(w.id)}
        >
          <div className="flex items-center gap-2">
            <Folder size={14} />
            <span className="truncate flex-1">{w.name}</span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {w.tabIds.length}
            </span>
          </div>
        </div>
      ))}

      {showInput ? (
        <div className="flex gap-1 mt-1">
          <input
            className="flex-1 text-xs px-2 py-1 rounded border"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-card-bg)',
              color: 'var(--color-text)',
            }}
            placeholder={t('workspace.newName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <button
            className="text-xs px-2 py-1 rounded"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
            onClick={handleCreate}
          >
            {t('workspace.confirm')}
          </button>
        </div>
      ) : (
        <button
          className="flex items-center gap-1 mt-2 text-xs px-2 py-1.5 rounded border border-dashed"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
          onClick={() => setShowInput(true)}
        >
          <Plus size={12} />
          {t('workspace.new')}
        </button>
      )}
    </div>
  )
}
