<template>
  <div v-if="visible" class="emoji-picker" ref="pickerRef">
    <div class="emoji-header">
      <div class="emoji-tabs">
        <button
          v-for="category in emojiCategories"
          :key="category"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category"
          class="tab-button"
        >
          {{ categoryLabels[category] }}
        </button>
      </div>
    </div>
    
    <div class="emoji-content">
      <div class="emoji-grid">
        <button
          v-for="emoji in filteredEmojis"
          :key="emoji"
          @click="selectEmoji(emoji)"
          class="emoji-item"
        >
          {{ emoji }}
        </button>
      </div>
    </div>
    
    <div class="emoji-footer">
      <span class="selected-emoji" v-if="selectedEmojiPreview">
        已选: {{ selectedEmojiPreview }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  visible?: boolean
}

interface Emits {
  (e: 'select', emoji: string): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emit = defineEmits<Emits>()

const pickerRef = ref<HTMLDivElement | null>(null)
const selectedCategory = ref('smileys')
const selectedEmojiPreview = ref('')

// 表情分类
const emojiCategories = ['smileys', 'people', 'animals', 'food', 'travel', 'objects', 'symbols', 'flags'] as const

const categoryLabels = {
  smileys: '😊 表情',
  people: '👥 人物',
  animals: '🐶 动物',
  food: '🍎 食物',
  travel: '🚗 旅行',
  objects: '💡 物品',
  symbols: '💖 符号',
  flags: '🚩 旗帜'
}

// 模拟表情数据（实际项目中可以使用完整的表情库）
const emojiData = {
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣', '🤗', '🫡', '🤔', '🫢', '🤭', '🤫', '🤥', '😶', '🫠', '😐', '😑', '😬', '🫨', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🫥', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'],
  people: ['👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧔', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👨‍🦳', '👩‍🦳', '👨‍🦲', '👩‍🦲', '👱', '👱‍♂️', '👱‍♀️', '🧓', '👴', '👵', '🙍', '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️', '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙆‍♂️', '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️', '🧏', '🧏‍♂️', '🧏‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️', '🤦', '🤦‍♂️', '🤦‍♀️', '🤷', '🤷‍♂️', '🤷‍♀️', '👨‍⚕️', '👩‍⚕️', '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '👨‍⚖️', '👩‍⚖️', '👨‍🌾', '👩‍🌾', '👨‍🍳', '👩‍🍳', '👨‍🔧', '👩‍🔧', '👨‍🏭', '👩‍🏭', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', '👨‍💻', '👩‍💻', '👨‍🎤', '👩‍🎤', '👨‍🎨', '👩‍🎨', '👨‍✈️', '👩‍✈️', '👨‍🚀', '👩‍🚀', '👨‍🚒', '👩‍🚒', '👮', '👮‍♂️', '👮‍♀️', '🕵️', '🕵️‍♂️', '🕵️‍♀️', '💂', '💂‍♂️', '💂‍♀️', '🥷', '👷', '👷‍♂️', '👷‍♀️', '🤴', '👸', '👳', '👳‍♂️', '👳‍♀️', '👲', '🧕', '🤵', '🤵‍♂️', '🤵‍♀️', '👰', '👰‍♂️', '👰‍♀️', '🤰', '🫃', '🫄', '🤱', '👩‍🍼', '👨‍🍼', '🧑‍🍼', '👼', '🎅', '🤶', '🧑‍🎄', '🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🦹‍♂️', '🦹‍♀️', '🧙', '🧙‍♂️', '🧙‍♀️', '🧚', '🧚‍♂️', '🧚‍♀️', '🧛', '🧛‍♂️', '🧛‍♀️', '🧜', '🧜‍♂️', '🧜‍♀️', '🧝', '🧝‍♂️', '🧝‍♀️', '🧞', '🧞‍♂️', '🧞‍♀️', '🧟', '🧟‍♂️', '🧟‍♀️', '🧌', '💆', '💆‍♂️', '💆‍♀️', '💇', '💇‍♂️', '💇‍♀️', '🚶', '🚶‍♂️', '🚶‍♀️', '🧍', '🧍‍♂️', '🧍‍♀️', '🧎', '🧎‍♂️', '🧎‍♀️', '🏃', '🏃‍♂️', '🏃‍♀️', '💃', '🕺', '🕴️', '👯', '👯‍♂️', '👯‍♀️', '🧖', '🧖‍♂️', '🧖‍♀️', '🧗', '🧗‍♂️', '🧗‍♀️', '🤺', '🏇', '⛷️', '🏂', '🏌️', '🏌️‍♂️', '🏌️‍♀️', '🏄', '🏄‍♂️', '🏄‍♀️', '🚣', '🚣‍♂️', '🚣‍♀️', '🏊', '🏊‍♂️', '🏊‍♀️', '⛹️', '⛹️‍♂️', '⛹️‍♀️', '🏋️', '🏋️‍♂️', '🏋️‍♀️', '🚴', '🚴‍♂️', '🚴‍♀️', '🚵', '🚵‍♂️', '🚵‍♀️', '🤸', '🤸‍♂️', '🤸‍♀️', '🤽', '🤽‍♂️', '🤽‍♀️', '🤾', '🤾‍♂️', '🤾‍♀️', '🤹', '🤹‍♂️', '🤹‍♀️', '🧘', '🧘‍♂️', '🧘‍♀️', '🛀', '🛌', '🧑‍🤝‍🧑', '👭', '👫', '👬', '💏', '💑', '👪', '🗣️', '👤', '👥', '🫂', '👣', '🦰', '🦱', '🦳', '🦲']
}

const filteredEmojis = computed(() => {
  return emojiData[selectedCategory.value as keyof typeof emojiData] || []
})

const selectEmoji = (emoji: string) => {
  emit('select', emoji)
  selectedEmojiPreview.value = emoji
  
  // 预览后清空
  setTimeout(() => {
    selectedEmojiPreview.value = ''
  }, 1000)
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
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
.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 320px;
  height: 280px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  
  .emoji-header {
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    
    .emoji-tabs {
      display: flex;
      gap: 4px;
      overflow-x: auto;
      
      .tab-button {
        flex-shrink: 0;
        padding: 6px 12px;
        border: none;
        background: #f8f8f8;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          background: #e8e8e8;
        }
        
        &.active {
          background: #07c160;
          color: white;
        }
      }
    }
  }
  
  .emoji-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    
    .emoji-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
      
      .emoji-item {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        transition: all 0.2s ease;
        
        &:hover {
          background: #f0f0f0;
          transform: scale(1.1);
        }
        
        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
  
  .emoji-footer {
    padding: 8px 12px;
    border-top: 1px solid #f0f0f0;
    font-size: 12px;
    color: #666;
    
    .selected-emoji {
      font-size: 14px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .emoji-picker {
    width: 100%;
    height: 240px;
    left: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    
    .emoji-content {
      .emoji-grid {
        grid-template-columns: repeat(7, 1fr);
        
        .emoji-item {
          width: 28px;
          height: 28px;
          font-size: 18px;
        }
      }
    }
  }
}

// 暗色主题
@media (prefers-color-scheme: dark) {
  .emoji-picker {
    background: #2d2d2d;
    border-color: #444;
    
    .emoji-header {
      border-bottom-color: #444;
      
      .emoji-tabs {
        .tab-button {
          background: #3d3d3d;
          color: #ccc;
          
          &:hover {
            background: #4d4d4d;
          }
          
          &.active {
            background: #07c160;
            color: white;
          }
        }
      }
    }
    
    .emoji-content {
      .emoji-grid {
        .emoji-item {
          &:hover {
            background: #3d3d3d;
          }
        }
      }
    }
    
    .emoji-footer {
      border-top-color: #444;
      color: #999;
    }
  }
}
</style>