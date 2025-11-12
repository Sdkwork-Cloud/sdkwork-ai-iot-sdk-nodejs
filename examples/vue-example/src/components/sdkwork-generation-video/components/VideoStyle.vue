<template>
  <div class="video-style">
    <div class="style-header">
      <h4>视频风格</h4>
      <van-icon name="question-o" @click="showStyleHelp" />
    </div>
    
    <!-- 使用sdkwork-grid展示风格选择器 -->
    <SdkworkGrid 
      :columns="3" 
      :gutter="5" 
      class="style-grid"
      clickable
    >
      <SdkworkGridItem
        v-for="style in videoStyles"
        :key="style.value"
        :text="style.name"
        :badge="selectedStyle === style.value ? '✓' : ''"
        :class="{ 'style-item-active': selectedStyle === style.value }"
        clickable
        @click="selectStyle(style.value)"
      >
        <template #icon>
          <!-- 如果有图片，使用图片展示 -->
          <img 
            v-if="style.image && style.image.url" 
            :src="style.image.url" 
            :alt="style.name"
            class="style-image"
            @click.stop="previewImage(style.image.url)"
          />
          <!-- 否则使用iconify图标 -->
          <Icon 
            v-else 
            :icon="style.icon" 
            class="style-icon"
          />
        </template>
      </SdkworkGridItem>
    </SdkworkGrid>
    
    <!-- 选中风格的描述 -->
    <div v-if="selectedStyleInfo" class="selected-description">
      <div class="style-description">
        <h5>{{ selectedStyleInfo.name }}</h5>
        <p>{{ selectedStyleInfo.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { showDialog, showImagePreview } from 'vant'
import { Icon } from '@iconify/vue'
import SdkworkGrid from '@/components/sdkwork-grid/sdkwork-grid.vue'
import SdkworkGridItem from '@/components/sdkwork-grid-item/sdkwork-grid-item.vue'
import { ImageMediaResource } from 'sdkwork-sdk-api-typescript'

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
  image?: ImageMediaResource
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
    icon: 'material-symbols:photo-camera-outline'
  },
  {
    value: 'anime',
    name: '动漫风格',
    description: '二次元动画效果',
    icon: 'material-symbols:face-6'
  },
  {
    value: 'cinematic',
    name: '电影风格',
    description: '电影级质感',
    icon: 'material-symbols:movie-outline'
  },
  {
    value: 'artistic',
    name: '艺术风格',
    description: '油画、水彩等艺术效果',
    icon: 'material-symbols:palette-outline'
  },
  {
    value: 'minimal',
    name: '简约风格',
    description: '简洁现代的设计',
    icon: 'material-symbols:grid-view-outline'
  },
  {
    value: 'fantasy',
    name: '奇幻风格',
    description: '梦幻、超现实的视觉效果',
    icon: 'material-symbols:auto-awesome-outline'
  }
]

// 选中风格的计算属性
const selectedStyleInfo = computed(() => {
  return videoStyles.find(style => style.value === selectedStyle.value)
})

// 选择风格
const selectStyle = (value: string) => {
  selectedStyle.value = value
}

// 预览图片
const previewImage = (url: string) => {
  showImagePreview({
    images: [url],
    closeable: true,
    closeIcon: 'cross',
    showIndex: false
  })
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
  margin-bottom: 1px;
}

/* 选中项的高亮样式 */
.style-item-active {
  border-color: var(--accent-blue) !important;
}

:deep(.style-item-active .sdkwork-grid-item) {
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 8px;
}

:deep(.style-item-active .sdkwork-grid-item__text-primary) {
  color: var(--accent-blue);
  font-weight: 500;
}

/* 选中项的描述信息 */
.selected-description {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid var(--border-color);
}

.style-description h5 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 500;
}

.style-description p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

/* 图片和图标样式 */
.style-image {
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.style-image:hover {
  transform: scale(1.05);
}

.style-icon {
  width: 40px;
  height: 40px;
  color: var(--text-secondary);
}

/* 选中项的图片和图标样式 */
:deep(.style-item-active .style-icon) {
  color: var(--accent-blue);
}

/* 确保图标容器正确显示 */
:deep(.sdkwork-grid-item__icon) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-bottom: 8px;
}
 
</style>