<template>
  <sdkwork-popup
    v-model:show="visible"
    position="bottom"
    :style="{ height: height }"
    round
    closeable
    :close-on-click-overlay="false"
    :theme-mode="themeMode"
    :title="title"
  >
    <div class="voice-list-popup"> 

      <!-- 分类列表内容 -->
      <div class="popup-content">
        <SdkworkVoiceList
          :api="api"
          :params="params"
          :category-api="categoryApi"
          :categorys="categorys"
          :selected-speaker-id="selectedSpeakerId"
          selection-mode="single"
          @select="handleSelect"
          @search="handleSearch"
          @load="handleLoad"
        >
          <!-- 默认插槽，使用组件内部的 VoiceItem -->
        </SdkworkVoiceList>
      </div>

      <!-- 底部按钮区域 -->
      <div class="popup-footer">
        <!-- 显示克隆按钮时 -->
        <div v-if="props.showCloneButton" class="buttons-row">
          <van-button 
            type="default" 
            size="large" 
            @click="handleClone"
            class="clone-btn"
          >
            克隆我的声音
          </van-button>
          <van-button 
            type="primary" 
            size="large" 
            @click="handleConfirm"
            class="confirm-btn"
          >
            {{ confirmText }}
          </van-button>
        </div>
        
        <!-- 不显示克隆按钮时 -->
        <div v-else class="single-button">
          <van-button 
            type="primary" 
            size="large" 
            block
            @click="handleConfirm"
            class="confirm-btn"
          >
            {{ confirmText }}
          </van-button>
        </div>
      </div>
    </div>
  </sdkwork-popup>

  <!-- 声音克隆弹窗 -->
  <SdkworkVoiceClonePopup
    v-model="clonePopupVisible"
    :title="clonePopupTitle"
    @confirm="handleCloneConfirm"
    @close="handleCloneClose"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript' 
import SdkworkVoiceList from '@/components/sdkwork-voice-speaker-category-list/sdkwork-voice-speaker-category-list.vue'
import SdkworkVoiceClonePopup from '@/components/sdkwork-voice-clone-popup/sdkwork-voice-clone-popup.vue'
import { CategoryVO, VoiceSpeakerVO } from '@/services' 

// Props 定义
interface Props {
  modelValue?: boolean
  title?: string
  height?: string
  confirmText?: string
  api?: (params: Pageable) => Promise<Page<VoiceSpeakerVO>>|any
  params?: Record<string, any>
  categoryApi?: () => Promise<CategoryVO[]>
  categorys?: CategoryVO[]
  selectedSpeakerId?: string | number
  themeMode?: 'dark' | 'light' | 'auto'
  showCloneButton?: boolean // 是否显示克隆按钮
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '选择发音人',
  height: '70vh',
  confirmText: '确认',
  params: () => ({}),
  categorys: () => [],
  themeMode: 'auto',
  showCloneButton: true
})

// Emits 定义
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', speaker: VoiceSpeakerVO): void
  (e: 'close'): void
  (e: 'select', speaker: VoiceSpeakerVO): void
  (e: 'search', keyword: string): void
  (e: 'load', page: Page<VoiceSpeakerVO>): void
  (e: 'clone'): void // 克隆声音事件
}

const emit = defineEmits<Emits>()

// 响应式数据
const visible = ref(props.modelValue)
const selectedSpeaker = ref<VoiceSpeakerVO | null>(null)
const clonePopupVisible = ref(false)

// 计算属性：克隆弹窗标题
const clonePopupTitle = computed(() => {
  if (selectedSpeaker.value) {
    return `克隆声音 - ${selectedSpeaker.value.name}`
  }
  return '克隆声音'
})

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

// 监听 visible 变化
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
  }
})

// 处理确认选择
const handleConfirm = () => {
  if (selectedSpeaker.value) {
    emit('confirm', selectedSpeaker.value)
    visible.value = false
  }
}

// 处理关闭
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 处理选择发音人
const handleSelect = (speaker: VoiceSpeakerVO) => {
  selectedSpeaker.value = speaker
  emit('select', speaker)
}

// 处理搜索
const handleSearch = (keyword: string) => {
  emit('search', keyword)
}

// 处理数据加载完成
const handleLoad = (page: Page<VoiceSpeakerVO>) => {
  emit('load', page)
}

// 处理克隆声音
const handleClone = () => { 
  // 延迟打开克隆弹窗，避免动画冲突
  setTimeout(() => {
    clonePopupVisible.value = true
  }, 300)
  // 触发外部克隆事件
  emit('clone')
}

// 处理克隆确认
const handleCloneConfirm = (audioFile?: File, audioBlob?: Blob | ArrayBuffer) => {
  // 克隆完成后，可以在这里处理克隆结果
  console.log('克隆确认', { audioFile, audioBlob, speaker: selectedSpeaker.value })
  // 关闭克隆弹窗
  clonePopupVisible.value = false
}

// 处理克隆弹窗关闭
const handleCloneClose = () => {
  clonePopupVisible.value = false
}
</script>

<style scoped>
.voice-list-popup {
  height: 100%;
  display: flex;
  flex-direction: column; 
}

.popup-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0; 
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popup-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.close-icon {
  font-size: 18px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-icon:hover {
  color: #666;
}

.popup-content {
  flex: 1;
  overflow: hidden;
}

.popup-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.single-button {
  width: 100%;
}

.buttons-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.buttons-row .van-button {
  flex: 1;
}

.confirm-btn {
  font-size: 16px;
  font-weight: 500;
}

.clone-btn {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .popup-header {
    padding: 12px;
  }
  
  .popup-title {
    font-size: 16px;
  }
  
  .popup-footer {
    padding: 12px;
  }
}
</style>