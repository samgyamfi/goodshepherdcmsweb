<script setup>
import { useRouter } from 'vue-router'
import DashboardLayout from '@/features/dashboard/components/DashboardLayout.vue'
import SettingsSidebar from '../components/SettingsSidebar.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { settingsLinks } from '../config/settingsLinks'

const router = useRouter()

function navigateTo(path) {
  router.push(path)
}
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
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Choose a section from the menu to manage your settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-4 md:grid-cols-2">
                <a
                  v-for="link in settingsLinks"
                  :key="link.id"
                  :href="link.path"
                  class="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
                  @click.prevent="navigateTo(link.path)"
                >
                  <div class="rounded-lg bg-primary/10 p-2">
                    <component :is="link.icon" class="h-6 w-6 text-primary" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold">{{ link.name }}</h3>
                    <p class="text-sm text-muted-foreground mt-1">
                      {{ link.description }}
                    </p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
