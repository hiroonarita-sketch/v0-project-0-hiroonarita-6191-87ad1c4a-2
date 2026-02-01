"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mic, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { VoiceInputModal } from "@/components/voice-input-modal"
import { cn } from "@/lib/utils"

const moods = [
  { emoji: "😊", label: "たのしかった！" },
  { emoji: "💪", label: "がんばった！" },
  { emoji: "🤔", label: "むずかしかった" },
  { emoji: "😤", label: "くやしい！" },
]

const steps = [
  { title: "今日の気分は？", description: "練習を終えた気持ちを教えてね" },
  { title: "できたことは？", description: "今日うまくできたことを書こう" },
  { title: "次やってみたいことは？", description: "次の練習でチャレンジしたいこと" },
]

export default function PlayerReflect() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [goodPoints, setGoodPoints] = useState("")
  const [nextTry, setNextTry] = useState("")
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [voiceTarget, setVoiceTarget] = useState<"good" | "next">("good")

  const canProceed = () => {
    if (currentStep === 0) return selectedMood !== null
    if (currentStep === 1) return goodPoints.trim().length > 0
    if (currentStep === 2) return nextTry.trim().length > 0
    return false
  }

  const nextStep = () => {
    if (currentStep < 2 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleVoiceResult = (text: string) => {
    if (voiceTarget === "good") {
      setGoodPoints((prev) => prev + text)
    } else {
      setNextTry((prev) => prev + text)
    }
  }

  const openVoice = (target: "good" | "next") => {
    setVoiceTarget(target)
    setVoiceModalOpen(true)
  }

  const isComplete = currentStep === 2 && canProceed()

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/player/today">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">📝 ふりかえり</h1>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mt-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn("flex-1 h-2 rounded-full transition-colors", i <= currentStep ? "bg-primary" : "bg-muted")}
            />
          ))}
        </div>
      </header>

      <main className="p-4">
        <Card className="rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-2">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>

            {/* Step 1: Mood */}
            {currentStep === 0 && (
              <div className="grid grid-cols-2 gap-3">
                {moods.map((mood, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedMood(i)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all",
                      selectedMood === i ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                    )}
                  >
                    <span className="text-5xl">{mood.emoji}</span>
                    <span className="font-medium">{mood.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Good Points */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <Textarea
                  placeholder="今日できたことを書いてみよう..."
                  value={goodPoints}
                  onChange={(e) => setGoodPoints(e.target.value)}
                  rows={5}
                  className="text-lg rounded-2xl"
                />
                <Button variant="outline" onClick={() => openVoice("good")} className="w-full gap-2 h-12 rounded-xl">
                  <Mic className="h-5 w-5" />
                  声で入力する
                </Button>
              </div>
            )}

            {/* Step 3: Next Try */}
            {currentStep === 2 && (
              <div className="space-y-3">
                <Textarea
                  placeholder="次にチャレンジしたいことを書いてみよう..."
                  value={nextTry}
                  onChange={(e) => setNextTry(e.target.value)}
                  rows={5}
                  className="text-lg rounded-2xl"
                />
                <Button variant="outline" onClick={() => openVoice("next")} className="w-full gap-2 h-12 rounded-xl">
                  <Mic className="h-5 w-5" />
                  声で入力する
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep} className="h-14 rounded-2xl px-6 bg-transparent">
              もどる
            </Button>
          )}
          {isComplete ? (
            <Link href="/player/today" className="flex-1">
              <Button className="w-full h-14 text-lg rounded-2xl gap-2">
                <Check className="h-5 w-5" />
                かんりょう！
              </Button>
            </Link>
          ) : (
            <Button onClick={nextStep} disabled={!canProceed()} className="flex-1 h-14 text-lg rounded-2xl gap-2">
              つぎへ
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <VoiceInputModal open={voiceModalOpen} onOpenChange={setVoiceModalOpen} onResult={handleVoiceResult} />
    </div>
  )
}
