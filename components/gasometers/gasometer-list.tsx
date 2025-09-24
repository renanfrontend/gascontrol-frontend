"use client"

import { useState } from "react"
import { Edit, Trash2, Eye, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { GasometerForm } from "./gasometer-form"
import { formatDate } from "@/lib/utils"
import type { Gasometer, GasometerFormData } from "@/types"

interface GasometerListProps {
  gasometers: Gasometer[]
  onEdit: (id: number, data: GasometerFormData) => Promise<void>
  onCreate: (data: GasometerFormData) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onView: (gasometer: Gasometer) => void
  isLoading?: boolean
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ativo":
      return <Badge variant="success">Ativo</Badge>
    case "inativo":
      return <Badge variant="secondary">Inativo</Badge>
    case "manutencao":
      return <Badge variant="warning">Manutenção</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function GasometerList({ gasometers, onEdit, onCreate, onDelete, onView, isLoading }: GasometerListProps) {
  const [editingGasometer, setEditingGasometer] = useState<Gasometer | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = async (data: GasometerFormData) => {
    if (!editingGasometer) return

    setIsSubmitting(true)
    try {
      await onEdit(editingGasometer.id, data)
      setEditingGasometer(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreate = async (data: GasometerFormData) => {
    setIsSubmitting(true)
    try {
      await onCreate(data)
      setIsCreateModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gasômetros</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Gasômetro
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identificador</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gasometers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum gasômetro encontrado
                </TableCell>
              </TableRow>
            ) : (
              gasometers.map((gasometer) => (
                <TableRow key={gasometer.id}>
                  <TableCell className="font-medium">{gasometer.identificador}</TableCell>
                  <TableCell>{gasometer.descricao}</TableCell>
                  <TableCell>{gasometer.localizacao}</TableCell>
                  <TableCell>{getStatusBadge(gasometer.status)}</TableCell>
                  <TableCell>{formatDate(gasometer.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onView(gasometer)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingGasometer(gasometer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(gasometer.id)}
                        disabled={deletingId === gasometer.id}
                      >
                        {deletingId === gasometer.id ? (
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Gasômetro</DialogTitle>
            <DialogDescription>Preencha os dados do novo gasômetro.</DialogDescription>
          </DialogHeader>
          <GasometerForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingGasometer} onOpenChange={() => setEditingGasometer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Gasômetro</DialogTitle>
            <DialogDescription>Atualize os dados do gasômetro.</DialogDescription>
          </DialogHeader>
          {editingGasometer && (
            <GasometerForm
              gasometer={editingGasometer}
              onSubmit={handleEdit}
              onCancel={() => setEditingGasometer(null)}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
