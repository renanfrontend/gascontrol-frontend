"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { MainLayout } from "@/components/layout/main-layout"
import { AlertCard } from "@/components/alerts/alert-card"
import { AlertFilters } from "@/components/alerts/alert-filters"
import { AlertStats } from "@/components/alerts/alert-stats"
import { AlertDetailModal } from "@/components/alerts/alert-detail-modal"
import { alertsService } from "@/lib/services/alerts"
import type { Alert, AlertFilter, PaginatedResponse } from "@/types"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<AlertFilter>({})
  const [stats, setStats] = useState({
    total: 0,
    novo: 0,
    em_analise: 0,
    resolvido: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    count: 0,
  })

  const loadAlerts = async (page = 1, currentFilter = filter) => {
    try {
      setIsLoading(true)
      const response: PaginatedResponse<Alert> = await alertsService.getAlerts(page, currentFilter)

      setAlerts(response.results)
      setPagination({
        page,
        totalPages: Math.ceil(response.count / 20), // Assuming 20 items per page
        count: response.count,
      })
    } catch (error) {
      console.error("Erro ao carregar alertas:", error)
      toast.error("Erro ao carregar alertas")
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await alertsService.getAlertStats()
      setStats(statsData)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    }
  }

  useEffect(() => {
    loadAlerts()
    loadStats()
  }, [])

  const handleFilterChange = (newFilter: AlertFilter) => {
    setFilter(newFilter)
    loadAlerts(1, newFilter)
  }

  const handleStatusChange = async (id: number, status: Alert["status"]) => {
    try {
      await alertsService.updateAlertStatus(id, status)
      toast.success("Status do alerta atualizado!")
      loadAlerts()
      loadStats()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      throw error
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await alertsService.deleteAlert(id)
      toast.success("Alerta excluído com sucesso!")
      loadAlerts()
      loadStats()
    } catch (error) {
      console.error("Erro ao excluir alerta:", error)
      throw error
    }
  }

  const handleView = (alert: Alert) => {
    setSelectedAlert(alert)
    setIsDetailModalOpen(true)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-balance">Alertas</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-card rounded-lg animate-pulse" />
            ))}
          </div>

          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Alertas</h1>
          <div className="text-sm text-muted-foreground">
            {pagination.count} alerta{pagination.count !== 1 ? "s" : ""} encontrado
            {pagination.count !== 1 ? "s" : ""}
          </div>
        </div>

        <AlertStats stats={stats} />

        <AlertFilters onFilterChange={handleFilterChange} initialFilter={filter} />

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <p className="text-lg mb-2">Nenhum alerta encontrado</p>
                <p className="text-sm">Tente ajustar os filtros ou aguarde novos alertas serem gerados.</p>
              </div>
            </div>
          ) : (
            alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))
          )}
        </div>

        <AlertDetailModal alert={selectedAlert} open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} />
      </div>
    </MainLayout>
  )
}
