import './assets/styles/index.css'
import 'vue3-toastify/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Vue3Toastify, { toast } from 'vue3-toastify'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Configure Pinia with persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Configure Vue3 Toastify
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: toast.POSITION.TOP_RIGHT,
  theme: 'light', // Default to light, will be updated by theme store
  transition: 'bounce',
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
})

app.use(pinia)
app.use(router)

app.mount('#app')
