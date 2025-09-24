import api from "@/lib/api"
import type { Gasometer, GasometerFormData, GasometerFilter, PaginatedResponse } from "@/types"

export const gasometersService = {
  async getGasometers(page = 1, filter?: GasometerFilter): Promise<PaginatedResponse<Gasometer>> {
    const params = new URLSearchParams()
    params.append("page", page.toString())

    if (filter?.status) params.append("status", filter.status)
    if (filter?.localizacao) params.append("localizacao", filter.localizacao)
    if (filter?.search) params.append("search", filter.search)
    if (filter?.start_date) params.append("start_date", filter.start_date)
    if (filter?.end_date) params.append("end_date", filter.end_date)

    const response = await api.get<PaginatedResponse<Gasometer>>(`/gasometers/?${params}`)
    return response.data
  },

  async getGasometer(id: number): Promise<Gasometer> {
    const response = await api.get<Gasometer>(`/gasometers/${id}/`)
    return response.data
  },

  async createGasometer(data: GasometerFormData): Promise<Gasometer> {
    const response = await api.post<Gasometer>("/gasometers/", data)
    return response.data
  },

  async updateGasometer(id: number, data: Partial<GasometerFormData>): Promise<Gasometer> {
    const response = await api.patch<Gasometer>(`/gasometers/${id}/`, data)
    return response.data
  },

  async deleteGasometer(id: number): Promise<void> {
    await api.delete(`/gasometers/${id}/`)
  },

  async getLocations(): Promise<string[]> {
    const response = await api.get<string[]>("/gasometers/locations/")
    return response.data
  },
}
