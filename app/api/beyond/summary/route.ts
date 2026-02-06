// NEXUS Natural Language Generation API
// Auto-summarization for weekly academic, activity, and campus insights
// Uses explainable templates with dynamic data injection

import { assignments, subjectGrades } from "@/lib/nexus/mock-data"
import { attendanceRecords, sentimentHistory } from "@/lib/nexus/beyond-data"

function generateWeeklyAcademic(): {
  type: string; period: string; generatedAt: string
  content: string; highlights: string[]; metrics: Record<string, number>
} {
  const pending = assignments.filter((a) => a.status === "pending" || a.status === "in_progress")
  const submitted = assignments.filter((a) => a.status === "submitted")
  const avgGrade = subjectGrades.reduce((s, g) => s + g.percentage, 0) / subjectGrades.length
  const lowAttendance = attendanceRecords.filter((a) => a.percentage < 80)

  const highlights: string[] = []
  if (pending.length > 3) highlights.push(`You have ${pending.length} pending assignments -- prioritize the earliest deadlines.`)
  if (submitted.length > 0) highlights.push(`${submitted.length} assignment(s) submitted this week. Well done.`)
  if (lowAttendance.length > 0) highlights.push(`Attendance is below 80% in: ${lowAttendance.map((a) => a.subject).join(", ")}.`)
  const improving = subjectGrades.filter((g) => g.trend === "up")
  if (improving.length > 0) highlights.push(`Improving trend in: ${improving.map((g) => g.subject).join(", ")}.`)

  return {
    type: "weekly_academic",
    period: "This Week",
    generatedAt: new Date().toISOString(),
    content: `**Weekly Academic Summary**\n\nYour overall average stands at **${avgGrade.toFixed(1)}%** across ${subjectGrades.length} subjects. You have **${pending.length} pending** and **${submitted.length} submitted** assignments. ${lowAttendance.length > 0 ? `Watch your attendance in ${lowAttendance.length} subject(s).` : "Attendance is healthy across all subjects."} ${improving.length > 0 ? `Great progress in ${improving[0].subject}!` : "Maintain consistent effort across all courses."}`,
    highlights,
    metrics: {
      averageGrade: Math.round(avgGrade * 10) / 10,
      pendingAssignments: pending.length,
      submittedThisWeek: submitted.length,
      lowAttendanceSubjects: lowAttendance.length,
      improvingSubjects: improving.length,
    },
  }
}

function generateActivitySummary(): {
  type: string; period: string; generatedAt: string
  content: string; highlights: string[]; metrics: Record<string, number>
} {
  return {
    type: "activity_summary",
    period: "This Week",
    generatedAt: new Date().toISOString(),
    content: `**Activity Summary**\n\nYou've been active across **5 modules** this week. Most time spent in Academic Cockpit and Mess. You contributed to 2 forum discussions and checked the campus explorer 3 times. Your gamification streak is at 12 days -- keep it going!`,
    highlights: [
      "Most active module: Academic Cockpit (12 visits)",
      "Mess menu checked 8 times this week",
      "2 forum posts contributed",
      "12-day activity streak maintained",
    ],
    metrics: {
      modulesUsed: 5,
      totalSessions: 28,
      forumContributions: 2,
      streakDays: 12,
    },
  }
}

function generateCampusInsights(): {
  type: string; period: string; generatedAt: string
  content: string; highlights: string[]; metrics: Record<string, number>
} {
  const latestMood = sentimentHistory[sentimentHistory.length - 1]
  const avgMood = sentimentHistory.reduce((s, e) => s + e.overall, 0) / sentimentHistory.length

  return {
    type: "campus_insights",
    period: "This Week",
    generatedAt: new Date().toISOString(),
    content: `**Campus Insights**\n\nOverall campus sentiment is **${latestMood.overall > 0.3 ? "positive" : "mixed"}** (score: ${latestMood.overall.toFixed(2)}). The week saw ${latestMood.positive}% positive, ${latestMood.neutral}% neutral, and ${latestMood.negative}% negative sentiment from ${latestMood.sampleSize} anonymous data points. Top trending topic: **${latestMood.topTopics[0]?.topic || "campus life"}**.`,
    highlights: [
      `Mood index: ${latestMood.overall.toFixed(2)} (7-day avg: ${avgMood.toFixed(2)})`,
      `Top positive: ${latestMood.topTopics[0]?.topic}`,
      `Top concern: ${latestMood.topTopics[1]?.topic}`,
      `Data from ${latestMood.sampleSize} anonymous inputs`,
    ],
    metrics: {
      moodIndex: Math.round(latestMood.overall * 100) / 100,
      positivePercent: latestMood.positive,
      negativePercent: latestMood.negative,
      sampleSize: latestMood.sampleSize,
    },
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type")

  switch (type) {
    case "weekly_academic":
      return Response.json(generateWeeklyAcademic())
    case "activity_summary":
      return Response.json(generateActivitySummary())
    case "campus_insights":
      return Response.json(generateCampusInsights())
    default:
      return Response.json({
        summaries: [
          generateWeeklyAcademic(),
          generateActivitySummary(),
          generateCampusInsights(),
        ],
      })
  }
}
