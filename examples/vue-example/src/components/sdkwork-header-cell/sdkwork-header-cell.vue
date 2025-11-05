<template>
  <div class="sdkwork-header-cell" :class="[
    {
      'sdkwork-header-cell--bordered': bordered,
      'sdkwork-header-cell--shadow': shadow,
      'sdkwork-header-cell--horizontal': layout === 'horizontal',
      'sdkwork-header-cell--vertical': layout === 'vertical',
      'sdkwork-header-cell--align-left': align === 'left',
      'sdkwork-header-cell--align-center': align === 'center',
      'sdkwork-header-cell--align-right': align === 'right'
    },
    themeClass
  ]" :style="computedStyle" @click="handleClick">
    <!-- 头像区域 -->
    <div class="sdkwork-header-cell__avatar" @click.stop="handleAvatarClick">
      <slot name="avatar">
        <sdkwork-image v-if="userInfo?.faceImage?.url" :src="userInfo.faceImage?.url" :width="avatarSize"
          :height="avatarSize" :radius="avatarRadius" :fit="avatarFit" class="sdkwork-header-cell__avatar-img">
          <template v-slot:error>
            <div class="sdkwork-header-cell__avatar-placeholder">
              <sdkwork-icon icon="mdi:account-outline" :width="Number(avatarSize) / 2"
                :height="Number(avatarSize) / 2" />
            </div>
          </template>
        </sdkwork-image>
        <div v-else class="sdkwork-header-cell__avatar-placeholder">
          <sdkwork-icon icon="mdi:account-outline" :width="Number(avatarSize) / 2" :height="Number(avatarSize) / 2" />
        </div>
      </slot>

      <!-- 在线状态 -->
      <div v-if="showOnlineStatus && userInfo?.status !== undefined" class="sdkwork-header-cell__online-status"
        :class="{ 'sdkwork-header-cell__online-status--online': userInfo.status === 'ACTIVE' }">
        {{ userInfo.status === 'ACTIVE' ? '在线' : '离线' }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="sdkwork-header-cell__content">
      <!-- 名称区域 -->
      <div class="sdkwork-header-cell__name" @click.stop="handleNameClick">
        <slot name="name">
          <span class="sdkwork-header-cell__name-text">{{ userInfo?.nickname ||
            userInfo?.username
            || '未知用户' }}</span>
        </slot>
      </div>

      <!-- 描述区域 -->
      <slot name="description">
        <span class="sdkwork-header-cell__description-text">{{ userInfo?.roleNames?.join(', ') }}</span>
      </slot>

      <!-- 额外信息 -->
      <div v-if="$slots.extra" class="sdkwork-header-cell__extra">
        <slot name="extra">

        </slot>
      </div>

      <!-- 标签区域 -->
      <div v-if="(tags && tags.length > 0) || $slots.tags" class="sdkwork-header-cell__tags">
        <slot name="tags">
          <template v-if="!customTags">
            <van-tag v-for="(tag, index) in tags" :key="index" :type="tag.type || 'default'" :style="tag.customStyle"
              class="sdkwork-header-cell__tag">
              {{ tag.text }}
            </van-tag>
          </template>
        </slot>
      </div>

      <!-- 默认插槽 - 自定义内容 -->
      <slot />
    </div>

    <!-- 操作区域 -->
    <div v-if="$slots.actions" class="sdkwork-header-cell__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { SdkworkHeaderCellProps, SdkworkHeaderCellEmits,  HeaderCellTag } from './types'

// Props 定义
const props = withDefaults(defineProps<SdkworkHeaderCellProps>(), {
  userInfo: () => ({}),
  avatarSize: 80,
  avatarRadius: '50%',
  avatarFit: 'cover',
  showOnlineStatus: true,
  showUserId: true,
  showRegisterTime: false,
  tags: () => [],
  customTags: false,
  layout: 'horizontal',
  align: 'left',
  bordered: false,
  shadow: false,
  round: 1,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<SdkworkHeaderCellEmits>()

// 获取 slots
const slots = useSlots()

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
  return isDarkMode.value ? 'sdkwork-header-cell--dark' : 'sdkwork-header-cell--light'
})

// 计算样式
const computedStyle = computed(() => {
  const style: Record<string, string | number> = {
    ...props.customStyle
  }

  // 应用圆角样式
  if (props.round !== undefined) {
    style.borderRadius = typeof props.round === 'number' ? `${props.round}px` : props.round
  }

  return style
})

// 处理点击事件
const handleClick = (event: Event) => {
  emit('click', event)
  props.onClick?.(event)
}

// 处理头像点击事件
const handleAvatarClick = (event: Event) => {
  emit('avatar-click', event)
  props.onAvatarClick?.(event)
}

// 处理名称点击事件
const handleNameClick = (event: Event) => {
  emit('name-click', event)
  props.onNameClick?.(event)
}

// 暴露方法
const exposeMethods = {
  /** 获取用户信息 */
  getUserInfo: () => props.userInfo,

  /** 获取组件配置 */
  getConfig: () => ({
    avatarSize: props.avatarSize,
    avatarRadius: props.avatarRadius,
    avatarFit: props.avatarFit,
    showOnlineStatus: props.showOnlineStatus,
    showUserId: props.showUserId,
    showRegisterTime: props.showRegisterTime,
    layout: props.layout,
    align: props.align,
    bordered: props.bordered,
    shadow: props.shadow,
    round: props.round,
    themeMode: props.themeMode
  })
}

defineExpose(exposeMethods)
</script>

<style scoped>
.sdkwork-header-cell {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 16px;
  background-color: var(--sdkwork-header-cell-bg-color, #ffffff);
  transition: all 0.3s ease;
}

.sdkwork-header-cell--horizontal {
  flex-direction: row;
}

.sdkwork-header-cell--vertical {
  flex-direction: column;
  text-align: center;
}

.sdkwork-header-cell--align-left {
  justify-content: flex-start;
}

.sdkwork-header-cell--align-center {
  justify-content: center;
}

.sdkwork-header-cell--align-right {
  justify-content: flex-end;
}

.sdkwork-header-cell--bordered {
  border: 1px solid var(--sdkwork-header-cell-border-color, #ebedf0);
}

.sdkwork-header-cell--shadow {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sdkwork-header-cell--round {
  border-radius: 8px;
}

/* 头像区域 */
.sdkwork-header-cell__avatar {
  position: relative;
  flex-shrink: 0;
  margin-right: 16px;
  cursor: pointer;
}

.sdkwork-header-cell--vertical .sdkwork-header-cell__avatar {
  margin-right: 0;
  margin-bottom: 12px;
}

.sdkwork-header-cell__avatar-img {
  display: block;
}

.sdkwork-header-cell__avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind('typeof avatarSize === "number" ? `${avatarSize}px` : avatarSize');
  height: v-bind('typeof avatarSize === "number" ? `${avatarSize}px` : avatarSize');
  border-radius: v-bind(avatarRadius);
  background-color: var(--sdkwork-header-cell-avatar-bg, #f5f5f5);
  color: var(--sdkwork-header-cell-avatar-color, #999);
}

/* 在线状态 */
.sdkwork-header-cell__online-status {
  position: absolute;
  bottom: -4px;
  right: -4px;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 8px;
  background-color: var(--sdkwork-header-cell-offline-color, #ccc);
  color: white;
  white-space: nowrap;
}

.sdkwork-header-cell__online-status--online {
  background-color: var(--sdkwork-header-cell-online-color, #07c160);
}

/* 内容区域 */
.sdkwork-header-cell__content {
  flex: 1;
  min-width: 0;
}

.sdkwork-header-cell--vertical .sdkwork-header-cell__content {
  text-align: center;
}

/* 名称 */
.sdkwork-header-cell__name {
  margin-bottom: 4px;
  font-size: 18px;
  font-weight: 600;
  color: var(--sdkwork-header-cell-title-color, #333);
  cursor: pointer;
}

.sdkwork-header-cell__name-text {
  line-height: 1.4;
}

/* 描述 */
.sdkwork-header-cell__description {
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--sdkwork-header-cell-description-color, #666);
  line-height: 1.4;
}

/* 额外信息 */
.sdkwork-header-cell__extra {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--sdkwork-header-cell-extra-color, #999);
}

.sdkwork-header-cell__id,
.sdkwork-header-cell__register-time,
.sdkwork-header-cell__extra-text {
  line-height: 1.4;
}

/* 标签区域 */
.sdkwork-header-cell__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.sdkwork-header-cell__tag {
  margin-right: 4px;
}

/* 操作区域 */
.sdkwork-header-cell__actions {
  flex-shrink: 0;
  margin-left: 16px;
}

.sdkwork-header-cell--vertical .sdkwork-header-cell__actions {
  margin-left: 0;
  margin-top: 12px;
}

/* 主题样式 */
.sdkwork-header-cell--light {
  --sdkwork-header-cell-bg-color: #ffffff;
  --sdkwork-header-cell-border-color: #ebedf0;
  --sdkwork-header-cell-title-color: #333333;
  --sdkwork-header-cell-description-color: #666666;
  --sdkwork-header-cell-extra-color: #999999;
  --sdkwork-header-cell-avatar-bg: #f5f5f5;
  --sdkwork-header-cell-avatar-color: #999999;
  --sdkwork-header-cell-online-color: #07c160;
  --sdkwork-header-cell-offline-color: #cccccc;
}

.sdkwork-header-cell--dark {
  --sdkwork-header-cell-bg-color: #1a1a1a;
  --sdkwork-header-cell-border-color: #333333;
  --sdkwork-header-cell-title-color: #ffffff;
  --sdkwork-header-cell-description-color: #cccccc;
  --sdkwork-header-cell-extra-color: #999999;
  --sdkwork-header-cell-avatar-bg: #333333;
  --sdkwork-header-cell-avatar-color: #666666;
  --sdkwork-header-cell-online-color: #07c160;
  --sdkwork-header-cell-offline-color: #666666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sdkwork-header-cell {
    padding: 12px;
  }

  .sdkwork-header-cell__avatar {
    margin-right: 12px;
  }

  .sdkwork-header-cell--vertical .sdkwork-header-cell__avatar {
    margin-right: 0;
    margin-bottom: 8px;
  }

  .sdkwork-header-cell__name {
    font-size: 16px;
  }

  .sdkwork-header-cell__description {
    font-size: 13px;
  }
}
</style>