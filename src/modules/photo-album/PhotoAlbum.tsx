import { useEffect, useCallback, useState } from 'react'
import { usePhotoStore } from './photoStore'
import { PhotoGrid } from './PhotoGrid'
import { PhotoPreview } from './PhotoPreview'
import { PhotoUpload } from './PhotoUpload'
import { useI18n } from '@/i18n'

const ALBUM_I18N_KEY: Record<string, string> = {
  all: 'photos.album.all',
  travel: 'photos.album.travel',
  work: 'photos.album.work',
  life: 'photos.album.life',
}

export function PhotoAlbum() {
  const {
    albums,
    photos,
    activeAlbumId,
    previewPhoto,
    loadPhotos,
    addPhoto,
    deletePhoto,
    setActiveAlbum,
    setPreviewPhoto,
  } = usePhotoStore()
  const [showUpload, setShowUpload] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  const filteredPhotos =
    activeAlbumId === 'all'
      ? photos
      : photos.filter((p) => p.albumId === activeAlbumId)

  const handleUpload = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        await addPhoto({
          albumId: activeAlbumId === 'all' ? 'life' : activeAlbumId,
          name: file.name,
          thumbnail: dataUrl,
          dataUrl,
        })
      }
      setShowUpload(false)
    },
    [addPhoto, activeAlbumId]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deletePhoto(id)
    },
    [deletePhoto]
  )

  const previewIndex = previewPhoto
    ? filteredPhotos.findIndex((p) => p.id === previewPhoto.id)
    : -1

  const handlePrev = useCallback(() => {
    if (previewIndex > 0) {
      setPreviewPhoto(filteredPhotos[previewIndex - 1])
    }
  }, [previewIndex, filteredPhotos, setPreviewPhoto])

  const handleNext = useCallback(() => {
    if (previewIndex < filteredPhotos.length - 1) {
      setPreviewPhoto(filteredPhotos[previewIndex + 1])
    }
  }, [previewIndex, filteredPhotos, setPreviewPhoto])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          {t('photos.title')}
        </h2>
        {/* Album filter */}
        <div className="flex gap-2">
          {albums.map((album) => {
            const i18nKey = ALBUM_I18N_KEY[album.id]
            const name = i18nKey ? t(i18nKey) : album.name
            return (
              <button
                key={album.id}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeAlbumId === album.id ? 'font-medium' : ''
                }`}
                style={{
                  background:
                    activeAlbumId === album.id
                      ? 'var(--color-accent)'
                      : 'var(--color-panel)',
                  color: activeAlbumId === album.id ? '#fff' : 'var(--color-text)',
                }}
                onClick={() => setActiveAlbum(album.id)}
              >
                {name}
              </button>
            )
          })}
        </div>
        <div className="flex-1" />
        <button
          className="px-3 py-2 rounded-lg text-sm text-white"
          style={{ background: 'var(--color-accent)' }}
          onClick={() => setShowUpload(!showUpload)}
        >
          {t('photos.upload')}
        </button>
      </div>

      {/* Upload area */}
      {showUpload && (
        <div className="mb-4">
          <PhotoUpload onUpload={handleUpload} albumId={activeAlbumId} />
        </div>
      )}

      {/* Photo grid */}
      <div className="flex-1 overflow-y-auto">
        <PhotoGrid
          photos={filteredPhotos}
          onPreview={setPreviewPhoto}
          onDelete={handleDelete}
        />
        {filteredPhotos.length === 0 && !showUpload && (
          <div
            className="flex items-center justify-center h-40 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t('photos.empty')}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewPhoto && (
        <PhotoPreview
          photo={previewPhoto}
          onClose={() => setPreviewPhoto(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
