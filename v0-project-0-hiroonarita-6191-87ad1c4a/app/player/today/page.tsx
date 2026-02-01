"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, User, CalendarDays, Sparkles, Check, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { TeamSelect } from "@/components/team-select"
import { GradeGroupButtons } from "@/components/grade-group-buttons"
import { DrillCard, type DrillFeedback } from "@/components/drill-card"
import { VoiceInputModal } from "@/components/voice-input-modal"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const drillIcons = ["🏃", "⚽", "🎯", "🔥"]
const drillLabels = ["Warm-up", "TR1", "TR2", "TR3"]

export default function PlayerToday() {
  const { selectedTeamId, selectedGradeGroup, getCurrentPlan, teams } = useStore()
  const [checkedDrills, setCheckedDrills] = useState<Set<number>>(new Set())
  
  // Reflection state
  const [selfRating, setSelfRating] = useState<number>(0)
  const [goodPoints, setGoodPoints] = useState("")
  const [improvements, setImprovements] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [voiceTarget, setVoiceTarget] = useState<"good" | "improve">("good")
  
  // Per-drill feedback state
  const [drillFeedbacks, setDrillFeedbacks] = useState<Record<number, DrillFeedback>>({})

  const plan = getCurrentPlan()
  const selectedTeam = teams.find((t) => t.id === selectedTeamId)

  const toggleDrill = (index: number) => {
    const newChecked = new Set(checkedDrills)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedDrills(newChecked)
  }

  const handleDrillFeedbackChange = (index: number, feedback: DrillFeedback) => {
    setDrillFeedbacks((prev) => ({
      ...prev,
      [index]: feedback,
    }))
  }

  const handleVoiceResult = (text: string) => {
    if (voiceTarget === "good") {
      setGoodPoints((prev) => prev + text)
    } else {
      setImprovements((prev) => prev + text)
    }
  }

  const openVoice = (target: "good" | "improve") => {
    setVoiceTarget(target)
    setVoiceModalOpen(true)
  }

  const handleSubmitReflection = () => {
    // Check if at least overall rating is provided
    if (selfRating > 0) {
      setIsSubmitted(true)
    }
  }

  const drills = plan ? [plan.warmup, plan.tr1, plan.tr2, plan.tr3] : []
  
  // Check if any drill has feedback
  const hasAnyDrillFeedback = Object.values(drillFeedbacks).some(
    (f) => f.rating > 0 || f.comment.length > 0
  )

  // Mock monthly theme - in real app this would come from the plan or store
  const monthlyTheme = "パス＆コントロール"

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">今日の練習</h1>
        </div>
        <div className="space-y-4">
          <TeamSelect />
          <GradeGroupButtons />
        </div>
      </header>

      <main className="p-4 space-y-4">
        {!plan || plan.status !== "published" ? (
          <Card className="rounded-3xl">
            <CardContent className="p-8 text-center">
              <span className="text-6xl mb-4 block">📋</span>
              <h2 className="text-xl font-bold mb-2">今日のメニューはまだありません</h2>
              <p className="text-muted-foreground">コーチがメニューを公開するまで待ってね！</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Team & Date Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
              <span>
                {selectedTeam?.name} / {selectedGradeGroup}年生
              </span>
              <span>{new Date(plan.date).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}</span>
            </div>

            {/* Monthly Theme */}
            <Card className="rounded-3xl bg-primary/10 border-primary/30 border-2">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">今月のテーマ</p>
                    <p className="text-xl font-bold text-primary">{monthlyTheme}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Drill Cards with per-drill feedback - Key Factor is NOT shown to players */}
            {drills.map((drill, index) => (
              <DrillCard
                key={index}
                drill={drill}
                icon={drillIcons[index]}
                label={drillLabels[index]}
                checked={checkedDrills.has(index)}
                onToggle={() => toggleDrill(index)}
                showFeedback={true}
                feedback={drillFeedbacks[index] || { rating: 0, comment: "" }}
                onFeedbackChange={(feedback) => handleDrillFeedbackChange(index, feedback)}
              />
            ))}

            {/* Coach Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground px-2 pt-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {plan.createdByCoachName}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {new Date(plan.updatedAt).toLocaleString("ja-JP", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Overall Reflection Section - Integrated into same page */}
            <div className="pt-4 border-t mt-6">
              <h2 className="text-xl font-bold mb-2">全体のふりかえり</h2>
              <p className="text-sm text-muted-foreground mb-4">
                各メニューのふりかえりを入力したら、全体の感想も書いてみよう
              </p>

              {isSubmitted ? (
                <Card className="rounded-3xl bg-primary/10 border-primary/30 border-2">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">ふりかえり完了！</h3>
                    <p className="text-muted-foreground">今日もおつかれさま！次の練習もがんばろう！</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Self Rating */}
                  <Card className="rounded-3xl">
                    <CardContent className="p-5">
                      <h3 className="font-bold mb-3">今日のできはどうだった？</h3>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setSelfRating(star)}
                            className="p-1 transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={cn(
                                "h-10 w-10 transition-colors",
                                star <= selfRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        {selfRating === 0 && "タップして評価しよう"}
                        {selfRating === 1 && "むずかしかった..."}
                        {selfRating === 2 && "もうちょっと！"}
                        {selfRating === 3 && "まあまあ！"}
                        {selfRating === 4 && "よくできた！"}
                        {selfRating === 5 && "サイコー！！"}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Good Points */}
                  <Card className="rounded-3xl">
                    <CardContent className="p-5 space-y-3">
                      <h3 className="font-bold">よかったこと</h3>
                      <Textarea
                        placeholder="今日できたこと、うまくいったことを書こう..."
                        value={goodPoints}
                        onChange={(e) => setGoodPoints(e.target.value)}
                        rows={3}
                        className="text-base rounded-2xl resize-none"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => openVoice("good")} 
                        className="w-full gap-2 h-10 rounded-xl"
                        size="sm"
                      >
                        <Mic className="h-4 w-4" />
                        声で入力
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Improvements */}
                  <Card className="rounded-3xl">
                    <CardContent className="p-5 space-y-3">
                      <h3 className="font-bold">もっとよくしたいこと</h3>
                      <Textarea
                        placeholder="次はこうしたい、ここを直したいということを書こう..."
                        value={improvements}
                        onChange={(e) => setImprovements(e.target.value)}
                        rows={3}
                        className="text-base rounded-2xl resize-none"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => openVoice("improve")} 
                        className="w-full gap-2 h-10 rounded-xl"
                        size="sm"
                      >
                        <Mic className="h-4 w-4" />
                        声で入力
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmitReflection}
                    disabled={selfRating === 0}
                    className="w-full h-14 text-lg rounded-2xl gap-2"
                  >
                    <Check className="h-5 w-5" />
                    ふりかえりを送信
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <VoiceInputModal open={voiceModalOpen} onOpenChange={setVoiceModalOpen} onResult={handleVoiceResult} />
    </div>
  )
}
