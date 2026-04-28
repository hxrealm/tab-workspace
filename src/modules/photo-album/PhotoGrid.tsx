import type { Photo } from '@/types'
import { useI18n } from '@/i18n'

interface PhotoGridProps {
  photos: Photo[]
  onPreview: (photo: Photo) => void
  onDelete: (id: string) => void
}

export function PhotoGrid({ photos, onPreview, onDelete }: PhotoGridProps) {
  const { t } = useI18n()

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer border"
          style={{ borderColor: 'var(--color-border)' }}
          onClick={() => onPreview(photo)}
        >
          <img
            src={photo.thumbnail}
            alt={photo.name}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-end">
            <div className="w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
              <span className="text-xs text-white truncate">{photo.name}</span>
              <button
                className="text-xs text-white hover:text-red-400"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(photo.id)
                }}
              >
                {t('photos.delete')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
