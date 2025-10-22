<template>
  <!-- 通话控制按钮 - UnoCSS原子化风格 -->
  <div class="fixed bottom-8 left-0 right-0 flex justify-center z-100 px-0">
    <div 
      class="flex gap-6 rounded-50px px-9 py-5 items-center max-w-95% min-w-95% backdrop-blur-xl border border-white/20 shadow-lg transition-all duration-300 ease-in-out"
      :style="{
        background: `linear-gradient(135deg, 
          rgba(var(--primary-rgb), 0.95) 0%,
          rgba(var(--secondary-rgb), 0.85) 50%,
          rgba(var(--accent-rgb), 0.75) 100%)`
      }"
    >
      <!-- 麦克风控制 -->
      <div class="flex flex-col items-center cursor-pointer transition-all duration-300 ease-out relative hover:transform hover:scale-105" @click="toggleMicrophone">
        <div 
          class="w-15 h-15 rounded-50% flex items-center justify-center transition-all duration-300 ease-out border border-white/20 hover:bg-[rgba(var(--primary-rgb),0.6)] hover:text-white hover:scale-110"
          :class="[
            isMicrophoneOn 
              ? 'bg-gradient-to-br from-[var(--active)] to-[var(--primary)] text-white shadow-lg hover:bg-gradient-to-br hover:from-[var(--hover)] hover:to-[var(--active)] hover:shadow-xl' 
              : 'bg-[rgba(var(--primary-rgb),0.3)] text-white/90'
          ]"
        >
          <Icon :icon="isMicrophoneOn ? 'mingcute:mic-fill' : 'mingcute:mic-off-fill'" width="24" height="24" />
        </div>
      </div>
      
      <!-- 扬声器控制 -->
      <div class="flex flex-col items-center cursor-pointer transition-all duration-300 ease-out relative hover:transform hover:scale-105" @click="toggleSpeaker">
        <div 
          class="w-15 h-15 rounded-50% flex items-center justify-center transition-all duration-300 ease-out border border-white/20 hover:bg-[rgba(var(--primary-rgb),0.6)] hover:text-white hover:scale-110"
          :class="[
            isSpeakerOn 
              ? 'bg-gradient-to-br from-[var(--active)] to-[var(--primary)] text-white shadow-lg hover:bg-gradient-to-br hover:from-[var(--hover)] hover:to-[var(--active)] hover:shadow-xl' 
              : 'bg-[rgba(var(--primary-rgb),0.3)] text-white/90'
          ]"
        >
          <Icon :icon="isSpeakerOn ? 'mingcute:volume-fill' : 'mingcute:volume-off-fill'" width="24" height="24" />
        </div>
      </div>
      
      <!-- 切换摄像头 -->
      <div class="flex flex-col items-center cursor-pointer transition-all duration-300 ease-out relative hover:transform hover:scale-105" @click="toggleCamera">
        <div 
          class="w-15 h-15 rounded-50% flex items-center justify-center transition-all duration-300 ease-out border border-white/20 hover:bg-[rgba(var(--primary-rgb),0.6)] hover:text-white hover:scale-110"
          :class="[
            isCameraOn 
              ? 'bg-gradient-to-br from-[var(--active)] to-[var(--primary)] text-white shadow-lg hover:bg-gradient-to-br hover:from-[var(--hover)] hover:to-[var(--active)] hover:shadow-xl' 
              : 'bg-[rgba(var(--primary-rgb),0.3)] text-white/90'
          ]"
        >
          <Icon :icon="isCameraOn ? 'mingcute:camera-2-ai-fill' : 'mingcute:camera-2-off-line'" width="24" height="24" />
        </div>
      </div>
      
      <!-- 挂断按钮 -->
      <div class="flex flex-col items-center cursor-pointer transition-all duration-300 ease-out relative hover:transform hover:scale-105" @click="endCall">
        <div class="w-15 h-15 rounded-50% flex items-center justify-center bg-gradient-to-br from-#FF3B30 to-#FF6B6B text-white shadow-lg border border-white/20 hover:bg-gradient-to-br hover:from-#FF1A1A hover:to-#FF4D4D hover:shadow-xl hover:scale-110">
          <Icon icon="mingcute:close-line" width="24" height="24" />
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

<style>
:root {
  --primary: #2196F3;
  --secondary: #03A9F4;
  --accent: #00BCD4;
  --active: #0077FF;
  --hover: #0066CC;
  --hangup: #FF3B30;
  
  --primary-rgb: 33, 150, 243;
  --secondary-rgb: 3, 169, 244;
  --accent-rgb: 0, 188, 212;
  --active-rgb: 0, 119, 255;
}
</style>