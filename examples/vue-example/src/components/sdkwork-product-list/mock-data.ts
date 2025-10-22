import type { Page } from 'sdkwork-commons-typescript'

// 商品数据类型
export interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
  categoryId: string | number
  stock: number
  status: 'active' | 'inactive' | 'soldout'
  tags?: string[]
  rating?: number
  sales?: number
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

// 查询参数接口
export interface ProductQueryParams {
  keyword?: string
  categoryId?: string | number
  minPrice?: number
  maxPrice?: number
  status?: string
  tags?: string[]
  sortBy?: 'price' | 'sales' | 'rating' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  size?: number
}

// 模拟商品数据
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: '最新款iPhone，搭载A17 Pro芯片，钛金属机身',
    price: 7999,
    originalPrice: 8999,
    image: 'https://via.placeholder.com/200x200?text=iPhone+15+Pro',
    categoryId: 1,
    stock: 50,
    status: 'active',
    tags: ['手机', '苹果', '旗舰'],
    rating: 4.8,
    sales: 1200,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    description: '轻薄便携，性能强劲的笔记本电脑',
    price: 8999,
    originalPrice: 9999,
    image: 'https://via.placeholder.com/200x200?text=MacBook+Air+M2',
    categoryId: 2,
    stock: 30,
    status: 'active',
    tags: ['笔记本', '苹果', '轻薄'],
    rating: 4.7,
    sales: 800,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    description: '主动降噪无线耳机，音质出色',
    price: 1899,
    originalPrice: 1999,
    image: 'https://via.placeholder.com/200x200?text=AirPods+Pro+2',
    categoryId: 3,
    stock: 100,
    status: 'active',
    tags: ['耳机', '无线', '降噪'],
    rating: 4.6,
    sales: 1500,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19'
  },
  {
    id: 4,
    name: 'iPad Air 5',
    description: '性能强大的平板电脑，适合办公和娱乐',
    price: 4399,
    originalPrice: 4799,
    image: 'https://via.placeholder.com/200x200?text=iPad+Air+5',
    categoryId: 4,
    stock: 25,
    status: 'active',
    tags: ['平板', '苹果', '办公'],
    rating: 4.5,
    sales: 600,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-16'
  },
  {
    id: 5,
    name: 'Apple Watch Series 9',
    description: '智能手表，健康监测功能全面',
    price: 2999,
    originalPrice: 3199,
    image: 'https://via.placeholder.com/200x200?text=Apple+Watch+9',
    categoryId: 5,
    stock: 80,
    status: 'active',
    tags: ['手表', '智能', '健康'],
    rating: 4.4,
    sales: 900,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14'
  },
  {
    id: 6,
    name: 'Samsung Galaxy S24',
    description: '三星旗舰手机，AI功能强大',
    price: 5999,
    originalPrice: 6999,
    image: 'https://via.placeholder.com/200x200?text=Galaxy+S24',
    categoryId: 1,
    stock: 40,
    status: 'active',
    tags: ['手机', '三星', 'AI'],
    rating: 4.3,
    sales: 700,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-25'
  },
  {
    id: 7,
    name: 'Dell XPS 13',
    description: '商务轻薄本，性能稳定',
    price: 7999,
    originalPrice: 8999,
    image: 'https://via.placeholder.com/200x200?text=Dell+XPS+13',
    categoryId: 2,
    stock: 20,
    status: 'active',
    tags: ['笔记本', '商务', '轻薄'],
    rating: 4.2,
    sales: 400,
    createdAt: '2024-01-18',
    updatedAt: '2024-01-22'
  },
  {
    id: 8,
    name: 'Sony WH-1000XM5',
    description: '头戴式降噪耳机，音质顶级',
    price: 2299,
    originalPrice: 2599,
    image: 'https://via.placeholder.com/200x200?text=Sony+WH-1000XM5',
    categoryId: 3,
    stock: 60,
    status: 'active',
    tags: ['耳机', '降噪', '索尼'],
    rating: 4.7,
    sales: 1100,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-24'
  },
  {
    id: 9,
    name: '华为MatePad Pro',
    description: '华为旗舰平板，办公娱乐两相宜',
    price: 3299,
    originalPrice: 3699,
    image: 'https://via.placeholder.com/200x200?text=华为MatePad+Pro',
    categoryId: 4,
    stock: 35,
    status: 'active',
    tags: ['平板', '华为', '办公'],
    rating: 4.4,
    sales: 500,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-21'
  },
  {
    id: 10,
    name: '小米手环8',
    description: '性价比高的智能手环，功能齐全',
    price: 299,
    originalPrice: 349,
    image: 'https://via.placeholder.com/200x200?text=小米手环8',
    categoryId: 5,
    stock: 200,
    status: 'active',
    tags: ['手环', '小米', '性价比'],
    rating: 4.1,
    sales: 3000,
    createdAt: '2024-01-22',
    updatedAt: '2024-01-28'
  },
  {
    id: 11,
    name: 'iPhone 14',
    description: '上一代iPhone，性价比之选',
    price: 4999,
    originalPrice: 5999,
    image: 'https://via.placeholder.com/200x200?text=iPhone+14',
    categoryId: 1,
    stock: 15,
    status: 'soldout',
    tags: ['手机', '苹果', '性价比'],
    rating: 4.6,
    sales: 2000,
    createdAt: '2023-12-15',
    updatedAt: '2024-01-30'
  },
  {
    id: 12,
    name: 'MacBook Pro M3',
    description: '专业级笔记本电脑，性能怪兽',
    price: 12999,
    originalPrice: 14999,
    image: 'https://via.placeholder.com/200x200?text=MacBook+Pro+M3',
    categoryId: 2,
    stock: 10,
    status: 'active',
    tags: ['笔记本', '苹果', '专业'],
    rating: 4.9,
    sales: 300,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-29'
  },
  {
    id: 13,
    name: 'Bose QuietComfort 45',
    description: '舒适的头戴式降噪耳机',
    price: 1999,
    originalPrice: 2299,
    image: 'https://via.placeholder.com/200x200?text=Bose+QC45',
    categoryId: 3,
    stock: 45,
    status: 'active',
    tags: ['耳机', '降噪', 'Bose'],
    rating: 4.5,
    sales: 800,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-26'
  },
  {
    id: 14,
    name: 'iPad mini 6',
    description: '小巧便携的平板电脑',
    price: 3799,
    originalPrice: 3999,
    image: 'https://via.placeholder.com/200x200?text=iPad+mini+6',
    categoryId: 4,
    stock: 28,
    status: 'active',
    tags: ['平板', '便携', '苹果'],
    rating: 4.3,
    sales: 450,
    createdAt: '2024-01-13',
    updatedAt: '2024-01-23'
  },
  {
    id: 15,
    name: 'Garmin Fenix 7',
    description: '专业运动手表，户外探险必备',
    price: 4999,
    originalPrice: 5999,
    image: 'https://via.placeholder.com/200x200?text=Garmin+Fenix+7',
    categoryId: 5,
    stock: 12,
    status: 'active',
    tags: ['手表', '运动', '户外'],
    rating: 4.8,
    sales: 200,
    createdAt: '2024-01-11',
    updatedAt: '2024-01-27'
  }
]

