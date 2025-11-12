<template>
  <div class="sdkwork-video-scenes">
    <van-sticky>
      <div class="toolbar">
        <div class="main-actions">
          <van-button type="primary" size="small" round :loading="isProcessing" @click="addScene">
            <sdkwork-icon icon="ri:add-line" />
            新增
          </van-button>
          <van-popover
            v-model:show="showPopover"
            placement="bottom-end"
            :offset="[8, 8]"
            class="popover-menu"
          >
            <van-cell-group>
              <van-cell title="保存草稿" is-link @click="onSaveDraftAndClose" :disabled="isProcessing" :center="true">
                <template #icon><sdkwork-icon icon="ri:save-line" /></template>
              </van-cell>
              <van-cell title="清空全部" is-link @click="clearAllAndClose" :disabled="scenes.length===0 || isProcessing" :center="true">
                <template #icon><sdkwork-icon icon="ri:delete-bin-line" /></template>
              </van-cell>
            </van-cell-group>
            <template #reference>
              <van-button size="small" round>
                <sdkwork-icon icon="ri:more-2-fill" />
              </van-button>
            </template>
          </van-popover>
        </div>
        <div class="stats">
          <van-tag type="primary">{{ scenes.length }}</van-tag>
          <van-tag type="success">{{ totalDuration }}s</van-tag>
        </div>
      </div>
    </van-sticky>

    <div class="tips" v-if="scenes.length===0">
      <van-empty description="暂无分镜">
        <van-button type="primary" @click="addScene">新增分镜</van-button>
      </van-empty>
    </div>

    <div class="scene-list" @dragover.prevent @drop.prevent="onDrop" v-else>
      <div
        v-for="(item, idx) in scenes"
        :key="item.id"
        :class="['scene-row', { dragging: idx===draggingIndex, 'is-dragging': isDragging }]"
        draggable="true"
        @dragstart="onDragStart(idx)"
        @dragend="onDragEnd"
      >
        <sdkwork-video-scene-item 
          :scene="item" 
          @update:scene="updateScene" 
          @delete="removeScene"
          :is-processing="isProcessing"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { showConfirmDialog, showToast } from 'vant'
import type { VideoSceneItem } from '@/components/sdkwork-generation-video-scenes/types'
import sdkworkVideoSceneItem from './sdkwork-video-scene-item.vue'
import sdkworkIcon from '@/components/sdkwork-icon/sdkwork-icon.vue'

defineOptions({ name: 'sdkwork-video-scenes' })

const AUTO_SAVE_KEY = 'video-scenes-draft'
const AUTO_SAVE_DELAY = 600

const scenes = ref<VideoSceneItem[]>(loadInitial())
const isProcessing = ref(false)
const batchUpdates = ref<VideoSceneItem[]>([])
const isDragging = ref(false)
const showPopover = ref(false)
const draggingIndex = ref<number | null>(null)

