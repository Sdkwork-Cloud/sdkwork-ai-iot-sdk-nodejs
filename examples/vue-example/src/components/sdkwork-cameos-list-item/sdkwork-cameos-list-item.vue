<template>
  <div 
    class="sdkwork-cameos-list-item-simple"
    :class="[
      {
        'sdkwork-cameos-list-item-simple--selected': isSelected,
        'sdkwork-cameos-list-item-simple--selectable': selectable,
        'sdkwork-cameos-list-item-simple--disabled': disabled,
        'sdkwork-cameos-list-item-simple--border-bottom': showBorderBottom
      },
      themeClass
    ]"
    @click="handleClick"
  >
    <!-- 角色列表项内容 -->
    <div class="sdkwork-cameos-list-item-simple__content">
      <slot :cameo="cameo" :index="index" :selected="isSelected">
        <!-- 默认角色项内容 -->
        <div class="default-cameo-item">
          <!-- 角色头像 -->
          <div class="cameo-avatar">
            <van-image
              :src="cameo.avatar"
              width="48"
              height="48"
              radius="8"
              fit="cover"
              :alt="cameo.name"
            >
              <template #error>
                <div class="avatar-placeholder" :class="getTypeClass(cameo.type)">
                  <van-icon :name="getTypeIcon(cameo.type)" size="24" />
                </div>
              </template>
            </van-image>
            
            <!-- 类型标识 -->
            <div class="type-badge" :class="cameo.type">
              {{ getTypeText(cameo.type) }}
            </div>
            
            <!-- 选择框 - 放在头像右下角 -->
            <div v-if="selectable" class="selection-checkbox">
              <van-checkbox 
                :model-value="isSelected" 
                @update:model-value="handleSelectionChange"
                @click.stop
              />
            </div>
          </div>

          <!-- 角色信息 -->
          <div class="cameo-info">
            <div class="cameo-header">
              <div class="cameo-name">{{ cameo.name }}</div>
              <!-- 收藏标识 -->
              <van-icon v-if="cameo.isFavorite" name="star" class="favorite-icon" />
            </div>
            
            <div class="cameo-description">{{ cameo.description || '暂无描述' }}</div>
            
            <div class="cameo-footer">
              <!-- 统计数据 -->
              <div class="stats-info">
                <div class="stat-item">
                  <van-icon name="user-o" size="12" />
                  <span class="stat-text">{{ cameo.cameoCount }}客串</span>
                </div>
                <div class="stat-item">
                  <van-icon name="replay" size="12" />
                  <span class="stat-text">{{ cameo.remixCount }}Remix</span>
                </div>
              </div>
              
              <!-- 评分 -->
              <div class="rating-info">
                <van-rate v-model="cameo.rating" readonly size="12" />
                <span class="rating-text">{{ cameo.rating.toFixed(1) }}</span>
              </div>
            </div>
          </div>

          <!-- 右侧操作区域 -->
          <div class="action-section">
            <!-- 播放按钮 -->
            <van-button
              type="primary"
              
              round
              @click.stop="handlePlay"
              class="play-button"
            >
              <van-icon name="play" size="14" />
            </van-button>
            
            <!-- 右侧箭头 -->
            <div class="cameo-action">
              <van-icon name="arrow" size="16" />
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Cameo } from '../sdkwork-cameos-list/types'

// 组件属性定义
interface Props {
  /** 角色数据 */
  cameo: Cameo
  /** 索引 */
  index?: number
  /** 是否可选择 */
  selectable?: boolean
  /** 是否可删除 */
  deletable?: boolean
  /** 是否选中 */
  isSelected?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示底部边框 */
  showBorderBottom?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false,
  isSelected: false,
  disabled: false,
  showBorderBottom: true,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  /** 点击事件 */
  click: [cameo: Cameo]
  /** 选择事件 */
  select: [cameo: Cameo]
  /** 播放事件 */
  play: [cameo: Cameo]
  /** 收藏事件 */
  favorite: [cameo: Cameo, isFavorite: boolean]
}>()

// 响应式数据
const isSelected = ref(props.isSelected)

// 主题适配 - 参考 sdkwork-agents-list-item 的实现
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
  return isDarkMode.value ? 'sdkwork-cameos-list-item-simple--dark' : 'sdkwork-cameos-list-item-simple--light'
})

// 事件处理
const handleSelectionChange = (selected: boolean) => {
  if (props.selectable) {
    isSelected.value = selected
    emit('select', props.cameo)
  }
}

const handleClick = () => {
  if (props.disabled) return
  
  if (props.selectable) {
    handleSelectionChange(!props.isSelected)
  } else {
    emit('click', props.cameo)
  }
}

const handlePlay = () => {
  if (!props.disabled) {
    emit('play', props.cameo)
  }
}

// 工具函数
const getTypeClass = (type: string): string => {
  const typeClasses = {
    'character': 'type-character',
    'celebrity': 'type-celebrity', 
    'custom': 'type-custom',
    'ai-generated': 'type-ai'
  }
  return typeClasses[type as keyof typeof typeClasses] || 'type-default'
}

