// NEXUS Gamification System API
// Points, badges, leaderboards, rule-based rewards

import { gamificationProfile, leaderboard, badges } from "@/lib/nexus/beyond-data"

// Reward rules: define how points are earned
const rewardRules = [
  { action: "attend_class", points: 5, description: "Attend a scheduled class" },
  { action: "submit_assignment", points: 20, description: "Submit an assignment on time" },
  { action: "early_submission", points: 10, description: "Bonus for submitting 24h+ early" },
  { action: "forum_post", points: 8, description: "Create a forum post" },
  { action: "forum_reply", points: 3, description: "Reply to a forum post" },
  { action: "help_lost_found", points: 15, description: "Help match a lost item" },
  { action: "join_club", points: 10, description: "Join a new club" },
  { action: "attend_event", points: 12, description: "Attend a club event" },
  { action: "complete_wellness", points: 5, description: "Complete a wellness goal" },
  { action: "daily_login", points: 2, description: "Log in daily (streak bonus)" },
  { action: "travel_share", points: 10, description: "Share a ride via travel pool" },
  { action: "marketplace_sale", points: 8, description: "Complete a marketplace transaction" },
]

// Level thresholds
const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200, 6500]

function getLevel(points: number): number {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (points >= levelThresholds[i]) return i + 1
  }
  return 1
}

function getNextLevelProgress(points: number) {
  const level = getLevel(points)
  const current = levelThresholds[level - 1] || 0
  const next = levelThresholds[level] || levelThresholds[levelThresholds.length - 1] + 1000
  return {
    currentLevel: level,
    pointsInLevel: points - current,
    pointsNeeded: next - current,
    progressPercent: Math.round(((points - current) / (next - current)) * 100),
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const module = searchParams.get("module")

  switch (module) {
    case "profile":
      return Response.json({
        ...gamificationProfile,
        levelProgress: getNextLevelProgress(gamificationProfile.points),
      })

    case "leaderboard":
      return Response.json({
        leaderboard,
        updatedAt: new Date().toISOString(),
      })

    case "badges":
      return Response.json({
        earned: badges,
        available: [
          { id: "b_next1", name: "Quiz Master", description: "Score 90%+ on 5 quizzes", category: "academic", progress: 60 },
          { id: "b_next2", name: "Community Leader", description: "Get 50 upvotes on forum posts", category: "social", progress: 34 },
          { id: "b_next3", name: "Fitness First", description: "Complete 30 workout sessions", category: "wellness", progress: 45 },
        ],
      })

    case "rules":
      return Response.json({ rewardRules })

    default:
      return Response.json({
        profile: {
          ...gamificationProfile,
          levelProgress: getNextLevelProgress(gamificationProfile.points),
        },
        topLeaderboard: leaderboard.slice(0, 5),
        recentBadges: badges.slice(0, 3),
        rewardRules,
      })
  }
}

// POST: award points / claim badge
export async function POST(req: Request) {
  const { action, userId } = await req.json()

  const rule = rewardRules.find((r) => r.action === action)
  if (!rule) {
    return Response.json({ error: "Unknown action type" }, { status: 400 })
  }

  return Response.json({
    success: true,
    pointsAwarded: rule.points,
    action: rule.action,
    description: rule.description,
    newTotal: gamificationProfile.points + rule.points,
    newLevel: getLevel(gamificationProfile.points + rule.points),
    message: `+${rule.points} points for: ${rule.description}`,
  })
}
