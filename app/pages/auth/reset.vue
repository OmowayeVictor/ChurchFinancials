<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-xl shadow w-full max-w-md">


      <div v-if="message" :class="[
        'mb-4 rounded-lg px-4 py-3 text-sm border',
        type === 'error'
          ? 'bg-red-50 border-red-200 text-red-700'
          : 'bg-green-50 border-green-200 text-green-700'
      ]">
        {{ message }}
      </div>

      <h1 class="text-xl font-bold mb-4 text-center">Reset Password</h1>

      <form @submit.prevent="reset" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email"
          class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" required />

        <button type="submit" :disabled="loading" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
         hover:bg-blue-700 transition active:scale-[0.98]
         disabled:opacity-60 disabled:cursor-not-allowed">
          <span v-if="!loading">Send Reset Link</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Sending reset link…
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const message = ref('')
const type = ref('success')
const loading = ref(false)

const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const reset = async () => {
  message.value = ''
  loading.value = true

  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `http://localhost:3000/auth/reset-password`,
  })
  loading.value = false
  if (error) {
    type.value = 'error'
    message.value = error.message
    return
  }

  type.value = 'success'
  message.value = 'Reset link sent. Check your email.'
}
</script>
