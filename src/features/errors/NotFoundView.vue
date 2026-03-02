<script setup>
import { useRouter } from 'vue-router'
import AppLogo from '@/components/common/AppLogo.vue'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
    <!-- Logo -->
    <div class="mb-8">
      <AppLogo size="lg" variant="dark" />
    </div>

    <div class="text-center">
      <!-- 404 Number -->
      <h1 class="text-9xl font-bold text-slate-200">404</h1>
      
      <!-- Message -->
      <h2 class="mt-4 text-2xl font-bold text-slate-900">Page Not Found</h2>
      <p class="mt-2 text-slate-600 max-w-md mx-auto">
        Sorry, we couldn't find the page you're looking for. 
        It might have been moved or doesn't exist.
      </p>

      <!-- Actions -->
      <div class="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          class="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
          @click="goBack"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>
