"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useStore, type Template } from "@/lib/store"
import { cn } from "@/lib/utils"

interface TemplatePickerModalProps {
  onSelect: (template: Template) => void
}

export function TemplatePickerModal({ onSelect }: TemplatePickerModalProps) {
  const [open, setOpen] = useState(false)
  const { templates } = useStore()

  const handleSelect = (template: Template) => {
    onSelect(template)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <FileText className="h-4 w-4" />
          テンプレート
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>テンプレートを選択</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              className={cn(
                "w-full p-4 text-left rounded-lg border border-border",
                "hover:border-primary hover:bg-primary/5 transition-colors",
              )}
            >
              <h4 className="font-semibold">{template.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {template.warmup.title} → {template.tr1.title} → {template.tr2.title} → {template.tr3.title}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {[
                  ...new Set([
                    ...template.warmup.focusTags,
                    ...template.tr1.focusTags,
                    ...template.tr2.focusTags,
                    ...template.tr3.focusTags,
                  ]),
                ]
                  .slice(0, 5)
                  .map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
