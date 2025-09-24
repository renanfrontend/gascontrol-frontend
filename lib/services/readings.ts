import api from "@/lib/api"
import type { Reading, ReadingFormData, ReadingFilter, PaginatedResponse } from "@/types"

export const readingsService = {
  async getReadings(page = 1, filter?: ReadingFilter): Promise<PaginatedResponse<Reading>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())

    if (filter?.gasometro) params.append("gasometro", filter.gasometro.toString())
    if (filter?.start_date) params.append("start_date", filter.start_date)
    if (filter?.end_date) params.append("end_date", filter.end_date)
    if (filter?.search) params.append("search", filter.search)

    const response = await api.get<PaginatedResponse<Reading>>(`/readings/?${params}`)
    return response.data
  },

  async getReading(id: number): Promise<Reading> {
    const response = await api.get<Reading>(`/readings/${id}/`)
    return response.data
  },

  async createReading(data: ReadingFormData): Promise<Reading> {
    const response = await api.post<Reading>("/readings/", data)
    return response.data
  },

  async updateReading(id: number, data: Partial<ReadingFormData>): Promise<Reading> {
    const response = await api.patch<Reading>(`/readings/${id}/`, data)
    return response.data
  },

  async deleteReading(id: number): Promise<void> {
    await api.delete(`/readings/${id}/`)
  },

  async getReadingsByGasometer(gasometroId: number, limit = 10): Promise<Reading[]> {
    const response = await api.get<Reading[]>(`/readings/by-gasometer/${gasometroId}/?limit=${limit}`)
    return response.data
  },

  async exportReadings(filter?: ReadingFilter): Promise<Blob> {
    const params = new URLSearchParams()
    if (filter?.gasometro) params.append("gasometro", filter.gasometro.toString())
    if (filter?.start_date) params.append("start_date", filter.start_date)
    if (filter?.end_date) params.append("end_date", filter.end_date)

    const response = await api.get(`/readings/export/?${params}`, {
      responseType: "blob",
    })
    return response.data
  },
}
