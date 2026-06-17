import React from 'react';

const AbaDesempenho = ({ kpis }) => {
  if (!kpis) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📚 Desempenho Acadêmico</h2>

      {/* Taxa de Aprovação */}
      <div className="card">
        <h3 className="card-title">✅ Taxa de Aprovação</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-cyan-400">{kpis.taxaAprovacao}%</p>
            <p className="text-sm text-slate-400 mt-2">Taxa Geral</p>
          </div>
          <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/50 text-center">
            <p className="text-3xl font-bold text-green-400">{kpis.aprovados}</p>
            <p className="text-sm text-green-300">Aprovados</p>
          </div>
          <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/50 text-center">
            <p className="text-3xl font-bold text-red-400">{kpis.reprovados}</p>
            <p className="text-sm text-red-300">Reprovados</p>
          </div>
        </div>
      </div>

      {/* Status dos Alunos */}
      <div className="card">
        <h3 className="card-title">📊 Distribuição por Status</h3>
        <div className="space-y-4">
          {Object.entries(kpis.statusDistribuicao).map(([status, count]) => (
            <div key={status}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium capitalize">{status}</span>
                <span className="text-sm font-bold">{count}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{
                    width: `${(count / kpis.totalAlunos) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AbaDesempenho;
