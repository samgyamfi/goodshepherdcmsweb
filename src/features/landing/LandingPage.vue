<script setup>
// Section components
import TheNavbar from '@/features/landing/layout/TheNavbar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import MinistriesSection from './components/MinistriesSection.vue'
import SermonsSection from './components/SermonsSection.vue'
import QuoteSection from './components/QuoteSection.vue'
import NewsSection from './components/NewsSection.vue'
import EventsSection from './components/EventsSection.vue'
import TheFooter from './layout/TheFooter.vue'

// Composables
import { useLandingData } from './composables/useLandingData'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// Get static data from composable
const { services, ministries, news, navLinks } = useLandingData()

// Initialize scroll animations
useScrollAnimation()
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <TheNavbar :links="navLinks" />
    <HeroSection />
    <AboutSection />
    <ServicesSection :services="services" />
    <MinistriesSection :ministries="ministries" />
    <SermonsSection />
    <QuoteSection />
    <NewsSection :news="news" />
    <EventsSection />
    <TheFooter />
  </div>
</template>
