"use client"

import { useState } from "react"
import { Clock, Flame, Check, Star, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FocusTagChips } from "@/components/focus-tag-chips"
import { cn } from "@/lib/utils"
import type { Drill, Intensity } from "@/lib/store"

export interface DrillFeedback {
  rating: number
  comment: string
}

interface DrillCardProps {
  drill: Drill
  icon: string
  label: string
  checked?: boolean
  onToggle?: () => void
  showFeedback?: boolean
  feedback?: DrillFeedback
  onFeedbackChange?: (feedback: DrillFeedback) => void
}

const intensityColors: Record<Intensity, string> = {
  low: "bg-intensity-low",
  mid: "bg-intensity-mid",
  high: "bg-intensity-high",
}

const intensityLabels: Record<Intensity, string> = {
  low: "低",
  mid: "中",
  high: "高",
}

export function DrillCard({ 
  drill, 
  icon, 
  label, 
  checked = false, 
  onToggle,
  showFeedback = false,
  feedback = { rating: 0, comment: "" },
  onFeedbackChange,
}: DrillCardProps) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)

  const handleRatingChange = (rating: number) => {
    onFeedbackChange?.({ ...feedback, rating })
  }

  const handleCommentChange = (comment: string) => {
    onFeedbackChange?.({ ...feedback, comment })
  }

  const hasFeedback = feedback.rating > 0 || feedback.comment.length > 0

  return (
    <Card className={cn("rounded-3xl transition-all", checked && "bg-muted/50 opacity-75")}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
              {onToggle && (
                <button
                  onClick={onToggle}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors",
                    checked
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 hover:border-primary",
                  )}
                >
                  {checked && <Check className="h-4 w-4" />}
                </button>
              )}
            </div>
            <h3 className={cn("text-xl font-bold mt-1", checked && "line-through text-muted-foreground")}>
              {drill.title}
            </h3>

            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {drill.durationMin}分
              </span>
              <span
                className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-white",
                  intensityColors[drill.intensity],
                )}
              >
                <Flame className="h-3 w-3" />
                {intensityLabels[drill.intensity]}
              </span>
            </div>

            {drill.purpose && <p className="text-base text-muted-foreground mt-3">{drill.purpose}</p>}

            {drill.focusTags.length > 0 && (
              <div className="mt-3">
                <FocusTagChips selected={drill.focusTags.slice(0, 5)} onChange={() => {}} readonly />
              </div>
            )}

            {/* Feedback Section */}
            {showFeedback && (
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4" />
                    このメニューのふりかえり
                    {hasFeedback && (
                      <span className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-3 w-3",
                              star <= feedback.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </span>
                    )}
                  </span>
                  {isFeedbackOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {isFeedbackOpen && (
                  <div className="mt-3 space-y-3">
                    {/* Star Rating */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">できはどうだった？</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className="p-0.5 transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={cn(
                                "h-7 w-7 transition-colors",
                                star <= feedback.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">コメント（任意）</p>
                      <Textarea
                        placeholder="気づいたこと、感じたことを書こう..."
                        value={feedback.comment}
                        onChange={(e) => handleCommentChange(e.target.value)}
                        rows={2}
                        className="text-sm rounded-xl resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
