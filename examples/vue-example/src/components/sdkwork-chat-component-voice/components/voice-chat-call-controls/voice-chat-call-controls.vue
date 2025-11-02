<template>
  <!-- 通话控制按钮 - 自定义样式 -->
  <div class="voice-call-controls" key="voice-chat-call-controls">
    <div class="controls-container">
      <!-- 麦克风控制 -->
      <div class="control-item" @click="toggleMicrophone">
        <div class="control-button" :class="{ active: isMicrophoneOn }">
          <Icon :icon="isMicrophoneOn ? 'mingcute:mic-fill' : 'mingcute:mic-off-fill'" class="control-icon" />
        </div>
      </div>
      
      <!-- 扬声器控制 -->
      <div class="control-item" @click="toggleSpeaker">
        <div class="control-button" :class="{ active: isSpeakerOn }">
          <Icon :icon="isSpeakerOn ? 'mingcute:volume-fill' : 'mingcute:volume-off-fill'" class="control-icon" />
        </div>
      </div>
      
      <!-- 切换摄像头 -->
      <div class="control-item" @click="toggleCamera">
        <div class="control-button" :class="{ active: isCameraOn }">
          <Icon :icon="isCameraOn ? 'mingcute:camera-2-ai-fill' : 'mingcute:camera-2-off-line'" class="control-icon" />
        </div>
      </div>
      
      <!-- 挂断按钮 -->
      <div class="control-item" @click="endCall">
        <div class="control-button hangup">
          <Icon icon="mingcute:close-line" class="control-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  selectedBackground?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedBackground: 'default'
})

// 控制状态
const isMicrophoneOn = ref(true)
const isSpeakerOn = ref(true)
const isCameraOn = ref(true)

// 事件发射器
const emit = defineEmits<{
  'microphone-toggle': [value: boolean]
  'speaker-toggle': [value: boolean]
  'camera-toggle': [value: boolean]
  'call-end': []
}>()

// 根据背景主题计算颜色
const themeColors = computed(() => {
  switch (props.selectedBackground) {
    case 'blue':
      return {
        primary: '#2196F3',
        secondary: '#03A9F4',
        accent: '#00BCD4',
        active: '#0077FF',
        hover: '#0066CC',
        hangup: '#FF3B30'
      }
    case 'purple':
      return {
        primary: '#9C27B0',
        secondary: '#BA68C8',
        accent: '#E1BEE7',
        active: '#8E24AA',
        hover: '#7B1FA2',
        hangup: '#FF3B30'
      }
    case 'green':
      return {
        primary: '#4CAF50',
        secondary: '#66BB6A',
        accent: '#81C784',
        active: '#43A047',
        hover: '#388E3C',
        hangup: '#FF3B30'
      }
    case 'orange':
      return {
        primary: '#FF9800',
        secondary: '#FFB74D',
        accent: '#FFCC80',
        active: '#FB8C00',
        hover: '#F57C00',
        hangup: '#FF3B30'
      }
    default:
      return {
        primary: '#2196F3',
        secondary: '#03A9F4',
        accent: '#00BCD4',
        active: '#0077FF',
        hover: '#0066CC',
        hangup: '#FF3B30'
      }
  }
})

// 将十六进制颜色转换为RGB字符串
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '33, 150, 243' // 默认值
}

// 监听背景变化并更新CSS变量
watch(() => props.selectedBackground, () => {
  const colors = themeColors.value
  
  // 更新CSS变量
  const root = document.documentElement
  root.style.setProperty('--primary', colors.primary)
  root.style.setProperty('--secondary', colors.secondary)
  root.style.setProperty('--accent', colors.accent)
  root.style.setProperty('--active', colors.active)
  root.style.setProperty('--hover', colors.hover)
  root.style.setProperty('--hangup', colors.hangup)
  
  // 设置RGB值用于透明度
  const primaryRgb = hexToRgb(colors.primary)
  const secondaryRgb = hexToRgb(colors.secondary)
  const accentRgb = hexToRgb(colors.accent)
  const activeRgb = hexToRgb(colors.active)
  
  root.style.setProperty('--primary-rgb', primaryRgb)
  root.style.setProperty('--secondary-rgb', secondaryRgb)
  root.style.setProperty('--accent-rgb', accentRgb)
  root.style.setProperty('--active-rgb', activeRgb)
}, { immediate: true })

// 控制方法
const toggleMicrophone = () => {
  isMicrophoneOn.value = !isMicrophoneOn.value
  emit('microphone-toggle', isMicrophoneOn.value)
}

const toggleSpeaker = () => {
  isSpeakerOn.value = !isSpeakerOn.value
  emit('speaker-toggle', isSpeakerOn.value)
}

const toggleCamera = () => {
  isCameraOn.value = !isCameraOn.value
  emit('camera-toggle', isCameraOn.value)
}

const endCall = () => {
  emit('call-end')
}
</script>

<style scoped>
.voice-call-controls {
  position: fixed;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 100;
  padding: 0 1rem;
  pointer-events: none;
}

.controls-container {
  display: flex;
  gap: 1rem;
  border-radius: 50px;
  padding: 1rem 1.5rem;
  align-items: center;
  justify-content: center;
  max-width: 95%;
  min-width: 95%;
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  background: linear-gradient(135deg, 
    rgba(var(--primary-rgb), 0.95) 0%,
    rgba(var(--secondary-rgb), 0.85) 50%,
    rgba(var(--accent-rgb), 0.75) 100%);
  transform: translateZ(0);
  pointer-events: auto;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease-out;
  position: relative;
}

.control-item:hover {
  transform: scale(1.05);
}

.control-button {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(var(--primary-rgb), 0.3);
  color: rgba(255, 255, 255, 0.9);
}

.control-button.active {
  background: linear-gradient(135deg, var(--active), var(--primary));
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.control-button:hover {
  background: rgba(var(--primary-rgb), 0.6);
  color: white;
  transform: scale(1.1);
}

.control-button.active:hover {
  background: linear-gradient(135deg, var(--hover), var(--active));
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.control-button.hangup {
  background: linear-gradient(135deg, #FF3B30, #FF6B6B);
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.control-button.hangup:hover {
  background: linear-gradient(135deg, #FF1A1A, #FF4D4D);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  transform: scale(1.1);
}

.control-icon {
  width: 20px;
  height: 20px;
}
 
</style>