import type { Site, SiteGroup as SiteGroupType } from '@/types'
import { SiteCard } from './SiteCard'

interface SiteGroupProps {
  group: SiteGroupType
  sites: Site[]
  onDeleteSite: (id: string) => void
  onEditSite: (site: Site) => void
}

export function SiteGroup({ group, sites, onDeleteSite, onEditSite }: SiteGroupProps) {
  const sortedSites = [...sites].sort((a, b) => a.order - b.order)

  return (
    <div className="mb-4">
      <h4
        className="text-sm font-medium mb-2"
        style={{ color: 'var(--color-text)' }}
      >
        {group.name}
        <span
          className="ml-1 text-xs font-normal"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ({sites.length})
        </span>
      </h4>
      <div className="flex flex-col gap-1">
        {sortedSites.map((site) => (
          <SiteCard
            key={site.id}
            site={site}
            onDelete={onDeleteSite}
            onEdit={onEditSite}
          />
        ))}
      </div>
    </div>
  )
}
