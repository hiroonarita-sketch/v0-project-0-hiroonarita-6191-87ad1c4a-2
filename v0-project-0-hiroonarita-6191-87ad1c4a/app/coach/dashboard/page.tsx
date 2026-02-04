"use client"

import { useState, useEffect } from "react"
import { Copy, Trash2, Save, Send, Lightbulb, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TeamSelect } from "@/components/team-select"
import { GradeGroupTabs } from "@/components/grade-group-tabs"
import { DrillAccordionSection } from "@/components/drill-accordion-section"
import { TemplatePickerModal } from "@/components/template-picker-modal"
import { DailyPlanPreview } from "@/components/daily-plan-preview"
import { useStore, emptyDrill, emptyKeyFactor, type Drill, type KeyFactor, type Template } from "@/lib/store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const KEY_FACTOR_SUGGESTIONS: Record<string, { situation: string; voiceCue: string }[]> = {
  ドリブル: [
    { situation: "相手が近づいてきた時", voiceCue: "ボールを体から離さない" },
    { situation: "スペースがある時", voiceCue: "顔を上げて運ぶ" },
    { situation: "密集地帯で", voiceCue: "細かくタッチ" },
  ],
  パス: [
    { situation: "ボールを受ける前", voiceCue: "先に見る" },
    { situation: "味方がマークされている時", voiceCue: "足元ではなくスペースへ" },
    { situation: "プレッシャーを受けた時", voiceCue: "ワンタッチで逃げる" },
  ],
  "1対1": [
    { situation: "1対1で相手と対峙した時", voiceCue: "相手の重心を見る" },
    { situation: "突破しようとする時", voiceCue: "縦を意識" },
    { situation: "守備で対応する時", voiceCue: "足を出さない" },
  ],
  シュート: [
    { situation: "シュートチャンスの時", voiceCue: "ゴールを見てから蹴る" },
    { situation: "GKと1対1", voiceCue: "落ち着いて流し込む" },
    { situation: "角度がない時", voiceCue: "ニアを狙う" },
  ],
}

