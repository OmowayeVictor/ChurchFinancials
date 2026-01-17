<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Edit Category</h2>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block font-semibold mb-1">Category Name</label>
            <input
              v-model="localCategory.name"
              type="text"
              class="w-full border rounded p-2 bg-white text-gray-800
                     focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block font-semibold mb-1">Status</label>
            <select
              v-model="localCategory.status"
              class="w-full border rounded p-2 bg-white text-gray-800
                     focus:ring-2 focus:ring-blue-500"
              :disabled="isActive"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Type -->
          <div>
            <label class="block font-semibold mb-1">Type</label>
            <select
              v-model="localCategory.type"
              class="w-full border rounded p-2 bg-white text-gray-800
                     focus:ring-2 focus:ring-blue-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded border hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue'
import { useToast } from 'primevue/usetoast'

defineProps({
  show: Boolean,
  category: Object
})

defineEmits(['close', 'submit'])

const toast = useToast()
const localCategory = ref({ name: '', status: '', type: '' })

// If category prop changes, update local form values
watch(
  () => category,
  (val) => {
    if (val) localCategory.value = { ...val }
  },
  { immediate: true }
)

// Disable status select if category is active
const isActive = computed(() => localCategory.value.status === 'active')

const submitForm = () => {
  if (!localCategory.value.name) {
    toast.add({ severity: 'warn', summary: 'Validation', detail: 'Name is required', life: 3000 })
    return
  }
  // emit updated category to parent
  $emit('submit', { ...localCategory.value })
}
</script>
