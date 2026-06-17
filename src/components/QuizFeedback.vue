<script setup>
defineProps({
  feedback: [String, Object],
  module: Object,
  studentName: String
})

const emit = defineEmits(['new-quiz', 'logout'])

const isFeedbackLoading = (feedback) => {
  return !feedback || (typeof feedback === 'string' && feedback.includes('processando'))
}

const formatFeedback = (feedback) => {
  if (!feedback) return ''
  if (typeof feedback === 'string') return feedback

  // If feedback is an object with detailed structure
  if (feedback.perguntas) {
    return JSON.stringify(feedback, null, 2)
  }

  return JSON.stringify(feedback, null, 2)
}
</script>

<template>
  <div class="quiz-feedback">
    <!-- HEADER -->
    <div class="feedback-header ds-card">
      <div class="header-content">
        <h1 class="feedback-title">🎯 Seu Feedback</h1>
        <p class="feedback-subtitle">Módulo: {{ module.title }}</p>
      </div>
      <div class="header-actions">
        <button @click="$emit('new-quiz')" class="ds-btn ds-btn-primary">
          Outro Quiz →
        </button>
        <button @click="$emit('logout')" class="ds-btn ds-btn-outline">
          Sair
        </button>
      </div>
    </div>

    <!-- FEEDBACK CONTENT -->
    <div class="feedback-content ds-card">
      <div v-if="isFeedbackLoading(feedback)" class="loading">
        <div class="spinner"></div>
        <p>⏳ Processando seu feedback com o Holter Coach...</p>
      </div>

      <div v-else class="feedback-text">
        <!-- If feedback is a simple string, display it -->
        <div v-if="typeof feedback === 'string'" class="feedback-message">
          <p>{{ feedback }}</p>
        </div>

        <!-- If feedback is structured, show it nicely -->
        <div v-else class="feedback-structured">
          <div v-if="feedback.resumo" class="feedback-section">
            <h3>📊 Resumo</h3>
            <p>{{ feedback.resumo }}</p>
          </div>

          <div v-if="feedback.pontos_fortes" class="feedback-section">
            <h3>✅ Pontos Fortes</h3>
            <ul>
              <li v-for="ponto in feedback.pontos_fortes" :key="ponto">{{ ponto }}</li>
            </ul>
          </div>

          <div v-if="feedback.areas_melhoria" class="feedback-section">
            <h3>🔧 Áreas para Melhorar</h3>
            <ul>
              <li v-for="area in feedback.areas_melhoria" :key="area">{{ area }}</li>
            </ul>
          </div>

          <div v-if="feedback.proximos_passos" class="feedback-section">
            <h3>🎓 Próximos Passos</h3>
            <ol>
              <li v-for="passo in feedback.proximos_passos" :key="passo">{{ passo }}</li>
            </ol>
          </div>

          <div v-if="feedback.quiz_relacionado" class="feedback-section">
            <h3>💡 Próximo Quiz Sugerido</h3>
            <p class="highlight">{{ feedback.quiz_relacionado }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="feedback-footer">
      <p class="footer-text">
        💪 Continue praticando! Cada quiz o torna melhor em reconhecer padrões de Holter.
      </p>
    </div>
  </div>
</template>

<style scoped>
.quiz-feedback {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-lg);
}

.feedback-header {
  padding: var(--ds-space-lg);
  border-radius: var(--ds-radius-lg);
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--ds-space-lg);
}

.header-content {
  flex: 1;
}

.feedback-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--ds-primary);
  margin: 0 0 var(--ds-space-xs) 0;
}

.feedback-subtitle {
  color: var(--ds-text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--ds-space-md);
}

.ds-btn {
  padding: var(--ds-space-md) var(--ds-space-lg);
  border-radius: var(--ds-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 0.95rem;
}

.ds-btn-primary {
  background: var(--ds-primary);
  color: white;
}

.ds-btn-primary:hover {
  background: #0055cc;
}

.ds-btn-outline {
  background: transparent;
  border: 1px solid var(--ds-border);
  color: var(--ds-text-primary);
}

.ds-btn-outline:hover {
  background: var(--ds-bg-hover);
}

.feedback-content {
  padding: var(--ds-space-xl);
  border-radius: var(--ds-radius-lg);
  background: white;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.1);
  border-top-color: var(--ds-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--ds-space-lg);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.feedback-text {
  width: 100%;
}

.feedback-message {
  line-height: 1.8;
  color: var(--ds-text-primary);
  font-size: 1rem;
}

.feedback-structured {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-lg);
}

.feedback-section {
  border-left: 4px solid var(--ds-primary);
  padding-left: var(--ds-space-lg);
}

.feedback-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ds-primary);
  margin: 0 0 var(--ds-space-md) 0;
}

.feedback-section p {
  margin: 0 0 var(--ds-space-md) 0;
  color: var(--ds-text-primary);
  line-height: 1.6;
}

.feedback-section ul,
.feedback-section ol {
  margin: 0;
  padding-left: var(--ds-space-lg);
  color: var(--ds-text-primary);
}

.feedback-section li {
  margin-bottom: var(--ds-space-sm);
  line-height: 1.6;
}

.highlight {
  background: rgba(102, 126, 234, 0.1);
  padding: var(--ds-space-md);
  border-radius: var(--ds-radius-md);
  border-left: 4px solid var(--ds-primary);
  font-weight: 600;
  margin: 0;
}

.feedback-footer {
  text-align: center;
  padding: var(--ds-space-lg);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--ds-radius-lg);
}

.footer-text {
  color: white;
  font-weight: 600;
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .feedback-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .ds-btn {
    width: 100%;
  }
}
</style>
