import type { Sentiment } from "@/types"

const POSITIVE = [
  "win","wins","surge","soar","record","breakthrough","success","growth","boost","gain","gains",
  "rise","rises","best","strong","profit","launch","innovate","innovation","celebrate","award",
  "improve","improved","rally","optimistic","milestone","achieve","positive","beat","beats","up",
]

const NEGATIVE = [
  "crash","crisis","loss","losses","drop","drops","fall","falls","decline","fear","fears","cut","cuts",
  "layoff","layoffs","risk","threat","scandal","fraud","ban","banned","war","attack","dead","death",
  "collapse","plunge","slump","warn","warning","recession","lawsuit","weak","down","fail","failed",
]

export function analyzeSentiment(text: string): Sentiment {
  const words = text.toLowerCase().match(/[a-z]+/g) ?? []
  let score = 0
  for (const w of words) {
    if (POSITIVE.includes(w)) score++
    if (NEGATIVE.includes(w)) score--
  }
  if (score > 0) return "positive"
  if (score < 0) return "negative"
  return "neutral"
}

export const SENTIMENT_META: Record<
  Sentiment,
  { label: string; className: string; dot: string }
> = {
  positive: {
    label: "Positive",
    className: "bg-success/12 text-success border-success/25",
    dot: "bg-success",
  },
  neutral: {
    label: "Neutral",
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  negative: {
    label: "Negative",
    className: "bg-destructive/12 text-destructive border-destructive/25",
    dot: "bg-destructive",
  },
}
