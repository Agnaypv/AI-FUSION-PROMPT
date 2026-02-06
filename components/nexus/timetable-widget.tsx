"use client"

import { useMemo } from "react"

import { cn } from "@/lib/utils"
import type { TimetableEntry } from "@/lib/nexus/types"
import { getTodaySchedule } from "@/lib/nexus/intelligence-engine"
import { Clock, MapPin, BookOpen } from "lucide-react"
import { useState, useEffect } from "react"

function ClassCard({
  entry,
  status,
}: {
  entry: TimetableEntry
  status: "past" | "current" | "upcoming"
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 transition-all",
        status === "current" && "border-primary/30 bg-primary/5 nexus-glow",
        status === "past" && "border-border bg-card opacity-50",
        status === "upcoming" && "border-border bg-card"
      )}
    >
      <div
        className="h-10 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: entry.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {status === "current" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
              <span className="nexus-signal-dot bg-primary nexus-pulse" />
              Now
            </span>
          )}
          <p
            className={cn(
              "text-sm font-medium truncate",
              status === "past" ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {entry.subject}
          </p>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {entry.startTime} - {entry.endTime}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {entry.room}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            {entry.type}
          </span>
        </div>
      </div>
      <span className="hidden text-xs font-mono text-muted-foreground sm:block">
        {entry.code}
      </span>
    </div>
  )
}

export function TimetableWidget() {
  const [schedule, setSchedule] = useState<ReturnType<typeof getTodaySchedule> | null>(null)

  useEffect(() => {
    setSchedule(getTodaySchedule())
  }, [])

  if (!schedule) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
        ))}
      </div>
    )
  }

  const { todaysClasses, currentClass, upcomingClasses, pastClasses } = schedule

  if (todaysClasses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/40" />
        <p className="mt-2 text-sm text-muted-foreground">
          No classes scheduled today
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {pastClasses.map((entry) => (
        <ClassCard key={entry.id} entry={entry} status="past" />
      ))}
      {currentClass && (
        <ClassCard entry={currentClass} status="current" />
      )}
      {upcomingClasses.map((entry) => (
        <ClassCard key={entry.id} entry={entry} status="upcoming" />
      ))}
    </div>
  )
}
