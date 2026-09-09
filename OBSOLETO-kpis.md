# kpis.json e os workflows de sincronização — aposentados

As páginas do dashboard **não usam mais `kpis.json`**. Elas leem a planilha ao
vivo (ver `dados.js`).

## Por que saíram

- `kpis.json` estava num formato que as páginas não sabiam ler: as páginas
  esperam uma lista de linhas (`SEÇÃO / CATEGORIA / MÉTRICA / VALOR`) e o
  arquivo era um objeto (`data.total_alunos`). O gráfico morria com
  `arr.reduce is not a function`. Nenhum commit do arquivo teve o formato certo.
- `sync-kpis.yml` chamava um Apps Script que hoje responde **302 → tela de login
  do Google**. Gravaria HTML de login dentro do `kpis.json`.
- `update-kpis.yml` rodava `update-kpis.js`, que gerava justamente o formato
  objeto (o incompatível) e exigia `GOOGLE_API_KEY`.
- Os dois disparavam em `push: branches: [main]`; o repositório é `master`.
  Nunca rodaram: não há um único commit automático no histórico.

## Como é agora

`dados.js` lê a planilha `1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA` por
`gviz` — **sem chave de API e sem Apps Script**, porque a planilha é legível
publicamente:

- **aba `Dashboard`** → todos os indicadores (já no formato de lista);
- **aba `ASAAS`** → inadimplência e formas de pagamento. É a fonte autoritativa,
  exportada do sistema. A seção `FINANCEIRO` da aba Dashboard encolheu para uma
  linha (boleto antigo, desatualizada) e não serve mais.

Continua sendo necessário exportar do ASAAS e colar na aba `ASAAS` — esse passo é
manual. O que deixou de existir foi gerar `kpis.json`, commitar e esperar deploy:
o que é colado na planilha aparece no dashboard na hora.

`update-kpis.js` e `kpis.json` foram mantidos no repositório apenas como
referência histórica; nada os lê.
