<template>
  <sdkwork-page-container>

    <!-- 模式切换内容 -->
    <!-- 语音聊天模式 -->
    <sdkwork-chat-component-voice v-if="currentMode === 'voice'" :conversation-id="conversationId" @mode-change="handleModeChange" />

    <!-- 文本聊天模式 -->
    <sdkwork-chat-component-text v-else :conversation-id="conversationId" :current-user="currentUser"
       @mode-change="handleModeChange">
      <template #header>
        <!-- 文字模式下显示 header -->
        <app-header v-if="currentMode === 'text'" :title="conversationTitle" :show-back="true" :custom-right="true"
          @left-click="handleBack">
          <template #right>
            <!-- 模式切换按钮 -->
            <div class="mode-switch">
              <Icon icon="mingcute:phone-fill" width="20" height="20" class="mode-switch-icon"
                @click="switchToVoiceMode" :title="'切换到语音模式'" />
            </div>
            <div class="mode-switch" style="margin-left: 10px;">
              <Icon icon="mingcute:more-1-fill" width="16" height="16" @click="gotoProfile" />
            </div>
          </template>
        </app-header>
      </template>
    </sdkwork-chat-component-text>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { Icon } from '@iconify/vue'
import AppHeader from '@/components/layout/app-header/app-header.vue'
import SdkworkChatComponentText from '@/components/sdkwork-chat-component-text/sdkwork-chat-component-text.vue'
import SdkworkChatComponentVoice from '@/components/sdkwork-chat-component-voice/sdkwork-chat-component-voice.vue'
import { useChatStore } from '@/stores/modules/chat'
import { useAuthStore } from '@/stores/modules/auth'
import { useConversationStore } from '@/stores/modules/conversation'

// 定义组件属性
interface Props {
  conversationId?: string
  defaultMode?: 'text' | 'voice'
}

const props = withDefaults(defineProps<Props>(), {
  defaultMode: 'text'
})

// 定义组件事件
interface Emits {
  'mode-change': [mode: 'text' | 'voice']
  'back': []
}

const emit = defineEmits<Emits>()

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const authStore = useAuthStore()
const conversationStore = useConversationStore()

// 模式管理 - 使用chat store进行管理
const currentMode = computed(() => chatStore.currentChatMode as 'text' | 'voice')

// 从路由参数获取默认模式
const conversationId = computed(() => {
  if (props.conversationId) {
    return props.conversationId
  }
  
  const params = route.params as { id: string | string[] }
  const id = params.id
  return Array.isArray(id) ? id[0] : id || ''
})

// 检查是否有模式参数
const getDefaultMode = (): 'text' | 'voice' => {
  if (props.defaultMode) {
    return props.defaultMode
  }
  
  const query = route.query
  if (query.mode === 'voice') {
    return 'voice'
  }
  return 'text'
}

// 当前用户信息
const currentUser = computed(() => {
  return authStore.currentUser || {
    id: 'user1',
    name: '当前用户',
    avatar: 'https://via.placeholder.com/40',
    online: true
  }
})

// 当前会话信息
const currentConversation = computed(() => conversationStore.currentConversation)

const conversationTitle = computed(() => {
  if (currentMode.value === 'voice') {
    return '语音通话'
  }
  return currentConversation.value?.title || '对话详情'
})

const switchToVoiceMode = async () => {
  try {
    // 切换到语音模式
    await chatStore.switchChatMode('voice')
    showToast('切换到语音模式')
  } catch (error) {
    console.error('切换到语音模式失败:', error)
    showToast('切换模式失败')
  }
}

const handleBack = () => {
  emit('back')
}

const gotoProfile = () => {
  router.push(`/chat/profile/${currentConversation.value?.agentId || 0}`)
}

const handleModeChange = async (newMode: 'text' | 'voice') => {
  try {
    // 使用switchChatMode方法切换模式，避免重新初始化资源
    await chatStore.switchChatMode(newMode)
    
    emit('mode-change', newMode)
  } catch (error) {
    console.error('切换模式失败:', error)
    showToast('切换模式失败')
  }
}

// 监听会话ID变化，加载对应会话数据
watch(conversationId, async (newId) => {
  if (newId) {
    try {
      // 设置当前会话
      await conversationStore.switchConversation(newId)
    } catch (error) {
      console.error('加载会话数据失败:', error)
      showToast('加载会话数据失败')
    }
  }
}, { immediate: true })

onMounted(async () => {
  // 初始化会话存储（如果尚未初始化）
  if (!conversationStore.isInitialized) {
    try {
      await conversationStore.initialize()
    } catch (error) {
      console.error('初始化会话存储失败:', error)
    }
  }

  // 初始化聊天会话 - 根据默认模式进入相应会话
  try {
    await chatStore.initialize()
    const defaultMode = getDefaultMode()
    await chatStore.enterChat({ mode: defaultMode })
    console.log('聊天组件已挂载并进入聊天会话，模式:', defaultMode)
  } catch (error) {
    console.error('聊天组件挂载失败:', error)
  }

  // 根据 conversationId 加载对话数据
  console.log('加载对话:', conversationId.value)
  console.log('默认模式:', getDefaultMode())

  // 显示模式切换提示
  if (getDefaultMode() === 'voice') {
    showToast('已进入语音通话模式')
  }
})

// 组件卸载时退出聊天会话 - 统一调用exitChat
onUnmounted(async () => {
  try {
    await chatStore.exitChat()
    console.log('聊天组件已卸载并退出聊天会话')
  } catch (error) {
    console.error('聊天组件卸载失败:', error)
  }
})
</script>

<style scoped lang="scss">
.mode-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  .mode-switch-icon {
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>