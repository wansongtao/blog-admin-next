import version from './build/version'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), svgLoader()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  },
  server: {
    open: true,
    host: '0.0.0.0',
    proxy: {
      '/dev': {
        target: 'https://mock.apifox.com/m1/2791800-0-default',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev/, '')
      }
    }
  },
  base: '/admin/',
  define: {
    __APP_VERSION__: JSON.stringify(version)
  }
})
