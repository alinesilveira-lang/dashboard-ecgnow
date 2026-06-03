<script setup>
import { ref } from 'vue'

defineProps({
  isLoading: Boolean,
  error: String
})

const emit = defineEmits(['login'])
const password = ref('')

const handleSubmit = () => {
  if (password.value.trim()) {
    emit('login', password.value)
    password.value = ''
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    handleSubmit()
  }
}
</script>

<template>
  <div class="auth-overlay">
    <div class="auth-modal ds-card">
      <div class="ds-card-header text-center">
        <h2 class="ds-card-title">Dashboard ECGNOW</h2>
        <p class="ds-page-subtitle">Indicadores Acadêmicos</p>
      </div>

      <div class="ds-card-body text-center">
        <p class="text-muted mb-4">Digite a senha para acessar o dashboard</p>

        <div v-if="error" class="alert ds-alert ds-alert-danger mb-3">
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="ds-form-group">
            <input
              v-model="password"
              type="password"
              class="form-control ds-input"
              placeholder="Senha"
              :disabled="isLoading"
              @keydown="handleKeydown"
              autofocus
            />
          </div>

          <button
            type="submit"
            class="btn ds-btn ds-btn-primary w-100"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <p class="text-muted text-sm mt-3">
          Dados confidenciais - Acesso restrito
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.auth-modal {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
}

.text-sm {
  font-size: 12px;
}
</style>
