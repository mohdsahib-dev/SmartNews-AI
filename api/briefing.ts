import { VercelRequest, VercelResponse } from "@vercel/node"


// Server-side proxy for generating an AI briefing. Reads GEMINI_API_KEY from
// process.env (set this in Vercel environment variables) and returns the
// same AIBriefing shape the client expects.

async function callGeminiServer(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY || process.env.GENERATIVE_API_KEY
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"
  if (!key) throw new Error("NO_KEY")
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const res = await fetch(url + `?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
    }),
    
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Bad response: ${res.status} ${txt}`)
  }
  const json = await res.json()
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error("EMPTY_RESPONSE")
  return text.trim()
}

function parseBriefingText(text: string, topCount: number) {
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
    keyPoints: keyPoints,
    outlook: outlook,
    generatedAt: new Date().toISOString(),
    articleCount: topCount,
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const articles = Array.isArray(req.body?.articles) ? req.body.articles : []
    const top = articles.slice(0, 12)
    const list = top.map((a: any, i: number) => `${i + 1}. [${a.category}] ${a.title} (${a.source})`).join("\n")

    const prompt = `You are SmartNews AI. Create a daily news briefing from these headlines. Respond in plain text with:\nFirst, a 2-sentence executive overview.\nThen exactly 4 lines starting with "KEY: " each describing one key development (max 20 words).\nThen 1 line starting with "OUTLOOK: " summarizing what to watch next.\n\nHeadlines:\n${list}`

    try {
      const text = await callGeminiServer(prompt)
      const briefing = parseBriefingText(text, top.length)
      res.status(200).json(briefing)
    } catch (err) {
      // Fallback: return a reasonable mock briefing so the UI still works
      const fallback = {
        overview: `Today's feed spans ${top.length} stories across technology, business, science and world affairs. Momentum is strongest in technology and markets, with several developing situations worth monitoring.`,
        keyPoints: top.slice(0, 4).map((a: any) => `${a.title} — via ${a.source}.`),
        outlook: 'Watch for follow-up coverage on the leading technology and market stories over the next 24 hours.',
        generatedAt: new Date().toISOString(),
        articleCount: top.length,
      }
      res.status(200).json(fallback)
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message || String(e) })
  }
}
