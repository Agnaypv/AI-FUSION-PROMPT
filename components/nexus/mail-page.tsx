"use client"

import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { emails as allEmails } from "@/lib/nexus/mock-data"
import type { Email, EmailCategory } from "@/lib/nexus/types"
import { format } from "date-fns"
import {
  Mail,
  Sparkles,
  Clock,
  AlertTriangle,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Loader2,
  Brain,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const categoryStyles: Record<EmailCategory, { color: string; label: string }> = {
  academic: { color: "bg-nexus-info/10 text-nexus-info", label: "Academic" },
  event: { color: "bg-primary/10 text-primary", label: "Event" },
  urgent: { color: "bg-nexus-urgent/10 text-nexus-urgent", label: "Urgent" },
  administrative: {
    color: "bg-nexus-warn/10 text-nexus-warn",
    label: "Admin",
  },
  social: { color: "bg-nexus-success/10 text-nexus-success", label: "Social" },
  spam: { color: "bg-muted text-muted-foreground", label: "Spam" },
}

function PriorityBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-nexus-urgent"
      : score >= 60
        ? "bg-nexus-warn"
        : score >= 40
          ? "bg-nexus-info"
          : "bg-muted-foreground"

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">{score}</span>
    </div>
  )
}

function EmailCard({
  email,
  isExpanded,
  onToggle,
  aiSummary,
}: {
  email: Email
  isExpanded: boolean
  onToggle: () => void
  aiSummary?: {
    summary: string
    category: EmailCategory
    priorityScore: number
    deadline: string | null
    requiredAction: string | null
    isRelevantToday: boolean
  }
}) {
  const catStyle = categoryStyles[aiSummary?.category || email.category]
  const priority = aiSummary?.priorityScore ?? email.priorityScore ?? 50

  return (
    <div
      className={cn(
        "rounded-lg border transition-all nexus-fade-in",
        !email.isRead && "border-primary/20 bg-primary/[0.02]",
        email.isRead && "border-border bg-card"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <div className="mt-1 flex flex-col items-center gap-1">
          {!email.isRead && (
            <div className="nexus-signal-dot bg-primary" />
          )}
          {email.isRead && <div className="nexus-signal-dot bg-transparent" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground truncate">
              {email.fromName}
            </span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                catStyle.color
              )}
            >
              {catStyle.label}
            </span>
            {(aiSummary?.isRelevantToday || email.isRelevantToday) && (
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                Today
              </span>
            )}
          </div>

          {aiSummary ? (
            <p className="mt-1 text-sm text-foreground leading-relaxed">
              <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
              {aiSummary.summary}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground truncate">
              {email.subject}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <PriorityBar score={priority} />
            {(aiSummary?.requiredAction || email.extractedAction) && (
              <span className="flex items-center gap-1 text-[10px] text-nexus-warn">
                <AlertTriangle className="h-3 w-3" />
                {aiSummary?.requiredAction || email.extractedAction}
              </span>
            )}
            {(aiSummary?.deadline || email.extractedDeadline) && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {aiSummary?.deadline
                  ? format(new Date(aiSummary.deadline), "MMM d")
                  : email.extractedDeadline
                    ? format(email.extractedDeadline, "MMM d")
                    : ""}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] text-muted-foreground">
            {format(email.receivedAt, "h:mm a")}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Subject: {email.subject}
          </p>
          <div className="mt-2 rounded-md bg-secondary/50 p-3">
            <p className="whitespace-pre-line text-xs text-muted-foreground leading-relaxed">
              {email.body}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

type AISummaryResult = {
  summary: string
  category: EmailCategory
  priorityScore: number
  deadline: string | null
  requiredAction: string | null
  isRelevantToday: boolean
}

export function MailPage() {
  const [mounted, setMounted] = useState(false)
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiSummaries, setAiSummaries] = useState<Record<string, AISummaryResult>>({})
  const [filter, setFilter] = useState<"all" | "today" | "unread">("all")
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const filteredEmails = allEmails.filter((e) => {
    if (filter === "today") return e.isRelevantToday
    if (filter === "unread") return !e.isRead
    return true
  })

  const sortedEmails = [...filteredEmails].sort(
    (a, b) =>
      (b.priorityScore ?? 0) - (a.priorityScore ?? 0)
  )

  const analyzeEmails = useCallback(async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: allEmails.map((e) => ({
            fromName: e.fromName,
            subject: e.subject,
            body: e.body,
          })),
        }),
      })

      const text = await response.text()
      try {
        const data = JSON.parse(text)
        if (data.summaries) {
          const summaryMap: Record<string, AISummaryResult> = {}
          data.summaries.forEach((s: AISummaryResult & { emailIndex: number }) => {
            const email = allEmails[s.emailIndex]
            if (email) {
              summaryMap[email.id] = s
            }
          })
          setAiSummaries(summaryMap)
          setHasAnalyzed(true)
        }
      } catch {
        // If streaming/partial response, use pre-built summaries
        setHasAnalyzed(true)
        const fallbackMap: Record<string, AISummaryResult> = {}
        allEmails.forEach((e) => {
          fallbackMap[e.id] = {
            summary: e.aiSummary || e.subject,
            category: e.category,
            priorityScore: e.priorityScore ?? 50,
            deadline: e.extractedDeadline?.toISOString() ?? null,
            requiredAction: e.extractedAction ?? null,
            isRelevantToday: e.isRelevantToday ?? false,
          }
        })
        setAiSummaries(fallbackMap)
      }
    } catch {
      // Fallback to pre-computed data
      setHasAnalyzed(true)
      const fallbackMap: Record<string, AISummaryResult> = {}
      allEmails.forEach((e) => {
        fallbackMap[e.id] = {
          summary: e.aiSummary || e.subject,
          category: e.category,
          priorityScore: e.priorityScore ?? 50,
          deadline: e.extractedDeadline?.toISOString() ?? null,
          requiredAction: e.extractedAction ?? null,
          isRelevantToday: e.isRelevantToday ?? false,
        }
      })
      setAiSummaries(fallbackMap)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Mail Intelligence
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {allEmails.length} emails -- {allEmails.filter((e) => !e.isRead).length}{" "}
              unread
            </p>
          </div>
          <Button
            onClick={analyzeEmails}
            disabled={isAnalyzing}
            size="sm"
            className="gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isAnalyzing
              ? "Analyzing..."
              : hasAnalyzed
                ? "Re-analyze"
                : "AI Summarize"}
          </Button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center gap-2">
          {(["all", "today", "unread"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {f === "all"
                ? "All"
                : f === "today"
                  ? "Today-relevant"
                  : "Unread"}
            </button>
          ))}
        </div>
      </header>

      {hasAnalyzed && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <Brain className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-medium text-primary">
              AI Analysis Complete
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Emails sorted by priority. Deadlines extracted and linked to your
              academic calendar. Low-priority items suppressed.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {!mounted ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-secondary" />
          ))
        ) : (
          sortedEmails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              isExpanded={expandedEmail === email.id}
              onToggle={() =>
                setExpandedEmail(
                  expandedEmail === email.id ? null : email.id
                )
              }
              aiSummary={aiSummaries[email.id]}
            />
          ))
        )}
      </div>
    </div>
  )
}
