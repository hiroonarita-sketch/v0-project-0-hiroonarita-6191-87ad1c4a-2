"use client"

import { useState } from "react"
import { ChevronDown, Sparkles, Clock, Flame } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FocusTagChips } from "@/components/focus-tag-chips"
import { cn } from "@/lib/utils"
import type { Drill, Intensity } from "@/lib/store"

interface DrillAccordionSectionProps {
  label: string
  drill: Drill
  onChange: (drill: Drill) => void
  error?: string
}

const intensityOptions: { value: Intensity; label: string; color: string }[] = [
  { value: "low", label: "低", color: "bg-intensity-low" },
  { value: "mid", label: "中", color: "bg-intensity-mid" },
  { value: "high", label: "高", color: "bg-intensity-high" },
]

export function DrillAccordionSection({ label, drill, onChange, error }: DrillAccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  const updateDrill = (updates: Partial<Drill>) => {
    onChange({ ...drill, ...updates })
  }

  const autoShortPurpose = () => {
    // Mock function to shorten purpose to <= 25 Japanese chars
    if (drill.purpose.length > 25) {
      updateDrill({ purpose: drill.purpose.slice(0, 25) })
    }
  }

  const summaryLine = drill.title ? `${drill.title} (${drill.durationMin}分)` : "未入力"

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden transition-colors",
        error ? "border-destructive" : "border-border",
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{label}</span>
          <span className="text-xs text-muted-foreground">{summaryLine}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 border-t">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                タイトル <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="練習名を入力"
                value={drill.title}
                onChange={(e) => updateDrill({ title: e.target.value })}
                className={cn(error && !drill.title && "border-destructive")}
              />
              {error && !drill.title && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <div className="flex gap-3">
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  時間 (分)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={drill.durationMin}
                  onChange={(e) => updateDrill({ durationMin: Number.parseInt(e.target.value) || 10 })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5" />
                  強度
                </label>
                <div className="flex gap-1 p-1 bg-muted rounded-md">
                  {intensityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateDrill({ intensity: opt.value })}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded transition-colors",
                        drill.intensity === opt.value
                          ? `${opt.color} text-white`
                          : "text-muted-foreground hover:bg-background",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">目的</label>
              <Button type="button" variant="ghost" size="sm" onClick={autoShortPurpose} className="h-7 text-xs gap-1">
                <Sparkles className="h-3 w-3" />
                25文字に短縮
              </Button>
            </div>
            <Textarea
              placeholder="この練習の目的"
              value={drill.purpose}
              onChange={(e) => updateDrill({ purpose: e.target.value })}
              rows={2}
            />
            <p className="text-xs text-muted-foreground text-right">{drill.purpose.length} / 25文字</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">フォーカスタグ</label>
            <FocusTagChips selected={drill.focusTags} onChange={(tags) => updateDrill({ focusTags: tags })} size="sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">メモ</label>
            <Textarea
              placeholder="補足メモ（任意）"
              value={drill.notes}
              onChange={(e) => updateDrill({ notes: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  )
}
