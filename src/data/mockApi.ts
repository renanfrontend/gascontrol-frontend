export interface Gasometro {
  id: number;
  identificador: string;
  descricao: string;
  localizacao: string;
  status: 'ativo' | 'inativo';
}

// Simula uma chamada de rede com um atraso de 500ms
const simulateNetworkRequest = <T>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), 500));
};

const mockGasometros: Gasometro[] = [
  { id: 12, identificador: "GM-AC-001", descricao: "Medidor central - Andar 1", localizacao: "Bloco A", status: "ativo" },
  { id: 13, identificador: "GM-AC-002", descricao: "Medidor de emergência", localizacao: "Bloco A", status: "ativo" },
  { id: 14, identificador: "GM-BC-001", descricao: "Medidor da piscina", localizacao: "Área Comum", status: "inativo" },
];

// Esta função também precisa ser exportada para ser usada em outros arquivos
export const fetchGasometros = () => {
  console.log("MOCK API: Buscando gasômetros...");
  return simulateNetworkRequest(mockGasometros);
};