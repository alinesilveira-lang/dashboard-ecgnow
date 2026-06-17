import React, { useMemo } from 'react';
import { Users, TrendingUp, Zap, AlertCircle } from 'lucide-react';

const AbaAlunos = ({ kpis, alunos = [], filters = {} }) => {
  if (!kpis || !alunos.length) return <div className="p-6 text-center">Carregando dados...</div>;

  // Filtrar alunos baseado nos filtros
  const filteredAlunos = useMemo(() => {
    return alunos.filter(aluno => {
      const matchTurma = !filters.turma || (aluno.turma || '').includes(filters.turma);
      const matchEngajamento = !filters.engajamento || aluno.engajamento === filters.engajamento;
      const matchStatus = !filters.status || aluno.status === filters.status;
      const matchModalidade = !filters.modalidade || (aluno.modalidade || '').includes(filters.modalidade);
      return matchTurma && matchEngajamento && matchStatus && matchModalidade;
    });
  }, [alunos, filters]);

  // Dados por turma
  const turmaData = useMemo(() => {
    const grouped = {};
    filteredAlunos.forEach(aluno => {
      const turma = aluno.turma || 'Sem turma';
      grouped[turma] = (grouped[turma] || 0) + 1;
    });
    return Object.entries(grouped).map(([nome, count]) => ({ nome, count }));
  }, [filteredAlunos]);

  // Dados de engajamento
  const engajamentoData = useMemo(() => {
    const grouped = { Alto: 0, Médio: 0, Baixo: 0, Nenhum: 0 };
    filteredAlunos.forEach(aluno => {
      const eng = aluno.engajamento || 'Nenhum';
      if (grouped.hasOwnProperty(eng)) grouped[eng]++;
    });
    return Object.entries(grouped).map(([nome, count]) => ({ nome, count }));
  }, [filteredAlunos]);

  // Dados de status
  const statusData = useMemo(() => {
    const grouped = { Ativo: 0, 'Em Risco': 0, Concluído: 0, 'Abandono do curso': 0 };
    filteredAlunos.forEach(aluno => {
      const status = aluno.status || 'Ativo';
      if (grouped.hasOwnProperty(status)) grouped[status]++;
    });
    return Object.entries(grouped).map(([nome, count]) => ({ nome, count }));
  }, [filteredAlunos]);

  // Progresso médio
  const progressoMedio = useMemo(() => {
    if (filteredAlunos.length === 0) return 0;
    const soma = filteredAlunos.reduce((acc, aluno) => acc + (parseInt(aluno.progresso) || 0), 0);
    return (soma / filteredAlunos.length).toFixed(1);
  }, [filteredAlunos]);

  // Alunos por dias remanescentes
  const diasData = useMemo(() => {
    const grupos = { 'Vence em 7 dias': 0, '8-30 dias': 0, '+30 dias': 0 };
    filteredAlunos.forEach(aluno => {
      const dias = parseInt(aluno.dias_remanescentes) || 0;
      if (dias <= 7) grupos['Vence em 7 dias']++;
      else if (dias <= 30) grupos['8-30 dias']++;
      else grupos['+30 dias']++;
    });
    return Object.entries(grupos).map(([nome, count]) => ({ nome, count }));
  }, [filteredAlunos]);

  // Alunos por modalidade (Coluna K: Teórico, Prático, Só teórico)
  const modalidadeData = useMemo(() => {
    const grupos = { 'Teoria': 0, 'Prático': 0, 'Ambos': 0, 'Concluído': 0 };
    filteredAlunos.forEach(aluno => {
      const mod = (aluno.modalidade || aluno.teórico_prático || '').trim().toLowerCase();

      if (mod.includes('teórico') && mod.includes('prático')) {
        grupos['Ambos']++;
      } else if (mod.includes('prático')) {
        grupos['Prático']++;
      } else if (mod.includes('teórico') || mod.includes('só teórico')) {
        grupos['Teoria']++;
      } else if (!mod) {
        // Em branco = concluído ou abandonado
        grupos['Concluído']++;
      }
    });
    return Object.entries(grupos).map(([nome, count]) => ({ nome, count }));
  }, [filteredAlunos]);

  const Card = ({ icon: Icon, titulo, valor, cor, detalhes }) => (
    <div className={`rounded-xl p-6 border ${cor}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{titulo}</h3>
        <Icon size={24} />
      </div>
      <p className="text-4xl font-bold mb-2">{valor}</p>
      {detalhes && <p className="text-sm text-slate-400">{detalhes}</p>}
    </div>
  );

  const GraficoBarras = ({ titulo, dados, cores }) => (
    <div className="card">
      <h3 className="card-title">{titulo}</h3>
      <div className="space-y-4">
        {dados.map((item, idx) => (
          <div key={idx}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">{item.nome}</span>
              <span className="font-bold">{item.count}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${cores[idx] || 'bg-cyan-500'}`}
                style={{ width: `${(item.count / Math.max(...dados.map(d => d.count))) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          icon={Users}
          titulo="Total de Alunos"
          valor={filteredAlunos.length}
          cor="bg-gradient-to-br from-blue-500/20 to-slate-800 border-blue-500/50"
          detalhes={`Filtrados dos ${alunos.length} totais`}
        />
        <Card
          icon={TrendingUp}
          titulo="Progresso Médio"
          valor={`${progressoMedio}%`}
          cor="bg-gradient-to-br from-cyan-500/20 to-slate-800 border-cyan-500/50"
          detalhes="Da turma selecionada"
        />
        <Card
          icon={Zap}
          titulo="Engajamento Alto"
          valor={engajamentoData[0]?.count || 0}
          cor="bg-gradient-to-br from-green-500/20 to-slate-800 border-green-500/50"
          detalhes="Alunos muito ativos"
        />
        <Card
          icon={AlertCircle}
          titulo="Em Risco"
          valor={statusData[1]?.count || 0}
          cor="bg-gradient-to-br from-red-500/20 to-slate-800 border-red-500/50"
          detalhes="Precisam acompanhamento"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GraficoBarras
          titulo="📚 Alunos por Turma"
          dados={turmaData}
          cores={['bg-blue-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500']}
        />
        <GraficoBarras
          titulo="🎓 Modalidade"
          dados={modalidadeData}
          cores={['bg-cyan-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500']}
        />
        <GraficoBarras
          titulo="🔥 Engajamento"
          dados={engajamentoData}
          cores={['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500']}
        />
        <GraficoBarras
          titulo="✅ Status dos Alunos"
          dados={statusData}
          cores={['bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-red-600']}
        />
      </div>

      {/* Alertas */}
      {(statusData[1]?.count > 0 || statusData[3]?.count > 0) && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-300 mb-1">⚠️ Atenção</h3>
              {statusData[1]?.count > 0 && (
                <p className="text-sm text-red-200">
                  {statusData[1]?.count} alunos estão em risco e precisam de acompanhamento.
                </p>
              )}
              {statusData[3]?.count > 0 && (
                <p className="text-sm text-red-200">
                  {statusData[3]?.count} alunos em abandono do curso - sem comunicação.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AbaAlunos;
