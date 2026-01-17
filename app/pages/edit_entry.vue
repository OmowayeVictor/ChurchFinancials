<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">

            <!-- Header + Back -->
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold">Edit {{ type }}</h2>
                <NuxtLink to="/entry" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Back
                </NuxtLink>
            </div>

            <!-- Entry Notification -->
            <div v-if="activeEntryId" class="mb-4 p-4 rounded bg-blue-100 text-blue-800 font-semibold">
                Editing Entry Session: <span class="font-bold">#{{ activeEntryId }}</span>
            </div>

            <!-- Edit Form -->
            <form v-if="activeEntryId && openType" @submit.prevent="submitEdit" class="space-y-4">

                <!-- Categories -->
                <div v-for="cat in categories" :key="cat.id" class="flex items-center gap-4">
                    <label class="w-1/2 font-semibold text-gray-700">{{ cat.category_name }}</label>
                    <input v-model="amounts[cat.id]" type="number" step="0.01" min="0" placeholder="0.00"
                        class="w-1/2 border rounded p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500" />
                </div>

                <!-- Inputed By -->
                <div>
                    <label class="block font-semibold mb-1">Inputed By</label>
                    <input v-model="inputedBy" type="text" required placeholder="e.g. Church Accountant"
                        class="w-full border rounded p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500" />
                </div>

                <!-- Date -->
                <div>
                    <label class="block font-semibold mb-1">Date</label>
                    <input v-model="date" type="date" required
                        class="w-full border rounded p-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500" />
                </div>

                <!-- Submit -->
                <div class="flex justify-end pt-6 gap-2">
                    <button type="submit" :disabled="loading"
                        class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60">
                        Save Changes
                    </button>
                    <button type="button" @click="closeSession" :disabled="loading"
                        class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
                        Close Session
                    </button>
                </div>

            </form>

            <div v-else class="text-center text-gray-500 mt-8">
                No editable entry found.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'app' })

const supabase = useSupabaseClient()
const toast = useToast()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const activeEntryId = ref(null)
const activeEntry = ref({})
const type = ref('income') // current editing type
const openType = ref(null) // either 'income' or 'expenses'
const categories = ref([])
const amounts = ref({})
const date = ref(new Date().toISOString().slice(0, 10))
const inputedBy = ref('')

// fetch entry on mount
onMounted(async () => {
    activeEntryId.value = route.query.entry
    if (!activeEntryId.value) return

    const { data: entry, error } = await supabase.from('entries').select('*').eq('id', activeEntryId.value).single()
    if (error || !entry) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Entry not found', life: 3000 })
        return
    }
    activeEntry.value = entry

    // determine which type is still open
    if (!entry.income_status) {
        type.value = 'income'
        openType.value = 'income'
    } else if (!entry.expenses_status) {
        type.value = 'expenses'
        openType.value = 'expenses'
    } else {
        openType.value = null
    }

    if (openType.value) await fetchCategories()
})

async function fetchCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('id, category_name')
        .eq('type', type.value)
        .eq('category_status', 'active')
        .order('category_name')

    if (!error && data) {
        categories.value = data
        // fetch existing amounts for this entry
        const table = type.value === 'income' ? 'incomes' : 'expenses'
        const { data: rows } = await supabase
            .from(table)
            .select('category_id, amount, inputed_by')
            .eq('entry_id', activeEntryId.value)

        rows.forEach(row => amounts.value[row.category_id] = row.amount)
        if (rows.length) inputedBy.value = rows[0].inputed_by
    }
}

// submit edited amounts
async function submitEdit() {
    if (!activeEntryId.value || !openType.value) return
    loading.value = true

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
        const table = type.value === 'income' ? 'incomes' : 'expenses'

        // Upsert: update if exists, insert if not
        const { error } = await supabase.from(table).insert(rows)
        if (error) throw error

        toast.add({ severity: 'success', summary: 'Saved', detail: `${type.value} updated`, life: 3000 })
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to update', life: 3000 })
    } finally {
        loading.value = false
    }
}

// close session for current type only
async function closeSession() {
    if (!activeEntryId.value || !openType.value) return
    loading.value = true
    try {
        const column = openType.value === 'income' ? 'income_status' : 'expenses_status'
        const { error } = await supabase.from('entries').update({ [column]: 'success' }).eq('id', activeEntryId.value)
        if (error) throw error
        toast.add({ severity: 'success', summary: 'Closed', detail: `${openType.value} session closed`, life: 3000 })
        router.push('/entry')
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to close session', life: 3000 })
    } finally {
        loading.value = false
    }
}
</script>
