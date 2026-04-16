<script setup>
import { useLandingPage } from './composables/useLandingPage'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// Layout
import TheNavbar from './layout/TheNavbar.vue'
import TheFooter from './layout/TheFooter.vue'

// Sections
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import QuoteSection from './components/QuoteSection.vue'
import PastorsSection from './components/PastorsSection.vue'
import MinistriesSection from './components/MinistriesSection.vue'
import ProgramsSection from './components/ProgramsSection.vue'
import EventsSection from './components/EventsSection.vue'
import SermonsSection from './components/SermonsSection.vue'
import NewsSection from './components/NewsSection.vue'

const {
  isLoading,
  isRevalidating,
  isDefault,
  hasCachedData,
  heroContent,
  aboutContent,
  programs,
  events,
  pastors,
  services,
  ministries,
  quote,
  featuredSermon,
  news,
  showDashboardBtn,
  navLinks,
} = useLandingPage()

useScrollAnimation()
</script>

<template>
  <!--
    Cold skeleton: only shown on the very first visit (no cache yet).
    All subsequent visits render from cache instantly.
  -->
  <div v-if="isLoading && !hasCachedData" class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
      <p class="text-slate-600">Loading...</p>
    </div>
  </div>

  <div v-else class="min-h-screen bg-slate-50">
    <!-- Subtle revalidation pill — visible only during background refresh -->
    <Transition name="fade-slide">
      <div
        v-if="isRevalidating"
        class="fixed top-4 right-4 z-[9999] flex items-center gap-2 rounded-full bg-slate-800/90 backdrop-blur-sm px-4 py-2 text-white text-xs font-medium shadow-lg pointer-events-none"
      >
        <span class="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
        Refreshing…
      </div>
    </Transition>

    <!--
      Section order:
      Navbar → Hero → About → Services → Quote →
      Pastors → Ministries → Programs → Events →
      Sermons → News → Footer
    -->
    <TheNavbar :links="navLinks" :show-dashboard-btn="showDashboardBtn" />

    <HeroSection :content="heroContent" :show-dashboard-btn="showDashboardBtn" />

    <AboutSection :content="aboutContent" />

    <ServicesSection
      v-if="services.length > 0 || !isDefault"
      :services="services"
    />

    <QuoteSection :content="quote" />

    <PastorsSection :pastors="pastors" />

    <MinistriesSection :ministries="ministries" :is-default="isDefault" />

    <ProgramsSection
      v-if="programs.length > 0 || !isDefault"
      :programs="programs"
    />

    <EventsSection
      v-if="events.length > 0 || !isDefault"
      :events="events"
    />

    <SermonsSection :content="featuredSermon" :is-default="isDefault" />

    <NewsSection :news="news" :is-default="isDefault" />

    <TheFooter />
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
