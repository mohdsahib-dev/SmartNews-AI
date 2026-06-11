// src/components/SentimentBadge.tsx
import { Badge } from "@/components/ui/Badge"
import { SENTIMENT_META } from "@/utils/sentiment"
import { cn } from "@/lib/utils"
import type { Sentiment } from "@/types"

export function SentimentBadge({
  sentiment,
  className,
}: {
  sentiment?: Sentiment
  className?: string
}) {
  const meta = sentiment ? SENTIMENT_META[sentiment] : SENTIMENT_META["neutral"]
  return (
    <Badge className={cn(meta?.className ?? "", className)}>
      <span className={cn("size-1.5 rounded-full", meta?.dot ?? "")} aria-hidden />
      {meta?.label ?? "Neutral"}
    </Badge>
  )
}