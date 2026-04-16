<script setup>
import { computed } from 'vue'
import { PlayCircle } from 'lucide-vue-next'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      title: null,
      pastor_name: null,
      date: null,
      description: null,
      image: null,
      video_url: null,
    }),
  },
  isDefault: { type: Boolean, default: false },
})

const hasContent = computed(() => !!props.content?.title)
const shouldShow = computed(() => hasContent.value && !props.isDefault)
</script>

<template>
  <section v-if="shouldShow" id="sermons" class="py-20 lg:py-32 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Image -->
        <div class="animate-slide-in-left">
          <div
            class="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center"
          >
            <img
              v-if="content.image"
              :src="content.image"
              alt="Sermon thumbnail"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <PlayCircle v-else class="w-20 h-20 text-slate-500" />
            <a
              v-if="content.video_url"
              :href="content.video_url"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute inset-0 flex items-center justify-center bg-slate-900/30 hover:bg-slate-900/50 transition-colors"
              aria-label="Watch sermon"
            >
              <PlayCircle class="w-16 h-16 text-white drop-shadow-lg" />
            </a>
          </div>
        </div>

        <!-- Content -->
        <div class="animate-slide-in-right">
          <span class="text-amber-500 font-medium text-sm uppercase tracking-wider">Featured Message</span>
          <h2 class="mt-4 font-serif text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
            {{ content.title }}
          </h2>
          <div class="mt-4 flex flex-wrap items-center gap-2 text-slate-500 text-sm">
            <span v-if="content.pastor_name">{{ content.pastor_name }}</span>
            <span v-if="content.pastor_name && content.date" class="w-1 h-1 bg-slate-400 rounded-full"></span>
            <span v-if="content.date">{{ content.date }}</span>
          </div>
          <p v-if="content.description" class="mt-6 text-lg text-slate-600 leading-relaxed">
            {{ content.description }}
          </p>
          <a
            v-if="content.video_url"
            :href="content.video_url"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
          >
            <PlayCircle class="w-5 h-5" />
            Watch Sermon
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
