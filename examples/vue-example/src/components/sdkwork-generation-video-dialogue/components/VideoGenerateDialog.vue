<template>
  <van-popup 
    v-model:show="visible" 
    position="top" 
    :round="false"
    :close-on-click-overlay="false"
    class="video-generate-popup"
  >
    <div class="popup-content">
      <!-- 弹窗头部 -->
      <div class="popup-header">
        <div class="header-title">
          <Icon icon="ri:video-line" width="24" height="24" class="title-icon" />
          <span>生成视频</span>
        </div>
        <div class="close-button" @click="closePopup">
          <Icon icon="ri:close-line" width="20" height="20" />
        </div>
      </div>
      
      <!-- 弹窗主体 -->
      <div class="popup-body">
        <!-- 参数设置区域 -->
        <div class="parameters-section">
          <div class="section-title">视频参数</div>
          
          <!-- 视频尺寸选择 -->
          <div class="parameter-item">
            <div class="parameter-label">
              <Icon icon="ri:aspect-ratio-line" width="16" height="16" />
              <span>视频尺寸</span>
            </div>
            <div class="aspect-ratio-options">
              <div 
                v-for="option in aspectRatioOptions"
                :key="option.value"
                class="ratio-item"
                :class="{ 'active': selectedAspectRatio === option.value }"
                @click="selectAspectRatio(option.value)"
              >
                <span class="ratio-text">{{ option.text }}</span>
                <div class="ratio-preview" :class="`preview-${option.value.replace(':', '-')}`"></div>
              </div>
            </div>
          </div>
          
          <!-- 视频时长设置 -->
          <div class="parameter-item">
            <div class="parameter-label">
              <Icon icon="ri:time-line" width="16" height="16" />
              <span>视频时长</span>
            </div>
            <div class="duration-control">
              <van-slider 
                v-model="videoDuration" 
                :min="5" 
                :max="120" 
                :step="5"
                active-color="#007aff"
                class="duration-slider"
              />
              <div class="duration-display">{{ videoDuration }}秒</div>
            </div>
          </div>
          
          <!-- 视频质量选择 -->
          <div class="parameter-item">
            <div class="parameter-label">
              <Icon icon="ri:hd-line" width="16" height="16" />
              <span>视频质量</span>
            </div>
            <div class="quality-options">
              <div 
                v-for="quality in qualityOptions"
                :key="quality.value"
                class="quality-item"
                :class="{ 'active': selectedQuality === quality.value }"
                @click="selectQuality(quality.value)"
              >
                <span class="quality-name">{{ quality.name }}</span>
                <span class="quality-desc">{{ quality.desc }}</span>
              </div>
            </div>
          </div>
          
          <!-- 高级设置 -->
          <div class="parameter-item">
            <div class="parameter-label" @click="toggleAdvanced">
              <Icon icon="ri:settings-3-line" width="16" height="16" />
              <span>高级设置</span>
              <Icon 
                icon="ri:arrow-down-s-line" 
                width="14" 
                height="14" 
                class="expand-icon"
                :class="{ 'expanded': showAdvanced }"
              />
            </div>
            <div v-show="showAdvanced" class="advanced-settings">
              <div class="advanced-item">
                <div class="advanced-label">风格强度</div>
                <van-slider 
                  v-model="styleStrength" 
                  :min="0" 
                  :max="100" 
                  :step="5"
                  active-color="#007aff"
                />
              </div>
              <div class="advanced-item">
                <div class="advanced-label">运动幅度</div>
                <van-slider 
                  v-model="motionIntensity" 
                  :min="0" 
                  :max="100" 
                  :step="5"
                  active-color="#007aff"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 弹窗底部 -->
      <div class="popup-footer">
        <div class="footer-tips">
          <Icon icon="ri:lightbulb-line" width="14" height="14" />
          <span>生成视频需要一定时间，请耐心等待</span>
        </div>
        <div class="footer-buttons">
          <div class="cancel-button" @click="closePopup">取消</div>
          <div 
            class="confirm-button" 
            :class="{ 'loading': generating }"
            @click="startGeneration"
          >
            <Icon icon="ri:sparkling-line" width="16" height="16" />
            <span>开始生成</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'

// Props定义
interface Props {
  modelValue: boolean
  generating?: boolean
  defaultAspectRatio?: string
  defaultQuality?: string
}

const props = withDefaults(defineProps<Props>(), {
  generating: false,
  defaultAspectRatio: '16:9',
  defaultQuality: 'hd'
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'generate': [params: VideoGenerateParams]
}>()

// 视频生成参数接口
interface VideoGenerateParams {
  aspectRatio: string
  duration: number
  quality: string
  styleStrength: number
  motionIntensity: number
}

// 控制弹窗显示/隐藏
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 视频比例选项
const aspectRatioOptions = [
  { text: '16:9', value: '16:9' },
  { text: '9:16', value: '9:16' },
  { text: '1:1', value: '1:1' },
  { text: '4:3', value: '4:3' },
  { text: '21:9', value: '21:9' }
]

// 视频质量选项
const qualityOptions = [
  { name: '标清', desc: '流畅，生成快', value: 'sd' },
  { name: '高清', desc: '推荐，平衡质量与速度', value: 'hd' },
  { name: '超高清', desc: '最佳效果，生成慢', value: 'uhd' }
]

// 选择的状态
const selectedAspectRatio = ref(props.defaultAspectRatio)
const selectedQuality = ref(props.defaultQuality)
const videoDuration = ref(30)
const styleStrength = ref(50)
const motionIntensity = ref(50)
const showAdvanced = ref(false)

// 选择视频比例
const selectAspectRatio = (ratio: string) => {
  selectedAspectRatio.value = ratio
}

// 选择视频质量
const selectQuality = (quality: string) => {
  selectedQuality.value = quality
}

// 切换高级设置显示状态
const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

// 关闭弹窗
const closePopup = () => {
  visible.value = false
}

// 开始生成视频
const startGeneration = () => {
  const params: VideoGenerateParams = {
    aspectRatio: selectedAspectRatio.value,
    duration: videoDuration.value,
    quality: selectedQuality.value,
    styleStrength: styleStrength.value,
    motionIntensity: motionIntensity.value
  }
  
  emit('generate', params)
}
</script>

<style scoped>
/* 弹窗容器样式 */
.video-generate-popup {
  z-index: 3000;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}

.popup-content {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%);
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 122, 255, 0.15);
}

