<script setup>
defineProps({
  ministry: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="scroll-animate group bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
    <!-- Image -->
    <div class="aspect-video overflow-hidden">
      <img
        :src="ministry.image"
        :alt="ministry.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
    </div>

    <!-- Content -->
    <div class="p-6">
      <h3 class="font-serif text-xl font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
        {{ ministry.title }}
      </h3>
      <p class="mt-3 text-slate-600 leading-relaxed">
        {{ ministry.description }}
      </p>
    </div>
  </article>
</template>
