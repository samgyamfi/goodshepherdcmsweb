<script setup>
import { onMounted, ref } from 'vue'
import { Layers3 } from 'lucide-vue-next'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import TemplatesPanel from '../components/TemplatesPanel.vue'
import DistrictOfficersPanel from '../components/DistrictOfficersPanel.vue'
import { groupAdministrationService } from '../services/groupAdministrationService'

const options = ref({ districts: [], users: [] })

onMounted(async () => {
  const response = await groupAdministrationService.options()
  options.value = response.data.data
})
</script>

<template>
  <div class="space-y-6">
    <header class="flex items-center gap-3">
      <div class="rounded-md bg-primary/10 p-2.5 text-primary"><Layers3 class="h-6 w-6" /></div>
      <div>
        <h1 class="text-2xl font-bold">Group administration</h1>
        <p class="text-sm text-muted-foreground">Templates and district coordination.</p>
      </div>
    </header>
    <TabsRoot default-value="templates">
      <TabsList class="w-full justify-start overflow-x-auto">
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="officers">District officers</TabsTrigger>
      </TabsList>
      <TabsContent value="templates" class="mt-6">
        <TemplatesPanel :districts="options.districts" />
      </TabsContent>
      <TabsContent value="officers" class="mt-6">
        <DistrictOfficersPanel :districts="options.districts" :users="options.users" />
      </TabsContent>
    </TabsRoot>
  </div>
</template>
