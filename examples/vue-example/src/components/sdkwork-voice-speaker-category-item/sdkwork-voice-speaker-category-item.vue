<template>
  <div
    class="voice-item"
    :class="[{
      'active': active
    }, themeClass]"
    @click="handleSelect"
  >
    <!-- 头像 -->
    <div class="avatar">
      <img :src="speaker.avatar" :alt="speaker.name" v-if="speaker.avatar" />
      <div class="avatar-placeholder" v-else>
        {{ getInitials(speaker.name) }}
      </div>
    </div>
    
    <!-- 信息区域 -->
    <div class="info">
      <div class="name-section">
        <span class="name">{{ speaker.name }}</span>
        <!-- 试听按钮 -->
        <div class="preview-btn" @click.stop="handlePreview">
          <van-icon name="play-circle" size="18" />
        </div>
      </div>
      <div class="description">{{ speaker.description }}</div>
      <div class="meta">
        <span class="language">{{ speaker.language }}</span>
        <span class="gender">{{ getGenderText(speaker.gender) }}</span>
      </div>
    </div>
    
    <!-- 选中状态指示器 -->
    <div class="selection-indicator" v-if="active">
      <van-icon name="success" size="16" color="#1989fa" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAudioStore } from '@/stores/modules/audio' 
import { VoiceSpeakerVO } from '@/services'

// Props 定义 - 参考 sdkwork-cell 的主题处理方式
interface Props {
  speaker: VoiceSpeakerVO
  active: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

interface Emits {
  (e: 'select', speaker: VoiceSpeakerVO): void
}

const props = withDefaults(defineProps<Props>(), {
  themeMode: 'auto'
})

const emit = defineEmits<Emits>()

const audioStore = useAudioStore()

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
  return isDarkMode.value ? 'voice-item--dark' : 'voice-item--light'
})

// 获取名称首字母
const getInitials = (name: string): string => {
  return name.charAt(0).toUpperCase()
}

// 获取性别文本
const getGenderText = (gender: string): string => {
  return gender === 'male' ? '男声' : '女声'
}

// 选择发音人
const handleSelect = () => {
  emit('select', props.speaker)
}

// 试听发音人声音
const handlePreview = () => {
  audioStore.previewSpeaker(props.speaker)
}
</script>

<style scoped lang="scss">
.voice-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--voice-item-border-color, #f0f0f0);
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  
  // CSS 变量系统 - 参考 sdkwork-cell 的主题处理方式
  --voice-item-bg: #ffffff;
  --voice-item-bg-hover: #f5f5f5;
  --voice-item-bg-active: #f0f8ff;
  --voice-item-border-color: #f0f0f0;
  --voice-item-text-color: #333333;
  --voice-item-text-secondary: #666666;
  --voice-item-text-meta: #999999;
  --voice-item-primary-color: #1989fa;
  --voice-item-meta-bg: #f5f5f5;
  
  background: var(--voice-item-bg);
  color: var(--voice-item-text-color);
}

.voice-item:hover {
  background: var(--voice-item-bg-hover);
}

.voice-item.active {
  background: var(--voice-item-bg-active);
}

.name-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.preview-btn {
  color: var(--voice-item-primary-color);
  cursor: pointer;
  flex-shrink: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--voice-item-primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.info {
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 16px;
  font-weight: 500;
  color: var(--voice-item-text-color);
  margin-bottom: 4px;
}

.description {
  font-size: 12px;
  color: var(--voice-item-text-secondary);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  display: flex;
  gap: 8px;
}

.language, .gender {
  font-size: 11px;
  color: var(--voice-item-text-meta);
  background: var(--voice-item-meta-bg);
  padding: 2px 6px;
  border-radius: 10px;
}

.selection-indicator {
  margin-left: 8px;
  flex-shrink: 0;
}

// 深色主题适配
.voice-item--dark {
  --voice-item-bg: #1a1a1a;
  --voice-item-bg-hover: #2a2a2a;
  --voice-item-bg-active: #1a3a5a;
  --voice-item-border-color: #3a3a3a;
  --voice-item-text-color: #ffffff;
  --voice-item-text-secondary: #a0a0a0;
  --voice-item-text-meta: #8c8c8c;
  --voice-item-primary-color: #4a9eff;
  --voice-item-meta-bg: #2a2a2a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .voice-item {
    padding: 10px 12px;
  }
  
  .avatar {
    width: 36px;
    height: 36px;
  }
  
  .name {
    font-size: 15px;
  }
  
  .description {
    font-size: 11px;
  }
}
</style>