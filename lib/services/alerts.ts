import api from "@/lib/api"
import type { Alert, AlertFilter, PaginatedResponse } from "@/types"

export const alertsService = {
  async getAlerts(page = 1, filter?: AlertFilter): Promise<PaginatedResponse<Alert>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())

    if (filter?.status) params.append("status", filter.status)
    if (filter?.tipo) params.append("tipo", filter.tipo)
    if (filter?.gasometro) params.append("gasometro", filter.gasometro.toString())

    const response = await api.get<PaginatedResponse<Alert>>(`/alerts/?${params}`)
    return response.data
  },

  async getAlert(id: number): Promise<Alert> {
    const response = await api.get<Alert>(`/alerts/${id}/`)
    return response.data
  },

  async updateAlertStatus(id: number, status: Alert["status"]): Promise<Alert> {
    const response = await api.patch<Alert>(`/alerts/${id}/`, { status })
    return response.data
  },

  async deleteAlert(id: number): Promise<void> {
    await api.delete(`/alerts/${id}/`)
  },

  async getAlertStats(): Promise<{
    total: number
    novo: number
    em_analise: number
    resolvido: number
  }> {
    const response = await api.get("/alerts/stats/")
    return response.data
  },
}
