#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

const APPS_SCRIPT_URL = 'https://script.google.com/a/macros/ecgnow.com.br/s/AKfycbwtauH3j_ccA-LYmjxAEASCXYRS13ntOZrWSHv3GlUQpzks_XC6W9DHweSv2jKAdlZH/exec';

const original = fs.readFileSync('./dashboard-cpvh.html', 'utf-8');

// Extrair head e topbar
const headMatch = original.match(/<head>[\s\S]*?<\/head>/);
const head = headMatch ? headMatch[0] : '';

// Extrair topbar completo com nav
const topbarStart = original.indexOf('<div class="topbar">');
const topbarEnd = original.indexOf('<!-- ===================== CAPA', topbarStart);
let topbar = original.substring(topbarStart, topbarEnd).trim();

// Remover onclick do topbar
topbar = topbar.replace(/ onclick="showResumo\(\)"/g, '');

// Garantir que fecha corretamente
if (!topbar.includes('</div>\n  </div>\n</div>')) {
  topbar += '\n  </div>\n</div>';
}

// Extrair apenas as funções essenciais do script
const essentialFunctions = [
  'const KPIS_URL',
  'const sum=',
  'const fmtN=',
  'const NS=',
  'function svgEl',
  'function el(',
  'function barChart',
  'function donut(',
  'function hBars(',
  'function funil(',
  'function loadKPIsFromJSON',
  'function loadKPIsWithXHR',
  'function updateDashboardKPIs'
];

let script = '';
let inFunction = false;
let braceCount = 0;
const lines = original.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Verificar se começa uma função essencial
  let isEssential = essentialFunctions.some(fn => line.includes(fn));

  if (isEssential) {
    inFunction = true;
    braceCount = 0;
    // Se é uma declaração de variável (const/function), pode estar na mesma linha
    if (line.trim().startsWith('const ') && line.includes(';')) {
      script += line + '\n';
      inFunction = false; // Já completa
      continue;
    }
  }

  if (inFunction) {
    script += line + '\n';

    // Contar chaves para saber quando a função termina
    for (let char of line) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }

    // Se voltou a 0, função terminou
    if (braceCount === 0 && line.includes('}')) {
      inFunction = false;
    }
  }
}

// Remover declarações duplicadas - AGRESSIVO
let scriptLines = script.split('\n');
let dedupedLines = [];
let seenDeclarations = {};

for (let line of scriptLines) {
  const trimmed = line.trim();

  // Extrair nome da declaração
  let declName = null;
  if (trimmed.startsWith('const ')) {
    const match = trimmed.match(/^const\s+(\w+)/);
    if (match) declName = match[1];
  } else if (trimmed.startsWith('function ')) {
    const match = trimmed.match(/^function\s+(\w+)/);
    if (match) declName = match[1];
  }

  // Se é uma declaração de função/var essencial e já vimos, pular
  if (declName && ['sum', 'fmtN', 'NS', 'svgEl', 'el', 'barChart', 'donut', 'hBars', 'funil', 'loadKPIsFromJSON', 'loadKPIsWithXHR', 'updateDashboardKPIs', 'KPIS_URL'].includes(declName)) {
    if (seenDeclarations[declName]) continue;
    seenDeclarations[declName] = true;
  }

  dedupedLines.push(line);
}
script = dedupedLines.join('\n');

// Adicionar proteção para elementos que podem não existir
script += `

// Proteger updates para elementos que podem não existir
const safeUpdate = (id, content) => {
  const elem = document.getElementById(id);
  if (elem) elem.innerHTML = content;
};

const originalUpdate = updateDashboardKPIs;
updateDashboardKPIs = function(kpis) {
  try {
    originalUpdate.call(this, kpis);
  } catch (e) {
    console.log('Alguns elementos não existem nesta página - ignorando:', e.message);
  }
};
`;

const pages = [
  { nome: 'visao-geral', id: 'geral', titulo: 'Visão Geral' },
  { nome: 'base-alunos', id: 'base', titulo: 'Base de Alunos' },
  { nome: 'engajamento', id: 'engaja', titulo: 'Engajamento' },
  { nome: 'esteira-talentos', id: 'esteira', titulo: 'Esteira de Talentos' },
  { nome: 'financeiro', id: 'financeiro', titulo: 'Financeiro' },
  { nome: 'satisfacao', id: 'nps', titulo: 'Satisfação' },
  { nome: 'demografia', id: 'demo', titulo: 'Demografia' },
  { nome: 'leitura-executiva', id: 'leitura', titulo: 'Leitura Executiva' }
];

