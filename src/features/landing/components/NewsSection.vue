<script setup>
import NewsCard from './NewsCard.vue'

defineProps({
  news: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <section id="news" class="py-20 lg:py-32 bg-slate-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <h2 class="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight">
        Trending News
      </h2>

      <!-- News Cards Grid -->
      <div class="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <NewsCard
          v-for="item in news"
          :key="item.title"
          :item="item"
        />
      </div>

      <!-- View All Button -->
      <div class="mt-12 text-center">
        <a
          href="#news"
          class="inline-flex items-center px-8 py-3 border border-slate-600 text-white font-medium rounded-lg hover:bg-slate-800 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        >
          View All
        </a>
      </div>
    </div>
  </section>
</template>
