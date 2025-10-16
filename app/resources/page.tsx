import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ResourcesPage() {
  const resources = {
    guides: [
      {
        title: "Getting Started with MSL Practice",
        description: "Learn the basics of effective interview practice and self-assessment",
        duration: "5 min read",
        category: "Beginner",
      },
      {
        title: "Advanced Communication Techniques",
        description: "Master the art of clear, confident communication with healthcare providers",
        duration: "8 min read",
        category: "Advanced",
      },
      {
        title: "Handling Difficult Objections",
        description: "Strategies for addressing challenging questions and concerns",
        duration: "6 min read",
        category: "Intermediate",
      },
    ],
    videos: [
      {
        title: "Best Practices for Video Recording",
        description: "Tips for setting up your recording environment and presenting yourself",
        duration: "4:32",
        thumbnail: "/video-tutorial-concept.png",
      },
      {
        title: "Self-Assessment Framework",
        description: "How to effectively evaluate your own performance",
        duration: "6:15",
        thumbnail: "/assessment-guide.jpg",
      },
    ],
    faqs: [
      {
        question: "How long should my practice sessions be?",
        answer:
          "Aim for 5-10 minutes per question. This gives you enough time to provide a thorough response while maintaining focus.",
      },
      {
        question: "How often should I practice?",
        answer:
          "We recommend practicing at least 3-4 times per week to build and maintain your skills. Consistency is key to improvement.",
      },
      {
        question: "What should I focus on when reviewing my recordings?",
        answer:
          "Pay attention to your body language, clarity of communication, confidence level, and how well you addressed the question. Use the self-assessment rubric as a guide.",
      },
      {
        question: "Can I delete my practice recordings?",
        answer:
          "Yes, you have full control over your recordings. You can delete any session from your dashboard at any time.",
      },
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
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Resources & Help</h1>
          <p className="text-gray-600">Guides, tutorials, and answers to common questions</p>
        </div>

        {/* Practice Guides */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-[#1A1A1A]">Practice Guides</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {resources.guides.map((guide, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded bg-[#E6F4FF] px-2 py-1 text-xs font-medium text-[#0077E6]">
                      {guide.category}
                    </span>
                    <span className="text-sm text-gray-500">{guide.duration}</span>
                  </div>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Read Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-[#1A1A1A]">Video Tutorials</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {resources.videos.map((video, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="h-48 w-full rounded-t-lg object-cover"
                  />
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-[#1A1A1A]">{video.title}</h3>
                      <span className="text-sm text-gray-500">{video.duration}</span>
                    </div>
                    <p className="mb-4 text-sm text-gray-600">{video.description}</p>
                    <Button variant="outline" className="w-full bg-transparent">
                      Watch Video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#1A1A1A]">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="divide-y pt-6">
              {resources.faqs.map((faq, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="mb-2 font-semibold text-[#1A1A1A]">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Contact Support */}
        <section className="mt-8">
          <Card className="bg-[#E6F4FF] border-[#0077E6]">
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription className="text-gray-700">
                Can't find what you're looking for? Our support team is here to help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-[#0077E6] hover:bg-[#0056b3]">Contact Support</Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
