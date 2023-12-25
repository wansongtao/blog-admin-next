import '@/assets/styles/base.css'
import 'tailwindcss/tailwind.css'
import { initTheme } from './utils/theme'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './router/permission'

initTheme()
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
