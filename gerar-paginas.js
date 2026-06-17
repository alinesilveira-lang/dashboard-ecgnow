#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ler arquivo original
const originalHtml = fs.readFileSync(path.join(__dirname, 'dashboard-cpvh.html'), 'utf-8');

// Extrair seções
const headMatch = originalHtml.match(/<head>[\s\S]*?<\/head>/);
const head = headMatch ? headMatch[0] : '';

const topbarMatch = originalHtml.match(/<div class="topbar">[\s\S]*?<\/div>\s*<\/div>/);
const topbar = topbarMatch ? topbarMatch[0] : '';

const scriptMatch = originalHtml.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch ? scriptMatch[1] : '';

// Definir páginas com seus IDs
const PAGES = [
  { nome: 'resumo', sectionId: 'viewResumo', titulo: 'Resumo', tipo: 'div' },
  { nome: 'visao-geral', sectionId: 'geral', titulo: 'Visão Geral', tipo: 'section' },
  { nome: 'base-alunos', sectionId: 'base', titulo: 'Base de Alunos', tipo: 'section' },
  { nome: 'engajamento', sectionId: 'engaja', titulo: 'Engajamento', tipo: 'section' },
  { nome: 'esteira-talentos', sectionId: 'esteira', titulo: 'Esteira de Talentos', tipo: 'section' },
  { nome: 'financeiro', sectionId: 'financeiro', titulo: 'Financeiro', tipo: 'section' },
  { nome: 'satisfacao', sectionId: 'nps', titulo: 'Satisfação', tipo: 'section' },
  { nome: 'demografia', sectionId: 'demo', titulo: 'Demografia', tipo: 'section' },
  { nome: 'leitura-executiva', sectionId: 'leitura', titulo: 'Leitura Executiva', tipo: 'section' }
];

// Função para extrair seção
function extractSection(html, sectionId, tipo) {
  if (tipo === 'div') {
    // Para viewResumo, pegar até viewDetalhe
    const match = html.match(/<div id="viewResumo"[\s\S]*?(?=<div id="viewDetalhe")/);
    return match ? match[0] : '';
  } else {
    // Para seções, pegar até próxima seção ou final
    const match = html.match(new RegExp(`<section id="${sectionId}"[\\s\\S]*?(?=<section|$)`, 'i'));
    return match ? match[0] : '';
  }
}

// Criar menu
function createMenu(currentPage) {
  return PAGES.map(p =>
    `<a href="${p.nome}.html" class="${p.nome === currentPage ? 'active' : ''}">${p.titulo}</a>`
  ).join('');
}

