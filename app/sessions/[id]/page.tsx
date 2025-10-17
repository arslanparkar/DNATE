"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Target,
  Loader2,
} from "lucide-react"
import { sessionsApi } from "@/lib/api"

export default function SessionReviewPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true)
        const { session: sessionData } = await sessionsApi.getById(sessionId)
        setSession(sessionData)
      } catch (err: any) {
        console.error("[v0] Failed to fetch session:", err)
        setError(err.message || "Failed to load session details")
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchSession()
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading session details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <Card className="border-destructive/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                  <div>
                    <h3 className="mb-2 font-semibold text-destructive">Unable to Load Session</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{error || "Session not found"}</p>
                    <Link href="/sessions">
                      <Button variant="outline">Back to Sessions</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const confidencePercentage = ((session.confidenceRating || 0) / 5) * 100
  const qualityPercentage = ((session.qualityRating || 0) / 5) * 100
  const overallScore = ((confidencePercentage + qualityPercentage) / 2).toFixed(0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/sessions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sessions
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">Session Review</h1>
              <p className="text-muted-foreground">Detailed analysis of your practice session</p>
            </div>
            <Badge variant={session.status === "completed" ? "default" : "secondary"} className="text-sm">
              {session.status}
            </Badge>
          </div>
        </div>

        {/* Overall Performance Card */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="mb-4">
                <div className="text-6xl font-bold text-primary">{overallScore}%</div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
              <Progress value={Number(overallScore)} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Session Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle>Session Information</CardTitle>
                <CardDescription>Details about this practice session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.createdAt).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor((session.duration || 0) / 60)} minutes {(session.duration || 0) % 60} seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Physician</p>
                    <p className="text-sm text-muted-foreground">{session.personaId || "Practice Physician"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Your self-assessment ratings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Confidence Level</span>
                    <span className="text-2xl font-bold text-primary">{session.confidenceRating || 0}/5</span>
                  </div>
                  <Progress value={confidencePercentage} className="h-3" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {confidencePercentage >= 80
                      ? "Excellent confidence!"
                      : confidencePercentage >= 60
                        ? "Good confidence level"
                        : "Room for improvement"}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Response Quality</span>
                    <span className="text-2xl font-bold text-success">{session.qualityRating || 0}/5</span>
                  </div>
                  <Progress value={qualityPercentage} className="h-3" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {qualityPercentage >= 80
                      ? "Outstanding quality!"
                      : qualityPercentage >= 60
                        ? "Solid response quality"
                        : "Focus on improving clarity"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Notes */}
            {session.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Your Notes & Reflections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <p className="text-sm leading-relaxed text-foreground">{session.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
                  <span className="text-sm font-medium">Questions Answered</span>
                  <span className="text-xl font-bold text-primary">{session.questions?.length || 0}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-success/10 p-3">
                  <span className="text-sm font-medium">Avg Response Time</span>
                  <span className="text-xl font-bold text-success">
                    {session.duration && session.questions?.length
                      ? Math.round(session.duration / session.questions.length)
                      : 0}
                    s
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-chart-3/10 p-3">
                  <span className="text-sm font-medium">Session Type</span>
                  <span className="text-sm font-semibold text-chart-3">Practice</span>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-success flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {confidencePercentage < 60 ? "Practice more to build confidence" : "Maintain your confidence level"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-success flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {qualityPercentage < 60 ? "Focus on structuring your responses" : "Keep up the quality work"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-success flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Review resources for continuous improvement</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/practice">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Practice Again
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Analytics
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="outline" className="w-full bg-transparent">
                    Study Resources
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
