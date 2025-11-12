<template>
  <div class="video-scene-item">
    <div class="scene-header">
      <div class="scene-title">镜头 {{ index + 1 }}</div>
      <div class="scene-actions"> 
        <van-button
          v-if="showDelete && shotsLength > 1"
          type="danger"
          size="mini"
          @click="$emit('delete', shot.id)"
          class="action-btn"
        >
          删除
        </van-button>
      </div>
    </div>
    
    <div class="scene-content"> 
      
      <!-- 图片预览区域 -->
      <div class="image-preview-section">
        <div class="preview-modes">
          <sdkwork-segmented v-model="imageMode" :options="modeOptions" />
        </div>
        
        <!-- 单图模式 -->
        <div v-if="imageMode === 'single'" class="single-image-preview">
          <!-- 上传图片组件 -->
          <div class="image-uploader-section">
            <sdkwork-uploader-image
              v-model="singleImageFiles"
              :multiple="false"
              :auto-upload="true"
              :max-count="1"
              title="上传或生成图片"
              subtitle="支持 JPG、PNG、GIF、WEBP 等格式，或使用AI生成"
              :show-prompt="true"
              :ai-generate="true"
              :prompt-value="localPrompt"
              @update:prompt="handlePromptUpdate"
              @ai-generate="handleAiGenerate"
              @image-ai-generate="handleImageAiGenerate"
              @upload-success="handleSingleImageSuccess"
              @image-remove="handleSingleImageRemove"
              @image-preview="handleSingleImagePreview"
              class="image-uploader"
            /> 
          </div>
        </div>
        
        <!-- 首尾帧模式 -->
        <div v-else class="frames-preview">
          <!-- 首帧上传和预览 -->
          <div class="frame-container">
            <div class="frame-title">首帧</div>
            <!-- 首帧上传组件 -->
            <sdkwork-uploader-image
              v-model="startFrameFiles"
              :multiple="false"
              :auto-upload="true"
              :max-count="1"
              title="上传首帧"
              subtitle="支持 JPG、PNG、GIF、WEBP 等格式，或使用AI生成"
              :show-prompt="true"
              :ai-generate="true"
              :prompt-value="localStartPrompt"
              @update:prompt="handleStartPromptUpdate"
              @ai-generate="handleStartFrameAiGenerate"
              @image-ai-generate="handleStartFrameImageAiGenerate"
              @upload-success="handleStartFrameSuccess"
              @image-remove="handleStartFrameRemove"
              @image-preview="handleStartFramePreview"
              class="frame-uploader-component"
            />
            
            
          </div>
          
          <!-- 尾帧上传和预览 -->
          <div class="frame-container">
            <div class="frame-title">尾帧</div>
            <!-- 尾帧上传组件 -->
            <sdkwork-uploader-image
              v-model="endFrameFiles"
              :multiple="false"
              :auto-upload="true"
              :max-count="1"
              title="上传尾帧"
              subtitle="支持 JPG、PNG、GIF、WEBP 等格式，或使用AI生成"
              :show-prompt="true"
              :ai-generate="true"
              :prompt-value="localEndPrompt"
              @update:prompt="handleEndPromptUpdate"
              @ai-generate="handleEndFrameAiGenerate"
              @image-ai-generate="handleEndFrameImageAiGenerate"
              @upload-success="handleEndFrameSuccess"
              @image-remove="handleEndFrameRemove"
              @image-preview="handleEndFramePreview"
              class="frame-uploader-component"
            /> 
          </div>
        </div>
      </div>

      <!-- 镜头视频生成描述 -->
      <div class="scene-description-section">
        <div class="section-label-with-action">
          <span class="section-label">镜头描述（视频生成）</span>
          <van-button 
            type="primary" 
            size="mini" 
            icon="description" 
            @click="handleAiGenerateDescription"
            :loading="isGeneratingDescription"
            class="ai-generate-btn"
          >
            AI生成
          </van-button>
        </div>
        <van-field
          :model-value="shot.videoDescription"
          @update:model-value="$emit('update:shot', { ...shot, videoDescription: $event })"
          type="textarea"
          :rows="2"
          autosize
          maxlength="200"
          placeholder="描述该镜头的视频内容（动作、场景变化、镜头运动等）"
          class="scene-field"
        />
      </div>
      
      <!-- 台词内容 -->
      <div class="dialogue-section">
        <div class="section-label-with-action">
          <span class="section-label">台词内容</span>
          <van-button 
            type="primary" 
            size="mini" 
            icon="chat" 
            @click="handleAiGenerateDialogue"
            :loading="isGeneratingDialogue"
            class="ai-generate-btn"
          >
            AI生成
          </van-button>
        </div>
        <van-field
          :model-value="shot.dialogue"
          @update:model-value="$emit('update:shot', { ...shot, dialogue: $event })"
          type="textarea"
          :rows="2"
          autosize
          maxlength="200"
          show-word-limit
          placeholder="该镜头的台词内容"
          class="scene-field"
        />
      </div>
      
      <!-- 配音设置 -->
      <div class="voice-section">
        <div class="section-label">配音设置</div>
        <div class="voice-controls">
          <div v-if="allowDurationSetting" class="voice-duration">
            <span class="duration-label">时长（秒）:</span>
            <van-stepper
              :model-value="shot.duration"
              @update:model-value="$emit('update:shot', { ...shot, duration: $event })"
              :min="1"
              :max="30"
              integer
              class="duration-stepper"
            />
          </div>
          
          <div class="voice-emotion">
            <span class="emotion-label">情感:</span>
            <sdkwork-segmented 
              :model-value="shot.emotion || 'neutral'" 
              @update:model-value="handleEmotionChange"
              :options="emotionOptions" 
              class="emotion-selector"
            />
          </div>
        </div>
      </div>
      
      <!-- 一键生成区域 -->
      <div v-if="showSmartGeneration" class="smart-generation-section">
        <div class="section-label">智能生成</div>
        <div class="smart-generation-buttons">
          <van-button
            type="primary"
            size="small"
            @click="handleSmartGenerateAll"
            :loading="isSmartGenerating"
            class="smart-generate-btn"
          >
            <van-icon name="play-circle" />
            一键生成所有内容
          </van-button>
          <div class="generation-tips">
            <span>自动生成图片、描述和台词</span>
          </div>
        </div>
        
        <!-- 智能生成进度 -->
        <div class="smart-generation-progress" v-if="isSmartGenerating">
          <van-progress :percentage="smartGenerationProgress" :show-pivot="false" stroke-width="4" />
          <div class="progress-info">
            <van-icon name="passed" />
            <span class="step-text">{{ smartGenerationStep }}</span>
          </div>
        </div>
      </div>
      
      <!-- 视频生成结果 -->
      <VideoGeneration
        :shot="shot"
        :index="index"
        :can-generate="contentStatus.hasImages"
        :content-status="contentStatus"
        @update:shot="$emit('update:shot', $event)"
        @generate-video="$emit('generate-video', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { ShotItem, ImageMode } from './types.ts'
