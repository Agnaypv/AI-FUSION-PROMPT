"use client"

import { useState, useEffect } from "react"
import {
  buildContext,
  generateInsights,
  getGreeting,
  getStatusLine,
} from "@/lib/nexus/intelligence-engine"
import { currentUser } from "@/lib/nexus/mock-data"
import { useAuth } from "@/lib/nexus/auth-context"
import { InsightList } from "./insight-card"
import { TimetableWidget } from "./timetable-widget"
import { MessWidget } from "./mess-widget"
import { DeadlineWidget } from "./deadline-widget"
import {
  Zap,
  Brain,
  Calendar,
  Utensils,
  AlertTriangle,
  TrendingUp,
  Activity,
} from "lucide-react"
import { grades } from "@/lib/nexus/mock-data"
import type { CIEContext, CIEInsight } from "@/lib/nexus/types"

function SectionHeader({
  icon: Icon,
  title,
  badge,
}: {
  icon: typeof Zap
  title: string
  badge?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-nexus-gold/70" />
        <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">
          {title}
        </h2>
      </div>
      {badge && (
        <span className="rounded-full bg-nexus-gold/10 px-2 py-0.5 font-display text-[9px] font-medium tracking-wider text-nexus-gold">
          {badge}
        </span>
      )}
    </div>
  )
}

function StressIndicator({ stress }: { stress: number }) {
  const level =
    stress >= 70 ? "High" : stress >= 40 ? "Moderate" : "Low"
  const color =
    stress >= 70
      ? "text-nexus-urgent"
      : stress >= 40
        ? "text-nexus-warn"
        : "text-nexus-success"
  const barColor =
    stress >= 70
      ? "bg-nexus-urgent"
      : stress >= 40
        ? "bg-nexus-warn"
        : "bg-nexus-success"

  return (
    <div className="nexus-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-nexus-gold/60" />
          <span className="text-xs text-muted-foreground">Academic Load</span>
        </div>
        <span className={`font-display text-[10px] font-semibold tracking-wider ${color}`}>{level}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${stress}%` }}
        />
      </div>
    </div>
  )
}

function QuickGrades() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {grades.slice(0, 4).map((g) => (
        <div key={g.subjectCode} className="nexus-card">
          <p className="font-display text-[9px] font-medium tracking-wider text-muted-foreground">
            {g.subjectCode}
          </p>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-lg font-semibold text-foreground">
              {g.currentGrade}
            </span>
            <span
              className={`flex items-center gap-0.5 text-[10px] font-medium ${
                g.trend === "up"
                  ? "text-nexus-success"
                  : g.trend === "down"
                    ? "text-nexus-urgent"
                    : "text-muted-foreground"
              }`}
            >
              <TrendingUp
                className={`h-3 w-3 ${g.trend === "down" ? "rotate-180" : g.trend === "stable" ? "rotate-0" : ""}`}
              />
              {g.percentage}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function RightNowDashboard() {
  const [mounted, setMounted] = useState(false)
  const [context, setContext] = useState<CIEContext | null>(null)
  const [insights, setInsights] = useState<CIEInsight[]>([])
  const { user } = useAuth()

  const userName = user?.name.split(" ")[0] || "Student"

  useEffect(() => {
    const ctx = buildContext()
    setContext(ctx)
    setInsights(generateInsights(ctx))
    setMounted(true)
  }, [])

  const greeting = mounted && context
    ? getGreeting(userName, context.hourOfDay)
    : `Hey, ${userName}`
  const statusLine = mounted && context ? getStatusLine(context) : "Connecting to intelligence..."

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6 nexus-fade-in">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground text-balance">
          {greeting}
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="nexus-signal-dot bg-nexus-gold nexus-pulse" />
          {statusLine}
        </p>
      </header>

      {/* Intelligence Insights */}
      {insights.length > 0 && (
        <section className="mb-6">
          <SectionHeader
            icon={Brain}
            title="Intelligence Feed"
            badge={`${insights.length} signals`}
          />
          <div className="mt-3">
            <InsightList insights={insights.slice(0, 5)} />
          </div>
        </section>
      )}

      {/* Main Grid */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:gap-6">
        {/* Left Column: Schedule + Deadlines */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          <section>
            <SectionHeader
              icon={Calendar}
              title="Today's Schedule"
              badge="Live"
            />
            <div className="mt-3">
              <TimetableWidget />
            </div>
          </section>

          <section>
            <SectionHeader
              icon={AlertTriangle}
              title="Deadline Radar"
            />
            <div className="mt-3">
              <DeadlineWidget />
            </div>
          </section>
        </div>

        {/* Right Column: Mess + Grades + Stress */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section>
            <SectionHeader icon={Utensils} title="Mess Menu" />
            <div className="mt-3">
              <MessWidget />
            </div>
          </section>

          <section>
            <SectionHeader icon={TrendingUp} title="Quick Grades" />
            <div className="mt-3">
              <QuickGrades />
            </div>
          </section>

          <StressIndicator stress={context?.academicStress ?? 0} />
        </div>
      </div>
    </div>
  )
}
