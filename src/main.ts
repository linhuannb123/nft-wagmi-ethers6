import { createApp } from 'vue'
import '@/assets/main.scss'
import { routeState } from './router'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import pinia from '@/store'
// import Header from './components/Header.vue';

import { registerCommonComponent } from './components'
import { WagmiPlugin } from '@wagmi/vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { config } from './wagmi'
import { Buffer } from 'buffer'
import '@/assets/font/font.scss'
// `@coinbase-wallet/sdk` uses `Buffer`
globalThis.Buffer = Buffer

console.log('id', import.meta.env.VITE_PROJECT_ID)
// 确保环境变量存在
if (!import.meta.env.VITE_PROJECT_ID) {
  throw new Error('VITE_PROJECT_ID is not defined in environment variables')
}
const queryClient = new QueryClient()

/**
 * 应用启动函数
 * 异步初始化Vue应用并配置各种插件和组件
 */
async function bootstrap() {
  // 创建Vue应用实例
  const app = createApp(App)
  const router = await routeState.initRouter() // 异步初始化路由
  registerCommonComponent(app)
  app
    .use(ArcoVue, {
      // 用于改变使用组件时的前缀名称
      componentPrefix: 'arco',
    })

    .use(WagmiPlugin, { config })
    .use(VueQueryPlugin, { queryClient })
    .use(router)
    .use(pinia)
    .use(ArcoVueIcon)
    // .use(appKitPlugin) // 使用包装器插件
    .mount('#app')
}
bootstrap()
