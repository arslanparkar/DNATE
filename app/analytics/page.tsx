import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  // Mock analytics data
  const performanceData = {
    byCategory: [
      { category: "Product Knowledge", sessions: 12, avgConfidence: 4.5, avgQuality: 4.3 },
      { category: "Communication", sessions: 8, avgConfidence: 4.2, avgQuality: 4.1 },
      { category: "Objection Handling", sessions: 6, avgConfidence: 3.8, avgQuality: 3.9 },
      { category: "Clinical Data", sessions: 10, avgConfidence: 4.6, avgQuality: 4.5 },
    ],
    weeklyProgress: [
      { week: "Week 1", sessions: 3, avgScore: 3.8 },
      { week: "Week 2", sessions: 5, avgScore: 4.1 },
      { week: "Week 3", sessions: 6, avgScore: 4.3 },
      { week: "Week 4", sessions: 7, avgScore: 4.5 },
    ],
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Performance Analytics</h1>
          <p className="text-gray-600">Track your progress and identify areas for improvement</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Sessions</CardDescription>
                  <CardTitle className="text-3xl text-[#0077E6]">36</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#28A745]">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Confidence</CardDescription>
                  <CardTitle className="text-3xl text-[#28A745]">4.3/5</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#28A745]">+0.3 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Quality</CardDescription>
                  <CardTitle className="text-3xl text-[#28A745]">4.2/5</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#28A745]">+0.2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Practice Streak</CardDescription>
                  <CardTitle className="text-3xl text-[#FFC107]">7 days</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Keep it up!</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Improvements */}
            <Card>
              <CardHeader>
                <CardTitle>Areas of Improvement</CardTitle>
                <CardDescription>Your strongest and weakest categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-[#1A1A1A]">Clinical Data</span>
                      <span className="text-sm text-[#28A745]">4.6/5</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-[#28A745]" style={{ width: "92%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-[#1A1A1A]">Product Knowledge</span>
                      <span className="text-sm text-[#28A745]">4.5/5</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-[#28A745]" style={{ width: "90%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-[#1A1A1A]">Communication</span>
                      <span className="text-sm text-[#0077E6]">4.2/5</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-[#0077E6]" style={{ width: "84%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-[#1A1A1A]">Objection Handling</span>
                      <span className="text-sm text-[#FFC107]">3.8/5</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-[#FFC107]" style={{ width: "76%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>Detailed breakdown of your practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.byCategory.map((item) => (
                    <div key={item.category} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-[#1A1A1A]">{item.category}</h3>
                        <span className="rounded bg-[#E6F4FF] px-2 py-1 text-sm font-medium text-[#0077E6]">
                          {item.sessions} sessions
                        </span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Avg Confidence</p>
                          <p className="text-2xl font-bold text-[#0077E6]">{item.avgConfidence}/5</p>
                        </div>
                        <div>
                          <p className="mb-1 text-sm text-gray-600">Avg Quality</p>
                          <p className="text-2xl font-bold text-[#28A745]">{item.avgQuality}/5</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your practice activity and performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceData.weeklyProgress.map((week) => (
                    <div key={week.week} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium text-gray-600">{week.week}</div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm text-gray-600">{week.sessions} sessions</span>
                          <span className="text-sm font-medium text-[#0077E6]">{week.avgScore}/5</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-gray-200">
                          <div
                            className="h-3 rounded-full bg-[#0077E6]"
                            style={{ width: `${(week.avgScore / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
