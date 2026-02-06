// NEXUS Predictive Analytics API
// Course difficulty, optimal study time, grade forecasting
// Explainable, probability-based -- NOT deep ML

import { assignments, subjectGrades, timetable } from "@/lib/nexus/mock-data"
import { attendanceRecords } from "@/lib/nexus/beyond-data"

// a) Course Difficulty Prediction
function predictCourseDifficulty() {
  return subjectGrades.map((g) => {
    const attendance = attendanceRecords.find((a) => a.subjectCode === g.subjectCode)
    const attendPct = attendance?.percentage ?? 85
    const gradePct = g.percentage
    // Weighted scoring: 40% grade, 30% attendance, 30% peer comparison
    const peerAvg = 72 // simulated campus average
    const diffScore = 100 - (gradePct * 0.4 + attendPct * 0.3 + Math.min(100, (gradePct / peerAvg) * 100) * 0.3)
    const level = diffScore > 55 ? "high" : diffScore > 35 ? "medium" : "low"
    const factors: string[] = []
    if (gradePct < 70) factors.push("Below-average grade performance")
    if (attendPct < 80) factors.push("Low attendance may indicate difficulty")
    if (g.trend === "down") factors.push("Declining grade trend")
    if (factors.length === 0) factors.push("Performing well relative to peers")

    return {
      subjectCode: g.subjectCode,
      subject: g.subject,
      difficultyScore: level,
      confidence: Math.round(70 + Math.random() * 20),
      factors,
      recommendation: level === "high"
        ? `Prioritize ${g.subject}. Consider forming a study group and attending office hours.`
        : level === "medium"
          ? `${g.subject} needs steady attention. Review weekly and practice problem sets.`
          : `${g.subject} is on track. Maintain current pace with light revision.`,
    }
  })
}

// b) Optimal Study Time Suggestion
function suggestStudyTimes() {
  const dayOfWeek = new Date().getDay() || 7
  const todayClasses = timetable
    .filter((t) => t.dayOfWeek === dayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  // Find free windows between classes and around them
  const freeWindows: { start: string; end: string; quality: "peak" | "good" | "moderate" }[] = []

  // Early morning slot
  if (!todayClasses.length || todayClasses[0].startTime > "09:00") {
    freeWindows.push({ start: "06:30", end: "08:30", quality: "peak" })
  }

  // Gaps between classes
  for (let i = 0; i < todayClasses.length - 1; i++) {
    const gapStart = todayClasses[i].endTime
    const gapEnd = todayClasses[i + 1].startTime
    const [gH] = gapStart.split(":").map(Number)
    const [eH] = gapEnd.split(":").map(Number)
    if (eH - gH >= 1) {
      freeWindows.push({ start: gapStart, end: gapEnd, quality: gH < 14 ? "good" : "moderate" })
    }
  }

  // Evening slot
  const lastEnd = todayClasses.length ? todayClasses[todayClasses.length - 1].endTime : "16:00"
  if (lastEnd < "19:00") {
    freeWindows.push({ start: "19:00", end: "21:00", quality: "good" })
  }

  // Map subjects that need study based on upcoming deadlines
  const pending = assignments
    .filter((a) => a.status !== "submitted" && a.status !== "graded")
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  return freeWindows.map((w, i) => ({
    windowStart: w.start,
    windowEnd: w.end,
    quality: w.quality,
    subject: pending[i % Math.max(pending.length, 1)]?.subject || "General Revision",
    reasoning: w.quality === "peak"
      ? "Early morning offers highest cognitive performance for complex topics."
      : w.quality === "good"
        ? "Good focus window. Suitable for problem-solving and active recall."
        : "Moderate energy. Best for light revision or reading.",
  }))
}

// c) Grade Forecasting -- simple probability-based
function forecastGrades() {
  return subjectGrades.map((g) => {
    // Project based on current trajectory + assignment weights remaining
    const trendFactor = g.trend === "up" ? 3 : g.trend === "down" ? -4 : 0
    const projected = Math.min(100, Math.max(0, g.percentage + trendFactor + (Math.random() * 4 - 2)))
    const gradeMap = (p: number) =>
      p >= 90 ? "A+" : p >= 85 ? "A" : p >= 80 ? "A-" :
      p >= 75 ? "B+" : p >= 70 ? "B" : p >= 65 ? "B-" :
      p >= 60 ? "C+" : p >= 55 ? "C" : "D"

    return {
      subjectCode: g.subjectCode,
      subject: g.subject,
      currentPercentage: g.percentage,
      projectedGrade: gradeMap(projected),
      projectedPercentage: Math.round(projected * 10) / 10,
      confidence: Math.round(65 + Math.random() * 25),
      explanation: g.trend === "up"
        ? `Upward trend detected. Maintaining effort should yield ${gradeMap(projected)}.`
        : g.trend === "down"
          ? `Declining trend. Without intervention, grade may drop to ${gradeMap(projected)}.`
          : `Stable performance. Expected to maintain around ${gradeMap(projected)}.`,
    }
  })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type")

  switch (type) {
    case "difficulty":
      return Response.json({ predictions: predictCourseDifficulty() })
    case "study-time":
      return Response.json({ suggestions: suggestStudyTimes() })
    case "grade-forecast":
      return Response.json({ forecasts: forecastGrades() })
    default:
      return Response.json({
        difficulty: predictCourseDifficulty(),
        studyTime: suggestStudyTimes(),
        gradeForecast: forecastGrades(),
      })
  }
}
