// Google Apps Script - Backend para Dashboard ECGNOW
// Implemente em Google Apps Script Editor

const SENHA_DASHBOARD = 'Ecgnow@123'; // Mude para uma senha segura
const SHEET_ID = '1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA'; // Planilha principal - Cadastro de Alunos CPVH
const CACHE_DURATION = 86400; // Cache de 24 horas em segundos

function doPost(e) {
  try {
    if (!e || !e.postData) {
      return sendResponse(false, 'Requisição inválida', null);
    }
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const password = data.password;

    // getKPIs é público (sem senha)
    if (action === 'getKPIs') {
      return handleGetKPIs();
    }

    // Outras ações precisam de senha
    if (!password) {
      return sendResponse(false, 'Senha obrigatória', null);
    }

    if (password !== SENHA_DASHBOARD) {
      return sendResponse(false, 'Senha incorreta', null);
    }

    if (action === 'authenticate') {
      return sendResponse(true, 'Autenticado com sucesso', { authenticated: true });
    } else if (action === 'getData') {
      return handleGetData();
    } else if (action === 'processQuizFeedback') {
      return handleProcessQuizFeedback(data);
    } else {
      return sendResponse(false, 'Ação inválida', null);
    }
  } catch (error) {
    console.error('Erro:', error);
    return sendResponse(false, 'Erro no servidor', null);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.JSON);
}

function handleGetKPIs() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const performanceSheet = spreadsheet.getSheetByName('Performance (Dados dinâmicos)');

    if (!performanceSheet) {
      return sendResponse(false, 'Aba Performance não encontrada', null);
    }

    const range = performanceSheet.getDataRange();
    const values = range.getValues();
    const headers = values[0];

    // Encontrar índices das colunas
    const engajamentoIdx = headers.findIndex(h =>
      normalizarHeader(h).includes('engajamento')
    );
    const ativosIdx = headers.findIndex(h =>
      normalizarHeader(h).includes('ativos') && normalizarHeader(h).includes('30')
    );
    const teoricoIdx = headers.findIndex(h =>
      normalizarHeader(h).includes('conclusao') && normalizarHeader(h).includes('teorico')
    );

    Logger.log('Engajamento idx: ' + engajamentoIdx + ', Ativos idx: ' + ativosIdx + ', Teórico idx: ' + teoricoIdx);
    Logger.log('Headers: ' + headers.join(' | '));

    let engajamentoAltoMedio = 0;
    let ativosSimCount = 0;
    let teoricoValues = [];
    let totalAlunos = 0;

    // Processar dados (a partir da linha 2)
    for (let i = 1; i < values.length; i++) {
      const row = values[i];

      // Verificar se linha tem dados
      if (!row.some(cell => cell !== '')) continue;

      totalAlunos++;

      // Contar Engajamento Alto + Médio
      if (engajamentoIdx >= 0) {
        const engajamento = String(row[engajamentoIdx]).trim();
        if (engajamento === 'Alto' || engajamento === 'Médio') {
          engajamentoAltoMedio++;
        }
      }

      // Contar Ativos em 30 dias (Sim)
      if (ativosIdx >= 0) {
        const ativos = String(row[ativosIdx]).trim();
        if (ativos === 'Sim') {
          ativosSimCount++;
        }
      }

      // Coletar % conclusão teórico
      if (teoricoIdx >= 0) {
        const teorico = row[teoricoIdx];
        if (teorico) {
          let valor = parseFloat(String(teorico).replace('%', '').trim());
          if (!isNaN(valor)) {
            teoricoValues.push(valor);
          }
        }
      }
    }

    // Calcular média teórico
    const mediaTeorico = teoricoValues.length > 0
      ? (teoricoValues.reduce((a, b) => a + b, 0) / teoricoValues.length).toFixed(1)
      : 0;

    Logger.log('Total alunos: ' + totalAlunos);
    Logger.log('Engajamento A+M: ' + engajamentoAltoMedio);
    Logger.log('Ativos 30 dias: ' + ativosSimCount);
    Logger.log('Média teórico: ' + mediaTeorico);

    return sendResponse(true, 'KPIs calculados', {
      engajamento_alto_medio: {
        valor: engajamentoAltoMedio,
        percentual: ((engajamentoAltoMedio / totalAlunos) * 100).toFixed(1),
        total: totalAlunos
      },
      ativos_30_dias: {
        valor: ativosSimCount,
        total: totalAlunos
      },
      progresso_medio_teorico: parseFloat(mediaTeorico),
      total_alunos: totalAlunos,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    Logger.log('Erro ao calcular KPIs: ' + error);
    return sendResponse(false, 'Erro ao calcular KPIs: ' + error.message, null);
  }
}

