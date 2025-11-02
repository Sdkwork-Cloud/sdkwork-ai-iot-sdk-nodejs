<template>
  <div
    class="agent-list-item"
    :class="{ 
      'agent-list-item--selectable': selectable, 
      'agent-list-item--selected': isSelected,
      'agent-list-item--deletable': deletable
    }"
    @click="handleClick"
  >
    <!-- 智能体列表项内容 -->
    <div class="agent-list-item-content">
      <slot :agent="agent" :index="index" :selected="isSelected">
        <!-- 默认智能体项内容 -->
        <div class="default-agent-item">
          <!-- 智能体头像 -->
          <div class="agent-avatar">
            <van-image
              :src="agent.avatar"
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
                <span class="time-text">{{ formatLastUpdate(agent.updatedTime) }}</span>
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
import { computed } from 'vue'

// 智能体接口
interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
  category: string
  tags: string[]
  createdTime: string
  updatedTime: string
  usageCount: number
  rating: number
  isPublic: boolean
  owner: string
}

// 属性定义
interface Props {
  agent: Agent
  index: number
  selectable?: boolean
  deletable?: boolean
  isSelected?: boolean
}

// 事件定义
interface Emits {
  (e: 'select', agent: Agent): void
  (e: 'delete', agent: Agent): void
  (e: 'click', agent: Agent): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  deletable: false,
  isSelected: false
})

const emit = defineEmits<Emits>()

// 计算属性
const isSelected = computed(() => props.isSelected)

// 事件处理
const handleSelectionChange = (selected: boolean) => {
  if (props.selectable) {
    emit('select', props.agent)
  }
}

const handleClick = () => {
  if (props.selectable) {
    handleSelectionChange(!isSelected.value)
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
const getStatusTagType = (status: string) => {
  switch (status) {
    case 'online': return 'success'
    case 'busy': return 'warning'
    case 'offline': return 'default'
    default: return 'default'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'online': return '在线'
    case 'busy': return '忙碌'
    case 'offline': return '离线'
    default: return '未知'
  }
}

const formatLastUpdate = (timeString: string): string => {
  const date = new Date(timeString)
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
</script>

<style scoped lang="scss">
.agent-list-item {
  position: relative;
  background: white;
  border-radius: 12px;
  margin: 8px 16px;
  padding: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  &--selected {
    border-color: var(--van-primary-color);
    background: rgba(var(--van-primary-color-rgb), 0.05);
  }

  &--selectable {
    cursor: pointer;
  }

  &--deletable {
    cursor: pointer;
  }
}

.agent-list-item-content {
  width: 100%;
}

.default-agent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.agent-avatar {
  position: relative;
  flex-shrink: 0;
}

.selection-checkbox {
  position: absolute;
  top: -4px;
  left: -4px;
  z-index: 10;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.action-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.delete-section {
  flex-shrink: 0;
}

.delete-button {
  min-width: 24px;
  height: 24px;
  padding: 0;
  
  .van-icon {
    margin: 0;
  }
}

.agent-action {
  color: #ccc;
  flex-shrink: 0;
}

.agent-avatar {
  position: relative;
  flex-shrink: 0;

  .status-indicator {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;

    &.status-online {
      background: #52c41a;
    }

    &.status-offline {
      background: #d9d9d9;
    }

    &.status-busy {
      background: #faad14;
    }
  }
}

.agent-info {
  flex: 1;
  min-width: 0;
  
  .agent-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    
    .agent-name {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .agent-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .agent-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #999;
    
    .status-info,
    .time-info,
    .usage-info {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .status-info {
      flex-shrink: 0;
    }
    
    .time-info {
      flex: 1;
    }
    
    .usage-info {
      flex-shrink: 0;
    }
  }
}

.agent-action {
  color: #ccc;
  margin-left: 8px;
}

.avatar-placeholder {
  width: 48px;
  height: 48px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .agent-list-item {
    margin: 6px 12px;
    padding: 12px;
    border-radius: 8px;
  }

  .default-agent-item {
    gap: 12px;
  }

  .agent-header {
    .agent-name {
      font-size: 15px;
    }
  }

  .agent-description {
    font-size: 13px;
  }
}
</style>