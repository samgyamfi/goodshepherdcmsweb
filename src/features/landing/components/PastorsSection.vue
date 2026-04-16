<script setup>
import { UserRound } from 'lucide-vue-next'

defineProps({
  pastors: { type: Array, default: () => [] },
})
</script>

<template>
  <section v-if="pastors.length > 0" id="pastors" class="py-16 lg:py-20 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="text-amber-500 font-medium text-sm uppercase tracking-wider">Leadership</span>
        <h2 class="mt-4 text-3xl lg:text-4xl font-bold text-slate-900">Our Pastors</h2>
        <p class="mt-4 text-lg text-slate-600">Meet our spiritual leaders</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="pastor in pastors"
          :key="pastor.id"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
        >
          <!-- Photo -->
          <div class="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
            <img
              v-if="pastor.photo_url"
              :src="pastor.photo_url"
              :alt="pastor.full_name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <UserRound v-else class="w-16 h-16 text-amber-400 opacity-70" />
          </div>

          <!-- Info -->
          <div class="p-6">
            <span class="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              {{ pastor.title }}
            </span>
            <h3 class="mt-2 text-xl font-semibold text-slate-900">{{ pastor.full_name }}</h3>
            <p v-if="pastor.specialty" class="mt-1 text-sm text-amber-600 font-medium">{{ pastor.specialty }}</p>
            <p v-if="pastor.bio" class="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
              {{ pastor.bio }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
