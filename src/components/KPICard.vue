<template>
  <div class="kpi-card" :class="`kpi-${color}`">
    <div class="kpi-header">
      <span class="kpi-icon">{{ icon }}</span>
      <span class="kpi-label">{{ label }}</span>
    </div>
    <div class="kpi-value">{{ value }}</div>
    <div v-if="subtitle" class="kpi-subtitle">{{ subtitle }}</div>
    <div v-if="trend" class="kpi-trend" :class="{ positive: trend > 0, negative: trend < 0 }">
      {{ trend > 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}%
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  value: [String, Number],
  subtitle: String,
  color: {
    type: String,
    default: 'primary'
  },
  trend: Number
})
</script>

<style scoped>
.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid var(--ds-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.kpi-primary {
  border-left-color: #033569;
}

.kpi-success {
  border-left-color: #198754;
}

.kpi-warning {
  border-left-color: #ffc107;
}

.kpi-danger {
  border-left-color: #dc3545;
}

.kpi-info {
  border-left-color: #0dcaf0;
}

.kpi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.kpi-icon {
  font-size: 24px;
}

.kpi-label {
  font-size: 12px;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  color: #033569;
  line-height: 1;
  margin-bottom: 8px;
}

.kpi-subtitle {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 8px;
}

.kpi-trend {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  width: fit-content;
}

.kpi-trend.positive {
  background-color: #d1e7dd;
  color: #0f5132;
}

.kpi-trend.negative {
  background-color: #f8d7da;
  color: #842029;
}
</style>
