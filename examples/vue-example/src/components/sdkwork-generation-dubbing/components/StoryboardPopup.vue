<template>
  <van-popup
    v-model:show="show"
    position="bottom"
    :style="{ height: '100%' }"
    round
  >
    <div class="storyboard-popup">
      <!-- 头部 -->
      <div class="popup-header">
        <div class="header-title">分镜设置</div>
        <van-button
          type="primary"
          size="small"
          @click="handleConfirm"
          :disabled="!isValid"
        >
          确认设置
        </van-button>
      </div>

      <!-- 内容区域 -->
      <div class="popup-content">
        <!-- 视频描述 -->
        <div class="video-description-section">
          <div class="section-title">视频描述</div>
          <van-field
            v-model="videoDescription"
            type="textarea"
            :rows="2"
            autosize
            maxlength="200"
            show-word-limit
            placeholder="请输入视频的整体描述和风格要求..."
            class="description-field"
          />
        </div>

        <!-- 分镜列表 -->
        <div class="shot-list-section">
          <div class="section-header">
            <div class="section-title">镜头设置</div>
            <van-button
              type="primary"
              size="mini"
              @click="addShot"
            >
              添加镜头
            </van-button>
          </div>
          
          <div class="shot-list">
            <VideoSceneItem
              v-for="(shot, index) in shots"
              :key="shot.id"
              :shot="shot"
              :index="index"
              :shots-length="shots.length"
              @update:shot="updateShot(index, $event)"
              @delete="removeShot"
              @upload-frame="handleFrameUpload"
            />
          </div>
        </div>

        <!-- AI生成分镜 -->
        <div class="ai-generation-section">
          <van-button
            type="default"
            size="small"
            block
            @click="generateWithAI"
            :loading="isGeneratingAI"
            class="ai-btn"
          >
            <van-icon name="magic" />
            AI智能生成分镜
          </van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import VideoSceneItem from './VideoSceneItem.vue'

export interface Shot {
  id: string
  content: string  // 镜头内容描述
  dialogue: string  // 播报内容（台词）
  duration: number  // 时长（秒）
  startFrame?: string  // 首帧图片URL或描述
  endFrame?: string    // 尾帧图片URL或描述
}

interface Storyboard {
  videoDescription: string  // 视频描述
  shots: Shot[]              // 镜头列表
}

interface Props {
  modelValue: boolean
  selectedStoryboard?: Storyboard
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', storyboard: Storyboard): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 本地弹窗状态
const show = ref(props.modelValue)

// 视频描述
const videoDescription = ref('')

// 镜头列表
const shots = ref<Shot[]>([
  {
    id: generateId(),
    content: '',
    dialogue: '',
    duration: 3,
    startFrame: '',
    endFrame: ''
  }
])

// AI生成状态
const isGeneratingAI = ref(false)

// 表单验证
const isValid = computed(() => {
  return (
    videoDescription.value.trim().length > 0 &&
    shots.value.length > 0 &&
    shots.value.every(shot => shot.content.trim().length > 0 && shot.dialogue.trim().length > 0)
  )
})

// 监听props变化
watch(() => props.modelValue, (newVal) => {
  show.value = newVal
  if (newVal && props.selectedStoryboard) {
    // 加载选中的分镜数据
    videoDescription.value = props.selectedStoryboard.videoDescription
    shots.value = [...props.selectedStoryboard.shots]
  }
})

// 监听本地状态变化并通知父组件
watch(show, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    // 关闭弹窗时重置数据
    setTimeout(() => {
      videoDescription.value = ''
      shots.value = [{
        id: generateId(),
        content: '',
        dialogue: '',
        duration: 3,
        startFrame: '',
        endFrame: ''
      }]
    }, 300)
  }
})

// 生成唯一ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2, 11)
}

// 更新镜头数据
const updateShot = (index: number, updatedShot: Shot) => {
  shots.value[index] = updatedShot
}

// 添加镜头
const addShot = () => {
  shots.value.push({
    id: generateId(),
    content: '',
    dialogue: '',
    duration: 3,
    startFrame: '',
    endFrame: ''
  })
}

// 删除镜头
const removeShot = (shotId: string) => {
  const index = shots.value.findIndex(shot => shot.id === shotId)
  if (index !== -1) {
    shots.value.splice(index, 1)
  }
}

// 处理首尾帧图片上传
const handleFrameUpload = async (type: 'start' | 'end', shotId: string) => {
  // 创建文件输入元素
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  
  fileInput.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      // 这里应该上传到服务器或转换为base64
      // 简化示例中直接使用URL.createObjectURL
      const imageUrl = URL.createObjectURL(file)
      
      // 找到对应的镜头并更新
      const shot = shots.value.find(s => s.id === shotId)
      if (shot) {
        if (type === 'start') {
          shot.startFrame = imageUrl
        } else {
          shot.endFrame = imageUrl
        }
      }
    }
  }
  
  // 触发文件选择
  fileInput.click()
}

// AI智能生成分镜
const generateWithAI = async () => {
  if (!videoDescription.value.trim()) {
    return
  }
  
  isGeneratingAI.value = true
  
  try {
    // 模拟AI生成分镜
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 生成示例分镜
    shots.value = [
      {
        id: generateId(),
        content: '开场画面，展示产品整体',
        dialogue: '大家好，欢迎收看今天的视频',
        duration: 3
      },
      {
        id: generateId(),
        content: '产品特写镜头',
        dialogue: '这是我们的新产品，具有以下特点',
        duration: 4
      },
      {
        id: generateId(),
        content: '使用场景展示',
        dialogue: '在实际使用中，它能带来极大的便利',
        duration: 3
      }
    ]
  } catch (error) {
    console.error('AI生成分镜失败:', error)
  } finally {
    isGeneratingAI.value = false
  }
}

// 确认设置
const handleConfirm = () => {
  if (isValid.value) {
    const storyboard: Storyboard = {
      videoDescription: videoDescription.value,
      shots: shots.value.map(shot => ({ ...shot }))
    }
    emit('confirm', storyboard)
    show.value = false
  }
}


</script>

<style scoped>
.storyboard-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
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
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* 视频描述区域 */
.video-description-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.description-field {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* 镜头列表区域 */
.shot-list-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.shot-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* AI生成区域 */
.ai-generation-section {
  margin-top: 20px;
}

.ai-btn {
  border-radius: 8px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .popup-header {
    border-bottom-color: #2d3a4e;
  }
  
  .header-title {
    color: #ffffff;
  }
  
  .section-title {
    color: #ffffff;
  }
  
  .description-field {
    border-color: #2d3a4e;
    background-color: #1e2a3d;
    color: #ffffff;
  }
  

}
</style>