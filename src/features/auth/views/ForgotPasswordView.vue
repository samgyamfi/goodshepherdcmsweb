<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLogo from '@/components/common/AppLogo.vue'

const router = useRouter()
const identifier = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)

async function handleSubmit() {
  if (!identifier.value.trim()) return
  
  isLoading.value = true
  // TODO: Implement forgot password API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false
  isSubmitted.value = true
}

function goToLogin() {
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-900 px-4">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <AppLogo size="lg" variant="light" />
      </div>

      <div class="bg-slate-800 rounded-2xl p-8">
        <template v-if="!isSubmitted">
          <h1 class="text-2xl font-bold text-amber-400">Forgot Password</h1>
          <p class="mt-2 text-slate-400 text-sm">
            Enter your email or phone number and we'll send you a reset link.
          </p>

          <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
            <div>
              <label for="identifier" class="block text-sm font-medium text-slate-300 mb-2">
                Email or Phone
              </label>
              <input
                id="identifier"
                v-model="identifier"
                type="text"
                placeholder="Enter your email or phone"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 bg-gradient-to-r from-amber-500 to-blue-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-blue-700 disabled:opacity-50 transition-all"
            >
              {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>
        </template>

        <template v-else>
          <div class="text-center">
            <div class="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-white">Check Your Inbox</h2>
            <p class="mt-2 text-slate-400 text-sm">
              If an account exists with that email/phone, you'll receive a password reset link.
            </p>
          </div>
        </template>

        <button
          type="button"
          class="mt-6 w-full text-center text-sm text-amber-400 hover:text-amber-300"
          @click="goToLogin"
        >
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>
