<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import SettingsSidebar from '@/features/settings/components/SettingsSidebar.vue'
import { useChurchContent } from '@/features/church/composables/useChurchContent'
import ContentEditor from '@/features/church/components/ContentEditor.vue'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Image,
  FileText,
  Quote,
  Users,
  Tv2,
  Newspaper,
  Share2,
} from 'lucide-vue-next'

const {
  heroContent,
  aboutContent,
  quoteContent,
  ministriesContent,
  featuredSermonContent,
  newsContent,
  socialLinksContent,
  fetchChurchContent,
  updateSection,
} = useChurchContent()

const activeTab = ref('hero')
const isSaving = ref(false)

const tabs = [
  { value: 'hero',           label: 'Hero',            icon: Image,    description: 'Main banner visible at the top of your landing page' },
  { value: 'about',          label: 'About',           icon: FileText, description: 'Vision, mission, values, and beliefs' },
  { value: 'quote',          label: 'Verse / Quote',   icon: Quote,    description: 'Weekly scripture or inspirational quote section' },
  { value: 'ministries',     label: 'Ministries',      icon: Users,    description: 'Ministry groups displayed on your landing page' },
  { value: 'featured_sermon', label: 'Sermon',         icon: Tv2,      description: 'Featured sermon or latest message' },
  { value: 'news',           label: 'News',            icon: Newspaper, description: 'News and announcements for your congregation' },
  { value: 'social_links',   label: 'Social Links',    icon: Share2,   description: 'Facebook, Instagram, YouTube, Twitter, and website links' },
]

const sectionDataMap = {
  hero:            heroContent,
  about:           aboutContent,
  quote:           quoteContent,
  ministries:      ministriesContent,
  featured_sermon: featuredSermonContent,
  news:            newsContent,
  social_links:    socialLinksContent,
}

async function handleSave(data) {
  isSaving.value = true
  try {
    await updateSection(data.section, data.content, data.files)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchChurchContent()
})
</script>

<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-foreground">Settings</h1>
        <p class="text-muted-foreground mt-2">Manage system settings and configuration</p>
      </div>

      <div class="grid gap-6 md:grid-cols-[280px_1fr]">
        <SettingsSidebar />

        <div class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-foreground">Content Management</h2>
            <p class="text-muted-foreground mt-1">
              Manage the content that appears on your church's landing page
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Landing Page Content</CardTitle>
              <CardDescription>
                Changes are saved per section and reflected immediately on your church's landing page.
                Programs, Events, Pastors, and Service Times are managed through their own dedicated sections.
              </CardDescription>
            </CardHeader>
          </Card>

          <TabsRoot v-model="activeTab">
            <!-- Tab triggers -->
            <TabsList class="flex flex-wrap h-auto gap-1 bg-muted p-1 rounded-lg">
              <TabsTrigger
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                class="flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <component :is="tab.icon" class="h-3.5 w-3.5 flex-shrink-0" />
                {{ tab.label }}
              </TabsTrigger>
            </TabsList>

            <!-- Tab panels -->
            <TabsContent
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              class="mt-6"
            >
              <ContentEditor
                :section="tab.value"
                :title="tab.label"
                :description="tab.description"
                :initial-data="sectionDataMap[tab.value]?.value ?? sectionDataMap[tab.value]"
                :is-saving="isSaving"
                @save="handleSave"
              />
            </TabsContent>
          </TabsRoot>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
