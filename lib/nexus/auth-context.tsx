"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import type { NexusUser, UserRole, RolePermissions } from "./types"
import { ROLE_PERMISSIONS } from "./types"
import { mockUsers, setCurrentUser } from "./mock-data"

// Storage key for session persistence
const AUTH_STORAGE_KEY = "nexus_auth_session"

interface AuthState {
  user: NexusUser | null
  isAuthenticated: boolean
  isLoading: boolean // true while rehydrating from storage
  permissions: RolePermissions | null
  login: (
    uniqueId: string,
    password: string,
    role: UserRole,
  ) => { success: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

/**
 * Persists user ID + role to sessionStorage so navigation
 * between pages never loses the authenticated session.
 */
function persistSession(user: NexusUser) {
  try {
    sessionStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ id: user.id, role: user.role }),
    )
  } catch {
    // SSR or storage quota -- silently ignore
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // ignore
  }
}

function rehydrateSession(): NexusUser | null {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const { id, role } = JSON.parse(raw)
    // Re-validate against mock database
    const found = mockUsers.find((u) => u.id === id && u.role === role)
    return found ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NexusUser | null>(null)
  const [isLoading, setIsLoading] = useState(true) // starts true while rehydrating

  // Rehydrate session from sessionStorage on first mount
  useEffect(() => {
    const saved = rehydrateSession()
    if (saved) {
      setUser(saved)
      setCurrentUser(saved)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    (
      uniqueId: string,
      password: string,
      role: UserRole,
    ): { success: boolean; error?: string } => {
      const found = mockUsers.find(
        (u) => u.id === uniqueId && u.password === password && u.role === role,
      )
      if (!found) {
        const byId = mockUsers.find((u) => u.id === uniqueId)
        if (!byId)
          return {
            success: false,
            error: "Invalid ID. This ID does not exist in the system.",
          }
        if (byId.role !== role)
          return {
            success: false,
            error: `This ID belongs to a ${byId.role} account, not ${role}.`,
          }
        return { success: false, error: "Incorrect password." }
      }
      setUser(found)
      setCurrentUser(found)
      persistSession(found) // persist so navigation never loses session
      return { success: true }
    },
    [],
  )

  const logout = useCallback(() => {
    setUser(null)
    clearSession()
  }, [])

  const permissions = user ? ROLE_PERMISSIONS[user.role] : null

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, permissions, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
