<template>
  <div 
    class="agent-create"
    :class="themeClass"
  >
    <!-- Header区域 - 头像和基本信息 -->
    <div class="header-section">
      <!-- 头像上传 - 顶部居中 -->
      <div class="avatar-container">
        <SdkworkAvatar
          v-model="avatarUrl"
          :size="80"
          :uploadable="true"
          :show-ai-generate="false"
          :round="true"
          text="头像"
          :theme-mode="themeMode"
          @upload="handleAvatarUpload"
          @click="handleAvatarClick"
          class="avatar-uploader"
        />
      </div>
      
      <!-- 名称输入 - 单独一行 -->
      <sdkwork-cell-group class="name-section" :theme-mode="themeMode">
        <div class="name-field-wrapper">
          <van-field
            v-model="form.name"
            placeholder="请输入智能体名称"
            :maxlength="20"
            :error-message="nameError"
            size="large"
            @blur="validateName" 
            center
          />
          <div class="char-count-bottom">
            <span :class="['char-count', { 'error': form.name.length > 20 }]">
              {{ form.name.length }}/20
            </span>
          </div>
        </div>
      </sdkwork-cell-group>
    </div>

    <!-- 名称和角色设定分组 -->
    <sdkwork-cell-group class="basic-info-section" :theme-mode="themeMode">
      <!-- 提示词编辑 -->
      <div class="prompt-field-wrapper">
        <van-field
          v-model="form.prompt.content"
          label="提示词"
          label-align="top"
          type="textarea"
          placeholder="请输入角色提示词"
          :autosize="{ minHeight: 100, maxHeight: 200 }"
          :maxlength="1000"
        />
        <div class="char-count-bottom">
          <span class="char-count">
            {{ form.prompt.content?.length || 0 }}/1000
          </span>
        </div>
      </div>
 
    </sdkwork-cell-group>

    <!-- 声音设置分组 -->
    <sdkwork-cell-group class="voice-section" :theme-mode="themeMode">
      <!-- 声音选择器 -->
      <sdkwork-cell title="发音人" center is-link @click="showVoicePopup = true" :theme-mode="themeMode">
        <template #value>
          <div class="voice-selector">
            <van-icon name="music" class="voice-icon" />
            <span v-if="form.speechConfig?.speakerConfig?.speaker" class="selected-voice">
              {{ form.speechConfig.speakerConfig.speaker.displayName }}
            </span>
            <span v-else class="placeholder">请选择发音人</span>
          </div>
        </template>
      </sdkwork-cell>

      <!-- 描述输入 -->
      <div class="description-field-wrapper">
        <van-field
          v-model="form.description"
          label="描述"
          label-align="top"
          type="textarea"
          placeholder="请输入智能体描述"
          :maxlength="200"
          :autosize="{ minHeight: 80, maxHeight: 120 }"
          :error-message="descriptionError"
        />
        <div class="char-count-bottom">
          <span :class="['char-count', { 'error': form.description.length > 200 }]">
            {{ form.description.length }}/200
          </span>
        </div>
      </div>
    </sdkwork-cell-group>

    <!-- 其他设置 - 默认折叠 -->
    <sdkwork-collapse v-model="activeCollapse" class="other-settings-section" :theme-mode="themeMode">
      <sdkwork-collapse-item title="其他设置" name="other" :theme-mode="themeMode">
        <!-- 默认开场白 -->
        <div class="welcome-field-wrapper">
          <van-field
            v-model="form.baseConfig!.welcome"
            label="默认开场白"
            label-align="top"
            type="textarea"
            placeholder="请输入默认开场白"
            :autosize="{ minHeight: 80, maxHeight: 120 }"
            :maxlength="500"
          />
          <div class="char-count-bottom">
            <span class="char-count">
              {{ form.baseConfig?.welcome?.length || 0 }}/500
            </span>
          </div>
        </div>

        <!-- 隐私设置 -->
        <sdkwork-cell-group :theme-mode="themeMode">
          <!-- 公开/私有切换 -->
          <sdkwork-cell title="公开智能体" center :theme-mode="themeMode">
            <template #value>
              <van-switch v-model="form.isPublic" size="20" />
            </template>
          </sdkwork-cell>

          <!-- 权限管理 -->
          <sdkwork-cell v-if="form.isPublic" title="权限设置" center is-link @click="showPermissionPicker = true" :theme-mode="themeMode">
            <template #value>
              <span class="permission-value">
                {{ getPermissionText(form.permissions) || '请选择权限' }}
              </span>
            </template>
          </sdkwork-cell>
          
          <!-- 权限选择器 -->
          <sdkwork-popup v-model:show="showPermissionPicker" position="bottom" round :theme-mode="themeMode">
            <van-picker
              :columns="permissionOptions"
              v-model="selectedPermission"
              @confirm="handlePermissionConfirm"
              @cancel="showPermissionPicker = false"
              title="选择权限"
            />
          </sdkwork-popup>
        </sdkwork-cell-group>
      </sdkwork-collapse-item>
    </sdkwork-collapse>

    <!-- 底部操作栏 -->
    <div class="bottom-action-bar">
      <van-button 
        type="primary" 
        size="large" 
        block
        :loading="submitting"
        :disabled="!formValid"
        @click="handleSubmit"
        class="create-button"
      >
        创建智能体
      </van-button>
    </div>
 

    <!-- 声音选择弹出层 -->
    <SdkworkVoiceListPopup
      v-model="showVoicePopup"
      title="选择发音人"
      :height="popupHeight"
      :selected-speaker-id="form.speechConfig?.speakerConfig?.speaker?.id"
      :theme-mode="themeMode"
      @confirm="handleVoiceConfirm"
      @close="showVoicePopup = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { showToast } from 'vant' 
