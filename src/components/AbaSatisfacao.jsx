import React from 'react';
import { AlertCircle } from 'lucide-react';

const AbaSatisfacao = ({ kpis }) => {
  if (!kpis) return <div className="p-6">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">⭐ Satisfação & Retenção</h2>

      {/* NPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="card-title">NPS Score</h3>
          <div className="text-center space-y-4">
            <div>
              <p className="text-5xl font-bold text-cyan-400">{kpis.npsScore}%</p>
              <p className="text-sm text-cyan-300 mt-2">Zona de Excelência 🌟</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">NPS Detalhado</h3>
          <div className="space-y-3">
            <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/50">
              <div className="flex justify-between">
                <span className="text-green-300">👍 Promotores (9-10)</span>
                <span className="font-bold text-green-400">{kpis.npsDetalhes.promotores}</span>
              </div>
            </div>
            <div className="bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/50">
              <div className="flex justify-between">
                <span className="text-yellow-300">😐 Passivos (7-8)</span>
                <span className="font-bold text-yellow-400">{kpis.npsDetalhes.passivos}</span>
              </div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/50">
              <div className="flex justify-between">
                <span className="text-red-300">👎 Detratores (0-6)</span>
                <span className="font-bold text-red-400">{kpis.npsDetalhes.detratores}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engajamento */}
      <div className="card">
        <h3 className="card-title">💪 Engajamento na Plataforma</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-green-300">🔥 Alto</span>
              <span>{kpis.engajamento.alto}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '33%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-yellow-300">😊 Médio</span>
              <span>{kpis.engajamento.medio}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: '36%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-orange-300">⚠️ Baixo</span>
              <span>{kpis.engajamento.baixo}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-orange-500" style={{ width: '17%' }} />
            </div>
          </div>
        </div>

        {(kpis.engajamento.baixo + kpis.engajamento.nenhum) > 0 && (
          <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-500/50 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-300">⚠️ Atenção</p>
              <p className="text-xs text-red-200">
                {kpis.engajamento.baixo + kpis.engajamento.nenhum} alunos precisam de acompanhamento
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbaSatisfacao;
