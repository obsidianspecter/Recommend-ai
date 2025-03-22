export interface ContentItem {
  id: string
  title: string
  description: string
  content: string
  imageUrl?: string
  url: string
  type: "article" | "book" | "video"
  tags: string[]
  publishedAt: Date
  source: string
  relevanceScore: number
}

export interface UserProfile {
  id: string
  genres: string[]
  topics: string[]
  freeformPreferences: string
  interactionHistory: UserInteraction[]
}

export interface UserInteraction {
  contentId: string
  interactionType: "view" | "like" | "dislike" | "save" | "share"
  timestamp: Date
}

