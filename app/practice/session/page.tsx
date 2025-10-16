"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Mic, Video, RotateCcw, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { personasApi, questionsApi, sessionsApi } from "@/lib/api"

type Message = {
  id: string
  role: "physician" | "msl" | "system"
  content: string
  timestamp: Date
}

type SessionStage = "setup" | "greeting" | "question" | "responding" | "assessment" | "complete"

export default function PracticeSessionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const questionId = searchParams.get("questionId")

  const [personas, setPersonas] = useState<any[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [stage, setStage] = useState<SessionStage>("setup")
  const [selectedPersona, setSelectedPersona] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [userResponse, setUserResponse] = useState("")
  const [responseStartTime, setResponseStartTime] = useState<number>(0)
  const [confidence, setConfidence] = useState(0)
  const [quality, setQuality] = useState(0)
  const [notes, setNotes] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[v0] Fetching personas and questions...")

        const personasData = await personasApi.getAll()
        console.log("[v0] Personas received:", personasData)
        setPersonas(personasData.personas || [])

        if (questionId) {
          console.log("[v0] Fetching specific question:", questionId)
          const questionData = await questionsApi.getById(questionId)
          console.log("[v0] Question received:", questionData)
          setCurrentQuestion(questionData.question)
        } else {
          console.log("[v0] Fetching random question...")
          const randomQuestion = await questionsApi.getRandom()
          console.log("[v0] Random question received:", randomQuestion)
          setCurrentQuestion(randomQuestion.question)
        }
      } catch (err: any) {
        console.error("[v0] Error fetching data:", err)
        setError(err.message || "Failed to load practice session data. The backend API may not be ready yet.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [questionId])

  const startSession = async (persona: any) => {
    try {
      setSelectedPersona(persona)
      setStage("greeting")

      // Create session via API
      const sessionData = await sessionsApi.start({ personaId: persona.id })
      setCurrentSession(sessionData.session)
      setResponseStartTime(Date.now())

      // Add system message
      const systemMsg: Message = {
        id: "1",
        role: "system",
        content: `Practice session started with ${persona.name}`,
        timestamp: new Date(),
      }

      // Add greeting from physician
      setTimeout(() => {
        const greetingMsg: Message = {
          id: "2",
          role: "physician",
          content: persona.greeting || `Hello, I'm ${persona.name}. What can you tell me about this therapy?`,
          timestamp: new Date(),
        }
        setMessages([systemMsg, greetingMsg])

        // After greeting, show the question
        setTimeout(() => {
          const questionMsg: Message = {
            id: "3",
            role: "physician",
            content: currentQuestion?.text || "Tell me more about this treatment.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, questionMsg])
          setStage("question")
        }, 2000)
      }, 500)
    } catch (err: any) {
      setError(err.message || "Failed to start session")
    }
  }

  const handleSendResponse = async () => {
    if (!userResponse.trim() || !currentSession || !currentQuestion) return

    const responseMsg: Message = {
      id: Date.now().toString(),
      role: "msl",
      content: userResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, responseMsg])

    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - responseStartTime) / 1000)

    try {
      // Submit answer to API
      await sessionsApi.answer(currentSession.id, {
        questionId: currentQuestion.id,
        answer: userResponse,
        timeSpent,
      })

      setUserResponse("")

      // Physician acknowledgment
      setTimeout(() => {
        const ackMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "physician",
          content: "Thank you for that explanation. I appreciate you taking the time to address my concerns.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, ackMsg])

        // Move to assessment
        setTimeout(() => {
          setStage("assessment")
        }, 1500)
      }, 1000)
    } catch (err: any) {
      setError(err.message || "Failed to submit answer")
    }
  }

  const handleSubmitAssessment = async () => {
    if (!currentSession) return

    try {
      await sessionsApi.complete(currentSession.id, {
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#0077E6]" />
          <p className="mt-4 text-[#404A69]">Loading practice session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F5F5] p-4">
        <div className="max-w-2xl w-full rounded-lg border border-red-200 bg-red-50 p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-red-900">Unable to Load Practice Session</h3>
              <p className="mb-4 text-red-700">{error}</p>
              <div className="rounded bg-red-100 p-4 text-sm text-red-800">
                <p className="mb-2 font-semibold">Possible reasons:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    The backend API endpoints <code className="bg-red-200 px-1 rounded">/api/personas</code> or{" "}
                    <code className="bg-red-200 px-1 rounded">/api/questions</code> may not be implemented yet
                  </li>
                  <li>The backend server may be experiencing issues</li>
                  <li>Your authentication token may have expired</li>
                </ul>
              </div>
              <div className="mt-4 flex gap-3">
                <Button onClick={() => window.location.reload()} variant="outline" className="bg-white">
                  Try Again
                </Button>
                <Link href="/practice">
                  <Button variant="outline" className="bg-white">
                    Back to Practice
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-[#0077E6] hover:bg-[#0056b3]">Go to Dashboard</Button>
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
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-[#E8F4FF]">
        <div className="container mx-auto px-4 py-8">
          <Link href="/practice">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Questions
            </Button>
          </Link>

          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold text-[#1B0020]">Select Your Physician</h1>
              <p className="text-lg text-[#404A69]">Choose who you'll be speaking with today</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {personas.map((persona) => (
                <Card
                  key={persona.id}
                  className="cursor-pointer transition-all hover:shadow-xl hover:scale-105"
                  onClick={() => startSession(persona)}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-[#0077E6] text-white text-2xl">
                          {persona.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="mb-1 text-center text-xl font-bold text-[#1B0020]">{persona.name}</h3>
                    <p className="mb-4 text-center text-sm text-[#404A69]">{persona.title}</p>
                    <p className="mb-4 text-center text-xs text-[#404A69]">{persona.specialty}</p>
                    <Button className="mt-6 w-full bg-[#0077E6] hover:bg-[#0056b3]">Start Session</Button>
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
  const persona = selectedPersona ? selectedPersona : null

  return (
    <div className="flex h-screen flex-col bg-[#F5F5F5]">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/practice">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            {persona && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-[#0077E6] text-white">
                    {persona.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-[#1B0020]">{persona.name}</h2>
                  <p className="text-xs text-[#404A69]">{persona.specialty}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {currentQuestion && (
              <Badge variant="outline" className="border-[#0077E6] text-[#0077E6]">
                {currentQuestion.category}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      {(stage === "greeting" || stage === "question" || stage === "responding") && (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F5F5F5] to-[#E8F4FF]">
          <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "msl" ? "justify-end" : "justify-start"}`}>
                  {message.role === "system" ? (
                    <div className="mx-auto">
                      <Badge variant="secondary" className="text-xs">
                        {message.content}
                      </Badge>
                    </div>
                  ) : (
                    <div className={`flex gap-3 ${message.role === "msl" ? "flex-row-reverse" : "flex-row"}`}>
                      {message.role === "physician" && persona && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-[#0077E6] text-white text-xs">
                            {persona.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {message.role === "msl" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#1B0020] text-white text-xs">You</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-lg rounded-2xl px-4 py-3 ${
                          message.role === "physician" ? "bg-white shadow-md" : "bg-[#0077E6] text-white"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`mt-1 text-xs ${message.role === "physician" ? "text-[#404A69]" : "text-blue-100"}`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Response Input Area */}
      {stage === "question" && (
        <div className="border-t bg-white px-6 py-4 shadow-lg">
          <div className="mx-auto max-w-4xl">
            <div className="flex gap-3">
              <Textarea
                placeholder="Type your response here... (or use voice/video recording)"
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                className="min-h-[100px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendResponse()
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 bg-transparent"
                  title="Record Audio (Coming Soon)"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 bg-transparent"
                  title="Record Video (Coming Soon)"
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="h-10 w-10 bg-[#0077E6] hover:bg-[#0056b3]"
                  onClick={handleSendResponse}
                  disabled={!userResponse.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-[#404A69]">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      )}

      {/* Assessment Stage */}
      {stage === "assessment" && (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F5F5F5] to-[#E8F4FF]">
          <div className="mx-auto max-w-3xl px-6 py-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="mb-6 text-2xl font-bold text-[#1B0020]">Self-Assessment</h2>

                {/* Confidence Rating */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-semibold text-[#1B0020]">
                    How confident did you feel? *
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setConfidence(rating)}
                        className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-bold transition-all ${
                          confidence === rating
                            ? "border-[#0077E6] bg-[#0077E6] text-white scale-110"
                            : "border-gray-300 bg-white text-[#404A69] hover:border-[#0077E6]"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-[#404A69]">
                    <span>Not Confident</span>
                    <span>Very Confident</span>
                  </div>
                </div>

                {/* Quality Rating */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-semibold text-[#1B0020]">
                    How would you rate your response quality? *
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setQuality(rating)}
                        className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 font-bold transition-all ${
                          quality === rating
                            ? "border-[#0077E6] bg-[#0077E6] text-white scale-110"
                            : "border-gray-300 bg-white text-[#404A69] hover:border-[#0077E6]"
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-[#404A69]">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-semibold text-[#1B0020]">
                    Personal Notes & Reflections
                  </label>
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
                    className="flex-1 bg-[#0077E6] hover:bg-[#0056b3]"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Complete Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Complete Stage */}
      {stage === "complete" && (
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F5F5F5] to-[#E8F4FF]">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-6">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-[#1B0020]">Session Complete!</h2>
            <p className="mb-8 text-lg text-[#404A69]">
              Great work! Your practice session has been saved to your dashboard.
            </p>
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-[#404A69]">Confidence</p>
                  <p className="text-3xl font-bold text-[#0077E6]">{confidence}/5</p>
                </div>
                <div>
                  <p className="text-sm text-[#404A69]">Quality</p>
                  <p className="text-3xl font-bold text-[#0077E6]">{quality}/5</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  View Dashboard
                </Button>
              </Link>
              <Button onClick={handleStartOver} className="flex-1 bg-[#0077E6] hover:bg-[#0056b3]">
                Practice Another Question
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
