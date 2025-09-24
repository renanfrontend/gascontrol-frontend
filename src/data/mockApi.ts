// src/data/mockApi.ts

// --- INTERFACES ---
export interface Gasometro {
  id: number;
  identificador: string;
  descricao: string;
  localizacao: string;
  status: 'ativo' | 'inativo';
}

export interface Leitura {
  id: number;
  gasometroId: number;
  data_leitura: string;
  consumo: number;
  observacao?: string;
}

export interface Alerta {
  id: number;
  tipo: 'pico_consumo' | 'medidor_inativo';
  gasometroId: number;
  status: 'novo' | 'em análise' | 'resolvido';
  mensagem: string;
  criado_em: string;
}

// --- MOCK DATA ---
let mockGasometros: Gasometro[] = [
  { id: 12, identificador: "GM-AC-001", descricao: "Medidor central - Andar 1", localizacao: "Bloco A", status: "ativo" },
  { id: 13, identificador: "GM-AC-002", descricao: "Medidor de emergência", localizacao: "Bloco A", status: "ativo" },
  { id: 14, identificador: "GM-BC-001", descricao: "Medidor da piscina", localizacao: "Área Comum", status: "inativo" },
];
let mockLeituras: Leitura[] = [
    { id: 1, gasometroId: 12, data_leitura: "2025-09-01T10:00:00Z", consumo: 12.34 },
    { id: 2, gasometroId: 13, data_leitura: "2025-09-01T10:05:00Z", consumo: 5.67 },
    { id: 3, gasometroId: 12, data_leitura: "2025-09-02T10:00:00Z", consumo: 15.89 },
];
let mockAlertas: Alerta[] = [
    { id: 45, tipo: "pico_consumo", gasometroId: 12, status: "novo", mensagem: "Consumo 20% acima da média", criado_em: "2025-09-02T12:10:00Z" },
    { id: 46, tipo: "medidor_inativo", gasometroId: 14, status: "em análise", mensagem: "Medidor não reporta há 30 dias", criado_em: "2025-09-01T11:00:00Z" },
];

const simulateNetworkRequest = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 500));

// --- GASOMETRO SERVICE ---
export const gasometroMockService = {
  getAll: (): Promise<Gasometro[]> => simulateNetworkRequest([...mockGasometros]),
};

// --- LEITURA SERVICE ---
export const leituraMockService = {
  getAll: (): Promise<Leitura[]> => simulateNetworkRequest([...mockLeituras]),
  
  create: (data: Omit<Leitura, 'id'>): Promise<Leitura> => {
    const newLeitura = { ...data, id: Date.now() };
    mockLeituras.push(newLeitura);
    return simulateNetworkRequest(newLeitura);
  },

  getDailyConsumptionSummary: (): Promise<{ date: string; consumo: number }[]> => {
    console.log("MOCK API: Buscando resumo de consumo diário...");
    const summary = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        summary.push({
            date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            consumo: Math.floor(Math.random() * (50 - 10 + 1) + 10),
        });
    }
    return simulateNetworkRequest(summary);
  },
};

// --- ALERTA SERVICE ---
export const alertaMockService = {
  getAll: (): Promise<Alerta[]> => simulateNetworkRequest([...mockAlertas]),
  updateStatus: (id: number, status: Alerta['status']): Promise<Alerta | null> => {
    const alerta = mockAlertas.find(a => a.id === id);
    if (alerta) {
      alerta.status = status;
      return simulateNetworkRequest(alerta);
    }
    return simulateNetworkRequest(null);
  },
};