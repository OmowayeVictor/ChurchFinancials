<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">


      <div class="flex justify-between mb-4 items-center">
        <h2 class="text-2xl font-semibold">Record {{ type }}</h2>
        <NuxtLink to="/entry" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Back
        </NuxtLink>
      </div>


      <div v-if="activeEntryId" class="mb-4 p-4 rounded bg-blue-100 text-blue-800 font-semibold">
        Active Entry Session: <span class="font-bold">#{{ activeEntryId }}</span>
      </div>


      <div v-if="activeEntryId" class="flex gap-2 mb-4">
        <button v-if="activeEntry.income_status === null" :class="type === 'income' ? activeTabClass : inactiveTabClass"
          @click="type = 'income'">
          Income
        </button>
        <button v-if="activeEntry.expenses_status === null"
          :class="type === 'expenses' ? activeTabClass : inactiveTabClass" @click="type = 'expenses'">
          Expenses
        </button>
      </div>


      <form v-if="activeEntryId && (activeEntry.income_status === null || activeEntry.expenses_status === null)"
        @submit.prevent="submitEntry" class="space-y-4">

        <div v-for="cat in incomeCategories" :key="cat.id" class="flex items-center gap-4">
          <label class="w-1/2 font-semibold text-gray-700">{{ cat.category_name }}</label>
          <input v-model="amounts[cat.id]" type="number" step="0.01" min="0" placeholder="0.00"
            class="w-1/2 border rounded p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500" />
        </div>


        <div>
          <label class="block font-semibold mb-1">Inputed By</label>
          <input v-model="inputedBy" type="text" required placeholder="e.g. Church Accountant"
            class="w-full border rounded p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500" />
        </div>


        <div>
          <label class="block font-semibold mb-1">Date</label>
          <input v-model="date" type="date" required
            class="w-full border rounded p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500" />
        </div>


        <div class="flex justify-between pt-6">

          <button type="submit" :disabled="loading"
            class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
            Save {{ type }}
          </button>


          <button v-if="activeEntryId" type="button" @click="closeSession"
            class="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60" :disabled="loading">
            Close Session
          </button>
        </div>
      </form>


      <div v-else class="text-center text-gray-500 mt-8">
        All entries completed or session closed.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'app' })

const supabase = useSupabaseClient()
const toast = useToast()

const loading = ref(false)
const type = ref('income')
const activeTabClass = 'px-4 py-2 rounded bg-blue-600 text-white font-semibold'
const inactiveTabClass = 'px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300'

const activeEntryId = ref(null)
const activeEntry = ref({ income_status: null, expenses_status: null })

const incomeCategories = ref([])
const amounts = ref({})
const date = ref(new Date().toISOString().slice(0, 10))
const inputedBy = ref('')

watch(type, fetchCategories)

async function fetchCategories() {
  if (!activeEntryId.value) return

  const { data, error } = await supabase
    .from('categories')
    .select('id, category_name')
    .eq('type', type.value)
    .eq('category_status', 'active')
    .order('category_name')

  if (!error && data) {
    incomeCategories.value = data
    data.forEach(cat => (amounts.value[cat.id] = null))
  }
}

async function getOrCreateEntry() {
  const { data: entry, error } = await supabase
    .from('entries')
    .select('*')
    .or('income_status.is.null,expenses_status.is.null')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not fetch entry', life: 3000 })
    return
  }

  if (entry) {
    activeEntryId.value = entry.id
    activeEntry.value = entry
    if (entry.income_status === null) type.value = 'income'
    else if (entry.expenses_status === null) type.value = 'expenses'
  } else {
    const { data: newEntry, error: createError } = await supabase
      .from('entries')
      .insert({ income_status: null, expenses_status: null })
      .select()
      .single()

    if (createError) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Could not create entry session', life: 3000 })
      return
    }

    activeEntryId.value = newEntry.id
    activeEntry.value = newEntry
    type.value = 'income'
  }

  await fetchCategories()
}

async function submitEntry() {
  loading.value = true
  if (!activeEntryId.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No active entry session', life: 3000 })
    loading.value = false
    return
  }

  const rows = Object.entries(amounts.value)
    .filter(([_, amount]) => amount && amount > 0)
    .map(([category_id, amount]) => ({
      entry_id: activeEntryId.value,
      category_id,
      amount: parseFloat(amount),
      inputed_by: inputedBy.value
    }))

  if (!rows.length) {
    toast.add({ severity: 'warn', summary: 'No Data', detail: `Enter at least one ${type.value} amount`, life: 3000 })
    loading.value = false
    return
  }

  try {
    const tableName = type.value === 'income' ? 'incomes' : 'expenses'

    const { error: insertError } = await supabasefrom(tableName).insert(rows)
    if (insertError) throw insertError

    toast.add({ severity: 'success', summary: 'Success', detail: `${type.value} saved successfully`, life: 3000 })

    Object.keys(amounts.value).forEach(k => (amounts.value[k] = null))
    inputedBy.value = ''
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to save entry', life: 3000 })
  } finally {
    loading.value = false
  }
}

async function closeSession() {
  if (!activeEntryId.value) return
  loading.value = true
  try {
    const update = {}


    if (type.value === 'income' && activeEntry.value.income_status === null) {
      update.income_status = 'success'
    } else if (type.value === 'expenses' && activeEntry.value.expenses_status === null) {
      update.expenses_status = 'success'
    }

    if (Object.keys(update).length === 0) {
      toast.add({ severity: 'warn', summary: 'Nothing to Close', detail: `${type.value} already closed`, life: 3000 })
      loading.value = false
      return
    }

    const { error } = await supabase
      .from('entries')
      .update(update)
      .eq('id', activeEntryId.value)

    if (error) throw error

    toast.add({ severity: 'success', summary: 'Success', detail: `${type.value} session closed`, life: 3000 })


    const { data: updatedEntry } = await supabase.from('entries').select('*').eq('id', activeEntryId.value).single()
    activeEntry.value = updatedEntry

    if (updatedEntry.income_status && updatedEntry.expenses_status) {
      activeEntryId.value = null
    }

  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to close session', life: 3000 })
  } finally {
    loading.value = false
  }
}


onMounted(getOrCreateEntry)
</script>
