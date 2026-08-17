<script setup>
import { useRoute } from 'vue-router'
import GroupWall from '../components/wall/GroupWall.vue'

const route = useRoute()
</script>

<template>
  <GroupWall :uuid="route.params.uuid" />
</template>
