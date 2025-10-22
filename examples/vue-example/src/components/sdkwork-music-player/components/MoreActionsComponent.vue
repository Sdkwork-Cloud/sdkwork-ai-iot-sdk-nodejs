<template>
  <div class="more-actions-component" :class="mode">
    <DropdownComponent 
      ref="dropdownRef"
      :placement="dropdownPlacement" 
      :auto-placement="true"
      @open="onDropdownOpen"
      @close="onDropdownClose"
    >
      <!-- 触发器 -->
      <template #trigger>
        <button class="more-actions-trigger">
          <Icon icon="mdi:dots-vertical" />
        </button>
      </template>

      <!-- 菜单内容 -->
      <template #menu>
        <div class="dropdown-menu-content">
          <!-- 关闭播放器选项 -->
          <div class="menu-item" @click="handleClosePlayer">
            <Icon icon="mdi:close" class="menu-icon" />
            <span class="menu-text">关闭播放器</span>
          </div>

          <!-- 分隔线 -->
          <div class="menu-divider"></div>

          <!-- 播放模式选项 -->
          <div class="menu-item" @click="handlePlayModeChange">
            <Icon :icon="playModeIcon" class="menu-icon" />
            <span class="menu-text">{{ playModeText }}</span>
          </div>

          <!-- 音质设置 -->
          <div class="menu-item" @click="handleQualityChange">
            <Icon icon="mdi:music-note" class="menu-icon" />
            <span class="menu-text">{{ qualityText }}</span>
          </div>

          <!-- 定时关闭 -->
          <div class="menu-item" @click="handleSleepTimer">
            <Icon icon="mdi:timer-outline" class="menu-icon" />
            <span class="menu-text">定时关闭</span>
          </div>

          <!-- 分隔线 -->
          <div class="menu-divider"></div>

          <!-- 分享选项 -->
          <div class="menu-item" @click="handleShare">
            <Icon icon="mdi:share-variant" class="menu-icon" />
            <span class="menu-text">分享</span>
          </div>

          <!-- 添加到收藏 -->
          <div class="menu-item" @click="handleAddToFavorites">
            <Icon :icon="isLiked ? 'mdi:heart' : 'mdi:heart-outline'" class="menu-icon" :class="{ liked: isLiked }" />
            <span class="menu-text">{{ isLiked ? '取消收藏' : '添加到收藏' }}</span>
          </div>
        </div>
      </template>
    </DropdownComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { usePlayerStore } from '@/stores/modules/player'
import { PlayMode } from '@/stores/modules/player/types'
import DropdownComponent from './DropdownComponent.vue'

interface Props {
  mode?: 'card' | 'bottom-bar' | 'fullscreen'
  isLiked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'card',
  isLiked: false
})

const emit = defineEmits<{
  'close-player': []
  'like': []
  'share': []
}>()

const playerStore = usePlayerStore()
const dropdownRef = ref<InstanceType<typeof DropdownComponent>>()

// 根据模式计算dropdown的默认位置
const dropdownPlacement = computed(() => {
  switch (props.mode) {
    case 'bottom-bar':
      return 'top' // 底部栏模式默认显示在上方
    case 'fullscreen':
      return 'bottom' // 全屏模式默认显示在下方
    case 'card':
    default:
      return 'bottom' // 卡片模式默认显示在下方
  }
})

// 计算属性
const playMode = computed(() => playerStore.playMode)
const playModeIcon = computed(() => {
  switch (playMode.value) {
    case PlayMode.LOOP:
      return 'mdi:repeat'
    case PlayMode.SHUFFLE:
      return 'mdi:shuffle'
    case PlayMode.SINGLE:
      return 'mdi:repeat-once'
    default:
      return 'mdi:repeat'
  }
})

const playModeText = computed(() => {
  switch (playMode.value) {
    case PlayMode.LOOP:
      return '列表循环'
    case PlayMode.SHUFFLE:
      return '随机播放'
    case PlayMode.SINGLE:
      return '单曲循环'
    default:
      return '列表循环'
  }
})

const qualityText = computed(() => {
  return '标准音质'
})

// 关闭下拉菜单的方法
const closeDropdown = () => {
  dropdownRef.value?.close()
}

// 方法
const onDropdownOpen = () => {
  // 下拉菜单打开时的处理
}

const onDropdownClose = () => {
  // 下拉菜单关闭时的处理
}

const handleClosePlayer = async () => {
  // 先停止播放音乐
  await playerStore.pause()
  // 然后emit事件，让顶部使用方来决定是否显示
  emit('close-player')
  closeDropdown()
}

const handlePlayModeChange = () => {
  // 切换播放模式
  const modes = [PlayMode.LOOP, PlayMode.SHUFFLE, PlayMode.SINGLE]
  const currentIndex = modes.indexOf(playMode.value)
  const nextIndex = (currentIndex + 1) % modes.length
  playerStore.setPlayMode(modes[nextIndex])
  closeDropdown()
}

const handleQualityChange = () => {
  // 切换音质
  closeDropdown()
}

const handleSleepTimer = () => {
  // 定时关闭
  closeDropdown()
}

const handleShare = () => {
  emit('share')
  closeDropdown()
}

const handleAddToFavorites = () => {
  emit('like')
  closeDropdown()
}
</script>

<style scoped>
.more-actions-component {
  display: inline-block;
}

.more-actions-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.more-actions-trigger:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dropdown-menu-content {
  padding: 8px 0;
  min-width: 180px;
  max-height: 300px;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  gap: 12px;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.menu-icon {
  width: 20px;
  height: 20px;
  color: #666;
}

.menu-text {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.menu-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 4px 0;
}

.liked {
  color: #ff3b30;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .menu-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .menu-icon {
    color: #8e8e93;
  }

  .menu-text {
    color: #ffffff;
  }

  .menu-divider {
    background: rgba(255, 255, 255, 0.1);
  }
}

/* 不同模式下的样式调整 */
.more-actions-component.card .more-actions-trigger {
  width: 28px;
  height: 28px;
}

.more-actions-component.bottom-bar .more-actions-trigger {
  width: 24px;
  height: 24px;
}

.more-actions-component.fullscreen .more-actions-trigger {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
}

.more-actions-component.fullscreen .more-actions-trigger:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>