import { EMOTION_OPTIONS, IMAGE_MODE_OPTIONS } from './types.ts'
import SdkworkUploaderImage from '@/components/sdkwork-uploader-image/sdkwork-uploader-image.vue'
import VideoGeneration from './VideoGeneration.vue' 

interface Props {
  shot: ShotItem
  index: number
  showDelete?: boolean
  shotsLength: number
  allowDurationSetting?: boolean
  showSmartGeneration?: boolean
}

interface Emits {
  (e: 'update:shot', shot: ShotItem): void
  (e: 'delete', shotId: string): void
  (e: 'generate-image', shotId: string, type: 'single' | 'start' | 'end', prompt: string, images?: any[]): void
  (e: 'generate-video', shotId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  showDelete: true,
  allowDurationSetting: false,
  showSmartGeneration: false
})

const emit = defineEmits<Emits>()

// 本地状态
const imageMode = ref<ImageMode>('single')
const isGeneratingImage = ref(false)
const isRegenerating = ref(false)

const isRegeneratingSingle = ref(false)
const isRegeneratingStart = ref(false)
const isRegeneratingEnd = ref(false)
const isSmartGenerating = ref(false)
const isGeneratingDescription = ref(false)
const isGeneratingDialogue = ref(false)
const smartGenerationProgress = ref(0)
const smartGenerationStep = ref('')

// 上传组件相关状态
const singleImageFiles = ref<File[]>([])
const startFrameFiles = ref<File[]>([])
const endFrameFiles = ref<File[]>([])

