import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-primary/10 to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">⚽ Soccer Note</h1>
          <p className="text-muted-foreground">練習メニュー管理アプリ</p>
        </div>

        <div className="grid gap-4">
          <Link href="/coach/dashboard">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <ClipboardList className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">コーチ</h2>
                  <p className="text-sm text-muted-foreground">練習メニューを作成・管理</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/player/today">
            <Card className="hover:border-primary transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-14 h-14 rounded-2xl bg-accent/30 flex items-center justify-center">
                  <Users className="h-7 w-7 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">選手</h2>
                  <p className="text-sm text-muted-foreground">今日の練習メニューを確認</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
