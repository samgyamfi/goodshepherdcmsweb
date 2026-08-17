<script setup>
import GroupContentPage from '../components/content/GroupContentPage.vue'

defineProps({ group: { type: Object, required: true } })
</script>

<template>
  <GroupContentPage
    :group-uuid="group.uuid"
    type="schedules"
    title="Meeting schedules"
    description="Recurring meeting times, locations, and active periods."
    :can-manage="group.capabilities.manage_schedules && !group.is_archived"
  />
</template>
