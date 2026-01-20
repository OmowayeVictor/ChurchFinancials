<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
 

    <section class="flex-1 flex items-center justify-center text-center px-6 lg:px-8">
      <div class="space-y-6">
        <h2 class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Simplify Church Finances
        </h2>
        <p class="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Track income and expenses with ease. Make data-driven decisions for your church with our easy-to-use service.
        </p>
      </div>
    </section>


  <section class="bg-white py-16">
  <div
    class="max-w-6xl mx-auto px-6 lg:px-8
           grid grid-cols-1 sm:grid-cols-3 gap-12
           place-items-center text-center"
  >
    <div class="p-6 rounded-lg shadow hover:shadow-lg transition bg-gray-50 max-w-sm w-full">
      <i class="pi pi-chart-line text-5xl text-blue-600 mb-4"></i>
      <h3 class="text-xl font-semibold mb-2">Track Income & Expenses</h3>
      <p class="text-gray-600">
        Manage all church transactions and see summaries at a glance.
      </p>
    </div>
  </div>
</section>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'app'
})
</script>

<style scoped>

section:first-of-type {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}


section.bg-white div:hover {
  transform: translateY(-3px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>
