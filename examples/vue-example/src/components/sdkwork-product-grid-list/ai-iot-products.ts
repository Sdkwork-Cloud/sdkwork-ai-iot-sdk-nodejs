import type { Page, Pageable } from 'sdkwork-commons-typescript'

// AI和IoT商品数据类型
export interface AIProduct {
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
  brand?: string
  features?: string[]
  compatibility?: string[]
  warranty?: string
  createdAt?: string
  updatedAt?: string
}

// AI和IoT智能硬件商品数据
export const aiIotProducts: AIProduct[] = [
  // 智能家居类
  {
    id: 101,
    name: 'AI智能音箱 Pro',
    description: '语音助手，智能家居控制中心，支持多设备联动',
    price: 299,
    originalPrice: 399,
    discount: 7.5,
    image: 'https://via.placeholder.com/300x300/1989fa/ffffff?text=AI音箱',
    rating: 4.7,
    sales: 12500,
    stock: 45,
    store: 'AI智能旗舰店',
    delivery: '次日达',
    tags: ['新品', '热销', 'AI语音'],
    category: '智能家居',
    brand: 'SmartAI',
    features: ['语音控制', '智能家居联动', '音乐播放', '天气查询'],
    compatibility: ['iOS', 'Android', 'Windows'],
    warranty: '1年质保'
  },
  {
    id: 102,
    name: '智能门锁 X1',
    description: '指纹识别，人脸识别，远程开锁，安全可靠',
    price: 899,
    originalPrice: 1299,
    discount: 6.9,
    image: 'https://via.placeholder.com/300x300/07c160/ffffff?text=智能门锁',
    rating: 4.8,
    sales: 8900,
    stock: 32,
    store: '安全科技旗舰店',
    delivery: '次日达',
    tags: ['安全', '指纹识别', '人脸识别'],
    category: '智能家居',
    brand: 'SecureTech',
    features: ['指纹识别', '人脸识别', '远程控制', '临时密码'],
    compatibility: ['iOS', 'Android'],
    warranty: '2年质保'
  },
  {
    id: 103,
    name: '扫地机器人 T8',
    description: '激光导航，自动回充，智能避障，深度清洁',
    price: 1599,
    originalPrice: 1999,
    discount: 8.0,
    image: 'https://via.placeholder.com/300x300/ff976a/ffffff?text=扫地机器人',
    rating: 4.6,
    sales: 15600,
    stock: 28,
    store: '清洁科技旗舰店',
    delivery: '次日达',
    tags: ['清洁', '智能', '自动回充'],
    category: '智能家居',
    brand: 'CleanBot',
    features: ['激光导航', '自动回充', '智能避障', 'APP控制'],
    compatibility: ['iOS', 'Android'],
    warranty: '1年质保'
  },
  
  // AI设备类
  {
    id: 201,
    name: 'AI学习机器人',
    description: '儿童编程教育，AI对话，STEM教育玩具',
    price: 1299,
    originalPrice: 1599,
    discount: 8.1,
    image: 'https://via.placeholder.com/300x300/ee0a24/ffffff?text=AI机器人',
    rating: 4.9,
    sales: 7800,
    stock: 56,
    store: '教育科技旗舰店',
    delivery: '2-3天',
    tags: ['教育', '编程', 'STEM'],
    category: 'AI设备',
    brand: 'EduAI',
    features: ['编程学习', 'AI对话', 'STEM教育', '互动游戏'],
    compatibility: ['iOS', 'Android'],
    warranty: '1年质保'
  },
  {
    id: 202,
    name: 'AI摄像头 Pro',
    description: '人脸识别，移动追踪，云存储，智能安防',
    price: 499,
    originalPrice: 699,
    discount: 7.1,
    image: 'https://via.placeholder.com/300x300/1989fa/ffffff?text=AI摄像头',
    rating: 4.7,
    sales: 3200,
    stock: 15,
    store: '安防科技旗舰店',
    delivery: '次日达',
    tags: ['安防', '人脸识别', '云存储'],
    category: 'AI设备',
    brand: 'SecureVision',
    features: ['人脸识别', '移动追踪', '云存储', '夜视功能'],
    compatibility: ['iOS', 'Android', 'Web'],
    warranty: '2年质保'
  },
  
  // 智能穿戴类
  {
    id: 301,
    name: 'AI健康手环',
    description: '心率监测，血氧检测，睡眠分析，运动记录',
    price: 399,
    originalPrice: 499,
    discount: 8.0,
    image: 'https://via.placeholder.com/300x300/07c160/ffffff?text=健康手环',
    rating: 4.5,
    sales: 25600,
    stock: 156,
    store: '健康科技旗舰店',
    delivery: '次日达',
    tags: ['健康', '运动', '监测'],
    category: '智能穿戴',
    brand: 'HealthAI',
    features: ['心率监测', '血氧检测', '睡眠分析', '运动记录'],
    compatibility: ['iOS', 'Android'],
    warranty: '1年质保'
  },
  {
    id: 302,
    name: '智能手表 Pro',
    description: '全面健康监测，运动模式，消息提醒，长续航',
    price: 1299,
    originalPrice: 1599,
    discount: 8.1,
    image: 'https://via.placeholder.com/300x300/ff976a/ffffff?text=智能手表',
    rating: 4.6,
    sales: 8900,
    stock: 78,
    store: '穿戴科技旗舰店',
    delivery: '次日达',
    tags: ['健康', '运动', '智能提醒'],
    category: '智能穿戴',
    brand: 'WearTech',
    features: ['健康监测', '运动模式', '消息提醒', '长续航'],
    compatibility: ['iOS', 'Android'],
    warranty: '1年质保'
  },
  
  // 机器人类
  {
    id: 401,
    name: '家庭陪伴机器人',
    description: '情感交互，家庭监控，老人陪伴，儿童教育',
    price: 8999,
    originalPrice: 12999,
    discount: 6.9,
    image: 'https://via.placeholder.com/300x300/ee0a24/ffffff?text=陪伴机器人',
    rating: 4.8,
    sales: 1200,
    stock: 8,
    store: '机器人科技旗舰店',
    delivery: '3-5天',
    tags: ['陪伴', '监控', '教育'],
    category: '机器人',
    brand: 'CompanionBot',
    features: ['情感交互', '家庭监控', '老人陪伴', '儿童教育'],
    compatibility: ['iOS', 'Android'],
    warranty: '2年质保'
  },
  {
    id: 402,
    name: '工业巡检机器人',
    description: '自主导航，环境监测，数据采集，远程控制',
    price: 25999,
    originalPrice: 35999,
    discount: 7.2,
    image: 'https://via.placeholder.com/300x300/1989fa/ffffff?text=巡检机器人',
    rating: 4.9,
    sales: 890,
    stock: 12,
    store: '工业科技旗舰店',
    delivery: '5-7天',
    tags: ['工业', '巡检', '监测'],
    category: '机器人',
    brand: 'IndustrialBot',
    features: ['自主导航', '环境监测', '数据采集', '远程控制'],
    compatibility: ['Web', '专用控制台'],
    warranty: '3年质保'
  },
  
  // 无人机类
  {
    id: 501,
    name: 'AI摄影无人机',
    description: '4K拍摄，智能跟随，避障系统，长续航',
    price: 3899,
    originalPrice: 5299,
    discount: 7.4,
    image: 'https://via.placeholder.com/300x300/07c160/ffffff?text=摄影无人机',
    rating: 4.7,
    sales: 6700,
    stock: 34,
    store: '航拍科技旗舰店',
    delivery: '2-3天',
    tags: ['摄影', '航拍', '智能跟随'],
    category: '无人机',
    brand: 'AeroVision',
    features: ['4K拍摄', '智能跟随', '避障系统', '长续航'],
    compatibility: ['iOS', 'Android'],
    warranty: '1年质保'
  },
  {
    id: 502,
    name: '农业植保无人机',
    description: '精准喷洒，自主作业，大数据分析，高效农业',
    price: 18999,
    originalPrice: 25999,
    discount: 7.3,
    image: 'https://via.placeholder.com/300x300/ff976a/ffffff?text=植保无人机',
    rating: 4.8,
    sales: 2300,
    stock: 29,
    store: '农业科技旗舰店',
    delivery: '5-7天',
    tags: ['农业', '植保', '精准喷洒'],
    category: '无人机',
    brand: 'AgriDrone',
    features: ['精准喷洒', '自主作业', '大数据分析', '高效作业'],
    compatibility: ['专用控制器'],
    warranty: '2年质保'
  },
  
  // 传感器类
  {
    id: 601,
    name: '环境监测传感器',
    description: '温湿度监测，空气质量检测，数据上传，智能预警',
    price: 199,
    originalPrice: 299,
    discount: 6.7,
    image: 'https://via.placeholder.com/300x300/ee0a24/ffffff?text=环境传感器',
    rating: 4.5,
    sales: 15600,
    stock: 67,
    store: '传感科技旗舰店',
    delivery: '次日达',
    tags: ['环境监测', '空气质量', '智能预警'],
    category: '传感器',
    brand: 'SenseTech',
    features: ['温湿度监测', '空气质量检测', '数据上传', '智能预警'],
    compatibility: ['iOS', 'Android'],
    warranty: '1年质保'
  },
  {
    id: 602,
    name: '智能运动传感器',
    description: '动作识别，姿态分析，运动数据，健康建议',
    price: 299,
    originalPrice: 399,
    discount: 7.5,
    image: 'https://via.placeholder.com/300x300/1989fa/ffffff?text=运动传感器',
    rating: 4.6,
    sales: 5600,
    stock: 25,
    store: '运动科技旗舰店',
    delivery: '次日达',
    tags: ['运动', '姿态分析', '健康建议'],
    category: '传感器',
    brand: 'MotionSense',
    features: ['动作识别', '姿态分析', '运动数据', '健康建议'],
    compatibility: ['iOS', 'Android'],
    warranty: '1年质保'
  },
  
  // 智能摄像头类
  {
    id: 701,
    name: '全景智能摄像头',
    description: '360度全景，夜视功能，移动侦测，云台控制',
    price: 699,
    originalPrice: 899,
    discount: 7.8,
    image: 'https://via.placeholder.com/300x300/07c160/ffffff?text=全景摄像头',
    rating: 4.7,
    sales: 15600,
    stock: 89,
    store: '视觉科技旗舰店',
    delivery: '次日达',
    tags: ['全景', '夜视', '移动侦测'],
    category: '智能摄像头',
    brand: 'PanoramaVision',
    features: ['360度全景', '夜视功能', '移动侦测', '云台控制'],
    compatibility: ['iOS', 'Android', 'Web'],
    warranty: '2年质保'
  },
  {
    id: 702,
    name: '门铃摄像头',
    description: '人脸识别，双向通话，移动侦测，远程查看',
    price: 399,
    originalPrice: 599,
    discount: 6.7,
    image: 'https://via.placeholder.com/300x300/ff976a/ffffff?text=门铃摄像头',
    rating: 4.5,
    sales: 6700,
    stock: 43,
    store: '安防科技旗舰店',
    delivery: '次日达',
    tags: ['门铃', '人脸识别', '双向通话'],
    category: '智能摄像头',
    brand: 'DoorVision',
    features: ['人脸识别', '双向通话', '移动侦测', '远程查看'],
    compatibility: ['iOS', 'Android'],
    warranty: '1年质保'
  },
  
  // AI芯片类
  {
    id: 801,
    name: 'AI推理芯片',
    description: '高性能AI计算，低功耗设计，边缘计算专用',
    price: 2999,
    originalPrice: 4999,
    discount: 6.0,
    image: 'https://via.placeholder.com/300x300/ee0a24/ffffff?text=AI芯片',
    rating: 4.8,
    sales: 3400,
    stock: 42,
    store: '芯片科技旗舰店',
    delivery: '3-5天',
    tags: ['AI芯片', '边缘计算', '高性能'],
    category: 'AI芯片',
    brand: 'ChipAI',
    features: ['高性能AI计算', '低功耗设计', '边缘计算', '专用架构'],
    compatibility: ['专用开发板'],
    warranty: '3年质保'
  },
  {
    id: 802,
    name: '神经网络处理器',
    description: '深度学习加速，模型推理，AI应用开发',
    price: 5999,
    originalPrice: 8999,
    discount: 6.7,
    image: 'https://via.placeholder.com/300x300/1989fa/ffffff?text=神经网络芯片',
    rating: 4.9,
    sales: 8900,
    stock: 58,
    store: 'AI硬件旗舰店',
    delivery: '3-5天',
    tags: ['神经网络', '深度学习', 'AI加速'],
    category: 'AI芯片',
    brand: 'NeuralTech',
    features: ['深度学习加速', '模型推理', 'AI应用开发', '高性能计算'],
    compatibility: ['专用开发平台'],
    warranty: '3年质保'
  },
  
  // IoT网关类
  {
    id: 901,
    name: '智能家居网关',
    description: '多协议支持，设备联动，远程控制，数据聚合',
    price: 499,
    originalPrice: 799,
    discount: 6.2,
    image: 'https://via.placeholder.com/300x300/07c160/ffffff?text=智能网关',
    rating: 4.6,
    sales: 2300,
    stock: 29,
    store: 'IoT科技旗舰店',
    delivery: '次日达',
    tags: ['网关', '多协议', '设备联动'],
    category: 'IoT网关',
    brand: 'IoTGateway',
    features: ['多协议支持', '设备联动', '远程控制', '数据聚合'],
    compatibility: ['Zigbee', 'Z-Wave', 'WiFi', '蓝牙'],
    warranty: '2年质保'
  },
  {
    id: 902,
    name: '工业物联网网关',
    description: '工业级设计，数据采集，边缘计算，远程监控',
    price: 2999,
    originalPrice: 4999,
    discount: 6.0,
    image: 'https://via.placeholder.com/300x300/ff976a/ffffff?text=工业网关',
    rating: 4.8,
    sales: 15600,
    stock: 89,
    store: '工业IoT旗舰店',
    delivery: '3-5天',
    tags: ['工业级', '数据采集', '边缘计算'],
    category: 'IoT网关',
    brand: 'IndustrialIoT',
    features: ['工业级设计', '数据采集', '边缘计算', '远程监控'],
    compatibility: ['Modbus', 'OPC UA', 'MQTT'],
    warranty: '3年质保'
  }
]

