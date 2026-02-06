import { streamText, Output } from "ai"
import { z } from "zod"

const studyPlanSchema = z.object({
  overallStrategy: z.string(),
  examReadiness: z.array(
    z.object({
      subject: z.string(),
      readinessScore: z.number(),
      recommendation: z.string(),
    })
  ),
  dailyPlans: z.array(
    z.object({
      date: z.string(),
      blocks: z.array(
        z.object({
          startTime: z.string(),
          endTime: z.string(),
          subject: z.string(),
          topic: z.string(),
          type: z.enum(["study", "practice", "revision", "break"]),
          difficulty: z.enum(["easy", "medium", "hard"]),
          notes: z.string(),
        })
      ),
    })
  ),
})

function generateFallbackStudyPlan(
  grades: { subject: string; grade: string; percentage: number }[],
  currentStress: number
) {
  const today = new Date()
  const weakSubjects = [...(grades || [])].sort(
    (a, b) => (a.percentage ?? 70) - (b.percentage ?? 70)
  )

  const examReadiness = weakSubjects.map((g) => ({
    subject: g.subject,
    readinessScore: Math.min(95, (g.percentage ?? 70) + 5),
    recommendation:
      (g.percentage ?? 70) < 75
        ? `Focus on core concepts. You need improvement in ${g.subject}.`
        : (g.percentage ?? 70) < 85
          ? `Good progress. Practice more problems in ${g.subject}.`
          : `Strong foundation. Light revision will suffice for ${g.subject}.`,
  }))

  const dailyPlans = Array.from({ length: 5 }, (_, dayIdx) => {
    const date = new Date(today)
    date.setDate(date.getDate() + dayIdx)

    const subjects = weakSubjects.length > 0 ? weakSubjects : [{ subject: "General Studies" }]
    const sessionsPerDay = currentStress > 70 ? 2 : 3

    const blocks = Array.from({ length: sessionsPerDay }, (_, blockIdx) => {
      const subj = subjects[blockIdx % subjects.length]
      const startHour = 9 + blockIdx * 2
      return {
        startTime: `${String(startHour).padStart(2, "0")}:00`,
        endTime: `${String(startHour + 1).padStart(2, "0")}:30`,
        subject: subj.subject,
        topic: `Review core concepts - Session ${blockIdx + 1}`,
        type: blockIdx === sessionsPerDay - 1 ? "revision" as const : "study" as const,
        difficulty: (blockIdx === 0 ? "hard" : blockIdx === 1 ? "medium" : "easy") as "hard" | "medium" | "easy",
        notes:
          currentStress > 70
            ? "Take it easy. Focus on understanding, not memorization."
            : "Deep focus session. Minimize distractions.",
      }
    })

    // Add a break between sessions
    blocks.splice(Math.floor(blocks.length / 2), 0, {
      startTime: `${String(9 + Math.floor(sessionsPerDay / 2) * 2).padStart(2, "0")}:00`,
      endTime: `${String(9 + Math.floor(sessionsPerDay / 2) * 2).padStart(2, "0")}:15`,
      subject: "Break",
      topic: "Rest & recharge",
      type: "break" as const,
      difficulty: "easy" as const,
      notes: "Step away from your desk. Hydrate and stretch.",
    })

    return {
      date: date.toISOString().split("T")[0],
      blocks,
    }
  })

  return {
    overallStrategy:
      currentStress > 70
        ? "Your stress level is high. This plan prioritizes quality over quantity -- shorter, focused sessions with regular breaks. Focus on your weakest subjects first while energy is fresh."
        : "Balanced study plan focusing on weak areas first. Alternating difficulty levels to maintain engagement. Consistent daily practice will build momentum.",
    examReadiness,
    dailyPlans,
  }
}

export async function POST(req: Request) {
  const { assignments, grades, timetable, currentStress } = await req.json()

  // If no AI Gateway key, use intelligent local analysis
  if (!process.env.AI_GATEWAY_API_KEY) {
    const fallback = generateFallbackStudyPlan(grades, currentStress)
    return Response.json(fallback)
  }

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are NEXUS Academic Intelligence, an AI study planner for college students. Generate realistic, personalized study plans based on:
- Upcoming deadlines and their weights
- Current grades and trends
- Available free time between classes
- Current stress level

Rules:
- Be practical, not aspirational
- Schedule around existing classes
- Prioritize subjects where the student is struggling
- Include breaks
- Each study block should be 25-90 minutes
- Factor in assignment weights for prioritization`,
    prompt: `Create a personalized study plan for the next 5 days.

Current Assignments:
${JSON.stringify(assignments, null, 2)}

Current Grades:
${JSON.stringify(grades, null, 2)}

Weekly Timetable:
${JSON.stringify(timetable, null, 2)}

Current Academic Stress Level: ${currentStress}/100

Generate a study plan with specific time blocks, topics, and estimated difficulty. Also provide an exam readiness score for each subject.`,
    output: Output.object({
      schema: studyPlanSchema,
    }),
  })

  return result.toTextStreamResponse()
}
