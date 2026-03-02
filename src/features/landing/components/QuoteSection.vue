<script setup>
// Skinny component - static verse content
</script>

<template>
  <section class="relative py-24 lg:py-32 flex items-center justify-center min-h-[60vh]">
    <!-- Background -->
    <div class="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80"
        alt="Nature with sunlight"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-slate-900/75"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p class="text-slate-300 text-sm uppercase tracking-wider font-medium">
        Verse of the week
      </p>
      <h3 class="mt-4 font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight">
        Matthew 7:8
      </h3>
      <p class="mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight tracking-tight">
        For everyone who asks receives; the one who seeks finds
      </p>
    </div>
  </section>
</template>
