// Google Apps Script - Backend para Dashboard ECGNOW
// Implemente em Google Apps Script Editor

const SENHA_DASHBOARD = 'sua_senha_aqui'; // Mude para uma senha segura
const SHEET_ID = '1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA'; // ID da sua planilha
const CACHE_DURATION = 300; // Cache de 5 minutos em segundos

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'authenticate') {
      return handleAuthenticate(data.password);
    } else if (action === 'getData') {
      return handleGetData(data.token);
    } else {
      return sendResponse(false, 'Ação inválida', null);
    }
  } catch (error) {
    console.error('Erro:', error);
    return sendResponse(false, 'Erro no servidor', null);
  }
}

function handleAuthenticate(password) {
  if (password === SENHA_DASHBOARD) {
    const token = Utilities.getUuid();
    const cache = CacheService.getUserCache();
    cache.put('token_' + token, 'valid', CACHE_DURATION);

    return sendResponse(true, 'Autenticado com sucesso', { token });
  } else {
    return sendResponse(false, 'Senha incorreta', null);
  }
}

function handleGetData(token) {
  const cache = CacheService.getUserCache();
  const tokenValid = cache.get('token_' + token);

  if (!tokenValid) {
    return sendResponse(false, 'Token inválido ou expirado', null);
  }

  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);

    // Ler dados das abas
    const cadastroSheet = spreadsheet.getSheetByName('Cadastro');
    const performanceSheet = spreadsheet.getSheetByName('Performance');

    const cadastroData = sheetToJSON(cadastroSheet);
    const performanceData = sheetToJSON(performanceSheet);

    // Combinar dados
    const alunosCompletos = combinarDados(cadastroData, performanceData);

    return sendResponse(true, 'Dados carregados', {
      alunos: alunosCompletos,
      cadastro: cadastroData,
      performance: performanceData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return sendResponse(false, 'Erro ao carregar dados', null);
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
      obj[normalizarHeader(header)] = row[index];
    });

    // Só adicionar se tem dados
    if (row.some(cell => cell !== '')) {
      data.push(obj);
    }
  }

  return data;
}

function normalizarHeader(header) {
  return header
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
}

function combinarDados(cadastro, performance) {
  // Combinar dados de cadastro com performance usando Matrícula como chave
  return performance.map(perf => {
    const cad = cadastro.find(c =>
      c.matricula === perf.matricula || c.matricula == perf.matricula
    );

    return {
      ...cad,
      ...perf,
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

  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Teste local (executar no Apps Script Editor)
function testAuthenticate() {
  const result = handleAuthenticate('sua_senha_aqui');
  Logger.log(result);
}

function testGetData() {
  // Primeiro autenticar
  const authResult = handleAuthenticate('sua_senha_aqui');
  const authData = JSON.parse(authResult.getContent());
  const token = authData.data.token;

  // Depois buscar dados
  const dataResult = handleGetData(token);
  Logger.log(dataResult);
}
