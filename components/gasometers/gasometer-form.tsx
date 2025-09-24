"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Form, FormField, FormMessage } from "@/components/ui/form"
import type { Gasometer, GasometerFormData } from "@/types"

const gasometerSchema = z.object({
  identificador: z.string().min(1, "Identificador é obrigatório").max(50, "Identificador muito longo"),
  descricao: z.string().min(1, "Descrição é obrigatória").max(200, "Descrição muito longa"),
  localizacao: z.string().min(1, "Localização é obrigatória").max(100, "Localização muito longa"),
  status: z.enum(["ativo", "inativo", "manutencao"], {
    required_error: "Status é obrigatório",
  }),
})

interface GasometerFormProps {
  gasometer?: Gasometer
  onSubmit: (data: GasometerFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "manutencao", label: "Manutenção" },
]

export function GasometerForm({ gasometer, onSubmit, onCancel, isLoading = false }: GasometerFormProps) {
  const form = useForm<GasometerFormData>({
    resolver: zodResolver(gasometerSchema),
    defaultValues: {
      identificador: gasometer?.identificador || "",
      descricao: gasometer?.descricao || "",
      localizacao: gasometer?.localizacao || "",
      status: gasometer?.status || "ativo",
    },
  })

  const handleSubmit = async (data: GasometerFormData) => {
    await onSubmit(data)
  }

  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormField>
        <Label htmlFor="identificador">Identificador *</Label>
        <Input id="identificador" placeholder="Ex: GM-001" {...form.register("identificador")} disabled={isLoading} />
        <FormMessage>{form.formState.errors.identificador?.message}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor="descricao">Descrição *</Label>
        <Input
          id="descricao"
          placeholder="Ex: Medidor principal do bloco A"
          {...form.register("descricao")}
          disabled={isLoading}
        />
        <FormMessage>{form.formState.errors.descricao?.message}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor="localizacao">Localização *</Label>
        <Input
          id="localizacao"
          placeholder="Ex: Bloco A - Andar 1"
          {...form.register("localizacao")}
          disabled={isLoading}
        />
        <FormMessage>{form.formState.errors.localizacao?.message}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor="status">Status *</Label>
        <Select id="status" {...form.register("status")} disabled={isLoading}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FormMessage>{form.formState.errors.status?.message}</FormMessage>
      </FormField>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </Form>
  )
}
