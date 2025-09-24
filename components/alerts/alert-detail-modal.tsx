"use client"

import { AlertTriangle, Clock, Gauge, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"
import type { Alert } from "@/types"

interface AlertDetailModalProps {
  alert: Alert | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const getAlertIcon = (tipo: string) => {
  switch (tipo) {
    case "pico_consumo":
      return <AlertTriangle className="h-6 w-6 text-red-600" />
    case "medidor_inativo":
      return <Clock className="h-6 w-6 text-yellow-600" />
    case "falha_leitura":
      return <AlertTriangle className="h-6 w-6 text-red-600" />
    case "consumo_zero":
      return <AlertTriangle className="h-6 w-6 text-orange-600" />
    default:
      return <AlertTriangle className="h-6 w-6 text-gray-600" />
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

const getTipoLabel = (tipo: string) => {
  const labels = {
    pico_consumo: "Pico de Consumo",
    medidor_inativo: "Medidor Inativo",
    falha_leitura: "Falha de Leitura",
    consumo_zero: "Consumo Zero",
  }

  return labels[tipo as keyof typeof labels] || tipo
}

export function AlertDetailModal({ alert, open, onOpenChange }: AlertDetailModalProps) {
  if (!alert) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getAlertIcon(alert.tipo)}
            <span>Detalhes do Alerta #{alert.id}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Type */}
          <div className="flex items-center space-x-4">
            {getStatusBadge(alert.status)}
            <Badge variant="outline">{getTipoLabel(alert.tipo)}</Badge>
          </div>

          {/* Message */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Mensagem do Alerta</h3>
            <p className="text-sm text-muted-foreground">{alert.mensagem}</p>
          </div>

          {/* Gasometer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <Gauge className="h-4 w-4" />
                <span>Gasômetro</span>
              </h3>
              <div className="bg-card border rounded-lg p-3">
                <div className="space-y-1">
                  <p className="font-medium">{alert.gasometro_data?.identificador || `ID: ${alert.gasometro}`}</p>
                  {alert.gasometro_data?.descricao && (
                    <p className="text-sm text-muted-foreground">{alert.gasometro_data.descricao}</p>
                  )}
                  {alert.gasometro_data?.localizacao && (
                    <p className="text-sm text-muted-foreground">📍 {alert.gasometro_data.localizacao}</p>
                  )}
                  {alert.gasometro_data?.status && (
                    <Badge variant={alert.gasometro_data.status === "ativo" ? "success" : "secondary"}>
                      {alert.gasometro_data.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Cronologia</span>
              </h3>
              <div className="bg-card border rounded-lg p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Criado:</span>
                    <span className="text-sm font-medium">{formatDateTime(alert.criado_em)}</span>
                  </div>
                  {alert.atualizado_em !== alert.criado_em && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Atualizado:</span>
                      <span className="text-sm font-medium">{formatDateTime(alert.atualizado_em)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions or Additional Info */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Informações Adicionais</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Este alerta foi gerado automaticamente pelo sistema</p>
              <p>• Verifique o gasômetro e suas leituras recentes</p>
              <p>• Atualize o status conforme o progresso da análise</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
