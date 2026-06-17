<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  alunos: {
    type: Array,
    default: () => []
  },
  somenteTeroria: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  if (props.alunos && props.alunos.length > 0) {
    console.log('DEBUG IndicatorTable:', {
      totalAlunos: props.alunos.length,
      primeiroAluno: props.alunos[0],
      colunas: Object.keys(props.alunos[0]),
      percentualTeoria: props.alunos[0].percentual_conclusao_teorico,
      percentualPratica: props.alunos[0].percentual_conclusao_pratico
    })
  }
})

const statusColors = {
  'Aprovado': 'success',
  'Reprovado': 'danger',
  'Ativo': 'info',
  'Concluído': 'success',
  'Desistente': 'warning',
  'Cancelou o curso': 'danger',
  'Parte teórica': 'info',
  'Parte prática': 'warning',
  'Analista ECGNOW': 'success',
  'Ex analista ECGNOW': 'neutral'
}

const getStatusBadgeClass = (status) => {
  return statusColors[status] || 'neutral'
}

const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%'
  let num = parseFloat(value)
  // Se o valor é decimal (0-1), multiplica por 100
  if (num <= 1 && num >= 0) {
    num = num * 100
  }
  return `${Math.round(num)}%`
}

const formatNPS = (nps) => {
  if (!nps) return '-'
  const num = parseInt(nps)
  if (num >= 8) return `⭐ ${num}`
  if (num >= 6) return `🙂 ${num}`
  return `😐 ${num}`
}
</script>

<template>
  <div class="ds-card">
    <div class="ds-card-header">
      <h3 class="ds-card-title">
        📋 Progresso dos Alunos ({{ alunos.length }})
      </h3>
    </div>

    <div class="ds-card-body">
      <div class="ds-table-wrapper">
        <table class="table ds-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th class="text-center">% Teoria</th>
              <th v-if="!somenteTeroria" class="text-center">% Prática</th>
              <th v-if="!somenteTeroria" class="text-center">Prova</th>
              <th v-if="!somenteTeroria" class="text-center">Resultado</th>
              <th v-if="!somenteTeroria" class="text-center">NPS</th>
              <th>Turma</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="alunos.length === 0">
              <td :colspan="somenteTeroria ? 4 : 8" class="ds-table-empty">
                Nenhum aluno encontrado com os filtros selecionados
              </td>
            </tr>

            <tr v-for="aluno in alunos" :key="aluno.id || aluno.matricula">
              <td class="fw-500">{{ aluno.nome }}</td>

              <td class="text-center">
                <div class="progress" style="height: 20px;">
                  <div
                    class="progress-bar bg-info"
                    :style="{ width: `${Math.min(aluno.percentual_conclusao_teorico, 100)}%` }"
                  >
                    {{ formatPercentage(aluno.percentual_conclusao_teorico) }}
                  </div>
                </div>
              </td>

              <td v-if="!somenteTeroria" class="text-center">
                <div class="progress" style="height: 20px;">
                  <div
                    class="progress-bar bg-success"
                    :style="{ width: `${Math.min(aluno.percentual_conclusao_pratico, 100)}%` }"
                  >
                    {{ formatPercentage(aluno.percentual_conclusao_pratico) }}
                  </div>
                </div>
              </td>

              <td v-if="!somenteTeroria" class="text-center">
                <span v-if="aluno.data_prova" class="ds-badge ds-badge-success">
                  ✓ {{ new Date(aluno.data_prova).toLocaleDateString('pt-BR') }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>

              <td v-if="!somenteTeroria" class="text-center">
                <span
                  v-if="aluno.resultado_final"
                  class="ds-badge"
                  :class="`ds-badge-${getStatusBadgeClass(aluno.resultado_final)}`"
                >
                  {{ aluno.resultado_final }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>

              <td v-if="!somenteTeroria" class="text-center">
                {{ formatNPS(aluno.nps) }}
              </td>

              <td>
                <span class="badge bg-light text-dark">{{ aluno.turma || '-' }}</span>
              </td>

              <td>
                <span
                  class="ds-badge"
                  :class="`ds-badge-${getStatusBadgeClass(aluno.status)}`"
                >
                  {{ aluno.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress {
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.fw-500 {
  font-weight: 500;
}

.badge {
  font-size: 11px;
  padding: 4px 8px;
}

.text-muted {
  color: var(--ds-text-secondary) !important;
}

td {
  vertical-align: middle;
}
</style>
