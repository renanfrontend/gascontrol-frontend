"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { useAuthStore } from "@/store/auth"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router, checkAuth])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
