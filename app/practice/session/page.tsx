"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, RotateCcw, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { personasApi, sessionsApi } from "@/lib/api"
import { ChatInterface } from "@/components/chat-interface"

type Message = {
  id: string
  role: "assistant" | "user" | "system"
  content: string
  timestamp: Date
}

type SessionStage = "setup" | "greeting" | "question" | "responding" | "assessment" | "complete"

export default function PracticeSessionPage() {
  const router = useRouter()

  const [personas, setPersonas] = useState<any[]>([])
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [stage, setStage] = useState<SessionStage>("setup")
  const [selectedPersona, setSelectedPersona] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [responseStartTime, setResponseStartTime] = useState<number>(0)
  const [confidence, setConfidence] = useState(0)
  const [quality, setQuality] = useState(0)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const personasData = await personasApi.getAll()
        setPersonas(personasData.personas || [])
      } catch (err: any) {
        console.error("[v0] Error fetching data:", err)
        setError(err.message || "Failed to load practice session data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const startSession = async (persona: any) => {
    try {
      setSelectedPersona(persona)
      setStage("greeting")

      const sessionData = await sessionsApi.start({ personaId: persona.personaId })
      setCurrentSession(sessionData.session)
      setCurrentQuestionIndex(0)

      const systemMsg: Message = {
        id: "1",
        role: "system",
        content: `Practice session started with ${persona.name}`,
        timestamp: new Date(),
      }

      setTimeout(() => {
        const greetingMsg: Message = {
          id: "2",
          role: "assistant",
          content: persona.greeting || `Hello, I'm ${persona.name}. I'm looking forward to our conversation today.`,
          timestamp: new Date(),
        }
        setMessages([systemMsg, greetingMsg])

        setTimeout(() => {
          const firstQuestion = sessionData.session.questions[0]
          const questionMsg: Message = {
            id: "3",
            role: "assistant",
            content: firstQuestion.text,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, questionMsg])
          setStage("question")
          setResponseStartTime(Date.now())
        }, 1500)
      }, 500)
    } catch (err: any) {
      setError(err.message || "Failed to start session")
      setStage("setup")
    }
  }

  const handleSendMessage = async (messageContent: string) => {
    if (!currentSession) return;
  
    const userMessage: Message = {
      id: (Date.now()).toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
  
    const timeSpent = Math.floor((Date.now() - responseStartTime) / 1000);
  
    try {
      await sessionsApi.answer(currentSession.sessionId, {
        questionIndex: currentQuestionIndex,
        answer: messageContent,
        timeTaken: timeSpent,
        confidence: 0, 
      });
  
      const nextIndex = currentQuestionIndex + 1;
  
      // Simulate physician response
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      if (nextIndex < currentSession.questions.length) {
        const nextQuestion = currentSession.questions[nextIndex];
        const questionMsg: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: nextQuestion.text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, questionMsg]);
        setCurrentQuestionIndex(nextIndex);
        setResponseStartTime(Date.now());
      } else {
        setStage("assessment");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit answer");
    }
  };

  const handleSubmitAssessment = async () => {
    if (!currentSession) return
    try {
      await sessionsApi.complete(currentSession.sessionId, {
        confidenceRating: confidence,
        qualityRating: quality,
        notes,
      })
      setStage("complete")
    } catch (err: any) {
      setError(err.message || "Failed to complete session")
    }
  }

  const handleStartOver = () => {
    router.push("/practice")
  }

  const currentQuestion = currentSession?.questions[currentQuestionIndex]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading practice session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="max-w-2xl w-full rounded-lg border border-destructive/20 bg-destructive/5 p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-destructive">Unable to Load Practice Session</h3>
              <p className="mb-4 text-destructive/80">{error}</p>
              <div className="mt-4 flex gap-3">
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
                <Link href="/practice">
                  <Button variant="outline">Back to Practice</Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90">Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Setup Stage - Persona Selection
  if (stage === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        <div className="container mx-auto px-4 py-8">
          <Link href="/practice">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Questions
            </Button>
          </Link>

          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold text-foreground">Select Your Physician</h1>
              <p className="text-lg text-muted-foreground">Choose who you'll be speaking with today</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {personas.map((persona) => (
                <Card
                  key={persona.personaId}
                  className="cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:border-primary"
                  onClick={() => startSession(persona)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-bold">
                          {persona.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="mb-1 text-center text-xl font-bold text-foreground">{persona.name}</h3>
                    <p className="mb-2 text-center text-sm text-muted-foreground">{persona.title}</p>
                    <p className="mb-4 text-center text-xs text-muted-foreground">{persona.specialty}</p>
                    <Button className="mt-4 w-full bg-primary hover:bg-primary/90">Start Session</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Chat Interface - Active Session
  if (stage === "greeting" || stage === "question" || stage === "responding") {
    return (
      <div className="flex h-screen flex-col bg-background">
        {/* Header */}
        <div className="border-b bg-card px-6 py-4 shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/practice">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {currentQuestion && (
                <Badge variant="outline" className="border-primary text-primary">
                  {currentQuestion.category}
                </Badge>
              )}
              <Badge variant="secondary">
                Question {currentQuestionIndex + 1} of {currentSession?.questions.length || 0}
              </Badge>
            </div>
          </div>
        </div>

        {/* Chat Interface Component */}
        <ChatInterface
          persona={selectedPersona}
          initialMessages={messages}
          onSendMessage={handleSendMessage}
          placeholder="Type your response here..."
          enableAI={true}
        />
      </div>
    )
  }

  // Assessment Stage
  if (stage === "assessment") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
        <div className="w-full max-w-3xl">
          <Card>
            <CardContent className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-foreground">Self-Assessment</h2>

              {/* Confidence Rating */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-foreground">
                  How confident did you feel? *
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setConfidence(rating)}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-bold transition-all ${
                        confidence === rating
                          ? "border-primary bg-primary text-primary-foreground scale-110"
                          : "border-border bg-card text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Not Confident</span>
                  <span>Very Confident</span>
                </div>
              </div>

              {/* Quality Rating */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-foreground">
                  How would you rate your response quality? *
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setQuality(rating)}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-bold transition-all ${
                        quality === rating
                          ? "border-success bg-success text-white scale-110"
                          : "border-border bg-card text-muted-foreground hover:border-success"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-foreground">Personal Notes & Reflections</label>
                <Textarea
                  placeholder="What went well? What would you improve next time?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleStartOver} className="flex-1 bg-transparent">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Practice Again
                </Button>
                <Button
                  onClick={handleSubmitAssessment}
                  disabled={confidence === 0 || quality === 0}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Complete Stage
  if (stage === "complete") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-success/10 p-6">
              <CheckCircle2 className="h-16 w-16 text-success" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground">Session Complete!</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Great work! Your practice session has been saved to your dashboard.
          </p>
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-3xl font-bold text-primary">{confidence}/5</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quality</p>
                  <p className="text-3xl font-bold text-success">{quality}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-4">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                View Dashboard
              </Button>
            </Link>
            <Button onClick={handleStartOver} className="flex-1 bg-primary hover:bg-primary/90">
              Practice Another Question
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}