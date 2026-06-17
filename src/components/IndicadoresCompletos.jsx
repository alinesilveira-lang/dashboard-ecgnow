import React from 'react';
import { TrendingUp, Users, Award, Heart, DollarSign, AlertCircle, BarChart3 } from 'lucide-react';
import { formatarMoeda } from '../services/kpiService';

const IndicadoresCompletos = ({ kpis }) => {
  if (!kpis) return <div className="p-6 text-center">Carregando indicadores...</div>;

  return (
    <div className="space-y-12">
      {/* ===== SEÇÃO 1: KPIs PRINCIPAIS ===== */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 size={28} className="text-cyan-400" />
          KPIs Principais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Receita */}
          <div className="bg-gradient-to-br from-green-500 to-slate-800 rounded-xl p-6 border border-green-400/20 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-green-200">Receita Total</p>
              <DollarSign size={20} className="text-green-300" />
            </div>
            <p className="text-3xl font-bold text-white">{formatarMoeda(kpis.receitaTotal)}</p>
            <p className="text-xs text-green-200 mt-2">De {kpis.totalTransacoes} transações</p>
          </div>

          {/* Alunos Ativos */}
          <div className="bg-gradient-to-br from-blue-500 to-slate-800 rounded-xl p-6 border border-blue-400/20 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-blue-200">Alunos Ativos</p>
              <Users size={20} className="text-blue-300" />
            </div>
            <p className="text-3xl font-bold text-white">{kpis.totalAtivos}</p>
            <p className="text-xs text-blue-200 mt-2">De {kpis.totalAlunos} alunos</p>
          </div>

          {/* Taxa Aprovação */}
          <div className="bg-gradient-to-br from-purple-500 to-slate-800 rounded-xl p-6 border border-purple-400/20 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-purple-200">Taxa Aprovação</p>
              <Award size={20} className="text-purple-300" />
            </div>
            <p className="text-3xl font-bold text-white">{kpis.taxaAprovacao}%</p>
            <p className="text-xs text-purple-200 mt-2">{kpis.aprovados} aprovados</p>
          </div>

          {/* NPS */}
          <div className="bg-gradient-to-br from-cyan-500 to-slate-800 rounded-xl p-6 border border-cyan-400/20 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-cyan-200">NPS (Satisfação)</p>
              <Heart size={20} className="text-cyan-300" />
            </div>
            <p className="text-3xl font-bold text-white">{kpis.npsScore}%</p>
            <p className="text-xs text-cyan-200 mt-2">Zona de Excelência 🌟</p>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO 2: INDICADORES ACADÊMICOS ===== */}
      <section className="pt-8 border-t border-slate-700/50">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Award size={28} className="text-purple-400" />
          Indicadores Acadêmicos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status dos Alunos */}
          <div className="card">
            <h3 className="card-title">📊 Distribuição por Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 items-center">
                  <span className="text-xs sm:text-sm font-medium">✅ Ativos</span>
                  <span className="text-sm font-bold">{kpis.statusDistribuicao.ativos}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(kpis.statusDistribuicao.ativos / kpis.totalAlunos) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">🎓 Concluídos</span>
                  <span className="text-sm font-bold">{kpis.statusDistribuicao.concluidos}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${(kpis.statusDistribuicao.concluidos / kpis.totalAlunos) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">⚠️ Em Risco</span>
                  <span className="text-sm font-bold">{kpis.statusDistribuicao.em_risco}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{
                      width: `${(kpis.statusDistribuicao.em_risco / kpis.totalAlunos) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">🚫 Abandono do Curso</span>
                  <span className="text-sm font-bold">{kpis.statusDistribuicao.abandono}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-red-600"
                    style={{
                      width: `${(kpis.statusDistribuicao.abandono / kpis.totalAlunos) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Aprovação */}
          <div className="card">
            <h3 className="card-title">✅ Taxa de Aprovação</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-cyan-400 mb-2">{kpis.taxaAprovacao}%</div>
                <p className="text-slate-400">Taxa de Aprovação Final</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/50">
                  <p className="text-2xl font-bold text-green-400">{kpis.aprovados}</p>
                  <p className="text-sm text-green-300">Aprovados</p>
                </div>
                <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/50">
                  <p className="text-2xl font-bold text-red-400">{kpis.reprovados}</p>
                  <p className="text-sm text-red-300">Reprovados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO 3: SATISFAÇÃO E ENGAJAMENTO ===== */}
      <section className="pt-8 border-t border-slate-700/50">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Heart size={28} className="text-pink-400" />
          Satisfação & Engajamento
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* NPS Detalhes */}
          <div className="card">
            <h3 className="card-title">⭐ NPS Detalhado</h3>
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-cyan-400">{kpis.npsScore}%</div>
                <p className="text-sm text-slate-400">NPS Score</p>
                <p className="text-xs text-cyan-300 mt-2">Zona de Excelência (acima de 50%)</p>
              </div>

              <div className="space-y-3">
                <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-300">👍 Promotores (9-10)</span>
                    <span className="text-lg font-bold text-green-400">{kpis.npsDetalhes.promotores}</span>
                  </div>
                </div>

                <div className="bg-yellow-500/20 rounded-lg p-3 border border-yellow-500/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-yellow-300">😐 Passivos (7-8)</span>
                    <span className="text-lg font-bold text-yellow-400">{kpis.npsDetalhes.passivos}</span>
                  </div>
                </div>

                <div className="bg-red-500/20 rounded-lg p-3 border border-red-500/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-300">👎 Detratores (0-6)</span>
                    <span className="text-lg font-bold text-red-400">{kpis.npsDetalhes.detratores}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center mt-4">
                {kpis.npsDetalhes.respondentes} alunos responderam à pesquisa
              </p>
            </div>
          </div>

          {/* Engajamento */}
          <div className="card">
            <h3 className="card-title">💪 Engajamento na Plataforma</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-green-300">🔥 Alto</span>
                  <span className="text-sm font-bold">{kpis.engajamento.alto}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(kpis.engajamento.alto / kpis.engajamentoTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-300">😊 Médio</span>
                  <span className="text-sm font-bold">{kpis.engajamento.medio}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{
                      width: `${(kpis.engajamento.medio / kpis.engajamentoTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-orange-300">⚠️ Baixo</span>
                  <span className="text-sm font-bold">{kpis.engajamento.baixo}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{
                      width: `${(kpis.engajamento.baixo / kpis.engajamentoTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-red-300">❌ Nenhum</span>
                  <span className="text-sm font-bold">{kpis.engajamento.nenhum}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${(kpis.engajamento.nenhum / kpis.engajamentoTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {(kpis.engajamento.baixo + kpis.engajamento.nenhum) > 0 && (
                <div className="mt-4 p-3 bg-red-500/20 rounded-lg border border-red-500/50 flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-300">⚠️ Atenção</p>
                    <p className="text-xs text-red-200">
                      {kpis.engajamento.baixo + kpis.engajamento.nenhum} alunos com engajamento crítico precisam de acompanhamento
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO 4: INDICADORES FINANCEIROS ===== */}
      <section className="pt-8 border-t border-slate-700/50">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <DollarSign size={28} className="text-green-400" />
          Indicadores Financeiros
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Receita */}
          <div className="card">
            <h3 className="card-title">💰 Receita Total</h3>
            <div className="text-center space-y-4">
              <div>
                <p className="text-4xl font-bold text-green-400">{formatarMoeda(kpis.receitaTotal)}</p>
                <p className="text-sm text-slate-400 mt-2">De {kpis.totalTransacoes} transações</p>
              </div>
            </div>
          </div>

          {/* Inadimplência */}
          <div className="card">
            <h3 className="card-title">⚠️ Inadimplência</h3>
            <div className="space-y-4">
              <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/50">
                <p className="text-3xl font-bold text-red-400">{kpis.inadimplentes}</p>
                <p className="text-sm text-red-300">Alunos inadimplentes</p>
              </div>
              <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/50">
                <p className="text-2xl font-bold text-red-400">{formatarMoeda(kpis.valorInadimplencia)}</p>
                <p className="text-sm text-red-300">Valor em aberto</p>
              </div>
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div className="card">
            <h3 className="card-title">💳 Formas de Pagamento</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/50">
                <span className="text-sm font-medium text-blue-300">💳 Cartão</span>
                <span className="font-bold text-blue-400">{kpis.pagamentos.cartao}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-500/20 rounded-lg border border-purple-500/50">
                <span className="text-sm font-medium text-purple-300">📱 Pix</span>
                <span className="font-bold text-purple-400">{kpis.pagamentos.pix}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-500/20 rounded-lg border border-orange-500/50">
                <span className="text-sm font-medium text-orange-300">🏦 Boleto</span>
                <span className="font-bold text-orange-400">{kpis.pagamentos.boleto}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/50">
                <span className="text-sm font-medium text-cyan-300">🔗 ASAAS</span>
                <span className="font-bold text-cyan-400">{kpis.pagamentos.asaas}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEÇÃO 5: RECRUTAMENTO ===== */}
      <section className="pt-8 border-t border-slate-700/50">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp size={28} className="text-blue-400" />
          Funil de Recrutamento
        </h2>

        <div className="card">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-cyan-400">{kpis.taxaConversao}%</p>
              <p className="text-slate-400 mt-2">Taxa de Conversão</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <p className="text-3xl font-bold text-white">{kpis.totalCandidatos}</p>
                <p className="text-sm text-slate-400 mt-2">📋 Total de Candidatos</p>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/50">
                <p className="text-3xl font-bold text-blue-400">→</p>
                <p className="text-sm text-blue-300 mt-2">Seleção</p>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/50">
                <p className="text-3xl font-bold text-green-400">{kpis.aprovadosRecrutamento}</p>
                <p className="text-sm text-green-300 mt-2">✅ Aprovados</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndicadoresCompletos;
