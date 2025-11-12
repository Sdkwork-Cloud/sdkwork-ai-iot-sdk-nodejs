<template>
  <div class="sdkwork-video-chat-input" :class="themeClass">
    <!-- 消息列表区域 -->
    <div class="chat-messages" ref="messagesContainerRef">
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
        ref="messageListRef"
      > 
      </sdkwork-chat-message-list>
    </div>
    
    <!-- 底部输入区域 -->
    <div class="chat-input-area">
      <!-- 角色选择条 -->
      <div class="character-selector" v-if="characters.length > 0">
        <div class="character-list">
          <div
            v-for="character in characters"
            :key="character.id"
            class="character-item"
            :class="{ active: selectedCharacterId === character.id }"
            @click="selectCharacter(character)"
          >
            <div class="character-avatar">
              <img v-if="character.avatar" :src="character.avatar" :alt="character.name" />
              <div v-else class="avatar-placeholder">{{ character.name.charAt(0).toUpperCase() }}</div>
            </div>
            <div class="character-name">{{ character.name }}</div>
          </div>
          
          <!-- 添加角色按钮 -->
          <div class="character-item add-character" @click="showAddCharacterDialog = true">
            <div class="character-avatar add">
              <van-icon name="plus" />
            </div>
            <div class="character-name">添加</div>
          </div>
        </div>
      </div>
      
      <!-- 大输入框区域 -->
      <div class="input-container">
        <van-field
          v-model="inputText"
          type="textarea"
          placeholder="输入对话内容，如：小明和小红讨论周末计划"
          autosize
          maxlength="500"
          show-word-limit
          class="message-field"
          @keydown.enter="handleEnterKey"
        />
        
        <div class="input-actions">
          <!-- 生成对话按钮 -->
          <van-button 
            type="primary" 
            size="large" 
            @click="generateDialogue"
            :loading="generating"
            :disabled="!inputText.trim() || characters.length === 0"
            block
          >
            生成对话
          </van-button>
          
          <!-- 生成视频按钮 -->
          <van-button 
            type="success" 
            size="large" 
            @click="openVideoGenerator"
            :disabled="messages.length === 0"
            block
          >
            生成视频
          </van-button>
        </div>
      </div>
    </div>
    
    <!-- 添加角色弹窗 -->
    <van-popup v-model:show="showAddCharacterDialog" position="bottom" round>
      <div class="character-dialog">
        <div class="dialog-header">
          <span class="dialog-title">添加角色</span>
          <van-icon name="cross" @click="showAddCharacterDialog = false" />
        </div>
        
        <div class="dialog-content">
          <van-field label="角色名称" v-model="characterForm.name" placeholder="请输入角色名称" />
          <van-field label="角色描述" v-model="characterForm.description" type="textarea" rows="2" placeholder="请输入角色描述" />
          <van-field label="头像URL" v-model="characterForm.avatar" placeholder="请输入头像URL" />
        </div>
        
        <div class="dialog-footer">
          <van-button block type="primary" @click="addCharacter">添加</van-button>
        </div>
      </div>
    </van-popup>
    
    <!-- 视频生成弹窗 -->
    <video-generator
      v-if="showVideoGenerator"
      :characters="characters"
      :messages="messages"
      ref="videoGeneratorRef"
      @generation-completed="handleGenerationCompleted"
      @generation-failed="handleGenerationFailed"
      @close="showVideoGenerator = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { showToast, showSuccessToast, showFailToast } from 'vant'
import SdkworkChatMessageList from '../sdkwork-chat-message-list/sdkwork-chat-message-list.vue'
import VideoGenerator from './components/VideoGenerator.vue'
import type { DialogueCharacter } from '../sdkwork-generation-video-dialogue/types'
import type { ChatMessageVO } from '@/services/src/service/chat/message/types'

// Props定义
interface Props {
  /** 当前用户ID */
  currentUserId?: string
  /** 是否正在加载 */
  loading?: boolean
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
  /** 生成开始事件 */
  (e: 'generation-start', params: any): void
  /** 生成成功事件 */
  (e: 'generation-success', result: any): void
  /** 生成错误事件 */
  (e: 'generation-error', error: string): void
  /** 角色添加事件 */
  (e: 'character-added', character: DialogueCharacter): void
  /** 对话生成事件 */
  (e: 'dialogue-generated', messages: ChatMessageVO[]): void
}

