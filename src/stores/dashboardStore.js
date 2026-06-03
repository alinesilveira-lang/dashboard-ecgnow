import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  // Estado
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)
  const data = ref({
    alunos: [],
    performance: [],
    cadastro: []
  })
  const filters = ref({
    turma: '',
    status: '',
    modalidade: '',
    periodo: 'todos'
  })

  // Computed
  const alunosFiltrados = computed(() => {
    let resultado = data.value.alunos

    if (filters.value.turma) {
      resultado = resultado.filter(a => a.turma === filters.value.turma)
    }

    if (filters.value.status) {
      resultado = resultado.filter(a => a.status === filters.value.status)
    }

    if (filters.value.modalidade) {
      resultado = resultado.filter(a => a.modalidade === filters.value.modalidade)
    }

    return resultado
  })

  const turmas = computed(() => {
    return [...new Set(data.value.alunos.map(a => a.turma))].filter(Boolean)
  })

  const statuses = computed(() => {
    return [...new Set(data.value.alunos.map(a => a.status))].filter(Boolean)
  })

  const modalidades = computed(() => {
    return [...new Set(data.value.alunos.map(a => a.modalidade))].filter(Boolean)
  })

  // Ações
  function setAuthenticated(value) {
    isAuthenticated.value = value
  }

  function setLoading(value) {
    isLoading.value = value
  }

  function setError(err) {
    error.value = err
  }

  function setData(novoDados) {
    data.value = novoDados
  }

  function setFilter(filterName, value) {
    filters.value[filterName] = value
  }

  function clearFilters() {
    filters.value = {
      turma: '',
      status: '',
      modalidade: '',
      periodo: 'todos'
    }
  }

  return {
    // Estado
    isAuthenticated,
    isLoading,
    error,
    data,
    filters,

    // Computed
    alunosFiltrados,
    turmas,
    statuses,
    modalidades,

    // Ações
    setAuthenticated,
    setLoading,
    setError,
    setData,
    setFilter,
    clearFilters
  }
})
