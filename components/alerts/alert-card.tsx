"use client"

import { useState } from "react"
import { AlertTriangle, Clock, Eye, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { formatDateTime } from "@/lib/utils"
import type { Alert } from "@/types"

interface AlertCardProps {
  alert: Alert
  onStatusChange: (id: number, status: Alert["status"]) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onView: (alert: Alert) => void
}

const getAlertIcon = (tipo: string) => {
  switch (tipo) {
    case "pico_consumo":
      return <AlertTriangle className="h-5 w-5" />
    case "medidor_inativo":
      return <Clock className="h-5 w-5" />
    case "falha_leitura":
      return <AlertTriangle className="h-5 w-5" />
    case "consumo_zero":
      return <AlertTriangle className="h-5 w-5" />
    default:
      return <AlertTriangle className="h-5 w-5" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "novo":
      return <Badge variant="destructive">Novo</Badge>
    case "em_analise":
      return <Badge variant="warning">Em Análise</Badge>
    case "resolvido":
      return <Badge variant="success">Resolvido</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getTipoBadge = (tipo: string) => {
  const labels = {
    pico_consumo: "Pico de Consumo",
    medidor_inativo: "Medidor Inativo",
    falha_leitura: "Falha de Leitura",
    consumo_zero: "Consumo Zero",
  }

  return <Badge variant="outline">{labels[tipo as keyof typeof labels] || tipo}</Badge>
}

const statusOptions = [
  { value: "novo", label: "Novo" },
  { value: "em_analise", label: "Em Análise" },
  { value: "resolvido", label: "Resolvido" },
]

export function AlertCard({ alert, onStatusChange, onDelete, onView }: AlertCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === alert.status) return

    setIsUpdating(true)
    try {
      await onStatusChange(alert.id, newStatus as Alert["status"])
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este alerta?")) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(alert.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div
            className={`text-${alert.status === "novo" ? "red" : alert.status === "em_analise" ? "yellow" : "green"}-600`}
          >
            {getAlertIcon(alert.tipo)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {getTipoBadge(alert.tipo)}
              {getStatusBadge(alert.status)}
            </div>

            <p className="text-sm text-foreground mb-2">{alert.mensagem}</p>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Gasômetro: {alert.gasometro_data?.identificador || `ID: ${alert.gasometro}`}</span>
              <span>Criado: {formatDateTime(alert.criado_em)}</span>
              {alert.atualizado_em !== alert.criado_em && (
                <span>Atualizado: {formatDateTime(alert.atualizado_em)}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Select
            value={alert.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="w-32"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Button variant="ghost" size="sm" onClick={() => onView(alert)}>
            <Eye className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  )
}
