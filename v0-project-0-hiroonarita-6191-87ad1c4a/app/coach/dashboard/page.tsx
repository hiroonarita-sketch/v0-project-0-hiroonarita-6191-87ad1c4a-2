"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TeamSelect } from "@/components/team-select"
import { GradeGroupTabs } from "@/components/grade-group-tabs"
import { DrillAccordionSection } from "@/components/drill-accordion-section"
import { DailyPlanPreview } from "@/components/daily-plan-preview"
import { useStore, emptyDrill, emptyKeyFactor, type Drill, type KeyFactor } from "@/lib/store"

export default function CoachDashboard() {
  const {
    selectedTeamId,
    selectedDate,
    selectedGradeGroup,
    fetchPlans,
    saveDraft,
    getCurrentPlan,
  } = useStore()

  // 入力データを管理する「箱」
  const [warmup, setWarmup] = useState<Drill>(emptyDrill)
  const [tr1, setTr1] = useState<Drill>(emptyDrill)
  const [tr2, setTr2] = useState<Drill>(emptyDrill)
  const [tr3, setTr3] = useState<Drill>(emptyDrill)
  const [keyFactor, setKeyFactor] = useState<KeyFactor>(emptyKeyFactor)
  const [coachName, setCoachName] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  // 【読み込み】ページを開いた時にデータを呼ぶ
  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  // 【読み込み】データが見つかったら入力欄に入れる
  useEffect(() => {
    const plan = getCurrentPlan()
    if (plan) {
      setWarmup(plan.warmup)
      setTr1(plan.tr1)
      setTr2(plan.tr2)
      setTr3(plan.tr3)
      setKeyFactor(plan.key_factor)
      setCoachName(plan.created_by_coach_name)
    }
  }, [selectedTeamId, selectedDate, selectedGradeGroup, getCurrentPlan])

  // 【自動保存】文字を打つのを止めて1.5秒後に保存
  useEffect(() => {
    const timer = setTimeout(async () => {
      // タイトルか名前が入っている時だけ保存する
      if (warmup.title || tr1.title || coachName) {
        setSaveStatus("saving")
        await saveDraft({
          warmup,
          tr1,
          tr2,
          tr3,
          key_factor: keyFactor,
          created_by_coach_name: coachName,
        })
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [warmup, tr1, tr2, tr3, keyFactor, coachName])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <TeamSelect />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => useStore.getState().setSelectedDate(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === "saving" && <><Loader2 className="h-4 w-4 animate-spin" /> 保存中...</>}
          {saveStatus === "saved" && <><CheckCircle2 className="h-4 w-4 text-green-500" /> 保存済み</>}
        </div>
      </header>

      <main className="p-4 max-w-3xl mx-auto w-full space-y-6 pb-20">
        <div className="space-y-4">
          <GradeGroupTabs />
          <Input
            placeholder="コーチ名を入力"
            value={coachName}
            onChange={(e) => setCoachName(e.target.value)}
            className="text-lg font-bold"
          />
        </div>

        <div className="space-y-4">
          <DrillAccordionSection label="Warm-up" drill={warmup} onChange={setWarmup} />
          <DrillAccordionSection label="TR1" drill={tr1} onChange={setTr1} />
          <DrillAccordionSection label="TR2" drill={tr2} onChange={setTr2} />
          <DrillAccordionSection label="TR3" drill={tr3} onChange={setTr3} />
        </div>

        <div className="p-4 rounded-xl bg-muted/50 space-y-3">
          <h3 className="font-bold">キーファクター</h3>
          <Input
            placeholder="場面"
            value={keyFactor.situation}
            onChange={(e) => setKeyFactor({ ...keyFactor, situation: e.target.value })}
          />
          <Input
            placeholder="声かけ"
            value={keyFactor.voiceCue}
            onChange={(e) => setKeyFactor({ ...keyFactor, voiceCue: e.target.value })}
          />
        </div>
      </main>
    </div>
  )
}