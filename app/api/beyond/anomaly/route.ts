// NEXUS Anomaly Detection API
// Rule + threshold-based detection for spam, fake activity, abuse
// Flagging API with admin review hooks

import { anomalyFlags } from "@/lib/nexus/beyond-data"
import type { AnomalyFlag } from "@/lib/nexus/beyond-types"

// Simulated anomaly detection rules
interface AnomalyRule {
  id: string
  name: string
  entityType: AnomalyFlag["entityType"]
  check: (entity: Record<string, unknown>) => { flagged: boolean; confidence: number; reason: string }
}

const rules: AnomalyRule[] = [
  {
    id: "rule_spam_listing",
    name: "Duplicate Listing Detection",
    entityType: "listing",
    check: (entity) => {
      const count = (entity.recentPostCount as number) || 0
      if (count > 3) {
        return { flagged: true, confidence: 85, reason: `${count} similar listings posted within 1 hour` }
      }
      return { flagged: false, confidence: 0, reason: "" }
    },
  },
  {
    id: "rule_suspicious_travel",
    name: "Unusual Travel Pattern",
    entityType: "travel",
    check: (entity) => {
      const hour = (entity.createdHour as number) || 12
      if (hour >= 1 && hour <= 5) {
        return { flagged: true, confidence: 70, reason: "Travel group created between 1-5 AM with unusual pattern" }
      }
      return { flagged: false, confidence: 0, reason: "" }
    },
  },
  {
    id: "rule_reward_abuse",
    name: "Gamification Point Abuse",
    entityType: "user",
    check: (entity) => {
      const pointsToday = (entity.pointsEarnedToday as number) || 0
      if (pointsToday > 500) {
        return { flagged: true, confidence: 75, reason: `Earned ${pointsToday} points in one day, exceeding normal threshold` }
      }
      return { flagged: false, confidence: 0, reason: "" }
    },
  },
  {
    id: "rule_fake_post",
    name: "Suspicious Forum Activity",
    entityType: "post",
    check: (entity) => {
      const content = ((entity.content as string) || "").toLowerCase()
      const spamKeywords = ["buy now", "click here", "free money", "earn from home", "100% guaranteed"]
      const matches = spamKeywords.filter((k) => content.includes(k))
      if (matches.length >= 2) {
        return { flagged: true, confidence: 90, reason: `Content matches ${matches.length} spam patterns` }
      }
      return { flagged: false, confidence: 0, reason: "" }
    },
  },
]

// GET: retrieve all flagged anomalies (admin only)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const type = searchParams.get("type")

  let flags = [...anomalyFlags]
  if (status) flags = flags.filter((f) => f.status === status)
  if (type) flags = flags.filter((f) => f.type === type)

  return Response.json({
    flags,
    rules: rules.map((r) => ({ id: r.id, name: r.name, entityType: r.entityType })),
    stats: {
      total: anomalyFlags.length,
      flagged: anomalyFlags.filter((f) => f.status === "flagged").length,
      reviewing: anomalyFlags.filter((f) => f.status === "reviewing").length,
      confirmed: anomalyFlags.filter((f) => f.status === "confirmed").length,
      dismissed: anomalyFlags.filter((f) => f.status === "dismissed").length,
    },
  })
}

// POST: check entity against rules (flagging API)
export async function POST(req: Request) {
  const { entityType, entity } = await req.json()

  if (!entityType || !entity) {
    return Response.json({ error: "entityType and entity are required" }, { status: 400 })
  }

  const applicableRules = rules.filter((r) => r.entityType === entityType)
  const results = applicableRules.map((rule) => {
    const result = rule.check(entity)
    return { ruleId: rule.id, ruleName: rule.name, ...result }
  })

  const flagged = results.filter((r) => r.flagged)
  const maxConfidence = flagged.length > 0 ? Math.max(...flagged.map((f) => f.confidence)) : 0

  return Response.json({
    isFlagged: flagged.length > 0,
    flags: flagged,
    confidence: maxConfidence,
    checkedRules: results.length,
    entityType,
  })
}
