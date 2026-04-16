<script setup>
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Settings, Globe } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-500/10 shrink-0">
        <Settings class="h-5 w-5 text-slate-500" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-foreground">System Settings</h1>
        <p class="text-sm text-muted-foreground">Global platform configuration and defaults</p>
      </div>
    </div>

    <!-- Coming soon -->
    <Card class="border-dashed">
      <CardHeader class="text-center pb-2">
        <div class="flex justify-center mb-4">
          <div class="h-14 w-14 rounded-full bg-slate-500/10 flex items-center justify-center">
            <Globe class="h-7 w-7 text-slate-500" />
          </div>
        </div>
        <CardTitle class="text-lg">Coming Soon</CardTitle>
        <CardDescription class="max-w-md mx-auto text-sm">
          System Settings will allow you to dynamically configure default landing page content,
          platform-wide branding, feature flags, notification templates, and more — replacing the
          current static
          <code class="font-mono text-xs bg-muted px-1 py-0.5 rounded">config/landing.php</code>
          file with a live admin interface.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center gap-3 pb-8 flex-wrap">
        <div
          v-for="item in [
            'Default Landing Content',
            'Platform Branding',
            'Feature Flags',
            'Email Templates',
            'Countries & Languages',
          ]"
          :key="item"
          class="rounded-lg border bg-muted/50 px-3 py-2 text-xs text-muted-foreground"
        >
          {{ item }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
