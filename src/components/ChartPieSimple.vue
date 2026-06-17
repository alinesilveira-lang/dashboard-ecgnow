<template>
  <div class="chart-container">
    <svg viewBox="0 0 120 120" class="pie-chart">
      <g v-for="(segment, i) in segments" :key="i">
        <path
          :d="segment.path"
          :fill="colors[i]"
          class="segment"
        />
      </g>
    </svg>
    <div class="legend">
      <div v-for="(item, i) in items" :key="i" class="legend-item">
        <span class="dot" :style="{ backgroundColor: colors[i] }"></span>
        <span class="label">{{ item.label }}</span>
        <span class="value">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: Array,
  colors: {
    type: Array,
    default: () => ['#198754', '#ffc107', '#dc3545', '#6c757d']
  }
})

const segments = computed(() => {
  const total = props.items.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return []

  let currentAngle = -Math.PI / 2
  const result = []

  props.items.forEach(item => {
    const sliceAngle = (item.value / total) * 2 * Math.PI
    const endAngle = currentAngle + sliceAngle

    const x1 = 60 + 50 * Math.cos(currentAngle)
    const y1 = 60 + 50 * Math.sin(currentAngle)
    const x2 = 60 + 50 * Math.cos(endAngle)
    const y2 = 60 + 50 * Math.sin(endAngle)

    const largeArc = sliceAngle > Math.PI ? 1 : 0
    const path = `M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`

    result.push({ path })
    currentAngle = endAngle
  })

  return result
})
</script>

<style scoped>
.chart-container {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px;
}

.pie-chart {
  width: 180px;
  height: 180px;
  transform: rotate(-90deg);
}

.segment {
  stroke-width: 8;
  stroke-linecap: round;
  transition: all 0.3s ease;
}

.segment:hover {
  filter: brightness(1.1);
  stroke-width: 10;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.label {
  color: #6c757d;
  font-weight: 500;
  flex: 1;
}

.value {
  color: #033569;
  font-weight: 700;
  min-width: 30px;
  text-align: right;
}
</style>
