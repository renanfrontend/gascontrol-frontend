"use client"

import { useState, useEffect } from "react"
import { Gauge, FileText, AlertTriangle, TrendingUp } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ConsumptionChart } from "@/components/dashboard/consumption-chart"
import { DateFilter } from "@/components/dashboard/date-filter"
import { dashboardService } from "@/lib/services/dashboard"
import { formatNumber } from "@/lib/utils"
import type { DashboardStats, ConsumptionData, DateFilter as DateFilterType } from "@/types"
import { format, subDays } from "date-fns"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<DateFilterType>({
    start_date: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end_date: format(new Date(), "yyyy-MM-dd"),
  })

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [statsData, consumptionChartData] = await Promise.all([
        dashboardService.getStats(filter),
        dashboardService.getConsumptionData(filter),
      ])

      setStats(statsData)
      setConsumptionData(consumptionChartData)
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [filter])

  const handleFilterChange = (newFilter: DateFilterType) => {
    setFilter(newFilter)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-card rounded-lg animate-pulse" />
            <div className="h-96 bg-card rounded-lg animate-pulse" />
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        </div>

        <DateFilter onFilterChange={handleFilterChange} initialFilter={filter} />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Gasômetros"
            value={stats?.total_gasometros || 0}
            description="Medidores cadastrados"
            icon={<Gauge className="h-6 w-6" />}
          />
          <StatsCard
            title="Leituras no Período"
            value={stats?.total_leituras_periodo || 0}
            description="Registros de consumo"
            icon={<FileText className="h-6 w-6" />}
          />
          <StatsCard
            title="Média por Dia"
            value={`${formatNumber(stats?.media_consumo_dia || 0)} m³`}
            description="Consumo médio diário"
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatsCard
            title="Alertas Ativos"
            value={stats?.alertas_ativos || 0}
            description="Requerem atenção"
            icon={<AlertTriangle className="h-6 w-6" />}
            className={stats?.alertas_ativos ? "border-destructive/50" : ""}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <ConsumptionChart data={consumptionData} title="Evolução do Consumo" height={400} />
        </div>
      </div>
    </MainLayout>
  )
}
