<template>
  <sdkwork-popup 
    :visible="modelValue"
    title="字幕设置"
    width="500px"
    :show-close="true"
    @update:visible="handleVisibleUpdate"
    @close="handleClose"
  >
    <div class="settings-dialog">
      <!-- 显示模式设置 -->
      <div class="setting-section">
        <h3 class="section-title">显示模式</h3>
        <div class="mode-options">
          <div 
            v-for="mode in displayModes" 
            :key="mode.value"
            class="mode-option"
            :class="{ active: localConfig.displayMode === mode.value }"
            @click="localConfig.displayMode = mode.value"
          >
            <sdkwork-icon :icon="mode.icon" class="mode-icon" />
            <span class="mode-label">{{ mode.label }}</span>
          </div>
        </div>
      </div>

      <!-- 字体设置 -->
      <div class="setting-section">
        <h3 class="section-title">字体设置</h3>
        <div class="setting-group">
          <label class="setting-label">字体大小</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="localConfig.fontSize" 
              min="12" 
              max="48" 
              step="2"
              class="slider"
            />
            <span class="slider-value">{{ localConfig.fontSize }}px</span>
          </div>
        </div>
        
        <div class="setting-group">
          <label class="setting-label">字体颜色</label>
          <div class="color-picker-container">
            <input 
              type="color" 
              v-model="localConfig.fontColor" 
              class="color-picker"
            />
            <span class="color-value">{{ localConfig.fontColor }}</span>
          </div>
        </div>
      </div>

      <!-- 背景设置 -->
      <div class="setting-section">
        <h3 class="section-title">背景设置</h3>
        <div class="setting-group">
          <label class="setting-label">
            <input 
              type="checkbox" 
              v-model="localConfig.showBackground" 
              class="checkbox"
            />
            显示背景
          </label>
        </div>
        
        <div v-if="localConfig.showBackground" class="setting-group">
          <label class="setting-label">背景颜色</label>
          <div class="color-picker-container">
            <input 
              type="color" 
              v-model="localConfig.backgroundColor" 
              class="color-picker"
            />
            <span class="color-value">{{ localConfig.backgroundColor }}</span>
          </div>
        </div>
        
        <div v-if="localConfig.showBackground" class="setting-group">
          <label class="setting-label">背景透明度</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="backgroundOpacity" 
              min="0" 
              max="100" 
              step="10"
              class="slider"
            />
            <span class="slider-value">{{ backgroundOpacity }}%</span>
          </div>
        </div>
      </div>

      <!-- 行模式设置 -->
      <div v-if="localConfig.displayMode === 'line'" class="setting-section">
        <h3 class="section-title">行模式设置</h3>
        <div class="setting-group">
          <label class="setting-label">显示行数</label>
          <div class="slider-container">
            <input 
              type="range" 
              v-model="localConfig.lineCount" 
              min="1" 
              max="10" 
              step="1"
              class="slider"
            />
            <span class="slider-value">{{ localConfig.lineCount }} 行</span>
          </div>
        </div>
      </div>

      <!-- 位置设置 -->
      <div class="setting-section">
        <h3 class="section-title">位置设置</h3>
        <div class="position-options">
          <div 
            v-for="position in positionOptions" 
            :key="position.value"
            class="position-option"
            :class="{ active: localConfig.position === position.value }"
            @click="localConfig.position = position.value"
          >
            <sdkwork-icon :icon="position.icon" class="position-icon" />
            <span class="position-label">{{ position.label }}</span>
          </div>
        </div>
      </div>

      <!-- 预览区域 -->
      <div class="setting-section">
        <h3 class="section-title">预览</h3>
        <div class="preview-container" :style="previewStyle">
          <div class="preview-subtitle" :style="previewSubtitleStyle">
            这是一条预览字幕
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="dialog-actions">
        <button class="btn btn-secondary" @click="handleReset">重置</button>
        <button class="btn btn-primary" @click="handleApply">应用</button>
        <button class="btn btn-default" @click="handleClose">取消</button>
      </div>
    </div>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue' 

