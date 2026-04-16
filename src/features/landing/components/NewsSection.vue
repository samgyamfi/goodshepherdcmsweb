<script setup>
import NewsCard from './NewsCard.vue'

defineProps({
  news: { type: Array, default: () => [] },
  title: { type: String, default: 'News & Announcements' },
  isDefault: { type: Boolean, default: false },
})
</script>

<template>
  <section
    v-if="news.length > 0 || !isDefault"
    id="news"
    class="py-20 lg:py-32 bg-slate-900"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <span class="text-amber-400 font-medium text-sm uppercase tracking-wider">Stay Informed</span>
        <h2 class="mt-4 font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          {{ title }}
        </h2>
      </div>

      <!-- News Grid -->
      <div v-if="news.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <NewsCard
          v-for="item in news"
          :key="item.title"
          :item="item"
        />
      </div>

      <!-- Authenticated empty state -->
      <div v-else class="text-center py-12 border border-dashed border-slate-700 rounded-xl">
        <p class="text-slate-500">No news items published yet. Add them in Content Management → News.</p>
      </div>
    </div>
  </section>
</template>
