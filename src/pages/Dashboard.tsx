import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Newspaper, TrendingUp, Database, Smile, RefreshCw, ArrowRight } from "lucide-react"
import { useNews } from "@/hooks/useNews"
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/constants"
import {
  buildActivitySeries,
  buildCategoryDistribution,
  detectTrending,
} from "@/utils/analytics"
import { formatNumber } from "@/lib/utils"
import { StatCard } from "@/components/StatCard"
import { ActivityChart, CategoryChart } from "@/components/Charts"
import { NewsCard, NewsCardSkeleton } from "@/components/NewsCard"
import { SentimentBadge } from "@/components/SentimentBadge"
import { Button } from "@/components/ui/Button"
import type { CategoryId } from "@/types"

export function Dashboard() {
  const { category } = useParams<{ category?: string }>()
  const activeCategory = (category as CategoryId) ?? "general"
  const meta = CATEGORIES.find((c) => c.id === activeCategory) ?? CATEGORIES[0]
  const { data: articles = [], isLoading, isFetching, refetch } = useNews(activeCategory)

  const stats = useMemo(() => {
    const sources = new Set(articles.map((a) => a.source)).size
    const positive = articles.filter((a) => a.sentiment === "positive").length
    const trending = detectTrending(articles)
    return {
      total: articles.length,
      sources,
      trendingCount: trending.length,
      positiveRatio: articles.length ? Math.round((positive / articles.length) * 100) : 0,
      trending,
      activity: buildActivitySeries(articles),
      distribution: buildCategoryDistribution(articles),
    }
  }, [articles])

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{meta.label}</h1>
          <p className="mt-1 text-muted-foreground">{meta.description}</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={isFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Newspaper} label="Articles" value={formatNumber(stats.total)} change={8} index={0} />
        <StatCard icon={TrendingUp} label="Trending Topics" value={stats.trendingCount} change={12} index={1} />
        <StatCard icon={Database} label="Sources" value={stats.sources} change={4} index={2} />
        <StatCard icon={Smile} label="Positive Tone" value={`${stats.positiveRatio}%`} change={stats.positiveRatio - 50} index={3} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart data={stats.activity} />
        </div>
        <CategoryChart data={stats.distribution} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Latest Headlines</h2>
            <span className="text-sm text-muted-foreground">{stats.total} stories</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
              : articles.map((a, i) => <NewsCard key={a.id} article={a} index={i} />)}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <TrendingUp className="size-4 text-primary" />
                Trending Now
              </h2>
              <Link to="/trending">
                <Button variant="ghost" size="sm">
                  All <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                      <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                    </div>
                  ))
                : stats.trending.map((t, i) => {
                    const Icon = CATEGORY_ICONS[t.category]
                    return (
                      <motion.div
                        key={t.keyword}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 border-b border-border px-5 py-3 last:border-0"
                      >
                        <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Icon className="size-4 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{t.keyword}</p>
                          <p className="text-xs text-muted-foreground">{t.count} mentions</p>
                        </div>
                        <SentimentBadge sentiment={t.sentiment} />
                      </motion.div>
                    )
                  })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
