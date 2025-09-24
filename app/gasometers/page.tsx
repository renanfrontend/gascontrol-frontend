"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { MainLayout } from "@/components/layout/main-layout"
import { GasometerList } from "@/components/gasometers/gasometer-list"
import { GasometerFilters } from "@/components/gasometers/gasometer-filters"
import { gasometersService } from "@/lib/services/gasometers"
import type { Gasometer, GasometerFormData, GasometerFilter, PaginatedResponse } from "@/types"

export default function GasometersPage() {
  const [gasometers, setGasometers] = useState<Gasometer[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<GasometerFilter>({})
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    count: 0,
  })

  const loadGasometers = async (page = 1, currentFilter = filter) => {
    try {
      setIsLoading(true)
      const response: PaginatedResponse<Gasometer> = await gasometersService.getGasometers(page, currentFilter)

      setGasometers(response.results)
      setPagination({
        page,
        totalPages: Math.ceil(response.count / 20), // Assuming 20 items per page
        count: response.count,
      })
    } catch (error) {
      console.error("Erro ao carregar gasômetros:", error)
      toast.error("Erro ao carregar gasômetros")
    } finally {
      setIsLoading(false)
    }
  }

  const loadLocations = async () => {
    try {
      const locationsData = await gasometersService.getLocations()
      setLocations(locationsData)
    } catch (error) {
      console.error("Erro ao carregar localizações:", error)
    }
  }

  useEffect(() => {
    loadGasometers()
    loadLocations()
  }, [])

  const handleFilterChange = (newFilter: GasometerFilter) => {
    setFilter(newFilter)
    loadGasometers(1, newFilter)
  }

  const handleCreate = async (data: GasometerFormData) => {
    try {
      await gasometersService.createGasometer(data)
      toast.success("Gasômetro criado com sucesso!")
      loadGasometers()
    } catch (error) {
      console.error("Erro ao criar gasômetro:", error)
      throw error
    }
  }

  const handleEdit = async (id: number, data: GasometerFormData) => {
    try {
      await gasometersService.updateGasometer(id, data)
      toast.success("Gasômetro atualizado com sucesso!")
      loadGasometers()
    } catch (error) {
      console.error("Erro ao atualizar gasômetro:", error)
      throw error
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este gasômetro?")) {
      return
    }

    try {
      await gasometersService.deleteGasometer(id)
      toast.success("Gasômetro excluído com sucesso!")
      loadGasometers()
    } catch (error) {
      console.error("Erro ao excluir gasômetro:", error)
      throw error
    }
  }

  const handleView = (gasometer: Gasometer) => {
    // Navigate to gasometer details page
    window.location.href = `/gasometers/${gasometer.id}`
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Gasômetros</h1>
          <div className="text-sm text-muted-foreground">
            {pagination.count} gasômetro{pagination.count !== 1 ? "s" : ""} encontrado
            {pagination.count !== 1 ? "s" : ""}
          </div>
        </div>

        <GasometerFilters onFilterChange={handleFilterChange} locations={locations} initialFilter={filter} />

        <GasometerList
          gasometers={gasometers}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isLoading={isLoading}
        />
      </div>
    </MainLayout>
  )
}
