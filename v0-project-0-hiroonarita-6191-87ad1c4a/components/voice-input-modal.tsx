"use client"

import { useState } from "react"
import { Mic, MicOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface VoiceInputModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResult?: (text: string) => void
}

export function VoiceInputModal({ open, onOpenChange, onResult }: VoiceInputModalProps) {
  const [isRecording, setIsRecording] = useState(false)

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Mock: In real implementation, would use Web Speech API
    if (isRecording) {
      // Stop recording
      setTimeout(() => {
        onResult?.("（音声入力のテキストがここに入ります）")
        setIsRecording(false)
      }, 500)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">音声で入力</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-8">
          <button
            onClick={toggleRecording}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-all",
              isRecording
                ? "bg-destructive text-destructive-foreground animate-pulse"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {isRecording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
          </button>
          <p className="text-center text-muted-foreground">
            {isRecording ? "録音中...タップで停止" : "タップして話してね"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
