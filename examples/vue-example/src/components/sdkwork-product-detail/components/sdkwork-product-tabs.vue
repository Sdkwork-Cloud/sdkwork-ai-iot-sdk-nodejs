<template>
  <div class="sdkwork-product-tabs">
    <van-tabs 
      v-model:active="activeTab" 
      sticky 
      animated
      :color="themeMode === 'dark' ? '#1989fa' : '#1989fa'"
    >
      <!-- 商品详情 -->
      <van-tab title="商品详情">
        <div class="detail-content">
          <div v-if="product.detailHtml" v-html="product.detailHtml"></div>
          <div v-else class="no-detail">
            <van-empty description="暂无商品详情" />
          </div>
        </div>
      </van-tab>
      
      <!-- 规格参数 -->
      <van-tab title="规格参数">
        <div class="spec-content">
          <sdkwork-cell-group>
            <sdkwork-cell 
              v-for="spec in product.specifications" 
              :key="spec.name"
              :title="spec.name" 
              :value="spec.value"
            />
          </sdkwork-cell-group>
          
          <div v-if="!product.specifications || product.specifications.length === 0" class="no-spec">
            <van-empty description="暂无规格参数" />
          </div>
        </div>
      </van-tab>
      
      <!-- 用户评价 -->
      <van-tab title="用户评价">
        <div class="review-content">
          <div v-if="product.reviews && product.reviews.length > 0" class="reviews-list">
            <div 
              v-for="review in product.reviews" 
              :key="review.id"
              class="review-item"
            >
              <div class="review-header">
                <div class="review-user">{{ review.userName }}</div>
                <div class="review-rating">★ {{ review.rating }}</div>
              </div>
              <div class="review-content">{{ review.content }}</div>
              <div class="review-time">{{ formatTime(review.createTime) }}</div>
            </div>
          </div>
          <div v-else class="no-reviews">
            <van-empty description="暂无用户评价" />
          </div>
        </div>
      </van-tab>
      
      <!-- 售后服务 -->
      <van-tab title="售后服务">
        <div class="service-content">
          <sdkwork-cell-group>
            <sdkwork-cell title="七天无理由退货" value="支持" />
            <sdkwork-cell title="质量问题包退换" value="支持" />
            <sdkwork-cell title="全国联保" value="支持" />
            <sdkwork-cell title="上门安装" value="部分地区支持" />
          </sdkwork-cell-group>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SdkworkCell from '../../sdkwork-cell/sdkwork-cell.vue'
import SdkworkCellGroup from '../../sdkwork-cell-group/sdkwork-cell-group.vue'

// 商品数据类型
interface Product {
  id: string | number
  name: string
  detailHtml?: string
  specifications?: Array<{ name: string; value: string }>
  reviews?: Array<{
    id: string | number
    userName: string
    rating: number
    content: string
    createTime: string
  }>
}

// 组件属性
interface Props {
  /** 商品数据 */
  product: Product
  /** 主题模式 */
  themeMode?: 'dark' | 'light' | 'auto'
  /** 默认激活的Tab索引 */
  defaultActiveTab?: number
}

const props = withDefaults(defineProps<Props>(), {
  themeMode: 'auto',
  defaultActiveTab: 0
})

// 事件定义
interface Emits {
  (e: 'tab-change', index: number, tabName: string): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const activeTab = ref(props.defaultActiveTab)

// Tab名称映射
const tabNames = ['商品详情', '规格参数', '用户评价', '售后服务']

// 方法
const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleDateString()
}

// 监听Tab变化
const handleTabChange = (index: number) => {
  emit('tab-change', index, tabNames[index])
}

// 暴露方法
defineExpose({
  /** 切换到指定Tab */
  switchTab: (tabIndex: number) => {
    if (tabIndex >= 0 && tabIndex <= 3) {
      activeTab.value = tabIndex
      handleTabChange(tabIndex)
    }
  },
  
  /** 获取当前激活的Tab */
  getActiveTab: () => ({
    index: activeTab.value,
    name: tabNames[activeTab.value]
  }),
  
  /** 获取Tab数量 */
  getTabCount: () => tabNames.length
})
</script>

<style scoped lang="scss">
.sdkwork-product-tabs {
  background: var(--sdkwork-product-tabs-background, #fff);
  
  .detail-content, .spec-content, .review-content, .service-content {
    padding: 16px;
    min-height: 200px;
    
    .no-detail, .no-spec, .no-reviews {
      text-align: center;
      padding: 40px 0;
    }
  }
  
  .review-item {
    padding: 12px 0;
    border-bottom: 1px solid var(--sdkwork-product-review-border, #f0f0f0);
    
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .review-user {
        font-weight: 500;
        color: var(--sdkwork-product-review-user-color, #333);
      }
      
      .review-rating {
        color: var(--sdkwork-product-review-rating-color, #ff9500);
      }
    }
    
    .review-content {
      color: var(--sdkwork-product-review-content-color, #666);
      line-height: 1.5;
      margin-bottom: 8px;
    }
    
    .review-time {
      font-size: 12px;
      color: var(--sdkwork-product-review-time-color, #999);
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-product-tabs {
    .detail-content, .spec-content, .review-content, .service-content {
      padding: 12px;
      min-height: 150px;
    }
  }
}
</style>