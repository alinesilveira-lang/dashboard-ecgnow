// Hotmart API Service
// Integração com API Hotmart para puxar dados de alunos

const HOTMART_API_KEY = import.meta.env.VITE_HOTMART_API_KEY;
const HOTMART_AFFILIATE_ID = import.meta.env.VITE_HOTMART_AFFILIATE_ID;
const HOTMART_API_URL = 'https://api.hotmart.com/payment/api/v1';

// Buscar alunos (purchases) da Hotmart
export const fetchHotmartAlunos = async () => {
  if (!HOTMART_API_KEY) {
    console.warn('Hotmart API Key não configurada');
    return [];
  }

  try {
    const response = await fetch(
      `${HOTMART_API_URL}/purchases?affiliate_id=${HOTMART_AFFILIATE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${HOTMART_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro Hotmart: ${response.status}`);
    }

    const data = await response.json();
    return transformHotmartData(data);
  } catch (error) {
    console.error('Erro ao buscar dados da Hotmart:', error);
    return [];
  }
};

// Transformar dados da Hotmart para o formato do Dashboard
const transformHotmartData = (hotmartData) => {
  if (!hotmartData.items) return [];

  return hotmartData.items.map(item => ({
    id: item.id,
    nome: item.buyer?.name || 'Sem nome',
    email: item.buyer?.email || '',
    produto: item.product?.name || '',
    data_compra: item.purchase_date || '',
    status: item.status?.name || 'Desconhecido',
    valor: item.price || 0,
    tipo_pagamento: item.payment?.type || 'Desconhecido',
    turma: '', // Pode ser preenchido manualmente ou via Google Sheets
  }));
};

// Sincronizar Hotmart com Google Sheets
export const syncHotmartToSheets = async () => {
  try {
    const alunos = await fetchHotmartAlunos();

    if (alunos.length === 0) {
      console.log('Nenhum dado de aluno encontrado na Hotmart');
      return { success: false, message: 'Sem dados' };
    }

    console.log(`Sincronizados ${alunos.length} alunos da Hotmart`);
    return { success: true, count: alunos.length, data: alunos };
  } catch (error) {
    console.error('Erro ao sincronizar Hotmart:', error);
    return { success: false, error: error.message };
  }
};

// Obter status de um aluno específico
export const getAlunoStatus = (alunoEmail) => {
  // Implementar lógica para obter status específico
  // Pode combinar dados de Sheets + Hotmart
  return {
    email: alunoEmail,
    status: 'Desconhecido',
    ultimo_acesso: null,
    progresso: 0,
  };
};
