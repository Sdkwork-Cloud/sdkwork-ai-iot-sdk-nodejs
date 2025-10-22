export interface Tool {
    id: number
    name: string
    provider: string
    description: string
    categories: string[]
    subcategories?: string[]
    stats: {
      users: string
      rating: number
      response: string
    }
    icon: string
    tags: string[]
    version: string
    license: string
    capabilities: string[]
    reviews: number
    created: string
  }
  
  export interface ToolCategory {
    name: string
    icon: string
    subcategories: {
      name: string
    }[]
  }