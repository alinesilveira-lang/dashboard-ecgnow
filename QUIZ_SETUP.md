# Setup do Holter Coach Quiz

## 🎓 Visão Geral

O Holter Coach é um sistema automatizado de quizzes integrado ao dashboard ECGNOW que fornece feedback em tempo real usando Claude API.

**Fluxo:**
1. Aluno faz login (nome + email)
2. Escolhe um dos 7 módulos
3. Responde as perguntas (múltipla escolha + abertas)
4. Recebe feedback instantâneo do Holter Coach

## 📋 Pré-requisitos

- [ ] Projeto Vue 3 + Vite rodando
- [ ] Google Apps Script deployment URL configurada
- [ ] Chave API do Claude

## 🔧 Passo 1: Configurar Claude API Key

### 1.1 Obter a Chave API
1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Faça login ou crie uma conta
3. Vá para **API Keys** → **Create Key**
4. Copie a chave (format: `sk-ant-...`)

### 1.2 Adicionar ao Google Apps Script

No **Google Apps Script Editor**:

```
Projeto → Script Properties (engrenagem) → Script Properties
```

Adicione:
```
ANTHROPIC_API_KEY = sk-ant-... (sua chave aqui)
```

## 📊 Passo 2: Estrutura de Dados

### Quizzes
- **Arquivo:** `src/data/quizzes.js`
- **Contém:** 7 módulos, cada um com 3 perguntas
- **Tipos:** Multiple choice + Open answer

Exemplo:
```js
modulo1: {
  title: "Módulo 1: ECG Básico para Holter",
  questions: [
    {
      id: "m1_q1",
      text: "O que você entende por pausas?",
      type: "open"
    },
    {
      id: "m1_q2",
      text: "Qual a FC normal?",
      type: "multiple",
      options: ["<60", "60-100", "100-120", ">120"],
      correctAnswer: 1
    }
  ]
}
```

### Google Sheets
Uma nova sheet **Quiz_Responses** será criada automaticamente com:
```
Data | Nome Aluno | Email | Módulo | Respostas JSON | Status
```

## 🔌 Componentes Vue

### QuizPage.vue
Orquestrador principal que gerencia o fluxo completo

### QuizLogin.vue
- Input: nome + email
- Validação de email
- Emite evento `login`

### ModuleSelector.vue
- Grid dos 7 módulos
- Clique para selecionar
- Emite evento `select`

### QuizForm.vue
- Exibe pergunta por pergunta
- Navigation (Anterior/Próxima/Enviar)
- Validação: todas as perguntas obrigatórias
- Suporta radio buttons (múltipla) e textarea (aberta)

### QuizFeedback.vue
- Exibe feedback do Claude
- Animação de loading enquanto processa
- Botões para novo quiz ou logout

## ⚙️ Backend (Google Apps Script)

### Função `handleProcessQuizFeedback(data)`
- Recebe: `studentName`, `studentEmail`, `moduleKey`, `moduleTitle`, `questions`, `responses`
- Salva respostas em Google Sheets
- Chama Claude API
- Retorna feedback

### Função `callClaudeAPI(studentName, moduleTitle, questions, responses)`
- Formata quiz para prompt
- Envia para Claude 3.5 Sonnet
- Retorna feedback do "Holter Coach"

### Prompt do Holter Coach
```
Você é o Holter Coach, tutor do curso "Viver de Holter".

REGRAS:
1. Linguagem simples, direta, sem jargão
2. Sem derivações ECG - usar: canais, FC, pausas, QRS, regular/irregular
3. Estrutura: explicação concisa + mini-caso + pergunta de quiz
4. Corrigir com empatia
5. Tom: coach parceiro, emoji 1-2x, sem aulas longas

MÓDULOS: M1-M7 (ECG básico até repolarização)
```

## 🚀 Deploy

### Local Testing
```bash
npm run dev
```
Acesse: `http://localhost:5173`
- Dashboard normal funciona
- Clique em "Quiz" na sidebar
- Login com qualquer nome + email
- Escolha um módulo
- Responda as perguntas

### Para Production (GitHub Pages)
```bash
npm run build
git add -A
git commit -m "Add Holter Coach Quiz"
git push origin main
```

GitHub Actions deployer automaticamente em `gh-pages`

## 💰 Custos Claude API

- **Pricing:** ~$0.003 per 1K input tokens
- **Estimativa:** ~100-200 tokens por quiz = $0.0003-0.0006 por uso
- **Free tier:** $5 crédito inicial (bom para ~10K quizzes)

## 📝 Customizações Possíveis

### Adicionar mais perguntas
Edite `src/data/quizzes.js`:
```js
{
  id: "m1_q4",
  text: "Nova pergunta?",
  type: "open"
}
```

### Mudar estilo visual
- Colors: `src/components/QuizPage.vue` (gradiente purple)
- Design System: Classes `ds-*` no Bootstrap 5.3.8

### Integrar com WhatsApp
Adicionar função em GAS para enviar link:
```gs
function enviarLinkWhatsApp(numeroGrupo) {
  // Link do quiz
  const quizUrl = "https://seusite.com/#/quiz";
  // Enviar via Twilio ou API similar
}
```

## ❓ Troubleshooting

### "Erro: Chave API não configurada"
- [ ] Adicionar `ANTHROPIC_API_KEY` em Script Properties
- [ ] Verificar se não tem espaços ou caracteres extras na chave
- [ ] Confirmar que a chave começa com `sk-ant-`

### Feedback não aparece
- [ ] Verificar console do navegador (F12)
- [ ] Verificar logs do Google Apps Script
- [ ] Confirmar Google Forms deployment está ativo

### Quiz não salva em Sheets
- [ ] Verificar se `SHEET_ID` está correto
- [ ] Confirmar permissões da conta Google

## 📞 Próximos Passos

1. [ ] Configurar Claude API key
2. [ ] Deploy Google Apps Script
3. [ ] Testar com alunos piloto
4. [ ] Coletar feedback
5. [ ] Adicionar mais perguntas (conforme necessário)
6. [ ] Integrar com envio automático nos grupos WhatsApp

