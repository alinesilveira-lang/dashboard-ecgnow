// Google Sheets Writer - Adiciona dados à planilha
// Usa Google Sheets API v4 para ESCREVER dados

const SPREADSHEET_ID = '1t5gLpn9HdfOSoPgWawsslfQjOfqsMMa5k5o9wjaHeHA';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

// Adicionar novo aluno à planilha
export const adicionarAlunoAoSheets = async (aluno) => {
  try {
    // Para escrever, você precisa de um método diferente
    // Esta é uma versão simulada que mostra como faria
    console.log('📝 Tentando adicionar aluno à planilha:', aluno);

    // Na prática, você precisaria de:
    // 1. OAuth2 (não apenas API Key)
    // 2. Ou usar um endpoint no servidor que faz isso
    // 3. Ou usar Apps Script (que não está acessível)

    return { success: false, message: 'Escrever em Sheets requer configuração adicional' };
  } catch (error) {
    console.error('Erro ao adicionar aluno:', error);
    return { success: false, error: error.message };
  }
};

// Processar webhook da Hotmart e criar aluno
export const processarWebhookHotmart = (dadosHotmart) => {
  // Transformar dados do webhook para formato do Dashboard
  const aluno = {
    nome: dadosHotmart.buyer?.name || '',
    email: dadosHotmart.buyer?.email || '',
    produto: dadosHotmart.product?.name || '',
    data_compra: new Date(dadosHotmart.purchase_date).toLocaleDateString('pt-BR'),
    valor: dadosHotmart.price || 0,
    tipo_pagamento: dadosHotmart.payment?.type || '',
    status_compra: dadosHotmart.status === 'approved' ? 'Aprovado' : 'Pendente',
  };

  console.log('✅ Aluno processado do webhook:', aluno);
  return aluno;
};

// Nota: Para escrever automaticamente na Sheets, as opções são:
// 1. OAuth2 + Sheets API (necessita autenticação do usuário)
// 2. Service Account (precisa de arquivo JSON privado)
// 3. Google Apps Script (que você não consegue mais acessar)
// 4. Usar um banco de dados intermediário (Firebase, Supabase, etc)
// 5. Usar o webhook do Railway que já está configurado

export const instructions = `
📝 PARA ATUALIZAR GOOGLE SHEETS AUTOMATICAMENTE:

Opção 1: Usar o webhook do Railway
- Configure um backend Node.js que recebe o webhook
- Processe os dados
- Use googleapis package para escrever na Sheets

Opção 2: Usar Zapier/Make
- Crie um fluxo que recebe webhook da Hotmart
- Adicione automaticamente à Google Sheets

Opção 3: Recriar Google Apps Script
- Redeploy um novo Apps Script
- Configure o webhook para chamar ele

Por enquanto, os dados já sincronizam da Sheets para o Dashboard ✅
O próximo passo é automatizar a escrita quando novas compras chegarem.
`;
