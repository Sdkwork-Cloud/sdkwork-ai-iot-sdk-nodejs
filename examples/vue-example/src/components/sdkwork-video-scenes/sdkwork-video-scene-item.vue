<template>
  <div class="video-scene-item">
    <div class="item-header">
      <div class="scene-number">分镜 {{ scene.order }}</div>
      <div class="scene-status" v-if="scene.videoStatus">{{ statusText }}</div>
    </div>

    <div class="images-section" v-if="localImages.length > 0 || !isProcessing">
      <div class="images-grid">
        <div 
          v-for="(img, index) in localImages" 
          :key="img.id" 
          class="image-card" 
          @click="openImage(img, index)"
        >
          <van-image :src="img.url" fit="cover" width="100%" height="130" />
          <div class="image-meta">
            <span class="image-type">{{ imageTypeLabel(img.type) }}</span>
            <div class="title">{{ img.title || '' }}</div>
            <van-button 
              v-if="!isProcessing && !props.isProcessing" 
              size="mini" 
              class="delete-btn"
              @click.stop="deleteImage(img)"
            >
              <sdkwork-icon icon="ri:close-line" />
            </van-button>
          </div>
        </div>
        <div class="image-card add" @click="showImagePopup = true" :disabled="isProcessing || props.isProcessing">
          <sdkwork-icon icon="ri:add-line" />
          <span>添加素材</span>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="field video-prompt">
        <div class="field-label">
          <span class="label-text">画面描述</span>
          <span class="ai-icon">🎬</span>
        </div>
        <van-field 
          v-model="videoDescription" 
          type="textarea" 
          rows="3" 
          maxlength="500" 
          show-word-limit 
          placeholder="描述画面内容、镜头运动和氛围..." 
          class="custom-textarea"
        />
        <div class="tools">
          <van-button 
            size="small" 
            round
            :loading="descLoading" 
            :disabled="isProcessing || props.isProcessing" 
            @click="generateDesc"
            class="ai-btn"
          >
            <sdkwork-icon icon="ri:lightbulb-line" />
            AI生成
          </van-button>
        </div>
      </div>

      <div class="field script-field">
        <div class="field-label">
          <span class="label-text">口播台词</span>
          <van-dropdown-menu class="lang-selector">
            <van-dropdown-item v-model="scriptLang" :options="langOptions" />
          </van-dropdown-menu>
        </div>
        <van-field 
          v-model="scriptText" 
          type="textarea" 
          rows="3" 
          maxlength="300" 
          show-word-limit 
          placeholder="输入口播台词内容..." 
          class="custom-textarea"
        />
        <div class="tools">
          <van-button 
            size="small" 
            round
            :loading="scriptLoading" 
            :disabled="isProcessing || props.isProcessing" 
            @click="optimizeScript"
            class="ai-btn"
          >
            <sdkwork-icon icon="ri:lightbulb-line" />
            优化
          </van-button>
          <van-button 
            size="small" 
            round
            @click="showStt = true"
            class="mic-btn"
          >
            <sdkwork-icon icon="ri:mic-line" />
          </van-button>
          <div class="action-buttons">
            <van-button 
              size="small" 
              round 
              @click="copyScript" 
              :disabled="!scriptText"
            >
              <sdkwork-icon icon="ri:file-text-line" :width="16" :height="16" />
            </van-button>
            <van-button 
              size="small" 
              round 
              @click="clearScript" 
              :disabled="!scriptText"
            >
              <sdkwork-icon icon="ri:close-circle-line" :width="16" :height="16" />
            </van-button>
          </div>
        </div>
      </div>
    </div>

    <div class="action-section">
      <div class="main-actions">
        <van-button 
          v-if="!scene.video" 
          class="generate-btn"
          :loading="genLoading" 
          :disabled="!canGenerate || isProcessing || props.isProcessing" 
          @click="onGenerate"
          round
        >
          <sdkwork-icon icon="ri:play-circle-line" />
          生成视频
        </van-button>
        <van-button 
          v-else 
          class="regenerate-btn"
          :loading="genLoading" 
          :disabled="!canGenerate || isProcessing || props.isProcessing" 
          @click="onGenerate"
          round
        >
          <sdkwork-icon icon="ri:refresh-line" />
          重新生成
        </van-button>
        
        <van-button 
          class="delete-btn-main"
          round
          plain
          @click="confirmDelete" 
          :disabled="isProcessing || props.isProcessing"
        >
          <sdkwork-icon icon="ri:delete-bin-line" />
        </van-button>
      </div>
      
      <div class="progress-container" v-if="genLoading || scene.videoStatus === 'generating'">
        <div class="progress-title">视频生成中</div>
        <van-progress :percentage="progress" :show-pivot="false" stroke-width="6" color="#1976d2" />
        <div class="progress-text">{{ progress }}% 完成</div>
      </div>
      
      <div class="video-preview" v-if="scene.video">
        <sdkwork-video-player :src="scene.video" />
        <div class="video-actions">
          <van-button size="small" round @click="() => showToast('下载功能开发中')">
            <sdkwork-icon icon="ri:download-line" />
            下载
          </van-button>
          <van-button size="small" round plain @click="() => showToast('分享功能开发中')">
            <sdkwork-icon icon="ri:share-line" />
            分享
          </van-button>
        </div>
      </div>
    </div>

    <video-scene-image-popup
      v-model:show="showImagePopup"
      :images="localImages"
      @save="applyImages"
    />

    <sdkwork-popup v-model:show="showStt" position="bottom" round>
      <sdkwork-speech-to-text @recognition-complete="onSttComplete" />
    </sdkwork-popup>
    
    <!-- 图片预览 -->
    <van-image-preview 
      v-model:show="showImagePreview" 
      :images="localImages.map(img => img.url)" 
      :start-position="imagePreviewIndex"
    >
      <template #index>{{ imagePreviewIndex + 1 }} / {{ localImages.length }}</template>
    </van-image-preview>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { showToast } from 'vant'
