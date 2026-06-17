import React from 'react';

const AbaPipeline = ({ kpis }) => {
  if (!kpis) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🎓 Pipeline de Recrutamento</h2>

      <div className="card">
        <h3 className="card-title">Funil de Conversão</h3>

        <div className="space-y-8">
          {/* Funil Visual */}
          <div className="space-y-4">
            {[
              { label: '📋 Candidatos', count: kpis.totalCandidatos, color: 'from-blue-500', percent: 100 },
              { label: '✅ Aprovados', count: kpis.aprovadosRecrutamento, color: 'from-green-500', percent: (kpis.aprovadosRecrutamento / kpis.totalCandidatos * 100) },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-2xl font-bold">{item.count}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} to-slate-800 flex items-center justify-end pr-3`}
                    style={{ width: `${item.percent}%` }}
                  >
                    <span className="text-xs font-bold text-white">{item.percent.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Taxa de Conversão */}
          <div className="bg-gradient-to-br from-cyan-500/20 to-slate-800 rounded-xl p-6 border border-cyan-500/50">
            <div className="text-center">
              <p className="text-sm font-medium text-cyan-300 mb-2">Taxa de Conversão</p>
              <p className="text-5xl font-bold text-cyan-400">{kpis.taxaConversao}%</p>
              <p className="text-xs text-cyan-300 mt-3">
                {kpis.aprovadosRecrutamento} aprovados de {kpis.totalCandidatos} candidatos
              </p>
            </div>
          </div>

          {/* Próximas Funcionalidades */}
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <p className="text-sm font-medium text-slate-300 mb-3">🚀 Em Breve:</p>
            <ul className="text-xs text-slate-400 space-y-2">
              <li>✓ Email automation para candidatos aprovados</li>
              <li>✓ Integração com calendário (Calendly)</li>
              <li>✓ Notificações automáticas</li>
              <li>✓ Dashboard de progresso por candidato</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbaPipeline;
