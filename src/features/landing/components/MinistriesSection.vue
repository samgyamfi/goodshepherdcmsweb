<script setup>
import MinistryCard from './MinistryCard.vue'

defineProps({
  ministries: { type: Array, default: () => [] },
  isDefault: { type: Boolean, default: false },
})
</script>

<template>
  <section
    v-if="ministries.length > 0 || !isDefault"
    id="ministries"
    class="py-20 lg:py-32 bg-gradient-to-b from-amber-50 to-slate-50"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto">
        <span class="text-amber-500 font-medium text-sm uppercase tracking-wider">Get Involved</span>
        <h2 class="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight">
          Our Ministries
        </h2>
        <p class="mt-6 text-lg text-slate-600 leading-relaxed">
          Discover meaningful ways to connect, serve, and grow within our church community.
        </p>
      </div>

      <!-- Ministry Grid -->
      <div v-if="ministries.length > 0" class="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <MinistryCard
          v-for="ministry in ministries"
          :key="ministry.title"
          :ministry="ministry"
        />
      </div>

      <!-- Authenticated empty state -->
      <div v-else class="mt-16 text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <p class="text-slate-500">No ministries configured yet. Add them in Content Management → Ministries.</p>
      </div>
    </div>
  </section>
</template>
