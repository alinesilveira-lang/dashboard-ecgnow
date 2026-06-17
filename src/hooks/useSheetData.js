import { useState, useEffect } from 'react';
import { fetchAllData } from '../services/sheetsService';

export const useSheetData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await fetchAllData();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Sincronizar a cada 30 segundos
    const interval = setInterval(loadData, 30000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: loadData };
};
