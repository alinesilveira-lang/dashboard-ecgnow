// Google Sheets Service
// ID da planilha: 1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA

const SPREADSHEET_ID = '1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || 'YOUR_API_KEY_HERE';

// Função para ler dados da planilha
export const fetchSheetData = async (sheetName) => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }

    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Erro ao sincronizar com Google Sheets:', error);
    return [];
  }
};

// Converter linhas em objetos
export const rowsToObjects = (rows) => {
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header.toLowerCase().replace(/\s+/g, '_')] = row[idx] || '';
    });
    return obj;
  });
};

// Buscar dados de alunos (de Performance - Dados dinâmicos com 232 alunos)
export const fetchAlunos = async () => {
  const rows = await fetchSheetData('Performance (Dados dinâmicos)');
  return rowsToObjects(rows);
};

// Buscar dados de desempenho
export const fetchDesempenho = async () => {
  const rows = await fetchSheetData('Performance (Dados dinâmicos)');
  return rowsToObjects(rows);
};

// Buscar dados de ASAAS (pagamentos/inadimplência)
export const fetchAsaas = async () => {
  const rows = await fetchSheetData('ASAAS_Import');
  return rowsToObjects(rows);
};

// Buscar dados de Boletos (pagamentos/inadimplência)
export const fetchBoletos = async () => {
  const rows = await fetchSheetData('BOLETOS_Import');
  return rowsToObjects(rows);
};

// Buscar dados de financeiro (combina ASAAS + Boletos)
export const fetchFinanceiro = async () => {
  const [asaas, boletos] = await Promise.all([
    fetchAsaas(),
    fetchBoletos(),
  ]);
  return [...asaas, ...boletos];
};

// Buscar dados de cadastro (Dias remanescentes)
export const fetchCadastro = async () => {
  const rows = await fetchSheetData('Cadastro');
  return rowsToObjects(rows);
};

// Buscar tudo
export const fetchAllData = async () => {
  try {
    const [alunos, desempenho, asaas, boletos, cadastro] = await Promise.all([
      fetchAlunos(),
      fetchDesempenho(),
      fetchAsaas(),
      fetchBoletos(),
      fetchCadastro(),
    ]);

    return {
      alunos: alunos || [],
      desempenho: desempenho || [],
      asaas: asaas || [],
      boletos: boletos || [],
      financeiro: [...(asaas || []), ...(boletos || [])],
      cadastro: cadastro || [],
    };
  } catch (error) {
    console.error('Erro ao buscar todos os dados:', error);
    return {
      alunos: [],
      desempenho: [],
      asaas: [],
      boletos: [],
      financeiro: [],
      cadastro: [],
    };
  }
};
