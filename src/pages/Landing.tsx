import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Newspaper,
  Sparkles,
  TrendingUp,
  Gauge,
  ArrowRight,
  Zap,
  Brain,
  BarChart3,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTheme } from "@/hooks/useTheme"
import { Moon, Sun } from "lucide-react"

const FEATURES = [
  {
    icon: Brain,
    title: "AI Summaries",
    desc: "Gemini-powered summaries distill every article into crisp, scannable key points.",
  },
  {
    icon: TrendingUp,
    title: "Trending Detection",
    desc: "Real-time keyword analysis surfaces the topics gaining momentum across sources.",
  },
  {
    icon: Gauge,
    title: "Sentiment Analysis",
    desc: "Instantly gauge the tone of the news with positive, neutral, and negative scoring.",
  },
  {
    icon: BarChart3,
    title: "Live Analytics",
    desc: "Interactive charts track article volume, category mix, and coverage over time.",
  },
]

const STATS = [
  { value: "9", label: "Categories" },
  { value: "10 min", label: "Auto-refresh" },
  { value: "AI", label: "Briefings" },
  { value: "Live", label: "Sentiment" },
]

export function Landing() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border glass-strong">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Newspaper className="size-5" />
            </div>
            <span className="text-lg font-semibold">SmartNews AI</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            <Link to="/dashboard">
              <Button>
                Open App
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
        <div
          className="absolute left-1/2 top-0 -z-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center md:px-6 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-sm text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            AI-powered news intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl"
          >
            Read less. <span className="text-gradient">Understand more.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            SmartNews AI aggregates global headlines, generates instant AI summaries, detects
            trending topics, and analyzes sentiment — all in one elegant dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/dashboard">
              <Button size="lg">
                <Zap />
                Launch Dashboard
              </Button>
            </Link>
            <Link to="/briefing">
              <Button size="lg" variant="outline">
                <Sparkles />
                Try AI Briefing
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-border shadow-2xl"
          >
            <img
              src="/hero-dashboard.png"
              alt="SmartNews AI dashboard preview showing analytics charts and a news feed"
              className="w-full"
            />
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 md:grid-cols-4 md:px-6">
          {STATS.map((s) => (
            <div key={s.label} className="px-4 py-8 text-center">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to stay informed
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Powerful features that turn the firehose of daily news into clear, actionable
            intelligence.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center md:p-16">
          <div
            className="absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Ready to upgrade how you read the news?
            </h2>
                  <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
                    Get started to explore summarized headlines and insights — no sign-up required.
                  </p>
            <Link to="/dashboard" className="mt-8 inline-block">
              <Button size="lg">
                Get Started
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Newspaper className="size-4" />
            <span>SmartNews AI &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by NewsAPI + Gemini</span>
            <Globe className="size-4" />
          </div>
        </div>
      </footer>
    </div>
  )
}
