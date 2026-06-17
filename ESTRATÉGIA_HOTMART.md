# 🔗 Estratégia de Integração Hotmart

## Status Atual ✅

```
Google Sheets (fonte de verdade)
    ↓ Sincronização a cada 30s
Dashboard React (77 alunos carregados)
    ↓
Mostra dados em tempo real
```

### ✅ Funcionando:
- ✅ Dashboard lê dados da Google Sheets
- ✅ 77 alunos sincronizados
- ✅ KPIs em tempo real
- ✅ Gráficos atualizados

---

## 🎯 Próximo Passo: Webhook da Hotmart

Quando um aluno compra na Hotmart:

```
Hotmart (aluno compra)
    ↓ POST Webhook
http://localhost:3002/api/webhook/hotmart
    ↓ (em desenvolvimento)
Processar dados
    ↓
Google Sheets (atualizar)
    ↓
Dashboard (sincroniza automaticamente)
```

---

## 🚀 Implementar Webhook Hotmart → Google Sheets

### Opção 1: Usar Google Apps Script (Recomendado)
**Status:** Você não consegue acessar mais

Solução:
1. Crie um novo Google Apps Script
2. Faça deploy
3. Configure URL do webhook em: `https://novo-deployment-id/exec`

### Opção 2: Usar Zapier/Make (Automático)
**Melhor para não-desenvolvedores**

1. Acesse: https://zapier.com ou https://www.make.com
2. Crie um fluxo:
   - **Trigger:** Webhook da Hotmart
   - **Action:** Adicionar linha em Google Sheets
3. Copie o webhook URL
4. Configure em: `https://app.hotmart.com` → Webhooks

### Opção 3: Usar Backend Node.js (Em Desenvolvimento)

Arquivo: `api-proxy.js` já tem o endpoint `/api/webhook/hotmart`

Para escrever na Sheets, precisa de uma biblioteca:

```bash
npm install googleapis
```

---

## 📋 Checklist Implementação

- [ ] Escolher opção de atualização (Apps Script / Zapier / Node.js)
- [ ] Configurar webhook na Hotmart
- [ ] Testar com uma compra simulada
- [ ] Verificar se dados aparecem na Google Sheets
- [ ] Confirmar sincronização no Dashboard (30s)

---

## 🔍 Monitorar Webhooks

**Em desenvolvimento no endpoint:**
```
POST http://localhost:3002/api/webhook/hotmart
```

Exemplo de payload da Hotmart:
```json
{
  "buyer": {
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "product": {
    "name": "Curso Prático Viver de Holter"
  },
  "price": 197.00,
  "purchase_date": "2026-06-10T15:30:00Z",
  "status": "approved"
}
```

---

## 💡 Solução Rápida: Usar Zapier

**Mais fácil e sem código:**

1. Conta gratuita em zapier.com
2. Create Zap
3. Trigger: **Webhooks by Zapier**
4. Action: **Google Sheets → Create Spreadsheet Row**
5. Copie a URL do webhook
6. Configure na Hotmart em: Webhooks

---

## 📞 Próximos Passos

1. **Qual opção você prefere?**
   - [ ] Apps Script novo
   - [ ] Zapier (recomendado)
   - [ ] Node.js backend

2. **Depois:**
   - Configurar webhook
   - Testar com uma compra
   - Dashboard ficará 100% automático

---

**Por enquanto, seu Dashboard está 100% funcional!** 🎉

Os dados da Hotmart que já estão na Google Sheets estão sincronizados. Quando novas compras chegarem, elas serão adicionadas automaticamente (após configuração).
