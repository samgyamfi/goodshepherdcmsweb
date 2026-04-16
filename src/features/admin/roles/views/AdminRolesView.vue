<script setup>
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Lock } from 'lucide-vue-next'
import { UserType } from '@/enums'
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 shrink-0">
        <ShieldCheck class="h-5 w-5 text-rose-500" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-foreground">Roles & Permissions</h1>
        <p class="text-sm text-muted-foreground">Define what each role can access across the platform</p>
      </div>
    </div>

    <!-- Coming soon -->
    <Card class="border-dashed">
      <CardHeader class="text-center pb-2">
        <div class="flex justify-center mb-4">
          <div class="h-14 w-14 rounded-full bg-rose-500/10 flex items-center justify-center">
            <Lock class="h-7 w-7 text-rose-500" />
          </div>
        </div>
        <CardTitle class="text-lg">Coming Soon</CardTitle>
        <CardDescription class="max-w-md mx-auto text-sm">
          Role-based access control management is under active development. You will be able to
          create custom roles, assign granular permissions, and control what each user type can
          access across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex justify-center pb-8">
        <div class="flex flex-wrap justify-center gap-2 max-w-lg">
          <Badge variant="outline" v-for="opt in UserType.asOptions()" :key="opt.value">
            {{ opt.label }}
          </Badge>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
