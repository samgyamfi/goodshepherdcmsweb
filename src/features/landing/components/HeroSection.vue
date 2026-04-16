<script setup>
import { computed } from 'vue'
import { useSmoothScroll } from '@/features/landing/composables/useSmoothScroll'

const props = defineProps({
  content: { type: Object, default: () => ({}) },
  mediaItems: { type: Object, default: () => ({}) },
  showDashboardBtn: { type: Boolean, default: false },
})

const { scrollTo } = useSmoothScroll()

const hero = computed(() => props.content)
const backgroundImage = computed(() => props.mediaItems?.background_image ?? hero.value?.background_image ?? null)
</script>

<template>
  <section
    class="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden"
    :class="backgroundImage ? '' : 'bg-gradient-to-br from-amber-500 to-orange-600'"
  >
    <!-- Background image with overlay -->
    <template v-if="backgroundImage">
      <img
        :src="backgroundImage"
        alt="Hero background"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-slate-900/60"></div>
    </template>

    <!-- Content -->
    <div class="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
      <h1 v-if="hero.title" class="text-4xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
        {{ hero.title }}
      </h1>
      <p v-if="hero.subtitle" class="text-xl lg:text-2xl mb-8 opacity-90">
        {{ hero.subtitle }}
      </p>

      <div v-if="hero.verse_reference" class="mb-8">
        <p class="text-lg lg:text-xl italic opacity-90">"{{ hero.verse_text }}"</p>
        <p class="mt-2 font-semibold">— {{ hero.verse_reference }}</p>
      </div>

      <RouterLink
        v-if="showDashboardBtn"
        :to="{ name: 'dashboard' }"
        class="inline-block px-8 py-4 bg-white text-amber-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
      >
        Go to Dashboard
      </RouterLink>
      <a
        v-else-if="hero.button_text"
        href="#contact"
        class="inline-block px-8 py-4 bg-white text-amber-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
        @click="scrollTo($event, '#contact')"
      >
        {{ hero.button_text }}
      </a>
    </div>
  </section>
</template>
