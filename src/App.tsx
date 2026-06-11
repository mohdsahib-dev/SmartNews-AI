import { Routes, Route } from "react-router-dom"
import { Landing } from "@/pages/Landing"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Trending } from "@/pages/Trending"
import { Briefing } from "@/pages/Briefing"
import { ArticleDetails } from "@/pages/ArticleDetails"
import { Bookmarks } from "@/pages/Bookmarks"
import { Settings } from "@/pages/Settings"
import { NotFound } from "@/pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:category" element={<Dashboard />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/briefing" element={<Briefing />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/article/:id" element={<ArticleDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
