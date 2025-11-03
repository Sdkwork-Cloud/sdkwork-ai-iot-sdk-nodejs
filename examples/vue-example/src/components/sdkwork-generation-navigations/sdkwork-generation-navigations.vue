<template>
  <div class="sdkwork-generation-navigations">
    <!-- 视频生成功能组 -->
    <div class="navigation-group">
      <h3 class="group-title">🎬 视频生成</h3>
      <SdkworkGrid 
        :columns="3" 
        :gutter="12" 
        card 
        hoverable
        bordered
        clickable
        content-padding="2px"
      >
        <SdkworkGridItem
          v-for="item in videoFeatures"
          :key="item.id"
          :text="item.name"
          :icon="item.icon"
          :label="showDescription ? item.description : undefined"
          clickable
          @click="handleFeatureClick(item)"
        />
      </SdkworkGrid>
    </div>

    <!-- 图片生成功能组 -->
    <div class="navigation-group">
      <h3 class="group-title">🖼️ 图片生成</h3>
      <SdkworkGrid 
        :columns="3" 
        :gutter="12" 
        card 
        hoverable
        bordered
        clickable
        content-padding="2px"
      >
        <SdkworkGridItem
          v-for="item in imageFeatures"
          :key="item.id"
          :text="item.name"
          :icon="item.icon"
          :label="showDescription ? item.description : undefined"
          clickable
          @click="handleFeatureClick(item)"
        />
      </SdkworkGrid>
    </div>

    <!-- 语音生成功能组 -->
    <div class="navigation-group">
      <h3 class="group-title">🎵 语音生成</h3>
      <SdkworkGrid 
        :columns="3" 
        :gutter="12" 
        card 
        hoverable
        bordered
        clickable
        content-padding="2px"
      >
        <SdkworkGridItem
          v-for="item in audioFeatures"
          :key="item.id"
          :text="item.name"
          :icon="item.icon"
          :label="showDescription ? item.description : undefined"
          clickable
          @click="handleFeatureClick(item)"
        />
      </SdkworkGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SdkworkGrid from '../sdkwork-grid/sdkwork-grid.vue'
import SdkworkGridItem from '../sdkwork-grid-item/sdkwork-grid-item.vue'

// Props定义
interface Props {
  /** 是否显示功能描述 */
  showDescription?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDescription: false
})

// 功能项类型定义
interface FeatureItem {
  id: string
  name: string
  icon: string
  description: string
  category: 'video' | 'image' | 'audio'
}

// 视频生成功能列表
const videoFeatures = ref<FeatureItem[]>([
  {
    id: 'video-generation',
    name: '视频生成',
    icon: 'material-symbols:video-library',
    description: 'AI智能生成视频内容',
    category: 'video'
  },
  {
    id: 'video-dubbing',
    name: '视频口播',
    icon: 'material-symbols:record-voice-over',
    description: '自动配音和口播生成',
    category: 'video'
  },
  {
    id: 'ad-production',
    name: '广告片制作',
    icon: 'material-symbols:campaign',
    description: '专业广告视频制作',
    category: 'video'
  }
])

// 图片生成功能列表
const imageFeatures = ref<FeatureItem[]>([
  {
    id: 'image-generation',
    name: '图片生成',
    icon: 'material-symbols:image',
    description: 'AI智能生成图片',
    category: 'image'
  },
  {
    id: 'portrait-photo',
    name: '制作写真',
    icon: 'material-symbols:photo-camera',
    description: '专业写真照片制作',
    category: 'image'
  },
  {
    id: 'id-photo',
    name: '证件照',
    icon: 'material-symbols:badge',
    description: '标准证件照生成',
    category: 'image'
  }
])

// 语音生成功能列表
const audioFeatures = ref<FeatureItem[]>([
  {
    id: 'music-generation',
    name: '音乐生成',
    icon: 'material-symbols:music-note',
    description: 'AI智能生成音乐',
    category: 'audio'
  },
  {
    id: 'voice-cloning',
    name: '克隆声音',
    icon: 'material-symbols:voice-over-off',
    description: '声音克隆和复制',
    category: 'audio'
  },
  {
    id: 'voice-synthesis',
    name: '语音合成',
    icon: 'material-symbols:speaker',
    description: '文本转语音合成',
    category: 'audio'
  },
  {
    id: 'audio-recording',
    name: '语音录制',
    icon: 'material-symbols:mic',
    description: '高质量语音录制',
    category: 'audio'
  }
])

// 处理功能项点击事件
const handleFeatureClick = (feature: FeatureItem) => {
  console.log('功能项被点击:', feature)
  
  // 这里可以添加具体的业务逻辑，比如路由跳转、打开模态框等
  switch (feature.id) {
    case 'video-generation':
      // 跳转到视频生成页面
      break
    case 'image-generation':
      // 跳转到图片生成页面
      break
    case 'music-generation':
      // 跳转到音乐生成页面
      break
    // 其他功能项的处理逻辑...
  }
  
  // 触发自定义事件
  emit('featureClick', feature)
}

// 定义组件事件
const emit = defineEmits<{
  /** 功能项点击事件 */
  featureClick: [feature: FeatureItem]
}>()

// 暴露方法给父组件
const getFeaturesByCategory = (category: 'video' | 'image' | 'audio') => {
  switch (category) {
    case 'video':
      return videoFeatures.value
    case 'image':
      return imageFeatures.value
    case 'audio':
      return audioFeatures.value
    default:
      return []
  }
}

// 暴露方法
defineExpose({
  getFeaturesByCategory,
  videoFeatures,
  imageFeatures,
  audioFeatures
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/theme.scss' as theme;

.sdkwork-generation-navigations {
  padding: 0px;
  max-width: 1200px;
  margin: 0 auto;
  
  .navigation-group {
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .group-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--theme-text-color, #323233);
      margin: 0 0 16px 0;
      padding: 8px 0; 
      display: flex;
      align-items: center;
      gap: 8px;
      
      // 主题自适应
      @include theme.text-color(#323233, #ffffff);
    }
  }
}

// 深色主题适配
:global(.dark) .sdkwork-generation-navigations,
:global(.theme-dark) .sdkwork-generation-navigations,
:global([data-theme="dark"]) .sdkwork-generation-navigations {
  .navigation-group {
    .group-title {
      color: var(--theme-text-color, #ffffff);
    }
  }
}

// 浅色主题适配
:global(.light) .sdkwork-generation-navigations,
:global(.theme-light) .sdkwork-generation-navigations,
:global([data-theme="light"]) .sdkwork-generation-navigations {
  .navigation-group {
    .group-title {
      color: var(--theme-text-color, #323233);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-generation-navigations {
    padding: 16px;
    
    .navigation-group {
      margin-bottom: 4px;
      
      .group-title {
        font-size: 18px;
        margin-bottom: 12px;
      }
    }
  }
}

@media (max-width: 480px) {
  .sdkwork-generation-navigations {
    padding: 12px;
    
    .navigation-group {
      margin-bottom: 2px;
      
      .group-title {
        font-size: 16px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>