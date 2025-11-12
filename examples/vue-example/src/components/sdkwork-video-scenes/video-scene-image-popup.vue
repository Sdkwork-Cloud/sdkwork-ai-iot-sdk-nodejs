<template>
  <sdkwork-popup v-model:show="show" position="bottom" round class="image-popup">
    <div class="popup-content">
      <van-tabs v-model:active="activeTab">
        <van-tab title="图生视频" name="image2video">
          <div class="section">
            <div class="section-header">
              <div class="title">上传参考图片</div>
              <div class="tips">支持JPG、PNG格式，最大10MB，最多10张</div>
            </div>
            <sdkwork-uploader-image 
              v-model="uploadFiles" 
              :max-size="10 * 1024 * 1024" 
              :multiple="true" 
              :max-count="10"
            />
            <div class="prompt">
              <van-field 
                v-model="textPrompt" 
                type="textarea" 
                rows="3" 
                maxlength="500"
                show-word-limit
                placeholder="请输入视频生成描述" 
              />
            </div>
          </div>
        </van-tab>
        <van-tab title="首尾帧视频" name="frames">
          <div class="section frames">
            <div class="frame">
              <div class="label">首帧</div>
              <sdkwork-uploader-image v-model="startFrame" :max-size="10 * 1024 * 1024" :max-count="1" />
            </div>
            <div class="frame">
              <div class="label">尾帧</div>
              <sdkwork-uploader-image v-model="endFrame" :max-size="10 * 1024 * 1024" :max-count="1" />
            </div>
          </div>
        </van-tab>
        <van-tab title="作品库" name="library">
          <div class="section">
            <div class="library-header">
              <van-search 
                v-model="librarySearchQuery" 
                placeholder="搜索素材" 
                @search="handleLibrarySearch"
                @clear="handleLibrarySearch"
              />
            </div>
            
            <div class="library-filter">
              <van-dropdown-menu>
                <van-dropdown-item 
                  v-model="libraryFilterType" 
                  :options="imageTypeOptions" 
                  title="图片类型"
                />
              </van-dropdown-menu>
            </div>
            
            <sdkwork-api-list 
              :api="api" 
              :page-size="10" 
              :selectable="true" 
              @select="onLibrarySelect"
            >
              <template #default="{ item }">
                <div class="library-item">
                  <div class="library-item-image">
                    <van-image :src="item.url || item.previewUrl" fit="cover" width="100%" height="100" />
                    <div class="library-item-overlay">
                      <van-button 
                        v-if="props.images.some(i => i.id === item.id)"
                        size="mini" 
                        type="success" 
                        icon="success"
                        disabled
                      >
                        已添加
                      </van-button>
                    </div>
                  </div>
                  <div class="library-item-info">
                    <div class="name">{{ item.name || item.fileName }}</div>
                    <div class="meta">
                      <van-tag :type="item.type === 'product' ? 'primary' : 'default'">
                        {{ item.type === 'product' ? '商品图' : '参考图' }}
                      </van-tag>
                      <span class="size">{{ formatFileSize(item.size) }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </sdkwork-api-list>
          </div>
        </van-tab>
      </van-tabs>

      <div class="preview" v-if="previewImages.length > 0">
        <div class="preview-header">
          <span>已选择图片 ({{ previewImages.length }})</span>
          <van-button size="mini" type="danger" plain @click="clearAllImages">清空</van-button>
        </div>
        <div class="preview-grid">
          <div v-for="(img, index) in previewImages" :key="img.id" class="preview-item">
            <div class="preview-item-wrapper">
              <van-image :src="img.url" fit="cover" width="100%" height="100" />
              <div class="preview-item-overlay">
                <van-button 
                  size="mini" 
                  type="danger" 
                  icon="cross"
                  @click="removePreviewImage(index)"
                />
              </div>
            </div>
            <div class="preview-item-info">
              <van-tag type="success">{{ imageTypeLabel(img.type) }}</van-tag>
              <span class="title">{{ img.title || `图片${index + 1}` }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <van-button type="primary" :loading="isProcessing" @click="save">保存到分镜项</van-button>
        <van-button type="default" @click="close">取消</van-button>
      </div>
    </div>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SceneImage } from '@/components/sdkwork-generation-video-scenes/types'
import { showToast } from 'vant'

const props = defineProps<{ images: SceneImage[] }>()
const emit = defineEmits<{ (e: 'save', imgs: SceneImage[]): void }>()
defineOptions({ name: 'video-scene-image-popup' })
const show = defineModel<boolean>('show', { default: false })

const activeTab = ref('image2video')
const uploadFiles = ref<File[]>([])
const textPrompt = ref('')
const startFrame = ref<File[]>([])
const endFrame = ref<File[]>([])
const isProcessing = ref(false)

// 监听弹窗关闭，重置表单数据
watch(show, (newVal) => {
  if (!newVal) {
    // 延迟重置，避免在关闭动画中闪烁
    setTimeout(() => {
      uploadFiles.value = []
      textPrompt.value = ''
      startFrame.value = []
      endFrame.value = []
      activeTab.value = 'image2video'
    }, 300)
  }
})
// 模拟API延迟，更接近真实体验
const api = async (params: any, pageable: any) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const page = params?.page || 0
  const size = pageable?.pageSize || 10
  const start = page * size
  
  // 更丰富的模拟数据
  const items = Array.from({ length: size }).map((_, i) => {
    const id = start + i + 1
    const imageId = 100 + id
    return { 
      id: `lib-${id}`, 
      name: `素材-${id}`, 
      fileName: `material-${imageId}.jpg`,
      url: `https://picsum.photos/id/${imageId}/800/450`,
      previewUrl: `https://picsum.photos/id/${imageId}/200/150`,
      type: ['product', 'reference'][Math.floor(Math.random() * 2)],
      size: Math.floor(Math.random() * 500000) + 100000,
      width: 800,
      height: 450
    }
  })
  
  return { 
    content: items, 
    pageable: { pageNumber: page, pageSize: size }, 
    last: page >= 2, 
    total: 30,
    empty: items.length === 0,
    first: page === 0
  }
}

