# Guia de Setup - Dashboard ECGNOW

## Pré-requisitos
- Node.js 16+ instalado
- Uma conta Google
- As planilhas Google Sheets com os dados

## Passo 1: Configurar Google Apps Script

### 1.1 Criar projeto Apps Script
1. Acesse [script.google.com](https://script.google.com)
2. Clique em "Novo projeto"
3. Nomeie como "Dashboard ECGNOW Backend"

### 1.2 Copiar código
1. Abra o arquivo `apps-script/Code.gs`
2. Copie todo o conteúdo
3. Cole no editor do Google Apps Script
4. Altere a linha `const SHEET_ID = '...'` com o ID da sua planilha
5. Altere `const SENHA_DASHBOARD = '...'` para uma senha segura

### 1.3 Testar localmente
1. No editor Apps Script, selecione `testAuthenticate()` no menu
2. Clique em "Executar"
3. Authorize a aplicação (se solicitado)
4. Verifique se funcionou no "Logs"

### 1.4 Deploy como Web App
1. No topo, clique em "Implantar" → "Novo implante"
2. Selecione "Aplicação Web"
3. **Execute como:** Sua conta Google
4. **Quem tem acesso:** Qualquer pessoa
5. Clique em "Implantar"
6. Copie a URL do deployment

**Exemplo de URL:**
```
https://script.google.com/macros/d/AKfycbz3X1Y2Z3A4B5C6D7E8F9G0H1I2/usercontent
```

---

## Passo 2: Configurar Dashboard Frontend

### 2.1 Clonar e instalar
```bash
cd dashboard-ecgnow
npm install
```

### 2.2 Criar arquivo .env.local
Na raiz do projeto, crie `.env.local`:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent
VITE_APPS_SCRIPT_PASSWORD=sua_senha_aqui
```

Substitua:
- `YOUR_DEPLOYMENT_ID` pela URL que você copiou no passo 1.4
- `sua_senha_aqui` pela senha que você definiu no passo 1.2

### 2.3 Rodar localmente
```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

Digite a senha e você verá o dashboard!

---

## Passo 3: Deploy em GitHub Pages

### 3.1 Criar repositório
1. Acesse [github.com/new](https://github.com/new)
2. Nome: `dashboard-ecgnow`
3. **Importante:** Deixe público para funcionar com GitHub Pages
4. Crie o repositório

### 3.2 Fazer push
```bash
git add .
git commit -m "Initial commit: Dashboard ECGNOW"
git remote add origin https://github.com/seu-usuario/dashboard-ecgnow.git
git branch -M main
git push -u origin main
```

### 3.3 Ativar GitHub Pages
1. Acesse "Settings" do repositório
2. Vá para "Pages"
3. Em "Build and deployment", selecione:
   - **Source:** GitHub Actions
4. O deploy automático acontecerá!

### 3.4 Acessar dashboard
Após o deploy, acesse:
```
https://seu-usuario.github.io/dashboard-ecgnow/
```

---

## Troubleshooting

### "Erro ao conectar com servidor"
- Verifique se a URL do Apps Script está correta em `.env.local`
- Verifique se fez o deploy do Apps Script como Web App
- Teste a URL no navegador (deve retornar um erro, isso é normal)

### "Senha incorreta"
- Verifique se a senha em `.env.local` é igual à do Code.gs
- Lembre-se que é case-sensitive

### "Nenhum aluno encontrado"
- Verifique se as planilhas se chamam "Cadastro" e "Performance"
- Verifique se tem dados nas planilhas
- Teste `testGetData()` no Apps Script para ver os dados

### Dashboard em branco
- Abra o console do navegador (F12)
- Verifique se tem erros de CORS
- Se for erro de CORS, o Apps Script pode não estar configurado corretamente

---

## Próximos Passos

- [ ] Adicionar gráficos (Chart.js)
- [ ] Adicionar exportação de relatórios (PDF)
- [ ] Adicionar histórico de dados
- [ ] Integrar com Google Calendar
- [ ] Implementar mais indicadores

---

## Suporte

Se tiver dúvidas, verifique:
- Arquivo `CLAUDE.md` para arquitetura
- Logs no navegador (F12)
- Logs no Apps Script
