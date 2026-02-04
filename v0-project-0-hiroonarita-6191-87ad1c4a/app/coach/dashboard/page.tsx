"use client"

import { useState, useEffect, useCallback } from "react"
import { Save, CheckCircle2, Loader2 } from "lucide-react"
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
    isLoading
  } = useStore()

  const [warmup, setWarmup] = useState<Drill>(emptyDrill)
  const [tr1, setTr1] = useState<Drill>(emptyDrill)
  const [tr2, setTr2] = useState<Drill>(emptyDrill)
  const [tr3, setTr3] = useState<Drill>(emptyDrill)
  const [keyFactor, setKeyFactor] = useState<KeyFactor>(emptyKeyFactor)
  const [coachName, setCoachName] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  // 1. ページを開いた時や日付を変えた時にデータを読み込む
  useEffect(() => {
    fetchPlans()
  }, [selectedTeamId, selectedDate, selectedGradeGroup, fetchPlans])

  // 2. 読み込んだデータを入力欄にセットする
  useEffect(() => {
    const plan = getCurrentPlan()
    if (plan) {
      setWarmup(plan.warmup)
      setTr1(plan.tr1)
      setTr2(plan.tr2)
      setTr3(plan.tr3)
      setKeyFactor(plan.key_factor)
      setCoachName(plan.created_by_coach_name)
    } else {
      setWarmup(emptyDrill)
      setTr1(emptyDrill)
      setTr2(emptyDrill)
      setTr3(emptyDrill)
      setKeyFactor(emptyKeyFactor)
    }
  }, [selectedTeamId, selectedDate, selectedGradeGroup, getCurrentPlan])

  // 3. 自動保存の仕組み (入力が止まって1.5秒後に実行)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (warmup.title || tr1.title || coachName) {
        setSaveStatus("saving")
        await saveDraft({
          team_id: selectedTeamId,
          date: selectedDate,
          grade_group: selectedGradeGroup,
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
  }, [warmup, tr1, tr2, tr3, keyFactor, coachName, selectedTeamId, selectedDate, selectedGradeGroup, saveDraft])

  return (
    <div className=\"flex flex-col min-h-screen bg-background\">
      <header className=\"sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between\">
        <div className=\"flex items-center gap-4\">
          <TeamSelect />
          <Input
            type=\"date\"
            value={selectedDate}
            onChange={(e) => useStore.getState().setSelectedDate(e.target.value)}
            className=\"w-40 bg-transparent\"
          />
        </div>
        <div className=\"flex items-center gap-2 text-sm\">
          {saveStatus === \"saving\" && <><Loader2 className=\"h-4 w-4 animate-spin text-muted-foreground\" /> <span className=\"text-muted-foreground\">保存中...</span></>}
          {saveStatus === \"saved\" && <><CheckCircle2 className=\"h-4 w-4 text-green-500\" /> <span className=\"text-green-500 font-medium\">保存済み</span></>}
        </div>
      </header>

      <div className=\"flex flex-col lg:flex-row flex-1 overflow-hidden\">
        <div className=\"flex-1 overflow-y-auto p-4 lg:p-6 space-y-8 max-w-3xl mx-auto w-full\">
          <section className=\"space-y-4\">
            <h2 className=\"text-2xl font-bold\">基本情報</h2>
            <div className=\"grid gap-4\">
              <GradeGroupTabs />
              <Input
                placeholder=\"コーチ名を入力\"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                className=\"text-lg font-semibold\"
              />
            </div>
          </section>

          <section className=\"space-y-4\">
            <h2 className=\"text-2xl font-bold\">練習メニュー</h2>
            <div className=\"space-y-4\">
              <DrillAccordionSection label=\"Warm-up\" drill={warmup} onChange={setWarmup} />
              <DrillAccordionSection label=\"TR1\" drill={tr1} onChange={setTr1} />
              <DrillAccordionSection label=\"TR2\" drill={tr2} onChange={setTr2} />
              <DrillAccordionSection label=\"TR3\" drill={tr3} onChange={setTr3} />
            </div>
          </section>

          <section className=\"space-y-4 pb-12\">
            <h2 className=\"text-2xl font-bold\">キーファクター</h2>
            <div className=\"p-4 rounded-2xl bg-card border space-y-4\">
              <Input
                placeholder=\"場面: 例）相手が寄せてきた時\"
                value={keyFactor.situation}
                onChange={(e) => setKeyFactor({ ...keyFactor, situation: e.target.value })}
              />
              <Input
                placeholder=\"声かけ: 例）遠い足でコントロール\"
                value={keyFactor.voiceCue}
                onChange={(e) => setKeyFactor({ ...keyFactor, voiceCue: e.target.value })}
              />
            </div>
          </section>
        </div>

        <div className=\"lg:w-[400px] border-l bg-muted/20 p-6 hidden lg:block overflow-y-auto\">
          <h3 className=\"font-bold text-lg mb-4\">👀 プレビュー</h3>
          <DailyPlanPreview
            warmup={warmup}
            tr1={tr1}
            tr2={tr2}
            tr3={tr3}
            keyFactor={keyFactor}
            coachName={coachName}
            updatedAt={new Date().toISOString()}
            compact
          />
        </div>
      </div>
    </div>
  )
}