import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Moon, Sun, Menu, Radio, X } from "lucide-react"
import { useNewsSearch } from "@/hooks/useNews"
import { useTheme } from "@/hooks/useTheme"
import { isLiveNewsEnabled } from "@/services/newsService"
import { Button } from "@/components/ui/Button"
import { Spinner } from "@/components/ui/Skeleton"
import { cn } from "@/lib/utils"

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const { data: results, isFetching } = useNewsSearch(query)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const showResults = focused && query.trim().length > 1

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border glass-strong px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenSidebar}
        aria-label="Open menu"
      >
        <Menu />
      </Button>

      <div ref={containerRef} className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search news, topics, sources..."
          className="h-10 w-full rounded-lg border border-border bg-secondary/60 pl-9 pr-9 text-sm outline-none transition-colors focus:border-ring focus:bg-card"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}

        {showResults && (
          <div className="absolute left-0 right-0 top-12 max-h-96 overflow-y-auto rounded-xl border border-border bg-popover p-2 shadow-xl">
            {isFetching && (
              <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
                <Spinner className="size-4" /> Searching...
              </div>
            )}
            {!isFetching && results && results.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground">No results found.</p>
            )}
            {!isFetching &&
              results?.slice(0, 6).map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    navigate(`/article/${encodeURIComponent(a.id)}`, { state: { article: a } })
                    setFocused(false)
                    setQuery("")
                  }}
                  className="flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary"
                >
                  <span className="line-clamp-1 text-sm font-medium">{a.title}</span>
                  <span className="text-xs text-muted-foreground">{a.source}</span>
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium sm:flex",
            isLiveNewsEnabled
              ? "border-success/30 bg-success/10 text-success"
              : "border-warning/30 bg-warning/10 text-warning",
          )}
        >
          <Radio className={cn("size-3", isLiveNewsEnabled && "animate-pulse")} />
          {isLiveNewsEnabled ? "Live" : "Demo"}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  )
}
