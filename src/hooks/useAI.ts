import { useMutation, useQuery } from "@tanstack/react-query"
import { summarizeArticle, generateBriefing } from "@/services/aiService"
import type { Article } from "@/types"

export function useSummary(article: Article | undefined) {
  return useQuery({
    queryKey: ["summary", article?.id],
    queryFn: () => summarizeArticle(article as Article),
    enabled: Boolean(article),
    staleTime: Infinity,
  })
}

export function useBriefing() {
  return useMutation({
    mutationFn: (articles: Article[]) => generateBriefing(articles),
  })
}
