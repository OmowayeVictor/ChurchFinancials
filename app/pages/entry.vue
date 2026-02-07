<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">

      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Entries</h2>
        <button @click="goToIncome()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + Create Income
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(entry, index) in entries" :key="entry.id" class="hover:bg-gray-50 transition"
              @click="navigateEntry(entry)">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ entry.id }}</td>


              <td class="px-6 py-4 whitespace-nowrap" ">
                <span
                  :class="entry.income_status === 'success'
                    ? 'px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800' :
                    entry.income_status === null
                      ? 'px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800'
                      : 'px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-500'"
                >
                  {{ entry.income_status === 'success' ? 'Closed' : entry.income_status === null ? 'Open' : 'N/A' }}
                </span>
              </td>


              <td class=" px-6 py-4 whitespace-nowrap">
                <span :class="entry.expenses_status === 'success'
                  ? 'px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800'
                  : entry.expenses_status === null
                    ? 'px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800'
                    : 'px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-500'">
                  {{ entry.expenses_status === 'success' ? 'Closed' : entry.expenses_status === null ? 'Open' : 'N/A' }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatDate(entry.created_at) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <button @click.stop="confirmDelete(entry.id)"
                  class="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="loading" class="mt-4 text-center text-gray-500">
          Loading entries...
        </div>
        <div v-if="!loading && !entries.length" class="mt-4 text-center text-gray-500">
          No entries found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'app' })

const supabase = useSupabaseClient()
const toast = useToast()
const router = useRouter()
const loading = ref(true)
const entries = ref([])

const fetchEntries = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not load entries', life: 3000 })
  } else {
    entries.value = data
  }
  loading.value = false
}

onMounted(fetchEntries)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateStr).toLocaleString('en-NG', options)
}

const goToIncome = (entryId = null) => {
  router.push({ path: '/create_entry', query: { entry: entryId } })
}

const navigateEntry = (entry) => {
  if (entry.income_status === null && entry.expenses_status === null) {
    router.push({ path: '/create_entry', query: { entry: entry.id } })
  } else if (entry.income_status !== 'success' || entry.expenses_status !== 'success') {
    router.push({ path: '/edit_entry', query: { entry: entry.id } })
  } else {
    router.push({ path: '/summary', query: { entry: entry.id } })
  }
}


const confirmDelete = async (entryId) => {
  if (!confirm(`Are you sure you want to delete entry #${entryId}? This will delete all incomes and expenses for this entry.`)) return

  loading.value = true
  try {

    const { error: incomeError } = await supabase.from('incomes').delete().eq('entry_id', entryId)
    if (incomeError) throw incomeError


    const { error: expenseError } = await supabase.from('expenses').delete().eq('entry_id', entryId)
    if (expenseError) throw expenseError


    const { error: entryError } = await supabase.from('entries').delete().eq('id', entryId)
    if (entryError) throw entryError

    toast.add({ severity: 'success', summary: 'Deleted', detail: `Entry #${entryId} deleted`, life: 3000 })
    fetchEntries()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to delete entry', life: 3000 })
  } finally {
    loading.value = false
  }
}
</script>
