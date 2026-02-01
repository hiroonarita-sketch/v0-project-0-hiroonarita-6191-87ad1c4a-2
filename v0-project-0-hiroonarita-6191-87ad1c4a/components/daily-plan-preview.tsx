"use client"

import { Clock, Flame, Target, MessageCircle, User, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { FocusTagChips } from "@/components/focus-tag-chips"
import { cn } from "@/lib/utils"
import type { Drill, KeyFactor, Intensity } from "@/lib/store"

interface DailyPlanPreviewProps {
  warmup: Drill
  tr1: Drill
  tr2: Drill
  tr3: Drill
  keyFactor: KeyFactor
  coachName?: string
  updatedAt?: string
  compact?: boolean
}

const drillIcons = ["🏃", "⚽", "🎯", "🔥"]
const drillLabels = ["Warm-up", "TR1", "TR2", "TR3"]

const intensityColors: Record<Intensity, string> = {
  low: "text-intensity-low",
  mid: "text-intensity-mid",
  high: "text-intensity-high",
}

function DrillPreviewCard({
  drill,
  icon,
  label,
  compact,
}: {
  drill: Drill
  icon: string
  label: string
  compact?: boolean
}) {
  if (!drill.title) {
    return (
      <Card className="bg-muted/30 border-dashed">
        <CardContent className={cn("flex items-center gap-3", compact ? "p-3" : "p-4")}>
          <span className={cn("opacity-50", compact ? "text-xl" : "text-2xl")}>{icon}</span>
          <div className="text-muted-foreground text-sm">
            <span className="font-medium">{label}</span>
            <span className="ml-2">未入力</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className={cn(compact ? "p-3" : "p-4")}>
        <div className="flex items-start gap-3">
          <span className={cn(compact ? "text-xl" : "text-2xl")}>{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className={cn("font-bold truncate", compact ? "text-sm" : "text-base")}>{drill.title}</h4>
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {drill.durationMin}分
                </span>
                <Flame className={cn("h-3.5 w-3.5", intensityColors[drill.intensity])} />
              </div>
            </div>
            {drill.purpose && (
              <p className={cn("text-muted-foreground mt-1 line-clamp-1", compact ? "text-xs" : "text-sm")}>
                {drill.purpose}
              </p>
            )}
            {drill.focusTags.length > 0 && (
              <div className="mt-2">
                <FocusTagChips selected={drill.focusTags} onChange={() => {}} readonly size="sm" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function DailyPlanPreview({
  warmup,
  tr1,
  tr2,
  tr3,
  keyFactor,
  coachName,
  updatedAt,
  compact = false,
}: DailyPlanPreviewProps) {
  const drills = [warmup, tr1, tr2, tr3]

  return (
    <div className="space-y-3">
      {drills.map((drill, index) => (
        <DrillPreviewCard
          key={index}
          drill={drill}
          icon={drillIcons[index]}
          label={drillLabels[index]}
          compact={compact}
        />
      ))}

      {/* Key Factor */}
      <Card className="bg-accent/20 border-accent">
        <CardContent className={cn(compact ? "p-3" : "p-4")}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-accent-foreground" />
            <h4 className="font-bold text-accent-foreground">今日のキーファクター</h4>
          </div>
          {keyFactor.situation || keyFactor.voiceCue ? (
            <div className="space-y-2">
              {keyFactor.situation && (
                <div className="flex items-start gap-2">
                  <span className="text-xs font-medium text-muted-foreground shrink-0">場面:</span>
                  <p className={cn("text-foreground", compact ? "text-sm" : "")}>{keyFactor.situation}</p>
                </div>
              )}
              {keyFactor.voiceCue && (
                <div className="flex items-start gap-2">
                  <MessageCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className={cn("font-semibold text-primary", compact ? "text-sm" : "text-lg")}>
                    「{keyFactor.voiceCue}」
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">未入力</p>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      {(coachName || updatedAt) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          {coachName && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {coachName}
            </div>
          )}
          {updatedAt && (
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(updatedAt).toLocaleString("ja-JP", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