import type { AiPrompt, SpeechConfig } from '@/types/agent'
import type { VoiceSpeakerInfo } from '@/types/agent'  
import SdkworkVoiceListPopup from '@/components/sdkwork-voice-speaker-category-list-popup/sdkwork-voice-speaker-category-list-popup.vue'
import SdkworkAvatar from '@/components/sdkwork-avatar/sdkwork-avatar.vue'
import { AgentService, VoiceSpeakerVO } from '@/services' 

// Props 定义 - 参考 sdkwork-cell 的主题处理方式
interface Props {
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 智能体创建成功 */
  'agent-created': [agentData: any]
  /** 智能体创建取消 */
  'agent-canceled': []
}>()

// 表单数据类型定义
export interface AgentForm {
  // 基本信息
  name: string
  description: string
  icon?: string
  tags?: any
  
  // 媒体资源
  faceImage?: any
  faceVideo?: any
  
  // 角色设定
  prompt: AiPrompt
  greeting?: string
  
  // 声音配置
  speechConfig?: SpeechConfig
  
  // 基础配置
  baseConfig?: {
    welcome?: string
    questions?: string[]
    saveFiles?: boolean
    enableMemory?: boolean
    maxHistoryMessages?: number
    useKnowledgeBase?: boolean
    properties?: Record<string, any>
  }
  
  // 隐私设置
  isPublic: boolean
  permissions: string[]
  
  // 其他配置
  type?: number
  status?: number
  knowledgeConfig?: any
  memoryConfig?: any
  toolConfig?: any
  chatOptions?: any
}

// Dark mode support - 参考 sdkwork-cell 的主题处理方式
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-agent-create--dark' : 'sdkwork-agent-create--light'
})

// 响应式数据
const submitting = ref(false)
const showVoicePopup = ref(false)
const showPermissionPicker = ref(false)
const activeCollapse = ref<string[]>([])
const nameError = ref('')
const descriptionError = ref('')
const selectedPermission = ref(['view'])
const agentService = new AgentService()

// 弹出层高度 - 兼容微信浏览器dvh支持
const popupHeight = computed(() => {
  if (typeof window !== 'undefined' && window.$getHeightVH) {
    return window.$getHeightVH(100)
  }
  // 默认使用dvh，如果window对象不可用
  return '100dvh'
})
 
// 权限选项
const permissionOptions = [
  { text: '查看', value: 'view' },
  { text: '交互', value: 'interact' },
  { text: '分享', value: 'share' }
]
  

// 头像URL（独立管理）
const avatarUrl = ref('')

// 表单数据
const form = reactive<AgentForm>({
  name: '',
  description: '',
  isPublic: false,
  permissions: [],
  prompt: {
    content: ''
  },
  greeting: '',
  baseConfig: {
    welcome: '',
    questions: [],
    saveFiles: false,
    enableMemory: false,
    maxHistoryMessages: 50,
    useKnowledgeBase: false,
    properties: {}
  }
})

// 表单验证状态
const formValid = computed(() => {
  return form.name.trim() && form.name.length <= 20 && 
         form.description.length <= 200
})

// 验证名称
const validateName = () => {
  if (!form.name.trim()) {
    nameError.value = '名称不能为空'
  } else if (form.name.length > 20) {
    nameError.value = '名称不能超过20个字符'
  } else {
    nameError.value = ''
  }
}

// 头像上传处理
const handleAvatarUpload = (file: File) => {
  console.log('头像上传:', file)
  form.faceImage = {
    url: avatarUrl.value,
    type: 1, // IMAGE类型
    size: file.size
  }
  showToast('头像上传成功')
}

