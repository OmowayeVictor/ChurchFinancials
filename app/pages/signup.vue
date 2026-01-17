<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-xl shadow w-full max-w-md">
            <h1 class="text-2xl font-bold mb-6">Sign Up</h1>

            <form @submit.prevent="signUp" class="space-y-4">
                <input v-model="email" type="email" placeholder="Email" class="w-full border rounded p-2" required />

                <input v-model="password" type="password" placeholder="Password (min 6 chars)"
                    class="w-full border rounded p-2" required />

                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Create Account
                </button>
            </form>

            <p class="text-sm mt-4 text-center">
                Already have an account?
                <NuxtLink to="/auth/signin" class="text-blue-600">Sign in</NuxtLink>
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

    router.push('/signin')
}
</script>
