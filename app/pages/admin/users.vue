<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">User Management</h1>


    <div class="bg-white rounded-2xl shadow overflow-x-auto">
      <table class="w-full text-sm min-w-[700px]">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-3 font-medium text-gray-600">Display Name</th>
            <th class="p-3 font-medium text-gray-600">Role</th>
            <th class="p-3 font-medium text-gray-600">Created</th>
            <th class="p-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.user_id" class="border-t hover:bg-gray-50 transition">

            <td class="p-3">
              <input v-model="user.display_name" @blur="updateDisplayName(user)" @keyup.enter="updateDisplayName(user)"
                class="w-full border border-gray-300 rounded px-2 py-1
                       focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Enter name" />
            </td>


            <td class="p-3 capitalize text-gray-700">
              {{ user.role }}
            </td>

            <td class="p-3 text-gray-500">
              {{ new Date(user.created_at).toLocaleDateString() }}
            </td>

            <td class="p-3">
              <select v-model="user.role" @change="updateRole(user)" class="border border-gray-300 rounded px-2 py-1
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-white">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <transition name="fade">
      <div v-if="message" :class="[
        'fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg border',
        messageType === 'error'
          ? 'bg-red-50 border-red-300 text-red-700'
          : 'bg-green-50 border-green-300 text-green-700'
      ]">
        {{ message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({ layout: 'app' })

const supabase = useSupabaseClient()

const users = ref([])
const message = ref('')
const messageType = ref('success')

const notify = (type, text) => {
  messageType.value = type
  message.value = text
  setTimeout(() => (message.value = ''), 2500)
}

const loadUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, display_name, role, created_at')
    .order('created_at', { ascending: false })

  if (!error) users.value = data
}

const updateRole = async (user) => {
  const { error } = await supabase
    .from('profiles')
    .update({ role: user.role })
    .eq('user_id', user.user_id)

  if (error) {
    notify('error', 'Failed to update role')
    return
  }

  notify('success', `Role updated to ${user.role}`)
}

const updateDisplayName = async (user) => {
  if (!user.display_name?.trim()) return

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: user.display_name.trim() })
    .eq('user_id', user.user_id)

  if (error) {
    notify('error', 'Failed to update display name')
    return
  }

  notify('success', 'Display name updated')
}

onMounted(loadUsers)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

div.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

div.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 3px;
}
</style>
