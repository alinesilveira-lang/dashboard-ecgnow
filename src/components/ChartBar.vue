<template>
  <div class="chart-bar">
    <svg viewBox="0 0 300 200" class="bar-svg">
      <g v-for="(bar, i) in bars" :key="i" class="bar-group">
        <rect
          :x="bar.x"
          :y="bar.y"
          :width="40"
          :height="bar.height"
          :fill="bar.color"
          class="bar-rect"
          rx="4"
        />
        <text
          :x="bar.x + 20"
          :y="180"
          text-anchor="middle"
          class="bar-label"
        >
          {{ bar.label }}
        </text>
        <text
          :x="bar.x + 20"
          :y="bar.y - 5"
          text-anchor="middle"
          class="bar-value"
        >
          {{ bar.value }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: Array,
  colors: {
    type: Array,
    default: () => ['#198754', '#dc3545', '#e9ecef']
  }
})

const bars = computed(() => {
  const maxValue = Math.max(...props.data.map(d => d.value))
  const scale = 120 / maxValue
  const spacing = 300 / props.data.length

  return props.data.map((item, i) => ({
    x: 20 + i * spacing,
    y: 160 - item.value * scale,
    height: item.value * scale,
    label: item.label,
    value: item.value,
    color: props.colors[i]
  }))
})
</script>

<style scoped>
.chart-bar {
  width: 100%;
  height: 250px;
}

.bar-svg {
  width: 100%;
  height: 100%;
}

.bar-rect {
  transition: all 0.3s ease;
  cursor: pointer;
}

.bar-rect:hover {
  filter: brightness(1.1);
}

.bar-label {
  font-size: 12px;
  fill: #6c757d;
  font-weight: 500;
}

.bar-value {
  font-size: 14px;
  fill: #033569;
  font-weight: 700;
}
</style>
