import type { Photo } from '@/types'
import { X, Download, ArrowLeft } from 'lucide-react'

interface PhotoPreviewProps {
  photo: Photo
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function PhotoPreview({ photo, onClose, onPrev, onNext: _onNext }: PhotoPreviewProps) {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = photo.dataUrl ?? photo.thumbnail
    a.download = photo.name
    a.click()
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      {/* Navigation */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-white hover:bg-white/10"
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
      >
        <ArrowLeft size={24} />
      </button>

      {/* Image */}
      <img
        src={photo.dataUrl ?? photo.thumbnail}
        alt={photo.name}
        className="max-w-[85vw] max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Actions */}
      <div className="absolute right-4 top-4 flex gap-2">
        <button
          className="p-2 rounded-full text-white hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation()
            handleDownload()
          }}
        >
          <Download size={20} />
        </button>
        <button
          className="p-2 rounded-full text-white hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
