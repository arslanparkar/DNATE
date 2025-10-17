"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Search, Filter, Play } from "lucide-react"
import { DUMMY_SESSIONS, DUMMY_QUESTIONS } from "@/lib/dummy-data"

export default function SessionsPage() {
  const [sessions] = useState(DUMMY_SESSIONS)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSessions = sessions.filter((session) => {
    const question = DUMMY_QUESTIONS.find((q) => q.id === session.questionId)
    return (
      question?.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question?.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Practice Sessions</h1>
            <p className="text-muted-foreground">Review and analyze your recorded practice sessions</p>
          </div>
          <Link href="/practice">
            <Button className="bg-primary hover:bg-primary/90">
              <Play className="mr-2 h-4 w-4" />
              New Session
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search sessions by question or category..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const question = DUMMY_QUESTIONS.find((q) => q.id === session.questionId)
            return (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2 flex-wrap">
                        <Badge className="bg-primary/10 text-primary">{question?.category}</Badge>
                        <Badge variant="outline">{question?.difficulty}</Badge>
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          Score: {session.analysis?.overallScore}%
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-muted-foreground">{session.duration}s</span>
                      </div>
                      <CardTitle className="text-lg text-balance">{question?.text}</CardTitle>
                    </div>
                    <Link href={`/sessions/${session.id}`}>
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Confidence:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`h-4 w-4 rounded-full ${
                              star <= session.confidenceRating ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Quality:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`h-4 w-4 rounded-full ${star <= session.qualityRating ? "bg-success" : "bg-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Recording
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="mb-4 text-muted-foreground">No sessions found matching your search</p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
