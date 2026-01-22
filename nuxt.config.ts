import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module', '@nuxtjs/supabase'],
  primevue: {
    options: {
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false,
        },
      },
    },
  },
  css: ['primeicons/primeicons.css'],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
    redirectOptions: {
      login: '/auth/login',
      callback: '/',
      include: undefined,
      exclude: ['/auth/**'],
      saveRedirectToCookie: false,
    },
  },
  runtimeConfig: {
    public: {
      appuRL: 'https://cacfolfinance.vercel.app',
    },
  },
});
