<script setup>
defineProps({
  service: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="scroll-animate bg-white p-8 rounded-2xl border border-slate-200 text-center hover:border-amber-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <!-- Icon -->
    <div class="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-amber-100 text-amber-600">
      <!-- Sun icon -->
      <svg
        v-if="service.icon === 'sun'"
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <!-- Cross icon -->
      <svg
        v-else-if="service.icon === 'cross'"
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m-6-10h12"
        />
      </svg>
      <!-- Book icon -->
      <svg
        v-else-if="service.icon === 'book'"
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    </div>

    <!-- Content -->
    <h3 class="mt-4 font-serif text-xl font-semibold text-slate-900">
      {{ service.name }}
    </h3>
    <p class="mt-2 text-slate-600">{{ service.day }}</p>
    <p class="mt-1 text-2xl font-semibold text-slate-900">
      {{ service.time }}
    </p>
  </article>
</template>
