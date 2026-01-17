import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module'],
  plugins: ['~/plugins/supabase.client.ts'],
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
      supabaseUrl: process.env.Supabase_URL,
      supabaseApi: process.env.supabase_API
    }
  },
  supabase: {
    url: process.env.supabase_URL,
    key: process.env.supabase_API,
    redirect: true
  }
});
