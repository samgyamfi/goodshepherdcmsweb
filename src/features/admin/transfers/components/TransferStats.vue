<script setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeftRight, CheckCircle, XCircle, Clock } from 'lucide-vue-next'

defineProps({
  stats: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="grid gap-4 md:grid-cols-4">
    <!-- Pending -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Pending Requests</CardTitle>
        <Clock class="h-4 w-4 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.pending ?? 0 }}</div>
        <p class="text-xs text-muted-foreground">Awaiting admin action</p>
      </CardContent>
    </Card>

    <!-- Approved -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Approved</CardTitle>
        <CheckCircle class="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.approved ?? 0 }}</div>
        <p class="text-xs text-muted-foreground">Successfully transferred</p>
      </CardContent>
    </Card>

    <!-- Rejected -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Rejected</CardTitle>
        <XCircle class="h-4 w-4 text-destructive" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.rejected ?? 0 }}</div>
        <p class="text-xs text-muted-foreground">Declined by admin</p>
      </CardContent>
    </Card>

    <!-- Total -->
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Requests</CardTitle>
        <ArrowLeftRight class="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ stats.total ?? 0 }}</div>
        <p class="text-xs text-muted-foreground">All-time transfers</p>
      </CardContent>
    </Card>
  </div>
</template>
