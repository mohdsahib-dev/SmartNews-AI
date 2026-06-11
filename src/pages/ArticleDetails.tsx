import { useMemo } from "react"
import { useParams, useLocation, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  User,
  Sparkles,
  Bookmark,
  RefreshCw,
} from "lucide-react"
import { useNews } from "@/hooks/useNews"
import { useSummary } from "@/hooks/useAI"
import { useBookmarks } from "@/hooks/useBookmarks"
import { isAIConfigured } from "@/services/aiService"
import { SentimentBadge } from "@/components/SentimentBadge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Spinner } from "@/components/ui/Skeleton"
import { CATEGORY_LABEL } from "@/lib/constants"
import { formatDate, formatRelativeTime, cn } from "@/lib/utils"
import type { Article, CategoryId } from "@/types"

export function ArticleDetails() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const stateArticle = (location.state as { article?: Article } | null)?.article

  // Fall back to fetching the general feed if we arrived without router state.
  const { data: generalArticles = [] } = useNews("general")
  const article = useMemo(() => {
    if (stateArticle) return stateArticle
    const decoded = id ? decodeURIComponent(id) : ""
    return generalArticles.find((a) => a.id === decoded)
  }, [stateArticle, id, generalArticles])

  const { data: summary, isFetching: summarizing, refetch } = useSummary(article)
  const { isBookmarked, toggle } = useBookmarks()

  if (!article) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">Article not found or no longer available.</p>
        <Button onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
      </div>
    )
  }

  const bookmarked = isBookmarked(article.id)

  return (
    <div className="mx-auto max-w-3xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft />
        Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/12 px-2.5 py-0.5 text-xs font-medium text-primary">
            {CATEGORY_LABEL[article.category as CategoryId]}
          </span>
          <SentimentBadge sentiment={article.sentiment} />
        </div>

        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{article.source}</span>
          {article.author && (
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" />
              {article.author}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatRelativeTime(article.publishedAt)}
          </span>
        </div>

        {article.image && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <img
              src={article.image || "/placeholder.svg"}
              alt={article.title}
              className="w-full"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = `/news/${article.category}.png`
              }}
            />
          </div>
        )}

        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <Sparkles className="size-4 text-primary" />
                AI Summary
              </h2>
              <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={summarizing}>
                <RefreshCw className={cn("size-3.5", summarizing && "animate-spin")} />
                Regenerate
              </Button>
            </div>
            {summarizing ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-4" /> Generating summary...
              </div>
            ) : (
              <div className="space-y-1.5 text-sm leading-relaxed text-foreground/90">
                {(summary ?? "").split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
            {!isAIConfigured() && (
              <p className="mt-3 text-xs text-muted-foreground">
                Tip: add a Gemini API key in{" "}
                <Link to="/settings" className="text-primary underline">
                  Settings
                </Link>{" "}
                for live AI summaries.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-pretty leading-relaxed text-foreground/90">
          <p>{article.description}</p>
          {article.content && article.content !== article.description && (
            <p className="mt-4">{article.content}</p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant={bookmarked ? "default" : "outline"}
            onClick={() => toggle(article)}
          >
            <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          {article.url && article.url !== "#" && (
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary">
                Read full article
                <ExternalLink />
              </Button>
            </a>
          )}
        </div>
      </motion.div>
    </div>
  )
}