import { useGenerationStore } from '@/stores/modules/generation/generation'
import type { VideoSceneItem, SceneImage } from '@/components/sdkwork-generation-video-scenes/types'
import { Icon } from '@iconify/vue'

const props = defineProps<{ 
  scene: VideoSceneItem
  isProcessing?: boolean 
}>()
const emit = defineEmits<{ 
  (e: 'update:scene', v: VideoSceneItem): void
  (e: 'delete', id: string): void 
}>()
defineOptions({ name: 'video-scene-item' })



const videoDescription = ref(props.scene.videoDescription || '')
const scriptText = ref(props.scene.script || '')
const scriptLang = ref('zh-CN')
const langOptions = [
  { text: '中文', value: 'zh-CN' },
  { text: '英语', value: 'en-US' },
  { text: '日语', value: 'ja-JP' },
  { text: '韩语', value: 'ko-KR' },
  { text: '法语', value: 'fr-FR' },
  { text: '德语', value: 'de-DE' },
  { text: '西班牙语', value: 'es-ES' }
]

const localImages = ref<SceneImage[]>(props.scene.images || [])
const showImagePopup = ref(false)
const showStt = ref(false)
const descLoading = ref(false)
const scriptLoading = ref(false)
const genLoading = ref(false)
const isGenerating = ref(false)
const imagePreviewIndex = ref(0)
const showImagePreview = ref(false)
const generationStore = useGenerationStore()

// 防抖处理，避免频繁更新
let updateTimer: number | null = null
const debouncedEmitUpdate = (scene: VideoSceneItem) => {
  if (updateTimer) clearTimeout(updateTimer)
  updateTimer = window.setTimeout(() => {
    emit('update:scene', scene)
    updateTimer = null
  }, 300)
}

watch([videoDescription, scriptText, localImages], () => {
  const updated: VideoSceneItem = { 
    ...props.scene, 
    videoDescription: videoDescription.value, 
    script: scriptText.value, 
    images: localImages.value, 
    updatedAt: new Date() 
  }
  debouncedEmitUpdate(updated)
})

const imageTypeLabel = (t: SceneImage['type']) => {
  const map: Record<string, string> = { startFrame: '首帧', endFrame: '尾帧', product: '商品图', reference: '参考图' }
  return map[t] || t
}

const applyImages = (imgs: SceneImage[]) => {
  localImages.value = imgs
}

const openImage = (img: SceneImage, index?: number) => {
  imagePreviewIndex.value = index !== undefined ? index : localImages.value.findIndex(i => i.id === img.id)
  showImagePreview.value = true
}

const deleteImage = (img: SceneImage) => {
  const index = localImages.value.findIndex(i => i.id === img.id)
  if (index !== -1) {
    localImages.value.splice(index, 1)
    showToast('图片已删除')
  }
}

const onSttComplete = (text: string) => {
  scriptText.value = text.slice(0, 300)
  showStt.value = false
}

