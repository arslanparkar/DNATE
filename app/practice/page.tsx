import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function PracticePage() {
  // Mock questions data
  const questions = [
    {
      id: "1",
      text: "Why is this therapy so expensive compared to existing treatments?",
      category: "Cost & Value",
      difficulty: 4,
      persona: "All Personas",
      timesPracticed: 5,
      avgConfidence: 4.2,
    },
    {
      id: "2",
      text: "Your trial excluded elderly patients. How do I know this works for my population?",
      category: "Data Validity & Study Design",
      difficulty: 5,
      persona: "Oncologist",
      timesPracticed: 3,
      avgConfidence: 3.8,
    },
    {
      id: "3",
      text: "I don't have time for this! The treatment decision is complex enough already.",
      category: "Clinical Decision-Making & Time Constraints",
      difficulty: 4,
      persona: "Cardiologist",
      timesPracticed: 2,
      avgConfidence: 3.5,
    },
    {
      id: "4",
      text: "How will my patients tolerate this treatment regimen?",
      category: "Patient Acceptance & Treatment Burden",
      difficulty: 3,
      persona: "Neurologist",
      timesPracticed: 4,
      avgConfidence: 4.0,
    },
    {
      id: "5",
      text: "What's the real-world evidence for this therapy?",
      category: "Clinical Data & Evidence",
      difficulty: 4,
      persona: "All Personas",
      timesPracticed: 6,
      avgConfidence: 4.3,
    },
    {
      id: "6",
      text: "How does this fit into my current treatment workflow?",
      category: "Treatment Practicality",
      difficulty: 3,
      persona: "Cardiologist",
      timesPracticed: 3,
      avgConfidence: 3.9,
    },
  ]

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
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#0077E6]" />
            <span className="text-xl font-bold text-[#1A1A1A]">DNATE MSL Practice Gym</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
          </nav>
        </div>
      </header>

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

        {/* Question Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {questions.map((question) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <Badge className={getCategoryColor(question.category)}>{question.category}</Badge>
                  <Badge variant="outline">{question.persona}</Badge>
                </div>
                <CardTitle className="text-lg text-balance">{question.text}</CardTitle>
                <CardDescription>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      Difficulty:
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-2 w-2 rounded-full ${i < question.difficulty ? "bg-[#0077E6]" : "bg-gray-300"}`}
                        />
                      ))}
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4 text-sm text-[#404A69]">
                  <span>Practiced: {question.timesPracticed}x</span>
                  {question.timesPracticed > 0 && <span>Avg Confidence: {question.avgConfidence}/5</span>}
                </div>
                <Link href={`/practice/${question.id}`}>
                  <Button className="w-full bg-[#0077E6] hover:bg-[#0056b3]">Start Practice</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