const getTypeIcon = (type: string): string => {
  const typeIcons = {
    'character': 'user-circle-o',
    'celebrity': 'star-o',
    'custom': 'setting-o', 
    'ai-generated': 'magic'
  }
  return typeIcons[type as keyof typeof typeIcons] || 'user-o'
}

const getTypeText = (type: string): string => {
  const typeTexts = {
    'character': '虚拟',
    'celebrity': '名人',
    'custom': '定制',
    'ai-generated': 'AI'
  }
  return typeTexts[type as keyof typeof typeTexts] || '角色'
}

// 监听属性变化
watch(() => props.isSelected, (newValue) => {
  isSelected.value = newValue
})
</script>

<style scoped lang="scss">
.sdkwork-cameos-list-item-simple {
  display: flex;
  align-items: center;
  padding: 12px 12px;
  background: var(--sdkwork-cameo-bg, #ffffff);
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  // 底部边框 - 与 sdkwork-agents-list-item 保持一致
  &.sdkwork-cameos-list-item-simple--border-bottom {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--sdkwork-cameo-border-color, #f0f0f0);
      transform: scaleY(0.5);
    }
    
    // 最后一个项不显示边框
    &:last-child::after {
      display: none;
    }
  }
  
  // 状态类
  &--selected {
    background: var(--sdkwork-cameo-bg-selected, #f0f8ff);
  }
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  // 内容区域
  .sdkwork-cameos-list-item-simple__content {
    display: flex;
    align-items: center;
    width: 100%;
    
    .default-cameo-item {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 12px;
      
      // 头像区域
      .cameo-avatar {
        position: relative;
        flex-shrink: 0;
        
        .type-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--sdkwork-cameo-type-badge-bg, var(--van-primary-color));
          color: var(--sdkwork-cameo-type-badge-color, #ffffff);
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 8px;
          
          &.character { background: var(--sdkwork-cameo-type-character, var(--van-success-color)); }
          &.celebrity { background: var(--sdkwork-cameo-type-celebrity, var(--van-warning-color)); }
          &.custom { background: var(--sdkwork-cameo-type-custom, var(--van-danger-color)); }
          &.ai-generated { background: var(--sdkwork-cameo-type-ai, var(--van-purple)); }
        }
        
        .avatar-placeholder {
          width: 48px;
          height: 48px;
          background: var(--sdkwork-cameo-avatar-bg, #f5f5f5);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--sdkwork-cameo-avatar-color, #999);
          
          &.type-character { background: var(--sdkwork-cameo-type-character, var(--van-success-color)); color: var(--sdkwork-cameo-type-badge-color, #ffffff); }
          &.type-celebrity { background: var(--sdkwork-cameo-type-celebrity, var(--van-warning-color)); color: var(--sdkwork-cameo-type-badge-color, #ffffff); }
          &.type-custom { background: var(--sdkwork-cameo-type-custom, var(--van-danger-color)); color: var(--sdkwork-cameo-type-badge-color, #ffffff); }
          &.type-ai { background: var(--sdkwork-cameo-type-ai, var(--van-purple)); color: var(--sdkwork-cameo-type-badge-color, #ffffff); }
        }
        
        // 选择框
        .selection-checkbox {
          position: absolute;
          top: -4px;
          right: -4px;
          background: white;
          border-radius: 50%;
          padding: 2px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      }
      
      // 角色信息
      .cameo-info {
        flex: 1;
        min-width: 0;
        
        .cameo-header {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          
          .cameo-name {
            font-size: 16px;
            font-weight: 500;
            color: var(--sdkwork-cameo-name-color, #323233);
            line-height: 1.2;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .favorite-icon {
            color: var(--sdkwork-cameo-favorite-color, var(--van-warning-color));
            font-size: 14px;
          }
        }
        
        .cameo-description {
          font-size: 14px;
          color: var(--sdkwork-cameo-desc-color, #969799);
          line-height: 1.4;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .cameo-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          
          .stats-info {
            display: flex;
            align-items: center;
            gap: 16px;
            
            .stat-item {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: var(--sdkwork-cameo-meta-color, #c8c9cc);
              
              .stat-text {
                font-size: 12px;
              }
            }
          }
          
          .rating-info {
            display: flex;
            align-items: center;
            gap: 4px;
            
            .rating-text {
              font-size: 12px;
              color: var(--sdkwork-cameo-rating-color, var(--van-warning-color));
              font-weight: 600;
            }
          }
        }
      }
      
      // 操作区域
      .action-section {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        
        .play-button {
          width: 28px;
          height: 28px;
          padding: 0;
          
          :deep(.van-button__content) {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        .cameo-action {
          color: var(--sdkwork-cameo-action-color, #c8c9cc);
        }
      }
    }
  }
}

// 浅色主题 - 与 sdkwork-agents-list-item 保持一致
.sdkwork-cameos-list-item-simple--light {
  --sdkwork-cameo-bg: #ffffff;
  --sdkwork-cameo-bg-selected: #f0f8ff;
  --sdkwork-cameo-border-color: #f0f0f0;
  --sdkwork-cameo-avatar-bg: #f5f5f5;
  --sdkwork-cameo-avatar-color: #999;
  --sdkwork-cameo-name-color: #323233;
  --sdkwork-cameo-desc-color: #969799;
  --sdkwork-cameo-meta-color: #c8c9cc;
  --sdkwork-cameo-action-color: #c8c9cc;
  --sdkwork-cameo-favorite-color: var(--van-warning-color);
  --sdkwork-cameo-rating-color: var(--van-warning-color);
  --sdkwork-cameo-type-badge-bg: var(--van-primary-color);
  --sdkwork-cameo-type-badge-color: #ffffff;
  --sdkwork-cameo-type-character: var(--van-success-color);
  --sdkwork-cameo-type-celebrity: var(--van-warning-color);
  --sdkwork-cameo-type-custom: var(--van-danger-color);
  --sdkwork-cameo-type-ai: var(--van-purple);
}

// 深色主题 - 与 sdkwork-agents-list-item 保持一致
.sdkwork-cameos-list-item-simple--dark {
  --sdkwork-cameo-bg: #1a1a1a;
  --sdkwork-cameo-bg-selected: #2a2a2a;
  --sdkwork-cameo-border-color: #333;
  --sdkwork-cameo-avatar-bg: #2d2d2d;
  --sdkwork-cameo-avatar-color: #666;
  --sdkwork-cameo-name-color: #ffffff;
  --sdkwork-cameo-desc-color: #888;
  --sdkwork-cameo-meta-color: #555;
  --sdkwork-cameo-action-color: #555;
  --sdkwork-cameo-favorite-color: var(--van-warning-color);
  --sdkwork-cameo-rating-color: var(--van-warning-color);
  --sdkwork-cameo-type-badge-bg: var(--van-primary-color);
  --sdkwork-cameo-type-badge-color: #ffffff;
  --sdkwork-cameo-type-character: var(--van-success-color);
  --sdkwork-cameo-type-celebrity: var(--van-warning-color);
  --sdkwork-cameo-type-custom: var(--van-danger-color);
  --sdkwork-cameo-type-ai: var(--van-purple);
}

// 响应式主题切换支持 - 与 sdkwork-agents-list-item 保持一致
@media (prefers-color-scheme: dark) {
  .sdkwork-cameos-list-item-simple:not(.sdkwork-cameos-list-item-simple--light):not(.sdkwork-cameos-list-item-simple--dark) {
    --sdkwork-cameo-bg: #1a1a1a;
    --sdkwork-cameo-bg-selected: #2a2a2a;
    --sdkwork-cameo-border-color: #333;
    --sdkwork-cameo-avatar-bg: #2d2d2d;
    --sdkwork-cameo-avatar-color: #666;
    --sdkwork-cameo-name-color: #ffffff;
    --sdkwork-cameo-desc-color: #888;
    --sdkwork-cameo-meta-color: #555;
    --sdkwork-cameo-action-color: #555;
    --sdkwork-cameo-favorite-color: var(--van-warning-color);
    --sdkwork-cameo-rating-color: var(--van-warning-color);
    --sdkwork-cameo-type-badge-bg: var(--van-primary-color);
    --sdkwork-cameo-type-badge-color: #ffffff;
    --sdkwork-cameo-type-character: var(--van-success-color);
    --sdkwork-cameo-type-celebrity: var(--van-warning-color);
    --sdkwork-cameo-type-custom: var(--van-danger-color);
    --sdkwork-cameo-type-ai: var(--van-purple);
  }
}

@media (prefers-color-scheme: light) {
  .sdkwork-cameos-list-item-simple:not(.sdkwork-cameos-list-item-simple--light):not(.sdkwork-cameos-list-item-simple--dark) {
    --sdkwork-cameo-bg: #ffffff;
    --sdkwork-cameo-bg-selected: #f0f8ff;
    --sdkwork-cameo-border-color: #f0f0f0;
    --sdkwork-cameo-avatar-bg: #f5f5f5;
    --sdkwork-cameo-avatar-color: #999;
    --sdkwork-cameo-name-color: #323233;
    --sdkwork-cameo-desc-color: #969799;
    --sdkwork-cameo-meta-color: #c8c9cc;
    --sdkwork-cameo-action-color: #c8c9cc;
    --sdkwork-cameo-favorite-color: var(--van-warning-color);
    --sdkwork-cameo-rating-color: var(--van-warning-color);
    --sdkwork-cameo-type-badge-bg: var(--van-primary-color);
    --sdkwork-cameo-type-badge-color: #ffffff;
    --sdkwork-cameo-type-character: var(--van-success-color);
    --sdkwork-cameo-type-celebrity: var(--van-warning-color);
    --sdkwork-cameo-type-custom: var(--van-danger-color);
    --sdkwork-cameo-type-ai: var(--van-purple);
  }
}
</style>