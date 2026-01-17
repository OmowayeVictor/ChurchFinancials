<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">

      <!-- Back button + Dashboard title -->
      <div class="flex justify-between items-center mb-6">
        <button
          @click="goBack"
          class="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          ← Back
        </button>
        <h2 class="text-2xl font-semibold">Entry Dashboard</h2>
      </div>

      <div class="mb-6">
        <p class="text-gray-700">
          <span class="font-semibold">Entry ID:</span> {{ entryId }}
        </p>
        <p class="text-gray-700">
          <span class="font-semibold">Status:</span> Closed
        </p>
      </div>

      <!-- Income Summary -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2">Income Summary</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Income</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(cat, index) in incomeSummary" :key="cat.category_id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ index + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ cat.category_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatAmount(cat.total) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="!loading && !incomeSummary.length" class="mt-2 text-gray-500 text-sm">No income recorded for this entry.</div>
        </div>
        <p class="font-semibold text-lg text-right mt-2">Total Income: {{ formatAmount(totalIncome) }}</p>
      </div>

      <!-- Expenses Summary -->
      <div class="mb-6">
        <h3 class="text-xl font-semibold mb-2">Expenses Summary</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expenses</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(cat, index) in expensesSummary" :key="cat.category_id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ index + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ cat.category_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatAmount(cat.total) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="!loading && !expensesSummary.length" class="mt-2 text-gray-500 text-sm">No expenses recorded for this entry.</div>
        </div>
        <p class="font-semibold text-lg text-right mt-2">Total Expenses: {{ formatAmount(totalExpenses) }}</p>
      </div>

      <!-- Net Total -->
      <div class="mt-6 text-right">
        <p class="font-bold text-xl">Net Total (Income - Expenses): {{ formatAmount(netTotal) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'

definePageMeta({ layout: 'app' })

const { $supabase } = useNuxtApp()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const entryId = route.query.entry || null
const loading = ref(true)

// Income
const incomeSummary = ref([])
const totalIncome = ref(0)

// Expenses
const expensesSummary = ref([])
const totalExpenses = ref(0)

const netTotal = ref(0)

if (!entryId) {
  toast.add({ severity: 'error', summary: 'Error', detail: 'No entry selected', life: 3000 })
}

const fetchSummary = async () => {
  loading.value = true
  try {
    // Income
    const { data: incomeData, error: incomeError } = await $supabase
      .from('incomes')
      .select('category_id, amount, categories(category_name)')
      .eq('entry_id', entryId)
    if (incomeError) throw incomeError

    const incomeMap = {}
    incomeData.forEach(item => {
      const catId = item.category_id
      if (!incomeMap[catId]) incomeMap[catId] = { category_id: catId, category_name: item.categories.category_name, total: 0 }
      incomeMap[catId].total += parseFloat(item.amount)
    })
    incomeSummary.value = Object.values(incomeMap)
    totalIncome.value = incomeSummary.value.reduce((acc, curr) => acc + curr.total, 0)

    // Expenses
    const { data: expensesData, error: expensesError } = await $supabase
      .from('expenses')
      .select('category_id, amount, categories(category_name)')
      .eq('entry_id', entryId)
    if (expensesError) throw expensesError

    const expensesMap = {}
    expensesData.forEach(item => {
      const catId = item.category_id
      if (!expensesMap[catId]) expensesMap[catId] = { category_id: catId, category_name: item.categories.category_name, total: 0 }
      expensesMap[catId].total += parseFloat(item.amount)
    })
    expensesSummary.value = Object.values(expensesMap)
    totalExpenses.value = expensesSummary.value.reduce((acc, curr) => acc + curr.total, 0)

    // Net total
    netTotal.value = totalIncome.value - totalExpenses.value

  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to fetch summary', life: 3000 })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (entryId) fetchSummary()
})

const formatAmount = (amt) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(amt)
}

const goBack = () => {
  router.push('/income_entry')
}
</script>
