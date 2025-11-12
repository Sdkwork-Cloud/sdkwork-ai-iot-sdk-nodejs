<template>
  <div class="video-generator">
    <!-- 视频生成弹窗 -->
    <van-popup 
      v-model:show="show" 
      position="bottom" 
      :style="{ 
        borderRadius: isDarkMode ? '16px 16px 0 0' : undefined,
        backgroundColor: isDarkMode ? '#1a1a1a' : undefined
      }"
    >
      <div class="video-dialog">
        <div class="dialog-header">
          <span class="dialog-title">生成对话视频</span>
          <van-icon name="cross" @click="close" />
        </div>
        
        <div class="dialog-content">
          <!-- 视频设置 -->
          <van-cell-group title="视频设置">
            <van-field label="视频标题" v-model="videoSettings.title" placeholder="请输入视频标题" />
            <van-field label="视频描述" v-model="videoSettings.description" type="textarea" rows="2" placeholder="请输入视频描述" />
            
            <van-cell title="视频分辨率" :value="resolutionLabels[videoSettings.resolution]" is-link @click="emit('resolution-picker')" />
            <van-cell title="视频格式" :value="formatLabels[videoSettings.format]" is-link @click="emit('format-picker')" />
            <van-cell title="背景音乐" :value="videoSettings.backgroundMusic ? musicLabels[videoSettings.backgroundMusic] : '无'" is-link @click="emit('music-picker')" />
          </van-cell-group>
          
          <!-- 生成选项 -->
          <van-cell-group title="生成选项">
            <van-cell center title="添加字幕">
              <template #right-icon>
                <van-switch v-model="videoSettings.addSubtitle" />
              </template>
            </van-cell>
            <van-cell center title="添加过渡效果">
              <template #right-icon>
                <van-switch v-model="videoSettings.addTransition" />
              </template>
            </van-cell>
            <van-cell center title="循环播放背景音乐">
              <template #right-icon>
                <van-switch v-model="videoSettings.loopMusic" />
              </template>
            </van-cell>
          </van-cell-group>
        </div>
        
        <div class="dialog-footer">
          <van-button block type="primary" @click="startGeneration" :loading="generating">
            开始生成
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { showToast } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme'
import type { VideoSettings } from './types'

// Props
interface Props {
  modelValue: boolean
  messages: any[]
  generatingVideo: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  messages: () => [],
  generatingVideo: false
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'generate', settings: VideoSettings): void
  (e: 'resolution-picker'): void
  (e: 'format-picker'): void
  (e: 'music-picker'): void
}>()

// 响应式数据
const show = ref(props.modelValue)
const generating = ref(props.generatingVideo)

// 视频设置
const videoSettings = reactive<VideoSettings>({
  title: '多人对话视频',
  description: '',
  resolution: '720p',
  format: 'mp4',
  backgroundMusic: '',
  addSubtitle: true,
  addTransition: true,
  loopMusic: true
})

// 分辨率选项
const resolutionOptions = [
  { text: '480p', value: '480p' },
  { text: '720p', value: '720p' },
  { text: '1080p', value: '1080p' },
  { text: '4K', value: '4K' }
]

// 格式选项
const formatOptions = [
  { text: 'MP4', value: 'mp4' },
  { text: 'MOV', value: 'mov' },
  { text: 'AVI', value: 'avi' },
  { text: 'WebM', value: 'webm' }
]

// 背景音乐选项
const musicOptions = [
  { text: '无', value: '' },
  { text: '轻快', value: 'light' },
  { text: '温馨', value: 'warm' },
  { text: '励志', value: 'inspiring' },
  { text: '浪漫', value: 'romantic' }
]

// 分辨率标签
const resolutionLabels = computed(() => {
  const labels: Record<string, string> = {}
  resolutionOptions.forEach(option => {
    labels[option.value] = option.text
  })
  return labels
})

// 格式标签
const formatLabels = computed(() => {
  const labels: Record<string, string> = {}
  formatOptions.forEach(option => {
    labels[option.value] = option.text
  })
  return labels
})

// 音乐标签
const musicLabels = computed(() => {
  const labels: Record<string, string> = {}
  musicOptions.forEach(option => {
    labels[option.value] = option.text
  })
  return labels
})

// 使用主题
const { isDarkMode } = useTheme()

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  show.value = newVal
})

// 监听show变化并触发update:modelValue
watch(show, (newVal) => {
  emit('update:modelValue', newVal)
})

// 监听generatingVideo变化
watch(() => props.generatingVideo, (newVal) => {
  generating.value = newVal
})

// 关闭弹窗
const close = () => {
  show.value = false
}

// 开始生成
const startGeneration = () => {
  if (!videoSettings.title.trim()) {
    showToast('请输入视频标题')
    return
  }
  
  if (props.messages.length === 0) {
    showToast('没有可生成视频的对话内容')
    return
  }
  
  // 发送生成事件到父组件
  emit('generate', videoSettings)
}

// 更新视频设置的方法，由父组件调用
const updateVideoSettings = (type: 'resolution' | 'format' | 'music', value: string) => {
  switch (type) {
    case 'resolution':
      videoSettings.resolution = value as VideoSettings['resolution']
      break
    case 'format':
      videoSettings.format = value as VideoSettings['format']
      break
    case 'music':
      videoSettings.backgroundMusic = value as VideoSettings['backgroundMusic']
      break
  }
}

// 暴露方法给父组件
defineExpose({
  close,
  updateVideoSettings
})
</script>

<style lang="scss" scoped>
.video-generator {
  // 弹窗样式
  .video-dialog {
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 16px;
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .dialog-title {
      font-size: 18px;
      font-weight: 500;
    }
  }
  
  .dialog-content {
    margin-bottom: 20px;
  }
  
  .dialog-footer {
    margin-top: 20px;
  }
}

// 主题相关样式
:root {
  --dialog-bg-color: #ffffff;
  --header-bg-color: #ffffff;
  --footer-bg-color: #ffffff;
}

html[data-theme="dark"] {
  --dialog-bg-color: #1a1a1a;
  --header-bg-color: #1a1a1a;
  --footer-bg-color: #1a1a1a;
}

.video-generator {
  .video-dialog {
    background-color: var(--dialog-bg-color);
    
    .dialog-header {
      .dialog-title {
        color: var(--text-primary-color);
      }
    }
  }
}
</style>