// Gerar páginas
PAGES.forEach(page => {
  const section = extractSection(originalHtml, page.sectionId, page.tipo);
  const menu = createMenu(page.nome);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${page.titulo} - Dashboard ECGNOW CPVH</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
:root{
  --navy:#0D2137; --navy2:#0a3d6e; --cyan:#0ea5e9; --cyan-soft:#e0f2fe;
  --bg:#f4f8fb; --card:#ffffff; --line:#e2e8f0;
  --txt:#0D2137; --muted:#5b7187;
  --ok:#10b981; --ok-soft:#d1fae5; --warn:#f59e0b; --warn-soft:#fef3c7;
  --bad:#ef4444; --bad-soft:#fee2e2;
  --radius:18px; --shadow:0 4px 18px rgba(13,33,55,.07);
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Nunito',sans-serif;background:var(--bg);color:var(--txt);font-size:15px;line-height:1.5}
h1,h2,h3,.brand,.kpi-value{font-family:'Bricolage Grotesque',sans-serif}

.topbar{position:sticky;top:0;z-index:50;background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 100%);color:#fff;box-shadow:0 2px 14px rgba(13,33,55,.25)}
.topbar-inner{max-width:1280px;margin:0 auto;padding:14px 28px;display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.brand{font-weight:800;font-size:20px;display:flex;align-items:center;gap:10px}
.brand .dot{width:10px;height:10px;border-radius:50%;background:var(--cyan);box-shadow:0 0 12px var(--cyan)}
.brand small{font-family:'Nunito';font-weight:700;font-size:11px;color:#9fd8f8;text-transform:uppercase;letter-spacing:1.5px;display:block}
.period-chip{background:rgba(14,165,233,.18);border:1px solid rgba(14,165,233,.45);color:#bfe9ff;font-size:12px;font-weight:800;padding:5px 14px;border-radius:999px;white-space:nowrap}
.nav{display:flex;gap:4px;margin-left:auto;flex-wrap:wrap}
.nav a{color:#cfe7f7;text-decoration:none;font-weight:700;font-size:12.5px;padding:7px 12px;border-radius:999px;transition:.2s;display:inline-block}
.nav a:hover,.nav a.active{background:rgba(14,165,233,.25);color:#fff}

.wrap{max-width:1280px;margin:0 auto;padding:30px 28px 70px}
section{margin-bottom:48px;scroll-margin-top:90px}
.sec-head{display:flex;align-items:baseline;gap:14px;margin-bottom:6px;flex-wrap:wrap}
.sec-head h2{font-size:24px;font-weight:800;color:var(--navy)}
.sec-head .tag{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;color:var(--cyan);background:var(--cyan-soft);padding:4px 12px;border-radius:999px}
.sec-sub{color:var(--muted);font-size:13.5px;margin-bottom:20px;max-width:880px}

.card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:20px 22px}
.grid{display:grid;gap:16px}
.g-2{grid-template-columns:1fr 1fr}
.g-3{grid-template-columns:repeat(3,1fr)}
.g-4{grid-template-columns:repeat(4,1fr)}
@media(max-width:980px){.g-2,.g-3,.g-4{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.g-2,.g-3,.g-4{grid-template-columns:1fr}.wrap{padding:20px 14px 60px}}

.kpi{position:relative;overflow:hidden}
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--cyan),var(--navy2))}
.kpi-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.1px;color:var(--muted);display:flex;align-items:center;justify-content:space-between;gap:6px}
.kpi-value{font-size:26px;font-weight:800;color:var(--navy);margin:6px 0 2px;white-space:nowrap}
.kpi-sub{color:var(--muted);font-weight:700;font-size:11.5px}
.farol{width:11px;height:11px;border-radius:50%;display:inline-block;flex:none}
.farol.g{background:var(--ok);box-shadow:0 0 0 4px var(--ok-soft)}
.farol.y{background:var(--warn);box-shadow:0 0 0 4px var(--warn-soft)}
.farol.r{background:var(--bad);box-shadow:0 0 0 4px var(--bad-soft)}

.chart-card h3{font-size:15.5px;font-weight:700;color:var(--navy);margin-bottom:2px}
.chart-card .hint{font-size:12px;color:var(--muted);margin-bottom:12px}
svg text{font-family:'Nunito',sans-serif}

.insight{display:flex;gap:14px;padding:16px 18px;border-radius:14px;border:1px solid var(--line);background:#fff;margin-bottom:12px;align-items:flex-start}
.insight .ico{flex:none;width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px}
.insight b{color:var(--navy)}
.insight p{font-size:13.5px;color:#3b536b;margin-top:2px}
.ico.g{background:var(--ok-soft)}.ico.y{background:var(--warn-soft)}.ico.r{background:var(--bad-soft)}.ico.b{background:var(--cyan-soft)}

#viewResumo{max-width:1280px;margin:0 auto;padding:16px 28px 20px;display:grid;grid-template-columns:370px minmax(0,1fr);gap:16px;overflow:auto}
.rs-hero{background:linear-gradient(160deg,var(--navy) 0%,var(--navy2) 70%,#0c5a9e 100%);border-radius:22px;color:#fff;padding:26px 26px 22px;display:flex;flex-direction:column;gap:14px;box-shadow:0 10px 30px rgba(13,33,55,.28);position:relative;overflow:hidden}
.rs-hero::after{content:'';position:absolute;right:-70px;top:-70px;width:230px;height:230px;border-radius:50%;background:radial-gradient(circle,rgba(14,165,233,.35),transparent 70%)}
.rs-chips{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.rs-chip{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px 14px;box-shadow:var(--shadow)}
.rs-chip .l{font-size:10px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:var(--muted);display:flex;justify-content:space-between;align-items:center;gap:6px}
.rs-chip .v{font-family:'Bricolage Grotesque';font-size:clamp(18px,2.6vh,23px);font-weight:800;color:var(--navy);margin-top:3px}
.rs-right{display:grid;grid-template-rows:auto minmax(0,1fr);gap:14px;min-width:0}
.rs-mid{display:grid;grid-template-columns:1.6fr 1fr;gap:14px;min-height:0}
.rs-chart-card,.rs-funil-card{display:flex;flex-direction:column;min-height:0;padding:16px 18px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}
.rs-chart{flex:1;min-height:0;display:flex;align-items:center}
.rs-chart svg{width:100%;max-height:100%}
.rs-funil{flex:1;min-height:0;display:flex;align-items:center}
.rs-funil svg{width:100%;max-height:100%}
@media(max-width:1024px){#viewResumo{grid-template-columns:1fr}.rs-chips{grid-template-columns:repeat(2,1fr)}.rs-mid{grid-template-columns:1fr}}
</style>
</head>
<body>

<div class="topbar">
  <div class="topbar-inner">
    <div class="brand"><span class="dot"></span><div>ECGNow<small>Educação · CPVH · Viver de Holter</small></div></div>
    <span class="period-chip">Base atualizada · Jun/2026</span>
    <nav class="nav">
      ${menu}
    </nav>
  </div>
</div>

<div class="wrap">
${section}
</div>

<script>
${script}

// Carregar dados ao inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadKPIsFromJSON();
  });
} else {
  loadKPIsFromJSON();
}
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, `${page.nome}.html`), html);
  console.log(`✅ ${page.nome}.html criado`);
});

console.log('\n✨ Todas as páginas foram geradas!');
