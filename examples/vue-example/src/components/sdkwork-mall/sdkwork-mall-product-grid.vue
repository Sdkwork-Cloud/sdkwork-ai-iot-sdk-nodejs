<template>
  <sdkwork-product-grid-list ref="productGridListRef" :filter-params="filterParams" :selectable="selectable"
    :deletable="deletable" :searchable="searchable" :page-size="pageSize" :columns="columns" :gap="gap"
    left-spacing="0px" right-spacing="0px" @select="handleProductSelect" @delete="handleProductDelete"
    @search="handleProductSearch" @load="handleProductLoad" @item-click="handleProductClick"
    @batch-operation="handleBatchOperation">
    <!-- 头部插槽 -->
    <template #header>
      <slot name="header" />
    </template>

    <!-- 自定义商品项插槽 -->
    <template #default="{ item, index, selected }">
      <div class="custom-product-item">
        <div class="product-card">
          <div class="product-image-container">
            <img :src="item.image" :alt="item.name" class="product-image" />
            <div v-if="item.discount" class="discount-badge">
              {{ item.discount }}折
            </div>
            <div v-if="item.tags?.includes('新品')" class="new-badge">
              新品
            </div>
          </div>

          <div class="product-content">
            <h4 class="product-name">{{ item.name }}</h4>
            <p v-if="item.description" class="product-desc">{{ item.description }}</p>

            <div class="product-meta">
              <div class="price-section">
                <span class="current-price">¥{{ item.price }}</span>
                <span v-if="item.originalPrice" class="original-price">¥{{ item.originalPrice }}</span>
              </div>

              <div class="rating-section">
                <van-rate v-model="item.rating" :size="12" readonly color="#ffd21e" />
                <span class="sales">已售{{ item.sales }}</span>
              </div>
            </div>

            <div class="store-info">
              <van-icon name="shop-o" size="12" />
              <span class="store-name">{{ item.store }}</span>
              <van-tag v-if="item.delivery" type="success" style="margin-right: 3px;">
                {{ item.delivery }}
              </van-tag>
            </div>
          </div>
        </div>
      </div>
    </template>
  </sdkwork-product-grid-list>
</template>

<script setup lang="ts">
import { ProductVO } from '@/services'
import { ref } from 'vue'

interface FilterParams {
  keyword?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  tags?: string[]
}

interface Props {
  filterParams: FilterParams
  selectable?: boolean
  deletable?: boolean
  searchable?: boolean
  pageSize?: number
  columns?: number
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false,
  searchable: false,
  pageSize: 12,
  columns: 2,
  gap: 12
})

const emit = defineEmits<{
  select: [product: ProductVO]
  delete: [product: ProductVO]
  search: [keyword: string]
  load: [pageData: any]
  itemClick: [product: ProductVO]
  batchOperation: [products: ProductVO[]]
}>()

const productGridListRef = ref()

const handleProductSelect = (product: ProductVO) => {
  emit('select', product)
}

const handleProductDelete = (product: ProductVO) => {
  emit('delete', product)
}

const handleProductSearch = (keyword: string) => {
  emit('search', keyword)
}

const handleProductLoad = (pageData: any) => {
  emit('load', pageData)
}

const handleProductClick = (product: ProductVO) => {
  emit('itemClick', product)
}

const handleBatchOperation = (products: ProductVO[]) => {
  emit('batchOperation', products)
}

// 暴露刷新方法给父组件
const refresh = () => {
  productGridListRef.value?.refresh()
}

defineExpose({
  refresh
})
</script>

<style scoped lang="scss">
:deep(.sdkwork-grid-item) {
  background: transparent !important;
  border: none !important;
}

.custom-product-item {
  .product-card {
    background: transparent !important;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: none !important;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }

    .product-image-container {
      position: relative;

      .product-image {
        width: 100%;
        height: 160px;
        object-fit: cover;
      }

      .discount-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background: #ee0a24;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
      }

      .new-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #1989fa;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
      }
    }

    .product-content {
      padding: 12px;

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

      .product-desc {
        font-size: 12px;
        color: #969799;
        margin: 0 0 8px 0;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-meta {
        margin-bottom: 8px;

        .price-section {
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

        .rating-section {
          display: flex;
          align-items: center;
          gap: 6px;

          .sales {
            font-size: 12px;
            color: #969799;
          }
        }
      }

      .store-info {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #969799;

        .store-name {
          flex: 1;
        }
      }
    }
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .custom-product-item {
    .product-card {
      background: #4a5568;

      .product-content {
        .product-name {
          color: white;
        }

        .product-desc {
          color: #a0aec0;
        }

        .store-info {
          color: #a0aec0;
        }
      }
    }
  }
}
</style>