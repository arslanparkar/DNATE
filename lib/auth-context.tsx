"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi } from "./api"

type User = {
  id: string
  name: string
  email: string
  role?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      refreshUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const refreshUser = async () => {
    try {
      const { user: userData } = await authApi.getMe()
      setUser(userData)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      // If token is invalid, clear it
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const { token: newToken, user: userData } = await authApi.login({ email, password })
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setUser(userData)
  }

  const register = async (name: string, email: string, password: string) => {
    const { token: newToken, user: userData } = await authApi.register({ name, email, password })
    localStorage.setItem("token", newToken)
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
