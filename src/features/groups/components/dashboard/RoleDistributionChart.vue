<script setup>
import { computed } from 'vue'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Legend, Tooltip)

const props = defineProps({
  distribution: { type: Object, default: () => ({}) },
})

const chartData = computed(() => ({
  labels: Object.keys(props.distribution).map((role) => role.replaceAll('_', ' ')),
  datasets: [
    {
      data: Object.values(props.distribution),
      backgroundColor: ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2'],
      borderWidth: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true, boxWidth: 8 },
    },
  },
}
</script>

<template>
  <div class="h-72">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>
