<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto"
  > 

    <div class="favorites-container">
      <van-empty
        image="search"
        description="暂无收藏内容"
        v-if="favorites.length === 0"
      >
        <van-button round type="primary" @click="goToHome">
          去发现内容
        </van-button>
      </van-empty>

      <div v-else class="favorites-list">
        <van-card
          v-for="item in favorites"
          :key="item.id"
          :price="item.price"
          :desc="item.description"
          :title="item.title"
          :thumb="item.thumb"
          :lazy-load="true"
        >
          <template #tags>
            <van-tag
              v-for="tag in item.tags"
              :key="tag"
              type="primary" 
            >
              {{ tag }}
            </van-tag>
          </template>
          <template #footer>
            <van-button size="small" @click="handleView(item)">查看</van-button>
            <van-button size="small" type="danger" @click="handleRemove(item.id)">取消收藏</van-button>
          </template>
        </van-card>
      </div>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
definePage({
    meta: {
        title: '收藏',
        hideBackButton: true
    }
})
const router = useRouter()

// 收藏列表数据
const favorites = ref<any[]>([])

// 模拟收藏数据
const mockFavorites = [
  {
    id: 1,
    title: 'AI绘画作品 - 山水风景',
    description: '使用AI技术创作的山水风景画',
    price: '免费',
    thumb: '/images/placeholder.jpg',
    tags: ['绘画', '风景', 'AI']
  },
  {
    id: 2,
    title: '智能语音助手',
    description: '多功能智能语音助手应用',
    price: '¥29.9',
    thumb: '/images/placeholder.jpg',
    tags: ['语音', '助手', '智能']
  }
]

// 页面加载时获取收藏数据
onMounted(() => {
  // 模拟异步获取数据
  setTimeout(() => {
    favorites.value = mockFavorites
  }, 500)
})

// 查看收藏项详情
const handleView = (item: any) => {
  showToast(`查看收藏：${item.title}`)
  // 这里可以根据实际业务跳转到对应详情页
}

// 取消收藏
const handleRemove = (id: number) => {
  favorites.value = favorites.value.filter(item => item.id !== id)
  showToast('已取消收藏')
}

// 跳转到首页
const goToHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.favorites-container {
  padding: 16px;
  min-height: 400px;
}

.favorites-list {
  .van-card {
    margin-bottom: 16px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>