<script setup>
import GroupContentPage from '../components/content/GroupContentPage.vue'

defineProps({ group: { type: Object, required: true } })
</script>

<template>
  <GroupContentPage
    :group-uuid="group.uuid"
    type="notices"
    title="Direct notices"
    description="Private notices sent to individual group members."
    :can-manage="group.capabilities.manage_notices && !group.is_archived"
  />
</template>
