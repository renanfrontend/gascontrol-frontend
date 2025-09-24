import { validateConsumption, formatConsumption, formatDate, exportToCSV } from "@/lib/utils"
import { jest } from "@jest/globals"

describe("Utils", () => {
  describe("validateConsumption", () => {
    it("should reject negative values", () => {
      const result = validateConsumption(-10)
      expect(result.isValid).toBe(false)
      expect(result.warnings).toContain("Consumo não pode ser negativo")
    })

    it("should accept positive values", () => {
      const result = validateConsumption(50)
      expect(result.isValid).toBe(true)
      expect(result.warnings).toHaveLength(0)
    })

    it("should warn about high consumption compared to average", () => {
      const previousReadings = [10, 12, 11, 9, 13] // average = 11
      const result = validateConsumption(25, previousReadings) // 227% of average

      expect(result.isValid).toBe(true)
      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings[0]).toContain("Consumo muito alto")
    })

    it("should not warn about normal consumption", () => {
      const previousReadings = [10, 12, 11, 9, 13] // average = 11
      const result = validateConsumption(15, previousReadings) // 136% of average

      expect(result.isValid).toBe(true)
      expect(result.warnings).toHaveLength(0)
    })
  })

  describe("formatConsumption", () => {
    it("should format consumption with m³ unit", () => {
      expect(formatConsumption(12.34)).toBe("12,34 m³")
      expect(formatConsumption(0)).toBe("0,00 m³")
      expect(formatConsumption(1000.5)).toBe("1.000,50 m³")
    })
  })

  describe("formatDate", () => {
    it("should format ISO date string", () => {
      const result = formatDate("2023-12-25T10:30:00Z")
      expect(result).toBe("25/12/2023")
    })

    it("should handle invalid dates", () => {
      const result = formatDate("invalid-date")
      expect(result).toBe("Data inválida")
    })

    it("should format with custom format", () => {
      const result = formatDate("2023-12-25T10:30:00Z", "dd/MM/yyyy HH:mm")
      expect(result).toBe("25/12/2023 10:30")
    })
  })

  describe("exportToCSV", () => {
    // Mock DOM methods
    const mockClick = jest.fn()
    const mockAppendChild = jest.fn()
    const mockRemoveChild = jest.fn()
    const mockCreateElement = jest.fn(() => ({
      click: mockClick,
      setAttribute: jest.fn(),
      style: {},
    }))
    const mockCreateObjectURL = jest.fn(() => "blob:url")
    const mockRevokeObjectURL = jest.fn()

    beforeEach(() => {
      global.document.createElement = mockCreateElement
      global.document.body.appendChild = mockAppendChild
      global.document.body.removeChild = mockRemoveChild
      global.URL.createObjectURL = mockCreateObjectURL
      global.URL.revokeObjectURL = mockRevokeObjectURL
      global.Blob = jest.fn()
    })

    it("should not export empty data", () => {
      exportToCSV([], "test")
      expect(mockCreateElement).not.toHaveBeenCalled()
    })

    it("should export data with headers", () => {
      const data = [
        { name: "Test", value: 123 },
        { name: "Test2", value: 456 },
      ]

      exportToCSV(data, "test")

      expect(global.Blob).toHaveBeenCalledWith(["name,value\nTest,123\nTest2,456"], { type: "text/csv;charset=utf-8;" })
      expect(mockCreateElement).toHaveBeenCalledWith("a")
      expect(mockClick).toHaveBeenCalled()
    })
  })
})
