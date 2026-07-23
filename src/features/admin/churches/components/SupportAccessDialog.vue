<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSupportAccessStore } from '@/stores/supportAccess'
import { showToast } from '@/utils/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Clock3, KeyRound, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  open: { type: Boolean, default: false },
  church: { type: Object, default: null },
})
const emit = defineEmits(['update:open'])
const router = useRouter()
const supportStore = useSupportAccessStore()
const challenge = ref(null)
const code = ref('')
const destination = ref('')
const seconds = ref(60)
const durationOptions = ref([])
const durationMinutes = ref('60')
const inactivityMinutes = ref(15)
let timer = null

const canVerify = computed(() => code.value.length === 6 && seconds.value > 0)

watch(
  () => props.open,
  async (open) => {
    if (!open || !props.church) return
    reset()
    try {
      const options = await supportStore.fetchOptions()
      durationOptions.value = options.durations || [60]
      durationMinutes.value = String(options.default_duration || durationOptions.value[0])
      inactivityMinutes.value = options.inactivity_timeout || 15
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Could not load support access options.')
      emit('update:open', false)
    }
  },
)

async function requestCode() {
  try {
    const data = await supportStore.start(props.church.uuid, Number(durationMinutes.value))
    challenge.value = data.session
    destination.value = data.destination
    startTimer()
  } catch (error) {
    showToast.error(error.response?.data?.message || 'Could not start support access.')
  }
}

function durationLabel(minutes) {
  if (minutes < 60) return `${minutes} minutes`
  const hours = minutes / 60
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
}

async function verify() {
  try {
    await supportStore.verify(challenge.value.uuid, code.value)
    emit('update:open', false)
    showToast.success(`Support access started for ${props.church.name}.`)
    router.push({ name: 'church-admin-dashboard' })
  } catch (error) {
    showToast.error(error.response?.data?.errors?.code?.[0] || 'Verification failed.')
  }
}

async function resend() {
  try {
    const data = await supportStore.resend(challenge.value.uuid)
    challenge.value = data.session
    destination.value = data.destination
    code.value = ''
    seconds.value = 60
    startTimer()
  } catch (error) {
    showToast.error(error.response?.data?.message || 'Could not resend the code.')
  }
}

function startTimer() {
  clearInterval(timer)
  timer = setInterval(() => {
    if (seconds.value > 0) seconds.value -= 1
    else clearInterval(timer)
  }, 1000)
}

function reset() {
  clearInterval(timer)
  challenge.value = null
  code.value = ''
  destination.value = ''
  seconds.value = 60
  durationOptions.value = []
  durationMinutes.value = '60'
}

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10">
          <KeyRound class="h-5 w-5 text-amber-600" />
        </div>
        <DialogTitle>{{
          challenge ? 'Verify support access' : 'Configure support access'
        }}</DialogTitle>
        <DialogDescription>
          <template v-if="challenge"
            >Enter the code sent to {{ destination }} to access {{ church?.name }}.</template
          >
          <template v-else
            >Choose how long you need temporary church-admin access to {{ church?.name }}.</template
          >
        </DialogDescription>
      </DialogHeader>
      <div v-if="!challenge" class="space-y-3 py-3">
        <Label for="support-duration">Session duration</Label>
        <Select v-model="durationMinutes">
          <SelectTrigger id="support-duration" class="w-full">
            <Clock3 class="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="minutes in durationOptions" :key="minutes" :value="String(minutes)">
              {{ durationLabel(minutes) }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p class="text-xs text-muted-foreground">
          The session still ends after {{ inactivityMinutes }} minutes of inactivity.
        </p>
      </div>
      <div v-else class="space-y-3 py-3">
        <Input
          v-model="code"
          inputmode="numeric"
          maxlength="6"
          autocomplete="one-time-code"
          placeholder="000000"
          class="h-12 text-center text-xl font-semibold tabular-nums"
          @input="code = code.replace(/\D/g, '').slice(0, 6)"
          @keyup.enter="canVerify && verify()"
        />
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <span>Code expires in {{ seconds }} seconds</span>
          <Button
            variant="link"
            size="sm"
            class="h-auto p-0"
            :disabled="seconds > 0"
            @click="resend"
            >Resend code</Button
          >
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Cancel</Button>
        <Button
          v-if="!challenge"
          :disabled="!durationMinutes || supportStore.loading"
          @click="requestCode"
        >
          <Loader2 v-if="supportStore.loading" class="mr-2 h-4 w-4 animate-spin" />
          Send verification code
        </Button>
        <Button v-else :disabled="!canVerify || supportStore.loading" @click="verify">
          <Loader2 v-if="supportStore.loading" class="mr-2 h-4 w-4 animate-spin" />
          Verify and enter
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
