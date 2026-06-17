<script setup>
defineProps({
  modules: Array,
  studentName: String
})

const emit = defineEmits(['select', 'logout'])

const moduleIcons = {
  modulo1: '📊',
  modulo2: '⚡',
  modulo3: '❤️',
  modulo4: '💫',
  modulo5: '🔗',
  modulo6: '📈',
  modulo7: '🌊'
}
</script>

<template>
  <div class="module-selector">
    <div class="selector-header ds-card">
      <div class="header-top">
        <h1 class="selector-title">Escolha seu Módulo</h1>
        <button @click="$emit('logout')" class="ds-btn ds-btn-sm ds-btn-outline">
          Sair
        </button>
      </div>
      <p class="selector-subtitle">Olá, {{ studentName }}! Qual módulo deseja estudar?</p>
    </div>

    <div class="modules-grid">
      <button
        v-for="module in modules"
        :key="module.key"
        @click="$emit('select', module.key)"
        class="module-card ds-card"
      >
        <div class="module-icon">{{ moduleIcons[module.key] || '📚' }}</div>
        <h3 class="module-title">{{ module.title }}</h3>
        <p class="module-description">{{ module.description }}</p>
        <p class="module-questions">{{ module.questions.length }} perguntas →</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.module-selector {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-lg);
}

.selector-header {
  padding: var(--ds-space-xl);
  border-radius: var(--ds-radius-lg);
  background: white;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--ds-space-md);
}

.selector-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--ds-primary);
  margin: 0;
}

.selector-subtitle {
  color: var(--ds-text-secondary);
  font-size: 1rem;
  margin: 0;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--ds-space-lg);
}

.module-card {
  padding: var(--ds-space-lg);
  border-radius: var(--ds-radius-lg);
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  text-align: center;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--ds-primary);
}

.module-icon {
  font-size: 3rem;
  margin-bottom: var(--ds-space-md);
}

.module-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ds-primary);
  margin: 0 0 var(--ds-space-sm) 0;
}

.module-description {
  font-size: 0.9rem;
  color: var(--ds-text-secondary);
  margin: 0 0 var(--ds-space-md) 0;
  line-height: 1.5;
}

.module-questions {
  font-size: 0.85rem;
  color: var(--ds-primary);
  font-weight: 600;
  margin: 0;
}

.ds-btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.ds-btn-outline {
  background: transparent;
  border: 1px solid var(--ds-border);
  color: var(--ds-text-primary);
}

.ds-btn-outline:hover {
  background: var(--ds-bg-hover);
}

@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: 1fr;
  }

  .header-top {
    flex-direction: column;
    gap: var(--ds-space-md);
    align-items: flex-start;
  }
}
</style>
