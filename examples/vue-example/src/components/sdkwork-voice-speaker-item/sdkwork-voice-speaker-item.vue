<template>
  <div 
    class="sdkwork-voice-speaker-list-item"
    :class="[
      {
        'sdkwork-voice-speaker-list-item--selected': isSelected,
        'sdkwork-voice-speaker-list-item--favorite': speaker.favorite,
        'sdkwork-voice-speaker-list-item--premium': speaker.type === 'premium',
        'sdkwork-voice-speaker-list-item--custom': speaker.type === 'custom',
        'sdkwork-voice-speaker-list-item--disabled': disabled,
        'sdkwork-voice-speaker-list-item--border-bottom': showBorderBottom
      },
      themeClass
    ]"
    @click="handleClick"
  >
    <!-- 头像区域 -->
    <div class="sdkwork-voice-speaker-list-item__avatar">
      <van-image
        :src="speaker.avatar"
        width="48"
        height="48"
        radius="8"
        fit="cover"
      >
        <template v-slot:error>
          <div class="avatar-placeholder" :class="speaker.gender">
            <van-icon :name="getGenderIcon(speaker.gender)" size="20" />
          </div>
        </template>
      </van-image>
      
      <!-- 类型标识 -->
      <div v-if="speaker.type !== 'standard'" class="type-badge" :class="speaker.type">
        {{ getTypeText(speaker.type) }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="sdkwork-voice-speaker-list-item__content">
      <div class="speaker-header">
        <div class="speaker-info">
          <div class="speaker-name">
            {{ speaker.displayName }}
            <!-- 收藏标识 -->
            <van-icon v-if="speaker.favorite" name="star" class="favorite-icon" />
          </div>
          <div class="speaker-meta">
            <span class="language-tag">{{ getLanguageText(speaker.language) }}</span>
            <span class="gender-tag">{{ getGenderText(speaker.gender) }}</span>
          </div>
        </div>
        <div class="speaker-actions">
          <!-- 播放示例按钮 -->
          <van-button 
            v-if="speaker.sampleAudio" 
             
            type="primary" 
            plain
            @click.stop="handlePlaySample"
            class="play-button"
          >
            <van-icon name="play" size="12" />
            试听
          </van-button>
          <!-- 收藏按钮 -->
          <van-button 
             
            :type="speaker.favorite ? 'primary' : 'default'"
            @click.stop="handleFavorite"
            class="favorite-button"
          >
            <van-icon :name="speaker.favorite ? 'star' : 'star-o'" size="12" />
          </van-button>
        </div>
      </div>

      <div class="speaker-details">
        <div class="speaker-description">
          {{ speaker.description || '专业的AI语音发音人' }}
        </div>
        <div class="speaker-features">
          <van-tag 
            v-if="speaker.realtime" 
            
            type="primary" 
            plain
          >实时</van-tag>
          <van-tag 
            v-if="speaker.offline" 
            
            type="success" 
            plain
          >离线</van-tag>
          <van-tag 
            v-if="speaker.emotional" 
            
            type="warning" 
            plain
          >情感</van-tag>
          <van-tag 
            v-if="speaker.multilingual" 
            
            type="danger" 
            plain
          >多语言</van-tag>
          <van-tag 
            v-if="speaker.rating" 
            
            type="default"
          >{{ speaker.rating }}分</van-tag>
          <van-tag 
            v-if="speaker.usageCount" 
            
            type="default"
          >使用{{ speaker.usageCount }}次</van-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"> 
import { VoiceSpeakerVO } from '@/services'
import { computed } from 'vue' 

// Props 定义 - 针对AI语音发音人设计
interface Props {
  /** 发音人数据 */
  speaker: VoiceSpeakerVO
  /** 是否禁用 */
  disabled?: boolean
  /** 是否选中 */
  isSelected?: boolean
  /** 是否显示底部边框 */
  showBorderBottom?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  isSelected: false,
  showBorderBottom: true,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [speaker: VoiceSpeakerVO]
  /** 选中事件 */
  select: [speaker: VoiceSpeakerVO]
  /** 播放示例事件 */
  'play-sample': [speaker: VoiceSpeakerVO]
  /** 收藏事件 */
  favorite: [speaker: VoiceSpeakerVO]
}>()

// Dark mode support
const isDarkMode = computed(() => {
  if (props.themeMode === 'dark') return true
  if (props.themeMode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
})

// 主题类名
const themeClass = computed(() => {
  return isDarkMode.value ? 'sdkwork-voice-speaker-list-item--dark' : 'sdkwork-voice-speaker-list-item--light'
})

// 事件处理
const handleClick = () => {
  if (props.disabled) return
  emit('click', props.speaker)
}

const handlePlaySample = () => {
  if (props.disabled) return
  emit('play-sample', props.speaker)
}

const handleFavorite = () => {
  if (props.disabled) return
  emit('favorite', props.speaker)
}

// 工具函数
const getGenderIcon = (gender: string): string => {
  switch (gender) {
    case 'male': return 'man'
    case 'female': return 'woman'
    default: return 'user'
  }
}

const getGenderText = (gender: string): string => {
  switch (gender) {
    case 'male': return '男声'
    case 'female': return '女声'
    default: return '中性'
  }
}

const getLanguageText = (language: string): string => {
  const languageMap: Record<string, string> = {
    'zh-CN': '中文',
    'zh-TW': '繁体',
    'en-US': '英语',
    'en-GB': '英式',
    'ja-JP': '日语',
    'ko-KR': '韩语'
  }
  return languageMap[language] || language
}

const getTypeText = (type: string): string => {
  switch (type) {
    case 'premium': return '高级'
    case 'custom': return '定制'
    default: return '标准'
  }
}

// 暴露方法
defineExpose({
  /** 获取发音人名称 */
  getName: () => props.speaker.displayName,
  /** 获取发音人语言 */
  getLanguage: () => props.speaker.language,
  /** 获取发音人类型 */
  getType: () => props.speaker.type,
  /** 是否收藏 */
  isFavorite: () => props.speaker.favorite,
  /** 是否支持实时语音 */
  isRealtime: () => props.speaker.realtime
})
</script>

<style scoped lang="scss">
.sdkwork-voice-speaker-list-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background: var(--sdkwork-speaker-bg, #ffffff);
  cursor: pointer;
  transition: all 0.2s ease;
  
  // 底部边框
  &.sdkwork-voice-speaker-list-item--border-bottom {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 16px;
      right: 16px;
      height: 1px;
      background: var(--sdkwork-speaker-border-color, #f0f0f0);
      transform: scaleY(0.5);
    }
    
    // 最后一个项不显示边框
    &:last-child::after {
      display: none;
    }
  }
  
  // 状态类
  &--selected {
    background: var(--sdkwork-speaker-bg-selected, #f0f8ff);
    border-left: 3px solid var(--sdkwork-speaker-selected-color, #1989fa);
  }
  
  &--favorite {
    .favorite-icon {
      color: var(--sdkwork-speaker-favorite-color, #ff976a);
    }
  }
  
  &--premium {
    .type-badge.premium {
      background: linear-gradient(135deg, #ffd700, #ffa500);
      color: #fff;
    }
  }
  
  &--custom {
    .type-badge.custom {
      background: linear-gradient(135deg, #8a2be2, #9370db);
      color: #fff;
    }
  }
  
  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    
    &:hover {
      background: var(--sdkwork-speaker-bg, #ffffff);
    }
  }
  
  // 交互状态
  &:hover:not(.sdkwork-voice-speaker-list-item--disabled) {
    background: var(--sdkwork-speaker-bg-hover, #f8f9fa);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active:not(.sdkwork-voice-speaker-list-item--disabled) {
    background: var(--sdkwork-speaker-bg-active, #f0f2f5);
    transform: translateY(0);
  }
  
  // 头像区域
  &__avatar {
    position: relative;
    margin-right: 16px;
    flex-shrink: 0;
    
    .avatar-placeholder {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.male {
        background: linear-gradient(135deg, #87CEEB, #4682B4);
        color: #fff;
      }
      
      &.female {
        background: linear-gradient(135deg, #FFB6C1, #FF69B4);
        color: #fff;
      }
      
      &.neutral {
        background: linear-gradient(135deg, #D3D3D3, #A9A9A9);
        color: #fff;
      }
    }
    
    .type-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 8px;
      color: #fff;
      font-weight: 600;
      
      &.premium {
        background: linear-gradient(135deg, #ffd700, #ffa500);
      }
      
      &.custom {
        background: linear-gradient(135deg, #8a2be2, #9370db);
      }
      
      &.standard {
        background: var(--sdkwork-speaker-text-muted, #999999);
      }
    }
  }
  
  // 内容区域
  &__content {
    flex: 1;
    min-width: 0;
    
    .speaker-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      
      .speaker-info {
        flex: 1;
        min-width: 0;
        
        .speaker-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--sdkwork-speaker-text, #333333);
          line-height: 1.4;
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          
          // 文本溢出处理
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .favorite-icon {
            margin-left: 6px;
            font-size: 14px;
            color: var(--sdkwork-speaker-favorite-color, #ff976a);
            flex-shrink: 0;
          }
        }
        
        .speaker-meta {
          display: flex;
          gap: 8px;
          
          .language-tag,
          .gender-tag {
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 4px;
            background: var(--sdkwork-speaker-tag-bg, #f0f2f5);
            color: var(--sdkwork-speaker-text-secondary, #666666);
          }
        }
      }
      
      .speaker-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
        margin-left: 12px;
        
        .play-button,
        .favorite-button {
          height: 24px;
          padding: 0 8px;
          font-size: 12px;
          
          :deep(.van-icon) {
            margin-right: 2px;
          }
        }
      }
    }
    
    .speaker-details {
      .speaker-description {
        font-size: 14px;
        color: var(--sdkwork-speaker-text-secondary, #666666);
        line-height: 1.4;
        margin-bottom: 8px;
        
        // 文本溢出处理
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .speaker-features {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        
        :deep(.van-tag) {
          margin: 0;
        }
      }
    }
  }
}

// 浅色主题
.sdkwork-voice-speaker-list-item--light {
  --sdkwork-speaker-bg: #ffffff;
  --sdkwork-speaker-bg-hover: #f8f9fa;
  --sdkwork-speaker-bg-active: #f0f2f5;
  --sdkwork-speaker-bg-selected: #f0f8ff;
  --sdkwork-speaker-selected-color: #1989fa;
  --sdkwork-speaker-favorite-color: #ff976a;
  --sdkwork-speaker-text: #333333;
  --sdkwork-speaker-text-secondary: #666666;
  --sdkwork-speaker-text-muted: #999999;
  --sdkwork-speaker-border-color: #f0f0f0;
  --sdkwork-speaker-tag-bg: #f0f2f5;
}

// 深色主题
.sdkwork-voice-speaker-list-item--dark {
  --sdkwork-speaker-bg: #1a1a1a;
  --sdkwork-speaker-bg-hover: #2d2d2d;
  --sdkwork-speaker-bg-active: #3d3d3d;
  --sdkwork-speaker-bg-selected: #1a2a3a;
  --sdkwork-speaker-selected-color: #1989fa;
  --sdkwork-speaker-favorite-color: #ff976a;
  --sdkwork-speaker-text: #ffffff;
  --sdkwork-speaker-text-secondary: #cccccc;
  --sdkwork-speaker-text-muted: #888888;
  --sdkwork-speaker-border-color: #2d2d2d;
  --sdkwork-speaker-tag-bg: #2d2d2d;
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-voice-speaker-list-item {
    padding: 12px;
    
    &__avatar {
      margin-right: 12px;
    }
    
    .speaker-header {
      .speaker-name {
        font-size: 15px;
      }
      
      .speaker-actions {
        flex-direction: column;
        gap: 4px;
        
        .play-button,
        .favorite-button {
          height: 22px;
          padding: 0 6px;
          font-size: 11px;
        }
      }
    }
    
    .speaker-details {
      .speaker-description {
        font-size: 13px;
      }
      
      .speaker-features {
        gap: 4px;
      }
    }
  }
}
</style>