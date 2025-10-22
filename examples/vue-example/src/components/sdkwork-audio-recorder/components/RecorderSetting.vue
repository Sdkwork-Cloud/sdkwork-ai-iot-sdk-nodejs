<template>
  <sdkwork-popup
    :model-value="showDialog"
    :title="'录制设置'"
    :position="'bottom'"
    :width="'100%'"
    :height="'auto'"
    :max-height="'80vh'"
    :round="true"
    :closeable="true"
    :close-on-click-overlay="true"
    :safe-area-inset-bottom="true"
    :theme-mode="themeMode"
    :custom-class="themeClass"
    @update:model-value="handlePopupUpdate"
    @close="handleClose"
  >
    <!-- 设置内容 -->
    <div class="setting-content">
      <div class="setting-body">
        <!-- 采样率设置 -->
        <div class="setting-item">
          <label class="setting-label">采样率</label>
          <select v-model="localConfig.sampleRate" class="setting-input">
            <option value="8000">8000 Hz</option>
            <option value="16000">16000 Hz</option>
            <option value="44100">44100 Hz</option>
            <option value="48000">48000 Hz</option>
          </select>
        </div>

        <!-- 音频格式设置 -->
        <div class="setting-item">
          <label class="setting-label">音频格式</label>
          <select v-model="localConfig.format" class="setting-input">
            <option value="pcm">PCM</option>
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
          </select>
        </div>

        <!-- 波形显示开关 -->
        <div class="setting-item">
          <label class="setting-label checkbox-label">
            <input type="checkbox" v-model="localConfig.enableWave" class="setting-checkbox">
            <span class="checkbox-text">启用波形显示</span>
          </label>
        </div>

        <!-- 实时传输开关 -->
        <div class="setting-item">
          <label class="setting-label checkbox-label">
            <input type="checkbox" v-model="localConfig.realtime" class="setting-checkbox">
            <span class="checkbox-text">实时传输</span>
          </label>
        </div>

        <!-- 保存到文件开关 -->
        <div class="setting-item">
          <label class="setting-label checkbox-label">
            <input type="checkbox" v-model="localConfig.recordToFile" class="setting-checkbox">
            <span class="checkbox-text">保存到文件</span>
          </label>
        </div>

        <!-- 最大时长设置 -->
        <div class="setting-item">
          <label class="setting-label">最大时长(秒)</label>
          <input 
            type="number" 
            v-model="localConfig.maxDuration" 
            min="0" 
            placeholder="0为无限制"
            class="setting-input"
          >
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="setting-footer">
        <button class="btn btn-secondary" @click="resetConfig">重置</button>
        <button class="btn btn-primary" @click="applyConfig">应用</button>
      </div>
    </div>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { RecorderConfig } from '../../../stores/modules/recorder/types'
import SdkworkPopup from '../../sdkwork-popup/sdkwork-popup.vue'

interface Props {
  /** 是否显示设置对话框 */
  show?: boolean
  /** 录制器配置 */
  config: RecorderConfig
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 是否启用移动端优化 */
  mobileOptimized?: boolean
}

interface Emits {
  /** 配置更新事件 */
  (e: 'update:config', config: RecorderConfig): void
  /** 关闭事件 */
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  themeMode: 'auto',
  mobileOptimized: true
})

const emit = defineEmits<Emits>()

// 响应式数据
const showDialog = ref(false)
const localConfig = ref<RecorderConfig>({ ...props.config })

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
  return isDarkMode.value ? 'setting--dark' : 'setting--light'
})

// 监听外部配置变化
watch(() => props.config, (newConfig) => {
  localConfig.value = { ...newConfig }
}, { deep: true })

// 监听显示状态变化
watch(() => props.show, (newVal) => {
  showDialog.value = newVal
})

// 方法
const handlePopupUpdate = (value: boolean) => {
  showDialog.value = value
  if (!value) {
    handleClose()
  }
}

const handleClose = () => {
  emit('close')
}

const applyConfig = () => {
  emit('update:config', { ...localConfig.value })
  handleClose()
}

const resetConfig = () => {
  localConfig.value = {
    sampleRate: 16000,
    format: 'pcm',
    enableWave: true,
    realtime: false,
    recordToFile: true,
    maxDuration: 0,
    autoSendInterval: 0
  }
}

// 暴露方法
defineExpose({
  /** 打开设置对话框 */
  open: () => {
    showDialog.value = true
  },
  
  /** 关闭设置对话框 */
  close: () => {
    showDialog.value = false
  }
})
</script>

<style scoped>
.setting-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.setting-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--sdkwork-popup-content-color, #333);
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-text {
  margin-left: 8px;
  font-size: 14px;
  color: var(--sdkwork-popup-content-color, #333);
}

.setting-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--sdkwork-popup-border-color, #ddd);
  border-radius: 6px;
  font-size: 14px;
  background: var(--sdkwork-popup-content-background, #fff);
  color: var(--sdkwork-popup-content-color, #333);
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.setting-input:focus {
  outline: none;
  border-color: var(--sdkwork-popup-primary-color, #409EFF);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.setting-checkbox {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.setting-footer {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--sdkwork-popup-border-color, #ddd);
  background: var(--sdkwork-popup-footer-background, #fafafa);
  flex-shrink: 0;
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--sdkwork-popup-primary-color, #409EFF);
  color: white;
}

.btn-primary:hover {
  background: var(--sdkwork-popup-primary-hover-color, #66b1ff);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--sdkwork-popup-secondary-color, #f0f0f0);
  color: var(--sdkwork-popup-content-color, #666);
}

.btn-secondary:hover {
  background: var(--sdkwork-popup-secondary-hover-color, #e0e0e0);
  transform: translateY(-1px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .setting-body {
    padding: 12px;
  }
  
  .setting-item {
    margin-bottom: 16px;
  }
  
  .setting-label {
    font-size: 13px;
  }
  
  .setting-input {
    padding: 8px 10px;
    font-size: 13px;
  }
  
  .setting-footer {
    padding: 12px;
  }
  
  .btn {
    padding: 8px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .setting-body {
    padding: 8px;
  }
  
  .setting-item {
    margin-bottom: 12px;
  }
  
  .setting-label {
    font-size: 12px;
  }
  
  .setting-input {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .setting-footer {
    padding: 8px;
  }
  
  .btn {
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>