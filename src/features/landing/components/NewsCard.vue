<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="scroll-animate group">
    <a href="#" class="block">
      <!-- Image -->
      <div class="aspect-video overflow-hidden rounded-xl">
        <img
          :src="item.image"
          :alt="item.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <!-- Date -->
      <div class="mt-4 flex items-center gap-2 text-slate-400 text-sm">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <time>{{ item.date }}</time>
      </div>

      <!-- Title -->
      <h3 class="mt-3 font-semibold text-white text-lg leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">
        {{ item.title }}
      </h3>

      <!-- Excerpt -->
      <p class="mt-2 text-slate-400 text-sm leading-relaxed line-clamp-2">
        {{ item.excerpt }}
      </p>
    </a>
  </article>
</template>
