import { defineConfig, loadEnv, ConfigEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { resolve } from 'path'
import { VueRouterAutoImports } from "unplugin-vue-router";
// UnoCSS presets
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'
import presetIcons from '@unocss/preset-icons'
import transformerDirectives from '@unocss/transformer-directives'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import MetaLayouts from "vite-plugin-vue-meta-layouts"; 
import { VantResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  const outputDir = 'dist/' + mode

  // 解析环境变量中的JSON字符串
  const parseEnvValue = (value: string) => {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  // 开发环境代理配置
  const devProxy = {
    '/api': {
      target: env.VITE_GLOB_API_BASE_URL || 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, '')
    },
    '/ws': {
      target: env.VITE_GLOB_WS_BASE_URL || 'ws://localhost:8080',
      ws: true,
      changeOrigin: true
    }
  }

  return {
    base: env.VITE_BASE_URL || '/',
    plugins: [
      // 启用本地HTTPS
      mkcert(),
      // Vue i18n国际化插件
      VueI18nPlugin(),
      // 使用unplugin-vue-router自动生成路由，无需手动配置
      VueRouter({
        routesFolder: 'src/pages',
        dts: 'src/typed-router.d.ts'
      }),
      vue(), 
      MetaLayouts({
        skipTopLevelRouteLayout: true,
        excludes: ["**/components/**/*.vue"],
      }),
      // 自动导入组件
      Components({
        dts: 'src/components.d.ts',
        resolvers: [
          VantResolver({
            importStyle: 'css-vars', // 启用 CSS 变量支持，支持深色模式
          })
        ]
      }),
      // 自动导入API
      AutoImport({
        imports: [
          'vue',
          VueRouterAutoImports,
          'pinia',
          '@vueuse/core'
        ],
        dts: 'src/auto-imports.d.ts',
        dirs: [
          'src/composables',
          'src/stores'
        ],
        exclude: [
          /useWebSocket/ // 排除@vueuse/core中的useWebSocket，使用本地实现
        ]
      }),
      // UnoCSS原子化CSS
      UnoCSS(),
      //PWA配置
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        workbox: {
          maximumFileSizeToCacheInBytes: 15 * 1024 * 1024 // 提升至 15MB
        },
        manifest: {
          name: env.VITE_APP_TITLE || 'SDKWork AIoT',
          short_name: 'SDKAIoT',
          description: env.VITE_APP_DESC || 'AIoT Application',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],

    // 路径别名配置
    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      },
    },

    // 开发服务器配置
    server: {
      port: 4000,
      host: true,
      open: true,
      https: true, // 启用HTTPS
      proxy: mode === 'dev' ? devProxy : undefined,
      hmr: {
        overlay: true,
        protocol: 'wss' // HMR over WebSocket Secure
      },
      watch: {
        usePolling: true
      }
    },
  build: {
      target: "esnext",
      minify: mode === 'prod' ? "terser" : false,
      sourcemap: env.VITE_SOURCE_MAP === 'Y',
      chunkSizeWarningLimit: 1500,
      outDir: outputDir,
      ...(mode === 'prod' && {
        terserOptions: {
          compress: {
            drop_console: false,// 不删除console
            drop_debugger: true,
          },
        },
      }),
      rollupOptions: {
        output: {
          manualChunks: {
            "vue-vendor": ["vue", "vue-router", "pinia"], 
            "utils-vendor": ["axios", "crypto-js"],
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
    }, 
    // CSS配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/variables" as *;'
        }
      }
    },

    // 测试配置
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts']
    },

    // 优化依赖
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        'axios',
        'sdkwork-sdk-api-typescript',
        'sdkwork-commons-typescript',
        'sdkwork-sdk-manager-typescript'
      ]
    }
  }
})