export default function CoachDashboard() {
  const {
    selectedTeamId,
    selectedDate,
    selectedGradeGroup,
    setSelectedDate,
    getCurrentPlan,
    getYesterdayPlan,
    saveDraft,
    publishPlan,
    fetchPlans, // ★追加: データを読み込む機能
    isLoading,  // ★追加: 読み込み中かどうか
  } = useStore()

  const currentPlan = getCurrentPlan()

  const [warmup, setWarmup] = useState<Drill>(currentPlan?.warmup || emptyDrill)
  const [tr1, setTr1] = useState<Drill>(currentPlan?.tr1 || emptyDrill)
  const [tr2, setTr2] = useState<Drill>(currentPlan?.tr2 || emptyDrill)
  const [tr3, setTr3] = useState<Drill>(currentPlan?.tr3 || emptyDrill)
  const [keyFactor, setKeyFactor] = useState<KeyFactor>(currentPlan?.keyFactor || emptyKeyFactor)
  const [coachName] = useState("田中コーチ")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [suggestions, setSuggestions] = useState<{ situation: string; voiceCue: string }[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // ★重要：画面を開いたときにSupabaseからデータを取ってくる
  useEffect(() => {
    fetchPlans()
  }, [])

  // Sync with current plan when selection changes
  useEffect(() => {
    if (currentPlan) {
      setWarmup(currentPlan.warmup)
      setTr1(currentPlan.tr1)
      setTr2(currentPlan.tr2)
      setTr3(currentPlan.tr3)
      setKeyFactor(currentPlan.keyFactor)
    } else {
      clearAll()
    }
  }, [currentPlan, selectedTeamId, selectedDate, selectedGradeGroup])
  // ↑ currentPlan を依存配列に追加しました

  // --- 自動保存（オートセーブ）機能 ---
  useEffect(() => {
    // データ読み込み中や、まだデータがない時は保存しない
    if (isLoading) return
    if (!currentPlan && !warmup.title && !warmup.purpose) return

    // 前回のデータと全く同じなら保存しない（無限ループ防止）
    const isChanged = JSON.stringify({ warmup, tr1, tr2, tr3, keyFactor }) !== JSON.stringify({
        warmup: currentPlan?.warmup || emptyDrill,
        tr1: currentPlan?.tr1 || emptyDrill,
        tr2: currentPlan?.tr2 || emptyDrill,
        tr3: currentPlan?.tr3 || emptyDrill,
        keyFactor: currentPlan?.keyFactor || emptyKeyFactor
    })

    if (!isChanged) return

    setSaveStatus('saving')
    
    const timer = setTimeout(() => {
      saveDraft({
        teamId: selectedTeamId,
        date: selectedDate,
        gradeGroup: selectedGradeGroup,
        warmup,
        tr1,
        tr2,
        tr3,
        keyFactor,
        createdByCoachName: coachName,
      })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }, 2000)

    return () => clearTimeout(timer)
  }, [warmup, tr1, tr2, tr3, keyFactor, isLoading]) 

  const clearAll = () => {
    setWarmup({ ...emptyDrill })
    setTr1({ ...emptyDrill })
    setTr2({ ...emptyDrill })
    setTr3({ ...emptyDrill })
    setKeyFactor({ ...emptyKeyFactor })
    setErrors({})
  }

  const duplicateYesterday = () => {
    const yesterday = getYesterdayPlan()
    if (yesterday) {
      setWarmup({ ...yesterday.warmup })
      setTr1({ ...yesterday.tr1 })
      setTr2({ ...yesterday.tr2 })
      setTr3({ ...yesterday.tr3 })
      setKeyFactor({ ...yesterday.keyFactor })
    }
  }

  const loadTemplate = (template: Template) => {
    setWarmup({ ...template.warmup })
    setTr1({ ...template.tr1 })
    setTr2({ ...template.tr2 })
    setTr3({ ...template.tr3 })
    setKeyFactor({ ...template.keyFactor })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!warmup.title) newErrors.warmup = "タイトルを入力してください"
    if (!tr1.title) newErrors.tr1 = "タイトルを入力してください"
    if (!tr2.title) newErrors.tr2 = "タイトルを入力してください"
    if (!tr3.title) newErrors.tr3 = "タイトルを入力してください"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveDraft = () => {
    saveDraft({
      teamId: selectedTeamId,
      date: selectedDate,
      gradeGroup: selectedGradeGroup,
      warmup,
      tr1,
      tr2,
      tr3,
      keyFactor,
      createdByCoachName: coachName,
    })
    setSaveStatus('saved')
  }

  const handlePublish = () => {
    if (!validate()) return
    if (currentPlan?.status === "published") {
      setShowPublishConfirm(true)
    } else {
      doPublish()
    }
  }

  const doPublish = () => {
    publishPlan({
      teamId: selectedTeamId,
      date: selectedDate,
      gradeGroup: selectedGradeGroup,
      warmup,
      tr1,
      tr2,
      tr3,
      keyFactor,
      createdByCoachName: coachName,
    })
    setShowPublishConfirm(false)
  }

  const suggestKeyFactor = () => {
    const allTags = [...warmup.focusTags, ...tr1.focusTags, ...tr2.focusTags, ...tr3.focusTags]
    const uniqueTags = [...new Set(allTags)]
    const foundSuggestions: { situation: string; voiceCue: string }[] = []
    for (const tag of uniqueTags) {
      if (KEY_FACTOR_SUGGESTIONS[tag]) {
        foundSuggestions.push(...KEY_FACTOR_SUGGESTIONS[tag])
      }
    }
    if (foundSuggestions.length === 0) {
      foundSuggestions.push(
        { situation: "練習中いつでも", voiceCue: "声を出す" },
        { situation: "ミスした後", voiceCue: "切り替え早く" },
        { situation: "成功した時", voiceCue: "もう一回やってみよう" },
      )
    }
    setSuggestions(foundSuggestions.slice(0, 3))
  }

  const applySuggestion = (suggestion: { situation: string; voiceCue: string }) => {
    setKeyFactor(suggestion)
    setSuggestions([])
  }

  const yesterdayPlan = getYesterdayPlan()
  const status = currentPlan?.status

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            データを読み込み中...
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <TeamSelect />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <GradeGroupTabs />
          
          <div className="flex items-center gap-2 ml-auto">
             {saveStatus === 'saving' && (
               <span className="text-xs text-muted-foreground flex items-center gap-1">
                 <Loader2 className="h-3 w-3 animate-spin" /> 保存中...
               </span>
             )}
             {saveStatus === 'saved' && (
               <span className="text-xs text-primary font-medium flex items-center gap-1">
                 <CheckCircle2 className="h-3 w-3" /> 保存済み
               </span>
             )}
            
            {status && (
              <Badge variant={status === "published" ? "default" : "secondary"}>
                {status === "published" ? "公開中" : "下書き"}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Editor Panel */}
        <div className="flex-1 p-4 lg:p-6 lg:border-r">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={duplicateYesterday}
              disabled={!yesterdayPlan}
              className="gap-2 bg-transparent"
            >
              <Copy className="h-4 w-4" />
              昨日を複製
            </Button>
            <TemplatePickerModal onSelect={loadTemplate} />
            <Button variant="outline" size="sm" onClick={clearAll} className="gap-2 bg-transparent">
              <Trash2 className="h-4 w-4" />
              クリア
            </Button>
            <div className="flex-1" />
            
            <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2 bg-transparent">
              <Save className="h-4 w-4" />
              下書き保存
            </Button>
            <Button size="sm" onClick={handlePublish} className="gap-2">
              <Send className="h-4 w-4" />
              {status === "published" ? "更新" : "公開"}
            </Button>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">すべての練習タイトルを入力してください</p>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <DrillAccordionSection label="Warm-up" drill={warmup} onChange={setWarmup} error={errors.warmup} />
            <DrillAccordionSection label="TR1" drill={tr1} onChange={setTr1} error={errors.tr1} />
            <DrillAccordionSection label="TR2" drill={tr2} onChange={setTr2} error={errors.tr2} />
            <DrillAccordionSection label="TR3" drill={tr3} onChange={setTr3} error={errors.tr3} />
          </div>

          <div className="border rounded-lg p-4 bg-accent/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">🎯 キーファクター</h3>
              <Button variant="ghost" size="sm" onClick={suggestKeyFactor} className="gap-1 text-xs">
                <Lightbulb className="h-3.5 w-3.5" />
                提案
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs text-muted-foreground">提案から選択:</p>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => applySuggestion(s)}
                    className="w-full p-2 text-left text-sm rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <span className="text-muted-foreground">{s.situation}</span>
                    <span className="mx-2">→</span>
                    <span className="font-medium text-primary">「{s.voiceCue}」</span>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">場面</label>
                <Input
                  placeholder="どの場面で？例: 1対1で相手が近い時"
                  value={keyFactor.situation}
                  onChange={(e) => setKeyFactor({ ...keyFactor, situation: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">声かけ</label>
                <Input
                  placeholder="どんな声かけ？例: 先に見る/角度を作る"
                  value={keyFactor.voiceCue}
                  onChange={(e) => setKeyFactor({ ...keyFactor, voiceCue: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:w-[400px] p-4 lg:p-6 bg-muted/30">
          <h3 className="font-bold text-lg mb-4">👀 プレビュー（選手画面）</h3>
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

      <AlertDialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>公開済みプランを更新しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              このプランは既に公開されています。更新すると選手に表示される内容が変わります。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={doPublish}>更新する</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}