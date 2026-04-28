import { useState } from 'react'
import type { Site } from '@/types'
import { getFaviconUrl } from '@/utils/favicon'
import { X, Edit2 } from 'lucide-react'

interface SiteCardProps {
  site: Site
  onDelete: (id: string) => void
  onEdit: (site: Site) => void
}

export function SiteCard({ site, onDelete, onEdit }: SiteCardProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    window.open(site.url, '_blank')
  }

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
      style={{
        background: hovered ? 'var(--color-panel)' : 'var(--color-card-bg)',
        border: `1px solid ${hovered ? 'var(--color-accent)' : 'var(--color-border)'}`,
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={getFaviconUrl(site.url, 16)}
        alt=""
        className="w-4 h-4 rounded-sm flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getFaviconUrl('https://example.com', 16)
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate" style={{ color: 'var(--color-text)' }}>
          {site.title}
        </div>
      </div>
      {hovered && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            className="p-1 rounded hover:bg-[var(--color-border)]"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(site)
            }}
          >
            <Edit2 size={12} style={{ color: 'var(--color-text-muted)' }} />
          </button>
          <button
            className="p-1 rounded hover:bg-[var(--color-border)]"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(site.id)
            }}
          >
            <X size={12} style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>
      )}
    </div>
  )
}
