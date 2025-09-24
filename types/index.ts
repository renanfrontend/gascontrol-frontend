// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

// Auth Types
export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

// Gasometer Types
export interface Gasometer {
  id: number
  identificador: string
  descricao: string
  localizacao: string
  status: "ativo" | "inativo" | "manutencao"
  created_at: string
  updated_at: string
}

export interface GasometerFormData {
  identificador: string
  descricao: string
  localizacao: string
  status: "ativo" | "inativo" | "manutencao"
}

// Reading Types
export interface Reading {
  id: number
  gasometro: number
  gasometro_data?: Gasometer
  data_leitura: string
  consumo: number
  observacao?: string
  created_at: string
  updated_at: string
}

export interface ReadingFormData {
  gasometro: number
  data_leitura: string
  consumo: number
  observacao?: string
}

// Alert Types
export interface Alert {
  id: number
  tipo: "pico_consumo" | "medidor_inativo" | "falha_leitura" | "consumo_zero"
  gasometro: number
  gasometro_data?: Gasometer
  status: "novo" | "em_analise" | "resolvido"
  mensagem: string
  criado_em: string
  atualizado_em: string
}

// Dashboard Types
export interface DashboardStats {
  total_gasometros: number
  total_leituras_periodo: number
  media_consumo_dia: number
  alertas_ativos: number
}

export interface ConsumptionData {
  date: string
  consumo: number
  gasometro?: string
}

// Filter Types
export interface DateFilter {
  start_date?: string
  end_date?: string
}

export interface GasometerFilter extends DateFilter {
  status?: string
  localizacao?: string
  search?: string
}

export interface ReadingFilter extends DateFilter {
  gasometro?: number
  search?: string
}

export interface AlertFilter {
  status?: string
  tipo?: string
  gasometro?: number
}
