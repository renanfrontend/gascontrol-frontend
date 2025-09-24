"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"
import { formatDate, formatConsumption } from "@/lib/utils"
import type { ConsumptionData } from "@/types"

interface ConsumptionChartProps {
  data: ConsumptionData[]
  title?: string
  height?: number
}

export function ConsumptionChart({ data, title = "Consumo por Período", height = 300 }: ConsumptionChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      date: formatDate(item.date, "dd/MM"),
      consumoFormatted: formatConsumption(item.consumo),
    }))
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{`Data: ${label}`}</p>
          <p className="text-sm text-primary">{`Consumo: ${formatConsumption(payload[0].value)}`}</p>
          {payload[0].payload.gasometro && (
            <p className="text-xs text-muted-foreground">{`Gasômetro: ${payload[0].payload.gasometro}`}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(value) => `${value}m³`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="consumo"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
