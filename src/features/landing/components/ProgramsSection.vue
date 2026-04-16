<script setup>
defineProps({
  programs: { type: Array, default: () => [] },
})
</script>

<template>
  <section id="programs" class="py-16 lg:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-slate-900">Our Programs</h2>
        <p class="mt-4 text-lg text-slate-600">Join us for these regular activities</p>
      </div>

      <div v-if="programs.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="program in programs" :key="program.id" 
             class="bg-slate-50 rounded-lg p-6 hover:bg-slate-100 transition-colors">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-900">{{ program.name }}</h3>
              <p v-if="program.description" class="mt-2 text-sm text-slate-600">{{ program.description }}</p>
              <div class="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                <span v-if="program.day_of_week" class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ program.day_of_week }}
                </span>
                <span v-if="program.time" class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ program.time }}
                </span>
              </div>
              <p v-if="program.location" class="mt-2 text-xs text-slate-500">{{ program.location }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-slate-600">Programs will be displayed here</p>
      </div>
    </div>
  </section>
</template>
