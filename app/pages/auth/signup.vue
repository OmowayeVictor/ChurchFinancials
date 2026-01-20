<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">


      <div v-if="message" :class="[
        'mb-4 rounded-lg px-4 py-3 text-sm border',
        messageType === 'error'
          ? 'bg-red-50 border-red-200 text-red-700'
          : 'bg-green-50 border-green-200 text-green-700'
      ]">
        {{ message }}
      </div>

      <h1 class="text-3xl font-extrabold text-gray-900 mb-2 text-center">
        Create Account
      </h1>
      <p class="text-sm text-gray-500 text-center mb-8">
        Sign up to start managing church finances
      </p>

      <form @submit.prevent="signUp" class="space-y-5">
        <input v-model="email" type="email" placeholder="Email address" class="w-full border rounded-lg p-3 text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" required />

        <input v-model="displayName" type="text" placeholder="Display name" class="w-full border rounded-lg p-3 text-gray-800
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" required />

        <input v-model="password" type="password" placeholder="Password (min 6 characters)" class="w-full border rounded-lg p-3 text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" required />

        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                 hover:bg-blue-700 transition active:scale-[0.98]">
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

const displayName = ref('')
const email = ref('')
const password = ref('')
const message = ref('')
const messageType = ref('error')

const supabase = useSupabaseClient()
const router = useRouter()

const signUp = async () => {
  message.value = ''

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        display_name: displayName.value
      }
    }
  })
  if (error) {
    messageType.value = 'error'
    message.value = 'An unexpected Error Occured, Please contact Victor'
    console.log(error)
    return
  }


  messageType.value = 'success'
  message.value = 'Account created successfully. You can now sign in.'

  setTimeout(() => {
    router.push('/auth/login')
  }, 1500)
}
</script>
