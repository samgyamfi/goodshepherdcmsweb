<script setup>
import { RouterLink } from 'vue-router'
import { useSmoothScroll } from '@/features/landing/composables/useSmoothScroll'

defineProps({
  links: {
    type: Array,
    required: true
  }
})

const { mobileOpen, scrollTo, toggleMobile } = useSmoothScroll()
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <a href="#" class="flex items-center gap-3" @click="scrollTo($event, '#')">
          <img
            src="/ag-logo.png"
            alt="Assemblies of God"
            class="h-10 lg:h-12 w-auto"
          />
          <span class="font-semibold text-lg lg:text-xl text-slate-900">
            Good Shepherd A/G
          </span>
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <a
            v-for="link in links"
            :key="link.name"
            :href="link.href"
            class="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
            @click="scrollTo($event, link.href)"
          >
            {{ link.name }}
          </a>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center gap-3">
          <RouterLink
            :to="{ name: 'login' }"
            class="inline-flex items-center px-4 py-2 text-slate-700 font-medium text-sm hover:text-slate-900 transition-colors"
          >
            Login
          </RouterLink>
          <a
            href="#contact"
            class="inline-flex items-center px-5 py-2.5 bg-amber-500 text-white font-medium text-sm rounded-lg hover:bg-amber-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300"
            @click="scrollTo($event, '#contact')"
          >
            Visit Us
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          type="button"
          class="md:hidden p-2 text-slate-600 hover:text-slate-900"
          aria-label="Menu"
          @click="toggleMobile"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileOpen" class="md:hidden border-t border-slate-200">
      <div class="px-4 pt-4 pb-6 space-y-1">
        <a
          v-for="link in links"
          :key="link.name"
          :href="link.href"
          class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          @click="scrollTo($event, link.href)"
        >
          {{ link.name }}
        </a>
        <div class="pt-4 space-y-2">
          <RouterLink
            :to="{ name: 'login' }"
            class="block w-full text-center px-4 py-2 text-slate-700 font-medium hover:text-slate-900"
            @click="toggleMobile"
          >
            Login
          </RouterLink>
          <a
            href="#contact"
            class="block w-full text-center px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600"
            @click="scrollTo($event, '#contact')"
          >
            Visit Us
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
