import axios from "axios"
import type { Article, CategoryId } from "@/types"
import { analyzeSentiment } from "@/utils/sentiment"
import { getMockArticles } from "./mockData"

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY
const NEWS_API_BASE = "https://newsapi.org/v2"

export const isLiveNewsEnabled = Boolean(NEWS_API_KEY)

// NewsAPI exposes a fixed set of "categories". We map our richer set onto
// either a native category or a search query.
const CATEGORY_QUERY: Record<CategoryId, { category?: string; q?: string }> = {
  general: { category: "general" },
  technology: { category: "technology" },
  ai: { q: '"artificial intelligence" OR "machine learning" OR OpenAI OR LLM' },
  business: { category: "business" },
  finance: { q: "stocks OR markets OR finance OR economy OR crypto" },
  sports: { category: "sports" },
  health: { category: "health" },
  entertainment: { category: "entertainment" },
  world: { q: "world OR global OR international OR politics" },
}

interface NewsApiArticle {
  title: string | null
  description: string | null
  content: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  author: string | null
  source: { name: string | null }
}

function mapArticle(raw: NewsApiArticle, category: CategoryId, index: number): Article | null {
  if (!raw.title || raw.title === "[Removed]") return null
  const description = raw.description ?? ""
  return {
    id: `${category}-${index}-${raw.url}`,
    title: raw.title,
    description,
    content: raw.content ?? description,
    url: raw.url,
    image: raw.urlToImage,
    source: raw.source?.name ?? "Unknown",
    author: raw.author,
    publishedAt: raw.publishedAt,
    category,
    sentiment: analyzeSentiment(`${raw.title} ${description}`),
  }
}

export async function fetchNewsByCategory(category: CategoryId): Promise<Article[]> {
  if (!NEWS_API_KEY) {
    return getMockArticles().filter((a) =>
      category === "general" ? true : a.category === category,
    )
  }

  const mapping = CATEGORY_QUERY[category]
  try {
    const endpoint = mapping.q ? "/everything" : "/top-headlines"
    const params: Record<string, string | number> = {
      apiKey: NEWS_API_KEY,
      pageSize: 30,
      language: "en",
    }
    if (mapping.q) {
      params.q = mapping.q
      params.sortBy = "publishedAt"
    } else {
      params.category = mapping.category as string
      params.country = "us"
    }

    const { data } = await axios.get<{ articles: NewsApiArticle[] }>(
      `${NEWS_API_BASE}${endpoint}`,
      { params },
    )
    const mapped = (data.articles ?? [])
      .map((a, i) => mapArticle(a, category, i))
      .filter((a): a is Article => a !== null)

    return mapped.length > 0 ? mapped : getMockArticles()
  } catch (err) {
    console.error("[v0] NewsAPI request failed, falling back to mock data:", err)
    return getMockArticles().filter((a) =>
      category === "general" ? true : a.category === category,
    )
  }
}

export async function searchNews(query: string): Promise<Article[]> {
  if (!query.trim()) return []
  if (!NEWS_API_KEY) {
    const q = query.toLowerCase()
    return getMockArticles().filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q),
    )
  }
  try {
    const { data } = await axios.get<{ articles: NewsApiArticle[] }>(
      `${NEWS_API_BASE}/everything`,
      {
        params: {
          apiKey: NEWS_API_KEY,
          q: query,
          pageSize: 30,
          language: "en",
          sortBy: "relevancy",
        },
      },
    )
    return (data.articles ?? [])
      .map((a, i) => mapArticle(a, "general", i))
      .filter((a): a is Article => a !== null)
  } catch (err) {
    console.error("[v0] NewsAPI search failed, falling back to mock data:", err)
    const q = query.toLowerCase()
    return getMockArticles().filter(
      (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
    )
  }
}
