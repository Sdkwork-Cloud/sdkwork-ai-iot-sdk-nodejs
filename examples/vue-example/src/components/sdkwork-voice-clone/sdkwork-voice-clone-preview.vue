<template>
  <div class="voice-clone-preview">
    <!-- 返回按钮 -->
    <div class="header-section">
      <van-button 
        type="default" 
        size="small" 
        @click="$emit('back')"
        class="back-btn"
        plain
      >
        <Icon icon="mdi:arrow-left" class="btn-icon" />
        返回录制
      </van-button>
    </div>

    <!-- 试听区域 -->
    <div class="preview-section">
      <h3 class="section-title">试听音色</h3>
      <div class="preview-buttons">
        <van-button 
          type="primary" 
          size="large" 
          class="preview-btn"
          @click="playChinesePreview"
        >
          <Icon icon="mdi:volume-high" class="btn-icon" />
          中文试听
        </van-button>
        <van-button 
          type="primary" 
          size="large" 
          class="preview-btn"
          @click="playEnglishPreview"
        >
          <Icon icon="mdi:volume-high" class="btn-icon" />
          英文试听
        </van-button>
      </div>
    </div>

    <!-- 音色命名区域 -->
    <div class="naming-section">
      <h3 class="section-title">音色命名</h3>
      <van-field
        v-model="voiceName"
        placeholder="请输入音色名称"
        clearable
        class="name-input"
      />
    </div>

    <!-- 安全和隐私提示 -->
    <div class="privacy-section">
      <div class="privacy-notice">
        <Icon icon="mdi:shield-check" class="privacy-icon" />
        <span class="privacy-text">安全和隐私提示：您的音频数据将受到严格保护，仅用于音色克隆目的</span>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="action-section">
      <van-button 
        type="success" 
        size="large" 
        block
        :disabled="!voiceName"
        @click="saveVoice"
        class="save-btn"
      >
        <Icon icon="mdi:content-save" class="btn-icon" />
        保存音色
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button as VanButton, Field as VanField, showToast } from 'vant'
import { Icon } from '@iconify/vue'

// 定义props
interface Props {
  audioData?: Blob | string
}

const props = defineProps<Props>()

// 定义emits
const emit = defineEmits<{
  save: [voiceName: string, audioData?: Blob | string]
  back: []
}>()

// 响应式数据
const voiceName = ref('')

// 试听功能
const playChinesePreview = () => {
  // 模拟中文试听
  showToast('播放中文试听')
  // 实际实现时播放音频
}

const playEnglishPreview = () => {
  // 模拟英文试听
  showToast('播放英文试听')
  // 实际实现时播放音频
}

// 保存音色
const saveVoice = () => {
  if (!voiceName.value.trim()) {
    showToast('请输入音色名称')
    return
  }

  emit('save', voiceName.value.trim(), props.audioData)
  showToast('音色保存成功')
}
</script>

<style scoped>
.voice-clone-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
}

.header-section {
  margin-bottom: 20px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.section-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
}

.preview-section {
  flex: 1;
  margin-bottom: 20px;
}

.preview-buttons {
  display: flex;
  gap: 15px;
}

.preview-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.naming-section {
  margin-bottom: 20px;
}

.name-input {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.name-input :deep(.van-field__control) {
  color: #fff;
}

.name-input :deep(.van-field__control::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.privacy-section {
  margin-bottom: 20px;
}

.privacy-notice {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #4ade80;
}

.privacy-icon {
  margin-right: 8px;
  color: #4ade80;
  font-size: 18px;
}

.privacy-text {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.4;
}

.action-section {
  margin-top: auto;
}

.save-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.save-btn:disabled {
  background: #4b5563;
  box-shadow: none;
}

.btn-icon {
  margin-right: 8px;
  font-size: 18px;
}
</style>