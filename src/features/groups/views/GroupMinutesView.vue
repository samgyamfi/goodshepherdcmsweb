<script setup>
import GroupContentPage from '../components/content/GroupContentPage.vue'

defineProps({ group: { type: Object, required: true } })
</script>

<template>
  <GroupContentPage
    :group-uuid="group.uuid"
    type="minutes"
    title="Meeting minutes"
    description="Published decisions, notes, and action points."
    :can-manage="group.capabilities.manage_content && !group.is_archived"
  />
</template>
