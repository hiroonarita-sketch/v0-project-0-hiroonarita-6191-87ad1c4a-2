"use client"

import { cn } from "@/lib/utils"
import { FOCUS_TAGS } from "@/lib/store"

interface FocusTagChipsProps {
  selected: string[]
  onChange: (tags: string[]) => void
  readonly?: boolean
  size?: "sm" | "md"
}

export function FocusTagChips({ selected, onChange, readonly = false, size = "md" }: FocusTagChipsProps) {
  const toggleTag = (tag: string) => {
    if (readonly) return
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  if (readonly) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {selected.map((tag) => (
          <span
            key={tag}
            className={cn(
              "inline-flex items-center rounded-full bg-primary/15 text-primary font-medium",
              size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {FOCUS_TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => toggleTag(tag)}
          className={cn(
            "inline-flex items-center rounded-full border transition-colors",
            size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
            selected.includes(tag)
              ? "border-primary bg-primary/15 text-primary font-medium"
              : "border-border bg-background text-muted-foreground hover:border-primary/50",
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
