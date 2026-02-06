"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/auth/LoginPage"
import StudentDashboard from "@/components/dashboards/StudentDashboard"
import TeacherDashboard from "@/components/dashboards/TeacherDashboard"
import ParentDashboard from "@/components/dashboards/ParentDashboard"
import { Rocket, BookOpen, Brain, Users } from "lucide-react"

type UserRole = "student" | "faculty" | "staff" | null

interface User {
  id: string
  name: string
  role: UserRole
  email: string
  studentId?: string
  department?: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("campushub_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("campushub_user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("campushub_user")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-purple-900/30" />
        </div>

        <div className="absolute inset-0">
          {/* Twinkling stars */}
          {[...Array(100)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}

          {/* Shooting stars */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animation: `shootingStar 3s linear infinite`,
                animationDelay: `${i * 2}s`,
              }}
            />
          ))}

          {/* Nebula clouds */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div
          className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-400 via-cyan-500 to-purple-600 rounded-full opacity-30 shadow-2xl shadow-blue-500/20"
          style={{
            animation: "float 6s ease-in-out infinite",
            filter: "blur(0.5px)",
          }}
        />
        <div
          className="absolute bottom-32 right-32 w-32 h-32 bg-gradient-to-br from-emerald-400 via-green-500 to-blue-500 rounded-full opacity-40 shadow-2xl shadow-green-500/20"
          style={{
            animation: "float 8s ease-in-out infinite reverse",
            animationDelay: "1s",
            filter: "blur(0.5px)",
          }}
        />
        <div
          className="absolute top-1/2 right-20 w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full opacity-35 shadow-2xl shadow-orange-500/20"
          style={{
            animation: "float 5s ease-in-out infinite",
            animationDelay: "0.5s",
            filter: "blur(0.5px)",
          }}
        />
        <div
          className="absolute top-32 right-1/3 w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-full opacity-30 shadow-2xl shadow-pink-500/20"
          style={{
            animation: "float 7s ease-in-out infinite reverse",
            animationDelay: "2s",
            filter: "blur(0.5px)",
          }}
        />

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          <div className="relative mb-12">
            {/* Main logo with enhanced glow effect */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 via-pink-500 to-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full blur-xl opacity-60 animate-pulse" />
                <Rocket className="w-16 h-16 text-white relative z-10 animate-bounce" />
              </div>

              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "20s" }}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </div>
              <div
                className="absolute inset-0 animate-spin"
                style={{ animationDuration: "15s", animationDirection: "reverse" }}
              >
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "25s" }}>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-9 h-9 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced title with better gradient and animation */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent mb-4 animate-pulse font-sans">
              CampusHub
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-slate-400 rounded-full mx-auto mb-6 animate-pulse" />
            <p className="text-white/90 text-xl mb-2 font-medium">{"Your College Campus Portal"}</p>
            <p className="text-white/70 text-base">{"Loading your campus platform..."}</p>
          </div>

          {/* Enhanced loading animation */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce shadow-lg shadow-blue-400/50"
              style={{ animationDelay: "0s" }}
            />
            <div
              className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-4 h-4 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-bounce shadow-lg shadow-pink-400/50"
              style={{ animationDelay: "0.4s" }}
            />
          </div>

          {/* Progress bar */}
          <div className="w-64 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse"
              style={{ width: "60%", animation: "loadingBar 3s ease-in-out infinite" }}
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes shootingStar {
            0% {
              transform: translateX(-100px) translateY(0px);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateX(100vw) translateY(-100px);
              opacity: 0;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }
          
          @keyframes loadingBar {
            0% {
              width: 0%;
            }
            50% {
              width: 80%;
            }
            100% {
              width: 100%;
            }
          }
        `}</style>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  switch (user.role) {
    case "student":
      return <StudentDashboard user={user} onLogout={handleLogout} />
    case "faculty":
      return <TeacherDashboard user={user} onLogout={handleLogout} />
    case "staff":
      return <ParentDashboard user={user} onLogout={handleLogout} />
    default:
      return <LoginPage onLogin={handleLogin} />
  }
}
