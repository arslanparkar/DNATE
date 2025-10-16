import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SessionsPage() {
  // Mock session data
  const sessions = [
    {
      id: "1",
      question: "How would you explain the mechanism of action of our oncology drug to a busy oncologist?",
      category: "Product Knowledge",
      date: "2025-01-15",
      duration: "8:32",
      confidence: 4,
      quality: 4,
      videoUrl: "#",
    },
    {
      id: "2",
      question: "Describe a time when you had to handle a difficult objection from a healthcare provider.",
      category: "Communication",
      date: "2025-01-14",
      duration: "6:45",
      confidence: 5,
      quality: 5,
      videoUrl: "#",
    },
    {
      id: "3",
      question: "What are the key safety considerations for our product in elderly patients?",
      category: "Clinical Data",
      date: "2025-01-13",
      duration: "7:18",
      confidence: 4,
      quality: 4,
      videoUrl: "#",
    },
    {
      id: "4",
      question: "How would you respond to a physician who says our competitor's product is more effective?",
      category: "Objection Handling",
      date: "2025-01-12",
      duration: "9:05",
      confidence: 3,
      quality: 4,
      videoUrl: "#",
    },
  ]

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
            <Link href="/practice">
              <Button variant="ghost">Practice</Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Practice Sessions</h1>
            <p className="text-gray-600">Review and analyze your recorded practice sessions</p>
          </div>
          <Link href="/practice">
            <Button className="bg-[#0077E6] hover:bg-[#0056b3]">New Session</Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input placeholder="Search sessions..." className="flex-1" />
              <Button variant="outline">Filter by Category</Button>
              <Button variant="outline">Sort by Date</Button>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded bg-[#E6F4FF] px-2 py-1 text-xs font-medium text-[#0077E6]">
                        {session.category}
                      </span>
                      <span className="text-sm text-gray-500">{session.date}</span>
                      <span className="text-sm text-gray-500">{session.duration}</span>
                    </div>
                    <CardTitle className="text-lg text-balance">{session.question}</CardTitle>
                  </div>
                  <Link href={`/sessions/${session.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`h-4 w-4 rounded-full ${
                            star <= session.confidence ? "bg-[#0077E6]" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Quality:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`h-4 w-4 rounded-full ${star <= session.quality ? "bg-[#28A745]" : "bg-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Watch Recording
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (hidden when sessions exist) */}
        {sessions.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="mb-4 text-gray-600">No practice sessions yet</p>
              <Link href="/practice">
                <Button className="bg-[#0077E6] hover:bg-[#0056b3]">Start Your First Session</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
