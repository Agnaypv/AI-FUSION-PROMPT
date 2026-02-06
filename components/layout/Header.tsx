"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, LogOut, Bell, Settings, X, Calendar, Clock, AlertCircle } from "lucide-react"

interface User {
  id: string
  name: string
  role: string
  email: string
  studentId?: string
  department?: string
}

interface HeaderProps {
  user: User
  onLogout: () => void
  onShowLeaderboard?: () => void
}

interface Notification {
  id: string
  title: string
  message: string
  type: "academic" | "event" | "system" | "general"
  time: string
  isRead: boolean
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Course Registration Open",
      message: "Spring semester course registration is now open. Register by January 31st.",
      type: "academic",
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: "2",
      title: "Campus Event This Weekend",
      message: "Annual Spring Carnival happening Saturday at the main lawn. Free food and activities!",
      type: "event",
      time: "4 hours ago",
      isRead: false,
    },
    {
      id: "3",
      title: "Assignment Due Tomorrow",
      message: "Your Computer Science project is due by 5 PM tomorrow.",
      type: "academic",
      time: "1 day ago",
      isRead: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getRoleColor = () => {
    switch (user.role) {
      case "student":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "faculty":
        return "bg-green-100 text-green-700 border-green-300"
      case "staff":
        return "bg-purple-100 text-purple-700 border-purple-300"
      default:
        return "bg-slate-100 text-slate-700 border-slate-300"
    }
  }

  const getRoleLabel = () => {
    switch (user.role) {
      case "student":
        return "Student"
      case "faculty":
        return "Faculty"
      case "staff":
        return "Staff"
      default:
        return "User"
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-slate-900 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">CampusHub</h1>
            <p className="text-xs text-slate-500">College Platform</p>
          </div>
        </div>

        {/* Center Section - User Info */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getRoleColor()}>
                {getRoleLabel()}
              </Badge>
              {user.studentId && <span className="text-xs text-slate-600">{user.studentId}</span>}
              {user.department && <span className="text-xs text-slate-600">{user.department}</span>}
            </div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-slate-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0)}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative hover:bg-slate-100"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNotifications(false)}
                    className="h-6 w-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notification.isRead ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {notification.type === "academic" && (
                              <AlertCircle className="w-5 h-5 text-blue-600" />
                            )}
                            {notification.type === "event" && (
                              <Calendar className="w-5 h-5 text-green-600" />
                            )}
                            {notification.type === "system" && (
                              <Bell className="w-5 h-5 text-orange-600" />
                            )}
                            {notification.type === "general" && (
                              <Bell className="w-5 h-5 text-slate-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-900">{notification.title}</h4>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-slate-200">
                  <Button variant="outline" className="w-full text-sm bg-transparent">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="hover:bg-slate-100">
            <Settings className="w-5 h-5 text-slate-600" />
          </Button>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2 text-slate-700 border-slate-300 hover:bg-slate-50 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
