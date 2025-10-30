<template>
  <div class="chat-input-emoji-panel">
    <div class="emoji-categories">
      <button 
        v-for="category in emojiCategories" 
        :key="category"
        class="category-button"
        :class="{ active: currentCategory === category }"
        @click="currentCategory = category"
      >
        {{ category }}
      </button>
    </div>
    <div class="emoji-grid">
      <button
        v-for="emoji in currentEmojis"
        :key="emoji"
        class="emoji-item"
        @click="$emit('select-emoji', emoji)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Emits {
  'select-emoji': [emoji: string]
}

const emit = defineEmits<Emits>()

const currentCategory = ref('表情')
const emojiCategories = ['表情', '人物', '动物', '食物', '活动', '符号']
const emojiMap = {
  '表情': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
  '人物': ['👶', '👧', '👦', '👩', '👨', '👵', '👴', '👮', '👷', '💂'],
  '动物': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  '食物': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒'],
  '活动': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'],
  '符号': ['❤️', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕', '💞']
}

const currentEmojis = computed(() => {
  return emojiMap[currentCategory.value as keyof typeof emojiMap] || []
})
</script>

<style scoped>
.chat-input-emoji-panel {
  border-top: 1px solid #e0e0e0;
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-categories {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.category-button {
  padding: 4px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  background-color: #f8f9fa;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.category-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
  gap: 8px;
}

.emoji-item {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 18px;
  transition: background-color 0.2s;
}

.emoji-item:hover {
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .chat-input-emoji-panel {
    max-height: 150px;
  }
}

@media (prefers-color-scheme: dark) {
  .chat-input-emoji-panel {
    border-top-color: #404040;
  }
  
  .emoji-categories {
    border-bottom-color: #404040;
  }
  
  .category-button {
    background-color: #3a3a3a;
    border-color: #404040;
    color: #fff;
  }
  
  .emoji-item:hover {
    background-color: #4a4a4a;
  }
}
</style>