function handleGetData() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);

    // Dados principais (tudo na planilha CPVH)
    const cadastroSheet = spreadsheet.getSheetByName('Cadastro (Dados estáticos)');
    const performanceSheet = spreadsheet.getSheetByName('Performance (Dados dinâmicos)');
    const dadosHotmartSheet = spreadsheet.getSheetByName('Dados hotmart');

    const cadastroData = sheetToJSON(cadastroSheet);
    const performanceData = sheetToJSON(performanceSheet);
    const dadosHotmartData = sheetToJSON(dadosHotmartSheet);

    Logger.log('Cadastro: ' + cadastroData.length);
    Logger.log('Performance: ' + performanceData.length);
    Logger.log('Dados Hotmart: ' + dadosHotmartData.length);

    const alunosCompletos = combinarDados(cadastroData, performanceData);

    // Log para debug
    Logger.log('Total Cadastro: ' + cadastroData.length);
    Logger.log('Total Performance: ' + performanceData.length);
    Logger.log('Total Combinado: ' + alunosCompletos.length);
    if (alunosCompletos.length > 0) {
      Logger.log('Primeiro aluno tem status_curso? ' + (alunosCompletos[0].status_curso ? 'SIM: ' + alunosCompletos[0].status_curso : 'NÃO'));
    }

    Logger.log('Retornando hotmart: ' + dadosHotmartData.length + ' registros');
    Logger.log('Primeiro email hotmart: ' + (dadosHotmartData.length > 0 ? dadosHotmartData[0].email : 'VAZIO'));

    return sendResponse(true, 'Dados carregados', {
      alunos: alunosCompletos,
      cadastro: cadastroData,
      performance: performanceData,
      hotmart: dadosHotmartData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return sendResponse(false, 'Erro ao carregar dados: ' + error.message, null);
  }
}

function sheetToJSON(sheet) {
  if (!sheet) return [];

  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];
  const data = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const obj = {};

    headers.forEach((header, index) => {
      const normalized = normalizarHeader(header);
      obj[normalized] = row[index];
    });

    // Só adicionar se tem dados
    if (row.some(cell => cell !== '')) {
      data.push(obj);
    }
  }

  return data;
}

