<template>
  <div class="product-detail-page">
    <SdkworkProductDetail
      :product="productData"
      :theme-mode="themeMode"
      @add-to-cart="handleAddToCart"
      @buy-now="handleBuyNow"
      @favorite-change="handleFavoriteChange"
      @share="handleShare"
      @customer-service="handleCustomerService"
      @tab-change="handleTabChange"
      @specs-change="handleSpecsChange"
      @specs-confirm="handleSpecsConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import SdkworkProductDetail from '@/components/sdkwork-product-detail/sdkwork-product-detail.vue'

const route = useRoute()

// 从路由参数获取商品ID
const productId = computed(() => {
  const params = route.params as { id: string | string[] }
  const id = params.id
  return Array.isArray(id) ? id[0] : id || '1'
})

// 主题模式
const themeMode = ref<'dark' | 'light' | 'auto'>('auto')

// 根据商品ID模拟不同的商品数据
const productData = computed(() => {
  const products = {
    '1': {
      id: 1,
      name: 'iPhone 15 Pro',
      description: '最新款iPhone，搭载A17 Pro芯片，钛金属机身',
      price: 7999,
      originalPrice: 8999,
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop'
      ],
      rating: 4.8,
      sales: 12500,
      stock: 150,
      tags: ['新品', '热销', '官方旗舰'],
      detailHtml: `
        <div style="padding: 16px;">
          <h3>商品详情</h3>
          <p>iPhone 15 Pro 采用航空级钛金属设计，iPhone 上迄今最轻的 Pro 机型。新的操作按钮让你能快速操作相机、手电筒、语音备忘录、专注模式、翻译 app 以及辅助功能等。</p>
          
          <h4>主要特性：</h4>
          <ul>
            <li>A17 Pro 芯片，性能大幅提升</li>
            <li>钛金属机身，更轻更坚固</li>
            <li>4800 万像素主摄像头</li>
            <li>USB-C 接口，充电更快</li>
            <li>全天候显示屏</li>
          </ul>
          
          <img src="https://via.placeholder.com/600x400?text=iPhone+15+Pro+Detail" style="width: 100%; margin: 16px 0;" />
          
          <h4>技术规格：</h4>
          <p>屏幕：6.1 英寸超视网膜 XDR 显示屏</p>
          <p>芯片：A17 Pro 芯片</p>
          <p>摄像头：4800 万像素主摄 + 1200 万像素超广角 + 1200 万像素长焦</p>
          <p>电池：视频播放最长可达 23 小时</p>
        </div>
      `,
      specifications: [
        { name: '品牌', value: 'Apple' },
        { name: '型号', value: 'iPhone 15 Pro' },
        { name: '屏幕尺寸', value: '6.1英寸' },
        { name: '分辨率', value: '2556x1179像素' },
        { name: '处理器', value: 'A17 Pro芯片' },
        { name: '内存', value: '8GB' },
        { name: '存储', value: '128GB/256GB/512GB/1TB' },
        { name: '摄像头', value: '4800万像素三摄' },
        { name: '电池容量', value: '3274mAh' },
        { name: '操作系统', value: 'iOS 17' }
      ],
      reviews: [
        {
          id: 1,
          userName: '数码爱好者',
          rating: 5,
          content: '手机非常流畅，拍照效果很棒，电池续航也很满意！',
          createTime: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          userName: '科技达人',
          rating: 4,
          content: '钛金属手感很好，就是价格有点高，但性能确实强大。',
          createTime: '2024-01-14T16:45:00Z'
        },
        {
          id: 3,
          userName: '果粉',
          rating: 5,
          content: '一如既往的优秀，iOS系统用起来很舒服，推荐购买！',
          createTime: '2024-01-13T09:20:00Z'
        }
      ]
    },
    '2': {
      id: 2,
      name: 'MacBook Pro 14英寸',
      description: '搭载M3芯片的MacBook Pro，性能强劲，专业之选',
      price: 12999,
      originalPrice: 14999,
      images: [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'
      ],
      rating: 4.9,
      sales: 8500,
      stock: 80,
      tags: ['专业', '高性能', '创意工作'],
      detailHtml: `
        <div style="padding: 16px;">
          <h3>MacBook Pro 14英寸</h3>
          <p>为专业工作流程打造的强大笔记本电脑，配备M3芯片， Liquid 视网膜 XDR 显示屏。</p>
          
          <h4>主要特性：</h4>
          <ul>
            <li>M3芯片，性能提升最高达2.5倍</li>
            <li>Liquid 视网膜 XDR 显示屏</li>
            <li>最长22小时电池续航</li>
            <li>1080p FaceTime 高清摄像头</li>
            <li>六扬声器音响系统</li>
          </ul>
        </div>
      `,
      specifications: [
        { name: '品牌', value: 'Apple' },
        { name: '型号', value: 'MacBook Pro 14英寸' },
        { name: '屏幕尺寸', value: '14.2英寸' },
        { name: '芯片', value: 'Apple M3芯片' },
        { name: '内存', value: '8GB/16GB/24GB' },
        { name: '存储', value: '512GB/1TB/2TB' },
        { name: '重量', value: '1.55千克' }
      ],
      reviews: [
        {
          id: 1,
          userName: '设计师',
          rating: 5,
          content: '做设计工作非常流畅，屏幕色彩准确，强烈推荐！',
          createTime: '2024-01-12T14:20:00Z'
        }
      ]
    },
    '3': {
      id: 3,
      name: 'AirPods Pro (第2代)',
      description: '主动降噪，空间音频，MagSafe充电盒',
      price: 1899,
      originalPrice: 1999,
      images: [
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop'
      ],
      rating: 4.7,
      sales: 35600,
      stock: 250,
      tags: ['无线', '降噪', '苹果生态'],
      detailHtml: `
        <div style="padding: 16px;">
          <h3>AirPods Pro (第2代)</h3>
          <p>升级的H2芯片带来更出色的音频体验，主动降噪效果提升2倍。</p>
        </div>
      `,
      specifications: [
        { name: '品牌', value: 'Apple' },
        { name: '型号', value: 'AirPods Pro (第2代)' },
        { name: '类型', value: '真无线耳机' },
        { name: '降噪', value: '主动降噪' },
        { name: '续航', value: '最长30小时' },
        { name: '充电', value: 'MagSafe充电' }
      ],
      reviews: [
        {
          id: 1,
          userName: '音乐爱好者',
          rating: 5,
          content: '降噪效果非常好，音质也很棒，佩戴舒适！',
          createTime: '2024-01-10T11:15:00Z'
        }
      ]
    }
  }
  
  return products[productId.value as keyof typeof products] || products['1']
})

// 事件处理
const handleAddToCart = (product: any, quantity: number, specs: string[]) => {
  console.log('加入购物车:', { product, quantity, specs })
  showToast(`已添加 ${quantity} 件商品到购物车`)
}

const handleBuyNow = (product: any, quantity: number, specs: string[]) => {
  console.log('立即购买:', { product, quantity, specs })
  showToast('跳转到订单确认页面')
}

const handleFavoriteChange = (product: any, isFavorite: boolean) => {
  console.log('收藏状态变更:', { product, isFavorite })
}

const handleShare = (product: any) => {
  console.log('分享商品:', product)
  showToast('分享功能已触发')
}

const handleCustomerService = (product: any) => {
  console.log('联系客服:', product)
  showToast('正在联系客服...')
}

const handleTabChange = (index: number, tabName: string) => {
  console.log('Tab切换:', index, tabName)
}

const handleSpecsChange = (specs: string[]) => {
  console.log('规格变更:', specs)
}

const handleSpecsConfirm = (specs: string[]) => {
  console.log('规格确认:', specs)
}

onMounted(() => {
  console.log('商品详情页面加载完成，商品ID:', productId.value)
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .product-detail-page {
    background: #1a1a1a;
  }
}
</style>