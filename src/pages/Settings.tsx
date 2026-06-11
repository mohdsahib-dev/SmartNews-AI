import { useEffect, useState } from "react"
import { useTheme } from "@/hooks/useTheme"

const STORAGE = {
  REFRESH: "APP_REFRESH_MINUTES",
  BOOKMARKS: "smartnews-bookmarks",
  THEME: "smartnews-theme",
}

export function Settings() {
  const { theme, toggleTheme } = useTheme()
  const [refreshMinutes, setRefreshMinutes] = useState<number>(5)
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const r = localStorage.getItem(STORAGE.REFRESH)
    setRefreshMinutes(r ? Number(r) : 5)
  }, [])

  const save = () => {
    if (refreshMinutes && refreshMinutes > 0) localStorage.setItem(STORAGE.REFRESH, String(refreshMinutes))
    else localStorage.removeItem(STORAGE.REFRESH)

    // notify other parts of the app
    window.dispatchEvent(new CustomEvent("app:settings:changed"))
    setStatus("Settings saved")
    setTimeout(() => setStatus(null), 2000)
  }

  const resetDefaults = () => {
    localStorage.removeItem(STORAGE.REFRESH)
    localStorage.removeItem(STORAGE.THEME)
    setRefreshMinutes(5)
    window.dispatchEvent(new CustomEvent("app:settings:changed"))
    setStatus("Reset to defaults")
    setTimeout(() => setStatus(null), 2000)
  }

  const clearBookmarks = () => {
    localStorage.removeItem(STORAGE.BOOKMARKS)
    setStatus("Bookmarks cleared")
    setTimeout(() => setStatus(null), 2000)
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      <section className="mb-6 rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-2">Behavior</h2>
        <label className="block mb-3">
          <div className="text-sm text-muted-foreground">News refresh interval (minutes)</div>
          <input
            type="number"
            min={1}
            value={refreshMinutes}
            onChange={(e) => setRefreshMinutes(Number(e.target.value))}
            className="mt-1 w-32 rounded border px-3 py-2 bg-background"
          />
        </label>

        <div className="mt-4">
          <div className="text-sm text-muted-foreground">Theme</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="text-sm">{theme === "dark" ? "Dark" : "Light"}</div>
            <button type="button" onClick={() => toggleTheme()} className="rounded border px-3 py-1 text-sm">
              Toggle theme
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={save} className="rounded bg-primary px-3 py-2 text-white">Save settings</button>
          <button onClick={resetDefaults} className="rounded border px-3 py-2">Reset defaults</button>
        </div>

        {status && <div className="mt-3 text-sm text-muted-foreground">{status}</div>}
      </section>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-2">Data</h2>
        <div className="flex gap-2">
          <button onClick={clearBookmarks} className="rounded border px-3 py-2">Clear bookmarks</button>
        </div>
      </section>
    </div>
  )
}