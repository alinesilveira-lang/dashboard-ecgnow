/* Fonte de dados do dashboard — lê a planilha AO VIVO.
 *
 * Antes: cada página lia ./kpis.json, um arquivo commitado à mão. Ele estava em
 * formato incompatível (objeto, quando as páginas esperam lista de linhas), então
 * os gráficos quebravam com "arr.reduce is not a function", e as duas automações
 * (sync-kpis / update-kpis) nunca rodaram — uma delas aponta para um Apps Script
 * que hoje responde tela de login.
 *
 * Agora: a planilha é legível publicamente via gviz, sem chave nem Apps Script.
 * Não há mais exportação manual no caminho.
 */
const PLANILHA = '1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA';

const urlAba = aba =>
  `https://docs.google.com/spreadsheets/d/${PLANILHA}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(aba)}&t=${Date.now()}`;

/* Parser de CSV que respeita aspas: o gviz sempre cita os campos, e valores como
 * "R$ 1.253,10" e "Cartão + Não definido" trariam vírgula pra dentro do campo. */
function parseCSV(txt){
  const linhas=[]; let campo='', linha=[], dentro=false;
  for(let i=0;i<txt.length;i++){
    const c=txt[i];
    if(dentro){
      if(c==='"'){ if(txt[i+1]==='"'){campo+='"';i++;} else dentro=false; }
      else campo+=c;
    }else if(c==='"') dentro=true;
    else if(c===','){ linha.push(campo); campo=''; }
    else if(c==='\n'){ linha.push(campo); linhas.push(linha); linha=[]; campo=''; }
    else if(c!=='\r') campo+=c;
  }
  if(campo!==''||linha.length){ linha.push(campo); linhas.push(linha); }
  return linhas;
}

function paraObjetos(linhas){
  if(!linhas.length) return [];
  const h=linhas[0].map(x=>x.trim());
  return linhas.slice(1)
    .filter(l=>l.some(c=>c.trim()!==''))
    .map(l=>{const o={};h.forEach((k,i)=>o[k]=(l[i]||'').trim());return o;});
}

async function lerAba(aba){
  const r=await fetch(urlAba(aba));
  if(!r.ok) throw new Error(`planilha respondeu ${r.status}`);
  return paraObjetos(parseCSV(await r.text()));
}

/* "R$ 1.253,10" -> 1253.10  (pt-BR: ponto é milhar, vírgula é decimal) */
function valorBR(s){
  let t=String(s==null?'':s).replace(/[^\d,.-]/g,'');
  if(t.indexOf(',')>-1) t=t.replace(/\./g,'').replace(',','.');
  const n=parseFloat(t);
  return isNaN(n)?0:n;
}
const moedaBR = v => v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

/* Aba Dashboard: agrupa em SEÇÃO > CATEGORIA > MÉTRICA (o formato que as páginas
 * já esperavam do kpis.json). */
async function lerIndicadores(){
  const base={};
  for(const r of await lerAba('Dashboard')){
    const s=r['SEÇÃO'], c=r['CATEGORIA'], m=r['MÉTRICA'];
    if(!s) continue;
    base[s]=base[s]||{}; base[s][c]=base[s][c]||{}; base[s][c][m]=r['VALOR'];
  }
  return base;
}

/* Aba ASAAS: veio do sistema e é a fonte autoritativa da inadimplência — a
 * seção FINANCEIRO da aba Dashboard encolheu para uma linha só (boleto antigo,
 * desatualizado) e não serve mais.
 * A última linha é um TOTAL da própria planilha: não é devedor, então fica fora
 * da soma (somá-la dobrava o valor) e serve de conferência. */
async function lerInadimplencia(){
  const linhas=await lerAba('ASAAS');
  const devedores=linhas.filter(r=>(r['Nome']||'').trim().toUpperCase()!=='TOTAL');
  const total=linhas.find(r=>(r['Nome']||'').trim().toUpperCase()==='TOTAL');

  const soma=devedores.reduce((a,r)=>a+valorBR(r['Valor devido']),0);
  const formas={}, faixas={};
  for(const r of devedores){
    // "Cartão + Não definido" conta como Cartão: a segunda forma é cobrança sem
    // método definido no ASAAS, não um segundo devedor.
    const f=(r['Forma']||'').split('+')[0].trim()||'Não definido';
    formas[f]=(formas[f]||0)+1;
    const fx=(r['Faixa']||'').trim();
    if(fx){ faixas[fx]=faixas[fx]||{alunos:0,valor:0}; faixas[fx].alunos++; faixas[fx].valor+=valorBR(r['Valor devido']); }
  }
  return {
    devedores, soma, formas, faixas,
    parcelasVencidas: devedores.reduce((a,r)=>a+(parseInt(r['Parcelas vencidas'],10)||0),0),
    totalPlanilha: total?valorBR(total['Valor devido']):null
  };
}

/* Avisa na tela quando a planilha não responde, em vez de deixar o card vazio
 * sem explicação. */
function avisarErro(ids,e){
  (Array.isArray(ids)?ids:[ids]).forEach(id=>{
    const c=document.getElementById(id);
    if(c) c.innerHTML='<div style="padding:18px;color:#64748b;font-size:12.5px;line-height:1.5">'+
      'Não foi possível ler a planilha agora.<br><span style="color:#94a3b8">'+
      (e&&e.message?e.message:'')+'</span></div>';
  });
  console.error('[dashboard] falha ao ler a planilha:',e);
}
