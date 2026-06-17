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

const pages = [
  { id: 'geral', label: 'Geral', icon: '📊' },
  { id: 'teoria', label: 'Teoria', icon: '📚' },
  { id: 'pratica', label: 'Prática', icon: '🛠️' },
  { id: 'inadimplencia', label: 'Inadimplência', icon: '💳' },
  { id: 'outros', label: 'Outros', icon: '⚙️' },
  { id: 'analises', label: 'Análises', icon: '📈' }
]

const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')
const isSidebarCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value)
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.value)
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
  // Inicializar tema escuro
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

    <div v-else class="d-flex" style="min-height: 100vh;">
      <!-- SIDEBAR -->
      <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
        <div class="sidebar-header">
          <div class="d-flex justify-content-between align-items-center">
            <div v-if="!isSidebarCollapsed">
              <h3 class="m-0 text-white">📊 ECGNOW</h3>
              <p class="small text-white-50 mt-2 m-0">Dashboard Acadêmico</p>
            </div>
            <button @click="toggleSidebar" class="btn btn-sm btn-outline-light ms-auto">
              {{ isSidebarCollapsed ? '→' : '←' }}
            </button>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button
            v-for="page in pages"
            :key="page.id"
            @click="activePage = page.id"
            :class="{ active: activePage === page.id }"
            class="nav-btn"
          >
            {{ page.icon }} {{ page.label }}
          </button>
        </nav>

        <button @click="toggleDarkMode" class="btn ds-btn ds-btn-secondary w-100 mb-2">
          {{ isDarkMode ? '☀️ Claro' : '🌙 Escuro' }}
        </button>
        <button @click="handleLogout" class="btn ds-btn ds-btn-danger w-100">Sair</button>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content flex-grow-1">
        <!-- HEADER -->
        <header class="ds-page-header bg-white p-4 border-bottom">
          <h1 class="ds-page-title m-0">{{ pages.find(p => p.id === activePage)?.label }}</h1>
          <p class="ds-page-subtitle m-0 mt-2">Dashboard Acadêmico ECGNOW</p>
        </header>

        <!-- ALERTS -->
        <div class="container-fluid px-4 py-2">
          <div v-if="store.isLoading" class="ds-alert ds-alert-info">⏳ Carregando dados...</div>
          <div v-if="store.error" class="ds-alert ds-alert-danger">⚠️ {{ store.error }}</div>
        </div>

        <!-- CONTENT -->
        <div class="container-fluid p-4">
          <!-- PÁGINA: GERAL -->
          <section v-show="activePage === 'geral'" v-if="indicators">
            <h2 class="section-title mb-4">Visão Geral</h2>
            <div class="row mb-4">
              <div class="col-12">
                <div class="row justify-content-center">
                  <div class="col-lg-3 col-md-6 mb-3">
                    <div class="ds-card">
                      <div class="ds-card-body">
                        <p class="kpi-label">Total de Alunos</p>
                        <p class="kpi-value">{{ indicators.totalAlunos }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-6 mb-3">
                    <div class="ds-card">
                      <div class="ds-card-body">
                        <p class="kpi-label">Taxa Aprovação</p>
                        <p class="kpi-value">{{ indicators.taxaAprovacao }}%</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-3 col-md-6 mb-3">
                    <div class="ds-card">
                      <div class="ds-card-body">
                        <p class="kpi-label">Inadimplência</p>
                        <p class="kpi-value">{{ indicators.taxaInadimplencia }}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-md-6 mx-auto">
                <div class="ds-card">
                  <h3 class="subsection-title m-0 mb-3 text-center">Distribuição de Status</h3>
                  <div style="max-width: 350px; margin: 0 auto;">
                    <ChartPieSimple
                      :items="[
                        { label: 'Ativos', value: indicators.alunosAtivos },
                        { label: 'Desistentes', value: indicators.desistentes },
                        { label: 'Cancelou', value: indicators.cancelou },
                        { label: 'Concluído', value: indicators.concluido },
                        { label: 'Bloqueado', value: indicators.bloqueado }
                      ]"
                      :colors="['#198754', '#6c757d', '#dc3545', '#0dcaf0', '#ffc107']"
                    />
                  </div>
                </div>
              </div>
            </div>
            <FilterPanel />
            <div class="ds-card mt-3">
              <IndicatorTable :alunos="store.alunosFiltrados" />
            </div>
          </section>

          <!-- PÁGINA: TEORIA -->
          <section v-show="activePage === 'teoria'" v-if="indicatorsTeoria">
            <h2 class="section-title mb-4">Indicadores de Teoria</h2>
            <div class="row mb-4">
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Total de Alunos</p>
                    <p class="kpi-value">{{ indicatorsTeoria.totalAlunos }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Atingiram 50%</p>
                    <p class="kpi-value">{{ indicatorsTeoria.atingiuCinquenta }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Aptos Prática</p>
                    <p class="kpi-value">{{ indicatorsTeoria.aptosPratica }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Em Risco 21-29d</p>
                    <p class="kpi-value">{{ indicatorsTeoria.emRisco21a29dias }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Em Risco ≥30d</p>
                    <p class="kpi-value">{{ indicatorsTeoria.emRisco30diasOuMais }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Perderam Acesso</p>
                    <p class="kpi-value">{{ indicatorsTeoria.perderamAcesso }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-md-6 mx-auto">
                <div class="ds-card">
                  <h3 class="subsection-title m-0 mb-3 text-center">Engajamento</h3>
                  <div style="max-width: 300px; margin: 0 auto;">
                    <ChartPieSimple
                      :items="[
                        { label: 'Baixo', value: indicatorsTeoria.engajamentoBaixo },
                        { label: 'Médio', value: indicatorsTeoria.engajamentoMedio },
                        { label: 'Alto', value: indicatorsTeoria.engajamentoAlto }
                      ]"
                      :colors="['#dc3545', '#ffc107', '#198754']"
                    />
                  </div>
                </div>
              </div>
            </div>
            <h3 class="subsection-title mt-5 mb-3">Alunos Somente em Teoria</h3>
            <div class="ds-card">
              <IndicatorTable :alunos="alunosSomenteTeroria" somente-teroria />
            </div>
          </section>

          <!-- PÁGINA: PRÁTICA -->
          <section v-show="activePage === 'pratica'" v-if="indicatorsPratica">
            <h2 class="section-title mb-4">Indicadores de Prática</h2>
            <div class="row mb-4">
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Total de Alunos</p>
                    <p class="kpi-value">{{ indicatorsPratica.totalAlunos }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Conclusão 100%</p>
                    <p class="kpi-value">{{ indicatorsPratica.progressaoCompleta }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">IRP Ideal</p>
                    <p class="kpi-value">{{ indicatorsPratica.irpIdealMedia }}%</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Eficiência</p>
                    <p class="kpi-value">{{ indicatorsPratica.eficienciaMediaCredito }}%</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Alavancagem</p>
                    <p class="kpi-value">{{ indicatorsPratica.alavancagemMedia }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="ds-card mt-4">
              <h3 class="subsection-title m-0 mb-3">Conclusão: Teória vs Prática vs Ambos</h3>
              <ChartBarSimple
                :data="[
                  { label: 'Teória', value: Math.round((indicatorsPratica.totalAlunos * 0.7)) },
                  { label: 'Prática', value: Math.round((indicatorsPratica.totalAlunos * 0.5)) },
                  { label: 'Ambos', value: indicators.conclusaoAmbos }
                ]"
                :colors="['#198754', '#0dcaf0', '#dc3545']"
              />
            </div>
          </section>

          <!-- PÁGINA: INADIMPLÊNCIA -->
          <section v-show="activePage === 'inadimplencia'" v-if="indicatorsInadimplencia">
            <InadimplenciaPage :indicators="indicatorsInadimplencia" />
          </section>

          <!-- PÁGINA: OUTROS -->
          <section v-show="activePage === 'outros'" v-if="indicators && indicatorsLD && indicatorsTurmas && indicatorsMentoria">
            <!-- LIVRE DEMANDA -->
            <div class="mb-5">
              <h2 class="section-title mb-4">⏰ Livre Demanda</h2>
              <div class="row">
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Total de Alunos</p>
                      <p class="kpi-value">{{ indicatorsLD?.totalAlunos || 0 }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Taxa Conclusão</p>
                      <p class="kpi-value">{{ indicatorsLD?.taxaConclusao || 0 }}%</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">NPS Médio</p>
                      <p class="kpi-value">{{ indicatorsLD?.npsMedio || 0 }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Alunos Ativos</p>
                      <p class="kpi-value">{{ indicatorsLD?.alunosAtivos || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- TURMAS -->
            <div class="mb-5">
              <h2 class="section-title mb-4">👥 Turmas</h2>
              <div class="row">
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Total de Turmas</p>
                      <p class="kpi-value">{{ indicatorsTurmas?.totalTurmas || 0 }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Média Alunos/Turma</p>
                      <p class="kpi-value">{{ indicatorsTurmas?.mediaAlunosPorTurma || 0 }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Média Aprovação</p>
                      <p class="kpi-value">{{ indicatorsTurmas?.mediaAprovacao || 0 }}%</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Taxa Conclusão</p>
                      <p class="kpi-value">{{ indicatorsTurmas?.taxaConclusaoMedia || 0 }}%</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">NPS Médio</p>
                      <p class="kpi-value">{{ indicatorsTurmas?.npsMedia || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- MENTORIAS -->
            <div>
              <h2 class="section-title mb-4">🎓 Mentorias</h2>
              <div class="row">
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Total de Alunos</p>
                      <p class="kpi-value">{{ indicatorsMentoria?.totalAlunos || 0 }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Taxa Satisfação</p>
                      <p class="kpi-value">{{ indicatorsMentoria?.taxaSatisfacao || 0 }}%</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Média Aprovação</p>
                      <p class="kpi-value">{{ indicatorsMentoria?.mediaAprovacao || 0 }}%</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Taxa Conclusão</p>
                      <p class="kpi-value">{{ indicatorsMentoria?.taxaConclusao || 0 }}%</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">NPS Médio</p>
                      <p class="kpi-value">{{ indicatorsMentoria?.npsMedio || 0 }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Taxa Agendamento</p>
                      <p class="kpi-value">{{ indicatorsMentoria?.taxaAgendamento || 0 }}%</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-3">
                  <div class="ds-card">
                    <div class="ds-card-body">
                      <p class="kpi-label">Taxa Presença</p>
                      <p class="kpi-value">{{ indicatorsMentoria?.taxaPresenca || 0 }}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ds-card mt-4">
                <h3 class="subsection-title m-0 mb-3">Distribuição por Modalidade</h3>
                <ChartPieSimple
                  :items="[
                    { label: 'Turma', value: Math.round(indicators.totalAlunos * 0.4) },
                    { label: 'Livre Demanda', value: Math.round(indicators.totalAlunos * 0.35) },
                    { label: 'Mentoria', value: Math.round(indicators.totalAlunos * 0.25) }
                  ]"
                  :colors="['#033569', '#0dcaf0', '#198754']"
                />
              </div>
            </div>
          </section>

          <!-- PÁGINA: ANÁLISES AVANÇADAS -->
          <section v-show="activePage === 'analises'" v-if="npsGlobal && npsGlobal.npsGlobal !== undefined && cruzamentos">
            <!-- NPS GLOBAL -->
            <h2 class="section-title mb-4">NPS Global</h2>
            <div class="row mb-5">
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card" :class="`border-${obterZonaNPS(npsGlobal.npsGlobal).cor}`">
                  <div class="ds-card-body">
                    <p class="kpi-label">NPS Score</p>
                    <p class="kpi-value">{{ npsGlobal.npsGlobal }}</p>
                    <p class="nps-zona" :class="`text-${obterZonaNPS(npsGlobal.npsGlobal).cor}`">
                      {{ obterZonaNPS(npsGlobal.npsGlobal).zona }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Promotores (9-10)</p>
                    <p class="kpi-value">{{ npsGlobal.promotores }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Passivos (7-8)</p>
                    <p class="kpi-value">{{ npsGlobal.passivos }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Detratores (0-6)</p>
                    <p class="kpi-value">{{ npsGlobal.detratores }}</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Não Respondentes*</p>
                    <p class="kpi-value">{{ npsGlobal.naoRespondentes }}</p>
                    <p class="small text-muted">de {{ npsGlobal.totalElegivel }} elegíveis</p>
                  </div>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 mb-3">
                <div class="ds-card">
                  <div class="ds-card-body">
                    <p class="kpi-label">Taxa Resposta</p>
                    <p class="kpi-value">{{ npsGlobal.percentualRespostas }}%</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- CRUZAMENTOS POR TURMA -->
            <h2 class="section-title mb-4">Análise Por Turma</h2>
            <div class="ds-card mb-5">
              <div class="table-responsive">
                <table class="ds-table w-100">
                  <thead>
                    <tr>
                      <th>Turma</th>
                      <th>Total</th>
                      <th>Aprovados</th>
                      <th>Reprovados</th>
                      <th>Desistentes</th>
                      <th>Taxa Conclusão</th>
                      <th>Frequência Média</th>
                      <th>NPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(dados, turma) in cruzamentos.porTurma" :key="turma">
                      <td><strong>{{ turma }}</strong></td>
                      <td>{{ dados.total }}</td>
                      <td><span class="ds-badge ds-badge-success">{{ dados.aprovados }}</span></td>
                      <td><span class="ds-badge ds-badge-danger">{{ dados.reprovados }}</span></td>
                      <td><span class="ds-badge ds-badge-warning">{{ dados.desistentes }}</span></td>
                      <td>{{ dados.taxaConclusao }}%</td>
                      <td>{{ dados.frequenciaMedia }}%</td>
                      <td><strong>{{ dados.nps }}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- CRUZAMENTOS POR TURNO -->
            <h2 class="section-title mb-4">Análise Por Turno</h2>
            <div class="ds-card mb-5">
              <div class="table-responsive">
                <table class="ds-table w-100">
                  <thead>
                    <tr>
                      <th>Turno</th>
                      <th>Total</th>
                      <th>Aprovados</th>
                      <th>Reprovados</th>
                      <th>Desistentes</th>
                      <th>Taxa Conclusão</th>
                      <th>Frequência Média</th>
                      <th>NPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(dados, turno) in cruzamentos.porTurno" :key="turno">
                      <td><strong>{{ turno }}</strong></td>
                      <td>{{ dados.total }}</td>
                      <td><span class="ds-badge ds-badge-success">{{ dados.aprovados }}</span></td>
                      <td><span class="ds-badge ds-badge-danger">{{ dados.reprovados }}</span></td>
                      <td><span class="ds-badge ds-badge-warning">{{ dados.desistentes }}</span></td>
                      <td>{{ dados.taxaConclusao }}%</td>
                      <td>{{ dados.frequenciaMedia }}%</td>
                      <td><strong>{{ dados.nps }}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- CRUZAMENTOS POR MODALIDADE -->
            <h2 class="section-title mb-4">Análise Por Modalidade</h2>
            <div class="ds-card">
              <div class="table-responsive">
                <table class="ds-table w-100">
                  <thead>
                    <tr>
                      <th>Modalidade</th>
                      <th>Total</th>
                      <th>Aprovados</th>
                      <th>Reprovados</th>
                      <th>Desistentes</th>
                      <th>Taxa Conclusão</th>
                      <th>Frequência Média</th>
                      <th>NPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(dados, modalidade) in cruzamentos.porModalidade" :key="modalidade">
                      <td><strong>{{ modalidade }}</strong></td>
                      <td>{{ dados.total }}</td>
                      <td><span class="ds-badge ds-badge-success">{{ dados.aprovados }}</span></td>
                      <td><span class="ds-badge ds-badge-danger">{{ dados.reprovados }}</span></td>
                      <td><span class="ds-badge ds-badge-warning">{{ dados.desistentes }}</span></td>
                      <td>{{ dados.taxaConclusao }}%</td>
                      <td>{{ dados.frequenciaMedia }}%</td>
                      <td><strong>{{ dados.nps }}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--ds-bg-page);
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  background: linear-gradient(135deg, var(--ds-primary) 0%, #0d47a1 100%);
  color: white;
  padding: var(--ds-space-lg);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.sidebar-header {
  margin-bottom: var(--ds-space-xl);
  padding-bottom: var(--ds-space-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-sm);
  margin-bottom: var(--ds-space-lg);
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: rgba(255, 255, 255, 0.8);
  padding: var(--ds-space-md) var(--ds-space-base);
  border-radius: var(--ds-radius-md);
  cursor: pointer;
  font-weight: 500;
  font-size: var(--ds-font-size-sm);
  transition: all 0.3s;
  text-align: left;
  white-space: nowrap;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-btn.active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-weight: 600;
}

/* MAIN CONTENT */
.main-content {
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

.ds-page-header {
  margin-bottom: 0;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--ds-primary);
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ds-primary);
}

.kpi-label {
  font-size: var(--ds-font-size-sm);
  color: var(--ds-text-secondary);
  font-weight: 500;
  margin: 0 0 var(--ds-space-base) 0;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--ds-primary);
  margin: 0;
  line-height: 1;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5);
}

.border-bottom {
  border-bottom: 1px solid var(--ds-border) !important;
}

.table-responsive {
  overflow-x: auto;
}

.w-100 {
  width: 100%;
}

.nps-zona {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 8px;
}

.border-success {
  border-top: 4px solid var(--ds-success) !important;
}

.border-info {
  border-top: 4px solid var(--ds-info) !important;
}

.border-warning {
  border-top: 4px solid var(--ds-warning) !important;
}

.border-danger {
  border-top: 4px solid var(--ds-danger) !important;
}

.text-success {
  color: var(--ds-success) !important;
}

.text-info {
  color: var(--ds-info) !important;
}

.text-warning {
  color: var(--ds-warning) !important;
}

.text-danger {
  color: var(--ds-danger) !important;
}

@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    left: -260px;
  }
  .main-content {
    margin-left: 0;
  }
}
</style>
