"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function TeamSelect() {
  const { teams, selectedTeamId, setSelectedTeamId } = useStore()
  const selectedTeam = teams.find((t) => t.id === selectedTeamId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 min-w-[140px] justify-between bg-transparent">
          <span className="truncate">{selectedTeam?.name || "チーム選択"}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[180px]">
        {teams.map((team) => (
          <DropdownMenuItem key={team.id} onClick={() => setSelectedTeamId(team.id)} className="gap-2">
            <Check className={cn("h-4 w-4", selectedTeamId === team.id ? "opacity-100" : "opacity-0")} />
            {team.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
