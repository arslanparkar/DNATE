"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
import { Home, Video, BarChart3, BookOpen, User, LogOut, History } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const isActive = (path: string) => pathname === path

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
          <DropdownMenuContent className="w-64" align="end" forceMount>
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
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex cursor-pointer items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile & Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sessions" className="flex cursor-pointer items-center">
                <History className="mr-2 h-4 w-4" />
                <span>My Sessions</span>
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
