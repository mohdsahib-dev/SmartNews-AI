import { useQuery } from "@tanstack/react-query"
import { fetchNewsByCategory, searchNews } from "@/services/newsService"
import { REFRESH_INTERVAL } from "@/lib/constants"
import type { CategoryId } from "@/types"

export function useNews(category: CategoryId) {
  return useQuery({
    queryKey: ["news", category],
    queryFn: () => fetchNewsByCategory(category),
    staleTime: REFRESH_INTERVAL,
    refetchInterval: REFRESH_INTERVAL,
  })
}

export function useNewsSearch(query: string) {
  return useQuery({
    queryKey: ["news-search", query],
    queryFn: () => searchNews(query),
    enabled: query.trim().length > 1,
    staleTime: 60_000,
  })
}
