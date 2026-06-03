export function calcularIndicadores(alunos) {
  if (!alunos || alunos.length === 0) {
    return {
      totalAlunos: 0,
      taxaConclusaoTeoria: 0,
      taxaAprovacao: 0,
      inadimplencia: 0,
      npsMedio: 0,
      alunosAtivos: 0,
      alunosInativos: 0
    }
  }

  const total = alunos.length

  // Taxa de conclusão teórica (% conclusão >= 100%)
  const comTeoriaCompleta = alunos.filter(a =>
    a.percentual_conclusao_teorico && a.percentual_conclusao_teorico >= 100
  ).length
  const taxaConclusaoTeoria = Math.round((comTeoriaCompleta / total) * 100)

  // Taxa de aprovação em prova
  const aprovados = alunos.filter(a => a.resultado_final === 'Aprovado').length
  const fizeram_prova = alunos.filter(a => a.data_prova).length
  const taxaAprovacao = fizeram_prova > 0 ? Math.round((aprovados / fizeram_prova) * 100) : 0

  // Inadimplência
  const inadimplentes = alunos.filter(a => a.inadimplente === true || a.inadimplente === 'Sim').length
  const inadimplencia = Math.round((inadimplentes / total) * 100)

  // NPS médio
  const comnps = alunos.filter(a => a.nps !== null && a.nps !== undefined && a.nps !== '')
  const npsMedio = comnps.length > 0
    ? Math.round(comnps.reduce((acc, a) => acc + parseInt(a.nps), 0) / comnps.length)
    : 0

  // Alunos ativos vs inativos
  const alunosAtivos = alunos.filter(a =>
    a.status === 'Ativo' || a.status === 'Parte teórica' || a.status === 'Parte prática'
  ).length
  const alunosInativos = total - alunosAtivos

  return {
    totalAlunos: total,
    taxaConclusaoTeoria,
    taxaAprovacao,
    inadimplencia,
    npsMedio,
    alunosAtivos,
    alunosInativos,
    aprovados,
    fizerampriva: fizeram_prova
  }
}

export function calcularAprovacaoPorModalidade(alunos) {
  const modalidades = {}

  alunos.forEach(aluno => {
    const mod = aluno.modalidade_pratica || 'Sem modalidade'

    if (!modalidades[mod]) {
      modalidades[mod] = { total: 0, aprovados: 0 }
    }

    modalidades[mod].total++
    if (aluno.resultado_final === 'Aprovado') {
      modalidades[mod].aprovados++
    }
  })

  const resultado = {}
  Object.keys(modalidades).forEach(mod => {
    const { total, aprovados } = modalidades[mod]
    resultado[mod] = {
      total,
      aprovados,
      taxa: total > 0 ? Math.round((aprovados / total) * 100) : 0
    }
  })

  return resultado
}

export function calcularProgressoPorTurma(alunos) {
  const turmas = {}

  alunos.forEach(aluno => {
    const turma = aluno.turma || 'Sem turma'

    if (!turmas[turma]) {
      turmas[turma] = {
        total: 0,
        comTeoria100: 0,
        comPratica100: 0,
        aprovados: 0
      }
    }

    turmas[turma].total++
    if (aluno.percentual_conclusao_teorico >= 100) turmas[turma].comTeoria100++
    if (aluno.percentual_conclusao_pratico >= 100) turmas[turma].comPratica100++
    if (aluno.resultado_final === 'Aprovado') turmas[turma].aprovados++
  })

  const resultado = {}
  Object.keys(turmas).forEach(turma => {
    const dados = turmas[turma]
    resultado[turma] = {
      total: dados.total,
      taxaConclusaoTeoria: Math.round((dados.comTeoria100 / dados.total) * 100),
      taxaConclusaoPratica: Math.round((dados.comPratica100 / dados.total) * 100),
      taxaAprovacao: Math.round((dados.aprovados / dados.total) * 100)
    }
  })

  return resultado
}

export function identificarAlunosEmRisco(alunos) {
  const hoje = new Date()
  const dias30AtrasEmMs = 30 * 24 * 60 * 60 * 1000

  return alunos.filter(aluno => {
    if (!aluno.ultima_atividade) return false

    const ultimaAtividade = new Date(aluno.ultima_atividade)
    const diferenca = hoje - ultimaAtividade

    return diferenca > dias30AtrasEmMs &&
           (aluno.status === 'Ativo' || aluno.status === 'Parte teórica' || aluno.status === 'Parte prática')
  })
}

export function calcularPorcentagemParaProximo(aluno) {
  // Se não completou teoria, focus em teoria
  if (aluno.percentual_conclusao_teorico < 100) {
    return {
      etapa: 'Teoria',
      percentual: aluno.percentual_conclusao_teorico,
      proximo: 'Prova'
    }
  }

  // Se completou teoria mas não fez prova, prova é o próximo
  if (aluno.percentual_conclusao_teorico >= 100 && !aluno.data_prova) {
    return {
      etapa: 'Aguardando Prova',
      percentual: 100,
      proximo: 'Resultado'
    }
  }

  // Se fez prova mas não completou prática
  if (aluno.percentual_conclusao_pratico < 100) {
    return {
      etapa: 'Prática',
      percentual: aluno.percentual_conclusao_pratico,
      proximo: 'Conclusão'
    }
  }

  // Completo
  return {
    etapa: 'Conclusão',
    percentual: 100,
    proximo: 'Certificado'
  }
}
