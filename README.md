# 📊 Dashboard ECGNOW

Dashboard interativo de indicadores acadêmicos para diretoria e coordenação. Exibe desempenho dos alunos, inadimplência, NPS e progresso em tempo real.

## 🚀 Recursos

- ✅ Autenticação por senha
- 📈 Indicadores em tempo real
- 🔍 Filtros dinâmicos (turma, status, modalidade)
- 📊 Progresso visual dos alunos
- ⚠️ Alertas para alunos em risco
- 🎨 Design System ECGNOW
- 📱 Responsivo para desktop e tablet
- 🚀 Deploy automático em GitHub Pages

## 📦 Stack

- **Frontend:** Vue 3 (Composition API) + Vite
- **UI:** Bootstrap 5.3.8 + Design System
- **Backend:** Google Apps Script
- **Dados:** Google Sheets
- **Deploy:** GitHub Pages + GitHub Actions

## 🏃 Quick Start

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Primeiro acesso
1. Configure o Google Apps Script (veja [docs/SETUP.md](docs/SETUP.md))
2. Configure `.env.local` com a URL e senha
3. Acesse http://localhost:5173
4. Digite a senha

## 📚 Documentação

- [docs/SETUP.md](docs/SETUP.md) - Guia completo de configuração
- [CLAUDE.md](CLAUDE.md) - Arquitetura do projeto

## 📊 Indicadores

**Visão Executiva:**
- Total de alunos
- Taxa de conclusão teórica %
- Taxa de aprovação em prova %
- Inadimplência %
- NPS médio
- Alunos ativos vs inativos

**Detalhes:**
- Progresso individual por aluno
- Aprovação por modalidade
- Alunos em risco (sem atividade 30+ dias)
- Filtros por turma, status, modalidade

## 🔧 Configuração

1. **Google Apps Script:**
   - ID da planilha Google Sheets
   - Senha de acesso
   - Deploy como Web App

2. **Variáveis de Ambiente** (`.env.local`):
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/...
   VITE_APPS_SCRIPT_PASSWORD=sua_senha
   ```

3. **GitHub Pages:**
   - Repository deve ser público
   - GitHub Actions ativa automaticamente

## 🎯 Próximos Passos

- [ ] Gráficos avançados (Chart.js)
- [ ] Exportação de relatórios
- [ ] Histórico de desempenho
- [ ] Integração Google Calendar
- [ ] Mais indicadores customizáveis

## 📝 Licença

Propriedade ECGNOW

## 👥 Contribuindo

Seguir o padrão_ecgnow:
- Vue 3 + Bootstrap 5.3.8
- Classes `ds-` obrigatórias
- Sem Tailwind ou inline styles
- Componentes reutilizáveis

---

**Desenvolvido com ❤️ para ECGNOW**
