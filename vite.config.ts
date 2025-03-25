import { URL, fileURLToPath } from 'node:url'
import version from './scripts/version'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    svgLoader()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    __APP_VERSION__: version
  },
  base: '/admin/',
  build: {
    outDir: './docker/dist'
  },
  server: {
    open: true,
    port: 4000,
    proxy: {
      '/dev': {
        target: 'http://localhost:3000/api/v1/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev/, '')
      },
      '/upload': {
        target: 'http://localhost:9000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload/, '')
      }
    }
  }
})
