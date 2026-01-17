import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module', '@nuxtjs/supabase'],
  // plugins: ['~/plugins/supabase.client.ts'],
primevue: {
        options: {
            ripple: true,
            inputVariant: 'filled',
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'system',
                    cssLayer: false
                }
            }
        }
    },
    css: [
    'primeicons/primeicons.css'
  ],
   runtimeConfig: {
    public: {
      supabaseUrl: process.env.supabase_URL,
      supabaseApi: process.env.supabase_API
    }
  },
  supabase: {
    url: process.env.supabase_URL,
    key: process.env.supabase_API,
    redirect: true,
      redirectOptions: {
    login: '/auth/login',
    callback: '/entry',
    include: undefined,
    exclude: ['/auth/**'], 
    saveRedirectToCookie: false,
  }
  }
});
