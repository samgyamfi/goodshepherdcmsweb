<script setup>
import GroupContentPage from '../components/content/GroupContentPage.vue'

defineProps({ group: { type: Object, required: true } })
</script>

<template>
  <GroupContentPage
    :group-uuid="group.uuid"
    type="announcements"
    title="Announcements"
    description="Publish timely updates for group members."
    :can-manage="group.capabilities.manage_content && !group.is_archived"
  />
</template>
