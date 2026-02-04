import { create } from "zustand"
import { createClient } from "@supabase/supabase-js"

// Supabaseの接続設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- 型定義などはそのまま ---
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
  id?: string
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
  updated_at?: string
}

export const emptyDrill: Drill = {
  title: "",
  purpose: "",
  durationMin: 15,
  intensity: "mid",
  focusTags: [],
  notes: "",
}

export const emptyKeyFactor: KeyFactor = {
  situation: "",
  voiceCue: "",
}

interface StoreState {
  dailyPlans: DailyPlan[]
  selectedTeamId: string
  selectedDate: string
  selectedGradeGroup: GradeGroup
  isLoading: boolean
  // Actions
  setSelectedTeamId: (id: string) => void
  setSelectedDate: (date: string) => void
  setSelectedGradeGroup: (group: GradeGroup) => void
  fetchPlans: () => Promise<void>
  saveDraft: (plan: Omit<DailyPlan, "status">) => Promise<void>
  publishPlan: (plan: Omit<DailyPlan, "status">) => Promise<void>
  getCurrentPlan: () => DailyPlan | undefined
}

export const useStore = create<StoreState>((set, get) => ({
  dailyPlans: [],
  selectedTeamId: "team-1",
  selectedDate: new Date().toISOString().split("T")[0],
  selectedGradeGroup: "3-4",
  isLoading: false,

  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedGradeGroup: (group) => set({ selectedGradeGroup: group }),

  // データを読み込む
  fetchPlans: async () => {
    set({ isLoading: true })
    const { data, error } = await supabase.from("plans").select("*")
    if (!error && data) {
      // データベースのカラム名（スネークケース）をプログラムの型に合わせる
      const formattedData = data.map((p: any) => ({
        ...p,
        teamId: p.team_id,
        gradeGroup: p.grade_group,
        keyFactor: p.key_factor,
        createdByCoachName: p.created_by_coach_name,
        updatedAt: p.updated_at,
      }))
      set({ dailyPlans: formattedData, isLoading: false })
    } else {
      set({ isLoading: false })
    }
  },

  // 保存（下書き）
  saveDraft: async (planData) => {
    const { selectedTeamId, selectedDate, selectedGradeGroup } = get()
    const newPlan = {
      team_id: selectedTeamId,
      date: selectedDate,
      grade_group: selectedGradeGroup,
      ...planData,
      status: "draft",
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("plans")
      .upsert(newPlan, { onConflict: "team_id,date,grade_group" })

    if (!error) {
      get().fetchPlans() // 保存後に再読み込み
    }
  },

  // 公開
  publishPlan: async (planData) => {
    const { selectedTeamId, selectedDate, selectedGradeGroup } = get()
    const newPlan = {
      team_id: selectedTeamId,
      date: selectedDate,
      grade_group: selectedGradeGroup,
      ...planData,
      status: "published",
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from("plans")
      .upsert(newPlan, { onConflict: "team_id,date,grade_group" })

    if (!error) {
      get().fetchPlans()
    }
  },

  getCurrentPlan: () => {
    const { dailyPlans, selectedTeamId, selectedDate, selectedGradeGroup } = get()
    return dailyPlans.find(
      (p) => p.team_id === selectedTeamId && p.date === selectedDate && p.grade_group === selectedGradeGroup,
    )
  },
}))