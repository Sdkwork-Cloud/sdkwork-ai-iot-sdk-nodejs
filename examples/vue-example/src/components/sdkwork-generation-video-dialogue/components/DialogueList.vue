<template>
  <div class="dialogue-list">
    <!-- 生成视频按钮 -->
    <div class="action-bar">
      <van-button 
        type="primary" 
        size="small" 
        @click="generateVideo"
        :loading="generatingVideo"
        :disabled="messages.length === 0"
      >
        生成对话视频
      </van-button>
      
      <van-button 
        size="small" 
        @click="clearMessages"
        :disabled="messages.length === 0"
      >
        清空对话
      </van-button>
    </div>
    
    <!-- 消息列表 -->
    <sdkwork-chat-message-list
      :messages="messages"
      :loading="loading"
      :current-user-id="currentUserId"
      :show-avatar="showAvatar"
      :show-time-divider="showTimeDivider"
      :theme-mode="themeMode"
      :has-more="hasMore"
      :show-no-more-data="showNoMoreData"
      @message-click="handleMessageClick"
      @message-long-press="handleMessageLongPress"
      @load-more="handleLoadMore"
    >
      <!-- 自定义消息内容插槽 -->
      <template #message-content="{ message, isOwn }">
        <div class="custom-message-content" :class="{ 'own-message': isOwn }">
          <div class="message-avatar" v-if="showAvatar && message.sender">
            <img v-if="message.sender.face" :src="message.sender.face.url" :alt="message.sender.name" />
            <div v-else class="avatar-placeholder">{{ message.sender.name?.charAt(0).toUpperCase() }}</div>
          </div>
          <div class="message-bubble">
            <div class="message-sender" v-if="message.sender">{{ message.sender.name }}</div>
            <div class="message-text">{{ message.content }}</div>
          </div>
        </div>
      </template>
    </sdkwork-chat-message-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import SdkworkChatMessageList from '../../sdkwork-chat-message-list/sdkwork-chat-message-list.vue'
import type { ChatMessageVO } from '@/services/src/service/chat/message/types'

// 对话角色接口
interface DialogueCharacter {
  id: string
  name: string
  avatar?: string
  description?: string
}

// Props定义
interface Props {
  /** 是否正在加载 */
  loading?: boolean
  /** 是否正在生成视频 */
  generatingVideo?: boolean
  /** 角色列表 */
  characters?: DialogueCharacter[]
  /** 当前用户ID */
  currentUserId?: string | number
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
  /** 是否显示头像 */
  showAvatar?: boolean
  /** 是否显示时间分隔线 */
  showTimeDivider?: boolean
  /** 是否还有更多消息 */
  hasMore?: boolean
  /** 是否显示没有更多数据提示 */
  showNoMoreData?: boolean
}

// Events定义
interface Emits {
  (e: 'generate-video'): void
  (e: 'clear-messages'): void
  (e: 'message-click', message: ChatMessageVO): void
  (e: 'message-long-press', message: ChatMessageVO): void
  (e: 'load-more'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  generatingVideo: false,
  characters: () => [],
  currentUserId: '',
  themeMode: 'auto',
  showAvatar: true,
  showTimeDivider: true,
  hasMore: false,
  showNoMoreData: true
})

const emit = defineEmits<Emits>()

// 响应式数据
const messages = ref<ChatMessageVO[]>([])

// 创建角色信息映射
const characterMap = computed(() => {
  const map: Record<string, DialogueCharacter> = {}
  props.characters.forEach(character => {
    map[character.id] = character
  })
  return map
})

// 添加消息
const addMessage = (message: Omit<ChatMessageVO, 'id' | 'createdAt' | 'isOwn'>) => {
  const newMessage: ChatMessageVO = {
    ...message,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    isOwn: message.senderId === props.currentUserId,
    // 添加发送者信息
    sender: message.senderId ? characterMap.value[message.senderId] : undefined,
    // 设置默认值
    uuid: message.uuid || `uuid_${Date.now()}`,
    children: message.children || [],
    messageState: message.messageState,
    actions: message.actions || []
  }
  
  messages.value.push(newMessage)
}

// 生成对话 - 从输入内容解析并创建多条消息
const generateDialogue = (content: string, selectedCharacterId: string, style: string = 'casual') => {
  if (!content || !selectedCharacterId) return
  
  // 清空现有消息
  messages.value = []
  
  // 获取选中角色
  const selectedCharacter = characterMap.value[selectedCharacterId]
  if (!selectedCharacter) return
  
  // 模拟生成对话 - 实际应用中，这里应该调用AI生成对话的API
  const generatedMessages = generateMockDialogue(content, selectedCharacter, props.characters, style)
  
  // 添加生成的消息
  generatedMessages.forEach((msg, index) => {
    // 添加延迟以模拟逐步生成
    setTimeout(() => {
      addMessage(msg)
    }, index * 300)
  })
}

