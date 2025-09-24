import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LoginForm } from "@/components/auth/login-form"
import { useAuthStore } from "@/store/auth"
import jest from "jest" // Import jest to declare it

// Mock the auth store
jest.mock("@/store/auth")
const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe("LoginForm", () => {
  const mockLogin = jest.fn()

  beforeEach(() => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders login form correctly", () => {
    render(<LoginForm />)

    expect(screen.getByText("Bem-vindo ao GasControl")).toBeInTheDocument()
    expect(screen.getByLabelText("Nome de usuário")).toBeInTheDocument()
    expect(screen.getByLabelText("Senha")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument()
  })

  it("shows validation errors for empty fields", async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole("button", { name: "Entrar" })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Nome de usuário é obrigatório")).toBeInTheDocument()
      expect(screen.getByText("Senha é obrigatória")).toBeInTheDocument()
    })
  })

  it("calls login function with correct credentials", async () => {
    mockLogin.mockResolvedValue(true)

    render(<LoginForm />)

    const usernameInput = screen.getByLabelText("Nome de usuário")
    const passwordInput = screen.getByLabelText("Senha")
    const submitButton = screen.getByRole("button", { name: "Entrar" })

    fireEvent.change(usernameInput, { target: { value: "admin" } })
    fireEvent.change(passwordInput, { target: { value: "password123" } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "admin",
        password: "password123",
      })
    })
  })

  it("shows loading state during login", () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
      checkAuth: jest.fn(),
    })

    render(<LoginForm />)

    expect(screen.getByText("Entrando...")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Entrando..." })).toBeDisabled()
  })

  it("toggles password visibility", () => {
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText("Senha") as HTMLInputElement
    const toggleButton = screen.getByRole("button", { name: "" }) // Eye icon button

    expect(passwordInput.type).toBe("password")

    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe("text")

    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe("password")
  })
})