// 头像点击处理
const handleAvatarClick = () => {
  console.log('头像被点击')
}

// 声音确认
const handleVoiceConfirm = (speaker: VoiceSpeakerVO) => {
  // 将VoiceSpeaker转换为VoiceSpeakerInfo类型
  const speakerInfo: VoiceSpeakerInfo = {
    id: speaker.id?.toString(),
    displayName: speaker.name,
    description: speaker.description,
    provider: 'default',
    product: 'default',
    model: 'default',
    voice: speaker.name
  }
  
  form.speechConfig = {
    speakerConfig: {
      speaker: speakerInfo
    }
  }
  showVoicePopup.value = false
  showToast(`已选择: ${speaker.name}`)
}

// 获取权限文本
const getPermissionText = (permissions: string[]) => {
  if (!permissions || permissions.length === 0) return ''
  const option = permissionOptions.find(opt => opt.value === permissions[0])
  return option ? option.text : ''
}

// 权限确认
const handlePermissionConfirm = (value: any) => {
  console.log('Picker返回的值:', value)
  
  // 处理picker返回的值
  let selectedValue
  if (Array.isArray(value)) {
    selectedValue = value[0]
  } else if (value && typeof value === 'object') {
    selectedValue = value
  } else {
    // 如果value是字符串，直接使用
    selectedValue = { text: value, value: value }
  }
  
  form.permissions = selectedValue.value || selectedValue
  showPermissionPicker.value = false
  showToast(`已选择: ${selectedValue.text || selectedValue}`)
}



// 表单提交
const handleSubmit = async () => {
  // 最终验证
  validateName()
  if (nameError.value || !form.name.trim()) {
    showToast('请完善基本信息')
    return
  }

  submitting.value = true
  
  try {
    // 确保faceImage包含最新的avatarUrl
    if (avatarUrl.value && !form.faceImage) {
      form.faceImage = {
        url: avatarUrl.value,
        type: 1,
        size: 0
      }
    }

    // 使用AgentService创建智能体
    const agentParams:any = {
      name: form.name,
      description: form.description,
      faceImage: form.faceImage,
      faceVideo: form.faceVideo,
      icon: form.icon,
      tags: form.tags,
      prompt: form.prompt,
      greeting: form.greeting,
      speechConfig: form.speechConfig,
      isPublic: form.isPublic,
      permissions: form.permissions,
      baseConfig: form.baseConfig,
      type: form.type,
      status: form.status,
      knowledgeConfig: form.knowledgeConfig,
      memoryConfig: form.memoryConfig,
      toolConfig: form.toolConfig,
      chatOptions: form.chatOptions
    }
    
    agentService.create(agentParams)
    
    showToast('智能体创建成功')
    console.log('智能体创建成功，提交的数据:', agentParams)
    
  } catch (error) {
    console.error('智能体创建失败:', error)
    showToast('创建失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  /** 重置表单 */
  resetForm: () => {
    avatarUrl.value = ''
    Object.assign(form, {
      name: '',
      description: '',
      faceImage: undefined,
      faceVideo: undefined,
      icon: undefined,
      tags: undefined,
      prompt: {
        content: ''
      },
      greeting: '',
      speechConfig: undefined,
      isPublic: false,
      permissions: [],
      baseConfig: {
        welcome: '',
        questions: [],
        saveFiles: false,
        enableMemory: false,
        maxHistoryMessages: 50,
        useKnowledgeBase: false,
        properties: {}
      }
    })
    activeCollapse.value = []
  },
  
  /** 获取表单数据 */
  getFormData: () => form,
  
  /** 设置表单数据 */
  setFormData: (data: Partial<AgentForm>) => {
    Object.assign(form, data)
  }
})
</script>

<style scoped lang="scss">
.agent-create {
  min-height: 100dvh; 
  padding-bottom: 100px;
  
  // CSS 变量系统 - 参考 sdkwork-cell 的主题处理方式
  --sdkwork-agent-create-bg: #f5f5f5;
  --sdkwork-agent-create-section-bg: #ffffff;
  --sdkwork-agent-create-field-bg: #ffffff;
  --sdkwork-agent-create-text-color: #323233;
  --sdkwork-agent-create-text-secondary: #969799;
  --sdkwork-agent-create-border-color: #f0f0f0;
  --sdkwork-agent-create-primary-color: #1989fa;
  --sdkwork-agent-create-error-color: #ee0a24;
  
  // 深色主题变量 - 优化对比度
  &.sdkwork-agent-create--dark {
    --sdkwork-agent-create-bg: #0f0f0f;
    --sdkwork-agent-create-section-bg: #1a1a1a;
    --sdkwork-agent-create-field-bg: #242424;
    --sdkwork-agent-create-text-color: #ffffff;
    --sdkwork-agent-create-text-secondary: #a0a0a0;
    --sdkwork-agent-create-border-color: #404040;
    --sdkwork-agent-create-primary-color: #4a9eff;
    --sdkwork-agent-create-error-color: #ff6b6b;
  }
}

.header-section {
  margin-bottom: 16px;
  text-align: center;
}

.avatar-container {
  padding: 20px 0;
  background: var(--sdkwork-agent-create-section-bg);
  margin-bottom: 0;
}

.avatar-uploader {
  display: inline-block;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--sdkwork-agent-create-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid var(--sdkwork-agent-create-border-color);
}

.name-section {
  margin-top: 0;
  border-top: none;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
  
.basic-info-section,
.voice-section,
.other-settings-section {
  margin-bottom: 16px;
}

/* 输入框包装器样式 */
.name-field-wrapper,
.prompt-field-wrapper,
.description-field-wrapper,
.welcome-field-wrapper {
  position: relative;
}

/* 底部字数显示样式 */
.char-count-bottom {
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px 0;
  margin-top: -4px;
}

.char-count {
  font-size: 12px;
  color: var(--sdkwork-agent-create-text-secondary);
}

.char-count.error {
  color: var(--sdkwork-agent-create-error-color);
}

.voice-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.voice-icon {
  color: var(--sdkwork-agent-create-primary-color);
  font-size: 16px;
}

.selected-voice {
  color: var(--sdkwork-agent-create-text-color);
  font-weight: 500;
}

.placeholder {
  color: var(--sdkwork-agent-create-text-secondary);
  font-size: 14px;
}

.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--sdkwork-agent-create-section-bg);
  padding: 8px 16px;
  border-top: 1px solid var(--sdkwork-agent-create-border-color);
}

