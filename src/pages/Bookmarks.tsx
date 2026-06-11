import { NewsCard } from "@/components/NewsCard"
import { useBookmarks } from "@/hooks/useBookmarks"

export function Bookmarks() {
  const { bookmarks } = useBookmarks()

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No saved articles yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bookmarks.map((article, index) => (
            <NewsCard key={article.id ?? `bookmark-${index}`} article={article} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}