// 使用从 types.ts 导入的常量
const modeOptions:any = IMAGE_MODE_OPTIONS
const emotionOptions:any = EMOTION_OPTIONS

// 提示词本地状态
const localPrompt = ref(props.shot.prompt || '')
const localStartPrompt = ref(props.shot.startPrompt || '')
const localEndPrompt = ref(props.shot.endPrompt || '')

// 检查是否有必要的内容
const hasRequiredContent = computed(() => {
  const hasImages = props.shot.image || props.shot.startFrame || props.shot.endFrame
  const hasPrompts = localPrompt.value.trim() || localStartPrompt.value.trim() || localEndPrompt.value.trim()
  const hasDescription = props.shot.videoDescription?.trim()
  const hasDialogue = props.shot.dialogue?.trim()
  
  return hasImages || hasPrompts || hasDescription || hasDialogue
})

// 检查内容完整性
const contentStatus = computed(() => {
  const hasImages = !!(props.shot.image || props.shot.startFrame || props.shot.endFrame)
  const hasPrompts = !!(localPrompt.value.trim() || localStartPrompt.value.trim() || localEndPrompt.value.trim())
  const hasDescription = !!props.shot.videoDescription?.trim()
  const hasDialogue = !!props.shot.dialogue?.trim()
  
  return {
    hasImages,
    hasPrompts,
    hasDescription,
    hasDialogue,
    isComplete: hasImages && hasPrompts && hasDescription && hasDialogue
  }
})

// 获取智能提示
const getSmartTip = () => {
  const status = contentStatus.value
  
  if (!status.hasImages && !status.hasPrompts && !status.hasDescription && !status.hasDialogue) {
    return "请添加图片或输入提示词、描述、台词，然后点击生成按钮"
  } else if (!status.hasImages) {
    return "请添加图片或使用AI生成图片"
  } else if (!status.hasPrompts) {
    return "请在图片上传区域输入提示词，然后点击AI生成"
  } else if (!status.hasDescription) {
    return "请描述该镜头的视频内容（动作、场景变化、镜头运动等）"
  } else if (!status.hasDialogue) {
    return "请输入该镜头的台词内容"
  } else if (!status.isComplete) {
    return "内容已基本完成，可以点击生成视频按钮生成视频"
  }
  
  return ""
}

// 监听shot变化，同步本地状态
watch(() => props.shot, (newShot) => {
  localPrompt.value = newShot.prompt || ''
  localStartPrompt.value = newShot.startPrompt || ''
  localEndPrompt.value = newShot.endPrompt || ''
  
  // 根据图片情况自动切换模式
  if (newShot.image) {
    imageMode.value = 'single'
  } else if (newShot.startFrame || newShot.endFrame) {
    imageMode.value = 'frames'
  }
}, { deep: true })

// 监听本地提示词变化，更新shot
watch(localPrompt, (newPrompt) => {
  emit('update:shot', { ...props.shot, prompt: newPrompt })
})

watch(localStartPrompt, (newPrompt) => {
  emit('update:shot', { ...props.shot, startPrompt: newPrompt })
})

watch(localEndPrompt, (newPrompt) => {
  emit('update:shot', { ...props.shot, endPrompt: newPrompt })
})

// 生成图片
const handleGenerateImage = () => {
  if (imageMode.value === 'single') {
    handleRegenerateImage()
  } else {
    // 在首尾帧模式下，用户需要单独操作首帧和尾帧
    return
  }
}

// 重新生成单图
const handleRegenerateImage = () => {
  if (!localPrompt.value.trim()) {
    return // 提示用户输入提示词
  }
  
  isRegenerating.value = true
  emit('generate-image', props.shot.id, 'single', localPrompt.value)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegenerating.value = false
  }, 2000)
}



// 处理图片点击（放大预览）
const handleImageClick = (type: 'single' | 'start' | 'end') => {
  let imageUrl = ''
  if (type === 'single') {
    imageUrl = props.shot.image || ''
  } else if (type === 'start') {
    imageUrl = props.shot.startFrame || ''
  } else if (type === 'end') {
    imageUrl = props.shot.endFrame || ''
  }
  
  if (imageUrl) {
    // 可以在这里添加图片预览功能
    console.log('预览图片:', imageUrl)
  } else {
    // 如果没有图片，触发生成
    if (type === 'single') {
      handleRegenerateImage()
    } else {
      // 在首尾帧模式下，用户需要单独操作首帧和尾帧
      return
    }
  }
}

