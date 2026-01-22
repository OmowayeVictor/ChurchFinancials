<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

            <div v-if="errorMessage"
                class="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {{ errorMessage }}
            </div>


            <div v-if="successMessage"
                class="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
                {{ successMessage }}
            </div>

            <h1 class="text-3xl font-extrabold text-gray-900 mb-2 text-center">
                Reset Password
            </h1>

            <p class="text-sm text-gray-500 text-center mb-8">
                Enter a new password to secure your account
            </p>

            <form @submit.prevent="resetPassword" class="space-y-5">

                <div>
                    <input v-model="newPassword" type="password" placeholder="New password"
                        class="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        required />

                    <p v-if="passwordTooShort" class="mt-1 text-sm text-red-600">
                        Password must be at least 8 characters
                    </p>
                </div>


                <div>
                    <input v-model="confirmPassword" type="password" placeholder="Confirm password"
                        class="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        required />

                    <p v-if="passwordsDontMatch" class="mt-1 text-sm text-red-600">
                        Passwords do not match
                    </p>
                </div>


                <button type="submit" :disabled="loading || isFormInvalid"
                    class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                    <span v-if="!loading">Reset Password</span>

                    <span v-else class="flex items-center justify-center gap-2">
                        <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
                                fill="none" />
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Updating…
                    </span>
                </button>
            </form>

            <p class="text-sm mt-6 text-center text-gray-600">
                Remembered your password?
                <NuxtLink to="/auth/login" class="text-blue-600 font-semibold hover:underline">
                    Sign in
                </NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup>

const route = useRoute();
const errorMessage = ref('');
const successMessage = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const supabase = useSupabaseClient();

const code = route.query.code;

const passwordTooShort = computed(() => {
    newPassword.value.length > 0 && newPassword.value.length < 6;
});
const passwordDontMatch = computed(() => {
    newPassword.value !== confirmPassword.value && confirmPassword.value > 0;
});
const isFormInvalid = computed(() => {
    passwordDontMatch.value || passwordTooShort.value || !newPassword.value;
});
onMounted(async () => {
    if (!code) {
        errorMessage.value = 'Invalid or expired reset link';
        return
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code)

})


const resetPassword = async () => {
    errorMessage.value = ''
    successMessage.value = ''
    if (
        newPassword.value !== confirmPassword.value ||
        newPassword.value.length < 0
    ) {
        errorMessage.value = 'Please fix the password issues above';
        return;
    }
    try {
        loading.value = true;
        const { error } = await supabase.auth.updateUser({
            password: newPassword.value,
        });
        loading.value = false;
        if (error) {
            errorMessage.value = error.message;
            return;
        };
        newPassword.value = '';
        successMessage.value = 'Password reset successful';

        setTimeout(() => {
            navigateTo('/');
        }, 1000);
    } catch (ex) {
        console.log(`Error Restting Password ${ex.message}`);
        errorMessage.value = 'Error Resetting Password, Please try again later';
    } finally {
        loading.value = false;
    }
};
</script>
