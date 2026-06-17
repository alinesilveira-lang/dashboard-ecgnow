<script setup>
import { ref } from 'vue'

const studentName = ref('')
const studentEmail = ref('')
const error = ref('')

const emit = defineEmits(['login'])

const handleSubmit = () => {
  error.value = ''

  if (!studentName.value.trim()) {
    error.value = 'Por favor, digite seu nome'
    return
  }

  if (!studentEmail.value.trim()) {
    error.value = 'Por favor, digite seu email'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.value)) {
    error.value = 'Por favor, digite um email válido'
    return
  }

  emit('login', {
    name: studentName.value,
    email: studentEmail.value
  })
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleSubmit()
  }
}
</script>

<template>
  <div class="quiz-login ds-card">
    <div class="login-header">
      <h1 class="login-title">🎓 Holter Coach</h1>
      <p class="login-subtitle">Fixe seu conhecimento com quizzes</p>
    </div>

    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <label for="name" class="ds-label">Seu Nome</label>
        <input
          id="name"
          v-model="studentName"
          type="text"
          class="ds-input"
          placeholder="João Silva"
          @keypress="handleKeyPress"
        />
      </div>

      <div class="form-group">
        <label for="email" class="ds-label">Seu Email</label>
        <input
          id="email"
          v-model="studentEmail"
          type="email"
          class="ds-input"
          placeholder="joao@email.com"
          @keypress="handleKeyPress"
        />
      </div>

      <div v-if="error" class="ds-alert ds-alert-danger">
        ⚠️ {{ error }}
      </div>

      <button type="submit" class="ds-btn ds-btn-primary w-100">
        Começar Quiz →
      </button>
    </form>

    <div class="login-footer">
      <p class="login-info">
        💡 Responda as perguntas do seu módulo e receba feedback instantâneo do Holter Coach
      </p>
    </div>
  </div>
</template>

<style scoped>
.quiz-login {
  padding: var(--ds-space-xl);
  border-radius: var(--ds-radius-lg);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: var(--ds-space-xl);
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--ds-primary);
  margin: 0 0 var(--ds-space-sm) 0;
}

.login-subtitle {
  font-size: 1rem;
  color: var(--ds-text-secondary);
  margin: 0;
}

.login-form {
  margin-bottom: var(--ds-space-lg);
}

.form-group {
  margin-bottom: var(--ds-space-lg);
}

.ds-label {
  display: block;
  font-weight: 600;
  color: var(--ds-text-primary);
  margin-bottom: var(--ds-space-sm);
  font-size: 0.95rem;
}

.ds-input {
  width: 100%;
  padding: var(--ds-space-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.ds-input:focus {
  outline: none;
  border-color: var(--ds-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-footer {
  padding-top: var(--ds-space-lg);
  border-top: 1px solid var(--ds-border);
  text-align: center;
}

.login-info {
  font-size: 0.9rem;
  color: var(--ds-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.w-100 {
  width: 100%;
}
</style>
