#!/usr/bin/env node

/**
 * Script para atualizar kpis.json a partir dos dados da planilha Google Sheets
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

// Função para extrair dados da planilha
async function fetchSheetData() {
  if (!API_KEY) {
    console.error('❌ ERRO: Variável de ambiente GOOGLE_API_KEY não configurada');
    console.error('Instruções: https://developers.google.com/sheets/api/guides/authorizing');
    process.exit(1);
  }

  try {
    // Fetch da aba Performance (Dados dinâmicos)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Performance%20(Dados%20dinâmicos)?key=${API_KEY}`;
    const response = await fetchJSON(url);

    if (!response.values) {
      throw new Error('Nenhum dado encontrado na planilha');
    }

    const rows = response.values;
    const headers = rows[0];

    // Encontrar índices das colunas
    let teoricoIdx = -1;
    let engajamentoIdx = -1;
    let ativosIdx = -1;

    for (let i = 0; i < headers.length; i++) {
      const h = String(headers[i]).toLowerCase();
      if (h.includes('conclusao') && h.includes('teorico')) teoricoIdx = i;
      if (h.includes('engajamento')) engajamentoIdx = i;
      if (h.includes('ativos') && h.includes('30')) ativosIdx = i;
    }

    if (teoricoIdx === -1 || engajamentoIdx === -1 || ativosIdx === -1) {
      console.log('❌ Colunas não encontradas. Colunas disponíveis:');
      headers.forEach((h, i) => {
        console.log(`   ${i}: ${h}`);
      });
      throw new Error('Colunas esperadas não encontradas. Veja acima a lista de colunas.');
    }

    // Processar dados
    let engajamentoAltoMedio = 0;
    let ativosSimCount = 0;
    let teoricoValues = [];
    let totalAlunos = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0] || String(row[0]).trim() === '') continue;

      totalAlunos++;

      // Engajamento Alto + Médio
      if (row[engajamentoIdx]) {
        const eng = String(row[engajamentoIdx]).trim();
        if (eng === 'Alto' || eng === 'Médio') {
          engajamentoAltoMedio++;
        }
      }

      // Ativos em 30 dias
      if (row[ativosIdx]) {
        const at = String(row[ativosIdx]).trim();
        if (at === 'Sim') {
          ativosSimCount++;
        }
      }

      // Teórico médio
      if (row[teoricoIdx]) {
        let val = row[teoricoIdx];
        if (typeof val === 'number') {
          teoricoValues.push(val * 100);
        } else {
          val = parseFloat(String(val).replace('%', '').trim());
          if (!isNaN(val)) {
            teoricoValues.push(val);
          }
        }
      }
    }

    const mediaTeorico = teoricoValues.length > 0
      ? (teoricoValues.reduce((a, b) => a + b, 0) / teoricoValues.length).toFixed(1)
      : 0;

    return {
      engajamento_alto_medio: {
        valor: engajamentoAltoMedio,
        percentual: ((engajamentoAltoMedio / totalAlunos) * 100).toFixed(1),
        total: totalAlunos
      },
      ativos_30_dias: {
        valor: ativosSimCount,
        percentual: ((ativosSimCount / totalAlunos) * 100).toFixed(1),
        total: totalAlunos
      },
      progresso_medio_teorico: parseFloat(mediaTeorico),
      total_alunos: totalAlunos
    };
  } catch (error) {
    console.error('❌ Erro ao buscar dados da planilha:', error.message);
    process.exit(1);
  }
}

// Função principal
async function updateKPIs() {
  console.log('📊 Atualizando KPIs da planilha...');

  try {
    const kpis = await fetchSheetData();

    const data = {
      success: true,
      message: 'KPIs - Curso Profissão Viver de Holter',
      data: {
        ...kpis,
        timestamp: new Date().toISOString()
      }
    };

    // Escrever arquivo kpis.json
    const filePath = path.join(__dirname, 'kpis.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log('✅ kpis.json atualizado com sucesso!');
    console.log(`   • Engajamento A+M: ${kpis.engajamento_alto_medio.valor} de ${kpis.total_alunos} (${kpis.engajamento_alto_medio.percentual}%)`);
    console.log(`   • Ativos 30 dias: ${kpis.ativos_30_dias.valor} de ${kpis.total_alunos} (${kpis.ativos_30_dias.percentual}%)`);
    console.log(`   • Teórico médio: ${kpis.progresso_medio_teorico}%`);
    console.log('\n📝 Próximo passo: git add kpis.json && git commit -m "Atualizar KPIs" && git push');
  } catch (error) {
    console.error('❌ Erro ao atualizar KPIs:', error.message);
    process.exit(1);
  }
}

updateKPIs();
