import api from "@/lib/api"
import type { DashboardStats, ConsumptionData, DateFilter } from "@/types"

export const dashboardService = {
  async getStats(filter?: DateFilter): Promise<DashboardStats> {
    const params = new URLSearchParams()
    if (filter?.start_date) params.append("start_date", filter.start_date)
    if (filter?.end_date) params.append("end_date", filter.end_date)

    const response = await api.get<DashboardStats>(`/dashboard/stats/?${params}`)
    return response.data
  },

  async getConsumptionData(filter?: DateFilter & { gasometro?: number }): Promise<ConsumptionData[]> {
    const params = new URLSearchParams()
    if (filter?.start_date) params.append("start_date", filter.start_date)
    if (filter?.end_date) params.append("end_date", filter.end_date)
    if (filter?.gasometro) params.append("gasometro", filter.gasometro.toString())

    const response = await api.get<ConsumptionData[]>(`/dashboard/consumption/?${params}`)
    return response.data
  },
}
