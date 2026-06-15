#!/usr/bin/env node

/**
 * Script para atualizar kpis.json a partir da aba "Dashboard" do Google Sheets
 * Uso: node update-kpis.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ID da planilha Google Sheets
const SHEET_ID = '1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA';
const API_KEY = process.env.GOOGLE_API_KEY || '';

// Função para fazer requisição HTTPS
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchDashboardData() {
  if (!API_KEY) {
    console.error('❌ ERRO: Variável de ambiente GOOGLE_API_KEY não configurada');
    console.error('Instruções: https://developers.google.com/sheets/api/guides/authorizing');
    process.exit(1);
  }

  try {
    // Fetch da aba Dashboard
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Dashboard?key=${API_KEY}`;
    const response = await fetchJSON(url);

    if (!response.values) {
      throw new Error('Nenhum dado encontrado na aba Dashboard');
    }

    const rows = response.values;
    const data = {};

    // Mapear valores da planilha (A = métrica, B = valor)
    rows.forEach((row, index) => {
      if (index === 0) return; // Skip header
      const metrica = String(row[0] || '').trim();
      const valor = row[1];

      if (metrica && valor !== undefined && valor !== '') {
        // Converter valor para número se for percentual ou número
        let convertedValue = valor;
        if (typeof valor === 'number') {
          convertedValue = valor;
        } else if (String(valor).includes('%')) {
          convertedValue = parseFloat(String(valor).replace('%', ''));
        } else {
          const num = parseFloat(valor);
          convertedValue = isNaN(num) ? valor : num;
        }

        data[metrica] = convertedValue;
      }
    });

    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar dados da planilha:', error.message);
    process.exit(1);
  }
}

async function updateKPIs() {
  console.log('📊 Carregando dados da aba Dashboard...');

  try {
    const dashData = await fetchDashboardData();

    // Estruturar dados por categoria
    const kpis = {
      // Core KPIs
      total_alunos: dashData['Total Alunos'] || 0,
      total_cadastrados: dashData['Total Cadastrados'] || 0,

      // Engajamento
      engajamento_alto_medio: {
        valor: dashData['Engajamento Alto+Médio (qtd)'] || 0,
        percentual: (dashData['Engajamento Alto+Médio (%)'] || 0).toFixed(1)
      },
      engajamento_detalhado: {
        alto: dashData['Engajamento Alto (qtd)'] || 0,
        alto_pct: (dashData['Engajamento Alto (%)'] || 0).toFixed(2),
        medio: dashData['Engajamento Médio (qtd)'] || 0,
        medio_pct: (dashData['Engajamento Médio (%)'] || 0).toFixed(2),
        baixo: dashData['Engajamento Baixo (qtd)'] || 0,
        baixo_pct: (dashData['Engajamento Baixo (%)'] || 0).toFixed(2),
        nenhum: dashData['Engajamento Nenhum (qtd)'] || 0,
        nenhum_pct: (dashData['Engajamento Nenhum (%)'] || 0).toFixed(2)
      },

      // Ativos
      ativos_30_dias: {
        valor: dashData['Ativos 30 dias (qtd)'] || 0,
        percentual: (dashData['Ativos 30 dias (%)'] || 0).toFixed(1)
      },

      // Progresso
      progresso_medio_teorico: parseFloat((dashData['Teórico médio (%)'] || 0).toFixed(1)),
      ativo_estudando: dashData['Ativo (estudando) (qtd)'] || 0,
      concluidos: dashData['Concluídos (qtd)'] || 0,
      taxa_conclusao: parseFloat((dashData['Taxa de conclusão (%)'] || 0).toFixed(1)),

      // Esteira de Talentos
      analistas_ecgnow: dashData['Analistas ECGNOW'] || 0,
      ex_analistas_ecgnow: dashData['Ex Analistas ECGNOW'] || 0,

      // Base de Alunos
      base_alunos: {
        aluno_externo: dashData['Aluno externo'] || 0,
        cancelou: dashData['Cancelou (qtd)'] || 0,
        cancelou_pct: (dashData['Cancelou (%)'] || 0).toFixed(2),
        abandono: dashData['Abandono (qtd)'] || 0,
        abandono_pct: (dashData['Abandono (%)'] || 0).toFixed(2),
        bloqueado: dashData['Bloqueado (qtd)'] || 0,
        bloqueado_pct: (dashData['Bloqueado (%)'] || 0).toFixed(2),
        so_teoria: dashData['Só teoria (qtd)'] || 0,
        so_teoria_pct: (dashData['Só teoria (%)'] || 0).toFixed(2),
        abaixo_50pct: dashData['Abaixo dos 50% (qtd)'] || 0,
        abaixo_50pct_pct: (dashData['Abaixo dos 50% (%)'] || 0).toFixed(2)
      },

      // Aprovação
      taxa_aprovacao_qtd: dashData['Taxa de aprovação (qtd)'] || 0,
      taxa_aprovacao_pct: parseFloat((dashData['Taxa de aprovação (%)'] || 0).toFixed(1)),

      // Progresso Hotmart
      progresso_medio_hotmart: parseFloat((dashData['Progresso Médio Hotmart (%)'] || 0).toFixed(2)),

      // Inadimplência
      inadimplencia_qtd: dashData['Inadimplência (qtd alunos)'] || 0,
      inadimplencia_valor: dashData['Inadimplência (valor)'] || 0,

      // Formas de Pagamento
      asaas_qtd: dashData['ASAAS (qtd)'] || 0,
      asaas_pct: (dashData['ASAAS (%)'] || 0).toFixed(2),
      boleto_qtd: dashData['Boleto (qtd)'] || 0,
      boleto_pct: (dashData['Boleto (%)'] || 0).toFixed(2),
      pix_qtd: dashData['Pix (qtd)'] || 0,
      pix_pct: (dashData['Pix (%)'] || 0).toFixed(2),
      trancado_qtd: dashData['Trancado (qtd)'] || 0,
      trancado_pct: (dashData['Trancado (%)'] || 0).toFixed(2),

      // Teórico/Prático
      teorico_qtd: dashData['Teórico (qtd)'] || 0,
      teorico_pct: (dashData['Teórico (%)'] || 0).toFixed(2),
      pratico_qtd: dashData['Prático (qtd)'] || 0,
      pratico_pct: (dashData['Prático (%)'] || 0).toFixed(2),

      // NPS
      nps_score: parseFloat((dashData['NPS Score'] || 0).toFixed(2)),
      nps_promotores_pct: parseFloat((dashData['NPS Promotores (%)'] || 0).toFixed(2)),
      nps_neutros_pct: parseFloat((dashData['NPS Neutros (%)'] || 0).toFixed(2)),
      nps_detratores_pct: parseFloat((dashData['NPS Detratores (%)'] || 0).toFixed(2)),
      nps_respostas: dashData['NPS Respostas (qtd)'] || 0,
      nps_nao_responderam: dashData['NPS Não Responderam (qtd)'] || 0,
      nps_nao_responderam_pct: (dashData['NPS Não Responderam (%)'] || 0).toFixed(2),

      // Demografia
      idade_media: dashData['Idade Média'] || 0,
      idade_nao_informada: dashData['Idade não informada (qtd)'] || 0,

      // Turnos
      turno_manha: dashData['Turno Manhã (qtd)'] || 0,
      turno_tarde: dashData['Turno Tarde (qtd)'] || 0,
      turno_noite: dashData['Turno Noite (qtd)'] || 0,
      turno_integral: dashData['Turno Integral (qtd)'] || 0,

      // Estados
      sp: dashData['SP'] || 0,
      mg: dashData['MG'] || 0,
      pr: dashData['PR'] || 0,
      rj: dashData['RJ'] || 0,
      rs: dashData['RS'] || 0,

      // Notas Médias
      nota_media_engajamento_alto: parseFloat((dashData['Nota Média - Engajamento Alto'] || 0).toFixed(2)),
      nota_media_engajamento_medio: parseFloat((dashData['Nota Média - Engajamento Médio'] || 0).toFixed(2)),
      nota_media_engajamento_baixo: parseFloat((dashData['Nota Média - Engajamento Baixo'] || 0).toFixed(2))
    };

    const output = {
      success: true,
      message: 'KPIs - Curso Profissão Viver de Holter (Dashboard)',
      data: {
        ...kpis,
        timestamp: new Date().toISOString()
      }
    };

    // Escrever arquivo kpis.json
    const filePath = path.join(__dirname, 'kpis.json');
    fs.writeFileSync(filePath, JSON.stringify(output, null, 2));

    console.log('✅ kpis.json atualizado com sucesso!');
    console.log(`   • Total alunos: ${kpis.total_alunos}`);
    console.log(`   • Engajamento A+M: ${kpis.engajamento_alto_medio.valor} (${kpis.engajamento_alto_medio.percentual}%)`);
    console.log(`   • Ativos 30 dias: ${kpis.ativos_30_dias.valor} (${kpis.ativos_30_dias.percentual}%)`);
    console.log(`   • Teórico médio: ${kpis.progresso_medio_teorico}%`);
    console.log(`   • NPS Score: ${kpis.nps_score}`);
    console.log('\n📝 Próximo passo: git add kpis.json && git commit -m "Atualizar KPIs" && git push');
  } catch (error) {
    console.error('❌ Erro ao atualizar KPIs:', error.message);
    process.exit(1);
  }
}

updateKPIs();