// 模拟API获取商品列表
export const getProductList = async (params: ProductQueryParams = {}): Promise<Page<Product>|any> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const {
    keyword,
    categoryId,
    minPrice,
    maxPrice,
    status,
    tags,
    sortBy = 'id',
    sortOrder = 'asc',
    page = 0,
    size = 10
  } = params

  // 过滤数据
  let filteredProducts = [...mockProducts]

  // 关键词搜索
  if (keyword) {
    const keywordLower = keyword.toLowerCase()
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(keywordLower) ||
      product.description?.toLowerCase().includes(keywordLower)
    )
  }

  // 分类过滤
  if (categoryId) {
    filteredProducts = filteredProducts.filter(product => product.categoryId === categoryId)
  }

  // 价格区间过滤
  if (minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price >= minPrice)
  }
  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice)
  }

  // 状态过滤
  if (status) {
    filteredProducts = filteredProducts.filter(product => product.status === status)
  }

  // 标签过滤
  if (tags && tags.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.tags?.some(tag => tags.includes(tag))
    )
  }

  // 排序
  filteredProducts.sort((a, b) => {
    let aValue: any = a[sortBy] || 0
    let bValue: any = b[sortBy] || 0

    // 处理字符串排序
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })

  // 分页
  const startIndex = page * size
  const endIndex = startIndex + size
  const pageProducts = filteredProducts.slice(startIndex, endIndex)

  // 返回分页结果
  return {
    content: pageProducts,
    totalElements: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / size),
    size,
    number: page,
    first: page === 0,
    last: endIndex >= filteredProducts.length,
    numberOfElements: pageProducts.length,
    empty: pageProducts.length === 0
  }
}

// 根据ID获取单个商品
export const getProductById = async (id: string | number): Promise<Product | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockProducts.find(product => product.id === id) || null
}

// 批量获取商品
export const getProductsByIds = async (ids: (string | number)[]): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockProducts.filter(product => ids.includes(product.id))
}

// 获取推荐商品
export const getRecommendedProducts = async (count: number = 6): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // 按评分和销量推荐
  return [...mockProducts]
    .sort((a, b) => {
      const aScore = (a.rating || 0) * 0.6 + (a.sales || 0) * 0.4
      const bScore = (b.rating || 0) * 0.6 + (b.sales || 0) * 0.4
      return bScore - aScore
    })
    .slice(0, count)
}

// 获取热销商品
export const getHotProducts = async (count: number = 8): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return [...mockProducts]
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, count)
}

// 获取新品
export const getNewProducts = async (count: number = 6): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 250))
  
  return [...mockProducts]
    .sort((a, b) => {
      const aDate = new Date(a.createdAt || '2024-01-01').getTime()
      const bDate = new Date(b.createdAt || '2024-01-01').getTime()
      return bDate - aDate
    })
    .slice(0, count)
}