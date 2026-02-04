"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TeamSelect } from "@/components/team-select"
import { GradeGroupTabs } from "@/components/grade-group-tabs"
import { DrillAccordionSection } from "@/components/drill-accordion-section"
import { useStore, emptyDrill, emptyKeyFactor } from "@/lib/store"

export default function CoachDashboard() {
  const { selectedTeamId, selectedDate, selectedGradeGroup, fetchPlans, saveDraft, getCurrentPlan } = useStore()

  const [warmup, setWarmup] = useState(emptyDrill)
  const [tr1, setTr1] = useState(emptyDrill)
  const [tr2, setTr2] = useState(emptyDrill)
  const [tr3, setTr3] = useState(emptyDrill)
  const [keyFactor, setKeyFactor] = useState(emptyKeyFactor)
  const [coachName, setCoachName] = useState("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => { fetchPlans() }, [fetchPlans])

  useEffect(() => {
    const plan = getCurrentPlan()
    if (plan) {
      setWarmup(plan.warmup); setTr1(plan.tr1); setTr2(plan.tr2); setTr3(plan.tr3)
      setKeyFactor(plan.key_factor); setCoachName(plan.created_by_coach_name)
    }
  }, [selectedTeamId, selectedDate, selectedGradeGroup, getCurrentPlan])

  const handleManualSave = async () => {
    setSaveStatus("saving")
    await saveDraft({ warmup, tr1, tr2, tr3, key_factor: keyFactor, created_by_coach_name: coachName })
    setSaveStatus("saved")
    setTimeout(() => setSaveStatus("idle"), 2000)
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6 pb-20">
      <header className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <TeamSelect />
          <Input type="date" value={selectedDate} onChange={(e) => useStore.getState().setSelectedDate(e.target.value)} />
        </div>
        <div>
          {saveStatus === "saving" ? <Loader2 className="animate-spin" /> : 
           saveStatus === "saved" ? <CheckCircle2 className="text-green-500" /> : null}
        </div>
      </header>

      <GradeGroupTabs />
      <Input placeholder="コーチ名" value={coachName} onChange={(e) => setCoachName(e.target.value)} />
      
      <DrillAccordionSection label="Warm-up" drill={warmup} onChange={setWarmup} />
      <DrillAccordionSection label="TR1" drill={tr1} onChange={setTr1} />
      <DrillAccordionSection label="TR2" drill={tr2} onChange={setTr2} />
      <DrillAccordionSection label="TR3" drill={tr3} onChange={setTr3} />

      <button onClick={handleManualSave} className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold">
        【テスト】ここを押して保存する
      </button>
    </div>
  )
}