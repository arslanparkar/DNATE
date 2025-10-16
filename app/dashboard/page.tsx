import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { TrendingUp, Target, Clock, Award, Video, BarChart3, BookOpen, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  // Mock data - in production this would come from an API
  const stats = {
    totalSessions: 24,
    avgConfidence: 4.2,
    currentStreak: 7,
    totalTime: 180,
    weeklyGoal: 5,
    completedThisWeek: 3,
  }

  const categoryProgress = [
    { name: "Product Knowledge", sessions: 8, avgScore: 4.5, progress: 85, color: "bg-[#0077E6]" },
    { name: "Communication", sessions: 6, avgScore: 4.2, progress: 70, color: "bg-[#28A745]" },
    { name: "Clinical", sessions: 5, avgScore: 3.8, progress: 60, color: "bg-[#FFC107]" },
    { name: "Behavioral", sessions: 5, avgScore: 4.0, progress: 65, color: "bg-[#DC3545]" },
  ]

  const recentSessions = [
    {
      id: "1",
      question: "How would you explain the mechanism of action of our oncology drug to a busy oncologist?",
      category: "Product",
      date: "2025-01-15",
      confidence: 4,
      quality: 4,
      duration: "8 min",
    },
    {
      id: "2",
      question: "Describe a time when you had to handle a difficult objection from a healthcare provider.",
      category: "Communication",
      date: "2025-01-14",
      confidence: 5,
      quality: 5,
      duration: "6 min",
    },
    {
      id: "3",
      question: "Explain the latest clinical trial results for our cardiovascular medication.",
      category: "Clinical",
      date: "2025-01-13",
      confidence: 3,
      quality: 4,
      duration: "10 min",
    },
  ]

  const upcomingGoals = [
    { title: "Complete 5 sessions this week", current: 3, target: 5 },
    { title: "Practice all categories", current: 3, target: 4 },
    { title: "Maintain 7-day streak", current: 7, target: 7 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-[#1A1A1A]">Welcome back, Dr. Johnson</h1>
          <p className="text-lg text-gray-600">Ready to continue your MSL interview preparation?</p>
        </div>

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
                <TrendingUp className="mr-1 inline h-3 w-3" />
                +3 this week
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
              <p className="mt-1 text-xs text-gray-500">Excellent progress</p>
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
                {stats.totalTime}
                <span className="text-lg text-gray-500"> min</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">3 hours total</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            {/* Category Progress */}
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Progress by Category</CardTitle>
                    <CardDescription>Your performance across different question types</CardDescription>
                  </div>
                  <Link href="/analytics">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {categoryProgress.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${category.color}`} />
                        <span className="font-medium text-[#1A1A1A]">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{category.sessions} sessions</span>
                        <span className="font-semibold text-[#0077E6]">{category.avgScore}/5</span>
                      </div>
                    </div>
                    <Progress value={category.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

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
                <div className="space-y-4">
                  {recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="group flex items-start justify-between rounded-lg border p-4 transition-all hover:border-[#0077E6] hover:bg-[#F0F8FF]"
                    >
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="secondary" className="bg-[#E6F4FF] text-[#0077E6]">
                            {session.category}
                          </Badge>
                          <span className="text-xs text-gray-500">{session.date}</span>
                          <span className="text-xs text-gray-500">• {session.duration}</span>
                        </div>
                        <p className="mb-3 text-sm text-[#1A1A1A] text-balance">{session.question}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Confidence:</span>
                            <span className="font-semibold text-[#28A745]">{session.confidence}/5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">Quality:</span>
                            <span className="font-semibold text-[#0077E6]">{session.quality}/5</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:border-[#0077E6] group-hover:text-[#0077E6] bg-transparent"
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
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
                  {stats.weeklyGoal - stats.completedThisWeek} more to reach your goal
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Goals */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Goals & Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#1A1A1A]">{goal.title}</span>
                      <span className="text-gray-600">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  </div>
                ))}
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