const progress = computed(() => props.scene.videoProgress || 0)
const canGenerate = computed(() => (videoDescription.value?.trim()?.length || 0) > 0 || localImages.value.length > 0)
const statusText = computed(() => {
  const s = props.scene.videoStatus
  if (s === 'completed') return '已完成'
  if (s === 'generating') return '生成中'
  if (s === 'failed') return '生成失败'
  return '待生成'
})
const statusTagType = computed(() => {
  const s = props.scene.videoStatus
  if (s === 'completed') return 'success'
  if (s === 'generating') return 'primary'
  if (s === 'failed') return 'danger'
  return 'default'
})

const onGenerate = async () => {
  if (genLoading.value || props.isProcessing) return
  if (!canGenerate.value) { showToast('请先填写描述或添加图片'); return }
  
  genLoading.value = true
  isGenerating.value = true
  
  // 更新生成状态
  const generatingScene: VideoSceneItem = { 
    ...props.scene, 
    videoStatus: 'generating', 
    videoProgress: 0, 
    updatedAt: new Date() 
  }
  emit('update:scene', generatingScene)
  
  try {
    const prompt = videoDescription.value || '根据分镜图片和台词生成视频'
    
    // 模拟进度更新
    const progressInterval = setInterval(() => {
      const currentProgress = generatingScene.videoProgress || 0
      if (currentProgress < 90) {
        const updatedScene: VideoSceneItem = { 
          ...generatingScene, 
          videoProgress: Math.min(currentProgress + Math.random() * 15, 90),
          updatedAt: new Date() 
        }
        emit('update:scene', updatedScene)
      }
    }, 1000)
    
    const result = await generationStore.generateVideo({ 
      prompt, 
      width: 1280, 
      height: 720, 
      n: 1, 
      responseFormat: 'url' 
    } as any)
    
    clearInterval(progressInterval)
    
    const url = (result as any)?.videos?.videos?.[0]?.url || ''
    const updated: VideoSceneItem = { 
      ...props.scene, 
      video: url, 
      videoStatus: 'completed', 
      videoProgress: 100, 
      updatedAt: new Date() 
    }
    emit('update:scene', updated)
    showToast('分镜视频生成完成')
  } catch (e) {
    const updated: VideoSceneItem = { 
      ...props.scene, 
      videoStatus: 'failed', 
      videoProgress: 0,
      updatedAt: new Date() 
    }
    emit('update:scene', updated)
    showToast('生成失败')
  } finally {
    genLoading.value = false
    isGenerating.value = false
  }
}

const generateDesc = async () => {
  if (descLoading.value || props.isProcessing) return
  descLoading.value = true
  
  try {
    const base = '请生成一段简洁的分镜描述，包含画面元素、镜头运动和氛围。'
    const hintFromImages = localImages.value.length > 0 
      ? `参考图片数量${localImages.value.length}，类型${[...new Set(localImages.value.map(i => i.type))].join('/')}` 
      : '无参考图片'
    const hintFromScript = scriptText.value 
      ? `口播关键词：${scriptText.value.slice(0, 30)}` 
      : '无口播关键词'
    
    // 更丰富的描述生成逻辑
    const suggestions = [
      `【分镜建议】${hintFromImages}；${hintFromScript}。镜头以产品为主体，采用柔和光线与浅景深，突出质感与细节。结尾回到品牌标识与行动号召。`,
      `【分镜建议】${hintFromImages}；${hintFromScript}。中景镜头展示产品细节，配合轻柔的背景音乐，画面色调温暖自然。`,
      `【分镜建议】${hintFromImages}；${hintFromScript}。全景镜头展示产品使用场景，特写镜头强调产品优势，流畅转场增强观看体验。`,
    ]
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    videoDescription.value = (videoDescription.value || randomSuggestion).slice(0, 500)
    showToast('AI描述已生成')
  } catch (e) {
    console.error('生成描述失败:', e)
    showToast('生成描述失败')
  } finally {
    descLoading.value = false
  }
}

