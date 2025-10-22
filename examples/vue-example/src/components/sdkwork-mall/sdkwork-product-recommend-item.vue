<template>
  <div class="recommend-product">
    <img :src="product.resources?.images?.[0]?.url" :alt="product.title" class="product-image" />
    <div class="product-info">
      <h4 class="product-name">{{ product.title }}</h4>
      <div class="product-price">
        <span class="current-price">¥{{ product.price }}</span>
        <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</span>
      </div>
      <div class="product-tags">
        <van-tag 
          v-for="tag in product.tags?.tags?.slice(0, 2)" 
          :key="tag"
          type="primary"  
        >
          {{ tag }}
        </van-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductVO } from '@/services'

interface Props {
  product: ProductVO
}

const props = defineProps<Props>()
</script>

<style scoped lang="scss">
.recommend-product { 
  width: 100%;
  
  .product-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 8px;
    display: block;
  }
  
  .product-info {
    .product-name {
      font-size: 14px;
      font-weight: 500;
      margin: 0 0 6px 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-align: left;
    }
    
    .product-price {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
      
      .current-price {
        font-size: 16px;
        font-weight: 600;
        color: #ee0a24;
      }
      
      .original-price {
        font-size: 12px;
        color: #969799;
        text-decoration: line-through;
      }
    }
    
    .product-tags {
      display: flex;
      gap: 4px;
    }
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .recommend-product {
    .product-name {
      color: white;
    }
  }
}
</style>