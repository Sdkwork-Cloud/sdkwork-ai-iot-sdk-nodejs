<template>
  <div class="recorder-top-bar" :class="[themeClass, mobileClass]">
    <!-- 左侧按钮区域 -->
    <div class="top-bar-left">
      <!-- 返回按钮 -->
      <button v-if="showBackButton" class="back-btn" @click="handleBackClick" title="返回">
        <sdkwork-icon icon="material-symbols:arrow-back-ios-new-rounded" width="20" height="20" />
      </button>
    </div>

    <!-- 右侧按钮区域 -->
    <div class="top-bar-right">
      <!-- 查看录播记录按钮 -->
      <button v-if="showRecordList" class="record-list-btn" @click="handleShowRecordList" title="查看录播记录">
        <sdkwork-icon icon="material-symbols:playlist-play-rounded" width="20" height="20" />
        <span>录制记录</span>
      </button>

      <!-- 设置按钮 -->
      <button 
        v-if="showSettingButton" 
        class="setting-btn"
        @click="handleSettingClick"
        title="设置"
      >
        <sdkwork-icon icon="material-symbols:settings-rounded" width="20" height="20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RecorderConfig } from '../../../stores/modules/recorder/types' 

interface Props {
  /** 录制器配置 */
  config: RecorderConfig
  /** 是否显示录制列表 */
  showRecordList?: boolean
  /** 是否显示设置按钮 */
  showSettingButton?: boolean
  /** 是否显示返回按钮 */
  showBackButton?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 是否启用移动端优化 */
  mobileOptimized?: boolean
}

interface Emits {
  /** 返回按钮点击事件 */
  (e: 'back'): void
  /** 显示录制列表事件 */
  (e: 'show-record-list'): void
  /** 配置更新事件 */
  (e: 'update:config', config: RecorderConfig): void
  /** 设置按钮点击事件 */
  (e: 'setting-click'): void
}

const props = withDefaults(defineProps<Props>(), {
  showRecordList: true,
  showSettingButton: true,
  showBackButton: false,
  themeMode: 'auto',
  mobileOptimized: true
})

const emit = defineEmits<Emits>()

// 主题检测
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 移动端检测
const isMobile = computed(() => {
  if (!props.mobileOptimized) return false
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 768
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'top-bar--dark' : 'top-bar--light'
})

// 移动端类名
const mobileClass = computed(() => {
  return isMobile.value ? 'top-bar--mobile' : ''
})

// 事件处理
const handleBackClick = () => {
  emit('back')
}

const handleShowRecordList = () => {
  emit('show-record-list')
}

const handleConfigUpdate = (config: RecorderConfig) => {
  emit('update:config', config)
}

const handleSettingClick = () => {
  emit('setting-click')
}
</script>

<style scoped>
.recorder-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #000000;
  min-height: 60px;
  border: none;
  flex-shrink: 0;
}

.top-bar-left,
.top-bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 按钮样式 */
.back-btn,
.record-list-btn,
.setting-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
}

.back-btn:hover,
.record-list-btn:hover,
.setting-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.back-btn:active,
.record-list-btn:active,
.setting-btn:active {
  transform: translateY(0);
}

/* 移动端适配 */
.top-bar--mobile .recorder-top-bar {
  padding: max(12px, env(safe-area-inset-top, 12px)) 16px 12px;
  min-height: 56px;
  position: sticky;
  top: 0;
  z-index: 10;
  margin-top: env(safe-area-inset-top, 0px);
}

.top-bar--mobile .back-btn,
.top-bar--mobile .record-list-btn,
.top-bar--mobile .setting-btn {
  padding: 10px;
  font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recorder-top-bar {
    padding: 16px;
  }
  
  .top-bar-left,
  .top-bar-right {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .recorder-top-bar {
    padding: 12px;
    min-height: 52px;
  }
  
  .top-bar-left,
  .top-bar-right {
    gap: 8px;
  }
  
  .back-btn,
  .record-list-btn,
  .setting-btn {
    padding: 6px;
    font-size: 12px;
    gap: 4px;
  }
}

/* 小屏幕适配 */
@media (max-width: 360px) {
  .record-list-btn span {
    display: none;
  }
  
  .record-list-btn {
    padding: 8px;
  }
}
</style>