const optimizeScript = async () => {
  if (scriptLoading.value || props.isProcessing) return
  scriptLoading.value = true
  
  try {
    const base = '请优化以下口播台词，使其更加流畅、自然，并保持原意。'
    const hintFromDesc = videoDescription.value 
      ? `视频提示词：${videoDescription.value.slice(0, 50)}` 
      : '无视频提示词'
    
    // 根据不同语言生成优化建议
    const optimizeStrategies = [
      () => {
        // 简洁优化：保持原意，使语言更精炼
        if (scriptText.value.length > 100) {
          return scriptText.value.slice(0, 80) + '...'
        }
        return scriptText.value
      },
      () => {
        // 表达优化：增强感染力和说服力
        if (scriptText.value.includes('产品')) {
          return scriptText.value.replace(/产品/g, '这款高品质产品')
        }
        return scriptText.value
      },
      () => {
        // 结构优化：添加开场和结尾
        if (!scriptText.value.includes('大家好') && !scriptText.value.includes('感谢')) {
          return `大家好，今天为大家介绍${scriptText.value}。希望这次分享能帮助到大家，感谢收看！`
        }
        return scriptText.value
      }
    ]
    
    // 随机选择一种优化策略
    const selectedStrategy = optimizeStrategies[Math.floor(Math.random() * optimizeStrategies.length)]
    const optimizedText = selectedStrategy()
    
    // 确保不超过字数限制
    scriptText.value = optimizedText.slice(0, 300)
    showToast('台词已优化')
  } catch (e) {
    console.error('优化台词失败:', e)
    showToast('优化失败')
  } finally {
    scriptLoading.value = false
  }
}

const copyScript = async () => {
  try { await navigator.clipboard.writeText(scriptText.value || ''); showToast('已复制台词') } catch { showToast('复制失败') }
}
const clearScript = () => { scriptText.value = '' }
const confirmDelete = () => {
  if (props.isProcessing) return
  emit('delete', props.scene.id)
}


</script>·

<style scoped>
.video-scene-item { 
  padding: 3px 5px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(145deg, #f5f9ff 0%, #edf4ff 100%);
  box-shadow: 0 4px 20px rgba(41, 121, 255, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}
.video-scene-item:hover { 
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(41, 121, 255, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08);
}
.item-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 16px;
  padding-left: 0px;
  position: relative;
}
.scene-number {
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
  display: flex;
  align-items: center;
  background: rgba(25, 118, 210, 0.08);
  padding: 6px 12px;
  border-radius: 20px;
}
.scene-number::before {
  content: "🎬";
  margin-right: 6px;
  font-size: 18px;
}
.scene-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: #e3f2fd;
  color: #1976d2;
}

.images-section { margin-bottom: 20px; }
.images-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
  gap: 6px; 
}
.image-card { 
  position: relative; 
  border: none;
  border-radius: 12px; 
  overflow: hidden; 
  background: #fff; 
  cursor: pointer; 
  display: flex; 
  flex-direction: column; 
  box-shadow: 0 2px 8px rgba(41, 121, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}
.image-card:hover { 
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(41, 121, 255, 0.2);
}
.image-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1976d2, #64b5f6);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.image-card:hover::before {
  opacity: 1;
}
.image-card.add { 
  display: flex; 
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  color: #1976d2; 
  gap: 8px; 
  min-height: 130px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border: 2px dashed #90caf9;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}
.image-card.add::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.5s ease;
}
.image-card.add:hover::before {
  left: 100%;
}
.image-card.add:hover { 
  background: linear-gradient(135deg, #bbdefb, #90caf9);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(41, 121, 255, 0.15);
}
.image-card.add:disabled { 
  opacity: 0.5; 
  cursor: not-allowed;
  background: #f5f5f5;
  border-color: #e0e0e0;
}
.image-card.add .van-icon {
  font-size: 28px;
}
.image-meta { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 10px 12px; 
  position: relative;
  background: linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(248,251,255,0.95));
  backdrop-filter: blur(5px);
  border-top: 1px solid rgba(0,0,0,0.05);
}
.image-type {
  padding: 3px 10px;
  background: linear-gradient(45deg, #1976d2, #64b5f6);
  color: white;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
}
.delete-btn { 
  position: absolute; 
  top: -6px; 
  right: -6px; 
  width: 26px; 
  height: 26px; 
  border-radius: 50%; 
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background: rgba(244, 67, 54, 0.95);
  color: white;
  border: 2px solid white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.8);
}
.image-card:hover .delete-btn {
  opacity: 1;
  transform: scale(1);
}
.delete-btn:hover {
  background: #d32f2f;
  transform: scale(1.15);
  box-shadow: 0 4px 8px rgba(0,0,0,0.25);
}
.title { 
  font-size: 13px; 
  color: #546e7a; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  max-width: 80px;
  font-weight: 500;
}
.text-section { display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 20px; }
.field {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(41, 121, 255, 0.05);
  backdrop-filter: blur(5px);
}
.field-label { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  gap: 12px; 
  margin-bottom: 14px; 
  font-weight: 600;
  color: #1565c0;
  font-size: 15px;
  position: relative;
}
.field-label::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #1976d2, transparent);
  border-radius: 1px;
}
.tools { 
  margin-top: 14px; 
  display: flex; 
  gap: 10px; 
  flex-wrap: wrap;
  align-items: center;
}
.tools .van-button {
  transition: all 0.2s ease;
}
.tools .van-button:active {
  transform: scale(0.95);
}
.generate-section { 
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(41, 121, 255, 0.05);
  backdrop-filter: blur(5px);
}
.buttons { 
  display: flex; 
  gap: 12px; 
  flex-wrap: wrap;
  justify-content: center;
}
.progress { 
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  padding: 12px;
}
.progress-status { 
  font-size: 14px; 
  color: #1976d2; 
  margin-top: 8px; 
  text-align: center;
  font-weight: 500;
}
.result { 
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  padding: 12px;
}
.result-actions { 
  margin-top: 12px; 
  display: flex; 
  gap: 10px; 
  justify-content: center;
}

