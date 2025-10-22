<template>
  <div v-if="visible" class="function-panel" ref="panelRef">
    <div class="panel-header">
      <h3 class="panel-title">功能面板</h3>
    </div>
    
    <div class="panel-content">
      <div class="function-grid">
        <button
          v-for="item in functionItems"
          :key="item.id"
          @click="handleFunctionClick(item)"
          class="function-item"
        >
          <div class="function-icon">
            <component :is="item.icon" v-if="item.icon" />
            <span v-else class="emoji-icon">{{ item.emoji }}</span>
          </div>
          <span class="function-label">{{ item.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import PhotoIcon from './icons/PhotoIcon.vue'
import FileIcon from './icons/FileIcon.vue'
import CameraIcon from './icons/CameraIcon.vue'
import LocationIcon from './icons/LocationIcon.vue'

interface Props {
  visible?: boolean
}

interface Emits {
  (e: 'select-function', functionId: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emit = defineEmits<Emits>()

const panelRef = ref<HTMLDivElement | null>(null)

const functionItems = [
  { id: 'photo', label: '照片', emoji: '📷', icon: PhotoIcon },
  { id: 'camera', label: '拍摄', emoji: '🎥', icon: CameraIcon },
  { id: 'file', label: '文件', emoji: '📁', icon: FileIcon },
  { id: 'location', label: '位置', emoji: '📍', icon: LocationIcon },
  { id: 'voice', label: '语音', emoji: '🎤' },
  { id: 'video', label: '视频', emoji: '📹' },
  { id: 'contact', label: '名片', emoji: '📇' },
  { id: 'transfer', label: '转账', emoji: '💸' }
]

const handleFunctionClick = (item: any) => {
  emit('select-function', item.id)
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (panelRef.value && !panelRef.value.contains(event.target as Node)) {
    emit('close')
  }
}

// 监听点击外部事件
onMounted(() => {
  if (props.visible) {
    document.addEventListener('mousedown', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// 监听visible变化
watch(() => props.visible, (visible) => {
  if (visible) {
    document.addEventListener('mousedown', handleClickOutside)
  } else {
    document.removeEventListener('mousedown', handleClickOutside)
  }
})
</script>

<style scoped lang="scss">
.function-panel {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 320px;
  height: 200px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  
  .panel-header {
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    
    .panel-title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
  }
  
  .panel-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    
    .function-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      
      .function-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 12px 8px;
        border: none;
        background: transparent;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          background: #f8f8f8;
          transform: translateY(-2px);
        }
        
        &:active {
          transform: translateY(0);
        }
        
        .function-icon {
          width: 40px;
          height: 40px;
          background: #07c160;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
          
          .emoji-icon {
            font-size: 24px;
          }
        }
        
        .function-label {
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .function-panel {
    width: 100%;
    height: 180px;
    left: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    
    .panel-content {
      padding: 12px;
      
      .function-grid {
        gap: 8px;
        
        .function-item {
          padding: 8px 4px;
          
          .function-icon {
            width: 36px;
            height: 36px;
            font-size: 18px;
            
            .emoji-icon {
              font-size: 20px;
            }
          }
          
          .function-label {
            font-size: 11px;
          }
        }
      }
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .function-panel {
    background: #2d2d2d;
    border-color: #444;
    
    .panel-header {
      border-bottom-color: #444;
      
      .panel-title {
        color: #fff;
      }
    }
    
    .panel-content {
      .function-grid {
        .function-item {
          &:hover {
            background: #3d3d3d;
          }
          
          .function-label {
            color: #ccc;
          }
        }
      }
    }
  }
}
</style>