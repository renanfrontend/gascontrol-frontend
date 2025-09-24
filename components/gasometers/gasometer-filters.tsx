"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { debounce } from "@/lib/utils"
import type { GasometerFilter } from "@/types"

interface GasometerFiltersProps {
  onFilterChange: (filter: GasometerFilter) => void
  locations: string[]
  initialFilter?: GasometerFilter
}

const statusOptions = [
  { value: "", label: "Todos os status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "manutencao", label: "Manutenção" },
]

export function GasometerFilters({ onFilterChange, locations, initialFilter }: GasometerFiltersProps) {
  const [filters, setFilters] = useState<GasometerFilter>({
    search: initialFilter?.search || "",
    status: initialFilter?.status || "",
    localizacao: initialFilter?.localizacao || "",
  })

  const [searchValue, setSearchValue] = useState(filters.search || "")

  // Debounced search
  const debouncedSearch = debounce((value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }, 500)

  useEffect(() => {
    debouncedSearch(searchValue)
  }, [searchValue, debouncedSearch])

  const handleFilterChange = (key: keyof GasometerFilter, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = { search: "", status: "", localizacao: "" }
    setFilters(clearedFilters)
    setSearchValue("")
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = filters.search || filters.status || filters.localizacao

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por identificador, descrição..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select value={filters.localizacao} onChange={(e) => handleFilterChange("localizacao", e.target.value)}>
            <option value="">Todas as localizações</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
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

      {hasActiveFilters && (
        <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {filters.search && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Busca: "{filters.search}"</span>
          )}
          {filters.status && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              Status: {statusOptions.find((s) => s.value === filters.status)?.label}
            </span>
          )}
          {filters.localizacao && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              Localização: {filters.localizacao}
            </span>
          )}
        </div>
      )}
    </Card>
  )
}
