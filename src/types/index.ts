export type CategoryId =
  | "general"
  | "technology"
  | "ai"
  | "business"
  | "finance"
  | "sports"
  | "health"
  | "entertainment"
  | "world"

export type Sentiment = "positive" | "neutral" | "negative"

export interface Article {
  id: string
  title: string
  description: string
  content: string
  url: string
  image: string | null
  source: string
  author: string | null
  publishedAt: string
  category: CategoryId
  summary?: string
  sentiment: Sentiment
}

export interface TrendingTopic {
  keyword: string
  count: number
  category: CategoryId
  sentiment: Sentiment
  change: number
}

export interface CategoryMeta {
  id: CategoryId
  label: string
  description: string
}

export interface DashboardStats {
  totalArticles: number
  trendingCount: number
  sourcesCount: number
  positiveRatio: number
}

export interface ActivityPoint {
  label: string
  articles: number
  ai: number
}

export interface CategoryDistribution {
  category: CategoryId
  label: string
  value: number
}

export interface AIBriefing {
  overview: string
  keyPoints: string[]
  outlook: string
  generatedAt: string
  articleCount: number
}