// 获取AI和IoT商品列表API
export const getAIProductList = async (params: Pageable|any): Promise<Page<AIProduct>|any> => {
  const { page = 0, size = 12, keyword, category, ...filters } = params
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 筛选逻辑
  let filteredProducts = [...aiIotProducts]
  
  // 关键词搜索
  if (keyword) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(keyword.toString().toLowerCase()) ||
      product.description?.toLowerCase().includes(keyword.toString().toLowerCase()) ||
      product.brand?.toLowerCase().includes(keyword.toString().toLowerCase())
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
  
  // 品牌筛选
  if (filters.brand) {
    filteredProducts = filteredProducts.filter(product =>
      product.brand === filters.brand
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
export const getAIProductDetail = async (id: number): Promise<AIProduct | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return aiIotProducts.find(product => product.id === id) || null
}

// 获取推荐商品
export const getRecommendedAIProducts = async (count: number = 6): Promise<AIProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 150))
  // 返回评分最高的商品
  return aiIotProducts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, count)
}

// 获取热门商品
export const getHotAIProducts = async (count: number = 8): Promise<AIProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 150))
  // 返回销量最高的商品
  return aiIotProducts
    .sort((a, b) => b.sales - a.sales)
    .slice(0, count)
}

// 获取新品商品
export const getNewAIProducts = async (count: number = 6): Promise<AIProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 150))
  // 返回最新的商品（按ID倒序）
  return aiIotProducts
    .sort((a, b) => b.id - a.id)
    .slice(0, count)
}