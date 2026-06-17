<script setup>
import { ref } from 'vue'
import { quizzes } from '../data/quizzes'
import QuizLogin from './QuizLogin.vue'
import ModuleSelector from './ModuleSelector.vue'
import QuizForm from './QuizForm.vue'
import QuizFeedback from './QuizFeedback.vue'

const currentStep = ref('login') // login | moduleSelection | quiz | feedback
const studentData = ref(null)
const selectedModule = ref(null)
const quizResponses = ref(null)
const feedback = ref(null)

const modules = Object.entries(quizzes).map(([key, data]) => ({
  key,
  ...data
}))

const handleLogin = (data) => {
  studentData.value = data
  currentStep.value = 'moduleSelection'
}

const handleModuleSelect = (moduleKey) => {
  selectedModule.value = quizzes[moduleKey]
  selectedModule.value.key = moduleKey
  currentStep.value = 'quiz'
}

const handleQuizSubmit = async (responses) => {
  quizResponses.value = responses
  currentStep.value = 'feedback'

  // Call Claude via Google Apps Script
  try {
    const result = await fetch(import.meta.env.VITE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'processQuizFeedback',
        studentName: studentData.value.name,
        studentEmail: studentData.value.email,
        moduleKey: selectedModule.value.key,
        moduleTitle: selectedModule.value.title,
        questions: selectedModule.value.questions,
        responses: responses
      })
    })

    const data = await result.json()
    feedback.value = data.feedback
  } catch (error) {
    feedback.value = `Erro ao processar feedback: ${error.message}`
  }
}

const handleNewQuiz = () => {
  currentStep.value = 'moduleSelection'
  selectedModule.value = null
  quizResponses.value = null
  feedback.value = null
}

const handleLogout = () => {
  currentStep.value = 'login'
  studentData.value = null
  selectedModule.value = null
  quizResponses.value = null
  feedback.value = null
}
</script>

<template>
  <div class="quiz-page">
    <div class="quiz-container">
      <!-- LOGIN STEP -->
      <QuizLogin
        v-if="currentStep === 'login'"
        @login="handleLogin"
      />

      <!-- MODULE SELECTION STEP -->
      <ModuleSelector
        v-if="currentStep === 'moduleSelection'"
        :modules="modules"
        :student-name="studentData.name"
        @select="handleModuleSelect"
        @logout="handleLogout"
      />

      <!-- QUIZ FORM STEP -->
      <QuizForm
        v-if="currentStep === 'quiz'"
        :module="selectedModule"
        :student-name="studentData.name"
        @submit="handleQuizSubmit"
        @back="currentStep = 'moduleSelection'"
      />

      <!-- FEEDBACK STEP -->
      <QuizFeedback
        v-if="currentStep === 'feedback'"
        :feedback="feedback"
        :module="selectedModule"
        :student-name="studentData.name"
        @new-quiz="handleNewQuiz"
        @logout="handleLogout"
      />
    </div>
  </div>
</template>

<style scoped>
.quiz-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ds-space-lg);
}

.quiz-container {
  width: 100%;
  max-width: 700px;
}

@media (max-width: 768px) {
  .quiz-page {
    padding: var(--ds-space-md);
  }
}
</style>
