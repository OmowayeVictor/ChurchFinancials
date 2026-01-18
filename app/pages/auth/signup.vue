<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        Create Account
      </h1>
      <p class="text-sm text-gray-500 text-center mb-8">
        Sign up to start managing church finances
      </p>

      <form @submit.prevent="signUp" class="space-y-5">
        <input
          v-model="email"
          type="email"
          placeholder="Email address"
          class="w-full border rounded-lg p-3 text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password (min 6 characters)"
          class="w-full border rounded-lg p-3 text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          required
        />

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                 hover:bg-blue-700 transition active:scale-[0.98]"
        >
          Create Account
        </button>
      </form>

      <p class="text-sm mt-6 text-center text-gray-600">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-blue-600 font-semibold hover:underline">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const email = ref('')
const password = ref('')
const toast = useToast()
const supabase = useSupabaseClient()
const router = useRouter()

const signUp = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    toast.add({ severity: 'error', summary: 'Signup failed', detail: error.message })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Account created',
    detail: 'You can now sign in'
  })

  router.push('/auth/login')
}
</script>
