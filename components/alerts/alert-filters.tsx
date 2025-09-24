"use client"

import { useState, useEffect } from "react"
import { Filter, X } from "lucide-react"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { gasometersService } from "@/lib/services/gasometers"
import type { AlertFilter, Gasometer } from "@/types"

interface AlertFiltersProps {
  onFilterChange: (filter: AlertFilter) => void
  initialFilter?: AlertFilter
}

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "novo", label: "Novo" },
  { value: "em_analise", label: "Em Análise" },
  { value: "resolvido", label: "Resolvido" },
]

const tipoOptions = [
  { value: "", label: "Todos os tipos" },
  { value: "pico_consumo", label: "Pico de Consumo" },
  { value: "medidor_inativo", label: "Medidor Inativo" },
  { value: "falha_leitura", label: "Falha de Leitura" },
  { value: "consumo_zero", label: "Consumo Zero" },
]

export function AlertFilters({ onFilterChange, initialFilter }: AlertFiltersProps) {
  const [gasometers, setGasometers] = useState<Gasometer[]>([])
  const [filters, setFilters] = useState<AlertFilter>({
    status: initialFilter?.status || "",
    tipo: initialFilter?.tipo || "",
    gasometro: initialFilter?.gasometro || undefined,
  })

  useEffect(() => {
    loadGasometers()
  }, [])

  const loadGasometers = async () => {
    try {
      const response = await gasometersService.getGasometers(1, {})
      setGasometers(response.results)
    } catch (error) {
      console.error("Erro ao carregar gasômetros:", error)
    }
  }

  const handleFilterChange = (key: keyof AlertFilter, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: AlertFilter = { status: "", tipo: "", gasometro: undefined }
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = filters.status || filters.tipo || filters.gasometro

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Filtros:</Label>
          </div>

          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <Select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select value={filters.tipo} onChange={(e) => handleFilterChange("tipo", e.target.value)}>
              {tipoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              value={filters.gasometro?.toString() || ""}
              onChange={(e) =>
                handleFilterChange("gasometro", e.target.value ? Number.parseInt(e.target.value) : undefined)
              }
            >
              <option value="">Todos os gasômetros</option>
              {gasometers.map((gasometer) => (
                <option key={gasometer.id} value={gasometer.id}>
                  {gasometer.identificador} - {gasometer.descricao}
                </option>
              ))}
            </Select>

            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2 pt-3 border-t">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {filters.status && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Status: {statusOptions.find((s) => s.value === filters.status)?.label}
              </span>
            )}
            {filters.tipo && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Tipo: {tipoOptions.find((t) => t.value === filters.tipo)?.label}
              </span>
            )}
            {filters.gasometro && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Gasômetro: {gasometers.find((g) => g.id === filters.gasometro)?.identificador}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
