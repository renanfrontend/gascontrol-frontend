
import React, { useState, useEffect } from 'react';
import { fetchGasometros, Gasometro } from '../data/mockApi';

const GasometrosListPage = () => {
  const [gasometros, setGasometros] = useState<Gasometro[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGasometros = async () => {
      setIsLoading(true);
      const data = await fetchGasometros();
      setGasometros(data);
      setIsLoading(false);
    };

    loadGasometros();
  }, []);

  if (isLoading) {
    return <div>Carregando medidores...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista de Gasômetros</h1>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Identificador</th>
            <th>Descrição</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {gasometros.map((gasometro) => (
            <tr key={gasometro.id}>
              <td>{gasometro.id}</td>
              <td>{gasometro.identificador}</td>
              <td>{gasometro.descricao}</td>
              <td>{gasometro.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GasometrosListPage;