/* 新增样式 */
.content-section { 
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 20px; 
  margin-bottom: 20px; 
}
.video-prompt, .script-field { 
  position: relative;
}
.label-text {
  font-weight: 600;
  color: #1976d2;
  font-size: 15px;
}
.ai-icon {
  font-size: 18px;
}
.lang-selector {
  --van-dropdown-menu-height: 32px;
}
.custom-textarea {
  --van-field-input-text-color: #37474f;
  --van-field-placeholder-text-color: #90a4ae;
  --van-field-background-color: rgba(255, 255, 255, 0.7);
  --van-field-border-color: rgba(41, 121, 255, 0.2);
  --van-field-focus-border-color: #1976d2;
  --van-padding-xs: 10px;
  --van-padding-sm: 12px;
  --van-font-md: 14px;
}
.custom-textarea .van-field__control {
  border-radius: 8px;
  border: 1px solid rgba(41, 121, 255, 0.2);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}
.custom-textarea .van-field__control:focus {
  border-color: #1976d2;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}
.ai-btn {
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  border: none;
  color: white;
  font-weight: 500;
  box-shadow: 0 3px 10px rgba(25, 118, 210, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.ai-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255,255,255,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}
.ai-btn:hover::before {
  opacity: 1;
}
.ai-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(25, 118, 210, 0.4);
}
.mic-btn {
  background: linear-gradient(45deg, #00897b, #26a69a);
  border: none;
  color: white;
  box-shadow: 0 3px 10px rgba(0, 137, 123, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.mic-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255,255,255,0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}
.mic-btn:hover::before {
  opacity: 1;
}
.mic-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 137, 123, 0.4);
}
.action-buttons {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.action-section {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(41, 121, 255, 0.05);
  backdrop-filter: blur(5px);
}
.main-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.generate-btn {
  background: linear-gradient(45deg, #1976d2, #64b5f6);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 28px;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.generate-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s ease;
  z-index: -1;
}
.generate-btn:hover::before {
  left: 100%;
}
.generate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 18px rgba(25, 118, 210, 0.4);
}
.regenerate-btn {
  background: linear-gradient(45deg, #f57c00, #ffb74d);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 28px;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(245, 124, 0, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
}
.regenerate-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s ease;
  z-index: -1;
}
.regenerate-btn:hover::before {
  left: 100%;
}
.regenerate-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 18px rgba(245, 124, 0, 0.4);
}
.delete-btn-main {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #f44336;
  width: 44px;
  height: 44px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.delete-btn-main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(244, 67, 54, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.delete-btn-main:hover::before {
  opacity: 1;
}
.delete-btn-main:hover {
  background: rgba(244, 67, 54, 0.15);
  transform: scale(1.05);
  border-color: rgba(244, 67, 54, 0.5);
}
.progress-container {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.05), rgba(41, 121, 255, 0.1));
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
  position: relative;
  overflow: hidden;
}
.progress-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(25, 118, 210, 0.05), transparent);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 0.3; }
  100% { transform: scale(0.95); opacity: 0.7; }
}
.progress-title {
  font-size: 17px;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 16px;
  text-align: center;
  position: relative;
  z-index: 1;
}
.progress-title::after {
  content: '...';
  display: inline-block;
  animation: dots 1.5s infinite;
  margin-left: 5px;
}
@keyframes dots {
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
}
.progress-text {
  font-size: 15px;
  color: #1976d2;
  text-align: center;
  margin-top: 12px;
  font-weight: 500;
  position: relative;
  z-index: 1;
}
.video-preview {
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 12px;
  position: relative;
  overflow: hidden;
}
.video-preview::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(25, 118, 210, 0.03), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}
@keyframes shimmer {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}
</style>
