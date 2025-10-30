<template>
  <div 
    class="sdkwork-agents-list-item"
    :class="[
      {
        'sdkwork-agents-list-item--selected': isSelected,
        'sdkwork-agents-list-item--selectable': selectable,
        'sdkwork-agents-list-item--deletable': deletable,
        'sdkwork-agents-list-item--disabled': disabled,
        'sdkwork-agents-list-item--border-bottom': showBorderBottom
      },
      themeClass
    ]"
    @click="handleClick"
  >
    <!-- 智能体列表项内容 -->
    <div class="sdkwork-agents-list-item__content">
      <slot :agent="agent" :index="index" :selected="isSelected">
        <!-- 默认智能体项内容 -->
        <div class="default-agent-item">
          <!-- 智能体头像 -->
          <div class="agent-avatar">
            <van-image
              :src="agent.faceImage?.url"
              width="48"
              height="48"
              radius="8"
              fit="cover"
              :alt="agent.name"
            >
              <template #error>
                <div class="avatar-placeholder">
                  <van-icon name="user-circle-o" size="24" />
                </div>
              </template>
            </van-image>
            <!-- 状态指示器 -->
            <div class="status-indicator" :class="`status-${agent.status}`"></div>
            
            <!-- 选择框 - 放在头像右下角 -->
            <div v-if="selectable" class="selection-checkbox">
              <van-checkbox 
                :model-value="isSelected" 
                @update:model-value="handleSelectionChange"
                @click.stop
              />
            </div>
          </div>

          <!-- 智能体信息 -->
          <div class="agent-info">
            <div class="agent-header">
              <div class="agent-name">{{ agent.name }}</div>
            </div>
            
            <div class="agent-description">{{ agent.description || '暂无描述' }}</div>
            
            <div class="agent-footer">
              <div class="time-info">
                <van-icon name="clock-o" size="12" />
                <span class="time-text">{{ formatLastUpdate(agent.updatedAt) }}</span>
              </div>
              <div class="usage-info">
                <van-icon name="play-circle" size="12" />
                <span class="count-text">{{ agent.usageCount }}次使用</span>
              </div>
            </div>
          </div>

          <!-- 右侧操作区域 -->
          <div class="action-section">
            <!-- 删除按钮 -->
            <div v-if="deletable" class="delete-section">
              <van-button
                type="danger"
                
                round
                @click.stop="handleDelete"
                class="delete-button"
              >
                <van-icon name="delete" size="14" />
              </van-button>
            </div>
            
            <!-- 右侧箭头 -->
            <div class="agent-action">
              <van-icon name="arrow" size="16" />
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AiAgentVO } from '@/services'
import { computed } from 'vue' 

// Props 定义 - 参考 sdkwork-conversation-list-item
interface Props {
  /** 智能体数据 */
  agent: AiAgentVO
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
  click: [agent: AiAgentVO]
  /** 选择事件 */
  select: [agent: AiAgentVO]
  /** 删除事件 */
  delete: [agent: AiAgentVO]
}>()

// Dark mode support - 参考 sdkwork-conversation-list-item 的实现
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
  return isDarkMode.value ? 'sdkwork-agents-list-item--dark' : 'sdkwork-agents-list-item--light'
})

// 事件处理
const handleSelectionChange = (selected: boolean) => {
  if (props.selectable) {
    emit('select', props.agent)
  }
}

const handleClick = () => {
  if (props.disabled) return
  
  if (props.selectable) {
    handleSelectionChange(!props.isSelected)
  } else {
    emit('click', props.agent)
  }
}

const handleDelete = () => {
  if (props.deletable) {
    emit('delete', props.agent)
  }
}

