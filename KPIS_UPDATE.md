# Atualizar KPIs - Dashboard CPVH

## Configuração (só uma vez)

### 1. Obter chave de API do Google Sheets

1. Vai em [Google Cloud Console](https://console.cloud.google.com/)
2. Cria um novo projeto (ou seleciona um existente)
3. **Habilita a API:**
   - Vai em "APIs & Services" → "Library"
   - Procura por "Google Sheets API"
   - Clica em "Enable"
4. **Cria uma chave de API:**
   - Vai em "APIs & Services" → "Credentials"
   - Clica em "+ Create Credentials" → "API Key"
   - Copia a chave gerada

### 2. Configurar variável de ambiente

**No Windows (PowerShell):**
```powershell
$env:GOOGLE_API_KEY = "sua_chave_aqui"
```

**Ou no arquivo `.env`:**
```env
GOOGLE_API_KEY=sua_chave_aqui
```

---

## Usar o script (toda semana)

### Opção 1: Via npm (recomendado)
```bash
npm run update-kpis
```

### Opção 2: Direto com Node
```bash
node update-kpis.js
```

---

## O que o script faz

1. ✅ Lê a planilha "Performance (Dados dinâmicos)"
2. ✅ Calcula:
   - Engajamento Alto + Médio
   - Ativos em 30 dias
   - Média do % conclusão teórico
3. ✅ Atualiza `kpis.json`
4. ✅ Mostra os números atualizados no console

---

## Depois de rodar o script

O script **não faz commit automaticamente**. Você precisa:

```bash
git add kpis.json
git commit -m "Atualizar KPIs - $(Get-Date -Format 'yyyy-MM-dd')"
git push
```

**Ou no VSCode:**
1. Abre a aba "Source Control" (Ctrl+Shift+G)
2. Clica no + ao lado do `kpis.json`
3. Digita mensagem: `Atualizar KPIs - 12/06/2026`
4. Clica "Commit"
5. Clica ↑ (push)

---

## Troubleshooting

### Erro: "GOOGLE_API_KEY não configurada"
Verifique se você colocou a chave de API corretamente nas variáveis de ambiente.

### Erro: "Colunas esperadas não encontradas"
Verifique se a planilha tem as colunas corretas:
- Coluna L: % conclusão do teórico
- Coluna N: Engajamento
- Coluna O: Ativos em 30 dias

---

## Automação futura (opcional)

Para rodar automaticamente toda semana:
- Use um GitHub Action
- Ou use Windows Task Scheduler
- Ou use um cron job (Linux/Mac)

Por enquanto, roda manualmente! 📊
