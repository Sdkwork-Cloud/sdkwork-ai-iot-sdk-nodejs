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
        <van-button
          type="default"
          size="small"
          @click="handleCancel"
          class="cancel-btn"
        >
          取消
        </van-button>
        <div class="header-title">分镜设置</div>
        <van-button
          type="primary"
          size="small"
          @click="handleConfirm"
          :disabled="!isValid"
          class="confirm-btn"
        >
          确认设置
        </van-button>
      </div>

      <!-- 内容区域 -->
      <div class="popup-content"> 

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
              @generate-image="handleImageGeneration"
            />
          </div>
        </div> 
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import VideoSceneItem from './VideoSceneItem.vue'
import type { ShotItem, StoryboardList } from './types.ts'

// 为了向后兼容，重新导出类型
export type Shot = ShotItem
export type Storyboard = StoryboardList

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
const shots = ref<ShotItem[]>([
  {
    id: generateId(),
    content: '',
    dialogue: '',
    duration: 3,
    startFrame: '',
    endFrame: '',
    image: '',
    prompt: '',
    startPrompt: '',
    endPrompt: '',
    videoDescription: '',
    emotion: 'neutral'
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
        endFrame: '',
        image: '',
        prompt: '',
        startPrompt: '',
        endPrompt: '',
        videoDescription: '',
        emotion: 'neutral'
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
    endFrame: '',
    image: '',
    prompt: '',
    startPrompt: '',
    endPrompt: '',
    videoDescription: '',
    emotion: 'neutral'
  })
}

// 删除镜头
const removeShot = (shotId: string) => {
  const index = shots.value.findIndex(shot => shot.id === shotId)
  if (index !== -1) {
    shots.value.splice(index, 1)
  }
}



// 处理图片生成请求
const handleImageGeneration = (shotId: string, type: 'single' | 'start' | 'end', prompt: string) => {
  // 找到对应的镜头
  const shot = shots.value.find(s => s.id === shotId)
  if (!shot) return
  
  // 模拟AI图片生成（实际应该调用API）
  setTimeout(() => {
    // 生成一个模拟图片URL
    const mockImageUrl = `https://picsum.photos/seed/${Date.now()}-${Math.random().toString(36).slice(2, 9)}/400/300.jpg`
    
    // 根据类型更新不同的图片字段
    if (type === 'single') {
      shot.image = mockImageUrl
    } else if (type === 'start') {
      shot.startFrame = mockImageUrl
    } else if (type === 'end') {
      shot.endFrame = mockImageUrl
    }
    
    // 保存提示词
    if (type === 'single') {
      shot.prompt = prompt
    } else if (type === 'start') {
      shot.startPrompt = prompt
    } else if (type === 'end') {
      shot.endPrompt = prompt
    }
    
    // 如果没有设置视频描述，尝试从提示词生成
    if (!shot.videoDescription && prompt) {
      shot.videoDescription = prompt
    }
  }, 1500)
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

// 取消设置
const handleCancel = () => {
  show.value = false
}

// 确认设置
const handleConfirm = () => {
  if (isValid.value) {
    const storyboard: StoryboardList = {
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
  /* 确保容器不会超出视口 */
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
  padding: 6px;
  /* 确保内容可以滚动 */
  height: 0; /* 关键：与flex: 1配合使用，确保内容区域不会超出父容器 */
  /* 添加平滑滚动 */
  scroll-behavior: smooth;
  /* 确保滚动条样式美观 */
  -webkit-overflow-scrolling: touch;
  /* 防止内容溢出 */
  min-height: 0;
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
  /* 确保内容不会溢出 */
  min-height: 0;
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
  
  .cancel-btn {
    border-color: #3a4556;
    color: #a8b3cf;
  }
  
  .confirm-btn {
    background-color: #1976d2;
  }
}
</style>