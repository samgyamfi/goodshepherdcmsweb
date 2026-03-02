<script setup>
import { useSmoothScroll } from '../composables/useSmoothScroll'
import { useChurchStore } from '@/stores/church'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const churchStore = useChurchStore()
const { siteSettings } = storeToRefs(churchStore)
const defaultVerse = ref({
  reference: 'Matthew 18:20`',
  text: 'For where two or three gather in my name, there am I with them.',
})
const defaultTitle = ref('Bible Engaged, Spirit Empowered, Mission Focused')
const defaultBackgroundImage = ref(
  'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80',
)

const { scrollTo } = useSmoothScroll()
</script>

<template>
  <section class="relative min-h-[90vh] flex items-center justify-center">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img
        :src="siteSettings.hero_management?.background_image ?? defaultBackgroundImage"
        alt="Church interior with natural light"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-slate-900/70"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1
        class="font-serif text-4xl sm:text-5xl lg:text-7xl font-semibold text-white tracking-tight leading-tight animate-fade-in"
      >
        {{ siteSettings.hero_management?.title ?? defaultTitle }}
      </h1>
      <p
        class="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay"
      >
        {{ siteSettings.hero_management?.verse?.text ?? defaultVerse.text }}
        <span class="block mt-2 text-base text-slate-400"
          >— {{ siteSettings.hero_management?.verse?.reference ?? defaultVerse.reference }}</span
        >
      </p>
      <a
        href="#services"
        class="mt-10 inline-flex items-center px-8 py-4 bg-amber-500 text-white font-semibold text-lg rounded-lg hover:bg-amber-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 animate-fade-in-delay-2"
        @click="scrollTo($event, '#services')"
      >
        Join Us This Sunday
      </a>
    </div>
  </section>
</template>
