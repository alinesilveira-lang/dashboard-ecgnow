#!/usr/bin/env node

import fs from 'fs';

// Ler original
const original = fs.readFileSync('./dashboard-cpvh.html', 'utf-8');

// Extrair partes
const headEnd = original.indexOf('</head>');
const head = original.substring(0, headEnd + 7);

const topbarStart = original.indexOf('<div class="topbar">');
const topbarEnd = original.indexOf('</div>\n</div>', topbarStart) + 13;
let topbar = original.substring(topbarStart, topbarEnd);

const scriptStart = original.indexOf('<script>');
const scriptEnd = original.indexOf('</script>', scriptStart);
let scriptFull = original.substring(scriptStart + 8, scriptEnd);

// Remover funções que só funcionam em dashboard completo
scriptFull = scriptFull.replace(/function showResumo\(\)[\s\S]*?fitResumo\(\);/m, '');
scriptFull = scriptFull.replace(/function showDetalhe\(\)[\s\S]*?}\n/m, '');
scriptFull = scriptFull.replace(/function fitResumo\(\)[\s\S]*?}\n/m, '');
scriptFull = scriptFull.replace(/document\.querySelectorAll\('\.nav[\s\S]*?},\{passive:true\}\);?/m, '');
scriptFull = scriptFull.replace(/window\.addEventListener\('resize',fitResumo\);?/m, '');
scriptFull = scriptFull.replace(/fitResumo\(\);?/m, '');

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

  // Criar nav
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
${scriptFull}

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
