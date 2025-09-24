"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { MainLayout } from "@/components/layout/main-layout"
import { ReadingList } from "@/components/readings/reading-list"
import { ReadingFilters } from "@/components/readings/reading-filters"
import { readingsService } from "@/lib/services/readings"
import type { Reading, ReadingFormData, ReadingFilter, PaginatedResponse } from "@/types"

export default function ReadingsPage() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [filter, setFilter] = useState<ReadingFilter>({})
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    count: 0,
  })

  const loadReadings = async (page = 1, currentFilter = filter) => {
    try {
      setIsLoading(true)
      const response: PaginatedResponse<Reading> = await readingsService.getReadings(page, currentFilter)

      setReadings(response.results)
      setPagination({
        page,
        totalPages: Math.ceil(response.count / 20), // Assuming 20 items per page
        count: response.count,
      })
    } catch (error) {
      console.error("Erro ao carregar leituras:", error)
      toast.error("Erro ao carregar leituras")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReadings()
  }, [])

  const handleFilterChange = (newFilter: ReadingFilter) => {
    setFilter(newFilter)
    loadReadings(1, newFilter)
  }

  const handleCreate = async (data: ReadingFormData) => {
    try {
      await readingsService.createReading(data)
      toast.success("Leitura registrada com sucesso!")
      loadReadings()
    } catch (error) {
      console.error("Erro ao criar leitura:", error)
      throw error
    }
  }

  const handleEdit = async (id: number, data: ReadingFormData) => {
    try {
      await readingsService.updateReading(id, data)
      toast.success("Leitura atualizada com sucesso!")
      loadReadings()
    } catch (error) {
      console.error("Erro ao atualizar leitura:", error)
      throw error
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await readingsService.deleteReading(id)
      toast.success("Leitura excluída com sucesso!")
      loadReadings()
    } catch (error) {
      console.error("Erro ao excluir leitura:", error)
      throw error
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const blob = await readingsService.exportReadings(filter)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `leituras-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Exportação concluída!")
    } catch (error) {
      console.error("Erro ao exportar leituras:", error)
      toast.error("Erro ao exportar leituras")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Leituras</h1>
          <div className="text-sm text-muted-foreground">
            {pagination.count} leitura{pagination.count !== 1 ? "s" : ""} encontrada
            {pagination.count !== 1 ? "s" : ""}
          </div>
        </div>

        <ReadingFilters onFilterChange={handleFilterChange} initialFilter={filter} />

        <ReadingList
          readings={readings}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onExport={handleExport}
          isLoading={isLoading}
          isExporting={isExporting}
        />
      </div>
    </MainLayout>
  )
}
