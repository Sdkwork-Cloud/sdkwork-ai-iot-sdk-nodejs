import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SDKWorkAIoT',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'index.esm.js'
          case 'umd':
            return 'index.umd.js'
          case 'cjs':
            return 'index.js'
          default:
            return 'index.js'
        }
      }
    },
    rollupOptions: {
      external: ['vue', 'react', 'react-dom'],
      output: {
        globals: {
          vue: 'Vue',
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    sourcemap: true,
    minify: true
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/__tests__/**/*']
    })
  ],
  server: {
    port: 3000,
    open: true
  }
})