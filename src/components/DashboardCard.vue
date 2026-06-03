<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: String,
  color: {
    type: String,
    default: 'primary'
  },
  subtitle: String
})
</script>

<template>
  <div class="ds-card dashboard-card" :class="`card-${color}`">
    <div class="d-flex justify-content-between align-items-start">
      <div class="flex-grow-1">
        <p class="card-subtitle text-muted mb-1">{{ title }}</p>
        <h3 class="card-value mb-0">{{ value }}</h3>
        <p v-if="subtitle" class="card-subtext text-muted">{{ subtitle }}</p>
      </div>
      <span v-if="icon" class="card-icon">{{ icon }}</span>
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  border-left: 4px solid;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-primary {
  border-left-color: #033569;
}

.card-success {
  border-left-color: #198754;
}

.card-danger {
  border-left-color: #dc3545;
}

.card-warning {
  border-left-color: #ffc107;
}

.card-info {
  border-left-color: #0dcaf0;
}

.card-subtitle {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #033569;
}

.card-subtext {
  font-size: 12px;
  margin-top: 4px;
}

.card-icon {
  font-size: 32px;
  opacity: 0.5;
}
</style>
