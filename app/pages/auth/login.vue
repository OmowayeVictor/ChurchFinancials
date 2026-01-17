<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-xl shadow w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6">Sign In</h1>

      <form @submit.prevent="signIn" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email" class="w-full border rounded p-2" required />

        <input v-model="password" type="password" placeholder="Password" class="w-full border rounded p-2" required />

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>

      <p class="text-sm mt-4 text-center">
        No account?
        <NuxtLink to="/signup" class="text-blue-600">Sign up</NuxtLink>
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

const signIn = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    toast.add({ severity: 'error', summary: 'Login failed', detail: error.message })
    return
  }

  router.push('/')
}
</script>
