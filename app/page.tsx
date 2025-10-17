import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, BarChart3, BookOpen, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <span className="text-xl font-bold text-primary-foreground">D</span>
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">DNATE</span>
              <span className="ml-2 text-sm text-muted-foreground hidden sm:inline">MSL Practice Gym</span>
            </div>
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-balance text-foreground lg:text-6xl">
            Master Your MSL Interview Skills
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground leading-relaxed text-pretty">
            Practice interview questions through video recordings with self-assessment. Build confidence and improve
            your communication skills with realistic physician personas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                Start Practicing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground text-balance">
          Why Choose DNATE MSL Practice Gym?
        </h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Video className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-xl">Video Recording</CardTitle>
              <CardDescription className="leading-relaxed">
                Record your responses to interview questions and review your performance with detailed playback
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-success/10">
                <BarChart3 className="h-7 w-7 text-success" />
              </div>
              <CardTitle className="text-xl">Self-Assessment</CardTitle>
              <CardDescription className="leading-relaxed">
                Rate your confidence and quality, track your progress over time with detailed analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-chart-3/10">
                <BookOpen className="h-7 w-7 text-chart-3" />
              </div>
              <CardTitle className="text-xl">Question Library</CardTitle>
              <CardDescription className="leading-relaxed">
                Access categorized questions covering clinical, product, and communication topics
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-4">Everything You Need to Succeed</CardTitle>
              <CardDescription className="text-base">
                Comprehensive tools designed specifically for Medical Science Liaison interview preparation
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-8">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "Realistic physician personas",
                  "Categorized question library",
                  "Video recording & playback",
                  "Self-assessment framework",
                  "Progress tracking & analytics",
                  "Performance insights",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 DNATE MSL Practice Gym. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
