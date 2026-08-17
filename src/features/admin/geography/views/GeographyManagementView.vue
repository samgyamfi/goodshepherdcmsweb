<script setup>
import { computed, ref } from 'vue'
import { MapPinned } from 'lucide-vue-next'
import { TabsList, TabsRoot, TabsTrigger } from '@/components/ui/tabs'
import GeographyTab from '../components/GeographyTab.vue'

const active = ref('countries')
const tabs = [
  { type: 'countries', label: 'Country', tabLabel: 'Countries' },
  {
    type: 'regions',
    label: 'Region',
    tabLabel: 'Regions',
    parentType: 'countries',
    parentLabel: 'Country',
  },
  {
    type: 'districts',
    label: 'District',
    tabLabel: 'Districts',
    parentType: 'regions',
    parentLabel: 'Region',
  },
  {
    type: 'cities',
    label: 'City',
    tabLabel: 'Cities',
    parentType: 'regions',
    parentLabel: 'Region',
  },
  {
    type: 'postal-codes',
    label: 'Postal code',
    tabLabel: 'Postal codes',
    parentType: 'cities',
    parentLabel: 'City',
  },
]
const currentTab = computed(() => tabs.find((tab) => tab.type === active.value) || tabs[0])
</script>

<template>
  <div class="space-y-6">
    <header class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
        <MapPinned class="h-5 w-5 text-primary" />
      </div>
      <div>
        <h1 class="text-xl font-bold">Geography</h1>
        <p class="text-sm text-muted-foreground">
          Manage canonical locations used across churches and member profiles.
        </p>
      </div>
    </header>
    <TabsRoot v-model="active">
      <TabsList class="max-w-full justify-start overflow-x-auto">
        <TabsTrigger v-for="tab in tabs" :key="tab.type" :value="tab.type">{{
          tab.tabLabel
        }}</TabsTrigger>
      </TabsList>
    </TabsRoot>
    <GeographyTab :key="currentTab.type" v-bind="currentTab" />
  </div>
</template>
