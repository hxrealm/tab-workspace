import { useCallback, useRef } from 'react'
import { Upload } from 'lucide-react'
import { useI18n } from '@/i18n'

interface PhotoUploadProps {
  onUpload: (files: File[]) => void
  albumId: string
}

export function PhotoUpload({ onUpload, albumId: _albumId }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useI18n()

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      )
      if (files.length > 0) onUpload(files)
    },
    [onUpload]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) onUpload(files)
    },
    [onUpload]
  )

  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors"
      style={{ borderColor: 'var(--color-border)' }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
    >
      <Upload size={32} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} />
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {t('photos.uploadDrop')}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
