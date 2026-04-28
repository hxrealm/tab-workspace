import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync } from 'fs'

export default defineConfig(({ mode }) => {
  const browser = mode || 'chrome'
  const isSafari = browser === 'safari'
  const outDir = resolve(__dirname, `build/${browser}`)

  // Plugin to copy manifest.json and icons after build
  const copyExtensionFiles = {
    name: 'copy-extension-files',
    closeBundle() {
      mkdirSync(outDir, { recursive: true })
      copyFileSync(resolve(__dirname, 'manifest.json'), resolve(outDir, 'manifest.json'))
      // Copy favicon
      copyFileSync(resolve(__dirname, 'public/favicon.svg'), resolve(outDir, 'favicon.svg'))
      // Copy icons
      mkdirSync(resolve(outDir, 'icons'), { recursive: true })
      const icons = ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png']
      for (const icon of icons) {
        copyFileSync(resolve(__dirname, 'public/icons', icon), resolve(outDir, 'icons', icon))
      }
    },
  }

  return {
    plugins: [react(), copyExtensionFiles],
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'public'),
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          newtab: resolve(__dirname, 'src/newtab.html'),
        },
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.BROWSER': JSON.stringify(browser),
    },
  }
})