const previewImages = computed<SceneImage[]>(() => {
  const imgs: SceneImage[] = []
  if (activeTab.value === 'frames') {
    if (startFrame.value[0]) imgs.push({ id: 'start-' + startFrame.value[0].name, url: URL.createObjectURL(startFrame.value[0]), type: 'startFrame' })
    if (endFrame.value[0]) imgs.push({ id: 'end-' + endFrame.value[0].name, url: URL.createObjectURL(endFrame.value[0]), type: 'endFrame' })
  } else if (activeTab.value === 'image2video') {
    uploadFiles.value.forEach(f => imgs.push({ id: 'u-' + f.name, url: URL.createObjectURL(f), type: 'reference' }))
  } else {
    imgs.push(...(props.images || []))
  }
  return imgs
})

const imageTypeLabel = (t: SceneImage['type']) => {
  const map: Record<string, string> = { startFrame: '首帧', endFrame: '尾帧', product: '商品图', reference: '参考图' }
  return map[t] || t
}

const save = () => {
  if (isProcessing.value) return
  
  // 验证输入
  if (activeTab.value === 'frames') {
    if (!startFrame.value.length || !endFrame.value.length) {
      showToast('请上传首帧和尾帧图片')
      return
    }
  } else if (activeTab.value === 'image2video') {
    if (!uploadFiles.value.length) {
      showToast('请上传至少一张参考图片')
      return
    }
  }
  
  isProcessing.value = true
  const imgs = [...previewImages.value]
  emit('save', imgs)
  close()
  isProcessing.value = false
}

const close = () => { (show as any).value = false }

