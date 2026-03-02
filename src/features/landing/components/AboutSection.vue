<script setup>
// Skinny component - no logic needed
</script>

<template>
  <section id="about" class="py-20 lg:py-32 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Text Content -->
        <div class="order-2 lg:order-1 animate-slide-in-left">
          <span class="text-amber-500 font-medium text-sm uppercase tracking-wider">
            Welcome
          </span>
          <h2 class="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight">
            A Warm Welcome Awaits You
          </h2>
          <p class="mt-6 text-lg text-slate-600 leading-relaxed">
            The Assemblies of God in Ghana is a vibrant Pentecostal church
            committed to evangelizing the lost, worshiping God, and discipling
            believers. We believe in the power of the Holy Spirit to transform
            lives and communities across Ghana and beyond.
          </p>
          <p class="mt-4 text-lg text-slate-600 leading-relaxed">
            As part of the global Assemblies of God fellowship with over 88
            million believers worldwide, we are united in our mission to see
            every person experience the life-changing power of Jesus Christ.
            Through Spirit-empowered worship and biblical teaching, we equip
            believers for Kingdom work.
          </p>
          <a
            href="#about"
            class="mt-8 inline-flex items-center text-slate-900 font-medium hover:text-amber-600 transition-colors group"
          >
            Learn More About Us
            <svg
              class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        <!-- Image -->
        <div class="order-1 lg:order-2 animate-slide-in-right">
          <img
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80"
            alt="Congregation gathering"
            class="w-full aspect-[4/3] object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  </section>
</template>
