import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': `${import.meta.dirname}/src`,
      },
    },
    server: {
      host: true,
      port: 15173,
      proxy: {
        '/api': {
          target: 'https://api.z.ai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.ZAI_API_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.ZAI_API_KEY}`)
              }
            })
          },
        },
      },
    },
  }
})
