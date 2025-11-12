<template>
  <div class="chat-input-area">
    <!-- 角色选择条 -->
    <div class="character-selector" v-if="characters.length > 0">
      <div class="character-list">
        <CharacterItem
          v-for="character in characters"
          :key="character.id"
          :character="character"
          :selected="selectedCharacterId === character.id"
          @select-character="$emit('select-character', $event)"
          @delete-character="$emit('delete-character', $event)"
        />
        
        <!-- 添加角色按钮 -->
        <div class="character-item add-character" @click="$emit('show-add-character')">
          <div class="character-avatar add">
            <van-icon name="plus" />
          </div>
          <div class="character-name">添加</div>
        </div>
      </div>
    </div>
    
    <!-- 底部输入栏 -->
    <div class="bottom-input-bar">
      <!-- 输入框行 -->
      <div class="input-row">
        <!-- 状态提示 -->
        <div class="status-icon" v-if="characters.length < 2">
          <van-icon name="info-o" />
        </div>
        
        <!-- 输入框容器 -->
        <div class="input-container">
          <!-- 输入框 -->
          <van-field
            v-model="inputTextValue"
            type="textarea"
            :placeholder="placeholder"
            :autosize="autoSize"
            :maxlength="maxLength"
            class="input-field"
            @keydown.enter="handleEnterKey"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
          />
           
        </div>
      </div>
      
      <!-- 工具栏行 -->
      <ChatToolbar
        :characters="characters"
        :input-text="inputText"
        :generating-dialogue="generatingDialogue"
        :generating-video="generatingVideo"
        :has-messages="hasMessages"
        :show-upload-button="showUploadButton"
        :upload-button-text="uploadButtonText"
        @generate-dialogue="$emit('generate-dialogue')"
        @generate-video="handleVideoGenerate"
        @start-speech-input="$emit('start-speech-input')"
        @aspect-ratio-change="$emit('aspect-ratio-change', $event)"
        @media-upload="$emit('media-upload', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DialogueCharacter } from '../types'
import { useTheme } from '@/hooks/theme/useTheme'
import ChatToolbar from './ChatToolbar.vue'
import CharacterItem from './CharacterItem.vue' 

// Props定义
interface Props {
  characters: DialogueCharacter[]
  selectedCharacterId: string
  inputText: string
  generatingDialogue: boolean
  generatingVideo: boolean
  hasMessages: boolean
  showUploadButton?: boolean // 新增：是否显示上传按钮
  uploadButtonText?: string // 新增：上传按钮文本
  placeholder?: string // 新增：输入框占位符
  maxLength?: number // 新增：输入框最大长度
  autoSize?: boolean | { minHeight?: number; maxHeight?: number } // 新增：输入框自动调整大小
}

const props = withDefaults(defineProps<Props>(), {
  selectedCharacterId: '',
  inputText: '',
  generatingDialogue: false,
  generatingVideo: false,
  hasMessages: false,
  showUploadButton: true,
  uploadButtonText: '',
  placeholder: '输入对话内容，如：小明和小红讨论周末计划',
  maxLength: 500,
  autoSize: true
})

// Emits定义
const emit = defineEmits<{
  'select-character': [character: DialogueCharacter]
  'delete-character': [characterId: string]
  'show-add-character': []
  'generate-dialogue': []
  'generate-video': [aspectRatio: string]
  'start-speech-input': []
  'aspect-ratio-change': [aspectRatio: string]
  'update:input-text': [value: string]
  'media-upload': [files: File[]]
}>()

// 输入框焦点状态
const inputFocused = ref(false)

// 主题状态
const { isDarkMode } = useTheme()

// 双向绑定的计算属性
const inputTextValue = computed({
  get: () => props.inputText,
  set: (value: string) => emit('update:input-text', value)
})

// 处理角色选择
const selectCharacter = (character: DialogueCharacter) => {
  emit('select-character', character)
}

// 处理回车键
const handleEnterKey = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault()
    emit('generate-dialogue')
  }
}

// 处理输入框焦点
const handleInputFocus = () => {
  inputFocused.value = true
}