// 生成模拟对话数据
const generateMockDialogue = (
  content: string, 
  selectedCharacter: DialogueCharacter, 
  allCharacters: DialogueCharacter[],
  style: string
): Array<Omit<ChatMessageVO, 'id' | 'createdAt' | 'isOwn'>> => {
  // 获取其他角色
  const otherCharacters = allCharacters.filter(c => c.id !== selectedCharacter.id)
  if (otherCharacters.length === 0) return []
  
  // 根据风格调整消息语气
  const stylePrefixes = {
    casual: ['', '呵呵', '嗯嗯', '哈哈', '是啊'],
    formal: ['好的', '是的', '我明白', '确实', '没错'],
    humorous: ['哈哈', '嘿嘿', '嘻嘻', '哎呀', '哇塞']
  }
  
  const prefixes = stylePrefixes[style as keyof typeof stylePrefixes] || stylePrefixes.casual
  
  // 生成对话内容
  const messages = []
  
  // 第一个消息：当前角色提出的主题
  messages.push({
    senderId: selectedCharacter.id,
    content: `${content}`,
    uuid: `uuid_${Date.now()}_1`,
    children: []
  })
  
  // 第二个消息：其他角色的回应
  if (otherCharacters.length > 0) {
    const otherChar = otherCharacters[0]
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    messages.push({
      senderId: otherChar.id,
      content: `${prefix}${generateResponse(content, otherChar.name, selectedCharacter.name)}`,
      uuid: `uuid_${Date.now()}_2`,
      children: []
    })
    
    // 第三个消息：当前角色的进一步回应
    const prefix2 = prefixes[Math.floor(Math.random() * prefixes.length)]
    messages.push({
      senderId: selectedCharacter.id,
      content: `${prefix2}${generateFollowUp(content, otherChar.name)}`,
      uuid: `uuid_${Date.now()}_3`,
      children: []
    })
    
    // 第四个消息：如果有更多角色，添加另一个角色的回应
    if (otherCharacters.length > 1) {
      const anotherChar = otherCharacters[1]
      const prefix3 = prefixes[Math.floor(Math.random() * prefixes.length)]
      messages.push({
        senderId: anotherChar.id,
        content: `${prefix3}${generateAnotherResponse(content, selectedCharacter.name, otherChar.name)}`,
        uuid: `uuid_${Date.now()}_4`,
        children: []
      })
    }
    
    // 第五个消息：第一个角色的总结
    const summaryPrefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    messages.push({
      senderId: otherChar.id,
      content: `${summaryPrefix}看来我们都觉得这个想法不错呢！`,
      uuid: `uuid_${Date.now()}_5`,
      children: []
    })
  }
  
  return messages
}

// 生成回应内容
const generateResponse = (content: string, responderName: string, initiatorName: string): string => {
  if (content.includes('周末')) {
    return '这个周末确实是个好时机，我也正想着怎么安排呢。'
  } else if (content.includes('计划')) {
    return '计划不错，我觉得可以再详细一些。'
  } else if (content.includes('讨论')) {
    return '我很乐意和你讨论这个话题，听起来很有意思。'
  } else {
    return `${responderName}同意${initiatorName}的想法，并表示这是个值得探讨的话题。`
  }
}

// 生成后续回应
const generateFollowUp = (content: string, otherName: string): string => {
  return `谢谢${otherName}的建议，我觉得我们可以一起把它实现。`
}

// 生成另一个角色的回应
const generateAnotherResponse = (content: string, initiatorName: string, otherName: string): string => {
  return `我也同意${initiatorName}的看法，${otherName}说得很对。`
}

// 生成视频
const generateVideo = () => {
  if (messages.value.length === 0) {
    showToast('没有可生成视频的对话内容')
    return
  }
  
  emit('generate-video')
}

// 清空消息
const clearMessages = () => {
  messages.value = []
  emit('clear-messages')
}

// 处理消息点击
const handleMessageClick = (message: ChatMessageVO) => {
  emit('message-click', message)
}

// 处理消息长按
const handleMessageLongPress = (message: ChatMessageVO) => {
  emit('message-long-press', message)
}

// 处理加载更多
const handleLoadMore = () => {
  emit('load-more')
}

// 暴露方法给父组件
defineExpose({
  addMessage,
  generateDialogue,
  messages
})
</script>

<style lang="scss" scoped>
.dialogue-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
}

// 自定义消息内容样式
.custom-message-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  
  &.own-message {
    flex-direction: row-reverse;
    
    .message-bubble {
      background-color: var(--van-primary-color);
      color: #fff;
    }
  }
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
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

.message-bubble {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f2f3f5;
  color: #323233;
  
  .message-sender {
    font-size: 12px;
    color: #969799;
    margin-bottom: 4px;
  }
  
  .message-text {
    font-size: 14px;
    line-height: 1.4;
  }
}
</style>