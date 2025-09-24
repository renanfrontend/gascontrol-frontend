// --- INTERFACES ---
export interface Gasometro { id: number; identificador: string; descricao: string; localizacao: string; status: 'ativo' | 'inativo'; }
export interface Leitura { id: number; gasometroId: number; data_leitura: string; consumo: number; }
export interface Alerta { id: number; tipo: 'pico_consumo' | 'medidor_inativo'; gasometroId: number; status: 'novo' | 'em análise' | 'resolvido'; mensagem: string; criado_em: string; }
// --- MOCK DATA ---
const mockGasometros: Gasometro[] = [ { id: 12, identificador: "GM-AC-001", descricao: "Medidor central - Andar 1", localizacao: "Bloco A", status: "ativo" }, { id: 13, identificador: "GM-AC-002", descricao: "Medidor de emergência", localizacao: "Bloco A", status: "ativo" }, { id: 14, identificador: "GM-BC-001", descricao: "Medidor da piscina", localizacao: "Área Comum", status: "inativo" }, ];
const mockLeituras: Leitura[] = [ { id: 1, gasometroId: 12, data_leitura: "2025-09-01T10:00:00Z", consumo: 12.34 }, { id: 2, gasometroId: 13, data_leitura: "2025-09-01T10:05:00Z", consumo: 5.67 }, { id: 3, gasometroId: 12, data_leitura: "2025-09-02T10:00:00Z", consumo: 15.89 }, ];
const mockAlertas: Alerta[] = [ { id: 45, tipo: "pico_consumo", gasometroId: 12, status: "novo", mensagem: "Consumo 20% acima da média", criado_em: "2025-09-02T12:10:00Z" }, { id: 46, tipo: "medidor_inativo", gasometroId: 14, status: "em análise", mensagem: "Medidor não reporta há 30 dias", criado_em: "2025-09-01T11:00:00Z" }, ];
const simulateNetworkRequest = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 300));
export const gasometroMockService = { getAll: (): Promise<Gasometro[]> => simulateNetworkRequest([...mockGasometros]), };
export const leituraMockService = { getAll: (): Promise<Leitura[]> => simulateNetworkRequest([...mockLeituras]), };
export const alertaMockService = { getAll: (): Promise<Alerta[]> => simulateNetworkRequest([...mockAlertas]), };