// 上传图片成功处理
const handleSingleImageSuccess = (file: File, response: any) => {
  // 假设响应中包含图片URL
  const imageUrl = response.url || URL.createObjectURL(file)
  emit('update:shot', { ...props.shot, image: imageUrl })
  
  // 清空上传组件的文件列表，避免重复上传
  singleImageFiles.value = []
}

// 移除单张图片处理
const handleSingleImageRemove = (file: File) => {
  emit('update:shot', { ...props.shot, image: undefined })
}

// 单张图片预览处理
const handleSingleImagePreview = (file: File, previewUrl: string) => {
  // 这里可以添加图片预览逻辑，如打开全屏预览
  console.log('预览图片:', previewUrl)
}

// 上传首帧成功处理
const handleStartFrameSuccess = (file: File, response: any) => {
  // 假设响应中包含图片URL
  const imageUrl = response.url || URL.createObjectURL(file)
  emit('update:shot', { ...props.shot, startFrame: imageUrl })
  
  // 清空上传组件的文件列表，避免重复上传
  startFrameFiles.value = []
}

// 移除首帧处理
const handleStartFrameRemove = (file: File) => {
  emit('update:shot', { ...props.shot, startFrame: undefined })
}

// 首帧预览处理
const handleStartFramePreview = (file: File, previewUrl: string) => {
  // 这里可以添加图片预览逻辑
  console.log('预览首帧:', previewUrl)
}

// 上传尾帧成功处理
const handleEndFrameSuccess = (file: File, response: any) => {
  // 假设响应中包含图片URL
  const imageUrl = response.url || URL.createObjectURL(file)
  emit('update:shot', { ...props.shot, endFrame: imageUrl })
  
  // 清空上传组件的文件列表，避免重复上传
  endFrameFiles.value = []
}

// 移除尾帧处理
const handleEndFrameRemove = (file: File) => {
  emit('update:shot', { ...props.shot, endFrame: undefined })
}

// 尾帧预览处理
const handleEndFramePreview = (file: File, previewUrl: string) => {
  // 这里可以添加图片预览逻辑
  console.log('预览尾帧:', previewUrl)
}

// 处理情感变化
const handleEmotionChange = (value: string | number | boolean) => {
  // 确保传递的是有效的情感值
  const emotionValue = value.toString() as 'neutral' | 'happy' | 'excited' | 'serious'
  emit('update:shot', { ...props.shot, emotion: emotionValue })
}

// 处理单张图片重新生成
const handleRegenerateSingleImage = () => {
  if (!localPrompt.value.trim()) {
    return // 提示用户输入提示词
  }
  
  isRegeneratingSingle.value = true
  emit('generate-image', props.shot.id, 'single', localPrompt.value)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegeneratingSingle.value = false
  }, 2000)
}

// 处理首帧重新生成
const handleRegenerateStartFrame = () => {
  if (!localStartPrompt.value.trim()) {
    return // 提示用户输入提示词
  }
  
  isRegeneratingStart.value = true
  emit('generate-image', props.shot.id, 'start', localStartPrompt.value)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegeneratingStart.value = false
  }, 2000)
}

// 处理尾帧重新生成
const handleRegenerateEndFrame = () => {
  if (!localEndPrompt.value.trim()) {
    return // 提示用户输入提示词
  }
  
  isRegeneratingEnd.value = true
  emit('generate-image', props.shot.id, 'end', localEndPrompt.value)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegeneratingEnd.value = false
  }, 2000)
}

// 处理提示词更新
const handlePromptUpdate = (value: string) => {
  localPrompt.value = value
}

const handleStartPromptUpdate = (value: string) => {
  localStartPrompt.value = value
}

const handleEndPromptUpdate = (value: string) => {
  localEndPrompt.value = value
}

// 处理AI生成
const handleAiGenerate = (prompt: string) => {
  isRegenerating.value = true
  emit('generate-image', props.shot.id, 'single', prompt)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegenerating.value = false
  }, 2000)
}

const handleStartFrameAiGenerate = (prompt: string) => {
  isRegeneratingStart.value = true
  emit('generate-image', props.shot.id, 'start', prompt)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegeneratingStart.value = false
  }, 2000)
}

