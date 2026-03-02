<script setup>
import { useSmoothScroll } from '../composables/useSmoothScroll'

const { scrollTo } = useSmoothScroll()
</script>

<template>
  <section id="events" class="relative py-20 lg:py-32 overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=80"
        alt="Church community"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-slate-900/85"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
        You Are Welcome Here
      </h2>
      <p class="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
        No matter where you are on your spiritual journey, there's a place for
        you at Good Shepherd Assemblies of God. Come experience the love of Christ and the
        warmth of genuine community.
      </p>
      <a
        href="#contact"
        class="mt-10 inline-flex items-center px-8 py-4 bg-amber-500 text-white font-semibold text-lg rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        @click="scrollTo($event, '#contact')"
      >
        Plan Your Visit
      </a>
    </div>
  </section>
</template>