function normalizarHeader(header) {
  let normalizado = header
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[áàâã]/g, 'a')
    .replace(/[éè]/g, 'e')
    .replace(/[í]/g, 'i')
    .replace(/[óôõ]/g, 'o')
    .replace(/[ú]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9_]/g, '');

  // Mapeamento de colunas específicas
  const mapeamento = {
    'percentual_conclusao_do_teorico': 'percentual_conclusao_teorico',
    'conclusao_do_teorico': 'percentual_conclusao_teorico',
    '_conclusao_do_teorico': 'percentual_conclusao_teorico',
    'progres_progresso_teoria': 'percentual_conclusao_teorico',
    'progresso_teoria': 'percentual_conclusao_teorico',
    'percentual_conclusao_do_pratico': 'percentual_conclusao_pratico',
    'conclusao_do_pratico': 'percentual_conclusao_pratico',
    '_conclusao_do_pratico': 'percentual_conclusao_pratico',
    'progressao_pratica': 'percentual_conclusao_pratico',
    'resultado_da_prova': 'resultado_final',
    'resultado_final': 'resultado_final',
    'ultimo_acesso_plataforma_hotmart': 'ultima_atividade',
    'ultimo_acesso_hotmart_data': 'ultima_atividade',
    'apto_somente_teorico': 'apto_teorico',
    'apto_tecnico_para_pratica': 'apto_tecnico_para_pratica',
    'alcancou_50': 'alcancou_50',
    'risco_m7': 'risco_m7',
    'modulo_atual_numero': 'modulo_atual',
    'atingiu_m7': 'atingiu_m7',
    'inativo': 'inativo',
    'status_aluno': 'status_aluno',
    'status_teoria': 'status_teoria',
    'diagnostico_pre_pratica': 'diagnostico_pre_pratica',
    'progressao_real': 'progressao_real',
    'dias_ativos': 'dias_ativos',
    'semanas_ativas': 'semanas_ativas',
    'irp_ideal_2xsemana': 'irp_ideal',
    'irp_minimo_1xsemana': 'irp_minimo',
    'eficiencia_de_credito_limitada': 'eficiencia_de_credito',
    'alavancagem_pedagogica': 'alavancagem_pedagogica',
    'vinculo_com_a_ecgnow': 'vinculo_ecgnow',
    'vinculo_ecgnow': 'vinculo_ecgnow',
    'frequencia_aulas_praticas': 'frequencia_pratica',
    'valor_da_inadimplencia': 'valor_inadimplencia',
    'selo_mec': 'selo_mec',
    'pilar_teorico_pratico': 'pilar',
    'pilar': 'pilar',
    'modalidade_da_pratica': 'modalidade_pratica',
    'modalidade_pratica': 'modalidade_pratica',
    'status_do_curso': 'status_curso',
    'status_curso': 'status_curso',
    'statusdocurso': 'status_curso',
    'statusdoscurso': 'status_curso',
    'pilar_teoricopratico': 'pilar',
    'progresso': 'progresso',
    'engajamento': 'engajamento',
    'ultimo_acesso': 'ultima_atividade',
    'data_da_compra': 'data_da_compra'
  };

  // Fallback: se nenhum match, tenta conter palavras-chave
  if (!mapeamento[normalizado]) {
    if (normalizado.includes('status') && normalizado.includes('curso')) {
      return 'status_curso';
    }
    if (normalizado.includes('pilar')) {
      return 'pilar';
    }
  }

  return mapeamento[normalizado] || normalizado;
}

function combinarDados(cadastro, performance) {
  // Combinar dados de cadastro com performance usando Matrícula como chave
  return performance.map(perf => {
    const cad = cadastro.find(c =>
      c.matricula === perf.matricula || c.matricula == perf.matricula
    );

    return {
      ...perf,
      ...cad,  // Cadastro sobrescreve Performance (status_curso está em Cadastro)
      id: perf.matricula
    };
  });
}

function sendResponse(success, message, data) {
  const response = {
    success,
    message,
    data: data || {}
  };

  const output = ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);

  return output;
}

// ============= QUIZ FUNCTIONS =============

function handleProcessQuizFeedback(data) {
  try {
    const {
      studentName,
      studentEmail,
      moduleKey,
      moduleTitle,
      questions,
      responses
    } = data;

    // Salvar respostas na planilha
    saveQuizResponses(studentName, studentEmail, moduleKey, moduleTitle, responses);

    // Chamar Claude API para gerar feedback
    const feedback = callClaudeAPI(
      studentName,
      moduleTitle,
      questions,
      responses
    );

    return sendResponse(true, 'Feedback gerado com sucesso', { feedback });
  } catch (error) {
    console.error('Erro ao processar quiz:', error);
    return sendResponse(false, 'Erro ao gerar feedback: ' + error.message, null);
  }
}

