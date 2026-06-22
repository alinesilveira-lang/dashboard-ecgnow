// Google Apps Script para Dashboard CPVH - Simples
// Cole este código no Google Apps Script Editor

const SHEET_ID = '1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'getKPIs';

  if (action === 'getKPIs') {
    return getKPIs();
  }
  return sendResponse(false, 'Ação inválida', null);
}

function doPost(e) {
  const action = (e && e.parameter && e.parameter.action) || 'getKPIs';

  if (action === 'getKPIs') {
    return getKPIs();
  }
  return sendResponse(false, 'Ação inválida', null);
}

function getKPIs() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const performanceSheet = spreadsheet.getSheetByName('Performance (Dados dinâmicos)');

    if (!performanceSheet) {
      return sendResponse(false, 'Aba "Performance (Dados dinâmicos)" não encontrada', null);
    }

    const range = performanceSheet.getDataRange();
    const values = range.getValues();

    // Índices das colunas (baseado na planilha real):
    // L (11): % conclusão do teórico
    // N (13): Engajamento
    // O (14): Ativos em 30 dias
    const teoricoIdx = 11;
    const engajamentoIdx = 13;
    const ativosIdx = 14;

    let engajamentoAltoMedio = 0;
    let ativosSimCount = 0;
    let teoricoValues = [];
    let totalAlunos = 0;

    // Processar dados (começar da linha 1, pula header na linha 0)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];

      // Pular linhas vazias
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

      // Teórico médio (coluna L contém percentual)
      if (row[teoricoIdx]) {
        let val = row[teoricoIdx];
        if (typeof val === 'number') {
          teoricoValues.push(val * 100); // Se for decimal, converte para percentual
        } else {
          val = parseFloat(String(val).replace('%', '').trim());
          if (!isNaN(val)) {
            teoricoValues.push(val);
          }
        }
      }
    }

    // Média teórico
    const mediaTeorico = teoricoValues.length > 0
      ? (teoricoValues.reduce((a, b) => a + b, 0) / teoricoValues.length).toFixed(1)
      : 0;

    return sendResponse(true, 'KPIs calculados com sucesso', {
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
      total_alunos: totalAlunos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return sendResponse(false, 'Erro ao calcular: ' + error.message, null);
  }
}

function sendResponse(success, message, data) {
  const response = {
    success: success,
    message: message,
    data: data || {}
  };

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
}
