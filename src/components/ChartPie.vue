<template>
  <div class="chart-pie">
    <svg viewBox="0 0 120 120" class="pie-svg">
      <circle
        v-for="(segment, i) in segments"
        :key="i"
        cx="60"
        cy="60"
        r="50"
        :fill="colors[i]"
        :stroke-dasharray="`${segment.arc} ${circumference}`"
        :stroke-dashoffset="`-${segment.offset}`"
        class="pie-segment"
      />
    </svg>
    <div class="pie-legend">
      <div v-for="(item, i) in items" :key="i" class="legend-item">
        <span class="legend-color" :style="{ backgroundColor: colors[i] }"></span>
        <span class="legend-label">{{ item.label }}</span>
        <span class="legend-value">{{ item.value }}</span>
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

const circumference = computed(() => 2 * Math.PI * 50)

const segments = computed(() => {
  const total = props.items.reduce((sum, item) => sum + item.value, 0)
  let offset = 0
  const result = []

  props.items.forEach(item => {
    const percentage = item.value / total
    const arc = circumference.value * percentage
    result.push({ arc, offset })
    offset += arc
  })

  return result
})
</script>

<style scoped>
.chart-pie {
  display: flex;
  align-items: center;
  gap: 32px;
}

.pie-svg {
  width: 200px;
  height: 200px;
  transform: rotate(-90deg);
}

.pie-segment {
  stroke-width: 8;
  stroke-linecap: round;
  transition: all 0.3s ease;
}

.pie-segment:hover {
  filter: brightness(1.1);
  stroke-width: 10;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-label {
  color: #6c757d;
  font-weight: 500;
  flex: 1;
}

.legend-value {
  color: #033569;
  font-weight: 700;
  min-width: 40px;
  text-align: right;
}
</style>