const genId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`
const addScene = () => {
  if (isProcessing.value) return
  isProcessing.value = true
  const now = new Date()
  const newScene: VideoSceneItem = {
    id: genId(),
    order: scenes.value.length + 1,
    videoDescription: '',
    script: '',
    duration: 5,
    images: [],
    createdAt: now,
    updatedAt: now,
    videoStatus: 'pending',
    videoProgress: 0
  }
  scenes.value.push(newScene)
  nextTick(() => {
    const rows = document.querySelectorAll('.scene-row')
    const last = rows[rows.length - 1]
    last?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    isProcessing.value = false
  })
}

const removeScene = async (id: string) => {
  if (isProcessing.value) return
  try {
    await showConfirmDialog({ title: '确认删除', message: '删除后不可恢复，确认删除该分镜？' })
    isProcessing.value = true
    scenes.value = scenes.value.filter(s => s.id !== id)
    reassignOrder()
    showToast('已删除分镜')
  } catch {}
  isProcessing.value = false
}

const updateScene = (updated: VideoSceneItem) => {
  const index = scenes.value.findIndex(s => s.id === updated.id)
  if (index !== -1) {
    scenes.value[index] = { ...updated, updatedAt: new Date() }
  }
}

const onDragStart = (idx: number) => {
  draggingIndex.value = idx
  isDragging.value = true
}
const onDragEnd = () => {
  draggingIndex.value = null
  isDragging.value = false
}
const onDrop = (e: DragEvent) => {
  if (draggingIndex.value == null || isDragging.value === false) return
  
  const target = (e.target as HTMLElement).closest('.scene-row')
  if (!target) return
  
  const nodes = Array.from(document.querySelectorAll('.scene-row'))
  const to = nodes.indexOf(target)
  
  if (to < 0 || to === draggingIndex.value) return
  
  const list = [...scenes.value]
  const [moved] = list.splice(draggingIndex.value, 1)
  list.splice(to, 0, moved)
  scenes.value = list
  reassignOrder()
  draggingIndex.value = null
  isDragging.value = false
}

const reassignOrder = () => {
  scenes.value = scenes.value.map((s, i) => ({ ...s, order: i + 1, updatedAt: new Date() }))
}

const snapshot = () => {
  // 简化版本，仅用于记录操作历史（如需要）
}





watch(scenes, () => { autoSave() }, { deep: true })

let autoSaveTimer: number | null = null
const autoSave = () => {
  if (autoSaveTimer) window.clearTimeout(autoSaveTimer)
  autoSaveTimer = window.setTimeout(() => {
    try {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(scenes.value))
    } catch (e) {
      console.error('自动保存失败:', e)
    }
  }, AUTO_SAVE_DELAY)
}

const onSaveDraft = () => {
  try {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(scenes.value))
    showToast('草稿已保存')
  } catch (e) {
    console.error('保存草稿失败:', e)
    showToast('保存失败')
  }
}

const onSaveDraftAndClose = () => {
  onSaveDraft()
  showPopover.value = false
}

const clearAllAndClose = () => {
  clearAll().finally(() => {
    showPopover.value = false
  })
}

const clearAll = async () => {
  if (scenes.value.length === 0 || isProcessing.value) return
  
  try {
    await showConfirmDialog({ 
      title: '清空全部', 
      message: '确认清空全部分镜？' 
    })
    
    isProcessing.value = true
    scenes.value = []
    autoSave()
    showToast('已清空')
  } catch {}
  isProcessing.value = false
}

function loadInitial(): VideoSceneItem[] {
  try {
    const raw = localStorage.getItem(AUTO_SAVE_KEY)
    if (!raw) return []
    
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('加载草稿失败:', e)
    return []
  }
}

const totalDuration = computed(() => {
  return scenes.value.reduce((sum, s) => {
    const duration = Number(s.duration) || 0
    return sum + duration
  }, 0)
})

// 优化批量操作
const batchUpdateScenes = (updates: VideoSceneItem[]) => {
  if (isProcessing.value) return
  
  isProcessing.value = true
  
  updates.forEach(updated => {
    const index = scenes.value.findIndex(s => s.id === updated.id)
    if (index !== -1) {
      scenes.value[index] = { ...updated, updatedAt: new Date() }
    }
  })
  
  isProcessing.value = false
}

// 键盘快捷键支持
const handleKeyboardShortcuts = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 's':
        e.preventDefault()
        onSaveDraft()
        break
    }
  }
}

// 监听子组件的拖拽事件
const handleCustomDragStart = (e: any) => {
  const sceneId = e.detail?.sceneId
  const index = scenes.value.findIndex(s => s.id === sceneId)
  if (index !== -1) {
    draggingIndex.value = index
    isDragging.value = true
  }
}

// 生命周期钩子中添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyboardShortcuts)
  document.addEventListener('dragstart', handleCustomDragStart)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboardShortcuts)
  document.removeEventListener('dragstart', handleCustomDragStart)
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
})
</script>

<style scoped>
.sdkwork-video-scenes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--van-background-2);
  border-bottom: 1px solid var(--van-border-color);
}

.main-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.popover-menu {
  max-width: 200px;
}

.popover-menu :deep(.van-cell) {
  align-items: center;
}

.popover-menu :deep(.van-cell__title) {
  display: flex;
  align-items: center;
}

.popover-menu :deep(.van-cell__left-icon) {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.stats {
  display: flex;
  gap: 6px;
  align-items: center;
}

.scene-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scene-row {
  position: relative;
  display: block;
  transition: background 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
}

.tips {
  padding: 24px;
}

@media (max-width: 480px) {
  .toolbar {
    padding: 6px 8px;
  }
  
  .main-actions {
    gap: 4px;
  }
  
  .stats {
    gap: 4px;
  }
}
</style>

