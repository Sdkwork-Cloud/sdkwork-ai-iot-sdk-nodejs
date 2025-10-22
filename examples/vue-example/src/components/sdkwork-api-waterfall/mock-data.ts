 

/**
 * 模拟商品数据
 */
export const mockProducts: any[] = [
  {
    id: '1',
    name: '智能手机 Pro Max',
    price: 5999,
    image: 'https://via.placeholder.com/300x400/007bff/ffffff?text=Phone',
    rating: 4.5,
    sales: 1200,
    description: '高性能智能手机，配备最新处理器和超清摄像头',
    category: 'electronics'
  },
  {
    id: '2',
    name: '笔记本电脑 Ultra',
    price: 8999,
    image: 'https://via.placeholder.com/300x300/28a745/ffffff?text=Laptop',
    rating: 4.8,
    sales: 850,
    description: '轻薄便携，性能强劲，适合办公和娱乐',
    category: 'electronics'
  },
  {
    id: '3',
    name: '无线耳机 Pro',
    price: 1299,
    image: 'https://via.placeholder.com/300x250/dc3545/ffffff?text=Headphone',
    rating: 4.3,
    sales: 2300,
    description: '降噪效果出色，音质纯净，续航时间长',
    category: 'electronics'
  },
  {
    id: '4',
    name: '智能手表 Series',
    price: 1999,
    image: 'https://via.placeholder.com/300x350/ffc107/000000?text=Watch',
    rating: 4.6,
    sales: 1500,
    description: '健康监测，运动追踪，智能提醒功能',
    category: 'electronics'
  },
  {
    id: '5',
    name: '平板电脑 Mini',
    price: 3299,
    image: 'https://via.placeholder.com/300x280/17a2b8/ffffff?text=Tablet',
    rating: 4.4,
    sales: 700,
    description: '便携平板，适合阅读和轻度办公',
    category: 'electronics'
  },
  {
    id: '6',
    name: '游戏主机 Elite',
    price: 3999,
    image: 'https://via.placeholder.com/300x320/6f42c1/ffffff?text=Console',
    rating: 4.9,
    sales: 450,
    description: '高性能游戏主机，支持4K游戏体验',
    category: 'electronics'
  },
  {
    id: '7',
    name: '数码相机 Pro',
    price: 5999,
    image: 'https://via.placeholder.com/300x280/20c997/ffffff?text=Camera',
    rating: 4.7,
    sales: 320,
    description: '专业级数码相机，适合摄影爱好者',
    category: 'electronics'
  },
  {
    id: '8',
    name: '蓝牙音箱 Max',
    price: 899,
    image: 'https://via.placeholder.com/300x250/fd7e14/ffffff?text=Speaker',
    rating: 4.2,
    sales: 1800,
    description: '360度环绕音效，便携设计，续航强劲',
    category: 'electronics'
  },
  {
    id: '9',
    name: '机械键盘 RGB',
    price: 699,
    image: 'https://via.placeholder.com/300x200/6610f2/ffffff?text=Keyboard',
    rating: 4.5,
    sales: 1200,
    description: 'RGB背光机械键盘，手感舒适',
    category: 'electronics'
  },
  {
    id: '10',
    name: '电竞鼠标 Pro',
    price: 399,
    image: 'https://via.placeholder.com/300x180/e83e8c/ffffff?text=Mouse',
    rating: 4.4,
    sales: 1800,
    description: '高精度电竞鼠标，响应迅速',
    category: 'electronics'
  },
  {
    id: '11',
    name: '显示器 UltraWide',
    price: 2999,
    image: 'https://via.placeholder.com/300x240/6c757d/ffffff?text=Monitor',
    rating: 4.7,
    sales: 600,
    description: '超宽屏显示器，色彩准确',
    category: 'electronics'
  },
  {
    id: '12',
    name: '路由器 WiFi6',
    price: 599,
    image: 'https://via.placeholder.com/300x220/28a745/ffffff?text=Router',
    rating: 4.3,
    sales: 900,
    description: 'WiFi6路由器，信号稳定',
    category: 'electronics'
  }
]

/**
 * 模拟API响应
 */
export const mockApiResponse = {
  content: mockProducts,
  empty: false,
  first: true,
  last: false,
  number: 0,
  numberOfElements: 12,
  size: 12,
  totalElements: 12,
  totalPages: 1
}

/**
 * 模拟分页API
 */
export const mockProductApi = async (params: any) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const { page = 0, size = 8, keyword } = params
  
  // 关键词搜索过滤
  let filteredProducts = mockProducts
  if (keyword) {
    filteredProducts = mockProducts.filter(product => 
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(keyword.toLowerCase())
    )
  }
  
  const startIndex = page * size
  const endIndex = startIndex + size
  const content = filteredProducts.slice(startIndex, endIndex)
  
  return {
    content,
    empty: content.length === 0,
    first: page === 0,
    last: endIndex >= filteredProducts.length,
    number: page,
    numberOfElements: content.length,
    size,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
      orders: []
    },
    totalElements: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / size)
  }
}