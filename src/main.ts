import './assets/styles/main.css'

import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router'
import './router/permission'
import installDirective from './directives'

const app = createApp(App)
installDirective(app)

app.use(pinia)
app.use(router)

app.mount('#app')
