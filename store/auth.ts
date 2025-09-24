import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, LoginCredentials } from "@/types"
import { toast } from "react-hot-toast"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
}

const mockUser: User = {
  id: 1,
  username: "admin",
  email: "admin@gascontrol.com",
  first_name: "Admin",
  last_name: "User",
  is_staff: true,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })

        await new Promise((resolve) => setTimeout(resolve, 1000))

        try {
          if (
            (credentials.username === "admin" && credentials.password === "admin123") ||
            (credentials.username.length > 0 && credentials.password.length > 0)
          ) {
            const mockTokens = {
              access: "mock-access-token-" + Date.now(),
              refresh: "mock-refresh-token-" + Date.now(),
            }

            localStorage.setItem("access_token", mockTokens.access)
            localStorage.setItem("refresh_token", mockTokens.refresh)
            localStorage.setItem("user", JSON.stringify(mockUser))

            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
            })

            toast.success("Login realizado com sucesso!")
            return true
          } else {
            throw new Error("Credenciais inválidas")
          }
        } catch (error: any) {
          set({ isLoading: false })
          toast.error("Erro ao fazer login: " + error.message)
          return false
        }
      },

      logout: () => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user")
        set({
          user: null,
          isAuthenticated: false,
        })
        toast.success("Logout realizado com sucesso!")
      },

      checkAuth: () => {
        const token = localStorage.getItem("access_token")
        const userStr = localStorage.getItem("user")

        if (token && userStr) {
          try {
            const parsedUser = JSON.parse(userStr)
            set({
              user: parsedUser,
              isAuthenticated: true,
            })
          } catch {
            get().logout()
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
