"use client"

import { useState } from "react"
import { Calendar, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import type { DateFilter } from "@/types"

interface DateFilterProps {
  onFilterChange: (filter: DateFilter) => void
  initialFilter?: DateFilter
}

const presetRanges = [
  { label: "Últimos 7 dias", value: "7d" },
  { label: "Últimos 30 dias", value: "30d" },
  { label: "Este mês", value: "month" },
  { label: "Personalizado", value: "custom" },
]

function DateFilterComponent({ onFilterChange, initialFilter }: DateFilterProps) {
  const [selectedRange, setSelectedRange] = useState("30d")
  const [customDates, setCustomDates] = useState({
    start_date: initialFilter?.start_date || "",
    end_date: initialFilter?.end_date || "",
  })
  const [showCustom, setShowCustom] = useState(false)

  const handleRangeChange = (range: string) => {
    setSelectedRange(range)
    setShowCustom(range === "custom")

    if (range !== "custom") {
      let filter: DateFilter = {}

      switch (range) {
        case "7d":
          filter = {
            start_date: format(subDays(new Date(), 7), "yyyy-MM-dd"),
            end_date: format(new Date(), "yyyy-MM-dd"),
          }
          break
        case "30d":
          filter = {
            start_date: format(subDays(new Date(), 30), "yyyy-MM-dd"),
            end_date: format(new Date(), "yyyy-MM-dd"),
          }
          break
        case "month":
          filter = {
            start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
            end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
          }
          break
      }

      onFilterChange(filter)
    }
  }

  const handleCustomDateChange = (field: "start_date" | "end_date", value: string) => {
    const newDates = { ...customDates, [field]: value }
    setCustomDates(newDates)

    if (newDates.start_date && newDates.end_date) {
      onFilterChange(newDates)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Período:</Label>
        </div>

        <Select value={selectedRange} onChange={(e) => handleRangeChange(e.target.value)}>
          {presetRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </Select>

        {showCustom && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={customDates.start_date}
                onChange={(e) => handleCustomDateChange("start_date", e.target.value)}
                className="w-auto"
              />
            </div>
            <span className="text-muted-foreground">até</span>
            <Input
              type="date"
              value={customDates.end_date}
              onChange={(e) => handleCustomDateChange("end_date", e.target.value)}
              className="w-auto"
            />
          </div>
        )}
      </div>
    </Card>
  )
}

export { DateFilterComponent as DateFilter }
