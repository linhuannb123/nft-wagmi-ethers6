import { createPinia } from 'pinia'
import { useAuthStore } from './modules/auth'
import { useModalStore } from './modules/modal'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
export { useAuthStore, useModalStore }
export default pinia
