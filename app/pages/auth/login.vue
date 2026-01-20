<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">


      <div v-if="errorMessage" class="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
        {{ errorMessage }}
      </div>

      <h1 class="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        Welcome Back
      </h1>
      <p class="text-sm text-gray-500 text-center mb-8">
        Sign in to continue to your dashboard
      </p>

      <form @submit.prevent="signIn" class="space-y-5">
        <input v-model="email" type="email" placeholder="Email address" class="w-full border rounded-lg p-3 text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" required />

        <div>
          <input v-model="password" type="password" placeholder="Password" class="w-full border rounded-lg p-3 text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" required />
          <div class="text-right mt-2">
            <NuxtLink to="/auth/reset" class="text-sm text-blue-600 hover:underline">
              Forgot password?
            </NuxtLink>
          </div>
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                 hover:bg-blue-700 transition active:scale-[0.98]">
          Sign In
        </button>
      </form>

      <p class="text-sm mt-6 text-center text-gray-600">
        No account?
        <NuxtLink to="/auth/signup" class="text-blue-600 font-semibold hover:underline">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const supabase = useSupabaseClient()
const router = useRouter()

const signIn = async () => {
  errorMessage.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMessage.value = error.message
    return
  }

  router.push('/')
}
</script>
