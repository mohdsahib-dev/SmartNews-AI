import axios from "axios"
import type { Article, AIBriefing } from "@/types"
import { GEMINI_API_KEY, GEMINI_MODEL } from "@/lib/constants"

const GEMINI_URL = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
}

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("NO_KEY")
  const { data } = await axios.post<GeminiResponse>(
    GEMINI_URL(GEMINI_MODEL),
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
    },
    {
      params: { key: GEMINI_API_KEY },
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    },
  )
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("EMPTY_RESPONSE")
  return text.trim()
}

/** Summarize a single article into a few crisp bullet points. */
export async function summarizeArticle(article: Article): Promise<string> {
  const prompt = `You are SmartNews AI, a concise news analyst. Summarize the following article in 3 short bullet points (max 18 words each). Be neutral and factual. Do not use markdown headers.

Title: ${article.title}
Source: ${article.source}
Content: ${article.description} ${article.content ?? ""}`

  try {
    return await callGemini(prompt)
  } catch (err) {
    // Graceful fallback so the UI always has something useful.
    return [
      `• ${article.title}`,
      `• Reported by ${article.source} in the ${article.category} category.`,
      `• ${article.description}`,
    ].join("\n")
  }
}

/** Build a personalized "daily briefing" across multiple articles. */
export async function generateBriefing(articles: Article[]): Promise<AIBriefing> {
  const top = articles.slice(0, 12)
  const list = top
    .map((a, i) => `${i + 1}. [${a.category}] ${a.title} (${a.source})`)
    .join("\n")

  const prompt = `You are SmartNews AI. Create a daily news briefing from these headlines. Respond in plain text with:
First, a 2-sentence executive overview.
Then exactly 4 lines starting with "KEY: " each describing one key development (max 20 words).
Then 1 line starting with "OUTLOOK: " summarizing what to watch next.

Headlines:
${list}`

  // When running in the browser, call the serverless proxy at /api/briefing so
  // API keys remain on the server. If running on a server environment that has
  // GEMINI_API_KEY available, fall back to calling Gemini directly.
  if (typeof window !== "undefined") {
    try {
      const resp = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: top }),
      })
      if (!resp.ok) throw new Error("bad_response")
      const data = await resp.json()
      return data as AIBriefing
    } catch {
      return {
        overview: `Today's feed spans ${top.length} stories across technology, business, science and world affairs. Momentum is strongest in technology and markets, with several developing situations worth monitoring.`,
        keyPoints: top.slice(0, 4).map((a) => `${a.title} — via ${a.source}.`),
        outlook: "Watch for follow-up coverage on the leading technology and market stories over the next 24 hours.",
        generatedAt: new Date().toISOString(),
        articleCount: top.length,
      }
    }
  }

  try {
    const text = await callGemini(prompt)
    return parseBriefing(text, top)
  } catch {
    return {
      overview: `Today's feed spans ${top.length} stories across technology, business, science and world affairs. Momentum is strongest in technology and markets, with several developing situations worth monitoring.`,
      keyPoints: top.slice(0, 4).map((a) => `${a.title} — via ${a.source}.`),
      outlook: "Watch for follow-up coverage on the leading technology and market stories over the next 24 hours.",
      generatedAt: new Date().toISOString(),
      articleCount: top.length,
    }
  }
}

function parseBriefing(text: string, articles: Article[]): AIBriefing {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
  const keyPoints = lines
    .filter((l) => l.toUpperCase().startsWith("KEY:"))
    .map((l) => l.replace(/^KEY:\s*/i, ""))
  const outlook = lines.find((l) => l.toUpperCase().startsWith("OUTLOOK:"))?.replace(/^OUTLOOK:\s*/i, "") ?? ""
  const overview = lines
    .filter((l) => !l.toUpperCase().startsWith("KEY:") && !l.toUpperCase().startsWith("OUTLOOK:"))
    .join(" ")

  return {
    overview: overview || "Here is your AI-generated briefing of today's most important stories.",
    keyPoints: keyPoints.length ? keyPoints : articles.slice(0, 4).map((a) => a.title),
    outlook: outlook || "Continue monitoring the top stories for developments.",
    generatedAt: new Date().toISOString(),
    articleCount: articles.length,
  }
}

export function isAIConfigured(): boolean {
  return Boolean(GEMINI_API_KEY)
}
