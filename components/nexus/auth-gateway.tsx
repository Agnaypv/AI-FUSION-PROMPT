"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/nexus/auth-context"
import type { UserRole } from "@/lib/nexus/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  GraduationCap,
  BookOpen,
  Shield,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react"

const roleConfigs: {
  role: UserRole
  label: string
  icon: typeof GraduationCap
  description: string
  demoId: string
  demoPass: string
}[] = [
  {
    role: "student",
    label: "Student",
    icon: GraduationCap,
    description: "Access your dashboard, classes, and campus life",
    demoId: "STU2026001",
    demoPass: "nexus123",
  },
  {
    role: "faculty",
    label: "Faculty",
    icon: BookOpen,
    description: "Manage courses, announcements, and mess menus",
    demoId: "FAC2026001",
    demoPass: "faculty123",
  },
  {
    role: "admin",
    label: "Institute Admin",
    icon: Shield,
    description: "Full system control and analytics",
    demoId: "ADM2026001",
    demoPass: "admin123",
  },
]

function LightningBolt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
    </svg>
  )
}

/**
 * AUTH GATEWAY -- single global guard at root layout level.
 * Shows loading spinner while rehydrating session from sessionStorage.
 * Once authenticated, renders children with ZERO further auth checks.
 * No module or page should ever redirect to login again.
 */
export function AuthGateway({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  // While rehydrating session from sessionStorage, show loading splash
  // This prevents the login screen from flashing on page navigation
  if (isLoading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background nexus-cosmic-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-nexus-gold/20 bg-card nexus-glow-strong">
            <Zap className="h-8 w-8 animate-pulse text-nexus-gold" />
          </div>
          <p className="font-display text-sm tracking-widest text-muted-foreground">
            LOADING NEXUS...
          </p>
        </div>
      </div>
    )
  }

  // Session is valid -- render the app, no further auth gates anywhere
  if (isAuthenticated) {
    return <>{children}</>
  }

  // No session -- show login screen (only time login is ever shown)
  return <LoginScreen />
}

function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [uniqueId, setUniqueId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const handleLogin = () => {
    if (!selectedRole || !uniqueId || !password) {
      setError("All fields are required.")
      return
    }
    setIsSubmitting(true)
    setError("")

    // Small delay for dramatic effect
    setTimeout(() => {
      const result = login(uniqueId.trim(), password, selectedRole)
      if (!result.success) {
        setError(result.error || "Login failed.")
      }
      // On success, AuthProvider state updates, AuthGateway auto-renders children
      setIsSubmitting(false)
    }, 600)
  }

  const handleDemoFill = (config: (typeof roleConfigs)[0]) => {
    setSelectedRole(config.role)
    setUniqueId(config.demoId)
    setPassword(config.demoPass)
    setError("")
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background nexus-cosmic-bg">
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nexus-gold/[0.04] blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-nexus-gold/[0.03] blur-[80px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-nexus-gold/20 bg-card nexus-glow-strong">
            <Zap className="h-8 w-8 text-nexus-gold" />
            <LightningBolt className="absolute -right-1 -top-1 h-4 w-4 text-nexus-lightning nexus-lightning" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-wider text-foreground">
            NEXUS
          </h1>
          <p className="mt-1 text-sm tracking-widest text-muted-foreground">
            YOUR CAMPUS, ONE INTELLIGENCE
          </p>
        </div>

        {/* Role Selection */}
        {!selectedRole ? (
          <div className="w-full nexus-fade-in">
            <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
              Select your access level
            </p>
            <div className="flex flex-col gap-3">
              {roleConfigs.map((config) => {
                const Icon = config.icon
                return (
                  <button
                    key={config.role}
                    type="button"
                    onClick={() => handleDemoFill(config)}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-nexus-gold/30 hover:shadow-[0_0_20px_-6px_hsl(var(--nexus-gold)/0.2)]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary transition-colors group-hover:border-nexus-gold/30 group-hover:bg-nexus-gold/10">
                      <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-nexus-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {config.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {config.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="mt-6 text-center text-[10px] text-muted-foreground/60">
              Demo mode -- credentials auto-filled on selection
            </p>
          </div>
        ) : (
          /* Login Form */
          <div className="w-full nexus-fade-in">
            <button
              type="button"
              onClick={() => {
                setSelectedRole(null)
                setError("")
                setUniqueId("")
                setPassword("")
              }}
              className="mb-4 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              &larr; Back to role selection
            </button>

            <div className="rounded-xl border border-border bg-card p-6 nexus-border-glow">
              {/* Role indicator */}
              <div className="mb-5 flex items-center gap-3">
                {(() => {
                  const config = roleConfigs.find(
                    (r) => r.role === selectedRole,
                  )
                  const Icon = config?.icon || GraduationCap
                  return (
                    <>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-nexus-gold/10">
                        <Icon className="h-4 w-4 text-nexus-gold" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {config?.label} Login
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Authenticated access only
                        </p>
                      </div>
                    </>
                  )
                })()}
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="uniqueId"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Unique ID
                  </label>
                  <Input
                    id="uniqueId"
                    value={uniqueId}
                    onChange={(e) => {
                      setUniqueId(e.target.value)
                      setError("")
                    }}
                    placeholder={
                      selectedRole === "student"
                        ? "STU2026001"
                        : selectedRole === "faculty"
                          ? "FAC2026001"
                          : "ADM2026001"
                    }
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-medium text-muted-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError("")
                      }}
                      placeholder="Enter password"
                      className="pr-10 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin()
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleLogin}
                  disabled={isSubmitting}
                  className="mt-1 w-full bg-nexus-gold font-semibold tracking-wide text-background hover:bg-nexus-lightning"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 animate-pulse" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Access NEXUS
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Demo credentials hint */}
            <div className="mt-4 rounded-lg border border-border bg-secondary/50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Demo Credentials
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {roleConfigs.map((c) => (
                  <button
                    key={c.role}
                    type="button"
                    onClick={() => handleDemoFill(c)}
                    className={cn(
                      "flex items-center justify-between rounded px-2 py-1 text-left text-[11px] transition-colors hover:bg-secondary",
                      selectedRole === c.role && "bg-secondary",
                    )}
                  >
                    <span className="font-medium text-foreground">
                      {c.label}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {c.demoId}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