const handleEndFrameAiGenerate = (prompt: string) => {
  isRegeneratingEnd.value = true
  emit('generate-image', props.shot.id, 'end', prompt)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegeneratingEnd.value = false
  }, 2000)
}

// 图片AI生成处理函数
const handleImageAiGenerate = (images: any[]) => {
  isRegenerating.value = true
  emit('generate-image', props.shot.id, 'single', '', images)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegenerating.value = false
  }, 2000)
}

const handleStartFrameImageAiGenerate = (images: any[]) => {
  isRegeneratingStart.value = true
  emit('generate-image', props.shot.id, 'start', '', images)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegeneratingStart.value = false
  }, 2000)
}

const handleEndFrameImageAiGenerate = (images: any[]) => {
  isRegeneratingEnd.value = true
  emit('generate-image', props.shot.id, 'end', '', images)
  
  // 模拟生成完成（实际应该通过事件通知）
  setTimeout(() => {
    isRegeneratingEnd.value = false
  }, 2000)
}

// 处理AI生成描述
const handleAiGenerateDescription = () => {
  isGeneratingDescription.value = true
  
  // 模拟AI生成描述的过程
  setTimeout(() => {
    // 这里应该调用实际的AI生成API，现在用模拟数据
    const descriptions = [
      `镜头${props.index + 1}展示了一个精彩的场景，主角缓缓移动，背景随之变化，营造出动态的氛围。`,
      `镜头${props.index + 1}中，摄像机平稳地从左向右移动，捕捉了人物表情的变化和环境的细节。`,
      `镜头${props.index + 1}开始时，人物面向镜头，随后转身走向远方，背景逐渐模糊，创造空间感。`,
      `镜头${props.index + 1}采用俯拍视角，展示了整个场景的全貌，光线从上方投射，形成戏剧性效果。`
    ]
    
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]
    
    // 更新描述
    emit('update:shot', { ...props.shot, videoDescription: randomDescription })
    isGeneratingDescription.value = false
  }, 1500)
}

// 处理AI生成台词
const handleAiGenerateDialogue = () => {
  isGeneratingDialogue.value = true
  
  // 模拟AI生成台词的过程
  setTimeout(() => {
    // 这里应该调用实际的AI生成API，现在用模拟数据
    const dialogues = [
      `镜头${props.index + 1}的台词：这是一段充满情感的表达，展现了角色的内心世界。`,
      `镜头${props.index + 1}的台词：随着场景的变化，人物的话语也显得格外有力。`,
      `镜头${props.index + 1}的台词：简单的一句话，却蕴含了丰富的情感和意义。`,
      `镜头${props.index + 1}的台词：此时无声胜有声，但话语依然能打动人心。`
    ]
    
    const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)]
    
    // 更新台词
    emit('update:shot', { ...props.shot, dialogue: randomDialogue })
    isGeneratingDialogue.value = false
  }, 1500)
}





// 一键生成所有内容
const handleSmartGenerateAll = async () => {
  isSmartGenerating.value = true
  smartGenerationProgress.value = 0
  smartGenerationStep.value = '准备生成...'
  
  // 模拟生成过程
  const steps = [
    { progress: 10, step: '分析场景需求...' },
    { progress: 25, step: '生成场景描述...' },
    { progress: 40, step: '编写台词内容...' },
    { progress: 60, step: '生成场景图片...' },
    { progress: 80, step: '处理图片资源...' },
    { progress: 100, step: '生成完成！' }
  ]
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    smartGenerationStep.value = step.step
    smartGenerationProgress.value = step.progress
    
    // 根据进度更新相应内容
    if (step.progress === 25) {
      // 生成描述
      const autoDescription = `镜头${props.index + 1}的自动生成描述，包含场景动作和变化`
      emit('update:shot', { ...props.shot, videoDescription: autoDescription })
    } else if (step.progress === 40) {
      // 生成台词
      const autoDialogue = `这是镜头${props.index + 1}的自动生成台词内容`
      emit('update:shot', { ...props.shot, dialogue: autoDialogue })
    } else if (step.progress === 60) {
      // 触发图片生成
      if (imageMode.value === 'single') {
        emit('generate-image', props.shot.id, 'single', `镜头${props.index + 1}的场景图片`)
      } else {
        emit('generate-image', props.shot.id, 'start', `镜头${props.index + 1}的首帧图片`)
        setTimeout(() => {
          emit('generate-image', props.shot.id, 'end', `镜头${props.index + 1}的尾帧图片`)
        }, 1000)
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 800))
  }
  
  // 完成后重置状态
  setTimeout(() => {
    isSmartGenerating.value = false
    smartGenerationProgress.value = 0
    smartGenerationStep.value = ''
  }, 500)
}


