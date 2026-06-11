import type { CategoryMeta } from "@/types"
import {
  Newspaper,
  Cpu,
  Sparkles,
  Briefcase,
  LineChart,
  Trophy,
  HeartPulse,
  Clapperboard,
  Globe,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { CategoryId } from "@/types"

export const CATEGORIES: CategoryMeta[] = [
  { id: "general", label: "Top Stories", description: "The most important headlines right now" },
  { id: "technology", label: "Technology", description: "Software, hardware, and the future of tech" },
  { id: "ai", label: "Artificial Intelligence", description: "Models, research, and AI products" },
  { id: "business", label: "Business", description: "Companies, markets, and the economy" },
  { id: "finance", label: "Finance", description: "Stocks, crypto, and personal finance" },
  { id: "sports", label: "Sports", description: "Scores, transfers, and analysis" },
  { id: "health", label: "Health", description: "Medicine, wellness, and research" },
  { id: "entertainment", label: "Entertainment", description: "Film, music, and culture" },
  { id: "world", label: "World News", description: "Global affairs and politics" },
]

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  general: Newspaper,
  technology: Cpu,
  ai: Sparkles,
  business: Briefcase,
  finance: LineChart,
  sports: Trophy,
  health: HeartPulse,
  entertainment: Clapperboard,
  world: Globe,
}

export const CATEGORY_LABEL: Record<CategoryId, string> = CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c.label
    return acc
  },
  {} as Record<CategoryId, string>,
)

export const REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutes

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? ""
export const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL ?? "gemini-2.0-flash"
