"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { TrendingUp, Target, Clock, Award, Video, BarChart3, BookOpen, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { sessionsApi } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return

      try {
        const { sessions: sessionsData } = await sessionsApi.getAll()
        setSessions(sessionsData)
      } catch (err) {
        console.error("Failed to fetch sessions:", err)
        setError("Failed to load sessions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [user])

  const stats = {
    totalSessions: sessions.length,
    avgConfidence:
      sessions.length > 0
        ? (sessions.reduce((sum, s) => sum + (s.confidenceRating || 0), 0) / sessions.length).toFixed(1)
        : 0,
    currentStreak: 0, // TODO: Calculate from session dates
    totalTime: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
    weeklyGoal: 5,
    completedThisWeek: sessions.filter((s) => {
      const sessionDate = new Date(s.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= weekAgo
    }).length,
  }

  const recentSessions = sessions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0077E6] border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-[#1A1A1A]">Welcome back, {user.name}</h1>
          <p className="text-lg text-gray-600">Ready to continue your MSL interview preparation?</p>
        </div>

        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600 border border-red-200">{error}</div>}

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-[#0077E6] shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Sessions</CardDescription>
                <Video className="h-5 w-5 text-[#0077E6]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#0077E6]">{stats.totalSessions}</div>
              <p className="mt-1 text-xs text-gray-500">
                <TrendingUp className="mr-1 inline h-3 w-3" />+{stats.completedThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#28A745] shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Avg Confidence</CardDescription>
                <Award className="h-5 w-5 text-[#28A745]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#28A745]">
                {stats.avgConfidence}
                <span className="text-lg text-gray-500">/5</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {stats.totalSessions > 0 ? "Great progress" : "Start practicing"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#FFC107] shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Current Streak</CardDescription>
                <Target className="h-5 w-5 text-[#FFC107]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#FFC107]">
                {stats.currentStreak}
                <span className="text-lg text-gray-500"> days</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#0077E6] shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Time</CardDescription>
                <Clock className="h-5 w-5 text-[#0077E6]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#0077E6]">
                {Math.round(stats.totalTime / 60)}
                <span className="text-lg text-gray-500"> min</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">{Math.round(stats.totalTime / 3600)} hours total</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            {/* Recent Sessions */}
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Practice Sessions</CardTitle>
                    <CardDescription>Your latest interview practice recordings</CardDescription>
                  </div>
                  <Link href="/sessions">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">No practice sessions yet</p>
                    <Link href="/practice">
                      <Button className="bg-[#0077E6] hover:bg-[#0056b3]">Start Your First Session</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        className="group flex items-start justify-between rounded-lg border p-4 transition-all hover:border-[#0077E6] hover:bg-[#F0F8FF]"
                      >
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="secondary" className="bg-[#E6F4FF] text-[#0077E6]">
                              {session.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(session.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mb-3 text-sm text-[#1A1A1A]">Session with {session.personaId}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">Confidence:</span>
                              <span className="font-semibold text-[#28A745]">
                                {session.confidenceRating || "N/A"}/5
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">Quality:</span>
                              <span className="font-semibold text-[#0077E6]">{session.qualityRating || "N/A"}/5</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/sessions/${session.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="group-hover:border-[#0077E6] group-hover:text-[#0077E6] bg-transparent"
                          >
                            Review
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Weekly Goal */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Goal</CardTitle>
                <CardDescription>Track your practice consistency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-center">
                  <div className="text-4xl font-bold text-[#0077E6]">
                    {stats.completedThisWeek}/{stats.weeklyGoal}
                  </div>
                  <p className="text-sm text-gray-600">Sessions completed</p>
                </div>
                <Progress value={(stats.completedThisWeek / stats.weeklyGoal) * 100} className="mb-4 h-3" />
                <p className="text-center text-sm text-gray-600">
                  {stats.weeklyGoal - stats.completedThisWeek > 0
                    ? `${stats.weeklyGoal - stats.completedThisWeek} more to reach your goal`
                    : "Goal achieved! 🎉"}
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-[#0077E6] bg-gradient-to-br from-[#0077E6] to-[#0056b3] text-white shadow-md">
              <CardHeader>
                <CardTitle className="text-lg text-white">Ready to Practice?</CardTitle>
                <CardDescription className="text-gray-100">Start a new session now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/practice">
                  <Button size="lg" className="w-full bg-white text-[#0077E6] hover:bg-gray-100">
                    <Video className="mr-2 h-5 w-5" />
                    Start Practice Session
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button size="sm" variant="ghost" className="w-full text-white hover:bg-white/20">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button size="sm" variant="ghost" className="w-full text-white hover:bg-white/20">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
