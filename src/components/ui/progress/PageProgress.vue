<script setup>
import { Progress } from '@/components/ui/progress'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visible = ref(false)
const progressValue = ref(0)
let progressInterval = null

const start = () => {
  visible.value = true
  progressValue.value = 0

  progressInterval = setInterval(() => {
    progressValue.value = Math.min(progressValue.value + Math.random() * 15, 90)
  }, 300)
}

const done = () => {
  clearInterval(progressInterval)
  progressValue.value = 100
  setTimeout(() => {
    visible.value = false
    progressValue.value = 0
  }, 400)
}

router.beforeEach(() => start())
router.afterEach(() => done())
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" class="fixed top-0 left-0 right-0 z-[9999] h-1">
      <Progress :value="progressValue" class="h-1 rounded-none" />
    </div>
  </Transition>
</template>
