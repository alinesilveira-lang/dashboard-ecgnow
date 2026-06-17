#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ler arquivo original
const original = fs.readFileSync(path.join(__dirname, 'dashboard-cpvh.html'), 'utf-8');

// Extrair partes comuns
const headMatch = original.match(/<head>[\s\S]*?<\/head>/);
const head = headMatch ? headMatch[0] : '';

const topbarMatch = original.match(/<div class="topbar">[\s\S]*?<\/div>\s*<\/div>\s*<!-- CAPA/);
const topbar = topbarMatch ? topbarMatch[0].replace(/<!-- CAPA/, '') : '';

const scriptMatch = original.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch ? scriptMatch[1] : '';

// Definir páginas (apenas as que não são resumo)
const PAGES = [
  { nome: 'visao-geral', sectionId: 'geral', titulo: 'Visão Geral' },
  { nome: 'base-alunos', sectionId: 'base', titulo: 'Base de Alunos' },
  { nome: 'engajamento', sectionId: 'engaja', titulo: 'Engajamento' },
  { nome: 'esteira-talentos', sectionId: 'esteira', titulo: 'Esteira de Talentos' },
  { nome: 'financeiro', sectionId: 'financeiro', titulo: 'Financeiro' },
  { nome: 'satisfacao', sectionId: 'nps', titulo: 'Satisfação' },
  { nome: 'demografia', sectionId: 'demo', titulo: 'Demografia' },
  { nome: 'leitura-executiva', sectionId: 'leitura', titulo: 'Leitura Executiva' }
];

function extractSection(html, sectionId) {
  const regex = new RegExp(`<section id="${sectionId}"[\\s\\S]*?(?=<section|<\\/div>\\s*<script|$)`, 'i');
  const match = html.match(regex);
  return match ? match[0] : '';
}

function createNav(currentPage) {
  const links = [
    '<a href="resumo.html" class="">Resumo</a>',
    ...PAGES.map(p =>
      `<a href="${p.nome}.html" class="${p.nome === currentPage ? 'active' : ''}">${p.titulo}</a>`
    )
  ];
  return links.join('\n      ');
}

// Gerar páginas
PAGES.forEach(page => {
  const section = extractSection(original, page.sectionId);
  const nav = createNav(page.nome);

  const topbarMod = topbar.replace(
    /<nav class="nav">([\s\S]*?)<\/nav>/,
    `<nav class="nav">${nav}</nav>`
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

// Carregar dados ao inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadKPIsFromJSON);
} else {
  loadKPIsFromJSON();
}
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, `${page.nome}.html`), html);
  console.log(`✅ ${page.nome}.html criado`);
});

console.log('\n✨ Todas as páginas foram criadas com o visual correto!');
