<template>
  <van-popup v-model:show="visible" position="bottom" round>
    <div class="video-generator-dialog">
      <div class="dialog-header">
        <span class="dialog-title">生成对话视频</span>
        <van-icon name="cross" @click="close" />
      </div>
      
      <div class="dialog-content">
        <!-- 视频设置 -->
        <van-cell-group title="视频设置">
          <van-field label="视频标题" v-model="videoSettings.title" placeholder="请输入视频标题" />
          <van-field label="视频描述" v-model="videoSettings.description" type="textarea" rows="2" placeholder="请输入视频描述" />
          
          <van-cell title="视频分辨率" :value="resolutionLabels[videoSettings.resolution]" is-link @click="showResolutionPicker" />
          <van-cell title="视频格式" :value="formatLabels[videoSettings.format]" is-link @click="showFormatPicker" />
          <van-cell title="背景音乐" :value="videoSettings.backgroundMusic ? musicLabels[videoSettings.backgroundMusic] : '无'" is-link @click="showMusicPicker" />
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
    
    <!-- 选择器弹窗 -->
    <van-popup v-model:show="showPicker" position="bottom">
      <van-picker 
        :columns="pickerColumns" 
        @confirm="onConfirm" 
        @cancel="showPicker = false"
      />
    </van-popup>
    
    <!-- 生成进度弹窗 -->
    <van-popup v-model:show="showProgressDialog" :close-on-click-overlay="false" position="center">
      <div class="progress-dialog">
        <div class="dialog-header">
          <span class="dialog-title">正在生成视频</span>
        </div>
        <div class="progress-content">
          <van-progress :percentage="progress" stroke-width="8" />
          <div class="progress-text">{{ progressText }}</div>
        </div>
      </div>
    </van-popup>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { showToast } from 'vant'

// 对话角色接口
interface DialogueCharacter {
  id: string
  name: string
  avatar?: string
  description?: string
}

// Props定义
interface Props {
  /** 角色列表 */
  characters: DialogueCharacter[]
  /** 对话消息列表 */
  messages: any[]
  /** 是否显示弹窗 */
  modelValue?: boolean
}

// Events定义
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'generation-completed', result: any): void
  (e: 'generation-failed', error: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<Emits>()

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const showPicker = ref(false)
const showProgressDialog = ref(false)
const generating = ref(false)
const progress = ref(0)
const progressText = ref('')
const currentPickerType = ref('')

// 视频设置
const videoSettings = reactive({
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

// 选择器列
const pickerColumns = computed(() => {
  switch (currentPickerType.value) {
    case 'resolution':
      return resolutionOptions
    case 'format':
      return formatOptions
    case 'music':
      return musicOptions
    default:
      return []
  }
})

// 显示分辨率选择器
const showResolutionPicker = () => {
  currentPickerType.value = 'resolution'
  showPicker.value = true
}

// 显示格式选择器
const showFormatPicker = () => {
  currentPickerType.value = 'format'
  showPicker.value = true
}

// 显示音乐选择器
const showMusicPicker = () => {
  currentPickerType.value = 'music'
  showPicker.value = true
}

// 选择器确认
const onConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
  const value = selectedValues[0]
  
  switch (currentPickerType.value) {
    case 'resolution':
      videoSettings.resolution = value
      break
    case 'format':
      videoSettings.format = value
      break
    case 'music':
      videoSettings.backgroundMusic = value
      break
  }
  
  showPicker.value = false
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
  
  // 关闭设置弹窗，打开进度弹窗
  visible.value = false
  showProgressDialog.value = true
  generating.value = true
  
  // 重置进度
  progress.value = 0
  progressText.value = '准备生成...'
  
  // 模拟生成过程
  simulateGeneration()
}

// 模拟视频生成过程
const simulateGeneration = () => {
  const steps = [
    { progress: 20, text: '分析对话内容...' },
    { progress: 40, text: '生成语音...' },
    { progress: 60, text: '合成视频场景...' },
    { progress: 80, text: '添加字幕和效果...' },
    { progress: 100, text: '完成!' }
  ]
  
  let currentStep = 0
  
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep]
      progress.value = step.progress
      progressText.value = step.text
      currentStep++
    } else {
      clearInterval(interval)
      
      // 生成完成
      setTimeout(() => {
        showProgressDialog.value = false
        generating.value = false
        
        // 发送完成事件
        emit('generation-completed', {
          title: videoSettings.title,
          description: videoSettings.description,
          url: 'https://example.com/video.mp4', // 模拟视频URL
          thumbnail: 'https://example.com/thumbnail.jpg' // 模拟缩略图
        })
      }, 1000)
    }
  }, 1500)
}

// 关闭弹窗
const close = () => {
  visible.value = false
  emit('close')
}
</script>

<style lang="scss" scoped>
.video-generator-dialog {
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 16px;
  
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
  
  // 进度弹窗样式
  .progress-dialog {
    width: 300px;
    padding: 24px;
    
    .dialog-header {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      
      .dialog-title {
        font-size: 16px;
        font-weight: 500;
      }
    }
    
    .progress-content {
      .progress-text {
        margin-top: 16px;
        text-align: center;
        font-size: 14px;
        color: #646566;
      }
    }
  }
}
</style>