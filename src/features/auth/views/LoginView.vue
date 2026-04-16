<script setup>
import AppLogo from '@/components/common/AppLogo.vue'
import { useLogin } from '../composables/useLogin'

const appName = import.meta.env.VITE_APP_NAME ?? 'Assemblies of God Ghana'
const authBgImage = import.meta.env.VITE_AUTH_BG_IMAGE ?? 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80'

const {
  identifier,
  password,
  showPassword,
  isLoading,
  error,
  isFormValid,
  togglePassword,
  handleLogin,
  goToForgotPassword,
} = useLogin()
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Image -->
    <div class="hidden lg:flex lg:w-1/2 relative">
      <img
        :src="authBgImage"
        alt="Church community"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-slate-900/60"></div>
      
      <!-- Overlay Content -->
      <div class="relative z-10 flex flex-col justify-end p-12">
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-lg">
          <h2 class="text-3xl font-bold text-white leading-tight">
            Real Insights. Real Voices. Real Lives.
          </h2>
          <p class="mt-4 text-slate-200 leading-relaxed">
            Your secure dashboard tracks trends, manages members, and helps you 
            serve—while protecting every member's information.
          </p>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex flex-col bg-slate-900">
      <div class="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <!-- Logo -->
        <div class="mb-12">
          <AppLogo size="md" variant="light" />
        </div>

        <!-- Login Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-amber-400 tracking-tight">LOGIN</h1>
          <p class="mt-2 text-slate-400">
            Welcome, let's get you back right where you left off!
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email/Phone Input -->
          <div>
            <label for="identifier" class="block text-sm font-medium text-slate-300 mb-2">
              Email or Phone
            </label>
            <input
              id="identifier"
              v-model="identifier"
              type="text"
              placeholder="Enter your email or phone"
              autocomplete="username"
              class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors pr-12"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                @click="togglePassword"
              >
                <!-- Eye icon (hidden) -->
                <svg
                  v-if="showPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
                <!-- Eye icon (visible) -->
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Forgot Password -->
          <div class="flex justify-end">
            <button
              type="button"
              class="text-sm text-amber-400 hover:text-amber-300 transition-colors"
              @click="goToForgotPassword"
            >
              Forgot password?
            </button>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="!isFormValid || isLoading"
            class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-blue-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
            <span v-else>Login</span>
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="px-8 sm:px-16 lg:px-24 py-6 text-center">
        <p class="text-slate-500 text-sm">
          &copy; {{ new Date().getFullYear() }} {{ appName }}. All Rights Reserved.
        </p>
      </div>
    </div>
  </div>
</template>
