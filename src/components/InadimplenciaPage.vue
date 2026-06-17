<script setup>
import { ref, computed, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  indicators: {
    type: Object,
    default: () => ({})
  }
})

const pieDados = computed(() => {
  if (!props.indicators) return {}

  let valorPix = 0
  if (props.indicators.alunosInadimplentes) {
    props.indicators.alunosInadimplentes.forEach(aluno => {
      const tipo = aluno.tipo?.toUpperCase() || ''
      if (tipo.includes('PIX')) {
        valorPix += aluno.valor || 0
      }
    })
  }

  return {
    labels: ['ASAAS', 'Boletos', 'PIX'],
    datasets: [
      {
        label: 'Valor de Inadimplência',
        data: [
          props.indicators.valorTotalAsaas || 0,
          props.indicators.valorTotalBoletos || 0,
          valorPix
        ],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD93D'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2
      }
    ]
  }
})

const barDados = computed(() => {
  if (!props.indicators || !props.indicators.alunosInadimplentes) return {}

  const alunosPorTipo = {
    'ASAAS': 0,
    'Boleto': 0
  }

  props.indicators.alunosInadimplentes.forEach(aluno => {
    const tipo = aluno.tipo?.toUpperCase() || 'ASAAS'
    if (tipo.includes('ASAAS')) alunosPorTipo['ASAAS']++
    else if (tipo.includes('BOLETO')) alunosPorTipo['Boleto']++
  })

  return {
    labels: ['ASAAS', 'Boleto'],
    datasets: [
      {
        label: 'Quantidade de Alunos Inadimplentes',
        data: [alunosPorTipo['ASAAS'], alunosPorTipo['Boleto']],
        backgroundColor: ['#FF6B6B', '#4ECDC4'],
        borderColor: ['#fff', '#fff'],
        borderWidth: 1
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const formatMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}
</script>

<template>
  <div class="ds-card">
    <div class="ds-card-header">
      <h2 class="ds-card-title">💳 Inadimplência</h2>
    </div>

    <div class="ds-card-body">
      <!-- Cards de Resumo -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="ds-stat-card">
            <div class="ds-stat-label">Total Inadimplentes</div>
            <div class="ds-stat-value">{{ indicators.totalInadimplentes || 0 }}</div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="ds-stat-card">
            <div class="ds-stat-label">Valor Total</div>
            <div class="ds-stat-value-moeda">{{ formatMoeda(indicators.valorTotal || 0) }}</div>
          </div>
        </div>
      </div>

      <!-- Detalhes por Tipo (Horizontal) -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="ds-detail-card">
            <span class="badge bg-danger mb-2">ASAAS</span>
            <div class="detail-valor">{{ formatMoeda(indicators.valorTotalAsaas || 0) }}</div>
            <div class="detail-qtd">{{ indicators.quantidadeAsaas }} alunos</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="ds-detail-card">
            <span class="badge bg-info mb-2">Boletos</span>
            <div class="detail-valor">{{ formatMoeda(indicators.valorTotalBoletos || 0) }}</div>
            <div class="detail-qtd">{{ indicators.quantidadeBoletos }} alunos</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="ds-detail-card">
            <span class="badge bg-warning text-dark mb-2">PIX</span>
            <div class="detail-valor">{{ formatMoeda(indicators.valorTotalPix || 0) }}</div>
            <div class="detail-qtd">{{ indicators.quantidadePix }} alunos</div>
          </div>
        </div>
      </div>

      <!-- Gráfico (Centralizado) -->
      <div class="row mb-4">
        <div class="col-md-6 mx-auto">
          <div class="ds-chart-card">
            <h4 class="mb-3 text-center">Distribuição por Tipo de Pagamento</h4>
            <div style="max-width: 250px; height: 200px; margin: 0 auto;">
              <Pie :data="pieDados" :options="chartOptions" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela de Inadimplentes -->
      <div class="ds-table-wrapper">
        <h4 class="mb-3">📋 Alunos Inadimplentes ({{ indicators.alunosInadimplentes?.length || 0 }})</h4>
        <table class="table ds-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th class="text-center">Valor</th>
              <th>Tipo de Pagamento</th>
              <th>Turma</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!indicators.alunosInadimplentes || indicators.alunosInadimplentes.length === 0">
              <td colspan="4" class="ds-table-empty">
                Nenhum aluno inadimplente encontrado
              </td>
            </tr>
            <tr v-for="(aluno, idx) in indicators.alunosInadimplentes" :key="idx">
              <td class="fw-500">{{ aluno.nome }}</td>
              <td class="text-center">
                <span class="ds-badge ds-badge-danger">
                  {{ formatMoeda(aluno.valor) }}
                </span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="aluno.tipo?.toUpperCase().includes('ASAAS') ? 'bg-danger' : 'bg-warning'"
                >
                  {{ aluno.tipo }}
                </span>
              </td>
              <td>{{ aluno.turma || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ds-stat-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
}

.ds-stat-label {
  font-size: 12px;
  color: #6c757d;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 8px;
}

.ds-stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #003d7a;
}

.ds-stat-value-moeda {
  font-size: 20px;
  font-weight: 700;
  color: #003d7a;
}

.ds-stat-distribution {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.ds-detail-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
}

.ds-detail-card .badge {
  font-size: 11px;
  padding: 6px 10px;
  display: block;
  margin-bottom: 12px;
}

.detail-valor {
  font-size: 18px;
  font-weight: 700;
  color: #003d7a;
  margin-bottom: 6px;
}

.detail-qtd {
  font-size: 12px;
  color: #6c757d;
}

.ds-chart-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.ds-chart-card h4 {
  color: #003d7a;
  font-weight: 600;
}

.fw-500 {
  font-weight: 500;
}

.table {
  margin-bottom: 0;
}

td {
  vertical-align: middle;
}

.ds-badge {
  font-size: 11px;
  padding: 4px 8px;
}

.ds-badge-danger {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
