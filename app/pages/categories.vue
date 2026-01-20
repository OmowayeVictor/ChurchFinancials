<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
      <!-- Header with Button -->
      <div class="px-6 py-4 border-b flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-gray-800">Categories</h2>
        <button @click="openCreateModal()"
          class="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
          + New Category
        </button>
      </div>


      <div class="overflow-x-auto relative">

        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-b-4 border-gray-200"></div>
        </div>

        <table class="min-w-full divide-y divide-gray-200 opacity-90">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(category, index) in categories" :key="category.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{ category.category_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="category.category_status === 'active' ? 'px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800' : 'px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800'">
                  {{ category.category_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap flex gap-3">

                <button @click="openEditModal(category)" class="text-blue-600 hover:text-blue-800"
                  title="Edit category">
                  <i class="pi pi-pencil text-lg"></i>
                </button>


                <button v-if="category.category_status === 'inactive'" @click="openDeleteModal(category)"
                  class="text-red-600 hover:text-red-800" title="Delete category">
                  <i class="pi pi-trash text-lg"></i>
                </button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>


    <CreateModal v-if="modalType === 'create'" :show="showModal" @close="showModal = false"
      @submit="handleNewCategory" />
    <DeleteModal v-if="modalType === 'delete'" :show="showModal" :category="categoryToDelete" @close="showModal = false"
      @confirm="handleDeleteCategory" />
    <EditModal v-if="modalType === 'edit'" :show="showModal" :category="categoryToEdit" @close="closeModal"
      @submit="handleEditCategory" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import CreateModal from '~/components/createCategoryModal.vue'
import DeleteModal from '~/components/deleteCategoryModal.vue'
import EditModal from '~/components/editCategoryModal.vue'

definePageMeta({
  layout: 'app'
})

const supabase = useSupabaseClient()

const toast = useToast()

const categories = ref([])
const categoryToDelete = ref(null)
const categoryToEdit = ref(null)


const loading = ref(true)
const showModal = ref(false)
const modalType = ref(null)



const openCreateModal = () => {
  modalType.value = 'create'
  showModal.value = true
}
const openEditModal = (category) => {
  categoryToEdit.value = { ...category }
  modalType.value = 'edit'
  showModal.value = true
}

const openDeleteModal = (category) => {
  categoryToDelete.value = category
  modalType.value = 'delete'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  modalType.value = null
  categoryToDelete.value = null
  categoryToEdit.value = null
}

const handleDeleteCategory = async () => {
  loading.value = true

  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryToDelete.value.id)

    if (error) throw error;


    categories.value = categories.value.filter(
      c => c.id !== categoryToDelete.value.id
    )
    toast.add({
      severity: 'success',
      summary: 'Deleted',
      detail: 'Category deleted successfully',
      life: 3000
    })


    showModal.value = false
    categoryToDelete.value = null
    loading.value = false

  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete category',
      life: 3000
    })
  }

}

const fetchCategories = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from("categories")
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Could not fetch categories', life: 3000 })
  } else {
    categories.value = data
  }
  loading.value = false
}

const handleEditCategory = async (updatedCategory) => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        category_name: updatedCategory.name,
        category_status: updatedCategory.status,
        type: updatedCategory.type
      })
      .eq('id', updatedCategory.id)
      .select()
      .single()
      .order('id', { ascending: false })

    if (error) throw error

    const index = categories.value.findIndex(c => c.id === data.id)
    if (index !== -1) categories.value[index] = data

    toast.add({
      severity: 'success',
      summary: 'Updated',
      detail: 'Category updated successfully',
      life: 3000
    })
    closeModal()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.message || 'Failed to update category',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const handleNewCategory = async (category) => {
  loading.value = true

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        category_name: category.name,
        category_status: category.status,
        type: category.type
      })
      .select()
      .single()

    if (error) throw error

    categories.value.unshift(data)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Category created successfully',
      life: 3000
    })

    closeModal()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.message || 'Could not create category',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

//Nuxt Functions
onMounted(async () => {
  await fetchCategories()
})
</script>
