"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormField, FormMessage } from "@/components/ui/form"
import { useAuthStore } from "@/store/auth"
import type { LoginCredentials } from "@/types"

const loginSchema = z.object({
  username: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login, isLoading } = useAuthStore()

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginCredentials) => {
    const success = await login(data)
    if (success) {
      router.push("/dashboard")
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-balance">Bem-vindo ao GasControl</h1>
        <p className="mt-2 text-muted-foreground text-pretty">
          Faça login para acessar o sistema de gerenciamento de gasômetros
        </p>
      </div>

      <Form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField>
          <Label htmlFor="username">Nome de usuário</Label>
          <Input
            id="username"
            type="text"
            placeholder="Digite seu nome de usuário"
            {...form.register("username")}
            disabled={isLoading}
          />
          <FormMessage>{form.formState.errors.username?.message}</FormMessage>
        </FormField>

        <FormField>
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              {...form.register("password")}
              disabled={isLoading}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <FormMessage>{form.formState.errors.password?.message}</FormMessage>
        </FormField>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        <p>Usuário de teste: admin</p>
        <p>Senha de teste: admin123</p>
      </div>
    </div>
  )
}
