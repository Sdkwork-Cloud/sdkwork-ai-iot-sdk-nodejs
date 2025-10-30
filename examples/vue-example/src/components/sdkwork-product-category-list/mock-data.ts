/**
 * SDKWork Product Category List 组件模拟数据
 */

import { CategoryVO } from '@/services'
import type { Product } from './types'

// Mock数据 - 商品分类
export const mockCategories: CategoryVO[] = [
  { id: 1, name: '全部商品', count: 15, icon: 'apps-o' },
  { id: 2, name: '热门推荐', count: 1, icon: 'fire-o' },
  { id: 3, name: '新品上市', count: 1, icon: 'new-o' },
  { id: 4, name: '限时特惠', count: 1, icon: 'discount' },
  { id: 5, name: '数码电子', count: 3, icon: 'phone-o' },
  { id: 6, name: '家居生活', count: 2, icon: 'home-o' },
  { id: 7, name: '服饰鞋包', count: 2, icon: 'bag-o' },
  { id: 8, name: '美妆护肤', count: 2, icon: 'flower-o' },
  { id: 9, name: '食品生鲜', count: 1, icon: 'shopping-cart-o' },
  { id: 10, name: '运动户外', count: 2, icon: 'like-o' }
]

// Mock数据 - 商品列表
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Apple iPhone 14 Pro Max',
    description: 'A16仿生芯片，4800万像素主摄，灵动岛设计',
    price: 8999,
    originalPrice: 9999,
    image: 'https://example.com/iphone14.jpg',
    categoryId: 5,
    stock: 50,
    status: 'active',
    tags: ['热门', '新品'],
    rating: 4.8,
    sales: 1200
  },
  {
    id: 2,
    name: '小米智能电视 65英寸',
    description: '4K超高清，MEMC运动补偿，小爱同学语音控制',
    price: 2999,
    originalPrice: 3499,
    image: 'https://example.com/xiaomi-tv.jpg',
    categoryId: 5,
    stock: 30,
    status: 'active',
    tags: ['热销'],
    rating: 4.6,
    sales: 800
  },
  {
    id: 3,
    name: '无印良品懒人沙发',
    description: '舒适填充，可调节角度，适合小户型',
    price: 599,
    originalPrice: 699,
    image: 'https://example.com/sofa.jpg',
    categoryId: 6,
    stock: 25,
    status: 'active',
    tags: ['家居'],
    rating: 4.7,
    sales: 450
  },
  {
    id: 4,
    name: '耐克Air Jordan 1',
    description: '经典篮球鞋，舒适透气，时尚百搭',
    price: 1299,
    originalPrice: 1499,
    image: 'https://example.com/jordan1.jpg',
    categoryId: 10,
    stock: 15,
    status: 'active',
    tags: ['运动', '限量'],
    rating: 4.9,
    sales: 320
  },
  {
    id: 5,
    name: '雅诗兰黛小棕瓶精华',
    description: '修护肌肤，改善细纹，提亮肤色',
    price: 680,
    originalPrice: 780,
    image: 'https://example.com/estee-lauder.jpg',
    categoryId: 8,
    stock: 40,
    status: 'active',
    tags: ['护肤', '热销'],
    rating: 4.8,
    sales: 650
  },
  {
    id: 6,
    name: '华为MateBook X Pro',
    description: '13.9英寸全面屏，11代酷睿处理器，轻薄便携',
    price: 8999,
    originalPrice: 9999,
    image: 'https://example.com/huawei-matebook.jpg',
    categoryId: 5,
    stock: 20,
    status: 'active',
    tags: ['办公', '便携'],
    rating: 4.7,
    sales: 280
  },
  {
    id: 7,
    name: '宜家简约书桌',
    description: '北欧风格，环保材质，多功能设计',
    price: 399,
    originalPrice: 499,
    image: 'https://example.com/ikea-desk.jpg',
    categoryId: 6,
    stock: 35,
    status: 'active',
    tags: ['办公', '简约'],
    rating: 4.5,
    sales: 520
  },
  {
    id: 8,
    name: '阿迪达斯运动鞋',
    description: 'Boost缓震技术，透气网面，舒适耐磨',
    price: 699,
    originalPrice: 799,
    image: 'https://example.com/adidas-shoes.jpg',
    categoryId: 10,
    stock: 25,
    status: 'active',
    tags: ['运动', '舒适'],
    rating: 4.6,
    sales: 380
  },
  {
    id: 9,
    name: '兰蔻小黑瓶精华',
    description: '深层修护，改善肤质，提亮保湿',
    price: 780,
    originalPrice: 880,
    image: 'https://example.com/lancome-serum.jpg',
    categoryId: 8,
    stock: 30,
    status: 'active',
    tags: ['护肤', '修护'],
    rating: 4.8,
    sales: 420
  },
  {
    id: 10,
    name: '星巴克咖啡豆',
    description: '阿拉比卡咖啡豆，中度烘焙，香醇浓郁',
    price: 98,
    originalPrice: 128,
    image: 'https://example.com/starbucks-coffee.jpg',
    categoryId: 9,
    stock: 60,
    status: 'active',
    tags: ['食品', '咖啡'],
    rating: 4.9,
    sales: 890
  },
  {
    id: 11,
    name: 'AirPods Pro 2代',
    description: '主动降噪，空间音频，MagSafe充电',
    price: 1899,
    originalPrice: 1999,
    image: 'https://example.com/airpods-pro.jpg',
    categoryId: 2,
    stock: 25,
    status: 'active',
    tags: ['热门', '降噪'],
    rating: 4.8,
    sales: 350
  },
  {
    id: 12,
    name: '华为P60 Pro',
    description: '超光变XMAGE影像，昆仑玻璃，鸿蒙系统',
    price: 5988,
    originalPrice: 6488,
    image: 'https://example.com/huawei-p60.jpg',
    categoryId: 3,
    stock: 15,
    status: 'active',
    tags: ['新品', '拍照'],
    rating: 4.7,
    sales: 120
  },
  {
    id: 13,
    name: '小米手环8 Pro',
    description: '1.74英寸大屏，血氧监测，NFC功能',
    price: 399,
    originalPrice: 499,
    image: 'https://example.com/miband8.jpg',
    categoryId: 4,
    stock: 40,
    status: 'active',
    tags: ['特惠', '健康'],
    rating: 4.6,
    sales: 280
  },
  {
    id: 14,
    name: 'ZARA休闲衬衫',
    description: '纯棉材质，修身版型，商务休闲',
    price: 299,
    originalPrice: 399,
    image: 'https://example.com/zara-shirt.jpg',
    categoryId: 7,
    stock: 35,
    status: 'active',
    tags: ['服饰', '百搭'],
    rating: 4.5,
    sales: 190
  },
  {
    id: 15,
    name: 'Coach女士手提包',
    description: '真皮材质，时尚设计，大容量',
    price: 1299,
    originalPrice: 1599,
    image: 'https://example.com/coach-bag.jpg',
    categoryId: 7,
    stock: 12,
    status: 'active',
    tags: ['包包', '轻奢'],
    rating: 4.7,
    sales: 85
  }
]

// 模拟API延迟
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 获取商品分类数据
export const getProductCategories = async (): Promise<CategoryVO[]> => {
  await delay(500) // 模拟网络延迟
  return mockCategories
}

// 获取商品列表数据
export const getProductList = async (params: any): Promise<any> => {
  await delay(800) // 模拟网络延迟
  
  const { page = 0, size = 10, categoryId } = params
  
  // 根据分类ID过滤商品
  let filteredProducts = mockProducts
  if (categoryId && categoryId !== 'all') {
    filteredProducts = mockProducts.filter(product => product.categoryId === categoryId)
  }
  
  // 模拟分页
  const startIndex = page * size
  const endIndex = startIndex + size
  const pageProducts = filteredProducts.slice(startIndex, endIndex)
  
  return {
    content: pageProducts,
    totalElements: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / size),
    number: page,
    size: size,
    first: page === 0,
    last: endIndex >= filteredProducts.length,
    empty: pageProducts.length === 0
  }
}