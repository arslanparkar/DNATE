"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { questionsApi } from "@/lib/api"
import { Loader2, AlertCircle } from "lucide-react"

export default function PracticePage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("[v0] Fetching questions...")
        const data = await questionsApi.getAll()
        console.log("[v0] Questions received:", data)
        setQuestions(data.questions || [])
      } catch (err: any) {
        console.error("[v0] Error fetching questions:", err)
        setError(err.message || "Failed to load questions. The backend API may not be ready yet.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Cost & Value": "bg-red-100 text-red-700",
      "Clinical Data & Evidence": "bg-blue-100 text-blue-700",
      "Patient Acceptance & Treatment Burden": "bg-green-100 text-green-700",
      "Clinical Decision-Making & Time Constraints": "bg-orange-100 text-orange-700",
      "Data Validity & Study Design": "bg-purple-100 text-purple-700",
      "Treatment Practicality": "bg-teal-100 text-teal-700",
      "Skepticism & Pushback": "bg-pink-100 text-pink-700",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#1B0020]">Practice Questions</h1>
          <p className="text-[#404A69]">Select a question to start practicing with a physician persona</p>
        </div>

        <div className="mb-6">
          <Link href="/practice/session">
            <Button className="bg-[#0077E6] hover:bg-[#0056b3]">Start Random Practice Session</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#0077E6]" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-red-900">Unable to Load Questions</h3>
                <p className="mb-4 text-red-700">{error}</p>
                <div className="rounded bg-red-100 p-4 text-sm text-red-800">
                  <p className="mb-2 font-semibold">Possible reasons:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      The backend API endpoint <code className="bg-red-200 px-1 rounded">/api/questions</code> may not
                      be implemented yet
                    </li>
                    <li>The backend server may be down or unreachable</li>
                    <li>Authentication token may be invalid or expired</li>
                  </ul>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button onClick={() => window.location.reload()} variant="outline" className="bg-white">
                    Try Again
                  </Button>
                  <Link href="/dashboard">
                    <Button variant="outline" className="bg-white">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-[#404A69]">No questions available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {questions.map((question) => (
              <Card key={question.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className={getCategoryColor(question.category)}>{question.category}</Badge>
                    <Badge variant="outline">{question.difficulty || "Medium"}</Badge>
                  </div>
                  <CardTitle className="text-lg text-balance">{question.text}</CardTitle>
                  <CardDescription>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-sm text-[#404A69]">{question.estimatedTime || "90 seconds"} estimated</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/practice/session?questionId=${question.id}`}>
                    <Button className="w-full bg-[#0077E6] hover:bg-[#0056b3]">Start Practice</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
