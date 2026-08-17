<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import GeographyFields from '@/components/geography/GeographyFields.vue'
import api from '@/services/api'
import { useCountriesStore } from '@/stores/country'
import { showToast } from '@/utils/toast'

const props = defineProps({
  open: Boolean,
  church: { type: Object, default: null },
})
const emit = defineEmits(['update:open', 'created', 'updated', 'saved'])
const loading = ref(false)
const hydrating = ref(false)
const countriesStore = useCountriesStore()
const { countries, error: countriesError } = storeToRefs(countriesStore)
const isEditing = computed(() => Boolean(props.church?.uuid))

function emptyForm() {
  return {
    name: '',
    medium_name: '',
    short_name: '',
    country_id: '',
    region_id: '',
    district_id: '',
    city_id: '',
    postal_code_id: '',
    address: '',
    digital_address: '',
    phone: '',
    email: '',
    website: '',
    subscription_status: 'trial',
    initial_admin: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  }
}

const form = reactive(emptyForm())
const location = computed({
  get: () => ({
    country_id: form.country_id,
    region_id: form.region_id,
    district_id: form.district_id,
    city_id: form.city_id,
    postal_code_id: form.postal_code_id,
  }),
  set: (value) => Object.assign(form, value),
})

function churchFormValues(church) {
  return {
    name: church.name ?? '',
    medium_name: church.medium_name ?? '',
    short_name: church.short_name ?? '',
    country_id: church.country_id ?? '',
    region_id: church.region_id ?? '',
    district_id: church.district_id ?? '',
    city_id: church.city_id ?? '',
    postal_code_id: church.postal_code_id ?? '',
    address: church.address ?? '',
    digital_address: church.digital_address ?? '',
    phone: church.phone ?? '',
    email: church.email ?? '',
    website: church.website ?? '',
    subscription_status: church.subscription_status ?? 'trial',
    initial_admin: {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  }
}

async function loadCountries() {
  if (countries.value.length) return
  await countriesStore.fetchCountries({ perPage: 250, is_active: true })
}

watch(
  [() => props.open, () => props.church],
  async ([open, church]) => {
    if (!open) return

    hydrating.value = true
    Object.assign(form, church ? churchFormValues(church) : emptyForm())

    try {
      await loadCountries()
    } finally {
      hydrating.value = false
    }
  },
  { immediate: true },
)

async function submit() {
  loading.value = true
  try {
    const payload = isEditing.value
      ? Object.fromEntries(Object.entries(form).filter(([key]) => key !== 'initial_admin'))
      : form
    const { data } = isEditing.value
      ? await api.put(`/admin/churches/${props.church.uuid}`, payload)
      : await api.post('/admin/churches', payload)

    showToast.success(data.message)
    emit(isEditing.value ? 'updated' : 'created', data.data.church)
    emit('saved', data.data.church)
    emit('update:open', false)
  } catch (error) {
    showToast.error(
      error.response?.data?.message || `Could not ${isEditing.value ? 'update' : 'create'} church.`,
    )
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent
      side="right"
      class="w-[96vw] max-w-none overflow-y-auto sm:w-[92vw] sm:max-w-none lg:w-[86vw] xl:w-[1280px] 2xl:w-[1500px]"
    >
      <SheetHeader>
        <SheetTitle>
          {{ isEditing ? `Edit ${church.name}` : 'Create church and initial administrator' }}
        </SheetTitle>
      </SheetHeader>
      <form class="space-y-8 py-6" @submit.prevent="submit">
        <section class="space-y-4">
          <h3 class="font-semibold">Church identity</h3>
          <div class="grid gap-4 md:grid-cols-3">
            <div><Label>Name</Label><Input v-model="form.name" required /></div>
            <div><Label>Medium name</Label><Input v-model="form.medium_name" /></div>
            <div><Label>Short name</Label><Input v-model="form.short_name" /></div>
          </div>
          <div class="grid gap-4 md:grid-cols-3">
            <div><Label>Phone</Label><Input v-model="form.phone" /></div>
            <div><Label>Email</Label><Input v-model="form.email" type="email" /></div>
            <div><Label>Website</Label><Input v-model="form.website" type="url" /></div>
          </div>
        </section>
        <section class="space-y-4">
          <h3 class="font-semibold">Location</h3>
          <GeographyFields v-model="location" include-district allow-create required />
          <p v-if="countriesError" class="text-xs text-destructive">{{ countriesError }}</p>
          <div class="grid gap-4 md:grid-cols-2">
            <div><Label>Digital address</Label><Input v-model="form.digital_address" /></div>
            <div><Label>Street address</Label><Input v-model="form.address" /></div>
          </div>
        </section>
        <section v-if="!isEditing" class="space-y-4">
          <h3 class="font-semibold">Initial church administrator</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <Label>First name</Label><Input v-model="form.initial_admin.first_name" required />
            </div>
            <div>
              <Label>Last name</Label><Input v-model="form.initial_admin.last_name" required />
            </div>
            <div><Label>Phone</Label><Input v-model="form.initial_admin.phone" required /></div>
            <div><Label>Email</Label><Input v-model="form.initial_admin.email" type="email" /></div>
            <div>
              <Label>Password (optional)</Label
              ><Input v-model="form.initial_admin.password" type="password" />
            </div>
            <div>
              <Label>Confirm password</Label
              ><Input v-model="form.initial_admin.password_confirmation" type="password" />
            </div>
          </div>
          <p class="text-sm text-muted-foreground">
            When no password is supplied, a temporary password is generated and must be changed on
            first sign-in.
          </p>
        </section>
        <SheetFooter class="sticky bottom-0 border-t bg-background py-4"
          ><Button type="button" variant="outline" @click="emit('update:open', false)"
            >Cancel</Button
          ><Button type="submit" :disabled="loading">{{
            loading
              ? isEditing
                ? 'Saving...'
                : 'Creating...'
              : isEditing
                ? 'Save changes'
                : 'Create church'
          }}</Button></SheetFooter
        >
      </form>
    </SheetContent>
  </Sheet>
</template>
