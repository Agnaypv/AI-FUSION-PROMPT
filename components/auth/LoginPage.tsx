"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen, Users, Mail, Lock } from "lucide-react"

type UserRole = "student" | "faculty" | "staff"

interface User {
  id: string
  name: string
  role: UserRole
  email: string
  studentId?: string
  department?: string
}

interface LoginPageProps {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<UserRole>("student")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password || !role) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const demoUsers = {
      student: {
        id: "student_001",
        name: "Sarah Chen",
        role: "student" as UserRole,
        email,
        studentId: "2024001234",
        department: "Computer Science",
      },
      faculty: {
        id: "faculty_001",
        name: "Dr. Michael Thompson",
        role: "faculty" as UserRole,
        email,
        department: "Computer Science",
      },
      staff: {
        id: "staff_001",
        name: "Jennifer Davis",
        role: "staff" as UserRole,
        email,
        department: "Student Services",
      },
    }

    onLogin(demoUsers[role])
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Column - Welcome Section */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Welcome to CampusHub</h1>
            <p className="text-xl text-slate-600">Your complete college campus management platform. Manage academics, events, and campus life all in one place.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4 p-4 rounded-lg bg-white border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">For Students</h3>
                <p className="text-sm text-slate-600">Courses, grades, events & campus resources</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg bg-white border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">For Faculty</h3>
                <p className="text-sm text-slate-600">Course management & student tracking</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-lg bg-white border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">For Staff</h3>
                <p className="text-sm text-slate-600">Administration & campus operations</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600">Need help? Contact IT Support or visit the help center</p>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-slate-900 rounded-2xl mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-slate-900">Sign In</CardTitle>
              <CardDescription className="text-center text-slate-600">Access your CampusHub account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900">Select Your Role</label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger className="h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <GraduationCap className="w-3 h-3 text-blue-600" />
                        </div>
                        <span>Student</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="faculty">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                          <BookOpen className="w-3 h-3 text-green-600" />
                        </div>
                        <span>Faculty</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="staff">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                          <Users className="w-3 h-3 text-purple-600" />
                        </div>
                        <span>Staff</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:ring-blue-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500 focus:ring-blue-500"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</button>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                disabled={!email || !password || !role || isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-slate-900 hover:from-blue-700 hover:to-slate-950 text-white font-semibold rounded-lg transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-600">Demo Login</span>
                </div>
              </div>

              {/* Demo Credentials */}
              <div className="grid grid-cols-1 gap-2">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-blue-600 text-white">Student</Badge>
                  </div>
                  <p className="text-xs text-slate-700 font-mono">demo@university.edu</p>
                  <p className="text-xs text-slate-700 font-mono">password123</p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-green-600 text-white">Faculty</Badge>
                  </div>
                  <p className="text-xs text-slate-700 font-mono">faculty@university.edu</p>
                  <p className="text-xs text-slate-700 font-mono">password123</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-purple-600 text-white">Staff</Badge>
                  </div>
                  <p className="text-xs text-slate-700 font-mono">staff@university.edu</p>
                  <p className="text-xs text-slate-700 font-mono">password123</p>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-slate-600 text-center">
                By signing in, you agree to our{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
