import { Sidebar } from '@/components/Sidebar'
import { Toast } from '@/components/Toast'
import { TabManager } from '@/modules/tab-manager/TabManager'
import { SiteNav } from '@/modules/site-nav/SiteNav'
import { MusicPlayer } from '@/modules/music-player/MusicPlayer'
import { PhotoAlbum } from '@/modules/photo-album/PhotoAlbum'
import { Settings } from '@/modules/settings/Settings'
import { useUiStore } from '@/store/uiStore'
import { useI18n } from '@/i18n'

export function App() {
  const { currentModule } = useUiStore()
  const { t } = useI18n()

  return (
    <div className="h-full flex">
      {/* Left sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-hidden p-4">
        {currentModule === 'tabs' && <TabManager />}
        {currentModule === 'sites' && <SiteNav />}
        {currentModule === 'music' && <MusicPlayer />}
        {currentModule === 'photos' && <PhotoAlbum />}
        {currentModule === 'settings' && <Settings />}
        {currentModule !== 'tabs' && currentModule !== 'sites' && currentModule !== 'music' && currentModule !== 'photos' && currentModule !== 'settings' && (
          <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
            {t('app.comingSoon')}
          </div>
        )}
      </main>

      <Toast />
    </div>
  )
}
