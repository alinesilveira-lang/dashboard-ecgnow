<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  module: Object,
  studentName: String
})

const emit = defineEmits(['submit', 'back'])

const responses = ref({})
const currentQuestionIndex = ref(0)
const loading = ref(false)

const currentQuestion = computed(() => props.module.questions[currentQuestionIndex.value])

const isAnswered = computed(() => {
  const q = currentQuestion.value
  return responses.value[q.id]?.trim() !== ''
})

const progressPercent = computed(() => {
  return Math.round(((currentQuestionIndex.value + 1) / props.module.questions.length) * 100)
})

const updateResponse = (value) => {
  responses.value[currentQuestion.value.id] = value
}

const goToPrevious = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const goToNext = () => {
  if (currentQuestionIndex.value < props.module.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

const handleSubmit = async () => {
  // Check if all questions are answered
  const allAnswered = props.module.questions.every(q => {
    return responses.value[q.id]?.trim() !== ''
  })

  if (!allAnswered) {
    alert('Por favor, responda todas as perguntas antes de enviar')
    return
  }

  loading.value = true

  // Transform responses to match questions
  const formattedResponses = props.module.questions.map(q => ({
    questionId: q.id,
    questionText: q.text,
    questionType: q.type,
    answer: responses.value[q.id],
    isCorrect: q.type === 'multiple' ?
      parseInt(responses.value[q.id]) === q.correctAnswer :
      null // Open questions don't have a "correct" answer
  }))

  try {
    emit('submit', formattedResponses)
  } finally {
    loading.value = false
  }
}

const initializeResponses = () => {
  props.module.questions.forEach(q => {
    if (!responses.value[q.id]) {
      responses.value[q.id] = q.type === 'multiple' ? '-1' : ''
    }
  })
}

// Initialize when module changes
if (props.module) {
  initializeResponses()
}
</script>

<template>
  <div class="quiz-form">
    <!-- HEADER -->
    <div class="form-header ds-card">
      <button @click="$emit('back')" class="back-btn">← Voltar</button>
      <div class="header-content">
        <h2 class="form-title">{{ module.title }}</h2>
        <p class="form-subtitle">Pergunta {{ currentQuestionIndex + 1 }} de {{ module.questions.length }}</p>
      </div>
    </div>

    <!-- PROGRESS BAR -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <!-- QUESTION CARD -->
    <div class="question-card ds-card">
      <div class="question-content">
        <p class="question-text">{{ currentQuestion.text }}</p>

        <!-- MULTIPLE CHOICE -->
        <div v-if="currentQuestion.type === 'multiple'" class="options">
          <label
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-label"
          >
            <input
              type="radio"
              :name="`q-${currentQuestion.id}`"
              :value="index.toString()"
              :checked="responses[currentQuestion.id] === index.toString()"
              @change="updateResponse(index.toString())"
              class="option-input"
            />
            <span class="option-text">{{ option }}</span>
          </label>
        </div>

        <!-- OPEN ANSWER -->
        <div v-if="currentQuestion.type === 'open'" class="open-answer">
          <textarea
            :value="responses[currentQuestion.id] || ''"
            @input="updateResponse($event.target.value)"
            class="ds-textarea"
            placeholder="Digite sua resposta aqui..."
            rows="6"
          ></textarea>
          <p class="char-count">
            {{ (responses[currentQuestion.id] || '').length }} caracteres
          </p>
        </div>
      </div>

      <!-- NAVIGATION -->
      <div class="question-nav">
        <button
          @click="goToPrevious"
          :disabled="currentQuestionIndex === 0"
          class="ds-btn ds-btn-outline"
        >
          ← Anterior
        </button>

        <button
          v-if="currentQuestionIndex < module.questions.length - 1"
          @click="goToNext"
          :disabled="!isAnswered"
          class="ds-btn ds-btn-primary"
        >
          Próxima →
        </button>

        <button
          v-else
          @click="handleSubmit"
          :disabled="loading || !isAnswered"
          class="ds-btn ds-btn-success"
        >
          {{ loading ? '⏳ Enviando...' : '✓ Enviar Quiz' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-form {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-lg);
}

.form-header {
  padding: var(--ds-space-lg);
  border-radius: var(--ds-radius-lg);
  background: white;
  display: flex;
  align-items: center;
  gap: var(--ds-space-lg);
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: var(--ds-primary);
  font-weight: 600;
  padding: 0;
  transition: color 0.3s;
}

.back-btn:hover {
  color: #0055cc;
}

.header-content {
  flex: 1;
}

.form-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--ds-primary);
  margin: 0 0 var(--ds-space-xs) 0;
}

.form-subtitle {
  color: var(--ds-text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
}

.question-card {
  padding: var(--ds-space-xl);
  border-radius: var(--ds-radius-lg);
  background: white;
  display: flex;
  flex-direction: column;
}

.question-content {
  flex: 1;
  margin-bottom: var(--ds-space-lg);
}

.question-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--ds-primary);
  margin: 0 0 var(--ds-space-lg) 0;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-md);
}

.option-label {
  display: flex;
  align-items: center;
  padding: var(--ds-space-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  cursor: pointer;
  transition: all 0.3s;
}

.option-label:hover {
  background: var(--ds-bg-hover);
  border-color: var(--ds-primary);
}

.option-label input:checked ~ .option-text {
  font-weight: 600;
  color: var(--ds-primary);
}

.option-label input:checked {
  border-color: var(--ds-primary);
}

.option-input {
  margin-right: var(--ds-space-md);
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.option-text {
  color: var(--ds-text-primary);
  font-size: 1rem;
}

.open-answer {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-sm);
}

.ds-textarea {
  width: 100%;
  padding: var(--ds-space-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-md);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s;
}

.ds-textarea:focus {
  outline: none;
  border-color: var(--ds-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.char-count {
  font-size: 0.85rem;
  color: var(--ds-text-secondary);
  margin: 0;
  text-align: right;
}

.question-nav {
  display: flex;
  gap: var(--ds-space-md);
  justify-content: space-between;
  border-top: 1px solid var(--ds-border);
  padding-top: var(--ds-space-lg);
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

.ds-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ds-btn-outline {
  background: transparent;
  border: 1px solid var(--ds-border);
  color: var(--ds-text-primary);
}

.ds-btn-outline:hover:not(:disabled) {
  background: var(--ds-bg-hover);
  border-color: var(--ds-primary);
}

.ds-btn-primary {
  background: var(--ds-primary);
  color: white;
}

.ds-btn-primary:hover:not(:disabled) {
  background: #0055cc;
}

.ds-btn-success {
  background: #198754;
  color: white;
}

.ds-btn-success:hover:not(:disabled) {
  background: #157347;
}

@media (max-width: 768px) {
  .question-nav {
    flex-direction: column;
  }

  .ds-btn {
    width: 100%;
  }
}
</style>
