import { test, expect } from "@playwright/test"

test.describe("Reading Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route("**/api/auth/login/", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access: "mock-token",
          refresh: "mock-refresh-token",
          user: {
            id: 1,
            username: "admin",
            email: "admin@test.com",
            first_name: "Admin",
            last_name: "User",
          },
        }),
      })
    })

    await page.route("**/api/gasometers/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [
            {
              id: 1,
              identificador: "GM-001",
              descricao: "Medidor Principal",
              localizacao: "Bloco A",
              status: "ativo",
            },
          ],
          count: 1,
        }),
      })
    })

    await page.route("**/api/readings/by-gasometer/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: 1, consumo: 10.5 },
          { id: 2, consumo: 12.3 },
          { id: 3, consumo: 11.8 },
        ]),
      })
    })

    // Login first
    await page.goto("/login")
    await page.fill('[data-testid="username-input"]', "admin")
    await page.fill('[data-testid="password-input"]', "admin123")
    await page.click('[data-testid="login-button"]')

    // Wait for redirect to dashboard
    await page.waitForURL("/dashboard")
  })

  test("should complete reading registration flow", async ({ page }) => {
    // Navigate to readings page
    await page.goto("/readings")

    // Verify page loaded
    await expect(page.locator("h1")).toContainText("Leituras")

    // Click "Nova Leitura" button
    await page.click('button:has-text("Nova Leitura")')

    // Verify modal opened
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator("h3")).toContainText("Nova Leitura")

    // Verify required fields are visible
    await expect(page.locator('label:has-text("Gasômetro")')).toBeVisible()
    await expect(page.locator('label:has-text("Data e Hora da Leitura")')).toBeVisible()
    await expect(page.locator('label:has-text("Consumo")')).toBeVisible()

    // Try to submit empty form - should show validation errors
    await page.click('button:has-text("Salvar Leitura")')

    // Check for validation messages
    await expect(page.locator("text=Selecione um gasômetro")).toBeVisible()

    // Fill form with valid data
    await page.selectOption('select[id="gasometro"]', "1")
    await page.fill('input[id="data_leitura"]', "2023-12-01T10:30")
    await page.fill('input[id="consumo"]', "15.5")
    await page.fill('textarea[id="observacao"]', "Leitura mensal de dezembro")

    // Mock the create reading API call
    await page.route("**/api/readings/", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: 4,
            gasometro: 1,
            data_leitura: "2023-12-01T10:30:00Z",
            consumo: 15.5,
            observacao: "Leitura mensal de dezembro",
            created_at: "2023-12-01T10:35:00Z",
          }),
        })
      }
    })

    // Submit form
    await page.click('button:has-text("Salvar Leitura")')

    // Verify success (modal should close)
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()

    // Verify success message (toast)
    await expect(page.locator("text=Leitura registrada com sucesso!")).toBeVisible()
  })

  test("should validate negative consumption values", async ({ page }) => {
    await page.goto("/readings")
    await page.click('button:has-text("Nova Leitura")')

    // Fill form with negative consumption
    await page.selectOption('select[id="gasometro"]', "1")
    await page.fill('input[id="data_leitura"]', "2023-12-01T10:30")
    await page.fill('input[id="consumo"]', "-5")

    // Try to submit
    await page.click('button:has-text("Salvar Leitura")')

    // Should show validation error
    await expect(page.locator("text=Consumo não pode ser negativo")).toBeVisible()
  })

  test("should validate future dates", async ({ page }) => {
    await page.goto("/readings")
    await page.click('button:has-text("Nova Leitura")')

    // Get future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 1)
    const futureDateString = futureDate.toISOString().slice(0, 16)

    // Fill form with future date
    await page.selectOption('select[id="gasometro"]', "1")
    await page.fill('input[id="data_leitura"]', futureDateString)
    await page.fill('input[id="consumo"]', "10")

    // Try to submit
    await page.click('button:has-text("Salvar Leitura")')

    // Should show validation error
    await expect(page.locator("text=Data da leitura não pode ser no futuro")).toBeVisible()
  })

  test("should show consumption warnings for high values", async ({ page }) => {
    await page.goto("/readings")
    await page.click('button:has-text("Nova Leitura")')

    // Select gasometer (this will load previous readings)
    await page.selectOption('select[id="gasometro"]', "1")

    // Wait for previous readings to load
    await page.waitForTimeout(1000)

    // Fill with very high consumption (previous average is ~11.5, so 30 is >200%)
    await page.fill('input[id="consumo"]', "30")

    // Should show warning
    await expect(page.locator("text=Consumo muito alto")).toBeVisible()
    await expect(page.locator('[data-testid="consumption-warning"]')).toBeVisible()
  })
})
