<template>
  <div class="min-h-screen flex bg-gray-50 text-gray-800 relative">

    <aside
      :class="[
        'bg-white border-r w-64 p-6 fixed h-full top-0 left-0 z-50 transform transition-transform duration-300 shadow-lg',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex justify-between items-center mb-6">
        <span class="font-bold text-lg">Menu</span>
        <button @click="sidebarOpen = false" class="text-gray-600 text-xl hover:text-gray-900">✕</button>
      </div>

      <ul class="space-y-2">
        <li v-for="link in filteredLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="block p-2 rounded hover:bg-gray-100 transition"
            @click="sidebarOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </aside>


    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/30 z-40"
        @click="sidebarOpen = false"
      ></div>
    </transition>

  
    <div class="flex-1 flex flex-col min-h-screen">
 
      <div class="flex items-center justify-between bg-white shadow-sm p-4 sticky top-0 z-30">
        <button @click="sidebarOpen = !sidebarOpen" class="text-gray-600 text-2xl hover:text-gray-900">☰</button>
        <button
          @click="logout()"
          class="text-red-600 font-semibold hover:text-red-800 hover:underline transition"
        >
          Logout
        </button>
      </div>

      <header class="bg-white shadow-sm p-3 flex justify-center mb-4">
        <div class="flex items-center gap-5 text-center md:text-left flex-wrap md:flex-nowrap">
          <NuxtLink to="/">
            <img
              src="/images/cac_logo.png"
              alt="Church Logo"
              class="h-24 w-24 object-contain mx-auto md:mx-0 cursor-pointer hover:scale-105 transition"
            />
          </NuxtLink>
          <div class="leading-snug">
            <h1 class="text-2xl font-extrabold tracking-wide">Christ Apostolic Church</h1>
            <p class="text-base font-semibold text-gray-700">Ephphatha District HeadQuarters</p>
            <p class="text-base font-semibold text-gray-700">Fountain Of Life Assembly</p>
          </div>
        </div>
      </header>

    
      <main class="flex-1 p-6 overflow-auto">
        <Toast />
        <NuxtPage />
      </main>


      <footer class="bg-white border-t p-4 text-center text-sm text-gray-500">
        &copy; 2026 Christ Apostolic Church. All rights reserved.
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Toast from 'primevue/toast'

const supabase = useSupabaseClient()
const router = useRouter()

const sidebarOpen = ref(false)
const user = ref(null)
const role = ref('user') 


const links = [
  { label: 'Categories', to: '/categories', roles: ['admin'] },
  { label: 'Income Entry', to: '/entry', roles: ['user', 'admin'] },
  { label: 'User Management', to: '/admin/users', roles: ['admin'] }
]


const filteredLinks = computed(() => {
  return links.filter(link => link.roles.includes(role.value))
})


onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  user.value = data?.user ?? null

  if (user.value) {

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.value.id)
      .single()

    if (!error && profile) role.value = profile.role
  }
})


const logout = async () => {
  await supabase.auth.signOut()
  router.push('/auth/login')
}
</script>

<style scoped>
main::-webkit-scrollbar {
  width: 6px;
}
main::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 3px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

button:focus,
a:focus {
  outline: none;
  ring: 2px;
  ring-color: rgba(59,130,246,0.5);
}

aside ul li a {
  transition: background-color 0.2s;
}
</style>
