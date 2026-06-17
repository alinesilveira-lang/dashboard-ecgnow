import React, { useState, useMemo, useEffect } from 'react';
import { useSheetData } from './hooks/useSheetData';
import { calcularKPIsReais, formatarMoeda, formatarPercentual } from './services/kpiService';
import IndicadoresCompletos from './components/IndicadoresCompletos';
import AbaAlunos from './components/AbaAlunos';
import AbaDesempenho from './components/AbaDesempenho';
import AbaSatisfacao from './components/AbaSatisfacao';
import AbaPipeline from './components/AbaPipeline';
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Filter,
  Eye,
  Download,
  ArrowUp,
  ArrowDown,
  Circle,
  Plus,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const DashboardPremium = () => {
  // Sincronizar com Google Sheets
  const { data: sheetData, loading: sheetLoading, error: sheetError } = useSheetData();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('visao-geral');
  const [timePeriod, setTimePeriod] = useState('30');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    turma: '',
    engajamento: '',
    status: '',
    modalidade: '',
  });
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    modalidade: 'Teórico',
    cidade: '',
  });

  // Log para debug
  useEffect(() => {
    if (sheetData) {
      console.log('📊 Dados da Planilha carregados:', sheetData);
    }
    if (sheetError) {
      console.error('❌ Erro ao carregar dados:', sheetError);
    }
  }, [sheetData, sheetError]);

  // Dados simulados robustos
  const mockData = {
    kpis: {
      receita: { valor: 284500, variacao: 12.5, trending: 'up' },
      alunos: { valor: 847, variacao: 8.2, trending: 'up' },
      vendas: { valor: 156, variacao: -2.4, trending: 'down' },
      taxa_conclusao: { valor: 78.9, variacao: 4.1, trending: 'up' },
    },
    desempenho: [
      { mes: 'Jan', receita: 18500, vendas: 32, alunos: 125 },
      { mes: 'Fev', receita: 22300, vendas: 38, alunos: 142 },
      { mes: 'Mar', receita: 25600, vendas: 45, alunos: 158 },
      { mes: 'Abr', receita: 28900, vendas: 52, alunos: 176 },
      { mes: 'Mai', receita: 32100, vendas: 58, alunos: 195 },
      { mes: 'Jun', receita: 36200, vendas: 62, alunos: 211 },
    ],
    alunos: [
      { id: 1, nome: 'Carlos Silva', email: 'carlos@email.com', status: 'Ativo', progresso: 85, modalidade: 'Teórico' },
      { id: 2, nome: 'Marina Costa', email: 'marina@email.com', status: 'Ativo', progresso: 92, modalidade: 'Prático' },
      { id: 3, nome: 'João Santos', email: 'joao@email.com', status: 'Em Risco', progresso: 45, modalidade: 'Teórico' },
      { id: 4, nome: 'Ana Oliveira', email: 'ana@email.com', status: 'Ativo', progresso: 78, modalidade: 'Ambos' },
      { id: 5, nome: 'Pedro Martins', email: 'pedro@email.com', status: 'Concluído', progresso: 100, modalidade: 'Ambos' },
      { id: 6, nome: 'Lucia Ferreira', email: 'lucia@email.com', status: 'Ativo', progresso: 68, modalidade: 'Prático' },
    ],
    financeiro: [
      { id: 1, descricao: 'Matrícula - Carlos Silva', valor: 1500, tipo: 'Entrada', data: '2024-01-15', status: 'Pago' },
      { id: 2, descricao: 'Mensalidade - Marina Costa', valor: 800, tipo: 'Entrada', data: '2024-01-18', status: 'Pago' },
      { id: 3, descricao: 'Material Didático', valor: -350, tipo: 'Saída', data: '2024-01-20', status: 'Processando' },
      { id: 4, descricao: 'Bolsa Educacional', valor: -500, tipo: 'Saída', data: '2024-01-22', status: 'Processando' },
      { id: 5, descricao: 'Matrícula - João Santos', valor: 1500, tipo: 'Entrada', data: '2024-01-25', status: 'Pendente' },
    ],
  };

  const menuItems = [
    { id: 'visao-geral', label: 'Visão Geral', icon: BarChart3 },
    { id: 'alunos', label: 'Alunos', icon: Users },
    { id: 'desempenho', label: 'Desempenho', icon: TrendingUp },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'satisfacao', label: 'Satisfação', icon: Circle },
    { id: 'pipeline', label: 'Pipeline', icon: BarChart3 },
  ];

  // Usar dados reais da planilha se disponível, senão dados fictícios
  const alunosData = sheetData?.alunos && sheetData.alunos.length > 0
    ? sheetData.alunos
    : mockData.alunos;

  const financeirosData = sheetData?.financeiro && sheetData.financeiro.length > 0
    ? sheetData.financeiro
    : mockData.financeiro;

  const filteredAlunos = alunosData.filter(aluno => {
    const nome = aluno.nome || aluno.name || '';
    const matchSearch = nome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTurma = !filters.turma || (aluno.turma || '').includes(filters.turma);
    const matchEngajamento = !filters.engajamento || aluno.engajamento === filters.engajamento;
    const matchStatus = !filters.status || aluno.status === filters.status;
    const matchModalidade = !filters.modalidade || (aluno.modalidade || '').includes(filters.modalidade);

    return matchSearch && matchTurma && matchEngajamento && matchStatus && matchModalidade;
  });

  // Calcular KPIs em tempo real (dados REAIS da Sheets)
  const kpisReais = useMemo(() => {
    if (!sheetData) return null;
    return calcularKPIsReais(sheetData);
  }, [sheetData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Novo aluno adicionado:', formData);
    setFormData({ nome: '', email: '', telefone: '', modalidade: 'Teórico', cidade: '' });
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Modal Component
  const Modal = () => (
    <>
      {/* Backdrop com animação */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setShowModal(false)}
      />

      {/* Modal com animação fluida */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${
          showModal ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
              Novo Aluno
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleFormChange}
                placeholder="Ex: João Silva"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 placeholder-slate-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="ex@email.com"
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 placeholder-slate-500"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Telefone</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleFormChange}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 placeholder-slate-500"
              />
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Cidade</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleFormChange}
                placeholder="São Paulo"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 placeholder-slate-500"
              />
            </div>

            {/* Modalidade */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Modalidade</label>
              <select
                name="modalidade"
                value={formData.modalidade}
                onChange={handleFormChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 cursor-pointer"
              >
                <option>Teórico</option>
                <option>Prático</option>
                <option>Ambos</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-all duration-300 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 font-medium transform hover:scale-105 active:scale-95"
              >
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  // Renderizar gráfico de barras customizado
  const BarChart = ({ data }) => (
    <div className="flex items-end justify-between gap-2 h-48 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl">
      {data.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center gap-2 flex-1">
          <div className="text-xs text-slate-400">${(item.receita / 1000).toFixed(0)}k</div>
          <div
            className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg hover:from-cyan-400 hover:to-cyan-300 transition-all duration-300 cursor-pointer"
            style={{ height: `${(item.receita / 36200) * 150}px` }}
          />
          <div className="text-xs text-slate-400">{item.mes}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex overflow-hidden">
      {/* Modal */}
      <Modal />

      {/* SIDEBAR */}
      <aside
        className={`bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 transition-all duration-300 z-40 overflow-y-auto h-screen ${
          sidebarOpen ? 'w-56' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                <BarChart3 size={20} />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-white text-sm truncate">ECGNOW</h1>
                <p className="text-xs text-slate-400">Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 pb-48">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <Settings size={20} />
              <span>Configurações</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors">
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div className={`flex-1 w-full overflow-y-auto overflow-x-hidden transition-all duration-300`}>
        {/* HEADER */}
        <header className="w-full bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-30 pr-4">
          <div className="px-10 py-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
                {menuItems.find(m => m.id === activeMenu)?.label}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Status de Sincronização */}
              {sheetLoading && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-xs text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  Sincronizando...
                </div>
              )}
              {sheetError && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-xs text-red-400">
                  ⚠️ Erro ao carregar
                </div>
              )}
              {sheetData && !sheetLoading && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-lg text-xs text-green-400">
                  ✅ Sincronizado
                </div>
              )}

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2 border border-slate-600">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm placeholder-slate-500"
                />
              </div>

              {/* Time Period Filter */}
              <select
                value={timePeriod}
                onChange={e => setTimePeriod(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-sm hover:border-cyan-500 transition-colors cursor-pointer"
              >
                <option value="7">7 Dias</option>
                <option value="30">30 Dias</option>
                <option value="90">90 Dias</option>
                <option value="365">12 Meses</option>
              </select>

              {/* Notifications & Profile */}
              <button className="relative p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              <button className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                <span className="font-bold">AS</span>
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 px-10 py-10 space-y-8 pb-40 border-t border-b border-slate-700/30 mr-4 overflow-y-auto">
          {/* VISÃO GERAL */}
          {activeMenu === 'visao-geral' && (
            <IndicadoresCompletos kpis={kpisReais} />
          )}

          {activeMenu === 'alunos_old' && (
            <>
              {/* KPI Cards - Versão antiga */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpisReais && [
                  {
                    label: 'Receita Total',
                    value: { valor: formatarMoeda(kpisReais.receitaTotal), variacao: 12.5, trending: 'up' },
                    icon: DollarSign,
                    color: 'from-green-500'
                  },
                  {
                    label: 'Alunos Ativos',
                    value: { valor: kpisReais.totalAtivos, variacao: 8.2, trending: 'up' },
                    icon: Users,
                    color: 'from-blue-500'
                  },
                  {
                    label: 'Taxa Aprovação',
                    value: { valor: `${kpisReais.taxaAprovacao}%`, variacao: 4.1, trending: 'up' },
                    icon: TrendingUp,
                    color: 'from-purple-500'
                  },
                  {
                    label: 'NPS (Satisfação)',
                    value: { valor: `${kpisReais.npsScore}%`, variacao: 5.2, trending: 'up' },
                    icon: Circle,
                    color: 'from-cyan-500'
                  },
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${kpi.color} to-slate-800 border border-slate-700 transition-all duration-300 cursor-pointer transform ${
                        hoveredCard === idx ? 'scale-105 shadow-2xl' : ''
                      }`}
                    >
                      {/* Background Effect */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-slate-300">{kpi.label}</h3>
                          <Icon size={20} className="text-white/60" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-white">
                            {kpi.value.valor}
                            {kpi.label === 'Taxa Conclusão' && '%'}
                          </span>
                          <span
                            className={`flex items-center gap-1 text-sm font-semibold ${
                              kpi.value.trending === 'up' ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {kpi.value.trending === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                            {Math.abs(kpi.value.variacao)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gráfico */}
              <div className="rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Desempenho Financeiro</h3>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 transition-colors text-sm">
                    <Download size={16} />
                    Exportar
                  </button>
                </div>
                <BarChart data={mockData.desempenho} />
              </div>
            </>
          )}

          {/* ALUNOS */}
          {activeMenu === 'alunos' && (
            <AbaAlunos kpis={kpisReais} alunos={alunosData} filters={filters} />
          )}

          {/* FINANCEIRO */}
          {activeMenu === 'financeiro' && (
            <div className="rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h3 className="text-lg font-semibold">Controle Financeiro</h3>
              </div>

              {/* Transações */}
              <div className="divide-y divide-slate-700">
                {mockData.financeiro.map(transacao => (
                  <div key={transacao.id} className="p-6 hover:bg-slate-700/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{transacao.descricao}</h4>
                        <p className="text-sm text-slate-400 mt-1">{transacao.data}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span
                          className={`text-lg font-bold ${
                            transacao.valor > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {transacao.valor > 0 ? '+' : ''}R$ {Math.abs(transacao.valor).toFixed(2)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            transacao.status === 'Pago'
                              ? 'bg-green-500/20 text-green-400'
                              : transacao.status === 'Processando'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {transacao.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESEMPENHO */}
          {activeMenu === 'desempenho' && (
            <AbaDesempenho kpis={kpisReais} />
          )}

          {/* SATISFAÇÃO */}
          {activeMenu === 'satisfacao' && (
            <AbaSatisfacao kpis={kpisReais} />
          )}

          {/* PIPELINE */}
          {activeMenu === 'pipeline' && (
            <AbaPipeline kpis={kpisReais} />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPremium;
