<template>
  <div
    class="product-item"
    :class="{
      'product-item--selected': selected,
      'product-item--soldout': product.status === 'soldout',
      'product-item--low-stock': product.stock > 0 && product.stock < 10
    }"
    @click="handleClick"
  >
    <!-- 商品图片 -->
    <div class="product-image">
      <van-image
        width="80"
        height="80"
        :src="product.image || ''"
        fit="cover"
        radius="4"
      >
        <template v-slot:error>
          <van-icon name="photo-o" size="24" />
        </template>
        <template v-slot:loading>
          <van-loading type="spinner" size="20" />
        </template>
      </van-image>

      <!-- 售罄遮罩 -->
      <div v-if="product.status === 'soldout'" class="soldout-overlay">
        <span>已售罄</span>
      </div>

      <!-- 库存预警 -->
      <div v-else-if="product.stock > 0 && product.stock < 10" class="stock-warning">
        <van-tag type="warning" >仅剩{{ product.stock }}件</van-tag>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="product-info">
      <!-- 商品标题 -->
      <div class="product-title">
        <h4 class="title-text">{{ product.name }}</h4>
        <!-- 选择框 -->
        <van-checkbox 
          v-if="selectable" 
          v-model="selected" 
          @click.stop
          class="select-checkbox"
        />
      </div>

      <!-- 商品描述 -->
      <p v-if="product.description" class="product-description">
        {{ product.description }}
      </p>

      <!-- 商品标签 -->
      <div v-if="product.tags && product.tags.length > 0" class="product-tags">
        <van-tag
          v-for="tag in product.tags"
          :key="tag"
          type="primary"
          
        >
          {{ tag }}
        </van-tag>
      </div>

      <!-- 商品评价和销量 -->
      <div class="product-meta">
        <div v-if="product.rating" class="rating">
          <van-rate
            v-model="product.rating"
            readonly
            size="12"
            allow-half
            color="#ffd21e"
            void-color="#c8c9cc"
          />
          <span class="rating-text">{{ product.rating }}</span>
        </div>
        <div v-if="product.sales" class="sales">
          已售{{ product.sales }}件
        </div>
      </div>

      <!-- 价格信息 -->
      <div class="product-price">
        <span class="current-price">¥{{ product.price }}</span>
        <span v-if="product.originalPrice" class="original-price">
          ¥{{ product.originalPrice }}
        </span>
        <span v-if="product.originalPrice" class="discount">
          {{ calculateDiscount(product.price, product.originalPrice) }}折
        </span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="product-actions">
      <!-- 删除按钮 -->
      <van-button
        v-if="deletable"
        type="danger"
        
        @click.stop="handleDelete"
        class="delete-btn"
      >
        删除
      </van-button>

      <!-- 加入购物车按钮 -->
      <van-button
        v-else
        type="primary"
        
        @click.stop="handleAddToCart"
        :disabled="product.status === 'soldout'"
        class="add-cart-btn"
      >
        加入购物车
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 属性定义
interface Props {
  product: any
  index: number
  selected?: boolean
  selectable?: boolean
  deletable?: boolean
}

// 事件定义
interface Emits {
  (e: 'select', product: any): void
  (e: 'delete', product: any): void
  (e: 'add-to-cart', product: any): void
  (e: 'click', product: any): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false
})

const emit = defineEmits<Emits>()

// 计算属性
const selected = computed({
  get: () => props.selected || false,
  set: (value) => {
    if (props.selectable) {
      emit('select', props.product)
    }
  }
})

// 计算折扣
const calculateDiscount = (currentPrice: number, originalPrice: number): string => {
  const discount = (currentPrice / originalPrice) * 10
  return discount.toFixed(1)
}

// 事件处理
const handleClick = () => {
  emit('click', props.product)
}

const handleDelete = () => {
  if (props.deletable) {
    emit('delete', props.product)
  }
}

const handleAddToCart = () => {
  if (props.product.status !== 'soldout') {
    emit('add-to-cart', props.product)
  }
}
</script>

<style scoped>
.product-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.product-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-item--selected {
  border-color: #1989fa;
  background-color: #f0f8ff;
}

.product-item--soldout {
  opacity: 0.6;
}

.product-item--low-stock .stock-warning {
  display: block;
}

.product-image {
  position: relative;
  flex-shrink: 0;
  margin-right: 5px;
}

.soldout-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.stock-warning {
  position: absolute;
  bottom: 4px;
  left: 4px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.title-text {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #323233;
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.select-checkbox {
  flex-shrink: 0;
}

.product-description {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #969799;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-text {
  font-size: 12px;
  color: #ffd21e;
  font-weight: bold;
}

.sales {
  font-size: 12px;
  color: #969799;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 6px;
}

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
  color: #ee0a24;
  background: #ffeaea;
  padding: 1px 4px;
  border-radius: 2px;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
}

.delete-btn,
.add-cart-btn {
  min-width: 60px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-item {
    padding: 10px;
    gap: 10px;
  }

  .product-image {
    width: 70px;
    height: 70px;
  }

  .title-text {
    font-size: 13px;
  }

  .current-price {
    font-size: 14px;
  }

  .product-actions {
    flex-direction: row;
  }

  .delete-btn,
  .add-cart-btn {
    min-width: auto;
    flex: 1;
  }
}
</style>