// 工具函数
const formatLastUpdate = (timeString: string|any): string => {

  const date = window.$date.parse(timeString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) { // 1分钟内
    return '刚刚更新'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 1天内
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 604800000) { // 1周内
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 暴露方法
defineExpose({
  /** 获取智能体名称 */
  getName: () => props.agent.name,
  /** 获取智能体描述 */
  getDescription: () => props.agent.description,
  /** 获取使用次数 */
  getUsageCount: () => props.agent.usageCount,
  /** 格式化时间 */
  formatLastUpdate,
  /** 是否选中 */
  isSelected: () => props.isSelected
})
</script>

<style scoped lang="scss">
.sdkwork-agents-list-item {
  display: flex;
  align-items: center;
  padding: 12px 12px;
  background: var(--sdkwork-agent-bg, #ffffff);
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  // 底部边框 - 参考 sdkwork-conversation-list-item 设计
  &.sdkwork-agents-list-item--border-bottom {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--sdkwork-agent-border-color, #f0f0f0);
      transform: scaleY(0.5);
    }
    
    // 最后一个项不显示边框
    &:last-child::after {
      display: none;
    }
  }
  
  // 状态类
  &--selected {
    background: var(--sdkwork-agent-bg-selected, #f0f8ff);
  }
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  // 内容区域
  .sdkwork-agents-list-item__content {
    display: flex;
    align-items: center;
    width: 100%;
    
    .default-agent-item {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 12px;
      
      // 头像区域
      .agent-avatar {
        position: relative;
        flex-shrink: 0;
        
        .avatar-placeholder {
          width: 48px;
          height: 48px;
          background: var(--sdkwork-agent-avatar-bg, #f5f5f5);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--sdkwork-agent-avatar-color, #999);
        }
        
        // 状态指示器
        .status-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          
          &.status-online {
            background: var(--sdkwork-agent-status-online, #07c160);
          }
          
          &.status-offline {
            background: var(--sdkwork-agent-status-offline, #969799);
          }
          
          &.status-busy {
            background: var(--sdkwork-agent-status-busy, #ff976a);
          }
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
      
      // 智能体信息
      .agent-info {
        flex: 1;
        min-width: 0;
        
        .agent-header {
          display: flex;
          align-items: center;
          margin-bottom: 4px;
          
          .agent-name {
            font-size: 16px;
            font-weight: 500;
            color: var(--sdkwork-agent-name-color, #323233);
            line-height: 1.2;
          }
        }
        
        .agent-description {
          font-size: 14px;
          color: var(--sdkwork-agent-desc-color, #969799);
          line-height: 1.4;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .agent-footer {
          display: flex;
          align-items: center;
          gap: 16px;
          
          .time-info, .usage-info {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            color: var(--sdkwork-agent-meta-color, #c8c9cc);
            
            .time-text, .count-text {
              font-size: 12px;
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
        
        .delete-button {
          width: 28px;
          height: 28px;
          padding: 0;
          
          :deep(.van-button__content) {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        
        .agent-action {
          color: var(--sdkwork-agent-action-color, #c8c9cc);
        }
      }
    }
  }
}

// 浅色主题
.sdkwork-agents-list-item--light {
  --sdkwork-agent-bg: #ffffff;
  --sdkwork-agent-bg-selected: #f0f8ff;
  --sdkwork-agent-border-color: #f0f0f0;
  --sdkwork-agent-avatar-bg: #f5f5f5;
  --sdkwork-agent-avatar-color: #999;
  --sdkwork-agent-name-color: #323233;
  --sdkwork-agent-desc-color: #969799;
  --sdkwork-agent-meta-color: #c8c9cc;
  --sdkwork-agent-action-color: #c8c9cc;
  --sdkwork-agent-status-online: #07c160;
  --sdkwork-agent-status-offline: #969799;
  --sdkwork-agent-status-busy: #ff976a;
}

// 深色主题
.sdkwork-agents-list-item--dark {
  --sdkwork-agent-bg: #1a1a1a;
  --sdkwork-agent-bg-selected: #2a2a2a;
  --sdkwork-agent-border-color: #2a2a2a;
  --sdkwork-agent-avatar-bg: #2d2d2d;
  --sdkwork-agent-avatar-color: #666;
  --sdkwork-agent-name-color: #ffffff;
  --sdkwork-agent-desc-color: #888;
  --sdkwork-agent-meta-color: #555;
  --sdkwork-agent-action-color: #555;
  --sdkwork-agent-status-online: #07c160;
  --sdkwork-agent-status-offline: #666;
  --sdkwork-agent-status-busy: #ff976a;
}

// 响应式主题切换支持
@media (prefers-color-scheme: dark) {
  .sdkwork-agents-list-item:not(.sdkwork-agents-list-item--light):not(.sdkwork-agents-list-item--dark) {
    --sdkwork-agent-bg: #1a1a1a;
    --sdkwork-agent-bg-selected: #2a2a2a;
    --sdkwork-agent-border-color: #2a2a2a;
    --sdkwork-agent-avatar-bg: #2d2d2d;
    --sdkwork-agent-avatar-color: #666;
    --sdkwork-agent-name-color: #ffffff;
    --sdkwork-agent-desc-color: #888;
    --sdkwork-agent-meta-color: #555;
    --sdkwork-agent-action-color: #555;
    --sdkwork-agent-status-online: #07c160;
    --sdkwork-agent-status-offline: #666;
    --sdkwork-agent-status-busy: #ff976a;
  }
}

@media (prefers-color-scheme: light) {
  .sdkwork-agents-list-item:not(.sdkwork-agents-list-item--light):not(.sdkwork-agents-list-item--dark) {
    --sdkwork-agent-bg: #ffffff;
    --sdkwork-agent-bg-selected: #f0f8ff;
    --sdkwork-agent-border-color: #f0f0f0;
    --sdkwork-agent-avatar-bg: #f5f5f5;
    --sdkwork-agent-avatar-color: #999;
    --sdkwork-agent-name-color: #323233;
    --sdkwork-agent-desc-color: #969799;
    --sdkwork-agent-meta-color: #c8c9cc;
    --sdkwork-agent-action-color: #c8c9cc;
    --sdkwork-agent-status-online: #07c160;
    --sdkwork-agent-status-offline: #969799;
    --sdkwork-agent-status-busy: #ff976a;
  }
}
</style>