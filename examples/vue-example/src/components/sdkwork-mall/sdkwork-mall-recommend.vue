<template>
  <sdkwork-section title="热门推荐" :bordered="false" contentPadding="0px"> 
    <!-- 推荐商品网格 -->
    <sdkwork-grid
      :columns="columns"
      :gutter="gutter"
      :bordered="bordered"
      theme-mode="auto"
      contentPadding="5px"
    >
      <sdkwork-grid-item
        v-for="product in products"
        :key="product.id"
        :clickable="true"
        @click="handleProductClick(product)"
        :customStyle="{
          padding: '0px'
        }"
      >
        <sdkwork-product-recommend-item :product="product" />
      </sdkwork-grid-item>
    </sdkwork-grid>
  </sdkwork-section>
</template>

<script setup lang="ts">
import { ProductVO } from '@/services'
import SdkworkProductRecommendItem from './sdkwork-product-recommend-item.vue'

 

interface Props {
  products: ProductVO[]
  title?: string
  viewAllText?: string
  columns?: number
  gutter?: number
  bordered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '热门推荐',
  viewAllText: '查看全部',
  columns: 2,
  gutter: 5,
  bordered: false
})

const emit = defineEmits<{
  viewAll: []
  productClick: [product: ProductVO]
}>()
 

const handleProductClick = (product: ProductVO) => {
  emit('productClick', product)
}
</script>

<style scoped lang="scss">
.recommend-section { 
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: #333;
    }
  }
  
  .recommend-product { 
    
    .product-image {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 6px;
      margin-bottom: 8px;
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
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .recommend-section {
    .section-title {
      color: white;
    }
  }
}
</style>