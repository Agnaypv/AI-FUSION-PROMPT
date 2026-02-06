"use client"

import { useMemo, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getUpcomingDeadlines } from "@/lib/nexus/intelligence-engine"
import { differenceInHours, differenceInDays, format } from "date-fns"
import { AlertTriangle, CheckCircle2, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export function DeadlineWidget() {
  const [now, setNow] = useState<Date | null>(null)
  const deadlines = useMemo(() => getUpcomingDeadlines(now ?? new Date()), [now])

  useEffect(() => {
    setNow(new Date())
  }, [])

  if (!now) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
        ))}
      </div>
    )
  }

  if (deadlines.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-nexus-success/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No upcoming deadlines. Breathe easy.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {deadlines.map((assignment) => {
        const hoursLeft = differenceInHours(assignment.dueDate, now)
        const daysLeft = differenceInDays(assignment.dueDate, now)
        const isUrgent = hoursLeft <= 48
        const isCritical = hoursLeft <= 24

        const timeLabel =
          daysLeft === 0
            ? `${hoursLeft}h left`
            : daysLeft === 1
              ? "Tomorrow"
              : `${daysLeft}d left`

        const statusProgress =
          assignment.status === "in_progress" ? 50 : 10

        return (
          <Link key={assignment.id} href="/academic">
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50",
                isCritical
                  ? "border-nexus-urgent/20 bg-nexus-urgent/5"
                  : isUrgent
                    ? "border-nexus-warn/20 bg-nexus-warn/5"
                    : "border-border bg-card"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  isCritical
                    ? "bg-nexus-urgent/10"
                    : isUrgent
                      ? "bg-nexus-warn/10"
                      : "bg-secondary"
                )}
              >
                {isCritical ? (
                  <AlertTriangle className="h-4 w-4 text-nexus-urgent" />
                ) : (
                  <FileText className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {assignment.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {assignment.subjectCode}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Weight: {assignment.weight}%
                  </span>
                  <Progress
                    value={statusProgress}
                    className="h-1 w-12"
                  />
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={cn(
                    "text-xs font-medium",
                    isCritical
                      ? "text-nexus-urgent"
                      : isUrgent
                        ? "text-nexus-warn"
                        : "text-muted-foreground"
                  )}
                >
                  {timeLabel}
                </span>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  {format(assignment.dueDate, "MMM d")}
                </p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
