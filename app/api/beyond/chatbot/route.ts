// NEXUS Conversational Chatbot API
// Intent detection + app metadata + user context aware responses
// Uses AI SDK with Vercel AI Gateway when available, falls back to rule-based NLP

import { streamText, Output } from "ai"
import { z } from "zod"

type ChatbotIntent =
  | "navigation" | "feature_help" | "daily_summary"
  | "academic_query" | "mess_query" | "travel_query" | "general"

// Rule-based intent classifier
function classifyIntent(message: string): ChatbotIntent {
  const m = message.toLowerCase()
  if (/where|find|navigate|go to|open|how do i get/i.test(m)) return "navigation"
  if (/how|what does|help|explain|feature|can i/i.test(m)) return "feature_help"
  if (/summar|today|day|schedule|what.*next/i.test(m)) return "daily_summary"
  if (/grade|assignment|exam|study|course|subject|gpa|attendance/i.test(m)) return "academic_query"
  if (/mess|food|lunch|dinner|breakfast|menu|meal/i.test(m)) return "mess_query"
  if (/travel|ride|cab|pool|share.*ride|bus/i.test(m)) return "travel_query"
  return "general"
}

// App navigation map for guiding users
const navMap: Record<string, { path: string; description: string }> = {
  mess: { path: "/mess", description: "Mess module with daily, weekly, and monthly menus" },
  food: { path: "/mess", description: "Mess module for viewing the dining menu" },
  academic: { path: "/academic", description: "Academic cockpit with grades, study plans, and deadlines" },
  grades: { path: "/academic", description: "Academic cockpit for checking your grades" },
  mail: { path: "/mail", description: "AI-powered mail summarizer" },
  email: { path: "/mail", description: "AI mail summarizer for campus emails" },
  explore: { path: "/explore", description: "Campus explorer with interactive map" },
  map: { path: "/explore", description: "Campus map and navigation" },
  travel: { path: "/travel", description: "Travel pooling for shared rides" },
  ride: { path: "/travel", description: "Ride sharing and travel groups" },
  lost: { path: "/exchange", description: "Lost & found with AI image matching" },
  found: { path: "/exchange", description: "Lost & found exchange" },
  resale: { path: "/resale", description: "Student resale hub for buying/selling items" },
  sell: { path: "/resale", description: "Marketplace to sell your used items" },
  buy: { path: "/resale", description: "Marketplace to buy from other students" },
  beyond: { path: "/beyond", description: "Innovation hub with community, wellness, and admin features" },
}

