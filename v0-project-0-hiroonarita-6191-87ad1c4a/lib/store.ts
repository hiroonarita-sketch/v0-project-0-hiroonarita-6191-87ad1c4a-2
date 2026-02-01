import { create } from "zustand"

// Types
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
  "ドリブル",
  "パス",
  "トラップ",
  "シュート",
  "1対1",
  "守備",
  "切り返し",
  "周辺視野",
  "判断",
  "体の向き",
  "サポート",
  "切替",
  "声かけ",
  "コントロール",
  "スピード",
]

// Empty drill
export const emptyDrill: Drill = {
  title: "",
  purpose: "",
  durationMin: 10,
  intensity: "mid",
  focusTags: [],
  notes: "",
}

// Empty key factor
export const emptyKeyFactor: KeyFactor = {
  situation: "",
  voiceCue: "",
}

// Seed data
const seedTeams: Team[] = [{ id: "team-1", name: "Sample FC" }]

const seedTemplates: Template[] = [
  {
    id: "template-1",
    name: "Ball Mastery",
    warmup: {
      title: "ボールタッチ練習",
      purpose: "ボール感覚を養う",
      durationMin: 10,
      intensity: "low",
      focusTags: ["コントロール", "ドリブル"],
      notes: "",
    },
    tr1: {
      title: "インサイド・アウトサイドタッチ",
      purpose: "両足でのボールコントロール",
      durationMin: 15,
      intensity: "mid",
      focusTags: ["ドリブル", "コントロール", "切り返し"],
      notes: "",
    },
    tr2: {
      title: "コーンドリブル",
      purpose: "狭いスペースでのボール扱い",
      durationMin: 15,
      intensity: "mid",
      focusTags: ["ドリブル", "スピード", "判断"],
      notes: "",
    },
    tr3: {
      title: "フリードリブルゲーム",
      purpose: "実践的なボールキープ",
      durationMin: 15,
      intensity: "high",
      focusTags: ["ドリブル", "1対1", "周辺視野"],
      notes: "",
    },
    keyFactor: {
      situation: "相手が近づいてきた時",
      voiceCue: "ボールを体から離さない",
    },
  },
  {
    id: "template-2",
    name: "1v1 Attack/Defend",
    warmup: {
      title: "ダイナミックストレッチ",
      purpose: "体を温める",
      durationMin: 10,
      intensity: "low",
      focusTags: ["コントロール"],
      notes: "",
    },
    tr1: {
      title: "1対1 突破練習",
      purpose: "相手を抜く技術の習得",
      durationMin: 15,
      intensity: "mid",
      focusTags: ["1対1", "ドリブル", "切り返し"],
      notes: "",
    },
    tr2: {
      title: "1対1 守備練習",
      purpose: "ボールを奪う技術",
      durationMin: 15,
      intensity: "mid",
      focusTags: ["1対1", "守備", "体の向き"],
      notes: "",
    },
    tr3: {
      title: "1対1 ミニゲーム",
      purpose: "実践的な1対1の判断力",
      durationMin: 15,
      intensity: "high",
      focusTags: ["1対1", "判断", "切替"],
      notes: "",
    },
    keyFactor: {
      situation: "1対1で相手と対峙した時",
      voiceCue: "相手の重心を見る",
    },
  },
  {
    id: "template-3",
    name: "Passing & Support",
    warmup: {
      title: "パス交換",
      purpose: "正確なパスの感覚を掴む",
      durationMin: 10,
      intensity: "low",
      focusTags: ["パス", "トラップ"],
      notes: "",
    },
    tr1: {
      title: "トライアングルパス",
      purpose: "三角形を意識したパス回し",
      durationMin: 15,
      intensity: "mid",
      focusTags: ["パス", "サポート", "体の向き"],
      notes: "",
    },
    tr2: {
      title: "3対1 ロンド",
      purpose: "数的優位でのボール保持",
      durationMin: 15,
      intensity: "mid",
      focusTags: ["パス", "判断", "周辺視野"],
      notes: "",
    },
    tr3: {
      title: "4対4+2フリーマン",
      purpose: "実践的なパスゲーム",
      durationMin: 15,
      intensity: "high",
      focusTags: ["パス", "サポート", "声かけ"],
      notes: "",
    },
    keyFactor: {
      situation: "ボールを受ける前",
      voiceCue: "先に見る・角度を作る",
    },
  },
  {
    id: "template-4",
    name: "Finishing",
    warmup: {
      title: "シュート基本練習",
      purpose: "シュートフォームの確認",
      durationMin: 10,
      intensity: "low",
      focusTags: ["シュート", "コントロール"],
      notes: "",
    },
    tr1: {
      title: "ゴール前1タッチシュート",
      purpose: "素早いシュート判断",
      durationMin: 15,
      intensity: "mid",
      focusTags: ["シュート", "判断", "スピード"],
      notes: "",
    },
    tr2: {
      title: "ドリブルからシュート",
      purpose: "ドリブルとシュートの連携",
      durationMin: 15,
      intensity: "mid",
      focusTags: ["シュート", "ドリブル", "判断"],
      notes: "",
    },
    tr3: {
      title: "2対1+GKシュートゲーム",
      purpose: "実践的なフィニッシュ",
      durationMin: 15,
      intensity: "high",
      focusTags: ["シュート", "パス", "判断"],
      notes: "",
    },
    keyFactor: {
      situation: "シュートチャンスの時",
      voiceCue: "ゴールを見てから蹴る",
    },
  },
]