// 预览图片操作
const removePreviewImage = (index: number) => {
  if (activeTab.value === 'image2video') {
    uploadFiles.value.splice(index, 1)
  } else if (activeTab.value === 'frames') {
    if (index === 0 && startFrame.value.length > 0) {
      startFrame.value = []
    } else if (index === 1 && endFrame.value.length > 0) {
      endFrame.value = []
    }
  }
}

const clearAllImages = () => {
  uploadFiles.value = []
  startFrame.value = []
  endFrame.value = []
  showToast('已清空所有图片')
}

// 作品库搜索和筛选
const librarySearchQuery = ref('')
const libraryFilterType = ref('')
const imageTypeOptions = [
  { text: '全部', value: '' },
  { text: '商品图', value: 'product' },
  { text: '参考图', value: 'reference' }
]

const handleLibrarySearch = () => {
  // 这里可以实现搜索逻辑
  showToast('搜索功能开发中')
}

const formatFileSize = (size?: number) => {
  if (!size) return '未知大小'
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)}KB`
  }
  return `${(size / (1024 * 1024)).toFixed(1)}MB`
}

const onLibrarySelect = (item: any) => {
  if (isProcessing.value) return
  
  const img: SceneImage = { 
    id: item.id || item.fileId || String(Math.random()), 
    url: item.url || item.previewUrl, 
    type: item.type || 'reference', 
    title: item.name || item.fileName,
    width: item.width,
    height: item.height,
    size: item.size
  }
  
  // 检查是否已存在相同ID的图片
  const existing = props.images.some(i => i.id === img.id)
  if (existing) {
    showToast('该图片已添加')
    return
  }
  
  isProcessing.value = true
  const next = [...(props.images || []), img]
  emit('save', next)
  showToast('图片已添加')
  isProcessing.value = false
}

// 移除已选择的图片
const removeImage = (imageId: string) => {
  const next = props.images.filter(img => img.id !== imageId)
  emit('save', next)
  showToast('图片已移除')
}

// 切换到作品库标签
const switchToLibraryTab = () => {
  activeTab.value = 'library'
}
</script>

<style scoped>
.image-popup { max-height: 80vh; overflow: hidden; }
.popup-content { padding: 12px; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.section { padding: 8px 0; }
.section-header { margin-bottom: 12px; }
.section-header .title { font-weight: 600; margin-bottom: 4px; }
.section-header .tips { font-size: 12px; color: var(--van-text-color-2); }
.frames { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.frame .label { margin-bottom: 6px; font-weight: 600; }
.preview { margin-top: 8px; max-height: 200px; overflow-y: auto; }
.preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-weight: 600; }
.preview-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
.preview-item { display: flex; flex-direction: column; gap: 4px; position: relative; }
.preview-item-wrapper { position: relative; }
.preview-item-overlay { 
  position: absolute; 
  top: 4px; 
  right: 4px; 
  opacity: 0;
  transition: opacity 0.2s ease;
}
.preview-item:hover .preview-item-overlay { opacity: 1; }
.preview-item-info { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  padding: 4px 0;
}
.preview-item-info .title { 
  font-size: 12px; 
  color: var(--van-text-color-2); 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  max-width: 70px;
}

.library-header { margin-bottom: 12px; }
.library-filter { margin-bottom: 12px; }
.library-item { 
  display: grid; 
  grid-template-columns: 120px 1fr; 
  gap: 8px; 
  align-items: center; 
  padding: 8px;
  border: 1px solid var(--van-border-color);
  border-radius: 6px;
  transition: border-color 0.2s ease;
}
.library-item:hover { border-color: var(--van-primary-color); }
.library-item-image { position: relative; overflow: hidden; border-radius: 4px; }
.library-item-overlay { 
  position: absolute; 
  top: 4px; 
  right: 4px; 
  z-index: 2;
}
.library-item-info { display: flex; flex-direction: column; gap: 4px; }
.library-item-info .name { 
  font-weight: 500; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}
.library-item-info .meta { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  font-size: 12px;
}
.library-item-info .size { color: var(--van-text-color-2); }

.actions { display: flex; gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--van-border-color); }
</style>