// Fallback response generator using intent + keywords
function generateFallbackResponse(message: string, role: string, intent: ChatbotIntent) {
  const m = message.toLowerCase()

  // Navigation intent: find relevant module
  if (intent === "navigation") {
    for (const [key, val] of Object.entries(navMap)) {
      if (m.includes(key)) {
        return {
          reply: `You can find that in the **${val.description}**. Navigate to \`${val.path}\` from the sidebar.`,
          intent,
          suggestions: ["Show me my schedule", "What's for lunch?", "Check my grades"],
          actionUrl: val.path,
          confidence: 0.9,
        }
      }
    }
    return {
      reply: "I can help you navigate! Available modules: **Mess**, **Academic**, **Mail**, **Explore**, **Travel**, **Lost & Found**, **Resale Hub**, and **Beyond Hub**. Which one would you like?",
      intent,
      suggestions: ["Open mess menu", "Check my grades", "Find lost item"],
      confidence: 0.7,
    }
  }

  // Daily summary
  if (intent === "daily_summary") {
    return {
      reply: `Here's your day at a glance:\n\n- **Upcoming classes**: Check your timetable on the dashboard\n- **Deadlines**: View pending assignments in Academic\n- **Mess**: Today's menu is available in the Mess module\n- **Mail**: ${role === "student" ? "Check for any urgent emails" : "Review department notifications"}\n\nWould you like details on any of these?`,
      intent,
      suggestions: ["What's my next class?", "Any deadlines today?", "Show mess menu"],
      actionUrl: "/",
      confidence: 0.85,
    }
  }

  // Academic queries
  if (intent === "academic_query") {
    return {
      reply: "For academic information, head to the **Academic Cockpit** where you can view grades, track assignments, and generate AI study plans. You can also check your attendance records in the Beyond Hub.",
      intent,
      suggestions: ["Generate study plan", "Check attendance", "View deadlines"],
      actionUrl: "/academic",
      confidence: 0.8,
    }
  }

  // Mess queries
  if (intent === "mess_query") {
    return {
      reply: "The **Mess module** shows today's menu with daily, weekly, and monthly views. You can also see seasonal variations and AI meal recommendations based on your preferences.",
      intent,
      suggestions: ["Show weekly menu", "What's for dinner?", "Mess crowd level"],
      actionUrl: "/mess",
      confidence: 0.85,
    }
  }

  // Travel queries
  if (intent === "travel_query") {
    return {
      reply: "The **Travel Pooling** module helps you find shared rides. You can join existing groups or create a new one. AI calculates safety scores and optimal cost-sharing.",
      intent,
      suggestions: ["Find a ride to station", "Create travel group", "Check safety score"],
      actionUrl: "/travel",
      confidence: 0.8,
    }
  }

  // Feature help
  if (intent === "feature_help") {
    return {
      reply: "NEXUS is your campus super-app with these core features:\n\n1. **Dashboard** - AI-powered daily pulse\n2. **Academic Cockpit** - Grades, study plans, deadlines\n3. **Mess** - Smart dining menus\n4. **Explorer** - Campus map & navigation\n5. **Travel** - Ride sharing\n6. **Lost & Found** - AI image matching\n7. **Resale Hub** - Student marketplace\n8. **Beyond Hub** - Community, wellness, admin tools\n\nAsk me about any feature!",
      intent,
      suggestions: ["How does AI study plan work?", "Explain safety scores", "What is Beyond Hub?"],
      confidence: 0.9,
    }
  }

  // General fallback
  return {
    reply: "I'm your NEXUS assistant! I can help you navigate the app, summarize your day, answer questions about mess menus, academics, travel, and more. What would you like to know?",
    intent: "general" as ChatbotIntent,
    suggestions: ["Summarize my day", "Where do I find the mess menu?", "Help with academics"],
    confidence: 0.5,
  }
}

export async function POST(req: Request) {
  const { message, role = "student", context = {} } = await req.json()

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Message is required" }, { status: 400 })
  }

  const intent = classifyIntent(message)

  // If no AI Gateway key, use intelligent rule-based response
  if (!process.env.AI_GATEWAY_API_KEY) {
    const response = generateFallbackResponse(message, role, intent)
    return Response.json(response)
  }

  // AI-powered response using Vercel AI Gateway
  const result = await streamText({
    model: "openai/gpt-4o-mini",
    system: `You are NEXUS Assistant, an AI chatbot for a campus super-app. You help students and faculty navigate the app, understand features, and get quick answers.

Current user role: ${role}
Detected intent: ${intent}
Available modules: Dashboard, Academic Cockpit, Mess (daily/weekly/monthly menus), Explorer (campus map), Travel (ride sharing), Lost & Found, Resale Hub, Mail Summarizer, Beyond Hub (community, wellness, admin).

Rules:
- Be concise and helpful (max 3-4 sentences)
- Use markdown for formatting
- Suggest relevant next actions
- If asked about navigation, provide the correct module path
- Never make up data -- point to the correct module instead`,
    prompt: message,
    output: Output.object({
      schema: z.object({
        reply: z.string(),
        suggestions: z.array(z.string()),
        actionUrl: z.string().nullable(),
      }),
    }),
  })

  const obj = await result.output
  return Response.json({
    reply: obj?.reply || generateFallbackResponse(message, role, intent).reply,
    intent,
    suggestions: obj?.suggestions || [],
    actionUrl: obj?.actionUrl || null,
    confidence: 0.95,
  })
}
