import type { Page, Pageable } from 'sdkwork-commons-typescript'

// 商品数据类型
export interface Product {
  id: number
  name: string
  description?: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  rating: number
  sales: number
  stock: number
  store?: string
  delivery?: string
  tags?: string[]
  category?: string
  createdAt?: string
  updatedAt?: string
}

// 模拟商品数据
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro Max 256GB',
    description: '钛金属设计，A17 Pro芯片，专业级摄像头系统',
    price: 9999,
    originalPrice: 10999,
    discount: 9.1,
    image: 'https://example.com/iphone15-pro-max.jpg',
    rating: 4.8,
    sales: 12500,
    stock: 45,
    store: 'Apple官方旗舰店',
    delivery: '次日达',
    tags: ['新品', '热销', '推荐'],
    category: '手机数码'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 512GB',
    description: 'AI摄影，S Pen，超视觉夜拍系统',
    price: 8999,
    originalPrice: 9999,
    discount: 9.0,
    image: 'https://example.com/samsung-s24-ultra.jpg',
    rating: 4.7,
    sales: 8900,
    stock: 32,
    store: '三星官方旗舰店',
    delivery: '次日达',
    tags: ['新品', '热销'],
    category: '手机数码'
  },
  {
    id: 3,
    name: '华为Mate 60 Pro+ 512GB',
    description: '卫星通话，昆仑玻璃，超光变XMAGE影像',
    price: 7999,
    originalPrice: 8999,
    discount: 8.9,
    image: 'https://example.com/huawei-mate60-pro-plus.jpg',
    rating: 4.9,
    sales: 15600,
    stock: 28,
    store: '华为官方旗舰店',
    delivery: '次日达',
    tags: ['新品', '热销', '限时'],
    category: '手机数码'
  },
  {
    id: 4,
    name: '小米14 Ultra 1TB',
    description: '徕卡影像，双向卫星通信，专业摄影套装',
    price: 6999,
    originalPrice: 7999,
    discount: 8.8,
    image: 'https://example.com/xiaomi-14-ultra.jpg',
    rating: 4.6,
    sales: 7800,
    stock: 56,
    store: '小米官方旗舰店',
    delivery: '次日达',
    tags: ['新品', '推荐'],
    category: '手机数码'
  },
  {
    id: 5,
    name: 'MacBook Pro 16英寸 M3 Max',
    description: 'M3 Max芯片，120Hz Liquid Retina XDR显示屏',
    price: 24999,
    originalPrice: 27999,
    discount: 8.9,
    image: 'https://example.com/macbook-pro-16.jpg',
    rating: 4.9,
    sales: 3200,
    stock: 15,
    store: 'Apple官方旗舰店',
    delivery: '2-3天',
    tags: ['新品', '热销'],
    category: '电脑办公'
  },
  {
    id: 6,
    name: 'Dell XPS 15 9530',
    description: '13代英特尔酷睿i9，RTX 4070，OLED触控屏',
    price: 18999,
    originalPrice: 21999,
    discount: 8.6,
    image: 'https://example.com/dell-xps-15.jpg',
    rating: 4.7,
    sales: 2100,
    stock: 22,
    store: '戴尔官方旗舰店',
    delivery: '2-3天',
    tags: ['热销', '推荐'],
    category: '电脑办公'
  },
  {
    id: 7,
    name: 'Sony WH-1000XM5 无线降噪耳机',
    description: '智能降噪，30小时续航，Hi-Res音质',
    price: 2299,
    originalPrice: 2999,
    discount: 7.7,
    image: 'https://example.com/sony-wh1000xm5.jpg',
    rating: 4.8,
    sales: 8900,
    stock: 78,
    store: '索尼官方旗舰店',
    delivery: '次日达',
    tags: ['热销', '推荐'],
    category: '影音娱乐'
  },
  {
    id: 8,
    name: 'AirPods Pro 2代',
    description: '主动降噪，自适应通透模式，MagSafe充电盒',
    price: 1899,
    originalPrice: 1999,
    discount: 9.5,
    image: 'https://example.com/airpods-pro-2.jpg',
    rating: 4.7,
    sales: 15600,
    stock: 92,
    store: 'Apple官方旗舰店',
    delivery: '次日达',
    tags: ['热销', '推荐'],
    category: '影音娱乐'
  },
  {
    id: 9,
    name: 'Nintendo Switch OLED版',
    description: '7英寸OLED屏幕，64GB存储，增强音频',
    price: 2399,
    originalPrice: 2699,
    discount: 8.9,
    image: 'https://example.com/switch-oled.jpg',
    rating: 4.6,
    sales: 6700,
    stock: 34,
    store: '任天堂官方旗舰店',
    delivery: '2-3天',
    tags: ['热销', '限时'],
    category: '游戏设备'
  },
  {
    id: 10,
    name: 'PlayStation 5 光驱版',
    description: '4K游戏体验，超高速SSD，DualSense手柄',
    price: 3899,
    originalPrice: 4299,
    discount: 9.1,
    image: 'https://example.com/ps5.jpg',
    rating: 4.9,
    sales: 12500,
    stock: 18,
    store: '索尼官方旗舰店',
    delivery: '2-3天',
    tags: ['热销', '推荐'],
    category: '游戏设备'
  },
  {
    id: 11,
    name: '佳能EOS R5 Mark II',
    description: '4500万像素，8K视频，机身防抖',
    price: 25999,
    originalPrice: 28999,
    discount: 9.0,
    image: 'https://example.com/canon-eos-r5.jpg',
    rating: 4.8,
    sales: 1200,
    stock: 8,
    store: '佳能官方旗舰店',
    delivery: '3-5天',
    tags: ['新品', '推荐'],
    category: '摄影摄像'
  },
  {
    id: 12,
    name: '大疆DJI Mavic 3 Pro',
    description: '三摄系统，46分钟续航，全向避障',
    price: 13888,
    originalPrice: 15999,
    discount: 8.7,
    image: 'https://example.com/dji-mavic3-pro.jpg',
    rating: 4.9,
    sales: 890,
    stock: 12,
    store: '大疆官方旗舰店',
    delivery: '3-5天',
    tags: ['新品', '热销'],
    category: '摄影摄像'
  },
  {
    id: 13,
    name: 'Kindle Paperwhite 5',
    description: '6.8英寸屏幕，300ppi，IPX8防水',
    price: 1068,
    originalPrice: 1299,
    discount: 8.2,
    image: 'https://example.com/kindle-paperwhite.jpg',
    rating: 4.5,
    sales: 15600,
    stock: 67,
    store: '亚马逊官方旗舰店',
    delivery: '次日达',
    tags: ['热销'],
    category: '阅读设备'
  },
  {
    id: 14,
    name: 'iPad Pro 12.9英寸 M2',
    description: 'Liquid Retina XDR显示屏，M2芯片，5G连接',
    price: 9299,
    originalPrice: 10499,
    discount: 8.9,
    image: 'https://example.com/ipad-pro-12.9.jpg',
    rating: 4.7,
    sales: 5600,
    stock: 25,
    store: 'Apple官方旗舰店',
    delivery: '次日达',
    tags: ['热销', '推荐'],
    category: '平板电脑'
  },
  {
    id: 15,
    name: '华为MatePad Pro 13.2',
    description: '柔性OLED屏幕，麒麟9000s，星闪技术',
    price: 5199,
    originalPrice: 5699,
    discount: 9.1,
    image: 'https://example.com/huawei-matepad-pro.jpg',
    rating: 4.6,
    sales: 3400,
    stock: 42,
    store: '华为官方旗舰店',
    delivery: '次日达',
    tags: ['新品', '推荐'],
    category: '平板电脑'
  },
  {
    id: 16,
    name: 'Apple Watch Series 9',
    description: 'S9芯片，手势控制，血氧检测',
    price: 2999,
    originalPrice: 3199,
    discount: 9.4,
    image: 'https://example.com/apple-watch-s9.jpg',
    rating: 4.7,
    sales: 8900,
    stock: 58,
    store: 'Apple官方旗舰店',
    delivery: '次日达',
    tags: ['新品', '热销'],
    category: '智能穿戴'
  },
  {
    id: 17,
    name: '小米手环8 Pro',
    description: '1.74英寸AMOLED，独立GPS，血氧心率监测',
    price: 399,
    originalPrice: 499,
    discount: 8.0,
    image: 'https://example.com/xiaomi-band8-pro.jpg',
    rating: 4.5,
    sales: 25600,
    stock: 156,
    store: '小米官方旗舰店',
    delivery: '次日达',
    tags: ['热销', '推荐'],
    category: '智能穿戴'
  },
  {
    id: 18,
    name: 'Bose QuietComfort Ultra',
    description: '沉浸式音频，自定义模式，24小时续航',
    price: 3299,
    originalPrice: 3599,
    discount: 9.2,
    image: 'https://example.com/bose-qc-ultra.jpg',
    rating: 4.8,
    sales: 2300,
    stock: 29,
    store: 'Bose官方旗舰店',
    delivery: '2-3天',
    tags: ['新品', '推荐'],
    category: '影音娱乐'
  },
  {
    id: 19,
    name: '罗技MX Master 3S',
    description: '8000DPI，MagSpeed电磁滚轮，多设备切换',
    price: 699,
    originalPrice: 899,
    discount: 7.8,
    image: 'https://example.com/logitech-mx-master3s.jpg',
    rating: 4.6,
    sales: 15600,
    stock: 89,
    store: '罗技官方旗舰店',
    delivery: '次日达',
    tags: ['热销'],
    category: '电脑外设'
  },
  {
    id: 20,
    name: '雷蛇黑寡妇蜘蛛V4',
    description: '机械轴体，RGB灯效，多功能旋钮',
    price: 1299,
    originalPrice: 1499,
    discount: 8.7,
    image: 'https://example.com/razer-blackwidow-v4.jpg',
    rating: 4.5,
    sales: 6700,
    stock: 43,
    store: '雷蛇官方旗舰店',
    delivery: '次日达',
    tags: ['热销', '推荐'],
    category: '电脑外设'
  }
]