const props = withDefaults(defineProps<Props>(), {
  currentUserId: '',
  loading: false,
  themeMode: 'auto',
  showAvatar: true,
  showTimeDivider: true,
  hasMore: false,
  showNoMoreData: true
})

const emit = defineEmits<Emits>()

// 组件引用
const messageListRef = ref()
const videoGeneratorRef = ref()

// 响应式数据
const characters = ref<DialogueCharacter[]>([
  // 默认角色
  {
    id: 'character_1',
    name: '小明',
    description: '一个活泼开朗的男孩',
    avatar: '',
    appearance: {
      gender: 'male',
      age: '20岁',
      style: '休闲',
      description: '短发，穿着休闲装，笑容阳光'
    },
    voice: {
      voiceId: 'male_young',
      pitch: 1.0,
      speed: 1.0,
      emotion: '开朗'
    }
  },
  {
    id: 'character_2',
    name: '小红',
    description: '一个温柔文静的女孩',
    avatar: '',
    appearance: {
      gender: 'female',
      age: '19岁',
      style: '甜美',
      description: '长发，穿着连衣裙，文静温柔'
    },
    voice: {
      voiceId: 'female_young',
      pitch: 1.2,
      speed: 0.9,
      emotion: '温柔'
    }
  }
])
const selectedCharacterId = ref('')
const inputText = ref('')
const generating = ref(false)
const messages = ref<ChatMessageVO[]>([])
const showAddCharacterDialog = ref(false)
const showVideoGenerator = ref(false)

// 角色表单
const characterForm = reactive({
  name: '',
  description: '',
  avatar: ''
})

// 主题类名
const themeClass = computed(() => {
  if (props.themeMode === 'dark') return 'theme-dark'
  if (props.themeMode === 'light') return 'theme-light'
  return 'theme-auto'
})

// 选择角色
const selectCharacter = (character: DialogueCharacter) => {
  selectedCharacterId.value = character.id
}

// 添加角色
const addCharacter = () => {
  if (!characterForm.name.trim()) {
    showToast('请输入角色名称')
    return
  }
  
  const newCharacter: DialogueCharacter = {
    id: `character_${Date.now()}`,
    name: characterForm.name,
    description: characterForm.description,
    avatar: characterForm.avatar,
    appearance: {
      gender: 'male',
      age: '',
      style: '',
      description: ''
    },
    voice: {
      voiceId: 'standard',
      pitch: 1.0,
      speed: 1.0,
      emotion: '普通'
    }
  }
  
  characters.value.push(newCharacter)
  emit('character-added', newCharacter)
  
  // 重置表单
  characterForm.name = ''
  characterForm.description = ''
  characterForm.avatar = ''
  showAddCharacterDialog.value = false
  
  showToast('角色添加成功')
}

// 处理回车键
const handleEnterKey = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault()
    generateDialogue()
  }
}

// 生成对话
const generateDialogue = () => {
  if (!inputText.value.trim()) {
    showToast('请输入对话内容')
    return
  }
  
  if (characters.value.length < 2) {
    showToast('至少需要两个角色才能生成对话')
    return
  }
  
  generating.value = true
  
  // 模拟生成对话
  setTimeout(() => {
    const newMessages = generateMockDialogue(inputText.value)
    messages.value = [...messages.value, ...newMessages]
    inputText.value = ''
    generating.value = false
    
    showToast('对话生成成功')
    emit('dialogue-generated', newMessages)
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }, 1000)
}