interface Props {
  modelValue: boolean
  config: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'update-config', config: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 显示模式选项
const displayModes = [
  { value: 'fullscreen', label: '全屏模式', icon: 'mdi:fullscreen' },
  { value: 'card', label: '卡片模式', icon: 'mdi:card-text-outline' },
  { value: 'line', label: '行模式', icon: 'mdi:format-list-bulleted' }
]

// 位置选项
const positionOptions = [
  { value: 'top', label: '顶部', icon: 'mdi:arrow-up' },
  { value: 'center', label: '居中', icon: 'mdi:arrow-all' },
  { value: 'bottom', label: '底部', icon: 'mdi:arrow-down' }
]

// 本地配置
const localConfig = ref({ ...props.config })

// 背景透明度计算
const backgroundOpacity = computed({
  get: () => {
    const match = localConfig.value.backgroundColor?.match(/rgba?\([^)]+,\s*([\d.]+)\)/)
    return match ? Math.round(parseFloat(match[1]) * 100) : 70
  },
  set: (value) => {
    const opacity = value / 100
    localConfig.value.backgroundColor = localConfig.value.backgroundColor.replace(
      /rgba?\([^)]+,\s*[\d.]+\)/,
      `rgba(0, 0, 0, ${opacity})`
    )
  }
})

// 预览样式
const previewStyle = computed(() => ({
  background: localConfig.value.showBackground ? localConfig.value.backgroundColor : 'transparent',
  padding: localConfig.value.showBackground ? '20px' : '0',
  borderRadius: localConfig.value.showBackground ? '8px' : '0'
}))

const previewSubtitleStyle = computed(() => ({
  fontSize: `${localConfig.value.fontSize}px`,
  color: localConfig.value.fontColor,
  textAlign: 'center' as const
}))
const handleVisibleUpdate = (visible: boolean) => {
  emit('update:modelValue', visible)
}
// 监听外部配置变化
watch(() => props.config, (newConfig) => {
  localConfig.value = { ...newConfig }
}, { deep: true })

// 处理方法
const handleApply = () => {
  emit('update-config', { ...localConfig.value })
  emit('update:modelValue', false)
}

const handleReset = () => {
  localConfig.value = {
    displayMode: 'card',
    lineCount: 3,
    fontSize: 16,
    fontColor: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    showBackground: true,
    position: 'bottom',
    autoScroll: true,
    scrollSpeed: 1
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.settings-dialog {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.setting-section {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #ffffff;
}

.mode-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.mode-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
}

.mode-option:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.mode-option.active {
  border-color: #007aff;
  background: rgba(0, 122, 255, 0.2);
}

.mode-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
  color: currentColor;
}

.mode-label {
  font-size: 12px;
  text-align: center;
}

.setting-group {
  margin-bottom: 16px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #007aff;
  border-radius: 50%;
  cursor: pointer;
}

.slider-value {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  min-width: 50px;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-picker {
  width: 40px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
}

.color-value {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Courier New', monospace;
}

.checkbox {
  margin-right: 8px;
}

.position-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.position-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
}

.position-option:hover {
  border-color: rgba(255, 255, 255, 0.4);
}

.position-option.active {
  border-color: #007aff;
  background: rgba(0, 122, 255, 0.2);
}

.position-icon {
  width: 20px;
  height: 20px;
  margin-bottom: 4px;
}

.position-label {
  font-size: 12px;
}

.preview-container {
  padding: 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  text-align: center;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-subtitle {
  font-size: 16px;
  color: #ffffff;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #007aff;
  color: white;
}

.btn-primary:hover {
  background: #0056cc;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-default {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-default:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .settings-dialog {
    padding: 16px;
  }
  
  .mode-options,
  .position-options {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>