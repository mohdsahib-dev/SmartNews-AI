import { useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useNews } from "@/hooks/useNews"
import { detectTrending } from "@/utils/analytics"
import { CATEGORY_ICONS, CATEGORY_LABEL } from "@/lib/constants"
import { SentimentBadge } from "@/components/SentimentBadge"
import { Card, CardContent } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"

export function Trending() {
  const { data: articles = [], isLoading } = useNews("general")
  const trending = useMemo(() => detectTrending(articles, 18), [articles])

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <TrendingUp className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Trending Topics</h1>
          <p className="text-muted-foreground">Keywords gaining momentum across the news right now.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          : trending.map((t, i) => {
              const Icon = CATEGORY_ICONS[t.category]
              const up = t.change >= 0
              return (
                <motion.div
                  key={t.keyword}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                >
                  <Link to={`/dashboard/${t.category}`}>
                    <Card className="h-full transition-all hover:border-primary/40 hover:shadow-lg">
                      <CardContent className="flex h-full flex-col gap-3 p-5">
                        <div className="flex items-start justify-between">
                          <span className="text-2xl font-bold tabular-nums text-muted-foreground/50">
                            #{i + 1}
                          </span>
                          <span
                            className={cn(
                              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                              up ? "bg-success/12 text-success" : "bg-destructive/12 text-destructive",
                            )}
                          >
                            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                            {Math.abs(t.change)}%
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold leading-tight">{t.keyword}</h3>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Icon className="size-3.5" />
                            {CATEGORY_LABEL[t.category]}
                          </span>
                          <SentimentBadge sentiment={t.sentiment} />
                        </div>
                        <p className="text-xs text-muted-foreground">{t.count} mentions</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
      </div>

      {!isLoading && trending.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
          <TrendingDown className="size-8" />
          <p>No trending topics detected yet. Check back after the next refresh.</p>
        </div>
      )}
    </div>
  )
}