</script>

<style scoped>
.video-scene-item {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 5px;
  background: #fafafa;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.video-scene-item:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.scene-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.scene-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--van-text-color, #333);
}

.scene-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  min-width: 80px;
}

.scene-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--van-text-color, #333);
  margin-bottom: 10px;
}

/* 图片预览区域 */
.image-preview-section {
  margin-bottom: 8px;
}

.preview-modes {
  margin-bottom: 12px;
}

/* 分段控制器样式已由 Vant 组件库处理 */

.single-image-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-container {
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-container {
  position: relative;
}

.image-container:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

.image-regenerate-btn {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  color: #fff;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 14px;
  gap: 8px;
}

.image-placeholder.small {
  height: 100px;
}

.scene-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-prompt-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prompt-field {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.prompt-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}



.image-uploader-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.image-uploader {
  width: 100%;
}

.uploaded-image-container {
  margin-top: 16px;
}

.image-preview-wrapper {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.uploaded-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.uploaded-image:hover {
  transform: scale(1.02);
}

.image-overlay-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 6px;
}

.image-regenerate-btn,
.image-remove-btn {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
}

/* 首尾帧预览 */
.frames-preview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.frame-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.frame-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--van-text-color, #333);
}

.frame-image-container {
  position: relative;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  cursor: pointer;
}

.frame-image-actions {
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 4px;
}

.frame-regenerate-btn {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 11px;
  color: #fff;
}

.frame-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.frame-prompt {
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}



.frames-uploaders {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.frame-uploader {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uploader-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--van-text-color, #333);
}

.frame-uploader-component {
  width: 100%;
}

/* 各个区域样式 */
.scene-description-section,
.dialogue-section,
.voice-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 带操作按钮的标签样式 */
.section-label-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.ai-generate-btn {
  font-size: 12px;
  padding: 2px 8px;
  height: 24px;
}

.scene-field {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* 配音设置 */
.voice-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voice-duration {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-label {
  font-size: 14px;
  color: #666;
  min-width: 80px;
}

.duration-stepper {
  flex: 1;
}

.voice-emotion {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.emotion-label {
  font-size: 14px;
  color: #666;
}

/* 分段控制器样式已由 Vant 组件库处理 */

.upload-btn {
  flex: 1;
}

/* 智能生成区域 */
.smart-generation-section {
  padding: 12px;
  border-radius: 8px;
  background-color: #f0f9ff;
  margin: 8px 0;
}

.smart-generation-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.smart-generate-btn {
  background: linear-gradient(45deg, #1989fa, #409eff);
  border: none;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
}

.generation-tips {
  font-size: 12px;
  color: #1989fa;
  text-align: center;
}

.smart-generation-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  margin-top: 4px;
}

.progress-text {
  font-size: 13px;
  color: #1989fa;
  text-align: center;
}

.step-text {
  font-size: 13px;
  color: #1989fa;
}

/* 智能提示 */
.smart-tips {
  margin-bottom: 16px;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .video-scene-item {
    border-color: #2d3a4e;
    background-color: #0b0f15;
  }
  
  .scene-header {
    border-bottom-color: #2d3a4e;
  }
  
  .scene-title {
    color: #ffffff;
  }
  
  .section-label {
    color: #ffffff;
  }
  
  .image-container,
  .frame-image-container {
    background-color: #1a2438;
  }
  
  .image-placeholder {
    color: #8fa3c4;
  }
  
  .mode-selector {
    background-color: #2d3a4e;
  }
  
  .scene-field,
  .prompt-field,
  .frame-prompt {
    border-color: #2d3a4e;
    background-color: #1a2438;
    color: #ffffff;
  }
  
  .duration-label,
  .emotion-label,
  .progress-text {
    color: #8fa3c4;
  }
  
  .image-regenerate-btn,
  .frame-regenerate-btn {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  .uploader-title {
    color: #ffffff;
  }
}
</style>