<template>
  <div 
    class="voice-synthesis"
    :class="themeClass"
  >
    <!-- 文本输入区域 -->
    <div class="text-input-section">
      <sdkwork-cell-group :theme-mode="effectiveThemeMode">
        <div class="text-field-wrapper">
          <van-field
            v-model="text"
            label="合成文本"
            label-align="top"
            type="textarea"
            placeholder="请输入要合成的文本内容"
            :autosize="{ minHeight: 100, maxHeight: 200 }"
            :maxlength="1000"
            :error-message="textError"
            @blur="validateText"
          />
          <div class="char-count-bottom">
            <span :class="['char-count', { 'error': text.length > 1000 }]">
              {{ text.length }}/1000
            </span>
          </div>
        </div>
      </sdkwork-cell-group>
    </div>

    <!-- 语音选择区域 -->
    <sdkwork-cell-group class="voice-section" :theme-mode="effectiveThemeMode">
      <!-- 声音选择器 -->
      <sdkwork-cell title="发音人" center is-link @click="showVoicePopup = true" :theme-mode="effectiveThemeMode">
        <template #value>
          <div class="voice-selector">
            <van-icon name="music" class="voice-icon" />
            <span v-if="selectedSpeaker" class="selected-voice">
              {{ selectedSpeaker.displayName || selectedSpeaker.name }}
            </span>
            <span v-else class="placeholder">请选择发音人</span>
          </div>
        </template>
      </sdkwork-cell>

      <!-- 试听按钮 -->
      <sdkwork-cell v-if="selectedSpeaker" title="试听" center :theme-mode="effectiveThemeMode">
        <template #value>
          <van-button 
            type="primary" 
            size="small" 
            @click="handlePreview"
            :loading="previewLoading"
            :disabled="!text.trim()"
          >
            试听
          </van-button>
        </template>
      </sdkwork-cell>
    </sdkwork-cell-group>

    <!-- 参数设置 - 默认折叠 -->
    <sdkwork-collapse v-model="activeCollapse" class="params-section" :theme-mode="effectiveThemeMode">
      <sdkwork-collapse-item title="高级参数设置" name="params" :theme-mode="effectiveThemeMode">
        <!-- 语速设置 -->
        <sdkwork-cell title="语速" center :theme-mode="effectiveThemeMode">
          <template #value>
            <div class="slider-wrapper">
              <van-slider
                v-model="params.speed"
                :min="0.5"
                :max="2.0"
                :step="0.1"
                bar-height="4px"
                active-color="#1989fa"
              />
              <span class="slider-value">{{ params.speed.toFixed(1) }}x</span>
            </div>
          </template>
        </sdkwork-cell>

        <!-- 音量设置 -->
        <sdkwork-cell title="音量" center :theme-mode="effectiveThemeMode">
          <template #value>
            <div class="slider-wrapper">
              <van-slider
                v-model="params.volume"
                :min="0"
                :max="100"
                :step="1"
                bar-height="4px"
                active-color="#1989fa"
              />
              <span class="slider-value">{{ params.volume }}%</span>
            </div>
          </template>
        </sdkwork-cell>

        <!-- 音调设置 -->
        <sdkwork-cell title="音调" center :theme-mode="effectiveThemeMode">
          <template #value>
            <div class="slider-wrapper">
              <van-slider
                v-model="params.pitch"
                :min="-10"
                :max="10"
                :step="1"
                bar-height="4px"
                active-color="#1989fa"
              />
              <span class="slider-value">{{ params.pitch > 0 ? '+' : '' }}{{ params.pitch }}</span>
            </div>
          </template>
        </sdkwork-cell>

        <!-- 音频格式选择 -->
        <sdkwork-cell title="音频格式" center is-link @click="showFormatPicker = true" :theme-mode="effectiveThemeMode">
          <template #value>
            <span class="format-value">
              {{ getFormatText(params.format) }}
            </span>
          </template>
        </sdkwork-cell>

        <!-- 音频格式选择器 -->
        <sdkwork-popup v-model:show="showFormatPicker" position="bottom" round :theme-mode="effectiveThemeMode" :closeable="false">
          <van-picker
            :columns="formatOptions"
            :model-value="selectedFormat"
            @update:model-value="handlePickerChange"
            @confirm="handleFormatConfirm"
            @cancel="showFormatPicker = false"
            title="选择音频格式"
          />
        </sdkwork-popup>
      </sdkwork-collapse-item>
    </sdkwork-collapse>

    <!-- 底部操作栏 -->
    <div class="bottom-action-bar">
      <van-button 
        type="primary" 
        size="large" 
        block
        :loading="synthesizing"
        :disabled="!formValid"
        @click="handleSynthesis"
        class="synthesis-button"
      >
        开始合成
      </van-button>
    </div>

    <!-- 声音选择弹出层 -->
    <SdkworkVoiceListPopup
      v-model="showVoicePopup"
      title="选择发音人"
      :height="popupHeight"
      :selected-speaker-id="selectedSpeaker?.id"
      :theme-mode="effectiveThemeMode"
      @confirm="handleVoiceConfirm"
      @close="showVoicePopup = false"
    />

    <!-- 音频播放器 -->
    <audio 
      ref="audioPlayer" 
      style="display: none"
      @ended="handleAudioEnded"
      @error="handleAudioError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { showToast } from 'vant' 
