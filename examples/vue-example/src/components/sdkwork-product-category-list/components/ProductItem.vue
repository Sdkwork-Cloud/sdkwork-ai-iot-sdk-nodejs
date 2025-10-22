<template>
  <div
    class="product-item"
    :class="{ 'selected': selected, 'soldout': product.status === 'soldout' }"
    @click="handleSelect"
  >
    <!-- 商品图片 -->
    <div class="product-image">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        @error="handleImageError"
      />
      <div v-else class="image-placeholder">
        <van-icon name="photo-o" />
      </div>
      <!-- 商品标签 -->
      <div v-if="product.tags && product.tags.length > 0" class="product-tags">
        <span
          v-for="tag in product.tags.slice(0, 2)"
          :key="tag"
          class="product-tag"
        >
          {{ tag }}
        </span>
      </div>
      <!-- 售罄遮罩 -->
      <div v-if="product.status === 'soldout'" class="soldout-overlay">
        已售罄
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="product-info">
      <!-- 商品名称 -->
      <h3 class="product-name">{{ product.name }}</h3>
      
      <!-- 商品描述 -->
      <p v-if="product.description" class="product-description">
        {{ product.description }}
      </p>

      <!-- 价格信息 -->
      <div class="product-price">
        <span class="current-price">¥{{ product.price }}</span>
        <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
          ¥{{ product.originalPrice }}
        </span>
      </div>

      <!-- 商品评价和销量 -->
      <div class="product-meta">
        <span v-if="product.rating" class="product-rating">
          <van-icon name="star" />
          {{ product.rating }}
        </span>
        <span v-if="product.sales" class="product-sales">
          已售{{ product.sales }}
        </span>
        <span class="product-stock" :class="{ 'low-stock': product.stock < 10 }">
          库存{{ product.stock }}
        </span>
      </div>

      <!-- 操作按钮 -->
      <div class="product-actions">
        <van-button
          v-if="deletable"
          
          type="danger"
          plain
          @click.stop="handleDelete"
        >
          删除
        </van-button>
        <van-button
          v-else-if="product.status !== 'soldout'"
          
          type="primary"
          @click.stop="handleAddToCart"
        >
          加入购物车
        </van-button>
      </div>
    </div>

    <!-- 选择框 -->
    <div v-if="selectable" class="product-selector">
      <van-checkbox :model-value="selected" @click.stop="handleSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 商品数据类型
interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
  categoryId: string | number
  stock: number
  status: 'active' | 'inactive' | 'soldout'
  tags?: string[]
  rating?: number
  sales?: number
  [key: string]: any
}

// 组件属性
interface Props {
  product: Product
  index: number
  selected?: boolean
  selectable?: boolean
  deletable?: boolean
}

// 事件定义
interface Emits {
  (e: 'select', product: Product): void
  (e: 'delete', product: Product): void
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  selectable: false,
  deletable: false
})

const emit = defineEmits<Emits>()

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  img.nextElementSibling?.classList.remove('image-placeholder')
}

// 选择商品
const handleSelect = () => {
  if (props.selectable) {
    emit('select', props.product)
  }
}

// 删除商品
const handleDelete = () => {
  if (props.deletable) {
    emit('delete', props.product)
  }
}

// 加入购物车
const handleAddToCart = () => {
  // 这里可以触发加入购物车事件
  console.log('加入购物车:', props.product)
}
</script>

<style scoped>
.product-item {
  display: flex;
  padding-top: 12px;
  padding-bottom: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #f0f0f0;
}

.product-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.product-item.selected {
  border-color: #1989fa;
  background: #f0f8ff;
}

.product-item.soldout {
  opacity: 0.6;
}

/* 商品图片区域 */
.product-image {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  margin-right: 12px;
  border-radius: 6px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #ccc;
  font-size: 24px;
}

.product-tags {
  position: absolute;
  top: 4px;
  left: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-tag {
  background: #ff4444;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 2px;
  white-space: nowrap;
}

.soldout-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* 商品信息区域 */
.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.current-price {
  font-size: 16px;
  font-weight: bold;
  color: #ff4444;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #999;
  margin-bottom: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 2px;
}

.product-rating .van-icon {
  color: #ffb400;
  font-size: 10px;
}

.low-stock {
  color: #ff4444;
  font-weight: bold;
}

.product-actions {
  display: flex;
  gap: 8px;
}

/* 选择框 */
.product-selector {
  display: flex;
  align-items: flex-start;
  padding-left: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-item {
    padding: 10px;
  }

  .product-image {
    width: 70px;
    height: 70px;
  }

  .product-name {
    font-size: 13px;
  }

  .current-price {
    font-size: 15px;
  }
}
</style>