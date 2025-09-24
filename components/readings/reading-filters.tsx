"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { debounce } from "@/lib/utils"
import { gasometersService } from "@/lib/services/gasometers"
import type { ReadingFilter, Gasometer } from "@/types"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"

interface ReadingFiltersProps {
  onFilterChange: (filter: ReadingFilter) => void
  initialFilter?: ReadingFilter
}

const presetRanges = [
  { label: "Últimos 7 dias", value: "7d" },
  { label: "Últimos 30 dias", value: "30d" },
  { label: "Este mês", value: "month" },
  { label: "Personalizado", value: "custom" },
]

export function ReadingFilters({ onFilterChange, initialFilter }: ReadingFiltersProps) {
  const [gasometers, setGasometers] = useState<Gasometer[]>([])
  const [filters, setFilters] = useState<ReadingFilter>({
    search: initialFilter?.search || "",
    gasometro: initialFilter?.gasometro || undefined,
    start_date: initialFilter?.start_date || "",
    end_date: initialFilter?.end_date || "",
  })
  const [searchValue, setSearchValue] = useState(filters.search || "")
  const [selectedRange, setSelectedRange] = useState("30d")
  const [showCustomDates, setShowCustomDates] = useState(false)

  // Debounced search
  const debouncedSearch = debounce((value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }, 500)

  useEffect(() => {
    loadGasometers()
    // Set default date range
    handleRangeChange("30d")
  }, [])

  useEffect(() => {
    debouncedSearch(searchValue)
  }, [searchValue, debouncedSearch])

  const loadGasometers = async () => {
    try {
      const response = await gasometersService.getGasometers(1, { status: "ativo" })
      setGasometers(response.results)
    } catch (error) {
      console.error("Erro ao carregar gasômetros:", error)
    }
  }

  const handleFilterChange = (key: keyof ReadingFilter, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleRangeChange = (range: string) => {
    setSelectedRange(range)
    setShowCustomDates(range === "custom")

    if (range !== "custom") {
      let dateFilter: { start_date: string; end_date: string } = { start_date: "", end_date: "" }

      switch (range) {
        case "7d":
          dateFilter = {
            start_date: format(subDays(new Date(), 7), "yyyy-MM-dd"),
            end_date: format(new Date(), "yyyy-MM-dd"),
          }
          break
        case "30d":
          dateFilter = {
            start_date: format(subDays(new Date(), 30), "yyyy-MM-dd"),
            end_date: format(new Date(), "yyyy-MM-dd"),
          }
          break
        case "month":
          dateFilter = {
            start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
            end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
          }
          break
      }

      const newFilters = { ...filters, ...dateFilter }
      setFilters(newFilters)
      onFilterChange(newFilters)
    }
  }

  const handleCustomDateChange = (field: "start_date" | "end_date", value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: ReadingFilter = { search: "", gasometro: undefined, start_date: "", end_date: "" }
    setFilters(clearedFilters)
    setSearchValue("")
    setSelectedRange("")
    setShowCustomDates(false)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = filters.search || filters.gasometro || filters.start_date || filters.end_date

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Search and Gasometer Filter */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por observações..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="md:w-64">
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
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Período:</Label>
          </div>

          <Select value={selectedRange} onChange={(e) => handleRangeChange(e.target.value)}>
            <option value="">Selecione o período</option>
            {presetRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </Select>

          {showCustomDates && (
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={filters.start_date}
                onChange={(e) => handleCustomDateChange("start_date", e.target.value)}
                className="w-auto"
              />
              <span className="text-muted-foreground">até</span>
              <Input
                type="date"
                value={filters.end_date}
                onChange={(e) => handleCustomDateChange("end_date", e.target.value)}
                className="w-auto"
              />
            </div>
          )}

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center space-x-2 pt-3 border-t">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {filters.search && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Busca: "{filters.search}"</span>
            )}
            {filters.gasometro && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Gasômetro: {gasometers.find((g) => g.id === filters.gasometro)?.identificador}
              </span>
            )}
            {filters.start_date && filters.end_date && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Período: {filters.start_date} até {filters.end_date}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
