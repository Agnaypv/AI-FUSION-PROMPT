// NEXUS Social & Community API
// Clubs, forums, polls, mentorship, group chat
// All endpoints combined under /api/beyond/social

import {
  clubs, forumPosts, polls, mentorshipMatches, groupChats
} from "@/lib/nexus/beyond-data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const module = searchParams.get("module")

  switch (module) {
    case "clubs":
      return Response.json({
        clubs,
        totalMembers: clubs.reduce((s, c) => s + c.members, 0),
        upcomingEvents: clubs.flatMap((c) => c.events).filter((e) => e.date > new Date()).length,
      })

    case "forums":
      return Response.json({
        posts: forumPosts,
        categories: [...new Set(forumPosts.map((p) => p.category))],
        totalPosts: forumPosts.length,
        totalReplies: forumPosts.reduce((s, p) => s + p.replies.length, 0),
      })

    case "polls":
      return Response.json({
        polls,
        activePolls: polls.filter((p) => p.expiresAt > new Date()).length,
        totalVotes: polls.reduce((s, p) => s + p.totalVotes, 0),
      })

    case "mentorship":
      return Response.json({
        matches: mentorshipMatches,
        activeMatches: mentorshipMatches.filter((m) => m.status === "active").length,
        suggestions: mentorshipMatches.filter((m) => m.status === "suggested"),
      })

    case "chats":
      return Response.json({
        chats: groupChats.map((gc) => ({
          ...gc,
          lastMessage: gc.messages[gc.messages.length - 1] || null,
          unread: Math.floor(Math.random() * 3),
        })),
      })

    default:
      return Response.json({
        overview: {
          clubs: { count: clubs.length, totalMembers: clubs.reduce((s, c) => s + c.members, 0) },
          forums: { posts: forumPosts.length, replies: forumPosts.reduce((s, p) => s + p.replies.length, 0) },
          polls: { active: polls.filter((p) => p.expiresAt > new Date()).length, totalVotes: polls.reduce((s, p) => s + p.totalVotes, 0) },
          mentorship: { active: mentorshipMatches.filter((m) => m.status === "active").length },
          chats: { groups: groupChats.length },
        },
      })
  }
}

// POST: create new forum post / poll / join club / send message
export async function POST(req: Request) {
  const body = await req.json()
  const { action } = body

  switch (action) {
    case "create_post":
      return Response.json({
        success: true,
        post: {
          id: `fp_${Date.now()}`,
          ...body.data,
          upvotes: 0,
          downvotes: 0,
          replies: [],
          createdAt: new Date(),
        },
        message: "Forum post created successfully",
      })

    case "create_poll":
      return Response.json({
        success: true,
        poll: {
          id: `poll_${Date.now()}`,
          ...body.data,
          totalVotes: 0,
        },
        message: "Poll created successfully",
      })

    case "join_club":
      return Response.json({
        success: true,
        message: `Successfully joined ${body.clubId}`,
      })

    case "send_message":
      return Response.json({
        success: true,
        message: {
          id: `msg_${Date.now()}`,
          ...body.data,
          timestamp: new Date(),
        },
      })

    case "vote_poll":
      return Response.json({
        success: true,
        message: "Vote recorded",
      })

    default:
      return Response.json({ error: "Unknown action" }, { status: 400 })
  }
}
