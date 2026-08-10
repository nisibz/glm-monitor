import '@dotenvx/dotenvx/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(() => {
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
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (process.env.ZAI_API_KEY) {
                proxyReq.setHeader(
                  'Authorization',
                  `Bearer ${process.env.ZAI_API_KEY}`,
                )
              }
            })
          },
        },
      },
    },
  }
})
