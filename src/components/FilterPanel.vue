<script setup>
import { useDashboardStore } from '../stores/dashboardStore'

const store = useDashboardStore()
</script>

<template>
  <div class="ds-card filter-panel mb-4">
    <div class="ds-card-header">
      <h3 class="ds-card-title">🔍 Filtros</h3>
    </div>

    <div class="ds-card-body">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label ds-label">Turma</label>
          <select
            class="form-select ds-select"
            v-model="store.filters.turma"
          >
            <option value="">Todas as turmas</option>
            <option v-for="turma in store.turmas" :key="turma" :value="turma">
              {{ turma }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label ds-label">Status</label>
          <select
            class="form-select ds-select"
            v-model="store.filters.status"
          >
            <option value="">Todos os status</option>
            <option v-for="status in store.statuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label ds-label">Modalidade</label>
          <select
            class="form-select ds-select"
            v-model="store.filters.modalidade"
          >
            <option value="">Todas as modalidades</option>
            <option v-for="mod in store.modalidades" :key="mod" :value="mod">
              {{ mod }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label ds-label">&nbsp;</label>
          <button
            @click="store.clearFilters"
            class="btn ds-btn ds-btn-outline w-100"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  background-color: #f8f9fa;
}

.row {
  margin: 0;
}
</style>
