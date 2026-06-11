import type { Article, CategoryId } from "@/types"
import { analyzeSentiment } from "@/utils/sentiment"

interface RawMock {
  title: string
  description: string
  content: string
  source: string
  author: string
  category: CategoryId
  hoursAgo: number
}

const RAW: RawMock[] = [
  {
    title: "OpenAI unveils next-generation reasoning model with record benchmark gains",
    description:
      "The new model posts a major breakthrough across math and coding evaluations, while cutting inference costs for developers.",
    content:
      "The lab said the system was trained with a new reinforcement pipeline that improves multi-step reasoning. Early partners report strong results in agentic workflows and a notable boost in reliability for production deployments.",
    source: "The Verge",
    author: "Alex Heath",
    category: "ai",
    hoursAgo: 1,
  },
  {
    title: "Nvidia shares surge to record high as data-center demand soars",
    description:
      "Cloud providers continue to expand AI capacity, driving the strongest quarterly growth in the company's history.",
    content:
      "Analysts raised price targets following the results, citing a multi-year buildout of accelerated computing. The company also previewed a new chip architecture aimed at lowering energy costs per token.",
    source: "Reuters",
    author: "Jane Lanhee Lee",
    category: "finance",
    hoursAgo: 2,
  },
  {
    title: "Apple launches redesigned health platform with on-device AI insights",
    description:
      "A privacy-first approach keeps personal data on the phone while delivering personalized wellness recommendations.",
    content:
      "The platform integrates sleep, activity, and cardiovascular metrics into a single coaching experience. Apple emphasized that no health data leaves the device unless the user explicitly opts in.",
    source: "Bloomberg",
    author: "Mark Gurman",
    category: "technology",
    hoursAgo: 3,
  },
  {
    title: "Global markets rally as inflation cools faster than expected",
    description:
      "Investors grew optimistic after fresh data suggested central banks could ease policy sooner than forecast.",
    content:
      "Equities gained across major indices while bond yields fell. Economists cautioned that the path remains uncertain, but sentiment improved on signs of a soft landing.",
    source: "Financial Times",
    author: "Chris Giles",
    category: "business",
    hoursAgo: 4,
  },
  {
    title: "Champions League final set after dramatic late winner",
    description:
      "A stoppage-time goal sealed a stunning comeback and booked a place in the season's biggest match.",
    content:
      "The underdog side overturned a two-goal deficit in front of a record crowd. The manager praised his players' resilience and called it the best night of his career.",
    source: "ESPN",
    author: "Gabriele Marcotti",
    category: "sports",
    hoursAgo: 5,
  },
  {
    title: "Researchers report breakthrough in early cancer detection using AI",
    description:
      "A new screening model improved accuracy in trials, raising hopes for faster, less invasive diagnosis.",
    content:
      "The study, published in a peer-reviewed journal, showed the approach could flag tumors earlier than standard methods. Researchers stressed the need for larger trials before clinical rollout.",
    source: "Nature",
    author: "Heidi Ledford",
    category: "health",
    hoursAgo: 6,
  },
  {
    title: "Streaming giant announces record slate amid fierce competition",
    description:
      "The company is betting on original films and live events to grow subscribers in a crowded market.",
    content:
      "Executives outlined a strategy focused on franchises and global productions. The announcement comes as rivals cut spending and consolidate their catalogs.",
    source: "Variety",
    author: "Cynthia Littleton",
    category: "entertainment",
    hoursAgo: 7,
  },
  {
    title: "World leaders reach landmark agreement on climate finance",
    description:
      "Negotiators struck a deal to accelerate funding for clean energy in developing economies.",
    content:
      "The agreement sets new targets and establishes a monitoring framework. Advocates welcomed the progress while warning that implementation will be the real test.",
    source: "Associated Press",
    author: "Seth Borenstein",
    category: "world",
    hoursAgo: 8,
  },
  {
    title: "Startup raises major round to build AI agents for enterprise workflows",
    description:
      "The funding values the company at a significant premium as demand for automation accelerates.",
    content:
      "The team plans to expand its platform that lets businesses deploy autonomous agents across support, sales, and operations. Investors cited rapid revenue growth and strong retention.",
    source: "TechCrunch",
    author: "Ingrid Lunden",
    category: "ai",
    hoursAgo: 9,
  },
  {
    title: "New foldable phone pushes hardware limits with thinner design",
    description:
      "The device packs a larger battery and a brighter display while shedding weight over last year's model.",
    content:
      "Reviewers praised the build quality and hinge durability. The company is targeting power users with multitasking features tuned for the larger canvas.",
    source: "Engadget",
    author: "Sam Rutherford",
    category: "technology",
    hoursAgo: 11,
  },
  {
    title: "Central bank signals patience as economy shows resilience",
    description:
      "Policymakers held rates steady, pointing to a balanced outlook for growth and prices.",
    content:
      "The decision was widely expected. Officials reiterated that future moves would depend on incoming data, leaving the door open to adjustments later in the year.",
    source: "CNBC",
    author: "Jeff Cox",
    category: "finance",
    hoursAgo: 13,
  },
  {
    title: "Major retailer beats expectations with strong holiday sales",
    description:
      "Robust demand and improved margins drove profit higher despite cautious consumer spending.",
    content:
      "The company credited supply-chain improvements and a refreshed loyalty program. Management raised guidance for the coming quarter.",
    source: "Wall Street Journal",
    author: "Sarah Nassauer",
    category: "business",
    hoursAgo: 15,
  },
  {
    title: "Olympic committee confirms host city for upcoming games",
    description:
      "Organizers promised a sustainable event with reused venues and expanded public transit.",
    content:
      "The bid emphasized cost control and community benefits. Local officials celebrated the decision as a boost for tourism and infrastructure.",
    source: "BBC Sport",
    author: "Dan Roan",
    category: "sports",
    hoursAgo: 17,
  },
  {
    title: "Scientists map brain activity with unprecedented detail",
    description:
      "The research could unlock new treatments for neurological conditions, experts say.",
    content:
      "Using advanced imaging, the team charted connections at a scale not seen before. The dataset will be shared openly to accelerate further study.",
    source: "Scientific American",
    author: "Tanya Lewis",
    category: "health",
    hoursAgo: 19,
  },
  {
    title: "Acclaimed director announces ambitious new sci-fi project",
    description:
      "The film promises practical effects and a large ensemble cast for a planned trilogy.",
    content:
      "Production is set to begin next year across multiple countries. Fans reacted enthusiastically to the first concept art revealed online.",
    source: "The Hollywood Reporter",
    author: "Borys Kit",
    category: "entertainment",
    hoursAgo: 21,
  },
  {
    title: "Diplomatic talks ease tensions in key trade dispute",
    description:
      "Both sides agreed to a framework that could lower tariffs and restore supply chains.",
    content:
      "Negotiators described the talks as constructive. Businesses welcomed the news, hoping for greater certainty in the months ahead.",
    source: "Al Jazeera",
    author: "Staff",
    category: "world",
    hoursAgo: 23,
  },
  {
    title: "Open-source AI model rivals proprietary systems on key tasks",
    description:
      "The community-driven release narrows the gap with commercial offerings while remaining free to use.",
    content:
      "Developers highlighted strong performance and permissive licensing. The release could accelerate adoption among startups and researchers.",
    source: "Ars Technica",
    author: "Benj Edwards",
    category: "ai",
    hoursAgo: 26,
  },
  {
    title: "Cloud platform expands global regions to reduce latency",
    description:
      "New data centers aim to serve growing demand for low-latency AI and streaming workloads.",
    content:
      "The expansion includes investments in renewable energy. The provider said the rollout would improve reliability for customers worldwide.",
    source: "ZDNet",
    author: "Larry Dignan",
    category: "technology",
    hoursAgo: 30,
  },
]

let cached: Article[] | null = null

export function getMockArticles(): Article[] {
  if (cached) return cached
  cached = RAW.map((r, i) => {
    const publishedAt = new Date(Date.now() - r.hoursAgo * 3600_000).toISOString()
    return {
      id: `mock-${i}`,
      title: r.title,
      description: r.description,
      content: r.content,
      url: "#",
      image: `/news/${r.category}.png`,
      source: r.source,
      author: r.author,
      publishedAt,
      category: r.category,
      sentiment: analyzeSentiment(`${r.title} ${r.description}`),
    } satisfies Article
  })
  return cached
}
