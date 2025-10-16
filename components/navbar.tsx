"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
import { Home, Video, BarChart3, BookOpen, User, LogOut, Settings } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  // Mock user data - in production this would come from auth context
  const user = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "/professional-avatar.png",
    initials: "SJ",
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#0077E6] to-[#0056b3]">
            <span className="text-lg font-bold text-white">D</span>
          </div>
          <span className="hidden text-xl font-bold text-[#1A1A1A] md:inline">DNATE MSL Practice Gym</span>
          <span className="text-xl font-bold text-[#1A1A1A] md:hidden">DNATE</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          <Link href="/dashboard">
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              size="sm"
              className={isActive("/dashboard") ? "bg-[#0077E6] hover:bg-[#0056b3]" : "hover:bg-gray-100"}
            >
              <Home className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>

          <Link href="/practice">
            <Button
              variant={isActive("/practice") ? "default" : "ghost"}
              size="sm"
              className={isActive("/practice") ? "bg-[#0077E6] hover:bg-[#0056b3]" : "hover:bg-gray-100"}
            >
              <Video className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Practice</span>
            </Button>
          </Link>

          <Link href="/analytics">
            <Button
              variant={isActive("/analytics") ? "default" : "ghost"}
              size="sm"
              className={isActive("/analytics") ? "bg-[#0077E6] hover:bg-[#0056b3]" : "hover:bg-gray-100"}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
          </Link>

          <Link href="/resources">
            <Button
              variant={isActive("/resources") ? "default" : "ghost"}
              size="sm"
              className={isActive("/resources") ? "bg-[#0077E6] hover:bg-[#0056b3]" : "hover:bg-gray-100"}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </Button>
          </Link>
        </nav>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-[#0077E6] text-white">{user.initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-gray-500">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex cursor-pointer items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sessions" className="flex cursor-pointer items-center">
                <Video className="mr-2 h-4 w-4" />
                <span>My Sessions</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex cursor-pointer items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
