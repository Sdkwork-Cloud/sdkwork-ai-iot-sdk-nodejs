export interface GenerationItem {
  id: string
  type: 'image' | 'video' | 'music' | 'voice'|any
  title: string
  description?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  result?: {
    url: string
    thumbnail?: string
    [key: string]: any
  }
  [key: string]: any
}

export interface GenerationStoreState {
  // Generation management
  generations: GenerationItem[]
  selectedGenerationId: string | null
  
  // Generation tasks
  currentTask: {
    type: 'image' | 'video' | 'music' | 'voice' | null
    status: 'idle' | 'generating' | 'completed' | 'failed'
    progress: number
    result: any
  }
  
  // UI/Filter states
  ui: {
    searchQuery: string
    isLoading: boolean
    filterType: 'all' | 'image' | 'video' | 'music' | 'voice'
  }
}