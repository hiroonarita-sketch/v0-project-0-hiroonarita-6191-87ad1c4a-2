import { create } from "zustand"
import { createClient } from "@supabase/supabase-js"

// --- Supabaseのセットアップ ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// --- 型定義 (変更なし) ---
export type GradeGroup = "1-2" | "3-4" | "5-6"
export type Intensity = "low" | "mid" | "high"
export type PlanStatus = "draft" | "published"

export interface Team {
  id: string
  name: string
}

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
  id: string
  teamId: string
  date: string
  gradeGroup: GradeGroup
  warmup: Drill
  tr1: Drill
  tr2: Drill
  tr3: Drill
  keyFactor: KeyFactor
  status: PlanStatus
  createdByCoachName: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  warmup: Drill
  tr1: Drill
  tr2: Drill
  tr3: Drill
  keyFactor: KeyFactor
}

// Focus tags
export const FOCUS_TAGS = [
  "ドリブル", "パス", "トラップ", "シュート", "1対1",
  "守備", "切り返し", "周辺視野", "判断", "体の向き",
  "サポート", "切替", "声かけ", "コントロール", "スピード",
]

// Empty objects
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

// --- ストアの定義 ---

interface StoreState {
  // 選択状態
  selectedTeamId: string
  selectedDate: string
  selectedGradeGroup: GradeGroup

  // データ
  teams: Team[]
  dailyPlans: DailyPlan[]
  templates: Template[]
  
  // 読み込み中かどうか
  isLoading: boolean

  // アクション（操作）
  setSelectedTeamId: (id: string) => void
  setSelectedDate: (date: string) => void
  setSelectedGradeGroup: (grade: GradeGroup) => void
  
  // データの取得と保存
  fetchPlans: () => Promise<void> // データを読み込む
  getCurrentPlan: () => DailyPlan | undefined
  getYesterdayPlan: () => DailyPlan | undefined
  
  saveDraft: (data: Omit<DailyPlan, "id" | "status" | "updatedAt">) => Promise<void>
  publishPlan: (data: Omit<DailyPlan, "id" | "status" | "updatedAt">) => Promise<void>
  
  // 汎用的な保存（選手からの入力などにも使える）
  updatePlan: (plan: DailyPlan) => Promise<void>
}

// 今日の日付を YYYY-MM-DD 形式で取得
const getTodayString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const useStore = create<StoreState>((set, get) => ({
  selectedTeamId: "team-1",
  selectedDate: getTodayString(),
  selectedGradeGroup: "3-4",
  
  teams: [
    { id: "team-1", name: "FC Vercel U-12" },
    { id: "team-2", name: "FC Vercel U-10" },
  ],
  
  dailyPlans: [],
  templates: [],
  isLoading: false,

  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedGradeGroup: (grade) => set({ selectedGradeGroup: grade }),

  // ★重要：Supabaseからデータを読み込む関数
  fetchPlans: async () => {
    set({ isLoading: true })
    const { data, error } = await supabase.from('plans').select('*')
    
    if (error) {
      console.error('Error fetching plans:', error)
      set({ isLoading: false })
      return
    }

    if (data) {
      // Supabaseのデータをアプリの形式に変換
      const loadedPlans = data.map((row: any) => ({
        ...row.content, // 中身を展開
        id: row.id,     // IDは上書き
        status: row.status,
        updatedAt: row.updated_at
      }))
      set({ dailyPlans: loadedPlans, isLoading: false })
      console.log('Fetched plans:', loadedPlans)
    }
  },

  getCurrentPlan: () => {
    const { dailyPlans, selectedTeamId, selectedDate, selectedGradeGroup } = get()
    return dailyPlans.find(
      (p) =>
        p.teamId === selectedTeamId &&
        p.date === selectedDate &&
        p.gradeGroup === selectedGradeGroup,
    )
  },

  getYesterdayPlan: () => {
    const { dailyPlans, selectedTeamId, selectedDate, selectedGradeGroup } = get()
    const today = new Date(selectedDate)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`
    
    return dailyPlans.find(
      (p) =>
        p.teamId === selectedTeamId &&
        p.date === yStr &&
        p.gradeGroup === selectedGradeGroup,
    )
  },

  // ★重要：保存機能（自動保存で呼ばれる）
  saveDraft: async (data) => {
    const { dailyPlans, fetchPlans } = get()
    
    // すでに同じ日付・チームのプランがあるか探す
    const existingPlan = get().getCurrentPlan()
    
    // IDを決める（あれば使う、なければ作る）
    const planId = existingPlan ? existingPlan.id : `plan-${Date.now()}`
    
    const newPlan: DailyPlan = {
      ...data,
      id: planId,
      status: "draft",
      updatedAt: new Date().toISOString(),
    }

    // メモリ上のデータを即座に更新（画面の反応を良くするため）
    if (existingPlan) {
        set({ dailyPlans: dailyPlans.map(p => p.id === planId ? newPlan : p) })
    } else {
        set({ dailyPlans: [...dailyPlans, newPlan] })
    }

    // Supabaseに送信
    const { error } = await supabase.from('plans').upsert({
      id: planId,
      team_id: data.teamId,
      date: data.date,
      grade_group: data.gradeGroup,
      content: newPlan, // 内容をJSONとして保存
      status: 'draft',
      updated_at: newPlan.updatedAt,
      created_by: data.createdByCoachName
    })

    if (error) console.error('Save failed:', error)
  },

  publishPlan: async (data) => {
    const { dailyPlans } = get()
    const existingPlan = get().getCurrentPlan()
    const planId = existingPlan ? existingPlan.id : `plan-${Date.now()}`

    const newPlan: DailyPlan = {
      ...data,
      id: planId,
      status: "published",
      updatedAt: new Date().toISOString(),
    }

    set({ dailyPlans: dailyPlans.map(p => p.id === planId ? newPlan : p) })

    // Supabaseに送信（ステータスを published に）
    await supabase.from('plans').upsert({
      id: planId,
      team_id: data.teamId,
      date: data.date,
      grade_group: data.gradeGroup,
      content: newPlan,
      status: 'published',
      updated_at: newPlan.updatedAt,
      created_by: data.createdByCoachName
    })
  },
  
  // 選手画面などで使う汎用保存
  updatePlan: async (plan) => {
     const { dailyPlans } = get()
     // メモリ更新
     set({ dailyPlans: dailyPlans.map(p => p.id === plan.id ? plan : p) })
     
     // DB更新
     await supabase.from('plans').upsert({
      id: plan.id,
      team_id: plan.teamId,
      date: plan.date,
      grade_group: plan.gradeGroup,
      content: plan,
      status: plan.status,
      updated_at: new Date().toISOString(),
      created_by: plan.createdByCoachName
    })
  }
}))