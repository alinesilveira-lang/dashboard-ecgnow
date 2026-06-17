<script setup>
import { ref, onMounted } from 'vue'
import { useDashboardStore } from './stores/dashboardStore'
import { authenticate, fetchDados, isAuthenticated, logout } from './services/appsScriptService'
import {
  calcularIndicadores,
  calcularIndicadoresTeoria,
  calcularIndicadoresPratica,
  calcularIndicadoresLiveDemanda,
  calcularIndicadoresTurmas,
  calcularIndicadoresMentorias,
  calcularIndicadoresInadimplencia,
  filtrarAlunosSomenteTeroria,
  calcularNPS,
  calcularFrequenciaMedia,
  calcularCruzamentos,
  obterZonaNPS
} from './services/indicatorService'
import AuthModal from './components/AuthModal.vue'
import FilterPanel from './components/FilterPanel.vue'
import IndicatorTable from './components/IndicatorTable.vue'
import InadimplenciaPage from './components/InadimplenciaPage.vue'
import ChartPieSimple from './components/ChartPieSimple.vue'
import ChartBarSimple from './components/ChartBarSimple.vue'

const store = useDashboardStore()
const showAuthModal = ref(!isAuthenticated())
const activePage = ref('geral')
const indicators = ref(null)
const indicatorsTeoria = ref(null)
const indicatorsPratica = ref(null)
const indicatorsLD = ref(null)
const indicatorsTurmas = ref(null)
const indicatorsMentoria = ref(null)
const alunosSomenteTeroria = ref([])
const npsGlobal = ref(null)
const cruzamentos = ref(null)
const indicatorsInadimplencia = ref(null)

const isSidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

const pages = [
  { id: 'geral', label: 'Visão Geral', icon: '📊' },
  { id: 'teoria', label: 'Teoria', icon: '📚' },
  { id: 'pratica', label: 'Prática', icon: '🛠️' },
  { id: 'inadimplencia', label: 'Inadimplência', icon: '💳' },
  { id: 'outros', label: 'Outros', icon: '⚙️' },
  { id: 'analises', label: 'Análises', icon: '📈' }
]

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.value)
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value)
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

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
    indicators.value = calcularIndicadores(result.data.alunos)
    indicatorsTeoria.value = calcularIndicadoresTeoria(result.data.alunos, result.data.hotmart || [])
    indicatorsPratica.value = calcularIndicadoresPratica(result.data.pratica || [])
    indicatorsInadimplencia.value = calcularIndicadoresInadimplencia(result.data.alunos)
    indicatorsLD.value = calcularIndicadoresLiveDemanda(result.data.alunos)
    indicatorsTurmas.value = calcularIndicadoresTurmas(result.data.alunos)
    indicatorsMentoria.value = calcularIndicadoresMentorias(result.data.alunos)
    alunosSomenteTeroria.value = filtrarAlunosSomenteTeroria(result.data.alunos)
    npsGlobal.value = calcularNPS(result.data.alunos)
    cruzamentos.value = calcularCruzamentos(result.data.alunos)
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
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
  }
  if (isAuthenticated()) {
    carregarDados()
  }
})
</script>

