import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: [
    'assets/css/main.css',
    'assets/css/login_style.css'
  ],
  vite: {
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
    manifest: {
      name: "Shared ledger app",
      short_name: 'SL APP',
      description: "this is my idea app for shared ledger"
    },
    workbox: {
      navigateFallback: '/'
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