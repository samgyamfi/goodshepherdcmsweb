<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, Lock } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth/auth'
import { showToast } from '@/utils/toast'

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const passwordConfirmation = ref('')
const showPassword = ref(false)
const showConfirmation = ref(false)
const localError = ref('')

const isLoading = computed(() => authStore.isLoading)

const isValid = computed(() =>
  password.value.length >= 8
  && /[a-z]/.test(password.value)
  && /[A-Z]/.test(password.value)
  && /\d/.test(password.value)
  && password.value === passwordConfirmation.value,
)

async function handleSubmit() {
  localError.value = ''

  if (!isValid.value) {
    localError.value = 'Use at least 8 characters with uppercase, lowercase, and a number. Passwords must match.'
    return
  }

  const success = await authStore.setInitialPassword({
    password: password.value,
    password_confirmation: passwordConfirmation.value,
  })

  if (!success) {
    showToast.error(authStore.error || 'Could not set password')
    return
  }

  showToast.success('Password set. Please sign in again.')
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
    <section class="w-full max-w-md rounded-lg border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div class="mb-6">
        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Lock class="h-6 w-6" />
        </div>
        <h1 class="text-2xl font-semibold">Set your password</h1>
        <p class="mt-2 text-sm text-slate-300">
          Your account was created with a temporary system password. Set your own password before continuing.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label for="password" class="text-sm font-medium text-slate-200">New password</label>
          <div class="relative">
            <Input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              class="pr-10 bg-white/10 border-white/20 text-white"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <label for="password_confirmation" class="text-sm font-medium text-slate-200">Confirm password</label>
          <div class="relative">
            <Input
              id="password_confirmation"
              v-model="passwordConfirmation"
              :type="showConfirmation ? 'text' : 'password'"
              autocomplete="new-password"
              class="pr-10 bg-white/10 border-white/20 text-white"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"
              @click="showConfirmation = !showConfirmation"
            >
              <EyeOff v-if="showConfirmation" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <p v-if="localError" class="text-sm text-red-300">
          {{ localError }}
        </p>

        <Button type="submit" class="w-full" :disabled="isLoading">
          {{ isLoading ? 'Saving...' : 'Set password' }}
        </Button>
      </form>
    </section>
  </main>
</template>
