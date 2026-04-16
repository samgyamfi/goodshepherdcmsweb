<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLandingPageStore } from '@/stores/landingPage'
import SocialIcon from '../components/SocialIcon.vue'

const landingStore = useLandingPageStore()
const { contact, socialLinks } = storeToRefs(landingStore)

const churchName = computed(
  () =>
    landingStore.data?.church?.name ?? import.meta.env.VITE_APP_NAME ?? 'Assemblies of God Ghana',
)

const activeSocialLinks = computed(() =>
  Object.entries(socialLinks.value ?? {}).filter(([, url]) => !!url),
)

const platformLabels = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  twitter: 'X / Twitter',
  tiktok: 'TikTok',
  website: 'Website',
}
</script>

<template>
  <footer id="contact" class="py-16 lg:py-20 bg-white border-t border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <h3 class="font-serif text-xl font-semibold text-slate-900">{{ churchName }}</h3>
          <p v-if="contact?.address" class="mt-4 text-slate-600 leading-relaxed">
            {{ contact.address }}<span v-if="contact.city">, {{ contact.city }}</span
            ><span v-if="contact.country">, {{ contact.country }}</span>
          </p>

          <!-- Social icons -->
          <div v-if="activeSocialLinks.length" class="mt-6 flex flex-wrap gap-3">
            <a
              v-for="[platform, url] in activeSocialLinks"
              :key="platform"
              :href="url"
              :aria-label="platformLabels[platform] ?? platform"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-amber-500 hover:text-white transition-colors"
            >
              <span class="w-5 h-5">
                <SocialIcon :platform="platform" />
              </span>
            </a>
          </div>
        </div>

        <!-- Service Times -->
        <div>
          <h3 class="font-semibold text-slate-900">Service Times</h3>
          <div v-if="contact?.service_times" class="mt-4 text-slate-600 space-y-2">
            <div v-for="(time, day) in contact.service_times" :key="day">
              <span class="font-medium">{{ day }}:</span> {{ time }}
            </div>
          </div>
          <p v-else class="mt-4 text-slate-500 text-sm">Service times will appear here.</p>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="font-semibold text-slate-900">Contact</h3>
          <div class="mt-4 text-slate-600 space-y-2">
            <p v-if="contact?.phone">{{ contact.phone }}</p>
            <p v-if="contact?.email">
              <a :href="`mailto:${contact.email}`" class="hover:text-amber-600 transition-colors">
                {{ contact.email }}
              </a>
            </p>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-12 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
        <p>&copy; {{ new Date().getFullYear() }} {{ churchName }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
