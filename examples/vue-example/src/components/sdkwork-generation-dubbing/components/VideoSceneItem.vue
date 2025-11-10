<template>
  <div class="video-scene-item">
    <div class="scene-header">
      <div class="scene-title">镜头 {{ index + 1 }}</div>
      <van-button
        v-if="showDelete && shotsLength > 1"
        type="danger"
        size="mini"
        @click="$emit('delete', shot.id)"
      >
        删除
      </van-button>
    </div>
    
    <div class="scene-content">
      <!-- 镜头内容 -->
      <van-field
        :model-value="shot.content"
        @update:model-value="$emit('update:shot', { ...shot, content: $event })"
        type="textarea"
        :rows="2"
        autosize
        maxlength="100"
        placeholder="镜头内容描述（画面内容）"
        class="scene-field"
      />
      
      <!-- 播报内容 -->
      <van-field
        :model-value="shot.dialogue"
        @update:model-value="$emit('update:shot', { ...shot, dialogue: $event })"
        type="textarea"
        :rows="2"
        autosize
        maxlength="200"
        show-word-limit
        placeholder="该镜头的播报内容（台词）"
        class="scene-field"
      />
      
      <!-- 时长设置 -->
      <div class="duration-setting">
        <span class="duration-label">时长（秒）:</span>
        <van-stepper
          :model-value="shot.duration"
          @update:model-value="$emit('update:shot', { ...shot, duration: $event })"
          :min="1"
          :max="10"
          integer
          class="duration-stepper"
        />
      </div>

      <!-- 首尾帧设置 -->
      <div class="frame-settings">
        <div class="frame-section">
          <div class="frame-label">首帧设置:</div>
          <van-field
            :model-value="shot.startFrame || ''"
            @update:model-value="$emit('update:shot', { ...shot, startFrame: $event })"
            type="textarea"
            :rows="1"
            autosize
            maxlength="200"
            placeholder="首帧图片URL或描述（用于生成视频）"
            class="frame-field"
          />
          <van-button
            type="primary"
            size="mini"
            @click="handleUploadStartFrame"
            class="upload-btn"
          >
            上传图片
          </van-button>
        </div>
        
        <div class="frame-section">
          <div class="frame-label">尾帧设置:</div>
          <van-field
            :model-value="shot.endFrame || ''"
            @update:model-value="$emit('update:shot', { ...shot, endFrame: $event })"
            type="textarea"
            :rows="1"
            autosize
            maxlength="200"
            placeholder="尾帧图片URL或描述（用于生成视频）"
            class="frame-field"
          />
          <van-button
            type="primary"
            size="mini"
            @click="handleUploadEndFrame"
            class="upload-btn"
          >
            上传图片
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Shot } from './StoryboardPopup.vue'

interface Props {
  shot: Shot
  index: number
  showDelete?: boolean
  shotsLength: number
}

interface Emits {
  (e: 'update:shot', shot: Shot): void
  (e: 'delete', shotId: string): void
  (e: 'upload-frame', type: 'start' | 'end', shotId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  showDelete: true
})

const emit = defineEmits<Emits>()

// 处理首帧上传
const handleUploadStartFrame = () => {
  emit('upload-frame', 'start', props.shot.id)
}

// 处理尾帧上传
const handleUploadEndFrame = () => {
  emit('upload-frame', 'end', props.shot.id)
}
</script>

<style scoped>
.video-scene-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  margin-bottom: 12px;
}

.scene-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.scene-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.scene-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scene-field {
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.duration-setting {
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-label {
  font-size: 14px;
  color: #666;
  min-width: 80px;
}

.duration-stepper {
  flex: 1;
}

/* 首尾帧设置样式 */
.frame-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
}

.frame-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.frame-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.frame-field {
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.upload-btn {
  align-self: flex-start;
  margin-top: 4px;
}

.frame-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.frame-field {
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.upload-btn {
  margin-top: 4px;
  align-self: flex-start;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .video-scene-item {
    border-color: #2d3a4e;
    background-color: #1e2a3d;
  }
  
  .scene-title {
    color: #ffffff;
  }
  
  .scene-field {
    border-color: #2d3a4e;
    background-color: #1a2438;
    color: #ffffff;
  }
  
  .duration-label {
    color: #8fa3c4;
  }
  
  .frame-label {
    color: #ffffff;
  }
  
  .frame-field {
    border-color: #2d3a4e;
    background-color: #1a2438;
    color: #ffffff;
  }
}
</style>