// 处理输入框失焦
const handleInputBlur = () => {
  inputFocused.value = false
}

// 处理视频生成
const handleVideoGenerate = (params: any) => {
  emit('generate-video', params.aspectRatio)
}
</script>

<style scoped>
.chat-input-area {
  position: relative;
  background-color: var(--van-background-2);
  border-top: 1px solid var(--van-border-color);
}

/* 角色选择条样式 */
.character-selector { 
  background-color: var(--van-background-2);
}

.character-list {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 4px;
  scrollbar-width: none; /* Firefox */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
}

.character-list::-webkit-scrollbar {
  display: none; /* WebKit */
}

.character-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--van-background-color);
}

.character-item:hover {
  background-color: var(--van-background-color-light);
}

.character-item.active {
  background-color: var(--van-primary-color);
  color: white;
  box-shadow: 0 2px 6px rgba(var(--van-primary-color-rgb), 0.3);
}

.character-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 4px;
  border: 2px solid var(--van-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--van-gray-1);
}

.character-avatar.add {
  background-color: var(--van-gray-1);
  border-color: var(--van-primary-color);
  color: var(--van-primary-color);
}

.character-item.active .character-avatar {
  border-color: white;
}

.character-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 18px;
  font-weight: bold;
  color: var(--van-gray-6);
}

.character-item.active .avatar-placeholder {
  color: white;
}

.character-name {
  font-size: 12px;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.character-item.active .character-name {
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

/* 底部输入栏样式 */
.bottom-input-bar {
  display: flex;
  flex-direction: column; 
  background-color: var(--van-background-2); 
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--van-warning-color);
  font-size: 20px;
  flex-shrink: 0;
  width: 24px;
}

.input-container {
  flex: 1;
  position: relative;
}

.input-field {
  width: 100%;
}

.char-counter {
  position: absolute;
  bottom: 6px;
  right: 12px;
  font-size: 11px;
  color: var(--van-gray-5);
  background-color: var(--van-background-color);
  padding: 2px 6px;
  border-radius: 1px;
  pointer-events: none;
  z-index: 1;
  transition: opacity 0.2s ease;
  backdrop-filter: blur(4px);
}

/* 深色主题字符计数器样式 */
html[data-theme="dark"] .char-counter {
  color: var(--van-gray-4);
  background-color: rgba(30, 30, 30, 0.8);
}

.input-field :deep(.van-field__control) {
  min-height: 32px;
  max-height: 100px;
  padding: 10px 14px;
  font-size: 15px;
  line-height: 1.5;
  border-radius: 2px;
  background-color: var(--van-background-color);
  border: 1px solid var(--van-border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  resize: none; /* 防止用户调整大小 */
}

/* 深色主题输入框样式 */
html[data-theme="dark"] .input-field :deep(.van-field__control) {
  background-color: var(--van-gray-8);
  border-color: var(--van-gray-7);
  color: var(--van-text-color-2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.input-field :deep(.van-field__control):focus {
  border-color: var(--van-primary-color);
  box-shadow: 0 0 0 2px rgba(var(--van-primary-color-rgb), 0.2);
}

/* 深色主题焦点样式 */
html[data-theme="dark"] .input-field :deep(.van-field__control):focus {
  background-color: var(--van-gray-8);
  border-color: var(--van-primary-color);
  box-shadow: 0 0 0 2px rgba(var(--van-primary-color-rgb), 0.3);
}

.input-field :deep(.van-field__control)::placeholder {
  color: var(--van-gray-5);
  transition: opacity 0.2s ease;
}

.input-field :deep(.van-field__control):focus::placeholder {
  opacity: 0.6;
}

/* 深色主题占位符样式 */
html[data-theme="dark"] .input-field :deep(.van-field__control)::placeholder {
  color: var(--van-gray-6);
}

html[data-theme="dark"] .input-field :deep(.van-field__control):focus::placeholder {
  color: var(--van-gray-7);
  opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .character-avatar {
    width: 36px;
    height: 36px;
  }
  
  .action-icons .van-button {
    width: 36px;
    height: 36px;
  }
}
</style>