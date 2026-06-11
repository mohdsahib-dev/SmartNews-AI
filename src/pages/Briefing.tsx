import { useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, RefreshCw, ListChecks, Telescope, FileText, Clock } from "lucide-react"
import { useNews } from "@/hooks/useNews"
import { useBriefing } from "@/hooks/useAI"
import { isAIConfigured } from "@/services/aiService"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Skeleton"
import { formatRelativeTime } from "@/lib/utils"

export function Briefing() {
  const { data: articles = [], isLoading } = useNews("general")
  const { mutate, data: briefing, isPending } = useBriefing()

  useEffect(() => {
    if (articles.length && !briefing) {
      mutate(articles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles])

  const loading = isLoading || isPending

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
            <Sparkles className="size-3.5" />
            AI Briefing
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Your Daily Briefing</h1>
          <p className="mt-1 text-muted-foreground">
            An AI-generated digest of today&apos;s most important stories.
          </p>
        </div>
        <Button onClick={() => mutate(articles)} disabled={loading || !articles.length}>
          <RefreshCw className={loading ? "animate-spin" : ""} />
          Regenerate
        </Button>
      </div>

      {!isAIConfigured() && (
        <p className="mt-4 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
          Running in demo mode. Add a Gemini API key in Settings for fully AI-generated briefings.
        </p>
      )}

      {loading ? (
        <div className="mt-8 flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <Spinner className="size-7 text-primary" />
          <p className="text-sm">Analyzing {articles.length || ""} stories...</p>
        </div>
      ) : briefing ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 space-y-6"
        >
          <Card className="border-primary/30 bg-gradient-to-br from-primary/8 to-transparent">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
                <FileText className="size-4" />
                Executive Overview
              </h2>
              <p className="mt-3 text-pretty text-lg leading-relaxed">{briefing.overview}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  Generated {formatRelativeTime(briefing.generatedAt)}
                </span>
                <span>{briefing.articleCount} stories analyzed</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <ListChecks className="size-4" />
                Key Developments
              </h2>
              <ul className="mt-4 space-y-3">
                {briefing.keyPoints.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                      {i + 1}
                    </span>
                    <p className="leading-relaxed text-foreground/90">{point}</p>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-chart-3/30 bg-chart-3/5">
            <CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Telescope className="size-4" />
                What to Watch
              </h2>
              <p className="mt-3 text-pretty leading-relaxed text-foreground/90">
                {briefing.outlook}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </div>
  )
}
