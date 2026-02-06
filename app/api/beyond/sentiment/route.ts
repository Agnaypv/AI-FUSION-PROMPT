// NEXUS Campus Sentiment Analysis API
// Aggregated, anonymized campus mood tracking
// Privacy-safe -- no individual user data exposed

import { sentimentHistory } from "@/lib/nexus/beyond-data"

export async function GET() {
  // Current mood index is the latest entry
  const current = sentimentHistory[sentimentHistory.length - 1]
  const previous = sentimentHistory[sentimentHistory.length - 2]

  const trend = current.overall > previous.overall ? "improving" : current.overall < previous.overall ? "declining" : "stable"
  const weekAvg = sentimentHistory.reduce((s, e) => s + e.overall, 0) / sentimentHistory.length

  return Response.json({
    current: {
      ...current,
      trend,
      moodLabel: current.overall > 0.3 ? "Positive" : current.overall > 0 ? "Mixed" : "Low",
    },
    weeklyAverage: Math.round(weekAvg * 100) / 100,
    history: sentimentHistory,
    insights: [
      current.overall > 0.3
        ? "Campus mood is generally positive today."
        : "Campus sentiment is mixed. Key concern areas flagged below.",
      `Top positive topic: ${current.topTopics[0]?.topic || "General"}`,
      `Area of concern: ${current.topTopics[1]?.topic || "None flagged"}`,
      `Based on ${current.sampleSize} anonymous data points`,
    ],
  })
}
