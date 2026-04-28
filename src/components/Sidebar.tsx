import { useCallback } from 'react'
import { useUiStore } from '@/store/uiStore'
import type { ModuleId } from '@/types'
import { useI18n } from '@/i18n'
import {
  LayoutGrid,
  Globe,
  Music,
  Image,
  Settings,
} from 'lucide-react'

export function Sidebar() {
  const { currentModule, setModule } = useUiStore()
  const { t } = useI18n()

  const MODULES = [
    { id: 'tabs' as ModuleId, icon: LayoutGrid, label: t('sidebar.tabs') },
    { id: 'sites' as ModuleId, icon: Globe, label: t('sidebar.sites') },
    { id: 'music' as ModuleId, icon: Music, label: t('sidebar.music') },
    { id: 'photos' as ModuleId, icon: Image, label: t('sidebar.photos') },
  ]

  const handleNav = useCallback(
    (id: ModuleId) => {
      setModule(id)
    },
    [setModule]
  )

  return (
    <div
      className="h-full flex flex-col items-center py-4 gap-2"
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--color-sidebar)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Module Icons */}
      {MODULES.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => handleNav(id)}
          title={label}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background:
              currentModule === id
                ? 'var(--color-active-bg)'
                : 'transparent',
            border:
              currentModule === id
                ? '2px solid var(--color-accent)'
                : '2px solid transparent',
            color:
              currentModule === id
                ? 'var(--color-accent)'
                : 'var(--color-text-muted)',
          }}
        >
          <Icon size={18} strokeWidth={1.8} />
        </button>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings at bottom */}
      <button
        onClick={() => handleNav('settings')}
        title={t('sidebar.settings')}
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
        style={{
          background:
            currentModule === 'settings'
              ? 'var(--color-active-bg)'
              : 'transparent',
          border:
            currentModule === 'settings'
              ? '2px solid var(--color-accent)'
              : '2px solid transparent',
          color:
            currentModule === 'settings'
              ? 'var(--color-accent)'
              : 'var(--color-text-muted)',
        }}
      >
        <Settings size={18} strokeWidth={1.8} />
      </button>
    </div>
  )
}
