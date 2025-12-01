import { defineConfig, type ConfigEnv, loadEnv } from 'vite'
import { wrapperEnv } from './build/utils'
import { createVitePlugins } from './build/vite/plugins'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
const config = defineConfig(({ command, mode }: ConfigEnv): any => {
  //   mode: {
  //   mode: 'development',
  //   command: 'serve',
  //   isSsrBuild: false,
  //   isPreview: false
  // },
  const isBuild = command === 'build'

  const env = loadEnv(mode, process.cwd())
  const viteEnv = wrapperEnv(env)

  console.log('环境配置:', viteEnv)

  // console.log('环境配置:', { mode, env, isProduction });
  return {
    //基础配置
    // base: viteEnv.VITE_PUBLIC_PATH || "/",// 从环境变量读取基础路径
    base: '/', // 从环境变量读取基础路径

    publicDir: 'public',
    // 插件配置
    plugins: [...createVitePlugins(viteEnv, isBuild)],
    optimizeDeps: {
      // 依赖预构建
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        'ethers', // Web3 核心依赖，必须预构建
        '@vueuse/core',
        '@metamask/providers', // 钱包依赖，预构建避免动态导入报错
        'buffer', // 补充 Web3 必需的 polyfill 依赖
      ],
      exclude: [
        '@openzeppelin/contracts', // 合约ABI通常是静态导出，不需要预构建
        'hardhat', // 仅后端脚本使用，前端不打包
        '@nomicfoundation/*', // 仅Hardhat工具链，前端无用
        'lodash', // 若用了lodash-es建议保留，否则可移除（你依赖里写的是lodas，可能是笔误！）
      ],
    },
    // 路径解析
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        assert: 'assert',
        http: 'stream-http',
        https: 'https-browserify',
        os: 'os-browserify/browser',
        url: 'url',
        process: 'process/browser',
      },
      extensions: ['.js', '.ts', '.mjs', '.mts', '.json', '.vue'],
    },

    // 开发服务器配置（保留你的原有配置即可）
    server: {
      host: '0.0.0.0',
      port: 3001, // 从环境变量读取端口
      open: false, // 从环境变量读取是否自动打开浏览器
      // proxy: { // 从环境变量读取代理配置
      //   // 若有接口代理，保留你的配置
      //   '/api': {
      //     target:'/api',
      //     changeOrigin: true,
      //     rewrite: (path:string) => path.replace(/^\/api/, '')
      //   }
      // }
      watch: {
        ignored: ['**/node_modules/**', '**/dist/**'], // 忽略不需要监听的目录
      },
    },
    // 构建优化（可选，提升打包效率）
    build: {
      sourcemap: isBuild ? viteEnv.VITE_SOURCE_MAP : true, //开发环境启用sourcemap，生产环境由环境变量控制
      outDir: 'dist',
      chunkSizeWarningLimit: 5000, // 加大chunk体积警告阈值
      minify: isBuild ? 'terser' : false, // 开发环境不压缩
      terserOptions: {
        compress: {
          drop_console: viteEnv.VITE_DROP_CONSOLE || true, //改为false，生产环境就会保留console.log
          drop_debugger: true, //改为false，生产环境就会保留debugger
        },
      },
      assetsInlineLimit: 4096, // 4KB以下的资源内联
      rollupOptions: {
        output: {
          manualChunks(id: string | string[]) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
            if (id.includes('src/components')) {
              return 'components' // 组件单独打包
            }
          },
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },

    // css配置
    css: {
      // postcss: {
      //   plugins: [
      //     autoprefixer(), // 自动添加浏览器前缀
      //   ],
      // },
      // preprocessorOptions: {
      //   scss: {
      //     additionalData: `@import "@/styles/variables.scss";`, // 全局注入SCSS变量
      //   },
      // },
    },

    // 预览服务器（用于预览构建产物）
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
  }
})
export default config
