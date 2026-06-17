<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">{{ title }}</h3>
      <p class="chart-subtitle">{{ subtitle }}</p>
    </div>
    <div class="chart-body">
      <canvas :id="`chart-${id}`"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'

defineProps({
  id: String,
  title: String,
  subtitle: String,
  type: {
    type: String,
    default: 'doughnut'
  },
  labels: Array,
  data: Array,
  backgroundColor: Array,
  borderColor: Array
})

onMounted(() => {
  const ctx = document.getElementById(`chart-${props.id}`)
  if (ctx) {
    new Chart(ctx, {
      type: props.type,
      data: {
        labels: props.labels,
        datasets: [{
          data: props.data,
          backgroundColor: props.backgroundColor,
          borderColor: props.borderColor || '#ffffff',
          borderWidth: 2,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12, family: "'Inter', sans-serif" },
              color: '#212529',
              padding: 15,
              usePointStyle: true
            }
          }
        }
      }
    })
  }
})
</script>

<style scoped>
.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.chart-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 16px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #033569;
  margin: 0 0 4px 0;
}

.chart-subtitle {
  font-size: 13px;
  color: #6c757d;
  margin: 0;
}

.chart-body {
  position: relative;
  height: 300px;
}
</style>
