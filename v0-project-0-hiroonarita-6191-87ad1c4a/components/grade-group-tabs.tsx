"use client"

import { cn } from "@/lib/utils"
import { useStore, type GradeGroup } from "@/lib/store"

const grades: { value: GradeGroup; label: string }[] = [
  { value: "1-2", label: "1-2年" },
  { value: "3-4", label: "3-4年" },
  { value: "5-6", label: "5-6年" },
]

export function GradeGroupTabs() {
  const { selectedGradeGroup, setSelectedGradeGroup } = useStore()

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {grades.map((grade) => (
        <button
          key={grade.value}
          onClick={() => setSelectedGradeGroup(grade.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
            selectedGradeGroup === grade.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {grade.label}
        </button>
      ))}
    </div>
  )
}
