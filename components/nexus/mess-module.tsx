"use client"

import React, { useState, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/nexus/auth-context"
import type { MealSlot, MenuItem } from "@/lib/nexus/types"
import {
  Utensils,
  Users,
  Leaf,
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  CalendarDays,
  CalendarRange,
  Sun,
  Snowflake,
  Pencil,
  TrendingUp,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ============ EXTENDED MOCK DATA FOR WEEKLY/MONTHLY ============

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

type Season = "summer" | "winter" | "exam" | "regular"

const seasonConfig: Record<Season, { label: string; icon: typeof Sun; color: string; description: string }> = {
  summer: { label: "Summer", icon: Sun, color: "text-nexus-warn", description: "Light, hydrating meals with more fruits" },
  winter: { label: "Winter", icon: Snowflake, color: "text-nexus-info", description: "Warm, hearty meals with hot soups" },
  exam: { label: "Exam Season", icon: Zap, color: "text-nexus-gold", description: "Brain-boosting, energy-sustaining meals" },
  regular: { label: "Regular", icon: Calendar, color: "text-muted-foreground", description: "Standard balanced menu" },
}

function getCurrentSeason(): Season {
  const month = new Date().getMonth()
  // Feb is exam season for this college
  if (month === 1 || month === 2) return "exam"
  if (month >= 3 && month <= 6) return "summer"
  if (month >= 10 || month === 0) return "winter"
  return "regular"
}

// Generate a week of realistic meals
function generateWeeklyMenu(): Record<string, MealSlot[]> {
  const breakfastRotation: MenuItem[][] = [
    [{ name: "Masala Dosa", isVeg: true, nutritionTag: "carb", calories: 250 }, { name: "Sambar", isVeg: true, nutritionTag: "protein", calories: 120 }, { name: "Boiled Eggs", isVeg: false, nutritionTag: "protein", calories: 155 }],
    [{ name: "Poha", isVeg: true, nutritionTag: "carb", calories: 180 }, { name: "Upma", isVeg: true, nutritionTag: "carb", calories: 200 }, { name: "Banana", isVeg: true, nutritionTag: "fiber", calories: 105 }],
    [{ name: "Aloo Paratha", isVeg: true, nutritionTag: "carb", calories: 300 }, { name: "Curd", isVeg: true, nutritionTag: "light", calories: 98 }, { name: "Pickle", isVeg: true, nutritionTag: "light", calories: 20 }],
    [{ name: "Idli", isVeg: true, nutritionTag: "carb", calories: 150 }, { name: "Coconut Chutney", isVeg: true, nutritionTag: "light", calories: 80 }, { name: "Vada", isVeg: true, nutritionTag: "carb", calories: 180 }],
    [{ name: "Bread Omelette", isVeg: false, nutritionTag: "protein", calories: 280 }, { name: "Toast & Butter", isVeg: true, nutritionTag: "carb", calories: 180 }, { name: "Cornflakes", isVeg: true, nutritionTag: "carb", calories: 130 }],
    [{ name: "Chole Bhature", isVeg: true, nutritionTag: "protein", calories: 350 }, { name: "Lassi", isVeg: true, nutritionTag: "light", calories: 120 }],
    [{ name: "Puri Bhaji", isVeg: true, nutritionTag: "carb", calories: 320 }, { name: "Sweet Halwa", isVeg: true, nutritionTag: "carb", calories: 250 }],
  ]

  const lunchRotation: MenuItem[][] = [
    [{ name: "Jeera Rice", isVeg: true, calories: 210 }, { name: "Dal Tadka", isVeg: true, calories: 180 }, { name: "Chicken Curry", isVeg: false, calories: 290 }, { name: "Roti (2)", isVeg: true, calories: 200 }],
    [{ name: "Veg Biryani", isVeg: true, calories: 310 }, { name: "Raita", isVeg: true, calories: 80 }, { name: "Fish Fry", isVeg: false, calories: 250 }],
    [{ name: "Rajma Chawal", isVeg: true, calories: 340 }, { name: "Salad", isVeg: true, calories: 45 }, { name: "Paneer Tikka", isVeg: true, calories: 280 }],
    [{ name: "Curd Rice", isVeg: true, calories: 220 }, { name: "Sambar Rice", isVeg: true, calories: 260 }, { name: "Egg Curry", isVeg: false, calories: 220 }],
    [{ name: "Pulao", isVeg: true, calories: 240 }, { name: "Kadhi Pakora", isVeg: true, calories: 190 }, { name: "Mixed Veg", isVeg: true, calories: 140 }],
    [{ name: "Chicken Biryani", isVeg: false, calories: 380 }, { name: "Mirchi Ka Salan", isVeg: true, calories: 150 }, { name: "Raita", isVeg: true, calories: 80 }],
    [{ name: "Pav Bhaji", isVeg: true, calories: 320 }, { name: "Gulab Jamun", isVeg: true, calories: 180 }],
  ]

  const dinnerRotation: MenuItem[][] = [
    [{ name: "Fried Rice", isVeg: true, calories: 280 }, { name: "Manchurian", isVeg: true, calories: 250 }, { name: "Chapati (2)", isVeg: true, calories: 200 }],
    [{ name: "Dal Makhani", isVeg: true, calories: 260 }, { name: "Naan", isVeg: true, calories: 260 }, { name: "Butter Chicken", isVeg: false, calories: 340 }],
    [{ name: "Khichdi", isVeg: true, calories: 200 }, { name: "Papad", isVeg: true, calories: 50 }, { name: "Pickle", isVeg: true, calories: 20 }],
    [{ name: "Roti (2)", isVeg: true, calories: 200 }, { name: "Shahi Paneer", isVeg: true, calories: 300 }, { name: "Salad", isVeg: true, calories: 45 }],
    [{ name: "Paratha", isVeg: true, calories: 280 }, { name: "Raita", isVeg: true, calories: 80 }, { name: "Keema", isVeg: false, calories: 310 }],
    [{ name: "Pasta", isVeg: true, calories: 320 }, { name: "Garlic Bread", isVeg: true, calories: 200 }, { name: "Soup", isVeg: true, calories: 90 }],
    [{ name: "Poori", isVeg: true, calories: 280 }, { name: "Aloo Sabzi", isVeg: true, calories: 180 }, { name: "Kheer", isVeg: true, calories: 200 }],
  ]

  const crowds: ("low" | "medium" | "high")[] = ["medium", "high", "medium", "high", "medium", "low", "low"]

  const weekMenu: Record<string, MealSlot[]> = {}
  for (let d = 0; d < 7; d++) {
    weekMenu[DAYS[d]] = [
      { type: "breakfast", startTime: "07:30", endTime: "09:30", items: breakfastRotation[d], crowdLevel: crowds[d] },
      { type: "lunch", startTime: "12:00", endTime: "14:00", items: lunchRotation[d], crowdLevel: crowds[d] },
      { type: "snacks", startTime: "16:30", endTime: "18:00", items: [{ name: "Tea / Coffee", isVeg: true, calories: 40 }, { name: "Samosa", isVeg: true, calories: 130 }], crowdLevel: "low" as const },
      { type: "dinner", startTime: "19:30", endTime: "21:30", items: dinnerRotation[d], crowdLevel: crowds[(d + 1) % 7] },
    ]
  }
  return weekMenu
}

const weeklyMenu = generateWeeklyMenu()

// Trend data for AI insights
const trendData = [
  { dish: "Chicken Biryani", popularity: 94, trend: "up" as const },
  { dish: "Masala Dosa", popularity: 88, trend: "up" as const },
  { dish: "Paneer Butter Masala", popularity: 82, trend: "stable" as const },
  { dish: "Dal Tadka", popularity: 75, trend: "down" as const },
  { dish: "Chole Bhature", popularity: 71, trend: "up" as const },
]

type ViewMode = "daily" | "weekly" | "monthly"

const crowdColors = {
  low: "bg-nexus-success/10 text-nexus-success",
  medium: "bg-nexus-warn/10 text-nexus-warn",
  high: "bg-nexus-urgent/10 text-nexus-urgent",
}

// ============ COMPONENTS ============

function MealCard({ meal, isCurrent, defaultExpanded }: { meal: MealSlot; isCurrent: boolean; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false)
  const label = meal.type.charAt(0).toUpperCase() + meal.type.slice(1)

  return (
    <div className={cn("rounded-lg border transition-all", isCurrent ? "border-nexus-gold/30 bg-nexus-gold/[0.03]" : "border-border bg-card")}>
      <button type="button" onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", isCurrent ? "bg-nexus-gold/10" : "bg-secondary")}>
            <Utensils className={cn("h-4 w-4", isCurrent ? "text-nexus-gold" : "text-muted-foreground")} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{label}</span>
              {isCurrent && <span className="rounded-full bg-nexus-gold/10 px-1.5 py-0.5 font-display text-[9px] font-semibold uppercase tracking-wider text-nexus-gold">Now serving</span>}
            </div>
            <span className="text-xs text-muted-foreground">{meal.startTime} - {meal.endTime}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", crowdColors[meal.crowdLevel])}>
            <Users className="h-3 w-3" />
            {meal.crowdLevel}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border px-3 pb-3 pt-2">
          {meal.aiRecommendation && (
            <div className="mb-3 flex items-start gap-2 rounded-md bg-nexus-gold/5 p-2">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nexus-gold" />
              <p className="text-xs text-nexus-gold leading-relaxed">{meal.aiRecommendation}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {meal.items.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1">
                {item.isVeg ? <Leaf className="h-3 w-3 text-nexus-success" /> : <Flame className="h-3 w-3 text-nexus-urgent" />}
                <span className="text-xs text-foreground">{item.name}</span>
                {item.calories && <span className="text-[10px] text-muted-foreground">{item.calories}cal</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DailyView() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => { setNow(new Date()) }, [])

  if (!now) {
    return <div className="flex flex-col gap-2">{[1,2,3,4].map(i => <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />)}</div>
  }

  const today = DAYS[now.getDay()]
  const meals = weeklyMenu[today] || []
  const hour = now.getHours()

  const getCurrentMealType = () => {
    if (hour >= 7 && hour < 10) return "breakfast"
    if (hour >= 12 && hour < 14) return "lunch"
    if (hour >= 16 && hour < 18) return "snacks"
    if (hour >= 19 && hour < 22) return "dinner"
    return null
  }
  const currentType = getCurrentMealType()

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">{today}, {now.toLocaleDateString("en-US", { month: "long", day: "numeric" })}</p>
      {meals.map((meal) => (
        <MealCard key={meal.type} meal={meal} isCurrent={currentType === meal.type} defaultExpanded={currentType === meal.type} />
      ))}
    </div>
  )
}

function WeeklyView() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const today = mounted ? DAYS[new Date().getDay()] : ""

  return (
    <div className="flex flex-col gap-4">
      {DAYS.map((day) => (
        <div key={day}>
          <div className="mb-2 flex items-center gap-2">
            <h3 className={cn("font-display text-xs font-semibold uppercase tracking-wider", day === today ? "text-nexus-gold" : "text-muted-foreground")}>
              {day}
            </h3>
            {day === today && <span className="rounded-full bg-nexus-gold/10 px-1.5 py-0.5 text-[9px] font-semibold text-nexus-gold">Today</span>}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {weeklyMenu[day].map((meal) => {
              const label = meal.type.charAt(0).toUpperCase() + meal.type.slice(1)
              return (
                <div key={meal.type} className="rounded-lg border border-border bg-card p-3">
                  <p className="mb-1 text-[10px] font-semibold uppercase text-muted-foreground">{label}</p>
                  <p className="text-[10px] text-muted-foreground">{meal.startTime} - {meal.endTime}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {meal.items.slice(0, 3).map((item) => (
                      <span key={item.name} className="flex items-center gap-1 text-[10px] text-foreground">
                        {item.isVeg ? <Leaf className="h-2.5 w-2.5 text-nexus-success" /> : <Flame className="h-2.5 w-2.5 text-nexus-urgent" />}
                        {item.name}
                      </span>
                    ))}
                    {meal.items.length > 3 && <span className="text-[10px] text-muted-foreground">+{meal.items.length - 3} more</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function MonthlyView() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => { setNow(new Date()) }, [])

  if (!now) {
    return <div className="h-48 animate-pulse rounded-lg bg-secondary" />
  }

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay()
  const today = now.getDate()

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">{MONTHS[now.getMonth()]} {now.getFullYear()}</p>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1 text-center font-display text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{d}</div>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayOfWeek = new Date(now.getFullYear(), now.getMonth(), day).getDay()
          const dayName = DAYS[dayOfWeek]
          const meals = weeklyMenu[dayName]
          const isToday = day === today
          return (
            <div
              key={day}
              className={cn(
                "group relative rounded-lg border p-1.5 text-center transition-all",
                isToday ? "border-nexus-gold/30 bg-nexus-gold/[0.04]" : "border-border bg-card hover:border-nexus-gold/15"
              )}
            >
              <p className={cn("font-display text-xs font-semibold", isToday ? "text-nexus-gold" : "text-foreground")}>{day}</p>
              <div className="mt-0.5 flex items-center justify-center gap-0.5">
                {meals.slice(0, 3).map((m) => (
                  <div
                    key={m.type}
                    className={cn(
                      "h-1 w-1 rounded-full",
                      m.type === "breakfast" ? "bg-nexus-gold/60" :
                      m.type === "lunch" ? "bg-nexus-info" :
                      "bg-nexus-success"
                    )}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[10px] text-muted-foreground">Menu rotates weekly. Tap a day to see details. Colors: gold=breakfast, blue=lunch, green=dinner</p>
    </div>
  )
}

function SeasonalBanner() {
  const season = getCurrentSeason()
  const config = seasonConfig[season]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 nexus-shimmer">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-nexus-gold/10">
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>
      <div>
        <p className="font-display text-[10px] font-semibold uppercase tracking-wider text-nexus-gold">{config.label} Menu Active</p>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>
    </div>
  )
}

function TrendInsights() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-nexus-gold/70" />
        <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">Meal Trends</h3>
      </div>
      <div className="flex flex-col gap-2">
        {trendData.map((item) => (
          <div key={item.dish} className="flex items-center justify-between">
            <span className="text-xs text-foreground">{item.dish}</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-nexus-gold/60" style={{ width: `${item.popularity}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{item.popularity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============ MAIN MODULE ============

export function MessModule() {
  const [viewMode, setViewMode] = useState<ViewMode>("daily")
  const { permissions } = useAuth()

  const viewModes: { key: ViewMode; label: string; icon: typeof Calendar }[] = [
    { key: "daily", label: "Daily", icon: Calendar },
    { key: "weekly", label: "Weekly", icon: CalendarDays },
    { key: "monthly", label: "Monthly", icon: CalendarRange },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 nexus-fade-in">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Utensils className="h-5 w-5 text-nexus-gold" />
            Mess Menu
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">AI-powered meal planning and tracking</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {viewModes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setViewMode(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                viewMode === key ? "bg-nexus-gold/10 text-nexus-gold" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Seasonal Banner */}
      <div className="mb-4">
        <SeasonalBanner />
      </div>

      {/* Admin edit hint */}
      {permissions?.editMessMenu && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-nexus-gold/20 bg-nexus-gold/5 px-3 py-2">
          <Pencil className="h-3.5 w-3.5 text-nexus-gold" />
          <span className="text-xs text-nexus-gold">You have edit access to mess menus</span>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          {viewMode === "daily" && <DailyView />}
          {viewMode === "weekly" && <WeeklyView />}
          {viewMode === "monthly" && <MonthlyView />}
        </div>
        <div className="flex flex-col gap-4">
          <TrendInsights />
        </div>
      </div>
    </div>
  )
}
