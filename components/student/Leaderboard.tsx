"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, Trophy, Medal, Award, Crown, Zap } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  xp: number
  rank: number
  belt: string
  ecoCoins: number
  avatar: string
  isCurrentUser?: boolean
}

interface LeaderboardProps {
  onClose: () => void
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [viewMode, setViewMode] = useState<"class" | "grade">("class")

  const classLeaderboard: LeaderboardEntry[] = [
    {
      id: "1",
      name: "Emma Wilson",
      xp: 1580,
      rank: 1,
      belt: "Gold",
      ecoCoins: 450,
      avatar: "EW",
    },
    {
      id: "2",
      name: "Liam Chen",
      xp: 1420,
      rank: 2,
      belt: "Silver",
      ecoCoins: 380,
      avatar: "LC",
    },
    {
      id: "3",
      name: "Alex Johnson",
      xp: 1250,
      rank: 3,
      belt: "Silver",
      ecoCoins: 320,
      avatar: "AJ",
      isCurrentUser: true,
    },
    {
      id: "4",
      name: "Sophia Davis",
      xp: 1180,
      rank: 4,
      belt: "Bronze",
      ecoCoins: 290,
      avatar: "SD",
    },
    {
      id: "5",
      name: "Noah Martinez",
      xp: 1120,
      rank: 5,
      belt: "Bronze",
      ecoCoins: 275,
      avatar: "NM",
    },
    {
      id: "6",
      name: "Olivia Brown",
      xp: 1050,
      rank: 6,
      belt: "Bronze",
      ecoCoins: 250,
      avatar: "OB",
    },
    {
      id: "7",
      name: "Ethan Taylor",
      xp: 980,
      rank: 7,
      belt: "White",
      ecoCoins: 220,
      avatar: "ET",
    },
    {
      id: "8",
      name: "Ava Anderson",
      xp: 920,
      rank: 8,
      belt: "White",
      ecoCoins: 200,
      avatar: "AA",
    },
  ]

  const gradeLeaderboard: LeaderboardEntry[] = [
    {
      id: "1",
      name: "Maya Patel",
      xp: 1850,
      rank: 1,
      belt: "Platinum",
      ecoCoins: 520,
      avatar: "MP",
    },
    {
      id: "2",
      name: "Ryan Kim",
      xp: 1720,
      rank: 2,
      belt: "Gold",
      ecoCoins: 480,
      avatar: "RK",
    },
    {
      id: "3",
      name: "Emma Wilson",
      xp: 1580,
      rank: 3,
      belt: "Gold",
      ecoCoins: 450,
      avatar: "EW",
    },
    // ... more entries
    {
      id: "12",
      name: "Alex Johnson",
      xp: 1250,
      rank: 12,
      belt: "Silver",
      ecoCoins: 320,
      avatar: "AJ",
      isCurrentUser: true,
    },
  ]

  const currentLeaderboard = viewMode === "class" ? classLeaderboard : gradeLeaderboard

  const getBeltColor = (belt: string) => {
    switch (belt) {
      case "Platinum":
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case "Silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case "Bronze":
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
      case "White":
        return "bg-white text-gray-800 border border-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-white shadow-2xl">
        <CardHeader className="flex-row items-center justify-between pb-3 border-b bg-gradient-to-r from-primary to-accent text-white">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Leaderboard
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* View Toggle */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "class" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("class")}
              className="flex-1"
            >
              Class 10A
            </Button>
            <Button
              variant={viewMode === "grade" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grade")}
              className="flex-1"
            >
              Grade 10
            </Button>
          </div>
        </div>

        {/* Leaderboard List */}
        <CardContent className="p-0 overflow-y-auto max-h-[500px]">
          {currentLeaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-4 border-b border-gray-100 transition-colors ${
                entry.isCurrentUser ? "bg-primary/5 border-primary/20" : "hover:bg-gray-50"
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8">{getRankIcon(entry.rank)}</div>

              {/* Avatar */}
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-semibold">
                  {entry.avatar}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold truncate ${entry.isCurrentUser ? "text-primary" : "text-gray-800"}`}>
                    {entry.name}
                    {entry.isCurrentUser && <span className="text-xs text-primary ml-1">(You)</span>}
                  </h3>
                  <Badge className={`${getBeltColor(entry.belt)} text-xs px-2 py-1`}>{entry.belt}</Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    {entry.xp} XP
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    {entry.ecoCoins} Coins
                  </div>
                </div>
              </div>

              {/* Progress to Next Rank */}
              {entry.rank > 1 && (
                <div className="text-right text-xs text-gray-500">
                  <div className="font-medium">{currentLeaderboard[entry.rank - 2]?.xp - entry.xp} XP behind</div>
                  <div>#{entry.rank - 1}</div>
                </div>
              )}
            </div>
          ))}
        </CardContent>

        {/* Current User Position (if not in top 8) */}
        {viewMode === "grade" && (
          <div className="p-4 border-t bg-primary/5">
            <div className="text-center text-sm text-gray-600">
              <p>
                Your position in Grade 10: <span className="font-semibold text-primary">#12 out of 156 students</span>
              </p>
              <p className="text-xs mt-1">Keep learning to climb higher! 🚀</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
