"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { TrendingUp, Clock, Award, Video, BarChart3, BookOpen, ArrowRight, Flame } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { DUMMY_SESSIONS, getCategoryStats, getStreakData } from "@/lib/dummy-data"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [sessions] = useState(DUMMY_SESSIONS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const stats = {
    totalSessions: sessions.length,
    avgConfidence:
      sessions.length > 0
        ? (sessions.reduce((sum, s) => sum + (s.confidenceRating || 0), 0) / sessions.length).toFixed(1)
        : "0",
    currentStreak: getStreakData(sessions).currentStreak,
    longestStreak: getStreakData(sessions).longestStreak,
    totalTime: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
    weeklyGoal: 5,
    completedThisWeek: sessions.filter((s) => {
      const sessionDate = new Date(s.createdAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= weekAgo
    }).length,
    avgScore:
      sessions.length > 0
        ? Math.round(sessions.reduce((sum, s) => sum + (s.analysis?.overallScore || 0), 0) / sessions.length)
        : 0,
  }

  const categoryStats = getCategoryStats(sessions)
  const recentSessions = sessions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Welcome back, {user.name}</h1>
          <p className="text-lg text-muted-foreground">Ready to continue your MSL interview preparation?</p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Sessions</CardDescription>
                <Video className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalSessions}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                <TrendingUp className="mr-1 inline h-3 w-3" />+{stats.completedThisWeek} this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Avg Performance</CardDescription>
                <Award className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {stats.avgScore}
                <span className="text-lg text-muted-foreground">%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Confidence: {stats.avgConfidence}/5</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-3 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Current Streak</CardDescription>
                <Flame className="h-5 w-5 text-chart-3" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-3">
                {stats.currentStreak}
                <span className="text-lg text-muted-foreground"> days</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Best: {stats.longestStreak} days</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">Total Time</CardDescription>
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Math.round(stats.totalTime / 60)}
                <span className="text-lg text-muted-foreground"> min</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{(stats.totalTime / 3600).toFixed(1)} hours total</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Performance by Category</CardTitle>
                <CardDescription>Track your progress across question types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryStats.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{cat.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                          {cat.sessionsCompleted}/{cat.totalQuestions} completed
                        </span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {cat.avgConfidence > 0 ? `${cat.avgConfidence}/5` : "Not started"}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={cat.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="shadow-sm">
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
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="group flex items-start justify-between rounded-lg border p-4 transition-all hover:border-primary/50 hover:bg-accent/50"
                    >
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Completed
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mb-3 text-sm text-foreground font-medium">
                          Score: {session.analysis?.overallScore}% • Confidence: {session.confidenceRating}/5
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{session.duration}s</span>
                          <span>•</span>
                          <span>{session.personaId}</span>
                        </div>
                      </div>
                      <Link href={`/sessions/${session.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="group-hover:border-primary group-hover:text-primary bg-transparent"
                        >
                          Review
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Weekly Goal */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Goal</CardTitle>
                <CardDescription>Track your practice consistency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-center">
                  <div className="text-4xl font-bold text-primary">
                    {stats.completedThisWeek}/{stats.weeklyGoal}
                  </div>
                  <p className="text-sm text-muted-foreground">Sessions completed</p>
                </div>
                <Progress value={(stats.completedThisWeek / stats.weeklyGoal) * 100} className="mb-4 h-3" />
                <p className="text-center text-sm text-muted-foreground">
                  {stats.weeklyGoal - stats.completedThisWeek > 0
                    ? `${stats.weeklyGoal - stats.completedThisWeek} more to reach your goal`
                    : "Goal achieved! 🎉"}
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Ready to Practice?</CardTitle>
                <CardDescription>Start a new session now</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/practice">
                  <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Video className="mr-2 h-5 w-5" />
                    Start Practice Session
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
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
