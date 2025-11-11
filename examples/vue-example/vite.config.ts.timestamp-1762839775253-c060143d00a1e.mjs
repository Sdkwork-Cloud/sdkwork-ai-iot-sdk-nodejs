// vite.config.ts
import { defineConfig, loadEnv } from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/vite@4.5.14_@types+node@20.19.24_sass@1.93.3_terser@5.44.1/node_modules/vite/dist/node/index.js";
import mkcert from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/node_modules/.pnpm/vite-plugin-mkcert@1.17.9_v_73de79367d303d3d52b7b851133b6dda/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import vue from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_0d992052015bff20ad6031154a112a9a/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/unplugin-vue-router@0.12.0__ff98085859d7b05462155c7f1d1d065f/node_modules/unplugin-vue-router/dist/vite.js";
import Components from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/unplugin-vue-components@28._fc9b787d472398d60a229dd40c09dde9/node_modules/unplugin-vue-components/dist/vite.js";
import AutoImport from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/unplugin-auto-import@19.3.0_6fa0c99fd428e28dd9495921e9a54d53/node_modules/unplugin-auto-import/dist/vite.js";
import UnoCSS from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/unocss@66.5.5_postcss@8.5.6_13d86d42a974fb9d8029058d109c2843/node_modules/unocss/dist/vite.mjs";
import { VitePWA } from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/vite-plugin-pwa@1.1.0_vite@_e81dcd0803516822d7251e517b44ae44/node_modules/vite-plugin-pwa/dist/index.js";
import VueI18nPlugin from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/@intlify+unplugin-vue-i18n@_32438ab8ec30b9626e0f43b8974599b7/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { resolve } from "path";
import { VueRouterAutoImports } from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/unplugin-vue-router@0.12.0__ff98085859d7b05462155c7f1d1d065f/node_modules/unplugin-vue-router/dist/index.js";
import MetaLayouts from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/vite-plugin-vue-meta-layout_ac2c014e1110c5dcd8fb8d3125c9a1ce/node_modules/vite-plugin-vue-meta-layouts/dist/index.mjs";
import { VantResolver } from "file:///D:/sdkwork-opensource/sdkwork-ai-iot-sdk/sdkwork-ai-iot-sdk-nodejs/examples/vue-example/node_modules/.pnpm/unplugin-vue-components@28._fc9b787d472398d60a229dd40c09dde9/node_modules/unplugin-vue-components/dist/resolvers.js";
var __vite_injected_original_dirname = "D:\\sdkwork-opensource\\sdkwork-ai-iot-sdk\\sdkwork-ai-iot-sdk-nodejs\\examples\\vue-example";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const outputDir = "dist/" + mode;
  const parseEnvValue = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  };
  const devProxy = {
    "/api": {
      target: env.VITE_GLOB_API_BASE_URL || "http://localhost:8080",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, "")
    },
    "/ws": {
      target: env.VITE_GLOB_WS_BASE_URL || "ws://localhost:8080",
      ws: true,
      changeOrigin: true
    }
  };
  return {
    base: env.VITE_BASE_URL || "/",
    plugins: [
      // 启用本地HTTPS
      mkcert(),
      // Vue i18n国际化插件
      VueI18nPlugin(),
      // 使用unplugin-vue-router自动生成路由，无需手动配置
      VueRouter({
        routesFolder: "src/pages",
        dts: "src/typed-router.d.ts"
      }),
      vue(),
      MetaLayouts({
        skipTopLevelRouteLayout: true,
        excludes: ["**/components/**/*.vue"]
      }),
      // 自动导入组件
      Components({
        dts: "src/components.d.ts",
        resolvers: [
          VantResolver({
            importStyle: "css"
            // 启用 CSS 变量支持，支持深色模式
          })
        ]
      }),
      // 自动导入API
      AutoImport({
        imports: [
          "vue",
          VueRouterAutoImports,
          "pinia",
          "@vueuse/core"
        ],
        dts: "src/auto-imports.d.ts",
        dirs: [
          "src/composables",
          "src/stores"
        ],
        exclude: []
      }),
      // UnoCSS原子化CSS
      UnoCSS(),
      //PWA配置
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
        workbox: {
          maximumFileSizeToCacheInBytes: 15 * 1024 * 1024
          // 提升至 15MB
        },
        manifest: {
          name: env.VITE_APP_TITLE || "SDKWork AIoT",
          short_name: "SDKAIoT",
          description: env.VITE_APP_DESC || "AIoT Application",
          theme_color: "#ffffff",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png"
            }
          ]
        }
      })
    ],
    // 路径别名配置
    resolve: {
      alias: {
        "@": resolve(__vite_injected_original_dirname, "src")
      }
    },
    // 开发服务器配置
    server: {
      port: 4e3,
      host: true,
      open: true,
      https: true,
      // 启用HTTPS
      proxy: mode === "dev" ? devProxy : void 0,
      hmr: {
        overlay: true,
        protocol: "wss"
        // HMR over WebSocket Secure
      },
      watch: {
        usePolling: true
      }
    },
    build: {
      target: "esnext",
      minify: mode === "prod" ? "terser" : false,
      sourcemap: env.VITE_SOURCE_MAP === "Y",
      chunkSizeWarningLimit: 1500,
      outDir: outputDir,
      ...mode === "prod" && {
        terserOptions: {
          compress: {
            drop_console: false,
            // 不删除console
            drop_debugger: true
          }
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            "vue-vendor": ["vue", "vue-router", "pinia"],
            "utils-vendor": ["axios", "crypto-js"]
          },
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: "[ext]/[name]-[hash].[ext]"
        }
      }
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
      environment: "jsdom",
      setupFiles: ["./tests/setup.ts"]
    },
    // 优化依赖
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "@vueuse/core",
        "axios",
        "sdkwork-sdk-api-typescript",
        "sdkwork-commons-typescript",
        "sdkwork-sdk-manager-typescript",
        "sdkwork-ai-iot-sdk"
      ]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxzZGt3b3JrLW9wZW5zb3VyY2VcXFxcc2Rrd29yay1haS1pb3Qtc2RrXFxcXHNka3dvcmstYWktaW90LXNkay1ub2RlanNcXFxcZXhhbXBsZXNcXFxcdnVlLWV4YW1wbGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHNka3dvcmstb3BlbnNvdXJjZVxcXFxzZGt3b3JrLWFpLWlvdC1zZGtcXFxcc2Rrd29yay1haS1pb3Qtc2RrLW5vZGVqc1xcXFxleGFtcGxlc1xcXFx2dWUtZXhhbXBsZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovc2Rrd29yay1vcGVuc291cmNlL3Nka3dvcmstYWktaW90LXNkay9zZGt3b3JrLWFpLWlvdC1zZGstbm9kZWpzL2V4YW1wbGVzL3Z1ZS1leGFtcGxlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCBDb25maWdFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgbWtjZXJ0IGZyb20gJ3ZpdGUtcGx1Z2luLW1rY2VydCdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xyXG5pbXBvcnQgVnVlSTE4blBsdWdpbiBmcm9tICdAaW50bGlmeS91bnBsdWdpbi12dWUtaTE4bi92aXRlJ1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcclxuaW1wb3J0IHsgVnVlUm91dGVyQXV0b0ltcG9ydHMgfSBmcm9tIFwidW5wbHVnaW4tdnVlLXJvdXRlclwiO1xyXG4vLyBVbm9DU1MgcHJlc2V0c1xyXG5pbXBvcnQgcHJlc2V0VW5vIGZyb20gJ0B1bm9jc3MvcHJlc2V0LXVubydcclxuaW1wb3J0IHByZXNldEF0dHJpYnV0aWZ5IGZyb20gJ0B1bm9jc3MvcHJlc2V0LWF0dHJpYnV0aWZ5J1xyXG5pbXBvcnQgcHJlc2V0SWNvbnMgZnJvbSAnQHVub2Nzcy9wcmVzZXQtaWNvbnMnXHJcbmltcG9ydCB0cmFuc2Zvcm1lckRpcmVjdGl2ZXMgZnJvbSAnQHVub2Nzcy90cmFuc2Zvcm1lci1kaXJlY3RpdmVzJ1xyXG5pbXBvcnQgdHJhbnNmb3JtZXJWYXJpYW50R3JvdXAgZnJvbSAnQHVub2Nzcy90cmFuc2Zvcm1lci12YXJpYW50LWdyb3VwJ1xyXG5pbXBvcnQgTWV0YUxheW91dHMgZnJvbSBcInZpdGUtcGx1Z2luLXZ1ZS1tZXRhLWxheW91dHNcIjsgXHJcbmltcG9ydCB7IFZhbnRSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycyc7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9OiBDb25maWdFbnYpID0+IHtcclxuICAvLyBcdTUyQTBcdThGN0RcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXHJcbiAgY29uc3Qgb3V0cHV0RGlyID0gJ2Rpc3QvJyArIG1vZGVcclxuXHJcbiAgLy8gXHU4OUUzXHU2NzkwXHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXHU0RTJEXHU3Njg0SlNPTlx1NUI1N1x1N0IyNlx1NEUzMlxyXG4gIGNvbnN0IHBhcnNlRW52VmFsdWUgPSAodmFsdWU6IHN0cmluZykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgcmV0dXJuIEpTT04ucGFyc2UodmFsdWUpXHJcbiAgICB9IGNhdGNoIHtcclxuICAgICAgcmV0dXJuIHZhbHVlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcclxuICBjb25zdCBkZXZQcm94eSA9IHtcclxuICAgICcvYXBpJzoge1xyXG4gICAgICB0YXJnZXQ6IGVudi5WSVRFX0dMT0JfQVBJX0JBU0VfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIHJld3JpdGU6IChwYXRoOiBzdHJpbmcpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKVxyXG4gICAgfSxcclxuICAgICcvd3MnOiB7XHJcbiAgICAgIHRhcmdldDogZW52LlZJVEVfR0xPQl9XU19CQVNFX1VSTCB8fCAnd3M6Ly9sb2NhbGhvc3Q6ODA4MCcsXHJcbiAgICAgIHdzOiB0cnVlLFxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBiYXNlOiBlbnYuVklURV9CQVNFX1VSTCB8fCAnLycsXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIC8vIFx1NTQyRlx1NzUyOFx1NjcyQ1x1NTczMEhUVFBTXHJcbiAgICAgIG1rY2VydCgpLFxyXG4gICAgICAvLyBWdWUgaTE4blx1NTZGRFx1OTY0NVx1NTMxNlx1NjNEMlx1NEVGNlxyXG4gICAgICBWdWVJMThuUGx1Z2luKCksXHJcbiAgICAgIC8vIFx1NEY3Rlx1NzUyOHVucGx1Z2luLXZ1ZS1yb3V0ZXJcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdThERUZcdTc1MzFcdUZGMENcdTY1RTBcdTk3MDBcdTYyNEJcdTUyQThcdTkxNERcdTdGNkVcclxuICAgICAgVnVlUm91dGVyKHtcclxuICAgICAgICByb3V0ZXNGb2xkZXI6ICdzcmMvcGFnZXMnLFxyXG4gICAgICAgIGR0czogJ3NyYy90eXBlZC1yb3V0ZXIuZC50cydcclxuICAgICAgfSksXHJcbiAgICAgIHZ1ZSgpLCBcclxuICAgICAgTWV0YUxheW91dHMoe1xyXG4gICAgICAgIHNraXBUb3BMZXZlbFJvdXRlTGF5b3V0OiB0cnVlLFxyXG4gICAgICAgIGV4Y2x1ZGVzOiBbXCIqKi9jb21wb25lbnRzLyoqLyoudnVlXCJdLFxyXG4gICAgICB9KSxcclxuICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU3RUM0XHU0RUY2XHJcbiAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgIGR0czogJ3NyYy9jb21wb25lbnRzLmQudHMnLFxyXG4gICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgVmFudFJlc29sdmVyKHtcclxuICAgICAgICAgICAgaW1wb3J0U3R5bGU6ICdjc3MnLCAvLyBcdTU0MkZcdTc1MjggQ1NTIFx1NTNEOFx1OTFDRlx1NjUyRlx1NjMwMVx1RkYwQ1x1NjUyRlx1NjMwMVx1NkRGMVx1ODI3Mlx1NkEyMVx1NUYwRlxyXG4gICAgICAgICAgfSlcclxuICAgICAgICBdXHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVBUElcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgICBWdWVSb3V0ZXJBdXRvSW1wb3J0cyxcclxuICAgICAgICAgICdwaW5pYScsXHJcbiAgICAgICAgICAnQHZ1ZXVzZS9jb3JlJ1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZHRzOiAnc3JjL2F1dG8taW1wb3J0cy5kLnRzJyxcclxuICAgICAgICBkaXJzOiBbXHJcbiAgICAgICAgICAnc3JjL2NvbXBvc2FibGVzJyxcclxuICAgICAgICAgICdzcmMvc3RvcmVzJ1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZXhjbHVkZTogWyBcclxuICAgICAgICBdXHJcbiAgICAgIH0pLFxyXG4gICAgICAvLyBVbm9DU1NcdTUzOUZcdTVCNTBcdTUzMTZDU1NcclxuICAgICAgVW5vQ1NTKCksXHJcbiAgICAgIC8vUFdBXHU5MTREXHU3RjZFXHJcbiAgICAgIFZpdGVQV0Eoe1xyXG4gICAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgICAgIGluY2x1ZGVBc3NldHM6IFsnZmF2aWNvbi5pY28nLCAncm9ib3RzLnR4dCcsICdhcHBsZS10b3VjaC1pY29uLnBuZyddLFxyXG4gICAgICAgIHdvcmtib3g6IHtcclxuICAgICAgICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiAxNSAqIDEwMjQgKiAxMDI0IC8vIFx1NjNEMFx1NTM0N1x1ODFGMyAxNU1CXHJcbiAgICAgICAgfSxcclxuICAgICAgICBtYW5pZmVzdDoge1xyXG4gICAgICAgICAgbmFtZTogZW52LlZJVEVfQVBQX1RJVExFIHx8ICdTREtXb3JrIEFJb1QnLFxyXG4gICAgICAgICAgc2hvcnRfbmFtZTogJ1NES0FJb1QnLFxyXG4gICAgICAgICAgZGVzY3JpcHRpb246IGVudi5WSVRFX0FQUF9ERVNDIHx8ICdBSW9UIEFwcGxpY2F0aW9uJyxcclxuICAgICAgICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgICBpY29uczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgc3JjOiAncHdhLTE5MngxOTIucG5nJyxcclxuICAgICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gICAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxyXG4gICAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIF0sXHJcblxyXG4gICAgLy8gXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXHU5MTREXHU3RjZFXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgXCJAXCI6IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKVxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTkxNERcdTdGNkVcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwb3J0OiA0MDAwLFxyXG4gICAgICBob3N0OiB0cnVlLFxyXG4gICAgICBvcGVuOiB0cnVlLFxyXG4gICAgICBodHRwczogdHJ1ZSwgLy8gXHU1NDJGXHU3NTI4SFRUUFNcclxuICAgICAgcHJveHk6IG1vZGUgPT09ICdkZXYnID8gZGV2UHJveHkgOiB1bmRlZmluZWQsXHJcbiAgICAgIGhtcjoge1xyXG4gICAgICAgIG92ZXJsYXk6IHRydWUsXHJcbiAgICAgICAgcHJvdG9jb2w6ICd3c3MnIC8vIEhNUiBvdmVyIFdlYlNvY2tldCBTZWN1cmVcclxuICAgICAgfSxcclxuICAgICAgd2F0Y2g6IHtcclxuICAgICAgICB1c2VQb2xsaW5nOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgICAgdGFyZ2V0OiBcImVzbmV4dFwiLFxyXG4gICAgICBtaW5pZnk6IG1vZGUgPT09ICdwcm9kJyA/IFwidGVyc2VyXCIgOiBmYWxzZSxcclxuICAgICAgc291cmNlbWFwOiBlbnYuVklURV9TT1VSQ0VfTUFQID09PSAnWScsXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTUwMCxcclxuICAgICAgb3V0RGlyOiBvdXRwdXREaXIsXHJcbiAgICAgIC4uLihtb2RlID09PSAncHJvZCcgJiYge1xyXG4gICAgICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgICAgIGNvbXByZXNzOiB7XHJcbiAgICAgICAgICAgIGRyb3BfY29uc29sZTogZmFsc2UsLy8gXHU0RTBEXHU1MjIwXHU5NjY0Y29uc29sZVxyXG4gICAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgIFwidnVlLXZlbmRvclwiOiBbXCJ2dWVcIiwgXCJ2dWUtcm91dGVyXCIsIFwicGluaWFcIl0sIFxyXG4gICAgICAgICAgICBcInV0aWxzLXZlbmRvclwiOiBbXCJheGlvc1wiLCBcImNyeXB0by1qc1wiXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sIFxyXG4gICAgLy8gQ1NTXHU5MTREXHU3RjZFXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQHVzZSBcIkAvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXNcIiBhcyAqOydcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gXHU2RDRCXHU4QkQ1XHU5MTREXHU3RjZFXHJcbiAgICB0ZXN0OiB7XHJcbiAgICAgIGdsb2JhbHM6IHRydWUsXHJcbiAgICAgIGVudmlyb25tZW50OiAnanNkb20nLFxyXG4gICAgICBzZXR1cEZpbGVzOiBbJy4vdGVzdHMvc2V0dXAudHMnXVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTRGMThcdTUzMTZcdTRGOURcdThENTZcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICBpbmNsdWRlOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICdwaW5pYScsXHJcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgJ2F4aW9zJyxcclxuICAgICAgICAnc2Rrd29yay1zZGstYXBpLXR5cGVzY3JpcHQnLFxyXG4gICAgICAgICdzZGt3b3JrLWNvbW1vbnMtdHlwZXNjcmlwdCcsXHJcbiAgICAgICAgJ3Nka3dvcmstc2RrLW1hbmFnZXItdHlwZXNjcmlwdCcsXHJcbiAgICAgICAgJ3Nka3dvcmstYWktaW90LXNkaydcclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQW1jLFNBQVMsY0FBYyxlQUEwQjtBQUNwZixPQUFPLFlBQVk7QUFDbkIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZUFBZTtBQUN0QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLFlBQVk7QUFDbkIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsZUFBZTtBQUN4QixTQUFTLDRCQUE0QjtBQU9yQyxPQUFPLGlCQUFpQjtBQUN4QixTQUFTLG9CQUFvQjtBQWxCN0IsSUFBTSxtQ0FBbUM7QUFxQnpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQWlCO0FBRTVELFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJ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
