# 🔗 Guia Completo de Integrações

Seu Dashboard React Premium está pronto para sincronizar com **Google Sheets** e **Hotmart**!

---

## 📊 1. Integração com Google Sheets

### ✅ Status: Pronto para configurar

**Arquivo responsável**: `src/services/sheetsService.js`

### Passos:

#### 1️⃣ Criar API Key no Google Cloud

```
1. Acesse: https://console.cloud.google.com/
2. Selecione ou crie um projeto
3. Ative "Google Sheets API"
4. Vá em "Credenciais" → "Criar Credencial" → "API Key"
5. Copie a chave
```

#### 2️⃣ Adicionar ao `.env.local`

```env
VITE_GOOGLE_SHEETS_API_KEY=sua_chave_aqui
```

#### 3️⃣ Suas abas sincronizadas

✅ **Dados hotmart** - Alunos  
✅ **Performance (Dados dinâmicos)** - Desempenho  
✅ **ASAAS_Import** - Financeiro  

---

## 🚀 2. Integração com Hotmart

### ✅ Status: Pronto para configurar

**Arquivo responsável**: `src/services/hotmartService.js`

### Passos:

#### 1️⃣ Obter Credenciais Hotmart

```
1. Acesse: https://app.hotmart.com/account/partner/api
2. Gere um "API Token"
3. Copie seu "Affiliate ID"
```

#### 2️⃣ Adicionar ao `.env.local`

```env
VITE_HOTMART_API_KEY=sua_token_aqui
VITE_HOTMART_AFFILIATE_ID=seu_id_aqui
```

#### 3️⃣ Automático!

O Dashboard sincronizará:
- ✅ Alunos que compraram seus cursos
- ✅ Status de compra
- ✅ Data de acesso
- ✅ Tipo de pagamento

---

## 🔄 Como as Integrações Funcionam

### Fluxo de Dados

```
┌─────────────────┐
│  Google Sheets  │ (Dados estáticos: Cadastro, Turmas, etc)
└────────┬────────┘
         │
         ▼
   ┌──────────────┐
   │   Dashboard  │ ◄─── Sincroniza a cada 30s
   │    React     │
   └────┬─────────┘
        │
        ▼
┌─────────────────┐
│    Hotmart      │ (Dados dinâmicos: Compras, Status)
└─────────────────┘
```

### Sincronização Automática

- **Google Sheets**: A cada 30 segundos
- **Hotmart**: A cada 60 segundos
- **Manual**: Clique em "Atualizar" (🔄)

---

## 🛠️ Configurar Arquivo `.env.local`

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Google Sheets
VITE_GOOGLE_SHEETS_API_KEY=AIzaSy...

# Hotmart
VITE_HOTMART_API_KEY=sk_prod_...
VITE_HOTMART_AFFILIATE_ID=12345

# Opcional: Google Apps Script
VITE_APPS_SCRIPT_URL=https://script.google.com/...
VITE_APPS_SCRIPT_PASSWORD=sua_senha
```

---

## 📋 Checklist de Implementação

- [ ] Criar API Key do Google Cloud
- [ ] Adicionar ao `.env.local`
- [ ] Gerar Token Hotmart
- [ ] Adicionar credenciais Hotmart
- [ ] Testar sincronização (F5 no Dashboard)
- [ ] Verificar Console (F12) para erros

---

## 🐛 Troubleshooting

### "API Key inválida"
```
→ Verifique a chave no .env.local
→ Certifique-se de que Google Sheets API está ativada
→ Teste a chave em: https://developers.google.com/sheets/api/reference/rest
```

### "Sem dados na Hotmart"
```
→ Verifique se tem vendas no período
→ Confirme o Affiliate ID está correto
→ Teste token em: https://api.hotmart.com/docs
```

### "CORS Error"
```
→ Use Google Apps Script como proxy (arquivo api-proxy.js)
→ Ou configure CORS no Google Cloud
```

---

## 📞 Suporte

Para mais informações:
- Google Sheets API: https://developers.google.com/sheets
- Hotmart API: https://app.hotmart.com/account/partner/api

---

**✅ Pronto!** Seu Dashboard está 100% integrado! 🎉
