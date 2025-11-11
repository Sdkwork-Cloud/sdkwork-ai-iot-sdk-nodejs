<template>
  <div class="group-bottom" :class="themeClass">
    <div class="bottom-container">
      <!-- 返回按钮 -->
      <van-button
        type="default"
        size="large"
        round
        @click="handleBack"
        class="back-button"
      >
        <van-icon name="arrow-left" size="16" class="button-icon" />
        返回
      </van-button>
      
      <!-- 主操作按钮 -->
      <van-button
        v-if="!group?.isJoined"
        type="primary"
        size="large"
        round
        :loading="joining"
        @click="handleJoinGroup"
        class="join-button"
      >
        <van-icon name="plus" size="16" class="button-icon" />
        {{ group?.price > 0 ? `付费加入 (¥${group.price})` : '加入群组' }}
      </van-button>
      
      <van-button
        v-else
        type="primary"
        size="large"
        round
        @click="handleEnterGroup"
        class="enter-button"
      >
        <van-icon name="chat" size="16" class="button-icon" />
        进入群聊
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme'

// Props定义
interface Props {
  group?: any
  joining?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  joining: false
})

// 事件定义
interface Emits {
  (e: 'back'): void
  (e: 'join', group: any): void
  (e: 'enter', group: any): void
}

const emit = defineEmits<Emits>()

// 主题hook
const { currentTheme } = useTheme()
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 处理返回
const handleBack = () => {
  emit('back')
}

// 处理加入群组
const handleJoinGroup = () => {
  if (props.group.isJoined) {
    showToast('您已加入该群组')
    return
  }

  if (props.group.price > 0) {
    showConfirmDialog({
      title: '付费入群',
      message: `加入"${props.group.name}"需要支付 ¥${props.group.price}，是否确认？`,
    })
      .then(() => {
        // 模拟支付
        showToast('支付成功，已加入群组')
        emit('join', props.group)
      })
      .catch(() => {
        // 取消支付
      })
  } else {
    // 免费加入
    showToast('已加入群组')
    emit('join', props.group)
  }
}

// 处理进入群组
const handleEnterGroup = () => {
  emit('enter', props.group)
}
</script>

<style scoped>
.group-bottom {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: var(--bg-card, #ffffff);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  border-top: 1px solid var(--border-color, #ebedf0);
  backdrop-filter: blur(10px);
}

.bottom-container {
  display: flex;
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
}

.back-button, .join-button, .enter-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border-radius: var(--radius-large, 12px);
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-light);
}

.back-button {
  background: var(--bg-secondary, #f5f5f5);
  color: var(--text-primary, #323233);
  border: 1px solid var(--border-color, #ebedf0);
}

.back-button:hover {
  background: var(--bg-gray, #f0f0f0);
  transform: translateY(-1px);
}

.join-button, .enter-button {
  background: var(--color-primary, #1989fa);
  border: 1px solid var(--color-primary, #1989fa);
}

.join-button:hover, .enter-button:hover {
  background: var(--color-primary-light, #1989fa);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(25, 137, 250, 0.2);
}

.button-icon {
  margin-right: 6px;
  transition: transform 0.2s ease;
}

.back-button:active .button-icon,
.join-button:active .button-icon,
.enter-button:active .button-icon {
  transform: scale(0.9);
}

/* 主题适配样式 */
.theme-light {
  --bg-page: #f7f8fa;
  --bg-card: #ffffff;
  --bg-gray: #f5f5f5;
  --bg-secondary: #fafafa;
  --text-primary: #323233;
  --text-secondary: #969799;
  --text-light: #999999;
  --color-primary: #1989fa;
  --color-primary-light: #1784e3;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #ebedf0;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.05);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}

.theme-dark {
  --bg-page: #0a0a0a;
  --bg-card: #1a1a1a;
  --bg-gray: #2a2a2a;
  --bg-secondary: #222222;
  --text-primary: #ffffff;
  --text-secondary: #c8c9cc;
  --text-light: #969799;
  --color-primary: #1989fa;
  --color-primary-light: #2988e8;
  --color-success: #07c160;
  --color-danger: #ee0a24;
  --color-warning: #ff976a;
  --border-color: #3a3a3a;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.2);
  --radius: 8px;
  --radius-large: 12px;
  --radius-small: 6px;
}

/* 暗色主题适配 */
.theme-dark .back-button {
  background: var(--bg-gray, #2a2a2a);
  border-color: var(--border-color, #3a3a3a);
}

.theme-dark .back-button:hover {
  background: var(--bg-secondary, #222222);
}

.theme-dark .join-button, .theme-dark .enter-button {
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.15);
}

.theme-dark .join-button:hover, .theme-dark .enter-button:hover {
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.25);
}

/* 安全区域适配 */
@supports (padding: max(0px)) {
  .group-bottom {
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
}
</style>