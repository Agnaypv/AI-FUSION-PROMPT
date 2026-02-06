"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/nexus/auth-context"
import {
  Users, Trophy, Heart, Shield, Wrench, Brain,
  BookOpen, GraduationCap, Dumbbell, Award, MessageSquare,
  Vote, Handshake, Bell, Gamepad2, BarChart3, FileText,
  Library, CreditCard, CalendarCheck, Sparkles, AlertTriangle,
  Activity, TrendingUp, ChevronRight, Loader2, RefreshCw,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

// ---- Shared section header (matches RightNow pattern) ----
function SectionHeader({
  icon: Icon,
  title,
  badge: badgeText,
}: {
  icon: typeof Users
  title: string
  badge?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-nexus-gold/70" />
        <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h2>
      </div>
      {badgeText && (
        <span className="rounded-full bg-nexus-gold/10 px-2 py-0.5 font-display text-[9px] font-medium tracking-wider text-nexus-gold">
          {badgeText}
        </span>
      )}
    </div>
  )
}

// ---- Quick stat card ----
function StatCard({ label, value, icon: Icon, color = "text-nexus-gold" }: {
  label: string; value: string | number; icon: typeof Users; color?: string
}) {
  return (
    <div className="nexus-card flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-nexus-gold/10">
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div>
        <p className="font-display text-lg font-bold text-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

// =================== COMMUNITY TAB ===================
function CommunitySection() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  useEffect(() => {
    fetch("/api/beyond/social").then((r) => r.json()).then(setData)
  }, [])

  if (!data) return <LoadingState />
  const ov = data.overview as Record<string, Record<string, number>>

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Clubs" value={ov.clubs?.count ?? 0} icon={Users} />
        <StatCard label="Forum Posts" value={ov.forums?.posts ?? 0} icon={MessageSquare} />
        <StatCard label="Active Polls" value={ov.polls?.active ?? 0} icon={Vote} />
        <StatCard label="Mentorships" value={ov.mentorship?.active ?? 0} icon={Handshake} />
      </div>

      <SectionHeader icon={MessageSquare} title="Recent Forum Discussions" badge="LIVE" />
      <ForumPreview />

      <SectionHeader icon={Vote} title="Active Polls" />
      <PollPreview />

      <SectionHeader icon={Users} title="Clubs & Events" />
      <ClubPreview />
    </div>
  )
}

function ForumPreview() {
  const [posts, setPosts] = useState<Record<string, unknown>[]>([])
  useEffect(() => {
    fetch("/api/beyond/social?module=forums")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {posts.slice(0, 3).map((p) => (
        <div key={p.id as string} className="nexus-card flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">{p.title as string}</p>
            <Badge variant="secondary" className="text-[9px]">{p.category as string}</Badge>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{p.content as string}</p>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>{p.isAnonymous ? "Anonymous" : p.authorName as string}</span>
            <span>{p.upvotes as number} upvotes</span>
            <span>{(p.replies as unknown[])?.length || 0} replies</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function PollPreview() {
  const [polls, setPolls] = useState<Record<string, unknown>[]>([])
  useEffect(() => {
    fetch("/api/beyond/social?module=polls")
      .then((r) => r.json())
      .then((d) => setPolls(d.polls || []))
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {polls.slice(0, 2).map((p) => (
        <div key={p.id as string} className="nexus-card">
          <p className="text-sm font-medium text-foreground">{p.question as string}</p>
          <div className="mt-2 flex flex-col gap-1.5">
            {(p.options as { id: string; text: string; votes: number }[])?.map((opt) => {
              const total = p.totalVotes as number || 1
              const pct = Math.round((opt.votes / total) * 100)
              return (
                <div key={opt.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{opt.text}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-0.5 h-1.5" />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">{p.totalVotes as number} votes</p>
        </div>
      ))}
    </div>
  )
}

function ClubPreview() {
  const [clubs, setClubs] = useState<Record<string, unknown>[]>([])
  useEffect(() => {
    fetch("/api/beyond/social?module=clubs")
      .then((r) => r.json())
      .then((d) => setClubs(d.clubs || []))
  }, [])

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {clubs.slice(0, 4).map((c) => (
        <div key={c.id as string} className="nexus-card flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{c.name as string}</p>
            <Badge variant="outline" className="text-[9px]">{c.category as string}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{c.description as string}</p>
          <p className="text-[10px] text-muted-foreground">{c.members as number} members</p>
        </div>
      ))}
    </div>
  )
}

// =================== GAMIFICATION TAB ===================
function GamificationSection() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  useEffect(() => {
    fetch("/api/beyond/gamification").then((r) => r.json()).then(setData)
  }, [])

  if (!data) return <LoadingState />
  const profile = data.profile as Record<string, unknown>
  const progress = profile?.levelProgress as Record<string, number>

  return (
    <div className="flex flex-col gap-4">
      {/* Profile card */}
      <div className="nexus-card-elevated">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-nexus-gold">Level {profile?.level as number}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{(profile?.points as number)?.toLocaleString()} pts</p>
            <p className="text-xs text-muted-foreground">{profile?.streak as number}-day streak</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-nexus-gold/10 nexus-glow">
            <Trophy className="h-7 w-7 text-nexus-gold" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Level {progress?.currentLevel}</span>
            <span>{progress?.progressPercent}%</span>
          </div>
          <Progress value={progress?.progressPercent || 0} className="mt-1 h-2" />
        </div>
      </div>

      <SectionHeader icon={Award} title="Badges" badge={`${(profile?.badges as unknown[])?.length || 0} EARNED`} />
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {((profile?.badges as { id: string; name: string; description: string; category: string }[]) || []).map((b) => (
          <div key={b.id} className="nexus-card flex flex-col items-center gap-1 text-center">
            <Award className="h-5 w-5 text-nexus-gold" />
            <p className="text-xs font-semibold text-foreground">{b.name}</p>
            <p className="text-[10px] text-muted-foreground">{b.description}</p>
          </div>
        ))}
      </div>

      <SectionHeader icon={BarChart3} title="Leaderboard" badge="TOP 5" />
      <LeaderboardList data={(data.topLeaderboard || []) as Record<string, unknown>[]} />
    </div>
  )
}

function LeaderboardList({ data }: { data: Record<string, unknown>[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      {data.map((e, i) => (
        <div key={e.userId as string} className="nexus-card flex items-center gap-3">
          <span className={`font-display text-sm font-bold ${i === 0 ? "text-nexus-gold" : "text-muted-foreground"}`}>
            #{e.rank as number}
          </span>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">{e.userName as string}</p>
            <p className="text-[10px] text-muted-foreground">{e.department as string}</p>
          </div>
          <span className="font-display text-xs font-semibold text-foreground">{(e.points as number)?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

// =================== WELLNESS TAB ===================
function WellnessSection() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  useEffect(() => {
    fetch("/api/beyond/wellness").then((r) => r.json()).then(setData)
  }, [])

  if (!data) return <LoadingState />
  const reminders = (data.reminders || []) as { id: string; type: string; message: string; scheduledTime: string; isActive: boolean }[]
  const sports = (data.sports || []) as Record<string, unknown>[]
  const partners = (data.partners || []) as { userId: string; userName: string; sport: string; schedule: string; matchScore: number }[]

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader icon={Bell} title="Active Reminders" badge={`${reminders.length} SET`} />
      <div className="flex flex-col gap-2">
        {reminders.map((r) => (
          <div key={r.id} className="nexus-card flex items-center gap-3">
            <Heart className="h-4 w-4 text-nexus-success" />
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">{r.message}</p>
              <p className="text-[10px] text-muted-foreground">{r.scheduledTime} -- {r.type}</p>
            </div>
          </div>
        ))}
      </div>

      <SectionHeader icon={Gamepad2} title="Sports Slots" badge={`${sports.length} UPCOMING`} />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {sports.map((s) => (
          <div key={s.id as string} className="nexus-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{s.sport as string}</p>
              <Badge variant="secondary" className="text-[9px]">
                {s.currentPlayers as number}/{s.maxPlayers as number}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{s.facility as string}</p>
            <p className="text-[10px] text-muted-foreground">{s.startTime as string} - {s.endTime as string}</p>
          </div>
        ))}
      </div>

      <SectionHeader icon={Dumbbell} title="Workout Partners" />
      <div className="flex flex-col gap-2">
        {partners.map((p) => (
          <div key={p.userId} className="nexus-card flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">{p.userName}</p>
              <p className="text-[10px] text-muted-foreground">{p.sport} -- {p.schedule}</p>
            </div>
            <span className="font-display text-[10px] font-semibold text-nexus-gold">{p.matchScore}% match</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// =================== ADMIN TAB ===================
function AdminSection() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  useEffect(() => {
    fetch("/api/beyond/admin").then((r) => r.json()).then(setData)
  }, [])

  if (!data) return <LoadingState />
  const ov = data.overview as Record<string, Record<string, number | string>>

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Fee Due" value={`Rs.${(ov.fees?.totalDue as number || 0).toLocaleString()}`} icon={CreditCard} color="text-nexus-warn" />
        <StatCard label="Books Reserved" value={ov.library?.reserved ?? 0} icon={Library} />
        <StatCard label="Attendance" value={`${ov.attendance?.overall ?? 0}%`} icon={CalendarCheck} color={Number(ov.attendance?.overall) >= 80 ? "text-nexus-success" : "text-nexus-warn"} />
        <StatCard label="Scholarships Open" value={ov.scholarships?.open ?? 0} icon={GraduationCap} />
      </div>

      <SectionHeader icon={CalendarCheck} title="Attendance Breakdown" />
      <AttendanceBreakdown />

      <SectionHeader icon={BookOpen} title="Scholarship Deadlines" />
      <ScholarshipList />

      <SectionHeader icon={FileText} title="Leave Applications" />
      <LeaveList />
    </div>
  )
}

function AttendanceBreakdown() {
  const [records, setRecords] = useState<{ subject: string; percentage: number; subjectCode: string }[]>([])
  useEffect(() => {
    fetch("/api/beyond/admin?module=attendance")
      .then((r) => r.json())
      .then((d) => setRecords(d.records || []))
  }, [])

  return (
    <div className="flex flex-col gap-1.5">
      {records.map((r) => (
        <div key={r.subjectCode} className="nexus-card flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{r.subject}</span>
              <span className={r.percentage >= 80 ? "text-nexus-success" : "text-nexus-warn"}>{r.percentage}%</span>
            </div>
            <Progress value={r.percentage} className="mt-1 h-1.5" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ScholarshipList() {
  const [data, setData] = useState<{ name: string; provider: string; amount: number; deadline: string; status: string }[]>([])
  useEffect(() => {
    fetch("/api/beyond/admin?module=scholarships")
      .then((r) => r.json())
      .then((d) => setData(d.scholarships || []))
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {data.map((s) => (
        <div key={s.name} className="nexus-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground">{s.name}</p>
            <p className="text-[10px] text-muted-foreground">{s.provider} -- Rs.{s.amount.toLocaleString()}</p>
          </div>
          <Badge variant={s.status === "open" ? "default" : "secondary"} className="text-[9px]">{s.status}</Badge>
        </div>
      ))}
    </div>
  )
}

function LeaveList() {
  const [apps, setApps] = useState<{ id: string; type: string; reason: string; status: string }[]>([])
  useEffect(() => {
    fetch("/api/beyond/admin?module=leave")
      .then((r) => r.json())
      .then((d) => setApps(d.applications || []))
  }, [])

  return (
    <div className="flex flex-col gap-2">
      {apps.map((a) => (
        <div key={a.id} className="nexus-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground capitalize">{a.type} Leave</p>
            <p className="text-[10px] text-muted-foreground">{a.reason}</p>
          </div>
          <Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"} className="text-[9px]">
            {a.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}

// =================== UTILITIES TAB ===================
function UtilitySection() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  useEffect(() => {
    fetch("/api/beyond/utility").then((r) => r.json()).then(setData)
  }, [])

  if (!data) return <LoadingState />
  const ov = data.overview as Record<string, Record<string, number | boolean>>

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Laundry Free" value={`${ov.laundry?.available ?? 0}/${ov.laundry?.total ?? 0}`} icon={Wrench} />
        <StatCard label="Maint. Requests" value={ov.maintenance?.openRequests ?? 0} icon={AlertTriangle} color="text-nexus-warn" />
        <StatCard label="Night Canteen" value={ov.nightCanteen?.isOpen ? "Open" : "Closed"} icon={Sparkles} color={ov.nightCanteen?.isOpen ? "text-nexus-success" : "text-muted-foreground"} />
        <StatCard label="Safe Companions" value={ov.safety?.companionsAvailable ?? 0} icon={Shield} color="text-nexus-info" />
      </div>

      <SectionHeader icon={Wrench} title="Laundry Status" badge="REAL-TIME" />
      <LaundryStatus />

      <SectionHeader icon={Shield} title="Safety & SOS" />
      <SafetySection />
    </div>
  )
}

function LaundryStatus() {
  const [machines, setMachines] = useState<{ id: string; location: string; type: string; status: string; waitTime: number }[]>([])
  useEffect(() => {
    fetch("/api/beyond/utility?module=laundry")
      .then((r) => r.json())
      .then((d) => setMachines(d.machines || []))
  }, [])

  const statusColor = (s: string) => s === "available" ? "text-nexus-success" : s === "in_use" ? "text-nexus-warn" : "text-nexus-urgent"

  return (
    <div className="flex flex-col gap-1.5">
      {machines.map((m) => (
        <div key={m.id} className="nexus-card flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-foreground capitalize">{m.type} -- {m.location}</p>
            {m.waitTime > 0 && <p className="text-[10px] text-muted-foreground">Free in ~{m.waitTime}m</p>}
          </div>
          <span className={`text-[10px] font-semibold uppercase ${statusColor(m.status)}`}>{m.status.replace("_", " ")}</span>
        </div>
      ))}
    </div>
  )
}

function SafetySection() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <button type="button" className="nexus-card-elevated flex items-center gap-3 text-left transition-transform hover:scale-[1.01]">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/15">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <p className="text-sm font-semibold text-destructive">SOS Emergency</p>
          <p className="text-[10px] text-muted-foreground">Tap to alert campus security</p>
        </div>
      </button>
      <button type="button" className="nexus-card-elevated flex items-center gap-3 text-left transition-transform hover:scale-[1.01]">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nexus-info/15">
          <Shield className="h-5 w-5 text-nexus-info" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Safe Walk</p>
          <p className="text-[10px] text-muted-foreground">Request a walking companion</p>
        </div>
      </button>
    </div>
  )
}

// =================== AI INSIGHTS TAB ===================
function AIInsightsSection() {
  const [predictions, setPredictions] = useState<Record<string, unknown> | null>(null)
  const [sentiment, setSentiment] = useState<Record<string, unknown> | null>(null)
  const [summaries, setSummaries] = useState<Record<string, unknown> | null>(null)
  const [recommendations, setRecommendations] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    fetch("/api/beyond/predict").then((r) => r.json()).then(setPredictions)
    fetch("/api/beyond/sentiment").then((r) => r.json()).then(setSentiment)
    fetch("/api/beyond/summary").then((r) => r.json()).then(setSummaries)
    fetch("/api/beyond/recommend").then((r) => r.json()).then((d) => setRecommendations(d.recommendations || []))
  }, [])

  if (!predictions || !sentiment) return <LoadingState />
  const mood = sentiment.current as Record<string, unknown>

  return (
    <div className="flex flex-col gap-4">
      {/* Campus Mood */}
      <div className="nexus-card-elevated">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-nexus-gold" />
            <span className="font-display text-xs font-semibold uppercase tracking-wider text-foreground">Campus Mood</span>
          </div>
          <Badge variant="secondary" className="text-[9px]">{mood?.moodLabel as string}</Badge>
        </div>
        <p className="mt-2 text-2xl font-bold text-foreground">{(mood?.overall as number)?.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">Trend: {mood?.trend as string} | {mood?.sampleSize as number} data points</p>
      </div>

      {/* Predictions */}
      <SectionHeader icon={Brain} title="Course Difficulty Predictions" />
      <div className="flex flex-col gap-2">
        {((predictions.difficulty as { subject: string; difficultyScore: string; recommendation: string; confidence: number }[]) || []).map((p) => (
          <div key={p.subject} className="nexus-card flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">{p.subject}</p>
                <Badge variant={p.difficultyScore === "high" ? "destructive" : p.difficultyScore === "medium" ? "default" : "secondary"} className="text-[9px]">
                  {p.difficultyScore}
                </Badge>
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{p.recommendation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Forecasts */}
      <SectionHeader icon={TrendingUp} title="Grade Forecast" />
      <div className="flex flex-col gap-2">
        {((predictions.gradeForecast as { subject: string; projectedGrade: string; projectedPercentage: number; explanation: string }[]) || []).map((f) => (
          <div key={f.subject} className="nexus-card flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">{f.subject}</p>
                <span className="font-display text-sm font-bold text-nexus-gold">{f.projectedGrade}</span>
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{f.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <SectionHeader icon={Sparkles} title="AI Recommendations" badge={`${recommendations.length} SIGNALS`} />
      <div className="flex flex-col gap-2">
        {recommendations.slice(0, 5).map((r) => (
          <div key={r.id as string} className="nexus-card flex items-center gap-3">
            <div className={`nexus-signal-dot ${
              (r.type as string) === "alert" ? "bg-nexus-urgent" :
              (r.type as string) === "action" ? "bg-nexus-warn" : "bg-nexus-info"
            }`} />
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">{r.title as string}</p>
              <p className="text-[10px] text-muted-foreground">{r.description as string}</p>
            </div>
            <span className="font-display text-[9px] font-semibold text-muted-foreground">{r.score as number}/100</span>
          </div>
        ))}
      </div>

      {/* NLG Summaries */}
      {summaries && (
        <>
          <SectionHeader icon={FileText} title="Auto-Generated Summaries" />
          <NLGSummaries data={summaries} />
        </>
      )}
    </div>
  )
}

function NLGSummaries({ data }: { data: Record<string, unknown> }) {
  const summaries = (data.summaries || []) as { type: string; period: string; content: string; highlights: string[] }[]

  return (
    <div className="flex flex-col gap-2">
      {summaries.map((s) => (
        <div key={s.type} className="nexus-card">
          <p className="text-xs font-semibold text-foreground capitalize">{s.type.replace(/_/g, " ")}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{s.content.replace(/\*\*/g, "")}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {s.highlights.slice(0, 3).map((h, i) => (
              <span key={`${s.type}-h${i}`} className="rounded bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">{h}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =================== LOADING STATE ===================
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-nexus-gold" />
      <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
    </div>
  )
}

// =================== MAIN BEYOND HUB ===================
export function BeyondHub() {
  const { user } = useAuth()

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-nexus-gold/15 nexus-glow">
            <Sparkles className="h-4 w-4 text-nexus-gold" />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold tracking-wider text-foreground">BEYOND HUB</h1>
            <p className="text-[10px] text-muted-foreground">Innovation modules beyond the core pillars</p>
          </div>
        </div>
      </div>

      {/* Tabbed interface */}
      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-5">
          <TabsTrigger value="ai" className="text-[10px] sm:text-xs">
            <Brain className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">AI</span> Insights
          </TabsTrigger>
          <TabsTrigger value="community" className="text-[10px] sm:text-xs">
            <Users className="mr-1 h-3 w-3" />
            Community
          </TabsTrigger>
          <TabsTrigger value="gamification" className="text-[10px] sm:text-xs">
            <Trophy className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">Gamify</span>
          </TabsTrigger>
          <TabsTrigger value="wellness" className="text-[10px] sm:text-xs">
            <Heart className="mr-1 h-3 w-3" />
            Wellness
          </TabsTrigger>
          <TabsTrigger value="admin" className="text-[10px] sm:text-xs">
            <Shield className="mr-1 h-3 w-3" />
            Admin
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100dvh-14rem)] lg:h-[calc(100dvh-11rem)]">
          <TabsContent value="ai" className="mt-0"><AIInsightsSection /></TabsContent>
          <TabsContent value="community" className="mt-0"><CommunitySection /></TabsContent>
          <TabsContent value="gamification" className="mt-0"><GamificationSection /></TabsContent>
          <TabsContent value="wellness" className="mt-0"><WellnessSection /></TabsContent>
          <TabsContent value="admin" className="mt-0">
            <AdminSection />
            <div className="mt-6" />
            <UtilitySection />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
