"use client"

import React from "react"

import { useState } from "react"
import { Home, BookOpen, Calendar, MessageCircle, User, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NavTab {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
  active: boolean
}

interface BottomNavProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [navTabs] = useState<NavTab[]>([
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-6 h-6" />,
      badge: undefined,
      active: activeTab === "home",
    },
    {
      id: "courses",
      label: "Courses",
      icon: <BookOpen className="w-6 h-6" />,
      badge: undefined,
      active: activeTab === "courses",
    },
    {
      id: "planner",
      label: "Planner",
      icon: <Calendar className="w-6 h-6" />,
      badge: 3,
      active: activeTab === "planner",
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageCircle className="w-6 h-6" />,
      badge: 2,
      active: activeTab === "messages",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-6 h-6" />,
      badge: undefined,
      active: activeTab === "profile",
    },
  ])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex items-center justify-between gap-1 h-24">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "text-indigo-600 bg-gradient-to-br from-indigo-100/80 to-pink-100/80 shadow-lg scale-105"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
              }`}
            >
              <div className="relative">
                <div className={`transition-all duration-300 ${activeTab === tab.id ? 'drop-shadow-lg' : ''}`}>
                  {tab.icon}
                </div>
                {tab.badge && (
                  <Badge className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg animate-pulse">
                    {tab.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs font-bold whitespace-nowrap ${activeTab === tab.id ? "text-indigo-700" : "text-gray-700"}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full shadow-lg" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
