<script setup>
import ServiceCard from './ServiceCard.vue'

defineProps({
  services: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <section id="services" class="py-20 lg:py-32 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center max-w-2xl mx-auto">
        <span class="text-amber-500 font-medium text-sm uppercase tracking-wider">
          Join Us
        </span>
        <h2 class="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight">
          Service Times
        </h2>
        <p class="mt-6 text-lg text-slate-600 leading-relaxed">
          We gather throughout the week to worship, learn, and grow together in faith.
        </p>
      </div>

      <!-- Service Cards Grid -->
      <div class="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <ServiceCard
          v-for="service in services"
          :key="service.name"
          :service="service"
        />
      </div>
    </div>
  </section>
</template>
