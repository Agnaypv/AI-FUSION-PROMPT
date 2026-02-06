import { streamText, Output } from "ai"
import { z } from "zod"

const summarySchema = z.object({
  summaries: z.array(
    z.object({
      emailIndex: z.number(),
      summary: z.string(),
      category: z.enum([
        "academic",
        "event",
        "urgent",
        "administrative",
        "social",
        "spam",
      ]),
      priorityScore: z.number(),
      deadline: z.string().nullable(),
      requiredAction: z.string().nullable(),
      isRelevantToday: z.boolean(),
    })
  ),
})

function generateFallbackSummaries(
  emails: { fromName: string; subject: string; body: string }[]
) {
  const urgentKeywords = ["urgent", "immediately", "deadline", "asap", "important", "mandatory"]
  const academicKeywords = ["exam", "assignment", "lecture", "grade", "course", "class", "professor", "semester"]
  const eventKeywords = ["event", "fest", "workshop", "seminar", "register", "competition"]

  return {
    summaries: emails.map((e, i) => {
      const text = `${e.subject} ${e.body}`.toLowerCase()
      const isUrgent = urgentKeywords.some((k) => text.includes(k))
      const isAcademic = academicKeywords.some((k) => text.includes(k))
      const isEvent = eventKeywords.some((k) => text.includes(k))

      const category = isUrgent
        ? "urgent" as const
        : isAcademic
          ? "academic" as const
          : isEvent
            ? "event" as const
            : "administrative" as const

      const priorityScore = isUrgent ? 90 : isAcademic ? 75 : isEvent ? 55 : 40

      const deadlineMatch = e.body.match(
        /(?:by|before|due|deadline[:\s])\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+\d{1,2}(?:,?\s*\d{4})?)/i
      )

      const actionWords = e.body.match(
        /(?:please|must|required to|need to|should|register|submit|attend|apply)\s+([^.]{5,40})/i
      )

      const sentences = e.body.split(/[.!?]+/).filter((s) => s.trim().length > 10)
      const summary =
        sentences.length > 0
          ? sentences[0].trim().slice(0, 80) + (sentences[0].trim().length > 80 ? "..." : "")
          : e.subject

      return {
        emailIndex: i,
        summary,
        category,
        priorityScore,
        deadline: deadlineMatch ? deadlineMatch[1] : null,
        requiredAction: actionWords
          ? actionWords[0].trim().slice(0, 50)
          : null,
        isRelevantToday: isUrgent || priorityScore > 70,
      }
    }),
  }
}

export async function POST(req: Request) {
  const { emails } = await req.json()

  // If no AI Gateway key, use intelligent local analysis
  if (!process.env.AI_GATEWAY_API_KEY) {
    const fallback = generateFallbackSummaries(emails)
    return Response.json(fallback)
  }

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are NEXUS, an intelligent campus assistant. Your job is to analyze college emails and extract the most relevant information for a busy student.

Rules:
- Be extremely concise
- Extract actionable deadlines
- Categorize accurately
- Assign priority scores (0-100) based on urgency and importance
- If an email is irrelevant spam, give it priority 0
- Focus on what the student NEEDS TO DO, not what the email says`,
    prompt: `Analyze these emails and provide structured summaries:

${emails.map((e: { fromName: string; subject: string; body: string }, i: number) => `
--- EMAIL ${i + 1} ---
From: ${e.fromName}
Subject: ${e.subject}
Body: ${e.body}
`).join("\n")}

For each email, provide:
1. A one-line summary (max 15 words)
2. Category: academic, event, urgent, administrative, social, or spam
3. Priority score (0-100)
4. Extracted deadline (if any, in ISO format)
5. Required action (if any, max 10 words)
6. Whether it's relevant to TODAY specifically

Return as a JSON array.`,
    output: Output.object({
      schema: summarySchema,
    }),
  })

  return result.toTextStreamResponse()
}