/* 弹窗头部 */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 122, 255, 0.1);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.title-icon {
  color: #007aff;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  background: rgba(0, 0, 0, 0.05);
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

/* 弹窗主体 */
.popup-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.parameters-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 122, 255, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.parameter-item {
  margin-bottom: 20px;
}

.parameter-item:last-child {
  margin-bottom: 0;
}

.parameter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-bottom: 12px;
  cursor: pointer;
}

.expand-icon {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* 视频比例选项 */
.aspect-ratio-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.ratio-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 122, 255, 0.2);
  flex: 1;
  min-width: 70px;
}

.ratio-item:hover {
  background: rgba(0, 122, 255, 0.1);
  border-color: rgba(0, 122, 255, 0.4);
}

.ratio-item.active {
  background: rgba(0, 122, 255, 0.15);
  border-color: #007aff;
}

.ratio-text {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
}

.ratio-preview {
  width: 30px;
  height: 20px;
  background: rgba(0, 122, 255, 0.5);
  border-radius: 2px;
}

.preview-16-9 {
  width: 36px;
  height: 20px;
}

.preview-9-16 {
  width: 20px;
  height: 36px;
}

.preview-1-1 {
  width: 24px;
  height: 24px;
}

.preview-4-3 {
  width: 28px;
  height: 21px;
}

.preview-21-9 {
  width: 42px;
  height: 18px;
}

/* 视频时长控制 */
.duration-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.duration-slider {
  flex: 1;
}

.duration-display {
  font-size: 14px;
  font-weight: 500;
  color: #007aff;
  text-align: center;
}

/* 视频质量选项 */
.quality-options {
  display: flex;
  gap: 10px;
}

.quality-item {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 122, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quality-item:hover {
  background: rgba(0, 122, 255, 0.1);
  border-color: rgba(0, 122, 255, 0.4);
}

.quality-item.active {
  background: rgba(0, 122, 255, 0.15);
  border-color: #007aff;
}

.quality-name {
  font-size: 14px;
  font-weight: 500;
}

.quality-desc {
  font-size: 12px;
  color: #666;
}

/* 高级设置 */
.advanced-settings {
  margin-top: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  border: 1px dashed rgba(0, 122, 255, 0.3);
}

.advanced-item {
  margin-bottom: 16px;
}

.advanced-item:last-child {
  margin-bottom: 0;
}

.advanced-label {
  font-size: 13px;
  color: #555;
  margin-bottom: 8px;
}

/* 弹窗底部 */
.popup-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(0, 122, 255, 0.1);
  background: rgba(255, 255, 255, 0.8);
}

.footer-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
}

.footer-buttons {
  display: flex;
  gap: 12px;
}

.cancel-button {
  flex: 1;
  padding: 12px 0;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  background: rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.confirm-button {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.confirm-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.confirm-button.loading {
  color: transparent;
}

.confirm-button.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 深色主题适配 */
html[data-theme="dark"] .popup-content {
  background: linear-gradient(135deg, #2c2c2e 0%, #1c1c1e 100%);
  box-shadow: 0 10px 40px rgba(0, 122, 255, 0.25);
}

html[data-theme="dark"] .header-title {
  color: #ffffff;
}

html[data-theme="dark"] .parameter-label {
  color: #d1d1d6;
}

html[data-theme="dark"] .section-title {
  color: #ffffff;
}

html[data-theme="dark"] .parameters-section {
  background: rgba(44, 44, 46, 0.8);
  box-shadow: 0 2px 10px rgba(0, 122, 255, 0.15);
}

html[data-theme="dark"] .ratio-item,
html[data-theme="dark"] .quality-item {
  background: rgba(44, 44, 46, 0.7);
  border-color: rgba(0, 122, 255, 0.3);
}

html[data-theme="dark"] .advanced-settings {
  background: rgba(44, 44, 46, 0.5);
  border-color: rgba(0, 122, 255, 0.4);
}

html[data-theme="dark"] .popup-footer {
  background: rgba(44, 44, 46, 0.8);
  border-color: rgba(0, 122, 255, 0.2);
}

html[data-theme="dark"] .cancel-button {
  color: #d1d1d6;
  background: rgba(255, 255, 255, 0.1);
}

html[data-theme="dark"] .cancel-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

html[data-theme="dark"] .footer-tips {
  color: #98989d;
}

html[data-theme="dark"] .quality-desc {
  color: #98989d;
}

html[data-theme="dark"] .advanced-label {
  color: #d1d1d6;
}

html[data-theme="dark"] .close-button {
  color: #d1d1d6;
  background: rgba(255, 255, 255, 0.1);
}

html[data-theme="dark"] .close-button:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>