#!/usr/bin/env node

import fs from 'fs';

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
const addedDeclarations = new Set(); // Rastrear declarações duplicadas

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Verificar se começa uma função essencial
  let isEssential = essentialFunctions.some(fn => line.includes(fn));

  if (isEssential) {
    // Se é uma declaração (const/function), verificar se já foi adicionada
    if (line.includes('const ') || line.includes('function ')) {
      const declMatch = line.match(/(const|function)\s+(\w+)/);
      if (declMatch) {
        const declName = declMatch[2];
        if (addedDeclarations.has(declName)) continue; // Pular duplicata
        addedDeclarations.add(declName);
      }
    }
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

// Remover apenas declarações duplicadas (const/function)
const scriptLines = script.split('\n');
const declaredVars = new Set();
const dedupedLines = scriptLines.filter((line, idx) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('const ') || trimmed.startsWith('function ')) {
    const match = trimmed.match(/^(const|function)\s+(\w+)/);
    if (match) {
      const name = match[2];
      if (declaredVars.has(name)) return false; // Remover duplicata
      declaredVars.add(name);
    }
  }
  return true;
});
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

pages.forEach(page => {
  const section = extractSection(original, page.id);

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