const today = new Date().toISOString().split("T")[0]

const seedDailyPlans: DailyPlan[] = [
  {
    id: "plan-1",
    teamId: "team-1",
    date: today,
    gradeGroup: "3-4",
    warmup: seedTemplates[2].warmup,
    tr1: seedTemplates[2].tr1,
    tr2: seedTemplates[2].tr2,
    tr3: seedTemplates[2].tr3,
    keyFactor: seedTemplates[2].keyFactor,
    status: "published",
    createdByCoachName: "田中コーチ",
    updatedAt: new Date().toISOString(),
  },
]

interface StoreState {
  teams: Team[]
  templates: Template[]
  dailyPlans: DailyPlan[]
  selectedTeamId: string
  selectedDate: string
  selectedGradeGroup: GradeGroup

  // Actions
  setSelectedTeamId: (id: string) => void
  setSelectedDate: (date: string) => void
  setSelectedGradeGroup: (group: GradeGroup) => void

  getCurrentPlan: () => DailyPlan | undefined
  getYesterdayPlan: () => DailyPlan | undefined

  saveDraft: (plan: Omit<DailyPlan, "id" | "status" | "updatedAt">) => void
  publishPlan: (plan: Omit<DailyPlan, "id" | "status" | "updatedAt">) => void
  updatePlan: (planId: string, updates: Partial<DailyPlan>) => void
}

export const useStore = create<StoreState>((set, get) => ({
  teams: seedTeams,
  templates: seedTemplates,
  dailyPlans: seedDailyPlans,
  selectedTeamId: seedTeams[0].id,
  selectedDate: today,
  selectedGradeGroup: "3-4",

  setSelectedTeamId: (id) => set({ selectedTeamId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedGradeGroup: (group) => set({ selectedGradeGroup: group }),

  getCurrentPlan: () => {
    const { dailyPlans, selectedTeamId, selectedDate, selectedGradeGroup } = get()
    return dailyPlans.find(
      (p) => p.teamId === selectedTeamId && p.date === selectedDate && p.gradeGroup === selectedGradeGroup,
    )
  },

  getYesterdayPlan: () => {
    const { dailyPlans, selectedTeamId, selectedDate, selectedGradeGroup } = get()
    const yesterday = new Date(selectedDate)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]
    return dailyPlans.find(
      (p) =>
        p.teamId === selectedTeamId &&
        p.date === yesterdayStr &&
        p.gradeGroup === selectedGradeGroup &&
        p.status === "published",
    )
  },

  saveDraft: (plan) => {
    const { dailyPlans, selectedTeamId, selectedDate, selectedGradeGroup } = get()
    const existingIndex = dailyPlans.findIndex(
      (p) => p.teamId === selectedTeamId && p.date === selectedDate && p.gradeGroup === selectedGradeGroup,
    )

    const newPlan: DailyPlan = {
      ...plan,
      id: existingIndex >= 0 ? dailyPlans[existingIndex].id : `plan-${Date.now()}`,
      status: "draft",
      updatedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      const updated = [...dailyPlans]
      updated[existingIndex] = newPlan
      set({ dailyPlans: updated })
    } else {
      set({ dailyPlans: [...dailyPlans, newPlan] })
    }
  },

  publishPlan: (plan) => {
    const { dailyPlans, selectedTeamId, selectedDate, selectedGradeGroup } = get()
    const existingIndex = dailyPlans.findIndex(
      (p) => p.teamId === selectedTeamId && p.date === selectedDate && p.gradeGroup === selectedGradeGroup,
    )

    const newPlan: DailyPlan = {
      ...plan,
      id: existingIndex >= 0 ? dailyPlans[existingIndex].id : `plan-${Date.now()}`,
      status: "published",
      updatedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      const updated = [...dailyPlans]
      updated[existingIndex] = newPlan
      set({ dailyPlans: updated })
    } else {
      set({ dailyPlans: [...dailyPlans, newPlan] })
    }
  },

  updatePlan: (planId, updates) => {
    const { dailyPlans } = get()
    const updated = dailyPlans.map((p) =>
      p.id === planId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
    )
    set({ dailyPlans: updated })
  },
}))
