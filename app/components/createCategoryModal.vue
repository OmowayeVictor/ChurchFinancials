<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Create New Category</h2>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block font-semibold mb-1">Category Name</label>
            <input
              v-model="category.name"
              type="text"
              class="w-full border rounded p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label class="block font-semibold mb-1">Status</label>
            <select
              v-model="category.status"
              class="w-full border rounded p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold mb-1">Type</label>
            <select
              v-model="category.type"
              class="w-full border rounded p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="income">Income</option>
              <option value="expenses">Expense</option>
            </select>
          </div>

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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
});
const emit = defineEmits(['close', 'submit']);

import { reactive, toRefs } from 'vue';

const category = reactive({
  name: '',
  status: 'inactive',
  type: 'income',
});

const submitForm = () => {
  emit('submit', { ...category });
  // reset form
  category.name = '';
  category.status = 'active';
  category.type = 'income';
  emit('close');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
