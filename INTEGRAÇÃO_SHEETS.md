# 📊 Integração com Google Sheets

## Status: ✅ CONFIGURADO

Seu Dashboard React agora está conectado à planilha Google Sheets:
- **ID da Planilha**: `1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA`
- **API Endpoint**: Google Sheets API v4

---

## 🔐 Próximo Passo: Ativar API Key

Para que a sincronização funcione perfeitamente:

### 1️⃣ Criar API Key no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto (ou selecione existente)
3. Ative a "Google Sheets API"
4. Gere uma "API Key" (sem restrição por enquanto)

### 2️⃣ Adicionar a API Key

Atualize o arquivo `src/services/sheetsService.js`:

```javascript
const API_KEY = 'SUA_API_KEY_AQUI';
```

### 3️⃣ Compartilhar a Planilha (opcional)

Se a planilha é privada, compartilhe com a service account:
- Copie o email da service account
- Adicione como editor na planilha

---

## 📝 Abas Sincronizadas

✅ **Dados hotmart** - Informações dos alunos
✅ **Performance (Dados dinâmicos)** - Desempenho
✅ **ASAAS_Import** - Dados financeiros

---

## 🔄 Sincronização Automática

O Dashboard sincroniza **a cada 30 segundos** com a planilha.

Para sincronizar manualmente:
- Clique no botão 🔄 **Atualizar** (se implementado)

---

## 💡 Status Atual

- ✅ Serviço criado: `src/services/sheetsService.js`
- ✅ Hook criado: `src/hooks/useSheetData.js`
- ⏳ Aguardando: API Key para funcionar

**Assim que colocar a API Key, os dados reais vão aparecer automaticamente!** 🚀
