<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDashboardStore } from './stores/dashboardStore'
import { authenticate, fetchDados, isAuthenticated, logout } from './services/appsScriptService'
import { calcularIndicadores, calcularAprovacaoPorModalidade, identificarAlunosEmRisco } from './services/indicatorService'
import AuthModal from './components/AuthModal.vue'
import DashboardCard from './components/DashboardCard.vue'
import FilterPanel from './components/FilterPanel.vue'
import IndicatorTable from './components/IndicatorTable.vue'

const store = useDashboardStore()
const showAuthModal = ref(!isAuthenticated())
const indicators = ref(null)
const aprprovalByModality = ref(null)
const studentsAtRisk = ref([])

const handleLogin = async (password) => {
  store.setLoading(true)
  store.setError(null)

  const result = await authenticate(password)

  if (result.success) {
    showAuthModal.value = false
    store.setAuthenticated(true)
    await carregarDados()
  } else {
    store.setError(result.error)
  }

  store.setLoading(false)
}

const carregarDados = async () => {
  store.setLoading(true)
  const result = await fetchDados()

  if (result.success) {
    store.setData(result.data)
    // Processar dados
    indicators.value = calcularIndicadores(result.data.alunos)
    aprprovalByModality.value = calcularAprovacaoPorModalidade(result.data.alunos)
    studentsAtRisk.value = identificarAlunosEmRisco(result.data.alunos)
  } else {
    store.setError(result.error)
  }

  store.setLoading(false)
}

const handleLogout = () => {
  logout()
  store.setAuthenticated(false)
  showAuthModal.value = true
}

onMounted(() => {
  if (isAuthenticated()) {
    carregarDados()
  }
})
</script>

<template>
  <div class="app-container">
    <AuthModal
      v-if="showAuthModal"
      @login="handleLogin"
      :is-loading="store.isLoading"
      :error="store.error"
    />

    <div v-else class="dashboard-content">
      <!-- Header -->
      <header class="ds-page-header bg-white p-4">
        <div>
          <h1 class="ds-page-title">Dashboard ECGNOW</h1>
          <p class="ds-page-subtitle">Indicadores de Desempenho Acadêmico</p>
        </div>
        <button @click="handleLogout" class="btn ds-btn ds-btn-secondary">
          Sair
        </button>
      </header>

      <!-- Loading -->
      <div v-if="store.isLoading" class="alert ds-alert ds-alert-info">
        Carregando dados...
      </div>

      <!-- Error -->
      <div v-if="store.error" class="alert ds-alert ds-alert-danger">
        {{ store.error }}
      </div>

      <main class="container-fluid p-4">
        <!-- Filters -->
        <FilterPanel />

        <!-- Indicadores principais -->
        <section class="row mb-4" v-if="indicators">
          <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
            <DashboardCard
              title="Total de Alunos"
              :value="indicators.totalAlunos"
              icon="👥"
              color="primary"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
            <DashboardCard
              title="Taxa Conclusão Teórica"
              :value="`${indicators.taxaConclusaoTeoria}%`"
              icon="📚"
              color="success"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
            <DashboardCard
              title="Taxa Aprovação"
              :value="`${indicators.taxaAprovacao}%`"
              icon="✅"
              color="info"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
            <DashboardCard
              title="Inadimplência"
              :value="`${indicators.inadimplencia}%`"
              icon="⚠️"
              color="danger"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
            <DashboardCard
              title="NPS Médio"
              :value="indicators.npsMedio"
              icon="⭐"
              color="warning"
            />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-12 mb-3">
            <DashboardCard
              title="Alunos Ativos"
              :value="indicators.alunosAtivos"
              icon="🟢"
              color="success"
            />
          </div>
        </section>

        <!-- Tabela de alunos -->
        <section class="mb-4">
          <IndicatorTable :alunos="store.alunosFiltrados" />
        </section>

        <!-- Alunos em risco -->
        <section v-if="studentsAtRisk.length > 0" class="ds-card">
          <div class="ds-card-header">
            <h3 class="ds-card-title">⚠️ Alunos em Risco (Sem atividade 30+ dias)</h3>
          </div>
          <div class="ds-card-body">
            <table class="table ds-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Matrícula</th>
                  <th>Turma</th>
                  <th>% Teória</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aluno in studentsAtRisk" :key="aluno.id">
                  <td>{{ aluno.nome }}</td>
                  <td>{{ aluno.matricula }}</td>
                  <td>{{ aluno.turma }}</td>
                  <td>{{ aluno.percentual_conclusao_teorico }}%</td>
                  <td>
                    <span class="ds-badge ds-badge-warning">{{ aluno.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--ds-bg-page);
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: white;
  border-bottom: 2px solid var(--ds-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

main {
  flex: 1;
}
</style>
