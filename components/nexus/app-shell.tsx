"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/nexus/auth-context"
import type { RolePermissions, UserRole } from "@/lib/nexus/types"
import {
  Zap,
  GraduationCap,
  Mail,
  ShoppingBag,
  Compass,
  Car,
  Menu,
  LogOut,
  Utensils,
  Package,
  LayoutDashboard,
  Megaphone,
  User,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItem {
  name: string
  href: string
  icon: typeof Zap
  description: string
  /** If set, user must have this permission to see the link */
  permissionKey?: keyof RolePermissions
  /** If set, only these roles see this link */
  roles?: UserRole[]
}

/**
 * Navigation items -- role/permission filtered at render time.
 * Faculty-specific routes have `roles: ["faculty", "admin"]`.
 * Student-specific routes use permission keys.
 * No route triggers re-authentication -- that's handled globally by AuthGateway.
 */
const allNavigation: NavItem[] = [
  // SHARED: everyone sees the main dashboard
  {
    name: "Right Now",
    href: "/",
    icon: Zap,
    description: "Your daily pulse",
    roles: ["student"],
  },
  // FACULTY-ONLY routes
  {
    name: "Faculty Hub",
    href: "/faculty",
    icon: LayoutDashboard,
    description: "Faculty control panel",
    roles: ["faculty"],
  },
  // ADMIN sees both
  {
    name: "Dashboard",
    href: "/",
    icon: Zap,
    description: "System overview",
    roles: ["admin"],
  },
  {
    name: "Faculty Panel",
    href: "/faculty",
    icon: LayoutDashboard,
    description: "Faculty tools",
    roles: ["admin"],
  },
  // STUDENT modules with permission gates
  {
    name: "Mail",
    href: "/mail",
    icon: Mail,
    description: "AI-summarized emails",
  },
  {
    name: "Academic",
    href: "/academic",
    icon: GraduationCap,
    description: "Grades & study plans",
    permissionKey: "viewAcademic",
  },
  {
    name: "Mess",
    href: "/mess",
    icon: Utensils,
    description: "Daily, weekly & monthly menus",
    permissionKey: "viewMessMenu",
  },
  {
    name: "Exchange",
    href: "/exchange",
    icon: ShoppingBag,
    description: "Lost & found items",
    permissionKey: "useLostFound",
  },
  {
    name: "Resale Hub",
    href: "/resale",
    icon: Package,
    description: "Student marketplace",
    permissionKey: "useResaleHub",
  },
  {
    name: "Explore",
    href: "/explore",
    icon: Compass,
    description: "Campus map & discover",
    permissionKey: "useExplorer",
  },
  {
    name: "Travel",
    href: "/travel",
    icon: Car,
    description: "Shared rides",
    permissionKey: "useTravelSharing",
  },
  {
    name: "Beyond Hub",
    href: "/beyond",
    icon: Sparkles,
    description: "Innovation modules",
  },
]

/**
 * Filter navigation based on user role and permissions.
 * This controls VISIBILITY only -- never re-authenticates.
 */
function useFilteredNav() {
  const { user, permissions } = useAuth()
  if (!user || !permissions) return []
  return allNavigation.filter((item) => {
    // If role-locked, check role
    if (item.roles && !item.roles.includes(user.role)) return false
    // If permission-locked, check permission
    if (item.permissionKey && !permissions[item.permissionKey]) return false
    return true
  })
}

function NexusLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-nexus-gold/15 nexus-glow">
        <Zap className="h-4 w-4 text-nexus-gold" />
      </div>
      <div>
        <span className="font-display text-sm font-bold tracking-wider text-foreground">
          NEXUS
        </span>
      </div>
    </div>
  )
}

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem
  isActive: boolean
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
        isActive
          ? "bg-nexus-gold/10 text-nexus-gold nexus-border-glow"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive
            ? "text-nexus-gold"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      <span>{item.name}</span>
    </Link>
  )
}

function DesktopSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const filteredNav = useFilteredNav()

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-14 items-center border-b border-border px-4">
        <NexusLogo />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <p className="mb-1 px-3 font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Modules
        </p>
        {filteredNav.map((item) => (
          <NavLink
            key={item.href + item.name}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-border p-3">
        {user && (
          <div className="flex flex-col gap-2">
            <div className="rounded-lg bg-secondary/50 p-3 nexus-shimmer">
              <p className="font-display text-[9px] font-semibold uppercase tracking-[0.2em] text-nexus-gold/70">
                {user.role}
              </p>
              <p className="mt-1 truncate text-xs font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {user.id}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const filteredNav = useFilteredNav()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
      <NexusLogo />

      <div className="flex items-center gap-2">
        {user && (
          <span className="rounded-full bg-nexus-gold/10 px-2.5 py-0.5 font-display text-[9px] font-semibold uppercase tracking-wider text-nexus-gold">
            {user.role}
          </span>
        )}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-card p-0">
            <div className="flex h-14 items-center border-b border-border px-4">
              <NexusLogo />
            </div>
            <nav className="flex flex-col gap-1 p-3">
              {filteredNav.map((item) => (
                <NavLink
                  key={item.href + item.name}
                  item={item}
                  isActive={pathname === item.href}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
            {user && (
              <div className="border-t border-border p-3">
                <p className="truncate text-xs font-medium text-foreground">
                  {user.name}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="mt-2 w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

function BottomNav() {
  const pathname = usePathname()
  const filteredNav = useFilteredNav()

  // Show first 5 items in bottom nav
  const bottomItems = filteredNav.slice(0, 5)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card/95 px-2 py-1 backdrop-blur-md lg:hidden">
      {bottomItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href + item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors",
              isActive ? "text-nexus-gold" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}

/**
 * AppShell -- wraps all dashboard pages with sidebar, mobile nav, and bottom nav.
 * Auth is handled GLOBALLY by AuthGateway in root layout.
 * This shell only handles navigation -- NEVER triggers re-authentication.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col bg-background lg:flex-row">
      <DesktopSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileNav />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
