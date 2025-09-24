"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormMessage } from "@/components/ui/form"
import { gasometersService } from "@/lib/services/gasometers"
import { readingsService } from "@/lib/services/readings"
import { validateConsumption, formatConsumption } from "@/lib/utils"
import type { Reading, ReadingFormData, Gasometer } from "@/types"
import { format } from "date-fns"

const readingSchema = z.object({
  gasometro: z.number({ required_error: "Gasômetro é obrigatório" }).min(1, "Selecione um gasômetro"),
  data_leitura: z.string().min(1, "Data da leitura é obrigatória"),
  consumo: z
    .number({ required_error: "Consumo é obrigatório" })
    .min(0, "Consumo não pode ser negativo")
    .max(999999, "Consumo muito alto"),
  observacao: z.string().optional(),
})

interface ReadingFormProps {
  reading?: Reading
  onSubmit: (data: ReadingFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  preselectedGasometer?: number
}

export function ReadingForm({
  reading,
  onSubmit,
  onCancel,
  isLoading = false,
  preselectedGasometer,
}: ReadingFormProps) {
  const [gasometers, setGasometers] = useState<Gasometer[]>([])
  const [previousReadings, setPreviousReadings] = useState<number[]>([])
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  const [isLoadingGasometers, setIsLoadingGasometers] = useState(true)

  const form = useForm<ReadingFormData>({
    resolver: zodResolver(readingSchema),
    defaultValues: {
      gasometro: reading?.gasometro || preselectedGasometer || 0,
      data_leitura: reading?.data_leitura
        ? format(new Date(reading.data_leitura), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      consumo: reading?.consumo || 0,
      observacao: reading?.observacao || "",
    },
  })

  const selectedGasometer = form.watch("gasometro")
  const consumoValue = form.watch("consumo")

  useEffect(() => {
    loadGasometers()
  }, [])

  useEffect(() => {
    if (selectedGasometer) {
      loadPreviousReadings(selectedGasometer)
    }
  }, [selectedGasometer])

  useEffect(() => {
    if (consumoValue && previousReadings.length > 0) {
      const validation = validateConsumption(consumoValue, previousReadings)
      setValidationWarnings(validation.warnings)
    } else {
      setValidationWarnings([])
    }
  }, [consumoValue, previousReadings])

  const loadGasometers = async () => {
    try {
      const response = await gasometersService.getGasometers(1, { status: "ativo" })
      setGasometers(response.results)
    } catch (error) {
      console.error("Erro ao carregar gasômetros:", error)
    } finally {
      setIsLoadingGasometers(false)
    }
  }

  const loadPreviousReadings = async (gasometroId: number) => {
    try {
      const readings = await readingsService.getReadingsByGasometer(gasometroId, 5)
      setPreviousReadings(readings.map((r) => r.consumo))
    } catch (error) {
      console.error("Erro ao carregar leituras anteriores:", error)
      setPreviousReadings([])
    }
  }

  const handleSubmit = async (data: ReadingFormData) => {
    // Validate future date
    const readingDate = new Date(data.data_leitura)
    const now = new Date()

    if (readingDate > now) {
      form.setError("data_leitura", {
        type: "manual",
        message: "Data da leitura não pode ser no futuro",
      })
      return
    }

    await onSubmit(data)
  }

  return (
    <Form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormField>
        <Label htmlFor="gasometro">Gasômetro *</Label>
        <Select
          id="gasometro"
          value={form.getValues("gasometro").toString()}
          onChange={(e) => form.setValue("gasometro", Number.parseInt(e.target.value))}
          disabled={isLoading || isLoadingGasometers}
        >
          <option value="0">Selecione um gasômetro</option>
          {gasometers.map((gasometer) => (
            <option key={gasometer.id} value={gasometer.id}>
              {gasometer.identificador} - {gasometer.descricao}
            </option>
          ))}
        </Select>
        <FormMessage>{form.formState.errors.gasometro?.message}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor="data_leitura">Data e Hora da Leitura *</Label>
        <Input
          id="data_leitura"
          type="datetime-local"
          {...form.register("data_leitura")}
          disabled={isLoading}
          max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
        />
        <FormMessage>{form.formState.errors.data_leitura?.message}</FormMessage>
      </FormField>

      <FormField>
        <Label htmlFor="consumo">Consumo (m³) *</Label>
        <Input
          id="consumo"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...form.register("consumo", { valueAsNumber: true })}
          disabled={isLoading}
        />
        <FormMessage>{form.formState.errors.consumo?.message}</FormMessage>

        {validationWarnings.length > 0 && (
          <div className="flex items-start space-x-2 mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Atenção:</p>
              <ul className="mt-1 space-y-1">
                {validationWarnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {previousReadings.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Últimas leituras: {previousReadings.map((r) => formatConsumption(r)).join(", ")}</p>
          </div>
        )}
      </FormField>

      <FormField>
        <Label htmlFor="observacao">Observações</Label>
        <Textarea
          id="observacao"
          placeholder="Observações sobre a leitura (opcional)"
          {...form.register("observacao")}
          disabled={isLoading}
          rows={3}
        />
        <FormMessage>{form.formState.errors.observacao?.message}</FormMessage>
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
            "Salvar Leitura"
          )}
        </Button>
      </div>
    </Form>
  )
}
