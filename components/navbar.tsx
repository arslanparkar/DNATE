"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Video, BarChart3, BookOpen, User, LogOut, History, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { sessionsApi } from "@/lib/api"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [recentSessions, setRecentSessions] = useState<any[]>([])
  const [sessionStats, setSessionStats] = useState({ total: 0, avgConfidence: 0 })

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!user) return
      try {
        const { sessions } = await sessionsApi.getAll()
        const recent = sessions
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
        setRecentSessions(recent)

        const avgConf =
          sessions.length > 0
            ? sessions.reduce((sum: number, s: any) => sum + (s.confidenceRating || 0), 0) / sessions.length
            : 0
        setSessionStats({ total: sessions.length, avgConfidence: avgConf })
      } catch (error) {
        console.error("[v0] Failed to fetch sessions:", error)
      }
    }

    if (user) {
      fetchSessionData()
    }
  }, [user])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
            <span className="text-xl font-bold text-primary-foreground">D</span>
          </div>
          <div className="hidden md:block">
            <span className="text-xl font-bold text-foreground">DNATE</span>
            <span className="ml-2 text-sm text-muted-foreground">MSL Practice Gym</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/dashboard">
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              size="sm"
              className={isActive("/dashboard") ? "bg-primary text-primary-foreground" : ""}
            >
              <Home className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>

          <Link href="/practice">
            <Button
              variant={isActive("/practice") ? "default" : "ghost"}
              size="sm"
              className={isActive("/practice") ? "bg-primary text-primary-foreground" : ""}
            >
              <Video className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Practice</span>
            </Button>
          </Link>

          <Link href="/analytics">
            <Button
              variant={isActive("/analytics") ? "default" : "ghost"}
              size="sm"
              className={isActive("/analytics") ? "bg-primary text-primary-foreground" : ""}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
          </Link>

          <Link href="/resources">
            <Button
              variant={isActive("/resources") ? "default" : "ghost"}
              size="sm"
              className={isActive("/resources") ? "bg-primary text-primary-foreground" : ""}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </Button>
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold leading-none text-foreground">{user?.name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
                {user?.role && (
                  <span className="inline-flex w-fit rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {user.role}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div className="px-2 py-3">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Practice Stats</span>
                <TrendingUp className="h-3 w-3" />
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-md bg-accent/50 p-2">
                <div>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                  <p className="text-lg font-bold text-primary">{sessionStats.total}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Confidence</p>
                  <p className="text-lg font-bold text-success">{sessionStats.avgConfidence.toFixed(1)}/5</p>
                </div>
              </div>
            </div>

            {recentSessions.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-2">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Recent Sessions</p>
                  <div className="space-y-2">
                    {recentSessions.map((session) => (
                      <Link key={session.id} href={`/sessions/${session.id}`}>
                        <div className="group cursor-pointer rounded-md border bg-card p-2 transition-colors hover:bg-accent">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium text-foreground truncate">
                              {session.personaId || "Practice Session"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(session.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="font-semibold text-success">{session.confidenceRating || "N/A"}/5</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex cursor-pointer items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile & Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sessions" className="flex cursor-pointer items-center">
                <History className="mr-2 h-4 w-4" />
                <span>All Sessions</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
