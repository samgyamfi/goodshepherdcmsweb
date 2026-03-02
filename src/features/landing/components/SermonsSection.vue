<script setup>
// Skinny component - static content
</script>

<template>
  <section id="sermons" class="py-20 lg:py-32 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Image -->
        <div class="animate-slide-in-left">
          <img
            src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?w=800&q=80"
            alt="Pastor preaching sermon"
            class="w-full aspect-video object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        <!-- Content -->
        <div class="animate-slide-in-right">
          <span class="text-amber-500 font-medium text-sm uppercase tracking-wider">
            Featured Message
          </span>
          <h2 class="mt-4 font-serif text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            Walking in Faith Through Uncertainty
          </h2>
          <div class="mt-4 flex items-center gap-4 text-slate-600">
            <span>Pastor David Mitchell</span>
            <span class="w-1 h-1 bg-slate-400 rounded-full"></span>
            <span>January 12, 2026</span>
          </div>
          <p class="mt-6 text-lg text-slate-600 leading-relaxed">
            In times of uncertainty, our faith becomes the anchor that holds
            us steady. Join us as we explore how to trust God's plan even when
            the path ahead seems unclear.
          </p>
          <a
            href="#sermons"
            class="mt-8 inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all duration-300"
          >
            Watch Sermon
            <svg
              class="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
