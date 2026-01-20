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
          class="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />

        <button class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Send Reset Link
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

const supabase = useSupabaseClient()

const reset = async () => {
  message.value = ''

  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/auth/signin`
  })

  if (error) {
    type.value = 'error'
    message.value = error.message
    return
  }

  type.value = 'success'
  message.value = 'Reset link sent. Check your email.'
}
</script>
