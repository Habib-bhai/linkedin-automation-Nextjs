"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="h-16 bg-[#5EC3FA] text-white fixed top-0 left-0 right-0 z-50">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className=" text-black px-3 py-1 rounded font-bold text-3xl font-sans"> 
            GTM
            <span className="ml-[1px] bg-white rounded-md px-1 w-28 tracking-tight text-[#5ec3fa]">100</span>
            </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-blue-600 flex items-center space-x-2">
                <span>Peak Corporate Solution</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem>Peak Corporate Solution</DropdownMenuItem>
              <DropdownMenuItem>Other Solution</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-600 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              10
            </span>
          </Button>

          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-700 text-white">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
