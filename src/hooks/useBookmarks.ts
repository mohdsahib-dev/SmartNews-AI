import { useEffect, useState } from "react"
import type { Article } from "@/types"

const STORAGE_KEY = "smartnews-bookmarks"

function readBookmarks(): Article[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]")
  } catch {
    return []
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>(readBookmarks)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  const toggle = (article: Article) => {
    setBookmarks((prev) =>
      prev.some((item) => item.id === article.id)
        ? prev.filter((item) => item.id !== article.id)
        : [...prev, article]
    )
  }

  const isBookmarked = (id: string) => bookmarks.some((item) => item.id === id)

  return { bookmarks, toggle, isBookmarked }
}