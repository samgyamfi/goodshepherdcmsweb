<script setup>
import { computed, watchEffect } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useNameGradient } from '@/composables/useNameGradient'

const props = defineProps({
  images: { type: Array, default: () => [] },
  name: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})

const [emblaRef, emblaApi] = useEmblaCarousel({ loop: props.images.length > 1 })
const { gradientFor, initialsFor } = useNameGradient()
const hasImages = computed(() => props.images.length > 0)

watchEffect(() => emblaApi.value?.reInit({ loop: props.images.length > 1 }))
</script>

<template>
  <div
    class="group/media relative overflow-hidden bg-muted"
    :class="compact ? 'aspect-[16/9]' : 'aspect-[16/7] min-h-56'"
  >
    <div v-if="hasImages" ref="emblaRef" class="h-full overflow-hidden">
      <div class="flex h-full touch-pan-y">
        <div v-for="image in images" :key="image.uuid" class="min-w-0 flex-[0_0_100%]">
          <img
            :src="image.preview_url"
            :alt="`${name} flyer`"
            class="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex h-full min-h-48 items-center justify-center"
      :style="{ background: gradientFor(name) }"
    >
      <span class="text-4xl font-bold text-white/95 sm:text-5xl">{{ initialsFor(name) }}</span>
    </div>
    <template v-if="images.length > 1">
      <Button
        type="button"
        size="icon"
        variant="secondary"
        class="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 opacity-90"
        title="Previous image"
        @click.stop="emblaApi?.scrollPrev()"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        class="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 opacity-90"
        title="Next image"
        @click.stop="emblaApi?.scrollNext()"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </template>
  </div>
</template>
