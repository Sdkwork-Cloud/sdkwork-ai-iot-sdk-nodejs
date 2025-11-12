<template>
  <div class="recent-panel">
    <div class="recent-characters" v-if="recentCharacters.length > 0">
      <div 
        v-for="character in recentCharacters" 
        :key="character.id"
        class="character-item"
        @click="handleSelect(character)"
      >
        <div class="character-avatar">
          <img v-if="character.avatar" :src="character.avatar" :alt="character.name" />
          <div v-else class="avatar-placeholder">{{ character.name.charAt(0).toUpperCase() }}</div>
        </div>
        <div class="character-info">
          <div class="character-name">{{ character.name }}</div>
          <div class="character-desc">{{ character.description }}</div>
          <div class="character-tags">
            <van-tag v-for="tag in (character as any).tags" :key="tag" type="primary">
              {{ tag }}
            </van-tag>
          </div>
          <div class="character-time">{{ formatTime((character as any).lastUsed) }}</div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-result">
      <van-empty description="暂无最近使用的角色" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DialogueCharacter } from '../types'

// Props
interface Props {
  recentCharacters?: DialogueCharacter[]
  storageKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  recentCharacters: () => [],
  storageKey: 'dialogue-recent-characters'
})

// Emits
const emit = defineEmits<{
  (e: 'select', character: DialogueCharacter): void
}>()

// 最近使用角色
const recentCharacters = ref<DialogueCharacter[]>(props.recentCharacters)

// 处理选择角色
const handleSelect = (character: DialogueCharacter) => {
  emit('select', character)
}

// 格式化时间显示
const formatTime = (timestamp: number) => {
  if (!timestamp) return ''
  
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60 * 1000) {
    return '刚刚'
  } else if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))} 分钟前`
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))} 小时前`
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))} 天前`
  } else {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }
}

// 从本地存储加载最近使用的角色
const loadRecentCharacters = () => {
  try {
    const stored = localStorage.getItem(props.storageKey)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        recentCharacters.value = parsed.sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0))
      }
    }
  } catch (e) {
    console.error('加载最近使用的角色失败', e)
  }
}

// 添加角色到最近使用
const addToRecent = (character: DialogueCharacter) => {
  const existingIndex = recentCharacters.value.findIndex(c => c.id === character.id)
  
  if (existingIndex >= 0) {
    // 如果已存在，更新使用时间并移到最前面
    recentCharacters.value[existingIndex] = {
      ...character, 
    }
    const movedCharacter = recentCharacters.value.splice(existingIndex, 1)[0]
    recentCharacters.value.unshift(movedCharacter)
  } else {
    // 如果不存在，添加到最前面
    const characterWithTime = {
      ...character,
      lastUsed: Date.now() as any
    }
    recentCharacters.value.unshift(characterWithTime)
  }
  
  // 限制最多保存10个最近使用的角色
  if (recentCharacters.value.length > 10) {
    recentCharacters.value = recentCharacters.value.slice(0, 10)
  }
  
  // 保存到本地存储
  localStorage.setItem(props.storageKey, JSON.stringify(recentCharacters.value))
}

// 设置最近使用角色
const setRecentCharacters = (characters: DialogueCharacter[]) => {
  recentCharacters.value = characters
}

// 初始化数据
onMounted(() => {
  // 如果没有传入最近使用角色，从本地存储加载
  if (recentCharacters.value.length === 0) {
    loadRecentCharacters()
  }
})

// 暴露方法给父组件
defineExpose({
  addToRecent,
  setRecentCharacters,
  loadRecentCharacters
})
</script>

<style lang="scss" scoped>
.recent-panel {
  .recent-characters {
    .character-item {
      display: flex;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      border-radius: 8px;
      
      .character-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 12px;
        flex-shrink: 0;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--van-primary-color);
          color: white;
          font-weight: bold;
        }
      }
      
      .character-info {
        flex: 1;
        min-width: 0;
        
        .character-name {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .character-desc {
          font-size: 14px;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .character-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 4px;
        }
        
        .character-time {
          font-size: 12px;
          color: var(--text-hint-color);
        }
      }
    }
  }
  
  .empty-result {
    padding: 40px 0;
  }
}

.character-item {
  background-color: var(--character-item-bg);
  
  &:active {
    background-color: var(--character-item-active-bg);
  }
  
  .character-info {
    .character-name {
      color: var(--text-primary-color);
    }
    
    .character-desc {
      color: var(--text-secondary-color);
    }
  }
}
</style>