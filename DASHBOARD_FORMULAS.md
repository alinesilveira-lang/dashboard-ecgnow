# Aba Dashboard - Fórmulas Automáticas

## Instruções

1. Cria uma **nova aba** no Google Sheets chamada `Dashboard`
2. Copia as fórmulas abaixo **exatamente como estão**
3. Coloca na estrutura mostrada

---

## Estrutura da Aba

Coloca assim (A1, B1, A2, B2, etc):

```
A1: Métrica                          | B1: Valor
A2: Total Alunos                     | B2: =COUNTA(Performance!A:A)-1
A3: Total Cadastrados                | B3: =COUNTA(Cadastro!A:A)-1
A4: Engajamento Alto+Médio (qtd)     | B4: =COUNTIFS('Performance (Dados dinâmicos)'!N:N,"Alto")+COUNTIFS('Performance (Dados dinâmicos)'!N:N,"Médio")
A5: Engajamento Alto+Médio (%)       | B5: =IFERROR((B4/B2)*100,0)
A6: Ativos 30 dias (qtd)             | B6: =COUNTIF('Performance (Dados dinâmicos)'!O:O,"Sim")
A7: Ativos 30 dias (%)               | B7: =IFERROR((B6/B2)*100,0)
A8: Teórico médio (%)                | B8: =IFERROR(AVERAGE(IF('Performance (Dados dinâmicos)'!L:L>0,'Performance (Dados dinâmicos)'!L:L)),0)
A9: Ativo (estudando) (qtd)          | B9: =COUNTIF('Performance (Dados dinâmicos)'!S:S,"Ativo (estudando)")
A10: Concluídos (qtd)                | B10: =COUNTIFS('Performance (Dados dinâmicos)'!S:S,"Aprovado")+COUNTIFS('Performance (Dados dinâmicos)'!S:S,"Reprovado")
A11: Taxa de conclusão (%)           | B11: =IFERROR((B10/B2)*100,0)
```

---

## Passo a Passo

### 1. Criar aba
- Clica no **+** para nova aba
- Renomeia para **`Dashboard`**

### 2. Copiar fórmulas
- Coloca em **A1**: `Métrica`
- Coloca em **B1**: `Valor`

**Depois, para cada linha, coloca:**

**Linha 2:**
- A2: `Total Alunos`
- B2: `=COUNTA(Performance!A:A)-1`

**Linha 3:**
- A3: `Total Cadastrados`
- B3: `=COUNTA(Cadastro!A:A)-1`

**Linha 4:**
- A4: `Engajamento Alto+Médio (qtd)`
- B4: `=COUNTIFS('Performance (Dados dinâmicos)'!N:N,"Alto")+COUNTIFS('Performance (Dados dinâmicos)'!N:N,"Médio")`

**Linha 5:**
- A5: `Engajamento Alto+Médio (%)`
- B5: `=IFERROR((B4/B2)*100,0)`

**Linha 6:**
- A6: `Ativos 30 dias (qtd)`
- B6: `=COUNTIF('Performance (Dados dinâmicos)'!O:O,"Sim")`

**Linha 7:**
- A7: `Ativos 30 dias (%)`
- B7: `=IFERROR((B6/B2)*100,0)`

**Linha 8:**
- A8: `Teórico médio (%)`
- B8: `=IFERROR(AVERAGE(IF('Performance (Dados dinâmicos)'!L:L>0,'Performance (Dados dinâmicos)'!L:L)),0)`
  - **Depois de colar, pressiona Ctrl+Shift+Enter** (array formula)

**Linha 9:**
- A9: `Ativo (estudando) (qtd)`
- B9: `=COUNTIF('Performance (Dados dinâmicos)'!S:S,"Ativo (estudando)")`

**Linha 10:**
- A10: `Concluídos (qtd)`
- B10: `=COUNTIFS('Performance (Dados dinâmicos)'!S:S,"Aprovado")+COUNTIFS('Performance (Dados dinâmicos)'!S:S,"Reprovado")`

**Linha 11:**
- A11: `Taxa de conclusão (%)`
- B11: `=IFERROR((B10/B2)*100,0)`

---

## Como Usar no Dashboard

O dashboard vai ler dessa aba e buscar os valores de **B2, B4, B5, B6, B7, B8, B9, B10, B11**.

**Quando Performance (Dados dinâmicos) muda:**
✅ As fórmulas recalculam automaticamente
✅ Dashboard lê os valores atualizados

---

## Notas

- **Não deleta a aba "Cadastro" nem "Performance"** — as fórmulas precisam delas
- Se alguma fórmula der erro, verifica se o nome das abas está **exatamente igual**
- A fórmula de "Teórico médio" é um array — pressiona **Ctrl+Shift+Enter** depois de colar
