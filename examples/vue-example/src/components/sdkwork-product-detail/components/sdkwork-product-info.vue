<template>
  <div class="sdkwork-product-info">
    <div class="product-header">
      <div class="product-title">{{ product.name }}</div>
      <div class="product-subtitle">{{ product.description }}</div>
    </div>
    
    <div class="price-section">
      <div class="current-price">¥{{ product.price }}</div>
      <div v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</div>
      <div v-if="product.originalPrice" class="discount">
        {{ calculateDiscount(product.price, product.originalPrice) }}折
      </div>
    </div>
    
    <div class="meta-info">
      <van-tag v-if="product.rating" type="primary" class="rating-tag">
        ★ {{ product.rating }}
      </van-tag>
      <van-tag v-if="product.sales" type="success" class="sales-tag">
        销量 {{ product.sales }}
      </van-tag>
      <van-tag v-if="product.stock" :type="product.stock > 10 ? 'success' : 'danger'" class="stock-tag">
        库存 {{ product.stock }}
      </van-tag>
    </div>
    
    <div v-if="product.tags && product.tags.length > 0" class="tags-section">
      <van-tag 
        v-for="tag in product.tags" 
        :key="tag"
        plain 
        type="primary"
        
        class="product-tag"
      >
        {{ tag }}
      </van-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
// 商品数据类型
interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  originalPrice?: number
  rating?: number
  sales?: number
  stock?: number
  tags?: string[]
}

// 组件属性
interface Props {
  /** 商品数据 */
  product: Product
}

const props = defineProps<Props>()

// 计算折扣
const calculateDiscount = (currentPrice: number, originalPrice: number) => {
  return Math.round((currentPrice / originalPrice) * 100) / 10
}

// 暴露方法
defineExpose({
  /** 获取商品基本信息 */
  getProductInfo: () => props.product,
  /** 计算折扣信息 */
  getDiscountInfo: () => {
    if (!props.product.originalPrice) return null
    return {
      discount: calculateDiscount(props.product.price, props.product.originalPrice),
      saveAmount: props.product.originalPrice - props.product.price
    }
  }
})
</script>

<style scoped lang="scss">
.sdkwork-product-info {
  background: var(--sdkwork-product-info-background, #fff);
  padding: 16px;
  
  .product-header {
    margin-bottom: 12px;
    
    .product-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--sdkwork-product-info-title-color, #333);
      line-height: 1.4;
      margin-bottom: 4px;
    }
    
    .product-subtitle {
      font-size: 14px;
      color: var(--sdkwork-product-info-subtitle-color, #666);
      line-height: 1.4;
    }
  }
  
  .price-section {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    .current-price {
      font-size: 24px;
      font-weight: 600;
      color: var(--sdkwork-product-info-price-color, #ff4444);
    }
    
    .original-price {
      font-size: 16px;
      color: var(--sdkwork-product-info-original-price-color, #999);
      text-decoration: line-through;
    }
    
    .discount {
      background: var(--sdkwork-product-info-discount-background, #ff4444);
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
    }
  }
  
  .meta-info {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    
    .rating-tag, .sales-tag, .stock-tag {
      font-size: 12px;
    }
  }
  
  .tags-section {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .product-tag {
      margin: 0;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-product-info {
    padding: 12px;
    
    .product-title {
      font-size: 16px;
    }
    
    .current-price {
      font-size: 20px;
    }
  }
}
</style>