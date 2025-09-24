"use client"

import { useState } from "react"
import { Edit, Trash2, Plus, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ReadingForm } from "./reading-form"
import { formatDateTime, formatConsumption, exportToCSV } from "@/lib/utils"
import type { Reading, ReadingFormData } from "@/types"

interface ReadingListProps {
  readings: Reading[]
  onEdit: (id: number, data: ReadingFormData) => Promise<void>
  onCreate: (data: ReadingFormData) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onExport: () => Promise<void>
  isLoading?: boolean
  isExporting?: boolean
}

export function ReadingList({
  readings,
  onEdit,
  onCreate,
  onDelete,
  onExport,
  isLoading,
  isExporting,
}: ReadingListProps) {
  const [editingReading, setEditingReading] = useState<Reading | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = async (data: ReadingFormData) => {
    if (!editingReading) return

    setIsSubmitting(true)
    try {
      await onEdit(editingReading.id, data)
      setEditingReading(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreate = async (data: ReadingFormData) => {
    setIsSubmitting(true)
    try {
      await onCreate(data)
      setIsCreateModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta leitura?")) {
      return
    }

    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  const handleExportCSV = () => {
    const csvData = readings.map((reading) => ({
      ID: reading.id,
      Gasometro: reading.gasometro_data?.identificador || reading.gasometro,
      "Data/Hora": formatDateTime(reading.data_leitura),
      "Consumo (m³)": reading.consumo,
      Observacao: reading.observacao || "",
      "Criado em": formatDateTime(reading.created_at),
    }))

    exportToCSV(csvData, `leituras-${new Date().toISOString().split("T")[0]}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Leituras</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV} disabled={readings.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={onExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar Completo
              </>
            )}
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Leitura
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gasômetro</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Consumo</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Registrado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma leitura encontrada
                </TableCell>
              </TableRow>
            ) : (
              readings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{reading.gasometro_data?.identificador || `ID: ${reading.gasometro}`}</div>
                      {reading.gasometro_data?.descricao && (
                        <div className="text-xs text-muted-foreground">{reading.gasometro_data.descricao}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDateTime(reading.data_leitura)}</TableCell>
                  <TableCell className="font-mono">{formatConsumption(reading.consumo)}</TableCell>
                  <TableCell>
                    {reading.observacao ? (
                      <span className="text-sm" title={reading.observacao}>
                        {reading.observacao.length > 50
                          ? `${reading.observacao.substring(0, 50)}...`
                          : reading.observacao}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(reading.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingReading(reading)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(reading.id)}
                        disabled={deletingId === reading.id}
                      >
                        {deletingId === reading.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Leitura</DialogTitle>
            <DialogDescription>Registre uma nova leitura de consumo.</DialogDescription>
          </DialogHeader>
          <ReadingForm onSubmit={handleCreate} onCancel={() => setIsCreateModalOpen(false)} isLoading={isSubmitting} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingReading} onOpenChange={() => setEditingReading(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Leitura</DialogTitle>
            <DialogDescription>Atualize os dados da leitura.</DialogDescription>
          </DialogHeader>
          {editingReading && (
            <ReadingForm
              reading={editingReading}
              onSubmit={handleEdit}
              onCancel={() => setEditingReading(null)}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