// 生成模拟对话
const generateMockDialogue = (content: string): ChatMessageVO[] => {
  const result: ChatMessageVO[] = []
  
  // 使用角色列表中的前两个角色
  const character1 = characters.value[0]
  const character2 = characters.value[1]
  
  // 生成5轮对话
  for (let i = 0; i < 5; i++) {
    const isCharacter1Turn = i % 2 === 0
    const speaker = isCharacter1Turn ? character1 : character2
    const receiver = isCharacter1Turn ? character2 : character1
    
    let messageContent = ''
    if (i === 0) {
      // 第一个消息：发起话题
      messageContent = `${content}`
    } else if (i === 1) {
      // 第二个消息：回应话题
      messageContent = `我觉得这个想法不错，${speaker.name}很赞同。`
    } else if (i === 2) {
      // 第三个消息：补充说明
      messageContent = `我们可以尝试一下，${speaker.name}觉得很有意思。`
    } else if (i === 3) {
      // 第四个消息：提出建议
      messageContent = `${speaker.name}建议我们周末可以一起去实现这个想法。`
    } else {
      // 第五个消息：达成共识
      messageContent = `太好了，${speaker.name}期待周末的到来！`
    }
    
    const message: ChatMessageVO = {
      id: `msg_${Date.now()}_${i}`,
      uuid: `uuid_${Date.now()}_${i}`,
      senderId: speaker.id,
      content: messageContent,
      isOwn: speaker.id === props.currentUserId,
      createdAt: new Date().toISOString(),
      children: [],
      messageState: {
        isThinking: false,
        thinkStart: Date.now()
      },
      actions: [],
      // 添加发送者信息
      sender: {
        id: speaker.id,
        name: speaker.name, 
      }
    }
    
    result.push(message)
  }
  
  return result
}

// 打开视频生成器
const openVideoGenerator = () => {
  if (messages.value.length === 0) {
    showToast('没有可生成视频的对话内容')
    return
  }
  
  showVideoGenerator.value = true
}

// 处理视频生成完成
const handleGenerationCompleted = (result: any) => {
  showSuccessToast('视频生成成功')
  emit('generation-success', result)
}

// 处理视频生成失败
const handleGenerationFailed = (error: string) => {
  showFailToast(`视频生成失败: ${error}`)
  emit('generation-error', error)
}

// 处理消息点击
const handleMessageClick = (message: ChatMessageVO) => {
  console.log('Message clicked:', message)
}

// 处理消息长按
const handleMessageLongPress = (message: ChatMessageVO) => {
  console.log('Message long pressed:', message)
}

// 处理加载更多
const handleLoadMore = () => {
  console.log('Load more messages')
}

// 滚动到底部
const scrollToBottom = () => {
  if (messageListRef.value && messageListRef.value.scrollToBottom) {
    messageListRef.value.scrollToBottom()
  }
}

// 暴露方法给父组件
defineExpose({
  characters,
  messages,
  selectCharacter,
  generateDialogue,
  scrollToBottom
})
</script>

<style lang="scss" scoped>
.sdkwork-video-chat-input {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--van-background-color-light);
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;
  }
  
  .chat-input-area {
    flex-shrink: 0;
    background-color: #fff;
    border-top: 1px solid var(--van-border-color);
    
    .character-selector {
      padding: 12px 16px;
      border-bottom: 1px solid var(--van-border-color);
      
      .character-list {
        display: flex;
        overflow-x: auto;
        gap: 16px;
        padding: 8px 0;
        
        .character-item {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s;
          
          &:hover {
            transform: translateY(-2px);
          }
          
          &.active {
            .character-avatar {
              border-color: var(--van-primary-color);
            }
          }
          
          &.add-character {
            .character-avatar {
              background-color: var(--van-gray-2);
              color: var(--van-gray-6);
            }
          }
          
          .character-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid transparent;
            background-color: var(--van-gray-1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            
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
          
          .character-name {
            font-size: 12px;
            color: var(--van-text-color);
            text-align: center;
            white-space: nowrap;
          }
        }
      }
    }
    
    .input-container {
      padding: 16px;
      
      .message-field {
        margin-bottom: 16px;
        border-radius: 8px;
        background-color: var(--van-gray-1);
        
        :deep(.van-field__control) {
          min-height: 80px;
          font-size: 16px;
        }
      }
      
      .input-actions {
        display: flex;
        gap: 12px;
        
        .van-button {
          flex: 1;
          height: 50px;
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
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
  
  .character-dialog {
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 16px;
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .dialog-title {
        font-size: 18px;
        font-weight: 500;
      }
    }
    
    .dialog-content {
      margin-bottom: 20px;
    }
    
    .dialog-footer {
      margin-top: 20px;
    }
  }
  
  // 主题样式
  &.theme-dark {
    .chat-input-area {
      background-color: var(--van-gray-8);
      border-top-color: var(--van-gray-7);
      
      .character-selector {
        border-bottom-color: var(--van-gray-7);
      }
      
      .message-field {
        background-color: var(--van-gray-7);
        color: var(--van-gray-1);
      }
    }
    
    .message-bubble {
      background-color: var(--van-gray-7);
      color: var(--van-gray-1);
    }
  }
}
</style>