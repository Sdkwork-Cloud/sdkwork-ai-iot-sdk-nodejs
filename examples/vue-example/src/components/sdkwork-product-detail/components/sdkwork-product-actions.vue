<template>
  <div class="sdkwork-product-actions">
    <div class="action-left">
      <van-button 
        square 
        size="small" 
        type="default"
        class="action-btn"
        @click="handleCustomerService"
      >
        <van-icon name="service-o" size="20" />
      </van-button>
      
      <van-button 
        square 
        size="small" 
        type="default"
        class="action-btn"
        @click="toggleFavorite"
      >
        <van-icon :name="isFavorite ? 'star' : 'star-o'" size="20" />
      </van-button>
      
      <van-button 
        square 
        size="small" 
        type="default"
        class="action-btn"
        @click="handleShare"
      >
        <van-icon name="share-o" size="20" />
      </van-button>
    </div>
    
    <div class="action-right">
      <van-button 
        type="warning" 
        size="small"
        class="cart-btn"
        @click="handleAddToCart"
      >
        加购物车
      </van-button>
      
      <van-button 
        type="danger" 
        size="small"
        class="buy-btn"
        @click="handleBuyNow"
      >
        立即购买
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 组件属性
interface Props {
  /** 是否已收藏 */
  isFavorite?: boolean
  /** 是否显示购物车按钮 */
  showCartButton?: boolean
  /** 是否显示购买按钮 */
  showBuyButton?: boolean
  /** 是否显示客服按钮 */
  showServiceButton?: boolean
  /** 是否显示收藏按钮 */
  showFavoriteButton?: boolean
  /** 是否显示分享按钮 */
  showShareButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isFavorite: false,
  showCartButton: true,
  showBuyButton: true,
  showServiceButton: true,
  showFavoriteButton: true,
  showShareButton: true
})

// 事件定义
interface Emits {
  (e: 'add-to-cart'): void
  (e: 'buy-now'): void
  (e: 'favorite-change', isFavorite: boolean): void
  (e: 'share'): void
  (e: 'customer-service'): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const isFavorite = ref(props.isFavorite)

// 方法
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('favorite-change', isFavorite.value)
}

const handleAddToCart = () => {
  emit('add-to-cart')
}

const handleBuyNow = () => {
  emit('buy-now')
}

const handleShare = () => {
  emit('share')
}

const handleCustomerService = () => {
  emit('customer-service')
}

// 暴露方法
defineExpose({
  /** 设置收藏状态 */
  setFavorite: (favorite: boolean) => {
    isFavorite.value = favorite
  },
  
  /** 获取收藏状态 */
  getFavorite: () => isFavorite.value,
  
  /** 触发加入购物车 */
  triggerAddToCart: () => handleAddToCart(),
  
  /** 触发立即购买 */
  triggerBuyNow: () => handleBuyNow()
})
</script>

<style scoped lang="scss">
.sdkwork-product-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--sdkwork-product-actions-background, #fff);
  border-top: 1px solid var(--sdkwork-product-actions-border, #f0f0f0);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  
  .action-left {
    display: flex;
    gap: 4px;
    
    .action-btn {
      height: 44px;
      min-width: 44px;
      
      :deep(.van-button__content) {
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    }
  }
  
  .action-right {
    display: flex;
    gap: 8px;
    
    .cart-btn, .buy-btn {
      height: 36px;
      font-weight: 500;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-product-actions {
    padding: 8px 12px;
    
    .action-btn {
      min-width: 40px;
    }
    
    .cart-btn, .buy-btn {
      height: 32px;
      font-size: 14px;
    }
  }
}
</style>