// 获取商品列表API
export const getProductList = async (params: Pageable|any): Promise<Page<Product>|any> => {
  const { page = 0, size = 12, keyword, category, ...filters } = params
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 筛选逻辑
  let filteredProducts = [...mockProducts]
  
  // 关键词搜索
  if (keyword) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(keyword.toString().toLowerCase()) ||
      product.description?.toLowerCase().includes(keyword.toString().toLowerCase())
    )
  }
  
  // 分类筛选
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === category
    )
  }
  
  // 价格筛选
  if (filters.minPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= Number(filters.minPrice)
    )
  }
  
  if (filters.maxPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= Number(filters.maxPrice)
    )
  }
  
  // 标签筛选
  if (filters.tags) {
    const tagList = Array.isArray(filters.tags) ? filters.tags : [filters.tags]
    filteredProducts = filteredProducts.filter(product =>
      tagList.some((tag:any) => product.tags?.includes(tag.toString()))
    )
  }
  
  // 分页逻辑
  const startIndex = page * size
  const endIndex = startIndex + size
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
  
  return {
    content: paginatedProducts,
    totalElements: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / size),
    size,
    number: page,
    first: page === 0,
    last: endIndex >= filteredProducts.length,
    numberOfElements: paginatedProducts.length,
    empty: paginatedProducts.length === 0
  }
}

// 获取商品详情
export const getProductDetail = async (id: number): Promise<Product | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return mockProducts.find(product => product.id === id) || null
}

// 获取推荐商品
export const getRecommendedProducts = async (count: number = 6): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 150))
  return mockProducts
    .filter(product => product.tags?.includes('推荐'))
    .slice(0, count)
}

// 获取热销商品
export const getHotProducts = async (count: number = 8): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 150))
  return mockProducts
    .sort((a, b) => b.sales - a.sales)
    .slice(0, count)
}

// 获取新品商品
export const getNewProducts = async (count: number = 6): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 150))
  return mockProducts
    .filter(product => product.tags?.includes('新品'))
    .slice(0, count)
}