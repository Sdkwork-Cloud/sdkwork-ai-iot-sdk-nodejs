<template>
  <sdkwork-page-container>

    <!-- 模式切换内容 -->
    <!-- 文本聊天模式 -->
    <SdkworkChat v-if="currentMode === 'text'" :conversation-id="conversationId" :current-user="currentUser"
      :messages="messages" @mode-change="handleModeChange">
      <template #header>
        <!-- 文字模式下显示 header -->
        <app-header v-if="currentMode === 'text'" :title="conversationTitle" :show-back="true" :custom-right="true"
          @left-click="$router.back()">
          <template #right>
            <!-- 模式切换按钮 -->
            <div class="mode-switch">
              <Icon icon="mingcute:phone-fill" width="20" height="20" class="mode-switch-icon"
                @click="switchToVoiceMode" :title="'切换到语音模式'" />
            </div>
            <div class="mode-switch" style="margin-left: 10px;">
              <Icon icon="mingcute:more-1-fill" width="16" height="16"  @click="gotoProfile"/>
            </div>
            <!-- <DropdownMenu :items="moreOptions" @item-click="handleMenuClick">
              <template #trigger>
                <Icon icon="mingcute:more-1-fill" width="16" height="16" />
              </template>
            </DropdownMenu> -->
          </template>
        </app-header>
      </template>
    </SdkworkChat>

    <!-- 语音聊天模式 -->
    <SdkworkVoiceChat v-else :conversation-id="conversationId" @mode-change="handleModeChange" />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import { Icon } from '@iconify/vue'
import AppHeader from '@/components/layout/app-header/app-header.vue'
import SdkworkChat from '@/components/sdkwork-chat/sdkwork-chat.vue'
import SdkworkVoiceChat from '@/components/sdkwork-voice-chat/sdkwork-voice-chat.vue'
import { useChatStore } from '@/stores/modules/chat'
import { useAuthStore } from '@/stores/modules/auth'

// definePage({
//   meta: {
//     title: '对话详情',
//     hideHeader: true
//   }
// })

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const authStore = useAuthStore()

// 模式管理
type ChatMode = 'text' | 'voice'
const currentMode = ref<ChatMode>('text')

// 从路由参数获取默认模式
const conversationId = computed(() => {
  const params = route.params as { id: string | string[] }
  const id = params.id
  return Array.isArray(id) ? id[0] : id || ''
})

// 检查是否有模式参数
const getDefaultMode = (): ChatMode => {
  const query = route.query
  if (query.mode === 'voice') {
    return 'voice'
  }
  return 'text'
}

const moreOptions = [
  { text: '清空对话', value: 'clear', icon: 'mingcute:delete-2-fill' },
  { text: '导出对话', value: 'export', icon: 'mingcute:download-2-fill' },
  { text: '举报对话', value: 'report', icon: 'mingcute:alert-fill' }
]

// 当前用户信息
const currentUser = computed(() => {
  return authStore.currentUser || {
    id: 'user1',
    name: '当前用户',
    avatar: 'https://via.placeholder.com/40',
    online: true
  }
})

const refreshing = ref(false)

// 当前会话信息
const currentConversation = computed(() => chatStore.currentConversation)

// 使用 chat store 的消息数据
const messages = computed(() => chatStore.messages)

const conversationTitle = computed(() => {
  if (currentMode.value === 'voice') {
    return '语音通话'
  }
  return currentConversation.value?.title || '对话详情'
})

// 模式切换方法
const switchToTextMode = () => {
  currentMode.value = 'text'
  showToast('切换到文字模式')
}

const switchToVoiceMode = () => {
  currentMode.value = 'voice'
  showToast('切换到语音模式')
}
const gotoProfile = () => {
  router.push(`/chat/profile/${currentConversation.value?.agentId||0}`)
}
const handleModeChange = (newMode: ChatMode) => {
  currentMode.value = newMode
}

const formatTime = (timestamp: string | Date) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onRefresh = async () => {
  try {
    refreshing.value = true
    // 重新加载当前会话的消息
    if (conversationId.value) {
      await chatStore.loadConversationMessages(conversationId.value)
    }
    showToast('刷新成功')
  } catch (error) {
    showToast('刷新失败')
    console.error('刷新消息失败:', error)
  } finally {
    refreshing.value = false
  }
}

const handleSendMessage = async (message: string) => {
  try {
    // 使用 chat store 的 sendMessage 方法
    await chatStore.sendMessage(message)
    showToast('消息发送成功')
  } catch (error) {
    showToast('消息发送失败')
    console.error('发送消息失败:', error)
  }
}

// 处理菜单项点击
const handleMenuClick = async (item: any) => {
  switch (item.value) {
    case 'clear':
      try {
        await chatStore.clearCurrentConversation()
        showToast('对话已清空')
      } catch (error) {
        showToast('清空对话失败')
        console.error('清空对话失败:', error)
      }
      break
    case 'export':
      showToast('导出对话功能开发中...')
      break
    case 'report':
      showToast('举报对话功能开发中...')
      break
  }
}

// 监听会话ID变化，加载对应会话数据
watch(conversationId, async (newId) => {
  if (newId) {
    try {
      // 设置当前会话
      chatStore.currentConversationId = newId
      // 加载会话消息
      await chatStore.loadConversationMessages(newId)
    } catch (error) {
      console.error('加载会话数据失败:', error)
      showToast('加载会话数据失败')
    }
  }
}, { immediate: true })

onMounted(() => {
  // 根据路由参数设置默认模式
  currentMode.value = getDefaultMode()

  // 根据 conversationId 加载对话数据
  console.log('加载对话:', conversationId.value)
  console.log('默认模式:', currentMode.value)

  // 显示模式切换提示
  if (currentMode.value === 'voice') {
    showToast('已进入语音通话模式')
  }
})
</script>

<style scoped lang="scss"></style>

<route>
{
  meta: {
    layout: 'default',
    title: '对话详情',
    hideHeader: true
  }
}
</route>