import type { VoiceSpeakerVO } from '@/services'
import SdkworkVoiceListPopup from '@/components/sdkwork-voice-speaker-category-list-popup/sdkwork-voice-speaker-category-list-popup.vue'
import { useTheme, type ThemeMode } from '@/hooks/theme/useTheme'
import type { SynthesisData, SynthesisResult, SynthesisParams } from './types'

// 使用主题hook
const { currentTheme, isDarkMode } = useTheme()

// Props 定义
interface Props {
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 默认文本 */
  defaultText?: string
  /** 默认发音人 */
  defaultSpeaker?: VoiceSpeakerVO|null
  /** 是否显示高级参数 */
  showAdvancedParams?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  themeMode: 'auto',
  defaultText: '',
  showAdvancedParams: true
})

// Emits 定义
interface Emits {
  /** 合成开始事件 */
  (e: 'start', data: SynthesisData): void
  /** 合成完成事件 */
  (e: 'complete', result: SynthesisResult): void
  /** 合成错误事件 */
  (e: 'error', error: Error): void
  /** 发音人变更事件 */
  (e: 'speaker-change', speaker: VoiceSpeakerVO): void
}

const emit = defineEmits<Emits>()



// 响应式数据
const text = ref(props.defaultText)
const selectedSpeaker = ref<VoiceSpeakerVO | null>(props.defaultSpeaker || null)
const showVoicePopup = ref(false)
const showFormatPicker = ref(false)
const activeCollapse = ref<string[]>(props.showAdvancedParams ? ['params'] : [])
const previewLoading = ref(false)
const synthesizing = ref(false)
const audioPlayer = ref<HTMLAudioElement | null>(null)

// 合成参数
const params = reactive<SynthesisParams>({
  speed: 1.0,
  volume: 80,
  pitch: 0,
  format: 'mp3'
})

// 音频格式选项
const formatOptions = [
  { text: 'MP3', value: 'mp3' },
  { text: 'WAV', value: 'wav' },
  { text: 'PCM', value: 'pcm' }
]

const selectedFormat = ref([params.format])

// 验证错误信息
const textError = ref('')

// 计算属性
const themeClass = computed(() => {
  return `theme-${currentTheme.value}`
})

// 实际使用的主题模式（基于主题hook）
const effectiveThemeMode = computed(() => {
  return props.themeMode === 'auto' ? currentTheme.value : props.themeMode
})

const popupHeight = computed(() => {
  return '100%'
})

