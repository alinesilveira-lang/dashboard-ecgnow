# Dashboard ECGNOW - Documentação

## Objetivo
Dashboard de indicadores acadêmicos para diretoria e coordenação. Conecta-se a Google Sheets para exibir dados de desempenho, inadimplência, NPS e progresso dos alunos.

## Stack Oficial (padrão_ecgnow)
- **Frontend:** Vue 3 (Composition API) + Vite
- **UI:** Bootstrap 5.3.8 + classes `ds-` (Design System)
- **Estado:** Pinia
- **Dados:** Google Sheets API via Google Apps Script
- **Autenticação:** Senha simples (Google Apps Script)
- **Deploy:** GitHub Pages

## Estrutura do Projeto

```
dashboard-ecgnow/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── DashboardCard.vue
│   │   ├── FilterPanel.vue
│   │   ├── IndicatorTable.vue
│   │   ├── ChartContainer.vue
│   │   └── AuthModal.vue
│   ├── services/             # Lógica de integração
│   │   ├── appsScriptService.js
│   │   └── indicatorService.js
│   ├── stores/               # Estado global (Pinia)
│   │   └── dashboardStore.js
│   ├── styles/               # Design System
│   │   └── design-system.css
│   ├── App.vue               # Componente raiz
│   └── main.js               # Entrada da aplicação
├── apps-script/              # Google Apps Script backend
│   └── Code.gs
├── docs/                      # Documentação
│   ├── DESIGN_SYSTEM.md
│   └── API.md
├── index.html
├── vite.config.js
└── package.json
```

## Indicadores Principais
1. **Taxa de Conclusão Teórica** (% de alunos com 100% teórico)
2. **Taxa de Aprovação** (% de alunos que passaram em prova)
3. **Inadimplência** (% de alunos inadimplentes)
4. **NPS Médio** (Satisfação dos alunos)
5. **Aprovação por Modalidade** (Turma vs Livre vs Mentoria)
6. **Progresso por Aluno** (Tabela com filtros)

## Como Rodar Localmente

```bash
npm install
npm run dev
```

Acessa em `http://localhost:5173`

## Como Fazer Deploy

```bash
npm run build
# Commit e push para main
# GitHub Actions deploy automaticamente em gh-pages
```

## Padrões Obrigatórios

### Design System
- Seguir `DESIGN_SYSTEM.md` do padrão_ecgnow
- Usar apenas Bootstrap 5.3.8 (proibido Tailwind)
- Classes obrigatórias com prefixo `ds-`
- Sem inline styles

### Componentes
- Reutilizáveis
- Props bem documentadas
- Estados previstos (loading, error, empty)

### Serviços
- Separar lógica de negócio de apresentação
- Funções puras e testáveis
- Validação de entrada

## Variáveis de Ambiente

Criar `.env.local`:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercontent
VITE_APPS_SCRIPT_PASSWORD=sua_senha_aqui
```

## Próximos Passos
1. [ ] Completar Google Apps Script backend
2. [ ] Implementar autenticação
3. [ ] Criar componentes principais
4. [ ] Integrar dados reais
5. [ ] Deploy em GitHub Pages
