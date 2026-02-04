import { create } from "zustand"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type GradeGroup = "1-2" | "3-4" | "5-6"
export type Intensity = "low" | "mid" | "high"
export type PlanStatus = "draft" | "published"

export interface Drill {
  title: string
  purpose: string
  durationMin: number
  intensity: Intensity
  focusTags: string[]
  notes: string
}

export interface KeyFactor {
  situation: string
  voiceCue: string
}

export interface DailyPlan {
  team_id: string
  date: string
  grade_group: GradeGroup
  warmup: Drill
  tr1: Drill
  tr2: Drill
  tr3: Drill
  key_factor: KeyFactor
  status: PlanStatus
  created_by_coach_name: string
}

export const emptyDrill: Drill = { title: "", purpose: "", durationMin: 15, intensity: "mid", focusTags: [], notes: "" }
export const emptyKeyFactor: KeyFactor = { situation: "", voiceCue: "" }

interface StoreState {
  dailyPlans: DailyPlan[]
  selectedTeamId: string
  selectedDate: string
  selectedGradeGroup: GradeGroup
  setSelectedTeamId: (id: string) => void
  setSelectedDate: (date: string) => void
  setSelectedGradeGroup: (group: GradeGroup) => void
  fetchPlans: () => Promise<void>
  saveDraft: (planData: any) => Promise<void>
  getCurrentPlan: () => DailyPlan | undefined
}

export const useStore = create<StoreState>((set, get) => ({
  dailyPlans: [],
  selectedTeamId: "team-1",
  selectedDate: new Date().toISOString().split("T")[0],
  selectedGradeGroup: "3-4",

  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedGradeGroup: (group) => set({ selectedGradeGroup: group }),

  fetchPlans: async () => {
    const { data, error } = await supabase.from("plans").select("*")
    if (!error && data) set({ dailyPlans: data })
  },

  saveDraft: async (planData) => {
    const { selectedTeamId, selectedDate, selectedGradeGroup } = get()
    const finalData = {
      team_id: selectedTeamId,
      date: selectedDate,
      grade_group: selectedGradeGroup,
      ...planData,
      status: "draft"
    }
    await supabase.from("plans").upsert(finalData, { onConflict: "team_id,date,grade_group" })
    get().fetchPlans()
  },

  getCurrentPlan: () => {
    const { dailyPlans, selectedTeamId, selectedDate, selectedGradeGroup } = get()
    return dailyPlans.find(p => p.team_id === selectedTeamId && p.date === selectedDate && p.grade_group === selectedGradeGroup)
  }
}))