const formValid = computed(() => {
  return text.value.trim().length > 0 && selectedSpeaker.value !== null
})

// 监听默认值变化
watch(() => props.defaultText, (newText) => {
  if (newText && !text.value) {
    text.value = newText
  }
})

watch(() => props.defaultSpeaker, (newSpeaker) => {
  if (newSpeaker && !selectedSpeaker.value) {
    selectedSpeaker.value = newSpeaker
  }
})

// 方法
const validateText = () => {
  if (!text.value.trim()) {
    textError.value = '请输入合成文本'
  } else if (text.value.length > 1000) {
    textError.value = '文本长度不能超过1000个字符'
  } else {
    textError.value = ''
  }
}

const getFormatText = (format: string) => {
  const option = formatOptions.find(opt => opt.value === format)
  return option ? option.text : 'MP3'
}

const handleVoiceConfirm = (speaker: VoiceSpeakerVO) => {
  selectedSpeaker.value = speaker
  showVoicePopup.value = false
  emit('speaker-change', speaker)
  showToast(`已选择发音人: ${speaker.displayName || speaker.name}`)
}

const handlePickerChange = (value: any) => {
  // 确保value是数组格式
  if (Array.isArray(value)) {
    selectedFormat.value = value
  } else if (value && typeof value === 'object' && value.selectedValues) {
    // 处理van-picker返回的对象格式
    selectedFormat.value = value.selectedValues
  }
}

const handleFormatConfirm = (value: any) => {
  let formatValue = value
  
  // 处理van-picker返回的不同格式
  if (Array.isArray(value)) {
    formatValue = value[0]
  } else if (value && typeof value === 'object' && value.selectedValues) {
    formatValue = value.selectedValues[0]
  }
  
  params.format = formatValue
  showFormatPicker.value = false
}

const handlePreview = async () => {
  if (!selectedSpeaker.value || !text.value.trim()) {
    showToast('请先选择发音人和输入文本')
    return
  }

  previewLoading.value = true
  
  try {
    // 这里调用试听API
    const previewText = text.value.length > 50 ? text.value.substring(0, 50) + '...' : text.value
    const audioUrl = await previewSynthesis(previewText, selectedSpeaker.value, params)
    
    if (audioPlayer.value && audioUrl) {
      audioPlayer.value.src = audioUrl
      await audioPlayer.value.play()
    }
  } catch (error) {
    console.error('试听失败:', error)
    showToast('试听失败，请重试')
  } finally {
    previewLoading.value = false
  }
}

const handleSynthesis = async () => {
  if (!formValid.value) {
    showToast('请完善合成信息')
    return
  }

  synthesizing.value = true
  
  try {
    const synthesisData: SynthesisData = {
      text: text.value,
      speaker: selectedSpeaker.value!,
      params: { ...params }
    }

    emit('start', synthesisData)
    
    // 调用合成API
    const result = await startSynthesis(synthesisData)
    
    emit('complete', result)
    showToast('合成完成')
    
    // 自动播放合成结果
    if (audioPlayer.value && result.audioUrl) {
      audioPlayer.value.src = result.audioUrl
      await audioPlayer.value.play()
    }
  } catch (error) {
    console.error('合成失败:', error)
    emit('error', error as Error)
    showToast('合成失败，请重试')
  } finally {
    synthesizing.value = false
  }
}

const handleAudioEnded = () => {
  console.log('音频播放结束')
}

const handleAudioError = (error: Event) => {
  console.error('音频播放错误:', error)
  showToast('音频播放失败')
}

// API调用函数（需要根据实际API实现）
const previewSynthesis = async (text: string, speaker: VoiceSpeakerVO, params: SynthesisParams): Promise<string> => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 这里应该返回真实的音频URL
  return 'https://example.com/preview-audio.mp3'
}

const startSynthesis = async (data: SynthesisData): Promise<SynthesisResult> => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // 这里应该返回真实的合成结果
  return {
    audioUrl: 'https://example.com/synthesis-result.mp3',
    duration: 10,
    fileSize: 102400
  }
}
</script>

