export interface SearchItem {
  type: "video" | "channel" | "playlist"
  id: string
  title: string
  thumbnail: string
  author: string
  views?: string
  published?: string
  videoCount?: string // For playlists
}

export interface SearchContext {
  items: SearchItem[]
  suggestion: string | null // "Did you mean: ..."
  isCorrected: boolean // True if YouTube auto-corrected your typo
  continuation: string | null // Token for next page
}