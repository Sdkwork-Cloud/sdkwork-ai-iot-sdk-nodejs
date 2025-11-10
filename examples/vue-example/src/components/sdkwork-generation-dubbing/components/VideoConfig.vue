<template>
  <div class="video-config">
    <div class="section-header">
      <h4>视频配置</h4>
    </div>

    <div class="config-options">
      <!-- 视频时长 -->
      <div class="config-item">
        <div class="config-label">视频时长</div>
        <van-slider 
          v-model="localConfig.duration" 
          :min="10" 
          :max="120" 
          :step="5"
          @change="updateConfig"
        />
        <div class="config-value">{{ localConfig.duration }}秒</div>
      </div>

      <!-- 分辨率 -->
      <div class="config-item">
        <div class="config-label">分辨率</div>
        <van-radio-group v-model="localConfig.resolution" direction="horizontal" @change="updateConfig">
          <van-radio name="480p">480p</van-radio>
          <van-radio name="720p">720p</van-radio>
          <van-radio name="1080p">1080p</van-radio>
        </van-radio-group>
      </div>

      <!-- 背景音乐 -->
      <div class="config-item">
        <div class="config-label">背景音乐</div>
        <van-switch 
          v-model="localConfig.backgroundMusic" 
          @change="updateConfig"
        />
      </div>

      <!-- 字幕 -->
      <div class="config-item">
        <div class="config-label">自动字幕</div>
        <van-switch 
          v-model="localConfig.subtitles" 
          @change="updateConfig"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: any
}

interface Emits {
  (e: 'update:modelValue', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localConfig = ref({
  duration: 30,
  resolution: '720p',
  backgroundMusic: true,
  subtitles: true
})

// 更新配置
const updateConfig = () => {
  emit('update:modelValue', { ...localConfig.value })
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    localConfig.value = { ...newValue }
  }
}, { immediate: true })
</script>

<style scoped>
.video-config {
  background: var(--bg-card);
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
  padding: 16px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.config-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-label {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

.config-value {
  color: var(--text-secondary);
  font-size: 12px;
  text-align: right;
}

:deep(.van-radio-group) {
  display: flex;
  gap: 12px;
}

:deep(.van-radio) {
  margin: 0;
}

:deep(.van-radio__label) {
  color: var(--text-secondary);
  font-size: 12px;
}
</style>