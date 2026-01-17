<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">
        Delete Category
      </h3>

      <p class="text-gray-600 mb-6">
        Are you sure you want to delete
        <span class="font-semibold text-gray-900">
          "{{ category?.category_name }}"
        </span>?
        This action cannot be undone.
      </p>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  category: Object
})
</script>
