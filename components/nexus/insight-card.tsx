"use client"

import { cn } from "@/lib/utils"
import type { CIEInsight, SignalPriority } from "@/lib/nexus/types"
import {
  Clock,
  AlertTriangle,
  Mail,
  Users,
  Utensils,
  Brain,
  Compass,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const priorityStyles: Record<SignalPriority, { dot: string; border: string; bg: string }> = {
  critical: {
    dot: "bg-nexus-urgent",
    border: "border-nexus-urgent/20",
    bg: "bg-nexus-urgent/5",
  },
  high: {
    dot: "bg-nexus-warn",
    border: "border-nexus-warn/20",
    bg: "bg-nexus-warn/5",
  },
  medium: {
    dot: "bg-nexus-info",
    border: "border-nexus-info/20",
    bg: "bg-card",
  },
  low: {
    dot: "bg-muted-foreground",
    border: "border-border",
    bg: "bg-card",
  },
  ambient: {
    dot: "bg-nexus-signal/50",
    border: "border-border",
    bg: "bg-card",
  },
}

const iconMap: Record<string, typeof Clock> = {
  clock: Clock,
  "alert-triangle": AlertTriangle,
  mail: Mail,
  users: Users,
  utensils: Utensils,
  brain: Brain,
  compass: Compass,
}

export function InsightCard({ insight }: { insight: CIEInsight }) {
  const style = priorityStyles[insight.priority]
  const Icon = iconMap[insight.icon || "brain"] || Brain

  const content = (
    <div
      className={cn(
        "nexus-fade-in flex items-start gap-3 rounded-lg border p-3 transition-colors",
        style.border,
        style.bg,
        insight.actionUrl && "cursor-pointer hover:bg-secondary/50"
      )}
    >
      <div className="mt-0.5 flex items-center gap-2">
        <div className={cn("nexus-signal-dot shrink-0", style.dot)} />
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-tight">
          {insight.title}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {insight.description}
        </p>
      </div>
      {insight.actionUrl && (
        <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      )}
    </div>
  )

  if (insight.actionUrl) {
    return <Link href={insight.actionUrl}>{content}</Link>
  }

  return content
}

export function InsightList({ insights }: { insights: CIEInsight[] }) {
  if (insights.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <Brain className="mx-auto h-8 w-8 text-muted-foreground/40" />
        <p className="mt-2 text-sm text-muted-foreground">
          All clear. No urgent signals right now.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </div>
  )
}
