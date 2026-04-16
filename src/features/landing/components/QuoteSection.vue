<script setup>
defineProps({
  content: {
    type: Object,
    default: () => ({
      verse_reference: null,
      verse_text: null,
      background_image: null,
    }),
  },
})
</script>

<template>
  <section
    v-if="content.verse_text"
    class="relative py-24 lg:py-32 flex items-center justify-center min-h-[60vh] overflow-hidden"
  >
    <!-- Background: image with overlay or gradient fallback -->
    <template v-if="content.background_image">
      <img
        :src="content.background_image"
        alt="Quote background"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-slate-900/75"></div>
    </template>
    <div v-else class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900"></div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p class="text-slate-300 text-sm uppercase tracking-wider font-medium">
        Verse of the Week
      </p>
      <h3 v-if="content.verse_reference" class="mt-4 font-serif text-2xl sm:text-3xl font-semibold text-amber-400 tracking-tight">
        {{ content.verse_reference }}
      </h3>
      <p class="mt-6 font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight tracking-tight">
        "{{ content.verse_text }}"
      </p>
    </div>
  </section>
</template>
