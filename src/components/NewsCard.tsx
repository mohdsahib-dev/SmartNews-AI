import { Link } from "react-router-dom"
import { Bookmark, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { SentimentBadge } from "@/components/SentimentBadge"
import { CATEGORY_LABEL } from "@/lib/constants"
import { useBookmarks } from "@/hooks/useBookmarks"
import { formatRelativeTime, cn } from "@/lib/utils"
import type { Article } from "@/types"

export function NewsCard({ article, index = 0 }: { article: Article; index?: number }) {
  const { isBookmarked, toggle } = useBookmarks()
  const bookmarked = isBookmarked(article.id)
  const to = `/article/${encodeURIComponent(article.id)}`
  const publishedAtText = article.publishedAt
    ? formatRelativeTime(article.publishedAt)
    : "Unknown date"

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg"
    >
      <Link to={to} state={{ article }} className="relative block aspect-[16/9] overflow-hidden bg-secondary">
  {article.image ? (
    <img
      src={article.image || "/placeholder.svg"}
      alt={article.title}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={(e) => {
        ;(e.currentTarget as HTMLImageElement).src = `/news/${article.category}.png`
      }}
    />
  ) : (
    <img src={`/news/${article.category}.png`} alt={article.title} className="w-full h-full object-cover" />
  )}

  <div className="absolute left-3 top-3 flex items-center gap-2">
    <span className="rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
      {CATEGORY_LABEL[article.category]}
    </span>
  </div>

  <div className="absolute right-3 top-3 z-30">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        console.log("bookmark clicked", article.id)
        toggle(article)
      }}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      className={cn(
        "rounded-md p-1.5 transition-colors hover:bg-secondary pointer-events-auto",
        bookmarked ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
    </button>
  </div>
</Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <SentimentBadge sentiment={article.sentiment} />
       <button
  type="button"
  onClick={(e) => {
    e.stopPropagation()
    e.preventDefault()
    console.log("bookmark clicked", article.id)
    toggle(article)
  }}
  aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
  className={cn(
    "relative z-20 pointer-events-auto rounded-md p-1.5 transition-colors hover:bg-secondary",
    bookmarked ? "text-primary" : "text-muted-foreground",
  )}
>
  <Bookmark className={cn("size-4", bookmarked && "fill-current")} />
</button>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="truncate font-medium">{article.source}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {publishedAtText}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export function NewsCardSkeleton() {
  return (
    <article className="animate-pulse group flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="aspect-[16/9] bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted mt-2" />
      </div>
    </article>
  )
}