function saveQuizResponses(studentName, studentEmail, moduleKey, moduleTitle, responses) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);

    // Tentar obter ou criar sheet de quizzes
    let quizSheet = spreadsheet.getSheetByName('Quiz_Responses');
    if (!quizSheet) {
      quizSheet = spreadsheet.insertSheet('Quiz_Responses');
      quizSheet.appendRow([
        'Data',
        'Nome Aluno',
        'Email',
        'Módulo',
        'Respostas JSON',
        'Status'
      ]);
    }

    // Adicionar resposta
    quizSheet.appendRow([
      new Date().toLocaleString('pt-BR'),
      studentName,
      studentEmail,
      moduleTitle,
      JSON.stringify(responses),
      'Respondido'
    ]);

  } catch (error) {
    console.error('Erro ao salvar respostas:', error);
    // Não falhar a função inteira se não conseguir salvar
  }
}

function callClaudeAPI(studentName, moduleTitle, questions, responses) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');

    if (!apiKey) {
      return 'Erro: Chave API não configurada. Configure ANTHROPIC_API_KEY nas Script Properties.';
    }

    // Formatar as respostas e perguntas para o Claude
    const quizContent = formatQuizForClaude(questions, responses);

    const prompt = `
Você é o Holter Coach, tutor do curso "Viver de Holter".

OBJETIVO: Ajudar alunos a fixar conteúdo dos 7 módulos com explicações curtas + feedback.

REGRAS:
1. Linguagem: simples, direta, sem jargão. Como se explicasse pro colega de plantão.
2. Sem "derivações ECG". No Holter usamos: canais, FC, pausas, QRS largo/estreito, regular/irregular.
3. Estrutura da resposta:
   A) Se houver respostas incorretas, corrija com empatia em 1 linha
   B) Destaque os pontos fortes do aluno
   C) Aponte áreas para melhorar
   D) Dê próximos passos práticos
4. TOM: Coach parceiro. Usa emoji 1-2x por msg. Não dá aula longa.

MÓDULOS QUE VOCÊ DOMINA:
- M1: ECG básico p/ Holter - FC, pausas, canais, artefato
- M2: Conceitos de arritmia - bradi/taciarritmia, regular/irregular
- M3: Arritmias ventriculares - BEV, TV, bigeminismo, trigeminismo
- M4: Arritmias supraventriculares - FA, flutter, TSV, extrassístole atrial
- M5: BAV - 1º grau, 2º grau Mobitz I/II, 3º grau
- M6: Condução intraventricular - BRD, BRE, QRS alargado
- M7: Repolarização - QT, QTc, Torsades, supradesnivelamento

---

Aluno: ${studentName}
Módulo: ${moduleTitle}

${quizContent}

Por favor, forneça um feedback estruturado com:
- 📊 Resumo geral
- ✅ Pontos fortes
- 🔧 Áreas para melhorar
- 🎓 Próximos passos
- 💡 Próximo módulo ou quiz sugerido

Mantenha a resposta concisa (máximo 2-3 parágrafos por seção).
`;

    const url = 'https://api.anthropic.com/v1/messages';
    const payload = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    const options = {
      method: 'post',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    if (result.content && result.content.length > 0) {
      return result.content[0].text;
    } else {
      return 'Erro ao gerar feedback do Claude API.';
    }

  } catch (error) {
    console.error('Erro ao chamar Claude API:', error);
    return `Erro ao processar seu feedback: ${error.message}`;
  }
}

function formatQuizForClaude(questions, responses) {
  let content = 'RESPOSTAS DO ALUNO:\n\n';

  questions.forEach((question, index) => {
    const response = responses[index];
    const questionNum = index + 1;

    content += `Pergunta ${questionNum}: ${question.questionText}\n`;

    if (question.questionType === 'multiple') {
      const optionsMap = {
        '0': 'A',
        '1': 'B',
        '2': 'C',
        '3': 'D'
      };
      content += `Resposta: ${optionsMap[response.answer] || 'N/A'}\n`;
      content += `Acertou: ${response.isCorrect ? 'Sim ✓' : 'Não ✗'}\n\n`;
    } else {
      content += `Resposta: "${response.answer}"\n\n`;
    }
  });

  return content;
}