function extractSection(html, sectionId) {
  const regex = new RegExp(`<section id="${sectionId}"[\\s\\S]*?(?=<section|<!--.*EXPANDIDO|$)`, 'i');
  const match = html.match(regex);
  return match ? match[0] + '</section>' : '';
}

pages.forEach((page, pageIdx) => {
  const section = extractSection(original, page.id);

  // Para cada página, remover suas duplicatas de declarações essenciais
  let pageScript = script;
  if (pageIdx > 0) { // Não mexer na primeira página
    const lines = pageScript.split('\n');
    const seenEssential = {};
    pageScript = lines.filter(line => {
      const trimmed = line.trim();
      for (let decl of ['const sum=', 'const fmtN=', 'const NS=', 'function svgEl', 'function el(', 'function barChart', 'function donut', 'function hBars', 'function funil']) {
        if (trimmed.startsWith(decl)) {
          if (seenEssential[decl]) return false;
          seenEssential[decl] = true;
          break;
        }
      }
      return true;
    }).join('\n');
  }

  const navLinks = [
    '<a href="resumo.html">Resumo</a>',
    ...pages.map(p =>
      `<a href="${p.nome}.html" class="${p.nome === page.nome ? 'active' : ''}">${p.titulo}</a>`
    )
  ].join('\n      ');

  const topbarMod = topbar.replace(
    /<nav class="nav">[\s\S]*?<\/nav>/,
    `<nav class="nav">\n      ${navLinks}\n    </nav>`
  );

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
${head}
<body>

${topbarMod}

<div class="wrap">
${section}
</div>

<script>
${pageScript}

// Carregar dados da API do Google Apps Script
const appsScriptUrl = '${APPS_SCRIPT_URL}';
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📍 Tentando carregar dados da API do Apps Script...');
    fetch(appsScriptUrl)
      .then(r => r.json())
      .then(res => {
        if(res.success && res.data) {
          console.log('✅ Dados carregados da API do Apps Script');
          updateDashboardKPIs(res.data);
        } else {
          console.log('⚠️ API retornou erro, tentando kpis.json local...');
          loadKPIsFromJSON();
        }
      })
      .catch(e => {
        console.log('⚠️ Erro na API:', e.message, '- tentando kpis.json local...');
        loadKPIsFromJSON();
      });
  });
} else {
  console.log('📍 Tentando carregar dados da API do Apps Script...');
  fetch(appsScriptUrl)
    .then(r => r.json())
    .then(res => {
      if(res.success && res.data) {
        console.log('✅ Dados carregados da API do Apps Script');
        updateDashboardKPIs(res.data);
      } else {
        console.log('⚠️ API retornou erro, tentando kpis.json local...');
        loadKPIsFromJSON();
      }
    })
    .catch(e => {
      console.log('⚠️ Erro na API:', e.message, '- tentando kpis.json local...');
      loadKPIsFromJSON();
    });
}
</script>
</body>
</html>`;

  fs.writeFileSync(`./${page.nome}.html`, html);
  console.log(`✅ ${page.nome}.html`);
});

// Pós-processamento: remover duplicatas com sed
try {
  // Remover duplicatas de const sum=
  execSync(`sed -i '0,/^const sum=/!{/^const sum=/d;}' visao-geral.html base-alunos.html engajamento.html esteira-talentos.html financeiro.html satisfacao.html demografia.html leitura-executiva.html`);
  // Remover duplicatas de const fmtN=
  execSync(`sed -i '0,/^const fmtN=/!{/^const fmtN=/d;}' visao-geral.html base-alunos.html engajamento.html esteira-talentos.html financeiro.html satisfacao.html demografia.html leitura-executiva.html`);
  // Remover duplicatas de const NS=
  execSync(`sed -i '0,/^const NS=/!{/^const NS=/d;}' visao-geral.html base-alunos.html engajamento.html esteira-talentos.html financeiro.html satisfacao.html demografia.html leitura-executiva.html`);
  // Remover duplicatas de function svgEl
  execSync(`sed -i '0,/^function svgEl/!{/^function svgEl/d;}' visao-geral.html base-alunos.html engajamento.html esteira-talentos.html financeiro.html satisfacao.html demografia.html leitura-executiva.html`);
  // Remover duplicatas de function el(
  execSync(`sed -i '0,/^function el\\(/!{/^function el\\(/d;}' visao-geral.html base-alunos.html engajamento.html esteira-talentos.html financeiro.html satisfacao.html demografia.html leitura-executiva.html`);
  console.log('✨ Duplicatas removidas!');
} catch(e) {
  console.log('⚠️ Pós-processamento: ' + e.message);
}

console.log('\n✨ Pronto!');
