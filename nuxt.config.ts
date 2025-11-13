import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from 'vite-plugin-pwa'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Shared Ledger',
      meta: [
        { name: 'Shared Ledger App', content: 'Deskripsi singkat aplikasi saya.' }
      ],
    }
  },
  css: [
    'assets/css/main.css',
    'assets/css/login_style.css'
  ],
  devServer: {
    host: '0.0.0.0', // <--- HOST HARUS DI SINI
    port: 3002,
  },
  vite: {
    server: {
      allowedHosts: true,
      fs: {
        // Pertahankan fs.allow di sini untuk mengizinkan ngrok
        allow: ['.'],
      },
      cors: {
        origin: '*', // Mengizinkan request dari semua origin
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        preflightContinue: false,
        optionsSuccessStatus: 204
      }
    },
    plugins: [
      tailwindcss()
    ]
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
    'nuxt-lottie',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  pwa: {
    base: '/',
    manifest: {
      name: "Shared ledger app",
      short_name: 'SL APP',
      description: "this is my idea app for shared ledger",
      icons: [
        {
          src: 'icons/icon_64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'icons/icon_120x120.png',
          sizes: '120x120',
          type: 'image/png',
        },
        {
          src: 'icons/icon_144x144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: 'icons/icon_152x152.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: 'icons/icon_192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon_384x384.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: 'icons/icon_512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ]
    },

    workbox: {
      navigateFallback: '/',
      navigateFallbackDenylist: [
        /\/__/,
        /\/api\//,
      ],
    },
    devOptions: {
      enabled: false,
      type: "module"
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
    },
  }

})