"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { type AuthState, type User, MOCK_USERS, DEFAULT_ADMIN_CREDENTIALS } from "@/constants/auth"

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Check credentials
        if (email === DEFAULT_ADMIN_CREDENTIALS.email && password === DEFAULT_ADMIN_CREDENTIALS.password) {
          const user = MOCK_USERS.find((u) => u.email === email)
          if (user) {
            set({
              user: { ...user, lastLogin: new Date().toISOString() },
              isAuthenticated: true,
              isLoading: false,
            })
            return true
          }
        }

        set({ isLoading: false })
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        localStorage.removeItem("auth-storage")
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
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
