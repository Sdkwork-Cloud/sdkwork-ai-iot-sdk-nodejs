<template>
  <div
    class="product-grid-item"
    :class="{
      'product-grid-item--selected': selected,
      'product-grid-item--selectable': selectable,
      'product-grid-item--deletable': deletable
    }"
    @click="handleClick"
  >
    <!-- 选择框 -->
    <div v-if="selectable" class="selection-overlay">
      <van-checkbox 
        :model-value="selected" 
        @update:model-value="handleSelectionChange"
        @click.stop
        class="selection-checkbox"
      />
    </div>

    <!-- 删除按钮 -->
    <div v-if="deletable" class="delete-overlay">
      <van-button
        type="danger"
        
        round
        @click.stop="handleDelete"
        class="delete-button"
      >
        <van-icon name="cross" />
      </van-button>
    </div>

    <!-- 商品图片 -->
    <div class="product-image">
      <van-image
        :src="product.image"
        width="100%"
        height="120"
        fit="cover"
        radius="4"
        lazy-load
      >
        <template v-slot:error>
          <div class="image-placeholder">
            <van-icon name="photo-o" size="24" color="#c8c9cc" />
          </div>
        </template>
        
        <!-- 商品标签 -->
        <template v-slot:loading>
          <van-loading type="spinner" size="20px" />
        </template>
      </van-image>

      <!-- 商品状态标签 -->
      <div v-if="product.tags && product.tags.length" class="product-tags">
        <van-tag 
          v-for="tag in product.tags" 
          :key="tag"
          :type="getTagType(tag)"
          
          class="product-tag"
        >
          {{ tag }}
        </van-tag>
      </div>

      <!-- 库存预警 -->
      <div v-if="product.stock < 10" class="stock-warning">
        仅剩{{ product.stock }}件
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="product-info">
      <!-- 商品名称 -->
      <div class="product-name" :title="product.name">
        {{ product.name }}
      </div>

      <!-- 商品描述 -->
      <div v-if="product.description" class="product-description">
        {{ product.description }}
      </div>

      <!-- 价格信息 -->
      <div class="price-section">
        <span class="current-price">¥{{ product.price }}</span>
        <span v-if="product.originalPrice" class="original-price">
          ¥{{ product.originalPrice }}
        </span>
        <span v-if="product.discount" class="discount">
          {{ product.discount }}折
        </span>
      </div>

      <!-- 销售信息 -->
      <div class="sales-info">
        <van-rate 
          v-model="product.rating" 
          readonly 
          size="12" 
          color="#ffd21e"
          void-color="#c8c9cc"
        />
        <span class="sales-count">售{{ product.sales }}</span>
      </div>

      <!-- 店铺信息 -->
      <div v-if="product.store" class="store-info">
        <van-icon name="shop-o" size="12" />
        <span class="store-name">{{ product.store }}</span>
      </div>

      <!-- 配送信息 -->
      <div v-if="product.delivery" class="delivery-info">
        <van-tag plain type="primary" >
          {{ product.delivery }}
        </van-tag>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <van-button 
        v-if="product.stock > 0"
        type="primary" 
         
        round
        @click.stop="handleAddToCart"
        class="add-cart-btn"
      >
        <van-icon name="shopping-cart-o" size="14" />
        加入购物车
      </van-button>
      
      <van-button 
        v-else
        type="default" 
         
        round
        disabled
        class="sold-out-btn"
      >
        已售罄
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../mock-data'

// 属性定义
interface Props {
  product: Product
  index: number
  selected: boolean
  selectable?: boolean
  deletable?: boolean
}

// 事件定义
interface Emits {
  (e: 'select', product: Product): void
  (e: 'delete', product: Product): void
  (e: 'click', product: Product): void
  (e: 'add-to-cart', product: Product): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false
})

const emit = defineEmits<Emits>()

// 计算属性
const isNewProduct = computed(() => {
  return props.product.tags?.includes('新品') || false
})

const isHotProduct = computed(() => {
  return props.product.tags?.includes('热销') || false
})

// 事件处理
const handleSelectionChange = (selected: boolean) => {
  if (props.selectable) {
    emit('select', props.product)
  }
}

const handleClick = () => {
  if (props.selectable) {
    handleSelectionChange(!props.selected)
  } else {
    emit('click', props.product)
  }
}

const handleDelete = () => {
  if (props.deletable) {
    emit('delete', props.product)
  }
}

const handleAddToCart = () => {
  emit('add-to-cart', props.product)
}

// 获取标签类型
const getTagType = (tag: string) => {
  const tagTypes: Record<string, any> = {
    '新品': 'success',
    '热销': 'danger',
    '推荐': 'warning',
    '限时': 'primary'
  }
  return tagTypes[tag] || 'default'
}
</script>

<style scoped lang="scss">
.product-grid-item {
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  &--selected {
    border-color: var(--van-primary-color);
    background: rgba(var(--van-primary-color-rgb), 0.03);
  }

  &--selectable {
    cursor: pointer;
  }

  &--deletable {
    cursor: pointer;
  }
}

.selection-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
}

.selection-checkbox {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.delete-button {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
  }
}

.product-image {
  position: relative;

  .image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    background: #f5f5f5;
  }

  .product-tags {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stock-warning {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(255, 68, 68, 0.9);
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 11px;
  }
}

.product-info {
  padding: 12px;

  .product-name {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #323233;
  }

  .product-description {
    font-size: 12px;
    color: #969799;
    line-height: 1.3;
    margin-bottom: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .price-section {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;

    .current-price {
      font-size: 16px;
      font-weight: bold;
      color: #ee0a24;
    }

    .original-price {
      font-size: 12px;
      color: #969799;
      text-decoration: line-through;
    }

    .discount {
      font-size: 11px;
      color: #ff976a;
      background: #fff2e8;
      padding: 1px 4px;
      border-radius: 2px;
    }
  }

  .sales-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    .sales-count {
      font-size: 11px;
      color: #969799;
    }
  }

  .store-info {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 6px;

    .store-name {
      font-size: 11px;
      color: #646566;
    }
  }

  .delivery-info {
    margin-bottom: 8px;
  }
}

.action-buttons {
  padding: 0 12px 12px;

  .add-cart-btn,
  .sold-out-btn {
    width: 100%;
    border-radius: 16px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-grid-item {
    border-radius: 6px;
  }

  .product-info {
    padding: 10px;

    .product-name {
      font-size: 13px;
    }

    .price-section {
      .current-price {
        font-size: 15px;
      }
    }
  }

  .action-buttons {
    padding: 0 10px 10px;
  }
}

@media (min-width: 1024px) {
  .product-grid-item {
    border-radius: 10px;
  }

  .product-info {
    padding: 16px;

    .product-name {
      font-size: 15px;
    }
  }

  .action-buttons {
    padding: 0 16px 16px;
  }
}
</style>