<template>
  <div class="app-container">
    <AuthModal v-if="showAuthModal" @login="handleLogin" :is-loading="store.isLoading" :error="store.error" />

    <template v-else>
      <!-- SIDEBAR -->
      <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
        <div class="sidebar-header">
          <div v-if="!isSidebarCollapsed">
            <h3>📊 ECGNOW</h3>
            <p>Dashboard</p>
          </div>
          <button @click="toggleSidebar" class="sidebar-toggle">
            {{ isSidebarCollapsed ? '→' : '←' }}
          </button>
        </div>

        <nav class="sidebar-nav">
          <button
            v-for="page in pages"
            :key="page.id"
            @click="activePage = page.id"
            :class="{ active: activePage === page.id }"
            class="sidebar-menu-item"
          >
            <span class="icon">{{ page.icon }}</span>
            <span class="label">{{ page.label }}</span>
          </button>
        </nav>

        <div class="sidebar-footer">
          <button @click="toggleDarkMode" class="btn btn-theme">
            {{ isDarkMode ? '☀️ Claro' : '🌙 Escuro' }}
          </button>
          <button @click="handleLogout" class="btn btn-logout">Sair</button>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <div class="main-content" :class="{ expanded: isSidebarCollapsed }">
        <!-- HEADER -->
        <header class="app-header">
          <h1 class="header-title">{{ pages.find(p => p.id === activePage)?.label }}</h1>
          <div class="header-controls">
            <span v-if="store.isLoading">⏳</span>
            <span v-if="store.error">⚠️</span>
          </div>
        </header>

        <!-- CONTENT -->
        <div class="content-area">
          <!-- GERAL -->
          <section v-show="activePage === 'geral'" v-if="indicators">
            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-label">👥 Total de Alunos</div>
                <div class="kpi-value">{{ indicators.totalAlunos }}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">✅ Taxa de Aprovação</div>
                <div class="kpi-value">{{ indicators.taxaAprovacao }}%</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">💰 Inadimplência</div>
                <div class="kpi-value">{{ indicators.taxaInadimplencia }}%</div>
              </div>
            </div>

            <div class="grid-2">
              <div class="card">
                <h3 class="card-title">📊 Distribuição de Status</h3>
                <ChartPieSimple
                  :items="[
                    { label: 'Ativos', value: indicators.alunosAtivos },
                    { label: 'Desistentes', value: indicators.desistentes },
                    { label: 'Cancelou', value: indicators.cancelou },
                    { label: 'Concluído', value: indicators.concluido },
                    { label: 'Bloqueado', value: indicators.bloqueado }
                  ]"
                  :colors="['#38ef7d', '#757575', '#f5576c', '#667eea', '#fee140']"
                />
              </div>
            </div>

            <FilterPanel />
            <div class="card">
              <h3 class="card-title">📋 Progresso dos Alunos ({{ indicators.totalAlunos }})</h3>
              <IndicatorTable :alunos="store.alunosFiltrados" />
            </div>
          </section>

          <!-- TEORIA -->
          <section v-show="activePage === 'teoria'" v-if="indicatorsTeoria">
            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-label">📚 Total</div>
                <div class="kpi-value">{{ indicatorsTeoria.totalAlunos }}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">🎯 Atingiram 50%</div>
                <div class="kpi-value">{{ indicatorsTeoria.atingiuCinquenta }}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">✅ Aptos Prática</div>
                <div class="kpi-value">{{ indicatorsTeoria.aptosPratica }}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">⛔ Perderam Acesso</div>
                <div class="kpi-value">{{ indicatorsTeoria.perderamAcesso }}</div>
              </div>
            </div>

            <div class="grid-2">
              <div class="card">
                <h3 class="card-title">💪 Engajamento</h3>
                <ChartPieSimple
                  :items="[
                    { label: 'Baixo', value: indicatorsTeoria.engajamentoBaixo },
                    { label: 'Médio', value: indicatorsTeoria.engajamentoMedio },
                    { label: 'Alto', value: indicatorsTeoria.engajamentoAlto }
                  ]"
                  :colors="['#f5576c', '#fee140', '#38ef7d']"
                />
              </div>
            </div>

            <div class="card">
              <h3 class="card-title">👨‍🎓 Alunos Somente em Teoria ({{ alunosSomenteTeroria.length }})</h3>
              <IndicatorTable :alunos="alunosSomenteTeroria" somente-teroria />
            </div>
          </section>

          <!-- PRÁTICA -->
          <section v-show="activePage === 'pratica'" v-if="indicatorsPratica">
            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-label">🛠️ Total</div>
                <div class="kpi-value">{{ indicatorsPratica.totalAlunos }}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">🏆 100%</div>
                <div class="kpi-value">{{ indicatorsPratica.progressaoCompleta }}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">📈 IRP Ideal</div>
                <div class="kpi-value">{{ indicatorsPratica.irpIdealMedia }}%</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">⚡ Eficiência</div>
                <div class="kpi-value">{{ indicatorsPratica.eficienciaMediaCredito }}%</div>
              </div>
            </div>
          </section>

          <!-- INADIMPLÊNCIA -->
          <section v-show="activePage === 'inadimplencia'" v-if="indicatorsInadimplencia">
            <InadimplenciaPage :indicators="indicatorsInadimplencia" />
          </section>

          <!-- OUTROS -->
          <section v-show="activePage === 'outros'">
            <div class="card">
              <h3 class="card-title">⚙️ Seção em Construção</h3>
              <p>Conteúdo será adicionado em breve...</p>
            </div>
          </section>

          <!-- ANÁLISES -->
          <section v-show="activePage === 'analises'">
            <div class="card">
              <h3 class="card-title">📈 Análises Avançadas</h3>
              <p>Seção dedicada a análises aprofundadas dos dados.</p>
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
