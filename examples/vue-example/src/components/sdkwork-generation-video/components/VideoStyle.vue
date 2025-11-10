<template>
  <div class="video-style">
    <div class="style-header">
      <h4>视频风格</h4>
      <van-icon name="question-o" @click="showStyleHelp" />
    </div>
    
    <!-- 风格选择器 -->
    <van-radio-group v-model="selectedStyle" class="style-grid">
      <div 
        v-for="style in videoStyles" 
        :key="style.value"
        class="style-item"
        :class="{ active: selectedStyle === style.value }"
        @click="selectStyle(style.value)"
      >
        <div class="style-icon">
          <van-icon :name="style.icon" size="24" />
        </div>
        <div class="style-info">
          <span class="style-name">{{ style.name }}</span>
          <span class="style-desc">{{ style.description }}</span>
        </div>
        <van-radio :name="style.value" class="style-radio" />
      </div>
    </van-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { showDialog } from 'vant'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

interface VideoStyle {
  value: string
  name: string
  description: string
  icon: string
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedStyle = ref(props.modelValue)

// 视频风格列表
const videoStyles: VideoStyle[] = [
  {
    value: 'realistic',
    name: '写实风格',
    description: '真实感强，细节丰富',
    icon: 'photo'
  },
  {
    value: 'anime',
    name: '动漫风格',
    description: '二次元动画效果',
    icon: 'smile-comment-o'
  },
  {
    value: 'cinematic',
    name: '电影风格',
    description: '电影级质感',
    icon: 'video-o'
  },
  {
    value: 'artistic',
    name: '艺术风格',
    description: '油画、水彩等艺术效果',
    icon: 'brush-o'
  },
  {
    value: 'minimal',
    name: '简约风格',
    description: '简洁现代的设计',
    icon: 'apps-o'
  },
  {
    value: 'fantasy',
    name: '奇幻风格',
    description: '梦幻、超现实的视觉效果',
    icon: 'star-o'
  }
]

// 选择风格
const selectStyle = (value: string) => {
  selectedStyle.value = value
}

// 显示风格帮助
const showStyleHelp = () => {
  showDialog({
    title: '视频风格说明',
    message: `不同的风格会影响视频的整体视觉效果：

• 写实风格：追求真实感，适合自然场景
• 动漫风格：二次元动画效果，适合创意内容
• 电影风格：具有电影质感的视觉效果
• 艺术风格：油画、水彩等艺术表现形式
• 简约风格：现代简洁的设计风格
• 奇幻风格：梦幻、超现实的视觉效果`,
    confirmButtonText: '知道了'
  })
}

// 监听选择变化
watch(selectedStyle, (newValue) => {
  emit('update:modelValue', newValue)
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  selectedStyle.value = newValue
})
</script>

<style scoped>
.video-style {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
}

.style-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.style-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
}

.style-header .van-icon {
  color: var(--text-secondary);
  cursor: pointer;
}

.style-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.style-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-secondary);
}

.style-item:hover {
  border-color: var(--accent-blue);
  background: rgba(0, 123, 255, 0.1);
}

.style-item.active {
  border-color: var(--accent-blue);
  background: rgba(0, 123, 255, 0.2);
}

.style-icon {
  margin-right: 12px;
  color: var(--text-secondary);
}

.style-item.active .style-icon {
  color: var(--accent-blue);
}

.style-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.style-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.style-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.style-radio {
  margin-left: 8px;
}

:deep(.van-radio__icon) {
  font-size: 16px;
  border-color: var(--border-color);
}

:deep(.van-radio--checked .van-radio__icon) {
  background-color: var(--accent-blue);
  border-color: var(--accent-blue);
}

:deep(.van-radio__label) {
  display: none;
}
</style>