.create-button {
  background: var(--sdkwork-agent-create-primary-color);
  border: none;
  font-size: 16px;
  font-weight: 500;
}

.permission-value {
  color: var(--sdkwork-agent-create-text-color);
  font-size: 14px;
}

.form-status {
  padding: 8px 16px;
  text-align: center;
}

// 深色主题适配
.sdkwork-agent-create--dark {
  // 适配 Vant 组件在深色主题下的样式
  :deep(.van-field) {
    background: var(--sdkwork-agent-create-field-bg);
    color: var(--sdkwork-agent-create-text-color);
    
    .van-field__label {
      color: var(--sdkwork-agent-create-text-color);
    }
    
    .van-field__control {
      background: var(--sdkwork-agent-create-field-bg);
      color: var(--sdkwork-agent-create-text-color);
      
      &::placeholder {
        color: var(--sdkwork-agent-create-text-secondary);
      }
    }
  }
  
  :deep(.van-cell-group) {
    background: var(--sdkwork-agent-create-section-bg);
  }
  
  :deep(.van-cell) {
    background: var(--sdkwork-agent-create-section-bg);
    color: var(--sdkwork-agent-create-text-color);
    
    &::after {
      border-color: var(--sdkwork-agent-create-border-color);
    }
  }
  
  :deep(.van-collapse-item) {
    .van-collapse-item__title {
      background: var(--sdkwork-agent-create-section-bg);
      color: var(--sdkwork-agent-create-text-color);
      
      &::after {
        border-color: var(--sdkwork-agent-create-border-color);
      }
    }
    
    .van-collapse-item__content {
      background: var(--sdkwork-agent-create-section-bg);
      color: var(--sdkwork-agent-create-text-color);
    }
  }
  
  :deep(.van-popup) {
    background: var(--sdkwork-agent-create-section-bg);
    color: var(--sdkwork-agent-create-text-color);
  }
  
  :deep(.van-picker) {
    background: var(--sdkwork-agent-create-section-bg);
    color: var(--sdkwork-agent-create-text-color);
    
    .van-picker__toolbar {
      background: var(--sdkwork-agent-create-section-bg);
      color: var(--sdkwork-agent-create-text-color);
      
      &::after {
        border-color: var(--sdkwork-agent-create-border-color);
      }
    }
    
    .van-picker__columns {
      background: var(--sdkwork-agent-create-section-bg);
    }
    
    .van-picker-column {
      color: var(--sdkwork-agent-create-text-color);
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .agent-create {
    padding-bottom: 80px;
  }
  
  .avatar-preview {
    width: 50px;
    height: 50px;
  }
  
  .name-field :deep(.van-field__control) {
    font-size: 16px;
  }
}
</style>