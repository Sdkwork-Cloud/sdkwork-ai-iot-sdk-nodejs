<template>
  <van-popup
    v-model:show="show"
    position="bottom"
    :style="{ height: '100%' }"
    round
  >
    <div class="style-popup">
      <!-- 头部 -->
      <div class="popup-header">
        <van-button
          type="default"
          size="small"
          @click="handleCancel"
          class="cancel-btn"
        >
          取消
        </van-button>
        <div class="header-title">选择视频风格</div>
        <van-button
          type="primary"
          size="small"
          @click="handleConfirm"
          :disabled="!selectedStyle"
          class="confirm-btn"
        >
          确认选择
        </van-button>
      </div>

      <!-- 内容区域 -->
      <div class="popup-content">
        <div class="style-list">
          <div 
            v-for="style in styles" 
            :key="style.id"
            class="style-item"
            :class="{ 'selected': selectedStyle?.id === style.id }"
            @click="selectStyle(style)"
          >
            <div class="style-thumbnail">
              <img :src="style.thumbnail" :alt="style.name" />
            </div>
            <div class="style-info">
              <h4 class="style-name">{{ style.name }}</h4>
              <p class="style-description">{{ style.description }}</p>
            </div>
            <div class="style-check">
              <van-icon v-if="selectedStyle?.id === style.id" name="success" color="#1890ff" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface VideoStyle {
  id: string
  name: string
  description: string
  thumbnail: string
}

interface Props {
  modelValue: boolean
  selectedStyle?: VideoStyle
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', style: VideoStyle): void
  (e: 'select', style: VideoStyle): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 本地弹窗状态
const show = ref(props.modelValue)
const selectedStyle = ref<VideoStyle | null>(props.selectedStyle || null)

// 预定义的视频风格列表
const styles = ref<VideoStyle[]>([
  {
    id: 'professional',
    name: '商务专业',
    description: '适合商务演示、产品介绍等正式场合',
    thumbnail: 'https://picsum.photos/seed/professional-style/200/120.jpg'
  },
  {
    id: 'education',
    name: '教育培训',
    description: '适合教学演示、知识分享等教育场景',
    thumbnail: 'https://picsum.photos/seed/education-style/200/120.jpg'
  },
  {
    id: 'technology',
    name: '科技现代',
    description: '适合科技产品、创新项目等前沿领域',
    thumbnail: 'https://picsum.photos/seed/technology-style/200/120.jpg'
  },
  {
    id: 'creative',
    name: '创意艺术',
    description: '适合创意设计、艺术作品等视觉展示',
    thumbnail: 'https://picsum.photos/seed/creative-style/200/120.jpg'
  },
  {
    id: 'minimalist',
    name: '简约清新',
    description: '适合极简设计、清新风格等简约主题',
    thumbnail: 'https://picsum.photos/seed/minimalist-style/200/120.jpg'
  },
  {
    id: 'dynamic',
    name: '动感活力',
    description: '适合活力展示、运动主题等动感内容',
    thumbnail: 'https://picsum.photos/seed/dynamic-style/200/120.jpg'
  }
])

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  show.value = newVal
  if (newVal && props.selectedStyle) {
    selectedStyle.value = props.selectedStyle
  }
})

// 监听本地状态变化并通知父组件
watch(show, (newVal) => {
  emit('update:modelValue', newVal)
})

// 选择风格
const selectStyle = (style: VideoStyle) => {
  selectedStyle.value = style
  emit('select', style)
}

// 取消选择
const handleCancel = () => {
  show.value = false
  // 恢复初始选择
  if (props.selectedStyle) {
    selectedStyle.value = props.selectedStyle
  }
}

// 确认选择
const handleConfirm = () => {
  if (selectedStyle.value) {
    emit('confirm', selectedStyle.value)
    show.value = false
  }
}
</script>

<style scoped>
.style-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  text-align: center;
}

.cancel-btn {
  margin-right: 8px;
}

.confirm-btn {
  margin-left: 8px;
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  height: 0;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
}

.style-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.style-item {
  display: flex;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.style-item:hover {
  border-color: #1890ff;
  box-shadow: 0 0 8px rgba(24, 144, 255, 0.2);
}

.style-item.selected {
  border-color: #1890ff;
  background-color: #f0f9ff;
}

.style-thumbnail {
  width: 100px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 12px;
}

.style-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.style-info {
  flex: 1;
}

.style-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.style-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.style-check {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .popup-header {
    border-bottom-color: #2d3a4e;
  }
  
  .header-title {
    color: #ffffff;
  }
  
  .style-item {
    background-color: #1e2a3d;
    border-color: #2d3a4e;
  }
  
  .style-item:hover {
    border-color: #1890ff;
    box-shadow: 0 0 8px rgba(24, 144, 255, 0.3);
  }
  
  .style-item.selected {
    background-color: #1a2438;
    border-color: #1890ff;
  }
  
  .style-name {
    color: #ffffff;
  }
  
  .style-description {
    color: #8fa3c4;
  }
}
</style>