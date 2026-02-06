"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { assignments, grades, timetable } from "@/lib/nexus/mock-data"
import { buildContext } from "@/lib/nexus/intelligence-engine"
import { format, differenceInDays } from "date-fns"
import {
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Clock,
  Sparkles,
  Loader2,
  Brain,
  BookOpen,
  Target,
  CheckCircle2,
  Circle,
  Timer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function GradeCard({
  grade,
}: {
  grade: (typeof grades)[0]
}) {
  const TrendIcon =
    grade.trend === "up"
      ? TrendingUp
      : grade.trend === "down"
        ? TrendingDown
        : Minus
  const trendColor =
    grade.trend === "up"
      ? "text-nexus-success"
      : grade.trend === "down"
        ? "text-nexus-urgent"
        : "text-muted-foreground"

  return (
    <div className="nexus-card-elevated">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {grade.subjectCode}
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">
            {grade.subject}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-foreground">
            {grade.currentGrade}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Overall</span>
          <span>{grade.percentage}%</span>
        </div>
        <Progress value={grade.percentage} className="mt-1 h-1.5" />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-md bg-secondary p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Assignments</p>
          <p className="text-sm font-semibold text-foreground">
            {grade.assignments}%
          </p>
        </div>
        <div className="rounded-md bg-secondary p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Quizzes</p>
          <p className="text-sm font-semibold text-foreground">
            {grade.quizzes}%
          </p>
        </div>
        <div className="rounded-md bg-secondary p-2 text-center">
          <p className="text-[10px] text-muted-foreground">Trend</p>
          <div className="flex items-center justify-center gap-1">
            <TrendIcon className={cn("h-3.5 w-3.5", trendColor)} />
            <span className={cn("text-xs font-medium", trendColor)}>
              {grade.trend}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function AssignmentList() {
  const [now, setNow] = useState(() => new Date(0))
  useEffect(() => { setNow(new Date()) }, [])
  const sorted = [...assignments].sort(
    (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
  )

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((a) => {
        const daysLeft = differenceInDays(a.dueDate, now)
        const isSubmitted =
          a.status === "submitted" || a.status === "graded"
        const isUrgent = !isSubmitted && daysLeft <= 2

        const statusIcon =
          a.status === "submitted" || a.status === "graded" ? (
            <CheckCircle2 className="h-4 w-4 text-nexus-success" />
          ) : a.status === "in_progress" ? (
            <Timer className="h-4 w-4 text-nexus-warn" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )

        return (
          <div
            key={a.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3",
              isUrgent
                ? "border-nexus-urgent/20 bg-nexus-urgent/5"
                : "border-border bg-card"
            )}
          >
            {statusIcon}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium",
                  isSubmitted
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {a.title}
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {a.subjectCode}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {a.maxMarks} marks / {a.weight}% weight
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              {a.grade ? (
                <span className="text-sm font-semibold text-nexus-success">
                  {a.grade}
                </span>
              ) : (
                <span
                  className={cn(
                    "text-xs font-medium",
                    isUrgent ? "text-nexus-urgent" : "text-muted-foreground"
                  )}
                >
                  {daysLeft < 0
                    ? "Overdue"
                    : daysLeft === 0
                      ? "Today"
                      : `${daysLeft}d left`}
                </span>
              )}
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {format(a.dueDate, "MMM d")}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

type StudyPlanData = {
  overallStrategy: string
  examReadiness: Array<{
    subject: string
    readinessScore: number
    recommendation: string
  }>
  dailyPlans: Array<{
    date: string
    blocks: Array<{
      startTime: string
      endTime: string
      subject: string
      topic: string
      type: "study" | "practice" | "revision" | "break"
      difficulty: "easy" | "medium" | "hard"
      notes: string
    }>
  }>
}

function StudyPlanner() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null)
  const context = useMemo(() => buildContext(), [])

  const generatePlan = useCallback(async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignments: assignments.filter(
            (a) => a.status !== "submitted" && a.status !== "graded"
          ),
          grades,
          timetable,
          currentStress: context.academicStress,
        }),
      })

      const text = await response.text()
      try {
        const data = JSON.parse(text)
        setStudyPlan(data)
      } catch {
        // Fallback study plan
        setStudyPlan({
          overallStrategy:
            "Focus on Computer Networks (downward trend) and complete the ER Diagram assignment first (due soonest). Allocate extra revision time for OS concepts.",
          examReadiness: [
            {
              subject: "Data Structures & Algorithms",
              readinessScore: 78,
              recommendation:
                "Strong fundamentals. Focus on AVL tree implementation for assignment.",
            },
            {
              subject: "Operating Systems",
              readinessScore: 62,
              recommendation:
                "Needs attention. Start the Process Scheduling Simulator early.",
            },
            {
              subject: "Database Management",
              readinessScore: 85,
              recommendation:
                "On track. Complete ER diagram assignment tonight.",
            },
            {
              subject: "Computer Networks",
              readinessScore: 52,
              recommendation:
                "Priority subject. Dedicate extra study blocks this week.",
            },
          ],
          dailyPlans: [
            {
              date: "Today",
              blocks: [
                {
                  startTime: "17:00",
                  endTime: "18:30",
                  subject: "Database Management",
                  topic: "Complete ER Diagram + 3NF Normalization",
                  type: "practice",
                  difficulty: "medium",
                  notes: "Due tomorrow. Focus on normalization steps.",
                },
                {
                  startTime: "18:30",
                  endTime: "18:45",
                  subject: "Break",
                  topic: "Rest",
                  type: "break",
                  difficulty: "easy",
                  notes: "Short walk or snack break.",
                },
                {
                  startTime: "18:45",
                  endTime: "19:30",
                  subject: "Computer Networks",
                  topic: "TCP vs UDP -- Protocol Comparison",
                  type: "study",
                  difficulty: "hard",
                  notes: "Weakest area. Focus on understanding handshake process.",
                },
                {
                  startTime: "20:00",
                  endTime: "21:00",
                  subject: "Data Structures",
                  topic: "AVL Tree Rotations -- Implementation",
                  type: "practice",
                  difficulty: "hard",
                  notes: "Code the rotation functions. Test with edge cases.",
                },
              ],
            },
            {
              date: "Tomorrow",
              blocks: [
                {
                  startTime: "07:00",
                  endTime: "08:00",
                  subject: "Computer Networks",
                  topic: "Socket Programming Basics",
                  type: "study",
                  difficulty: "medium",
                  notes: "Morning session for difficult material.",
                },
                {
                  startTime: "12:30",
                  endTime: "13:30",
                  subject: "Operating Systems",
                  topic: "Process Scheduling -- FCFS & SJF",
                  type: "study",
                  difficulty: "medium",
                  notes: "Start simulator assignment framework.",
                },
                {
                  startTime: "17:00",
                  endTime: "18:30",
                  subject: "Data Structures",
                  topic: "AVL Tree -- Deletion + Testing",
                  type: "practice",
                  difficulty: "hard",
                  notes: "Complete deletion logic and write tests.",
                },
              ],
            },
          ],
        })
      }
    } catch {
      // Use fallback
      setStudyPlan({
        overallStrategy:
          "Focus on Computer Networks (downward trend) and complete the ER Diagram assignment first (due soonest).",
        examReadiness: [
          {
            subject: "Data Structures & Algorithms",
            readinessScore: 78,
            recommendation: "Strong. Keep current pace.",
          },
          {
            subject: "Operating Systems",
            readinessScore: 62,
            recommendation: "Needs more practice sessions.",
          },
          {
            subject: "Database Management",
            readinessScore: 85,
            recommendation: "On track.",
          },
          {
            subject: "Computer Networks",
            readinessScore: 52,
            recommendation: "Priority focus needed.",
          },
        ],
        dailyPlans: [],
      })
    } finally {
      setIsGenerating(false)
    }
  }, [context.academicStress])

  const blockTypeStyles = {
    study: "border-nexus-info/30 bg-nexus-info/5",
    practice: "border-primary/30 bg-primary/5",
    revision: "border-nexus-warn/30 bg-nexus-warn/5",
    break: "border-border bg-secondary/50",
  }

  const difficultyColors = {
    easy: "text-nexus-success",
    medium: "text-nexus-warn",
    hard: "text-nexus-urgent",
  }

  return (
    <div>
      {!studyPlan ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
          <Brain className="h-10 w-10 text-muted-foreground/30" />
          <h3 className="mt-3 text-sm font-medium text-foreground">
            AI Study Planner
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
            Generate a personalized study plan based on your deadlines, grades,
            schedule, and current stress level. The AI analyzes where you need
            the most help.
          </p>
          <Button
            onClick={generatePlan}
            disabled={isGenerating}
            className="mt-4 gap-2"
            size="sm"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Generating plan..." : "Generate Study Plan"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 nexus-fade-in">
          {/* Strategy */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                AI Strategy
              </span>
            </div>
            <p className="mt-2 text-sm text-foreground leading-relaxed">
              {studyPlan.overallStrategy}
            </p>
          </div>

          {/* Exam Readiness */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Target className="h-4 w-4 text-muted-foreground" />
              Exam Readiness
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {studyPlan.examReadiness.map((er) => (
                <div
                  key={er.subject}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-foreground truncate">
                      {er.subject}
                    </p>
                    <span
                      className={cn(
                        "text-lg font-bold",
                        er.readinessScore >= 75
                          ? "text-nexus-success"
                          : er.readinessScore >= 55
                            ? "text-nexus-warn"
                            : "text-nexus-urgent"
                      )}
                    >
                      {er.readinessScore}%
                    </span>
                  </div>
                  <Progress
                    value={er.readinessScore}
                    className="mt-2 h-1"
                  />
                  <p className="mt-2 text-[10px] text-muted-foreground leading-relaxed">
                    {er.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Plans */}
          {studyPlan.dailyPlans.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Study Schedule
              </h3>
              {studyPlan.dailyPlans.map((day) => (
                <div key={day.date} className="mt-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {day.date}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {day.blocks.map((block, i) => (
                      <div
                        key={`${day.date}-${i}`}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border p-3",
                          blockTypeStyles[block.type]
                        )}
                      >
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-mono text-muted-foreground">
                            {block.startTime}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground">
                            {block.endTime}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">
                              {block.subject}
                            </p>
                            {block.type !== "break" && (
                              <span
                                className={cn(
                                  "text-[10px] font-medium",
                                  difficultyColors[block.difficulty]
                                )}
                              >
                                {block.difficulty}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {block.topic}
                          </p>
                          {block.notes && (
                            <p className="mt-1 text-[10px] text-muted-foreground/70 italic">
                              {block.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={generatePlan}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="self-start gap-2 bg-transparent"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Regenerate Plan
          </Button>
        </div>
      )}
    </div>
  )
}

export function AcademicPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">
          Academic Cockpit
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Grades, deadlines, and AI-powered study planning
        </p>
      </header>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="mb-4 w-full justify-start bg-secondary">
          <TabsTrigger value="grades" className="gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" />
            Grades
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="planner" className="gap-1.5">
            <Brain className="h-3.5 w-3.5" />
            AI Planner
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grades">
          <div className="grid gap-4 sm:grid-cols-2">
            {grades.map((g) => (
              <GradeCard key={g.subjectCode} grade={g} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentList />
        </TabsContent>

        <TabsContent value="planner">
          <StudyPlanner />
        </TabsContent>
      </Tabs>
    </div>
  )
}
