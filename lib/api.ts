import axios, { type AxiosInstance, type AxiosResponse } from "axios"
import { toast } from "react-hot-toast"

const MOCK_MODE = true

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

const mockData = {
  gasometers: [
    {
      id: 1,
      identificador: "GM-AC-001",
      descricao: "Medidor central - Andar 1",
      localizacao: "Bloco A",
      status: "ativo",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      identificador: "GM-AC-002",
      descricao: "Medidor secundário - Andar 2",
      localizacao: "Bloco B",
      status: "ativo",
      created_at: "2024-01-16T10:00:00Z",
      updated_at: "2024-01-16T10:00:00Z",
    },
    {
      id: 3,
      identificador: "GM-AC-003",
      descricao: "Medidor de emergência",
      localizacao: "Bloco C",
      status: "inativo",
      created_at: "2024-01-17T10:00:00Z",
      updated_at: "2024-01-17T10:00:00Z",
    },
  ],
  readings: [
    {
      id: 1,
      gasometro: 1,
      data_leitura: "2024-01-20T10:00:00Z",
      consumo: 12.34,
      observacao: "Leitura mensal",
    },
    {
      id: 2,
      gasometro: 1,
      data_leitura: "2024-01-21T10:00:00Z",
      consumo: 15.67,
      observacao: "Leitura semanal",
    },
    {
      id: 3,
      gasometro: 2,
      data_leitura: "2024-01-20T10:00:00Z",
      consumo: 8.9,
      observacao: "Leitura mensal",
    },
  ],
  alerts: [
    {
      id: 1,
      tipo: "pico_consumo",
      gasometro: 1,
      status: "novo",
      mensagem: "Consumo acima de 200% da média dos últimos 30 dias",
      criado_em: "2024-01-22T12:10:00Z",
    },
    {
      id: 2,
      tipo: "medidor_inativo",
      gasometro: 3,
      status: "em_analise",
      mensagem: "Medidor sem leituras há mais de 7 dias",
      criado_em: "2024-01-21T08:30:00Z",
    },
  ],
}

const mockApiCall = async (endpoint: string, method = "GET", data?: any) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const path = endpoint.replace("/api", "").split("?")[0]

  switch (true) {
    case path === "/gasometers/" && method === "GET":
      return { data: { results: mockData.gasometers, count: mockData.gasometers.length } }

    case path === "/readings/" && method === "GET":
      return { data: { results: mockData.readings, count: mockData.readings.length } }

    case path === "/alerts/" && method === "GET":
      return { data: { results: mockData.alerts, count: mockData.alerts.length } }

    case path === "/dashboard/stats/" && method === "GET":
      return {
        data: {
          total_gasometers: mockData.gasometers.length,
          active_gasometers: mockData.gasometers.filter((g) => g.status === "ativo").length,
          total_readings: mockData.readings.length,
          active_alerts: mockData.alerts.filter((a) => a.status === "novo").length,
          avg_consumption: 12.3,
        },
      }

    case path.startsWith("/gasometers/") && method === "POST":
      const newGasometer = {
        ...data,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockData.gasometers.push(newGasometer)
      return { data: newGasometer }

    case path.startsWith("/readings/") && method === "POST":
      const newReading = { ...data, id: Date.now() }
      mockData.readings.push(newReading)
      return { data: newReading }

    default:
      return { data: {} }
  }
}

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    if (MOCK_MODE) {
      const mockResponse = await mockApiCall(config.url || "", config.method?.toUpperCase() || "GET", config.data)
      return Promise.reject({ mockResponse, isMock: true })
    }

    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    if (error.isMock && error.mockResponse) {
      return Promise.resolve(error.mockResponse)
    }

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken && !MOCK_MODE) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          localStorage.setItem("access_token", access)

          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          localStorage.removeItem("user")
          window.location.href = "/login"
          return Promise.reject(refreshError)
        }
      } else {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    }

    if (!MOCK_MODE) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.detail || error.message || "Erro inesperado"
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  },
)

export default api
