import tailwindcss from "@tailwindcss/vite";

const isDev = process.env.NODE_ENV === 'development';

const APP_NAME = process.env.NUXT_PUBLIC_APP_NAME || 'Shared Ledger';
const APP_SHORT_NAME = isDev
  ? process.env.NUXT_PUBLIC_APP_NAME_SHORT_STG
  : process.env.NUXT_PUBLIC_APP_NAME_SHORT_STG;
const APP_DESCRIPTION = process.env.NUXT_PUBLIC_APP_NAME_DESCRIPTION || 'this is my idea app for shared ledger';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Shared Ledger',
      meta: [
        { name: APP_NAME, content: APP_DESCRIPTION },
        { name: 'theme-color', content: '#11192D' },
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
  plugins: [
    '~/plugins/webview-fallback.client.ts'
  ],
  pinia: {
    storesDirs: []
  },
  typescript: {
    typeCheck: true,
    strict: true,
  },
  pwa: {
    base: '/',
    manifest: {
      name: APP_NAME,
      short_name: APP_SHORT_NAME,
      description: APP_DESCRIPTION,
      background_color: '#11192D',
      theme_color: '#11192D',
      display: 'standalone',
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
      enabled: true,
      type: "module"
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
    },
  }

})