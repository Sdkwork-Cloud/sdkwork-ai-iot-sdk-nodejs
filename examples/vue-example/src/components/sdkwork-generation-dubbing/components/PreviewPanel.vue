<template>
  <van-popup 
    v-model:show="localShow" 
    position="bottom" 
    round
    :close-on-click-overlay="false"
    class="preview-panel"
  >
    <div class="preview-content">
      <!-- 头部 -->
      <div class="preview-header">
        <h3>视频生成完成</h3>
        <van-button 
          size="mini" 
          @click="closePreview"
          class="close-btn"
        >
          <van-icon name="cross" />
        </van-button>
      </div>

      <!-- 视频预览 -->
      <div class="video-preview">
        <div class="video-thumbnail">
          <div class="thumbnail-placeholder">
            <van-icon name="play" size="40" />
            <div class="thumbnail-text">视频预览</div>
          </div>
        </div>
        
        <div class="video-info">
          <div class="info-item">
            <span class="info-label">时长：</span>
            <span class="info-value">{{ videoData?.duration }}秒</span>
          </div>
          <div class="info-item">
            <span class="info-label">分辨率：</span>
            <span class="info-value">{{ videoConfig.resolution }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">生成时间：</span>
            <span class="info-value">{{ generateTime }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button 
          type="primary" 
          size="large"
          @click="playVideo"
          class="play-btn"
        >
          <van-icon name="play" />
          播放视频
        </van-button>
        
        <van-button 
          type="default" 
          size="large"
          @click="downloadVideo"
          class="download-btn"
        >
          <van-icon name="down" />
          下载视频
        </van-button>
        
        <van-button 
          type="default" 
          size="large"
          @click="shareVideo"
          class="share-btn"
        >
          <van-icon name="share" />
          分享视频
        </van-button>
      </div>

      <!-- 生成信息 -->
      <div class="generation-info">
        <div class="info-section">
          <h4>生成信息</h4>
          <div class="info-grid">
            <div class="info-cell">
              <span class="cell-label">角色：</span>
              <span class="cell-value">{{ generationInfo.character }}</span>
            </div>
            <div class="info-cell">
              <span class="cell-label">发音人：</span>
              <span class="cell-value">{{ generationInfo.voice }}</span>
            </div>
            <div class="info-cell">
              <span class="cell-label">场景：</span>
              <span class="cell-value">{{ generationInfo.scene }}</span>
            </div>
            <div class="info-cell">
              <span class="cell-label">风格：</span>
              <span class="cell-value">{{ generationInfo.style }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: boolean
  videoData?: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  videoData: () => ({
    duration: 30,
    resolution: '720p'
  })
})
const emit = defineEmits<Emits>()

const localShow = ref(props.modelValue)

// 生成时间
const generateTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 视频配置
const videoConfig = computed(() => {
  return props.videoData || {}
})

// 生成信息（模拟数据）
const generationInfo = computed(() => {
  return {
    character: '商务精英',
    voice: '标准女声',
    scene: '办公室',
    style: '专业商务'
  }
})

// 播放视频
const playVideo = () => {
  console.log('播放视频')
  // 这里可以添加视频播放逻辑
}

// 下载视频
const downloadVideo = () => {
  console.log('下载视频')
  // 这里可以添加视频下载逻辑
}

// 分享视频
const shareVideo = () => {
  console.log('分享视频')
  // 这里可以添加视频分享逻辑
}

// 关闭预览
const closePreview = () => {
  localShow.value = false
}

// 监听显示状态变化
watch(localShow, (newValue) => {
  emit('update:modelValue', newValue)
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  localShow.value = newValue
})
</script>

<style scoped>
.preview-panel {
  height: 80vh;
}

.preview-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.preview-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.video-preview {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.video-thumbnail {
  margin-bottom: 16px;
}

.thumbnail-placeholder {
  width: 100%;
  height: 180px;
  background: var(--bg-card);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border: 2px dashed var(--border-color);
}

.thumbnail-text {
  margin-top: 8px;
  font-size: 14px;
}

.video-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.info-item {
  text-align: center;
}

.info-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.info-value {
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.play-btn, .download-btn, .share-btn {
  border-radius: 8px;
  height: 44px;
  font-size: 14px;
  font-weight: 500;
}

.play-btn {
  background: var(--gradient-primary);
  border: none;
}

.generation-info {
  flex: 1;
  overflow-y: auto;
}

.info-section {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 16px;
}

.info-section h4 {
  margin: 0 0 12px 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.info-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--border-color);
}

.cell-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.cell-value {
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
}

.info-cell:last-child {
  border-bottom: none;
}
</style>