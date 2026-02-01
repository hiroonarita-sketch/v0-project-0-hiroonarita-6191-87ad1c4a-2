"use client"

import { cn } from "@/lib/utils"
import { useStore, type GradeGroup } from "@/lib/store"

const grades: { value: GradeGroup; label: string; emoji: string }[] = [
  { value: "1-2", label: "1-2年生", emoji: "🌱" },
  { value: "3-4", label: "3-4年生", emoji: "⚽" },
  { value: "5-6", label: "5-6年生", emoji: "🏆" },
]

export function GradeGroupButtons() {
  const { selectedGradeGroup, setSelectedGradeGroup } = useStore()

  return (
    <div className="grid grid-cols-3 gap-3">
      {grades.map((grade) => (
        <button
          key={grade.value}
          onClick={() => setSelectedGradeGroup(grade.value)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
            selectedGradeGroup === grade.value
              ? "border-primary bg-primary/10 shadow-md"
              : "border-border bg-card hover:border-primary/50",
          )}
        >
          <span className="text-3xl">{grade.emoji}</span>
          <span
            className={cn(
              "text-base font-bold",
              selectedGradeGroup === grade.value ? "text-primary" : "text-foreground",
            )}
          >
            {grade.label}
          </span>
        </button>
      ))}
    </div>
  )
}
