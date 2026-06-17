#!/usr/bin/env node

import fs from 'fs';

const original = fs.readFileSync('./dashboard-cpvh.html', 'utf-8');

// Extrair head e topbar
const headMatch = original.match(/<head>[\s\S]*?<\/head>/);
const head = headMatch ? headMatch[0] : '';

const topbarMatch = original.match(/<div class="topbar">[\s\S]*?<\/div>\s*<\/div>/);
let topbar = topbarMatch ? topbarMatch[0] : '';

// Remover onclick do topbar
topbar = topbar.replace(/ onclick="showResumo\(\)"/g, '');

// Extrair apenas as funções essenciais do script
const essentialFunctions = [
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

pages.forEach(page => {
  const section = extractSection(original, page.sectionId);

  const navLinks = [
    '<a href="resumo.html">Resumo</a>',
    ...pages.map(p =>
      `<a href="${p.nome}.html" class="${p.nome === page.nome ? 'active' : ''}">${p.titulo}</a>`
    )
  ].join('\n      ');

  const topbarMod = topbar.replace(
    /<nav class="nav">[^<]*<\/nav>/,
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
${script}

// Carregar dados
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadKPIsFromJSON);
} else {
  loadKPIsFromJSON();
}
</script>
</body>
</html>`;

  fs.writeFileSync(`./${page.nome}.html`, html);
  console.log(`✅ ${page.nome}.html`);
});

console.log('\n✨ Pronto!');
