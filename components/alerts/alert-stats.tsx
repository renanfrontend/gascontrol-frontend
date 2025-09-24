"use client"

import { AlertTriangle, Clock, CheckCircle, Bell } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"

interface AlertStatsProps {
  stats: {
    total: number
    novo: number
    em_analise: number
    resolvido: number
  }
}

export function AlertStats({ stats }: AlertStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total de Alertas"
        value={stats.total}
        description="Todos os alertas"
        icon={<Bell className="h-5 w-5" />}
      />
      <StatsCard
        title="Novos"
        value={stats.novo}
        description="Requerem atenção"
        icon={<AlertTriangle className="h-5 w-5" />}
        className={stats.novo > 0 ? "border-destructive/50" : ""}
      />
      <StatsCard
        title="Em Análise"
        value={stats.em_analise}
        description="Sendo investigados"
        icon={<Clock className="h-5 w-5" />}
        className={stats.em_analise > 0 ? "border-yellow-500/50" : ""}
      />
      <StatsCard
        title="Resolvidos"
        value={stats.resolvido}
        description="Finalizados"
        icon={<CheckCircle className="h-5 w-5" />}
        className="border-green-500/50"
      />
    </div>
  )
}
