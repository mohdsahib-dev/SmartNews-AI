import { NavLink, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  TrendingUp,
  Sparkles,
  Bookmark,
  Settings as SettingsIcon,
  Newspaper,
  ChevronRight,
} from "lucide-react"
import { CATEGORIES, CATEGORY_ICONS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const MAIN_NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/trending", label: "Trending", icon: TrendingUp },
  { to: "/briefing", label: "AI Briefing", icon: Sparkles },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2.5 px-2 py-1 text-left"
      >
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Newspaper className="size-5" />
        </div>
        <div className="leading-tight">
          <span className="block text-sm font-semibold">SmartNews</span>
          <span className="block text-xs text-muted-foreground">AI Intelligence</span>
        </div>
      </button>

      <nav className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto no-scrollbar">
        <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Categories
        </p>
        {CATEGORIES.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id]
          return (
            <NavLink
              key={cat.id}
              to={`/dashboard/${cat.id}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <Icon className="size-4" />
              <span className="flex-1 truncate">{cat.label}</span>
              <ChevronRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
            </NavLink>
          )
        })}
      </nav>

      <NavLink
        to="/settings"
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary/12 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )
        }
      >
        <SettingsIcon className="size-4" />
        Settings
      </NavLink>
    </div>
  )
}
