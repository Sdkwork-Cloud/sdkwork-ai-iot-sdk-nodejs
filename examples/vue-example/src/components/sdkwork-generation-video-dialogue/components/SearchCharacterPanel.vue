<template>
  <div class="search-panel">
    <van-field 
      v-model="searchKeyword" 
      placeholder="搜索角色..." 
      left-icon="search"
      clearable
      @input="handleSearch"
    />
    
    <div class="preset-characters">
      <div 
        v-for="character in filteredPresetCharacters" 
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
            <van-tag v-for="tag in character.tags" :key="tag" type="primary">
              {{ tag }}
            </van-tag>
          </div>
        </div>
      </div>
      
      <div v-if="filteredPresetCharacters.length === 0" class="empty-result">
        <van-empty description="未找到匹配的角色" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { DialogueCharacter } from '../types'

// Props
interface Props {
  presetCharacters?: DialogueCharacter[]
}

const props = withDefaults(defineProps<Props>(), {
  presetCharacters: () => []
})

// Emits
const emit = defineEmits<{
  (e: 'select', character: DialogueCharacter): void
}>()

// 搜索关键词
const searchKeyword = ref('')

// 预设角色数据
const presetCharacters = ref<DialogueCharacter[]>(props.presetCharacters)

// 过滤后的预设角色
const filteredPresetCharacters = computed(() => {
  if (!searchKeyword.value.trim()) return presetCharacters.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return presetCharacters.value.filter(character => 
    character.name.toLowerCase().includes(keyword) ||
    character.description?.toLowerCase().includes(keyword) ||
    (character as any).tags?.some((tag: string) => tag.toLowerCase().includes(keyword))
  )
})

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已在computed中实现
}

// 处理选择角色
const handleSelect = (character: DialogueCharacter) => {
  emit('select', character)
}

// 设置预设角色
const setPresetCharacters = (characters: DialogueCharacter[]) => {
  presetCharacters.value = characters
}

// 初始化数据
onMounted(() => {
  // 如果没有传入预设角色，使用默认数据
  if (presetCharacters.value.length === 0) {
    presetCharacters.value = [
      {
        id: 'preset_1',
        name: '小明',
        description: '一个活泼开朗的男孩，喜欢运动和冒险',
        avatar: '',
        appearance: {
          gender: 'male',
          age: '20岁',
          style: '休闲运动风',
          description: '短发，穿着休闲运动装，笑容阳光'
        },
        voice: {
          voiceId: 'young_male'
        },
        tags: ['开朗', '活泼', '阳光'] as any
      },
      {
        id: 'preset_2',
        name: '小红',
        description: '一个温柔文静的女孩，喜欢阅读和绘画',
        avatar: '',
        appearance: {
          gender: 'female',
          age: '19岁',
          style: '甜美文艺风',
          description: '长发，穿着连衣裙，文静温柔'
        },
        voice: {
          voiceId: 'young_female'
        },
        tags: ['温柔', '文静', '文艺'] as any
      },
      {
        id: 'preset_3',
        name: '老教授',
        description: '知识渊博的教授，说话沉稳而有条理',
        avatar: '',
        appearance: {
          gender: 'male',
          age: '60岁',
          style: '学术风',
          description: '戴眼镜，穿着西装，沉稳稳重'
        },
        voice: {
          voiceId: 'mature_male'
        },
        tags: ['教授', '知识渊博', '严肃'] as any
      },
      {
        id: 'preset_4',
        name: '小可爱',
        description: '天真可爱的孩子，说话语气稚嫩可爱',
        avatar: '',
        appearance: {
          gender: 'female',
          age: '8岁',
          style: '童装',
          description: '扎着小辫子，穿着可爱的童装'
        },
        voice: {
          voiceId: 'young_female'
        },
        tags: ['可爱', '孩子', '天真'] as any
      }
    ]
  }
})

// 暴露方法给父组件
defineExpose({
  setPresetCharacters
})
</script>

<style lang="scss" scoped>
.search-panel {
  .preset-characters {
    margin-top: 16px;
    
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
        }
      }
    }
    
    .empty-result {
      padding: 40px 0;
    }
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