<style scoped>
.voice-synthesis {
  padding: 16px; 
}

.text-input-section {
  margin-bottom: 16px;
}

.text-field-wrapper,
.voice-section,
.params-section {
  margin-bottom: 16px;
}

.voice-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.voice-icon {
  color: #1989fa;
  font-size: 16px;
}

.selected-voice {
  color: #333;
  font-weight: 500;
}

.placeholder {
  color: #999;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.slider-value {
  min-width: 50px;
  text-align: right;
  color: #666;
  font-size: 14px;
}

.format-value {
  color: #333;
}

.char-count-bottom {
  text-align: right;
  margin-top: 8px;
}

.char-count {
  font-size: 12px;
  color: #999;
}

.char-count.error {
  color: #ee0a24;
}

.bottom-action-bar {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.synthesis-button {
  font-size: 16px;
  font-weight: 500;
}

/* 暗色主题支持 */
.theme-dark {
  background: #1a1a1a;
  color: #fff;
}

.theme-dark .selected-voice {
  color: #fff;
}

.theme-dark .placeholder {
  color: #666;
}

.theme-dark .format-value {
  color: #fff;
}

.theme-dark .bottom-action-bar {
  border-top-color: #333;
}

/* van-field 暗色主题适配 */
.theme-dark :deep(.van-field) {
  background-color: #2a2a2a;
  color: #fff;
}

.theme-dark :deep(.van-field__label) {
  color: #ccc;
}

.theme-dark :deep(.van-field__control) {
  color: #fff;
  background-color: #2a2a2a;
}

.theme-dark :deep(.van-field__control::placeholder) {
  color: #666;
}

.theme-dark :deep(.van-field__body) {
  background-color: #2a2a2a;
}

.theme-dark :deep(.van-field__error-message) {
  color: #ff6b6b;
}

/* van-picker 暗色主题适配 */
.theme-dark :deep(.van-picker) {
  background-color: #2a2a2a;
  color: #fff;
}

.theme-dark :deep(.van-picker__toolbar) {
  background-color: #2a2a2a;
  border-bottom-color: #444;
}

.theme-dark :deep(.van-picker__title) {
  color: #fff;
}

.theme-dark :deep(.van-picker__cancel),
.theme-dark :deep(.van-picker__confirm) {
  color: #ccc;
}

.theme-dark :deep(.van-picker__confirm) {
  color: #1989fa;
}

.theme-dark :deep(.van-picker__mask) {
  background-image: 
    linear-gradient(to bottom, rgba(42, 42, 42, 0.9), rgba(42, 42, 42, 0.4)),
    linear-gradient(to top, rgba(42, 42, 42, 0.9), rgba(42, 42, 42, 0.4));
}

.theme-dark :deep(.van-picker-column) {
  background-color: #2a2a2a;
}

.theme-dark :deep(.van-picker-column__item) {
  color: #ccc;
}

.theme-dark :deep(.van-picker-column__item--selected) {
  color: #fff;
}

.theme-dark :deep(.van-picker__frame) {
  border-top-color: #444;
  border-bottom-color: #444;
}

/* van-picker 暗色主题适配 */
.theme-dark :deep(.van-picker) {
  background-color: #2a2a2a;
  color: #fff;
}

.theme-dark :deep(.van-picker__toolbar) {
  background-color: #2a2a2a;
  border-bottom-color: #444;
}

.theme-dark :deep(.van-picker__title) {
  color: #fff;
}

.theme-dark :deep(.van-picker__cancel),
.theme-dark :deep(.van-picker__confirm) {
  color: #ccc;
}

.theme-dark :deep(.van-picker__confirm) {
  color: #1989fa;
}

.theme-dark :deep(.van-picker__mask) {
  background-image: 
    linear-gradient(to bottom, rgba(42, 42, 42, 0.9), rgba(42, 42, 42, 0.4)),
    linear-gradient(to top, rgba(42, 42, 42, 0.9), rgba(42, 42, 42, 0.4));
}

.theme-dark :deep(.van-picker-column) {
  background-color: #2a2a2a;
}

.theme-dark :deep(.van-picker-column__item) {
  color: #ccc;
}

.theme-dark :deep(.van-picker-column__item--selected) {
  color: #fff;
}

.theme-dark :deep(.van-picker__frame) {
  border-top-color: #444;
  border-bottom-color: #444;
}

/* van-field 暗色主题适配 */
.theme-dark :deep(.van-field) {
  background-color: #2a2a2a;
  color: #fff;
}

.theme-dark :deep(.van-field__label) {
  color: #ccc;
}

.theme-dark :deep(.van-field__control) {
  color: #fff;
  background-color: #2a2a2a;
}

.theme-dark :deep(.van-field__control::placeholder) {
  color: #666;
}

.theme-dark :deep(.van-field__body) {
  background-color: #2a2a2a;
}

.theme-dark :deep(.van-field__error-message) {
  color: #ff6b6b;
}

/* van-picker 暗色主题适配 */
.theme-dark :deep(.van-picker) {
  background-color: #2a2a2a;
  color: #fff;
}

.theme-dark :deep(.van-picker__toolbar) {
  background-color: #2a2a2a;
  border-bottom-color: #444;
}

.theme-dark :deep(.van-picker__title) {
  color: #fff;
}

.theme-dark :deep(.van-picker__cancel),
.theme-dark :deep(.van-picker__confirm) {
  color: #ccc;
}

.theme-dark :deep(.van-picker__confirm) {
  color: #1989fa;
}

.theme-dark :deep(.van-picker__mask) {
  background-image: 
    linear-gradient(to bottom, rgba(42, 42, 42, 0.9), rgba(42, 42, 42, 0.4)),
    linear-gradient(to top, rgba(42, 42, 42, 0.9), rgba(42, 42, 42, 0.4));
}

.theme-dark :deep(.van-picker-column) {
  background-color: #2a2a2a;
}

.theme-dark :deep(.van-picker-column__item) {
  color: #ccc;
}

.theme-dark :deep(.van-picker-column__item--selected) {
  color: #fff;
}

.theme-dark :deep(.van-picker__frame) {
  border-top-color: #444;
  border-bottom-color: #444;
}

/* van-picker 暗色主题适配 */
.theme-dark :deep(.van-picker) {
  background-color: #2a2a2a;
  color: #fff;
}

.theme-dark :deep(.van-picker__toolbar) {
  background-color: #2a2a2a;
  border-bottom-color: #444;
}

.theme-dark :deep(.van-picker__title) {
  color: #fff;
}

.theme-dark :deep(.van-picker__cancel),
.theme-dark :deep(.van-picker__confirm) {
  color: #ccc;
}

.theme-dark :deep(.van-picker__confirm) {
  color: #1989fa;
}

.theme-dark :deep(.van-picker__mask) {
  background-image: 
    linear-gradient(to bottom, rgba(42, 42, 42, 0.9), rgba(42, 42, 42, 0.4)),
    linear-gradient(to top, rgba(42, 42, 42, 0.9), rgba(42, 42, 42, 0.4));
}

.theme-dark :deep(.van-picker-column) {
  background-color: #2a2a2a;
}

.theme-dark :deep(.van-picker-column__item) {
  color: #ccc;
}

.theme-dark :deep(.van-picker-column__item--selected) {
  color: #fff;
}

.theme-dark :deep(.van-picker__frame) {
  border-top-color: #444;
  border-bottom-color: #444;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .voice-synthesis {
    padding: 12px;
  }
  
  .slider-wrapper {
    gap: 8px;
  }
  
  .slider-value {
    min-width: 40px;
    font-size: 12px;
  }
}
</style>