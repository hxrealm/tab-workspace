import { useCallback } from 'react'
import { Play, Music } from 'lucide-react'
import { useI18n } from '@/i18n'

interface MusicPlatform {
  key: string
  name: string
  nameEn: string
  url: string
  color: string
  Icon: React.FC
}

// NetEase Cloud Music - 红色云朵
const NetEaseIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 4 4 7a3 3 0 0 0 0 5.5C4 15.5 7 18 12 22c5-4 8-6.5 8-9.5A3 3 0 0 0 20 7c-1-3-4-5-8-5z"/></svg>
)

// QQ Music - 绿色三角播放
const QQIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><polygon points="10,8 16,12 10,16"/></svg>
)

// Kugou - 蓝色音符
const KugouIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>
)

// Kuwo - 橙色声波
const KuwoIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="10" width="3" height="4" rx="1"/><rect x="8" y="7" width="3" height="7" rx="1"/><rect x="13" y="10" width="3" height="4" rx="1"/><rect x="18" y="5" width="3" height="9" rx="1"/></svg>
)

// Spotify - 绿色声波弧线
const SpotifyIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42c-.18.29-.55.38-.84.2-2.31-1.41-5.22-1.73-8.64-.95-.33.08-.66-.13-.73-.46-.08-.33.13-.66.46-.73 3.73-.85 6.94-.48 9.55 1.11.29.17.38.55.2.83zm1.21-2.72c-.23.37-.71.49-1.08.26-2.68-1.64-6.77-2.11-9.96-1.16-.41.12-.85-.12-.97-.53-.12-.41.12-.85.53-.97 3.59-1.07 8.12-.54 11.21 1.33.37.23.49.71.27 1.07zm.1-2.83C14.73 9.08 9.35 8.9 6.29 9.83c-.49.15-1.01-.13-1.16-.62-.15-.49.13-1.01.62-1.16 3.53-1.07 9.53-.86 13.72 1.53.44.26.58.83.32 1.27-.26.44-.83.58-1.27.32z"/></svg>
)

// YouTube Music - 红色播放三角
const YouTubeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
)

// Apple Music - 红色音符
const AppleIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 3v11.25a4 4 0 1 0 2-3.46V5h-4V3h2zM8 8v8.5a4 4 0 1 0 2-3.46V10h-2V8z"/></svg>
)

const PLATFORMS: MusicPlatform[] = [
  { key: 'netease', name: '网易云音乐', nameEn: 'NetEase Music', url: 'https://music.163.com', color: '#c20c0c', Icon: NetEaseIcon },
  { key: 'qq', name: 'QQ音乐', nameEn: 'QQ Music', url: 'https://y.qq.com', color: '#31c27c', Icon: QQIcon },
  { key: 'kugou', name: '酷狗音乐', nameEn: 'Kugou', url: 'https://www.kugou.com', color: '#2d8cf0', Icon: KugouIcon },
  { key: 'kuwo', name: '酷我音乐', nameEn: 'Kuwo', url: 'https://www.kuwo.cn', color: '#ff8c00', Icon: KuwoIcon },
  { key: 'spotify', name: 'Spotify', nameEn: 'Spotify', url: 'https://open.spotify.com', color: '#1db954', Icon: SpotifyIcon },
  { key: 'youtube', name: 'YouTube Music', nameEn: 'YouTube Music', url: 'https://music.youtube.com', color: '#ff0000', Icon: YouTubeIcon },
  { key: 'apple', name: 'Apple Music', nameEn: 'Apple Music', url: 'https://music.apple.com', color: '#fc3c44', Icon: AppleIcon },
]

function isChineseLocale(): boolean {
  const stored = localStorage.getItem('ai-tab-locale')
  if (stored === 'zh-CN' || stored === 'zh-TW') return true
  if (!stored) {
    const nav = navigator.language || 'en'
    return nav.startsWith('zh-CN') || nav.startsWith('zh-TW')
  }
  return false
}

export function MusicPlayer() {
  const handleOpen = useCallback((url: string) => {
    window.open(url, '_blank')
  }, [])
  const { t } = useI18n()
  const cn = isChineseLocale()

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
        <Music size={20} style={{ color: 'var(--color-accent)' }} />
        {t('music.title')}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {PLATFORMS.map((platform) => (
          <div
            key={platform.key}
            className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-250 ease-out border"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-card-bg)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onClick={() => handleOpen(platform.url)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = platform.color + '66'
              ;(e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${platform.color}1f, 0 2px 8px rgba(92,74,61,0.08)`
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'
              ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
            }}
          >
            {/* Icon area */}
            <div className="p-6 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${platform.color}1a` }}
              >
                <platform.Icon className="w-8 h-8" style={{ color: platform.color }} />
              </div>
            </div>

            {/* Platform info */}
            <div className="px-4 pb-2 text-center">
              <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                {cn ? platform.name : platform.nameEn}
              </div>
            </div>

            {/* Hover play indicator */}
            <div className="px-4 pb-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Play size={14} style={{ color: platform.color }} />
            </div>

            {/* Bottom accent stripe */}
            <div
              className="h-1 mx-3 mb-2 rounded-full"
              style={{ background: `${platform.color}80` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
        <p>{t('music.hint')}</p>
      </div>
    </div>
  )
}
