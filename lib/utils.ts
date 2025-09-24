import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, formatStr = "dd/MM/yyyy"): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date
    if (!isValid(dateObj)) return "Data inválida"
    return format(dateObj, formatStr, { locale: ptBR })
  } catch {
    return "Data inválida"
  }
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, "dd/MM/yyyy HH:mm")
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatConsumption(value: number): string {
  return `${formatNumber(value)} m³`
}

export function validateConsumption(
  value: number,
  previousReadings: number[] = [],
): {
  isValid: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  if (value < 0) {
    return { isValid: false, warnings: ["Consumo não pode ser negativo"] }
  }

  if (previousReadings.length > 0) {
    const average = previousReadings.reduce((sum, reading) => sum + reading, 0) / previousReadings.length
    const threshold = average * 2 // 200% da média

    if (value > threshold) {
      warnings.push(`Consumo muito alto (${formatNumber((value / average) * 100)}% da média)`)
    }
  }

  return { isValid: true, warnings }
}

export function exportToCSV(data: any[], filename: string): void {
  if (!data.length) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          return typeof value === "string" && value.includes(",") ? `"${value}"` : value
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
