"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
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
  Play,
  BarChart2,
} from "lucide-react"
import { DUMMY_SESSIONS, DUMMY_QUESTIONS } from "@/lib/dummy-data"

export default function SessionReviewPage() {
  const params = useParams()
  const sessionId = params.id as string
  const [session, setSession] = useState<any>(null)
  const [question, setQuestion] = useState<any>(null)

  useEffect(() => {
    const foundSession = DUMMY_SESSIONS.find((s) => s.id === sessionId)
    if (foundSession) {
      setSession(foundSession)
      const foundQuestion = DUMMY_QUESTIONS.find((q) => q.id === foundSession.questionId)
      setQuestion(foundQuestion)
    }
  }, [sessionId])

  if (!session) {
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
                    <h3 className="mb-2 font-semibold text-destructive">Session Not Found</h3>
                    <p className="mb-4 text-sm text-muted-foreground">The session you're looking for doesn't exist.</p>
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

  const analysis = session.analysis || {}
  const overallScore = analysis.overallScore || 0

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
            <Badge variant="default" className="bg-success text-white">
              Completed
            </Badge>
          </div>
        </div>

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
              <Progress value={overallScore} className="h-3 mb-4" />
              <p className="text-sm text-muted-foreground">
                {overallScore >= 90
                  ? "Outstanding performance!"
                  : overallScore >= 80
                    ? "Excellent work!"
                    : overallScore >= 70
                      ? "Good job!"
                      : "Keep practicing!"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Session Details */}
          <div className="space-y-6 lg:col-span-2">
            {question && (
              <Card>
                <CardHeader>
                  <CardTitle>Question Practiced</CardTitle>
                  <CardDescription>The scenario you responded to</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Badge className="mb-3">{question.category}</Badge>
                    <p className="text-lg font-medium text-foreground leading-relaxed">{question.text}</p>
                  </div>
                  <div className="rounded-lg bg-accent/50 p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Context:</strong> {question.context}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Difficulty:</strong> {question.difficulty}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    <p className="text-sm text-muted-foreground">{session.duration} seconds</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Physician Persona</p>
                    <p className="text-sm text-muted-foreground">{session.personaId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3 bg-accent/30">
                  <Play className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Recording</p>
                    <p className="text-sm text-muted-foreground">Video available for review</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Play className="mr-2 h-3 w-3" />
                    Watch
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Detailed Performance Metrics
                </CardTitle>
                <CardDescription>Breakdown of your response quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(analysis.metrics || {}).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <span className="text-2xl font-bold text-primary">{value}%</span>
                    </div>
                    <Progress value={value} className="h-3" />
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Self-Rated Confidence</span>
                    <span className="text-2xl font-bold text-success">{session.confidenceRating}/5</span>
                  </div>
                  <Progress value={(session.confidenceRating / 5) * 100} className="h-3" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Self-Rated Quality</span>
                    <span className="text-2xl font-bold text-chart-3">{session.qualityRating}/5</span>
                  </div>
                  <Progress value={(session.qualityRating / 5) * 100} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analysis & Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {(analysis.strengths || []).map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-chart-3">
                    <AlertCircle className="h-4 w-4" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {(analysis.improvements || []).map((improvement: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-chart-3 flex-shrink-0" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
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
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className="text-xl font-bold text-primary">{overallScore}%</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-success/10 p-3">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-xl font-bold text-success">{session.duration}s</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-chart-3/10 p-3">
                  <span className="text-sm font-medium">Difficulty</span>
                  <span className="text-sm font-semibold text-chart-3">{question?.difficulty || "Medium"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-success/20 bg-success/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-success flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {overallScore >= 85
                      ? "Excellent! Try a harder question category"
                      : "Practice similar questions to build confidence"}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-success flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Review the sample response for this question</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-success flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">Watch your recording to identify improvement areas</p>
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
