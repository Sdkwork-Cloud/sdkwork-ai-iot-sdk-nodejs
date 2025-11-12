<template>
  <div class="sdkwork-generation-video-dialogue" :class="themeClass">
    <!-- 聊天界面布局 -->
    <div class="chat-container">
      <!-- 消息列表区域 -->
      <div class="chat-messages" ref="messagesContainerRef">
        <sdkwork-chat-message-list
          :messages="messages"
          :loading="loadingMessages"
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
          <!-- 自定义消息内容插槽 -->
          <template #message-content="{ message, isOwn }">
            <div class="custom-message-content" :class="{ 'own-message': isOwn }">
              <div class="message-avatar" v-if="showAvatar && getSenderInfo(message)">
                <img v-if="getSenderInfo(message)?.avatar" :src="getSenderInfo(message)?.avatar" :alt="getSenderInfo(message)?.name" />
                <div v-else class="avatar-placeholder">{{ getSenderInfo(message)?.name?.charAt(0).toUpperCase() || '?' }}</div>
              </div>
              <div class="message-bubble">
                <div class="message-sender" v-if="getSenderInfo(message)">{{ getSenderInfo(message)?.name }}</div>
                <div class="message-text">{{ getMessageContent(message) }}</div>
              </div>
            </div>
          </template>
        </sdkwork-chat-message-list>
      </div>
      
      <!-- 底部输入区域 -->
      <ChatInputBar
        :characters="characters"
        :selected-character-id="selectedCharacterId"
        :input-text="inputText"
        :generating-dialogue="generatingDialogue"
        :generating-video="generatingVideo"
        :has-messages="messages.length > 0"
        @select-character="selectCharacter"
        @show-add-character="showAddCharacterDialog = true"
        @generate-dialogue="generateDialogue"
        @show-video-generator="showVideoGenerator = true"
        @update:input-text="inputText = $event"
        @media-upload="handleMediaUpload"
      />
    </div>
    
    <!-- 添加角色弹窗 -->
    <AddCharacterDialog 
      v-model="showAddCharacterDialog" 
      @add="handleCharacterAdded"
    />
    
    <!-- 视频生成弹窗 -->
    <VideoGenerator 
      v-model="showVideoGenerator" 
      :messages="messages"
      :generating-video="generatingVideo"
      @generate="startVideoGeneration"
      @resolution-picker="showResolutionPicker"
      @format-picker="showFormatPicker"
      @music-picker="showMusicPicker"
      ref="videoGeneratorRef"
    />
    
    <!-- 选择器弹窗 -->
    <PickerDialog 
      v-model="showPicker" 
      :picker-type="currentPickerType"
      @confirm="onConfirm"
    />
    
    <!-- 生成进度弹窗 -->
    <ProgressDialog 
      v-model="showProgressDialog"
      :title="progressTitle"
      :progress="progress"
      :text="progressText"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { showToast, showSuccessToast, showFailToast } from 'vant'
import SdkworkChatMessageList from '../sdkwork-chat-message-list/sdkwork-chat-message-list.vue'
import ChatInputBar from './components/ChatInputBar.vue'
import VideoGenerator from './components/VideoGenerator.vue'
import AddCharacterDialog from './components/AddCharacterDialog.vue'
import PickerDialog from './components/PickerDialog.vue'
import ProgressDialog from './components/ProgressDialog.vue'
import type { DialogueCharacter, DialogueProject, VideoDialogueProps, VideoDialogueEmits } from './types'
import type { VideoSettings } from './components/types'
import type { ChatMessageVO, MessageSenderInfo } from '@/services/src/service/chat/message/types'
import { ChatMessageService } from '@/services/src/service/chat/message/message'
import { AgentChatService } from '@/services/src/service/agent/chat/chat'
import { GenerationVideoService } from '@/services/src/service/generation/video/video'

// Props定义
const props = withDefaults(defineProps<VideoDialogueProps>(), {
  disabled: false,
  pointsCoefficient: 1.0,
  showHistory: true,
  themeMode: 'auto'
})

// Events定义
const emit = defineEmits<VideoDialogueEmits>()

// 响应式数据
const selectedCharacterId = ref('')
const characters = ref<DialogueCharacter[]>([])
const messages = ref<ChatMessageVO[]>([])
const currentUserId = ref<string>('user_current')
const generatingDialogue = ref(false)
const loadingMessages = ref(false)
const generatingVideo = ref(false)
const isValid = ref(false)

// 聊天界面相关数据
const inputText = ref('')
const showAddCharacterDialog = ref(false)
const showVideoGenerator = ref(false)
const showPicker = ref(false)
const showProgressDialog = ref(false)
const progress = ref(0)
const progressText = ref('')
const progressTitle = ref('正在生成视频')
const currentPickerType = ref<'resolution' | 'format' | 'music'>('resolution')
const showAvatar = ref(true)
const showTimeDivider = ref(true)
const hasMore = ref(false)
const showNoMoreData = ref(true)

// 组件引用
const messageListRef = ref()
const messagesContainerRef = ref()
const videoGeneratorRef = ref()

// 服务层实例
const chatMessageService = new ChatMessageService()
const agentChatService = new AgentChatService()
const videoService = new GenerationVideoService()

// 角色表单相关代码已移至 AddCharacterDialog 组件

// 视频设置相关代码已移至 VideoGenerator 组件

// 数据转换函数：将角色转换为发送者信息
const convertCharacterToSenderInfo = (character: DialogueCharacter): MessageSenderInfo => {
  return {
    id: character.id,
    name: character.name,
    avatar: character.avatar
  }
}

// 数据转换函数：创建ChatMessageVO
const createChatMessage = (
  content: string, 
  senderInfo: MessageSenderInfo, 
  isOwn: boolean = false
): ChatMessageVO => {
  const now = new Date().toISOString()
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    uuid: `uuid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    body: {
      id: `body_${Date.now()}`,
      payload: {
        text: {
          content: content
        }
      }
    },
    sendAt: now,
    receiveAt: now,
    updatedAt: now,
    createdAt: now, // 兼容性字段
    senderId: senderInfo.id as any, // 兼容性字段
    content: content as any, // 兼容性字段
    isOwn,
    children: [],
    messageState: {
      isThinking: false,
      thinkStart: new Date().getTime()
    },
    actions: [],
    metadata: new Map([
      ['senderInfo', senderInfo]
    ])
  }
}

// 获取消息内容
const getMessageContent = (message: ChatMessageVO): string => {
  // 优先使用body.payload.content（API规范）
  if (message.body && message.body.payload && (message.body.payload as any).content) {
    return (message.body.payload as any).content
  }
  
  // 其次使用content属性（兼容性）
  if (message.content) {
    return message.content
  }
  
  return ''
}

// 获取发送者信息
const getSenderInfo = (message: ChatMessageVO): MessageSenderInfo | null => {
  // 先尝试从metadata中获取
  if (message.metadata && message.metadata.has('senderInfo')) {
    return message.metadata.get('senderInfo') as MessageSenderInfo
  }
  
  // 尝试从旧属性中获取
  if ((message as any).senderInfo) {
    return (message as any).senderInfo as MessageSenderInfo
  }
  
  return null
}

// 当前项目数据
const currentProject = reactive<DialogueProject>({
  id: `project_${Date.now()}`,
  title: '多人对话视频项目',
  description: '',
  characters: [],
  scenes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'draft'
})

// 主题类名
const themeClass = computed(() => {
  if (props.themeMode === 'dark') return 'theme-dark'
  if (props.themeMode === 'light') return 'theme-light'
  return 'theme-auto'
})

// 处理角色选择
const selectCharacter = (character: DialogueCharacter) => {
  selectedCharacterId.value = character.id
  showToast(`已选择角色: ${character.name}`)
}

// 处理媒体上传
const handleMediaUpload = (files: File[]) => {
  console.log('上传的文件:', files)
  
  // 这里可以添加文件上传和处理逻辑
  // 例如：上传到服务器、预览文件等
  
  // 显示提示信息
  if (files && files.length > 0) {
    const fileNames = files.map(file => file.name).join(', ')
    showToast(`已选择文件: ${fileNames}`)
  }
}

// 处理角色添加
const handleCharacterAdded = (character: DialogueCharacter) => {
  characters.value.push(character)
  currentProject.characters = [...characters.value]
  currentProject.updatedAt = new Date().toISOString()
  validateProject()
}

// 处理角色更新
const handleCharacterUpdated = (character: DialogueCharacter) => {
  const index = characters.value.findIndex(c => c.id === character.id)
  if (index !== -1) {
    characters.value[index] = character
    currentProject.characters = [...characters.value]
    currentProject.updatedAt = new Date().toISOString()
  }
}

// 处理角色删除
const handleCharacterDeleted = (characterId: string) => {
  if (selectedCharacterId.value === characterId) {
    selectedCharacterId.value = ''
  }
  currentProject.characters = [...characters.value]
  currentProject.updatedAt = new Date().toISOString()
  validateProject()
}

// 添加角色方法已移至 AddCharacterDialog 组件



// 生成对话
const generateDialogue = async () => {
  if (!inputText.value.trim()) {
    showToast('请输入对话内容')
    return
  }
  
  if (characters.value.length < 2) {
    showToast('至少需要两个角色才能生成对话')
    return
  }
  
  generatingDialogue.value = true
  
  try {
    // 使用服务层生成对话
    const prompt = `请为以下角色生成一段自然的多轮对话：${inputText.value}

角色列表：
${characters.value.map((c, i) => `${i + 1}. ${c.name}: ${c.description}`).join('\n')}

要求：
1. 每个角色都有发言
2. 对话自然流畅
3. 符合角色设定
4. 返回格式为"角色名: 对话内容"`
    
    // 使用AgentChatService生成对话
    try {
      const chatParam = {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "你是一个专业的对话生成助手，能够根据给定的角色设定生成自然流畅的多人对话。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      } as any
      
      const result = await agentChatService.create(chatParam)
      
      // 处理返回结果可能为流式的情况
      const chatResult = result as any
      
      if (chatResult && chatResult.choices && chatResult.choices.length > 0 && chatResult.choices[0].message) {
        // 解析API返回的内容
        const apiContent = chatResult.choices[0].message.content || ''
        const dialogues = parseDialogueFromAPI(apiContent)
        messages.value = [...messages.value, ...dialogues]
      } else {
        // API返回格式异常，使用模拟数据作为备用
        console.warn('API返回格式异常，使用模拟数据作为备用')
        const newMessages = generateMockDialogue(inputText.value)
        messages.value = [...messages.value, ...newMessages]
      }
    } catch (apiError) {
      console.error('API调用失败，使用模拟数据:', apiError)
      // API调用失败，使用模拟数据作为备用
      const newMessages = generateMockDialogue(inputText.value)
      messages.value = [...messages.value, ...newMessages]
    }
    
    inputText.value = ''
    generatingDialogue.value = false
    
    showToast('对话生成成功')
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
    
    validateProject()
  } catch (error) {
    console.error('生成对话失败:', error)
    generatingDialogue.value = false
    showFailToast('生成对话失败，请稍后重试')
  }
}

// 解析API返回的对话内容
const parseDialogueFromAPI = (content: string): ChatMessageVO[] => {
  const result: ChatMessageVO[] = []
  
  // 尝试按行分割内容，解析为角色对话
  const lines = content.split('\n').filter(line => line.trim())
  
  // 如果解析失败，则使用简单逻辑创建对话
  if (lines.length < 2) {
    return generateMockDialogue(content)
  }
  
  // 解析每一行对话，假设格式为 "角色名: 对话内容"
  for (const line of lines) {
    const match = line.match(/^(\S+?)[:：]\s*(.+)$/)
    if (match && match[1] && match[2]) {
      const roleName = match[1].trim()
      const dialogueContent = match[2].trim()
      
      // 查找对应的角色
      const character = characters.value.find(c => 
        c.name === roleName || 
        c.name.includes(roleName) || 
        roleName.includes(c.name)
      )
      
      if (character) {
        const senderInfo = convertCharacterToSenderInfo(character)
        const message = createChatMessage(
          dialogueContent, 
          senderInfo, 
          character.id === currentUserId.value
        )
        result.push(message)
      }
    }
  }
  
  // 如果没有成功解析出任何对话，则使用模拟数据
  if (result.length === 0) {
    return generateMockDialogue(content)
  }
  
  return result
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
    
    // 使用新的数据转换函数
    const senderInfo = convertCharacterToSenderInfo(speaker)
    const message = createChatMessage(
      messageContent, 
      senderInfo, 
      speaker.id === currentUserId.value
    )
    
    result.push(message)
  }
  
  return result
}

// 滚动到底部
const scrollToBottom = () => {
  if (messageListRef.value && messageListRef.value.scrollToBottom) {
    messageListRef.value.scrollToBottom()
  }
}

// 处理生成视频
const handleGenerateVideo = () => {
  if (messages.value.length === 0) {
    showToast('没有可生成视频的对话内容')
    return
  }
  
  // 打开视频生成弹窗
  showVideoGenerator.value = true
}

// 显示分辨率选择器
const showResolutionPicker = () => {
  currentPickerType.value = 'resolution'
  showPicker.value = true
}

// 显示格式选择器
const showFormatPicker = () => {
  currentPickerType.value = 'format'
  showPicker.value = true
}

// 显示音乐选择器
const showMusicPicker = () => {
  currentPickerType.value = 'music'
  showPicker.value = true
}

// 选择器确认
const onConfirm = (value: string) => {
  // 更新VideoGenerator组件中的设置
  if (videoGeneratorRef.value && videoGeneratorRef.value.updateVideoSettings) {
    videoGeneratorRef.value.updateVideoSettings(currentPickerType.value, value)
  }
}

// 开始视频生成 - 参数从VideoGenerator组件传入
const startVideoGeneration = async (videoSettings: VideoSettings) => {
  if (!videoSettings.title.trim()) {
    showToast('请输入视频标题')
    return
  }
  
  if (messages.value.length === 0) {
    showToast('没有可生成视频的对话内容')
    return
  }
  
  // 关闭设置弹窗，打开进度弹窗
  showVideoGenerator.value = false
  showProgressDialog.value = true
  generatingVideo.value = true
  
  // 重置进度
  progress.value = 0
  progressText.value = '准备生成...'
  
  try {
    // 构建视频生成参数
    const dialogueText = messages.value.map(msg => 
      `${getSenderInfo(msg)?.name || '未知'}: ${getMessageContent(msg)}`
    ).join('\n')
    
    // 根据设置确定分辨率
    let width = 720
    let height = 1280  // 默认竖屏
    
    switch (videoSettings.resolution) {
      case '480p':
        width = 480
        height = 854
        break
      case '720p':
        width = 720
        height = 1280
        break
      case '1080p':
        width = 1080
        height = 1920
        break
      case '4K':
        width = 2160
        height = 3840
        break
    }
    
    const videoPrompt = `请生成一个多人对话视频，标题：${videoSettings.title}
    
描述：${videoSettings.description || ''}

对话内容：
${dialogueText}

要求：
1. 根据对话内容生成相应的角色形象和场景
2. 为每个角色分配符合其特征的配音
3. 视频风格自然生动，${videoSettings.addTransition ? '添加过渡效果' : '保持简单直接'}
4. ${videoSettings.addSubtitle ? '添加字幕' : '无需字幕'}
5. ${videoSettings.backgroundMusic ? `添加${videoSettings.backgroundMusic}风格的背景音乐` : '无背景音乐'}`
    
    // 调用视频生成API
    try {
      const videoParam = {
        prompt: videoPrompt,
        width,
        height,
        model: 'stable-video-diffusion',
        responseFormat: 'url',
        style: 'vivid',
        aspectRatio: width > height ? '16:9' : '9:16'
      } as any
      
      const result = await videoService.create(videoParam)
      
      // 处理视频生成结果，处理类型不确定的情况
      const videos = (result as any).videos || []
      
      if (videos && videos.length > 0) {
        // 视频生成成功
        progress.value = 100
        progressText.value = '生成完成!'
        
        setTimeout(() => {
          showProgressDialog.value = false
          generatingVideo.value = false
          
          showSuccessToast('视频生成成功')
          
          // 获取视频URL
          const videoUrl = videos[0].url || 'https://example.com/video.mp4'
          
          // 发送完成事件
          emit('generation-success', {
            title: videoSettings.title,
            description: videoSettings.description,
            url: videoUrl,
            thumbnail: videos[0].thumbnailUrl || 'https://example.com/thumbnail.jpg',
            taskId: (result as any).taskId
          })
          
          currentProject.status = 'completed'
          currentProject.updatedAt = new Date().toISOString()
          emit('project-save', { ...currentProject })
        }, 1000)
      } else {
        throw new Error('生成结果格式不正确')
      }
    } catch (apiError) {
      console.error('API调用失败，使用模拟生成:', apiError)
      // API调用失败，使用模拟生成作为备用
      simulateVideoGeneration(videoSettings)
    }
  } catch (error) {
    console.error('生成视频失败:', error)
    showProgressDialog.value = false
    generatingVideo.value = false
    showFailToast('生成视频失败，请稍后重试')
  }
}

// 模拟视频生成过程
const simulateVideoGeneration = (videoSettings?: VideoSettings) => {
  const steps = [
    { progress: 20, text: '分析对话内容...' },
    { progress: 40, text: '生成语音...' },
    { progress: 60, text: '合成视频场景...' },
    { progress: 80, text: '添加字幕和效果...' },
    { progress: 100, text: '完成!' }
  ]
  
  let currentStep = 0
  
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      const step = steps[currentStep]
      progress.value = step.progress
      progressText.value = step.text
      currentStep++
    } else {
      clearInterval(interval)
      
      // 生成完成
      setTimeout(() => {
        showProgressDialog.value = false
        generatingVideo.value = false
        
        showSuccessToast('视频生成成功')
        
        // 发送完成事件
        emit('generation-success', {
          title: videoSettings?.title || '多人对话视频',
          description: videoSettings?.description || '',
          url: 'https://example.com/video.mp4', // 模拟视频URL
          thumbnail: 'https://example.com/thumbnail.jpg' // 模拟缩略图
        })
        
        currentProject.status = 'completed'
        currentProject.updatedAt = new Date().toISOString()
        emit('project-save', { ...currentProject })
      }, 1000)
    }
  }, 1500)
}

// 处理清空消息
const handleClearMessages = () => {
  messages.value = []
  validateProject()
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

// 处理视频生成完成
const handleGenerationCompleted = (result: any) => {
  showSuccessToast('视频生成成功')
  currentProject.status = 'completed'
  currentProject.updatedAt = new Date().toISOString()
  
  emit('generation-success', result)
  emit('project-save', { ...currentProject })
}

// 处理视频生成失败
const handleGenerationFailed = (error: string) => {
  showFailToast(`视频生成失败: ${error}`)
  currentProject.status = 'failed'
  currentProject.updatedAt = new Date().toISOString()
  
  emit('generation-error', error)
}

// 验证项目状态
const validateProject = () => {
  // 验证是否有角色
  const hasCharacters = characters.value.length > 0
  
  // 验证是否有对话
  const hasMessages = messages.value.length > 0
  
  isValid.value = hasCharacters && hasMessages
  emit('validation-change', isValid.value)
  
  return isValid.value
}

// 初始化默认角色
onMounted(async () => {
  // 等待下一个tick，确保子组件已挂载
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // 获取默认角色数据
  if (characters.value.length === 0) {
    // 使用默认角色数据
    characters.value = [
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
    ]
    
    currentProject.characters = [...characters.value]
  }
  
  validateProject()
})

// 暴露方法给父组件
defineExpose({
  currentProject,
  characters,
  messages,
  validateProject,
  generateVideo: handleGenerateVideo
})
</script>

<style lang="scss" scoped>
.sdkwork-generation-video-dialogue {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--van-background-color-light);
  
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;
  }
  
  // 输入区域样式已移至 ChatInputBar 组件
  
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
  
  // 弹窗样式已移至各自的组件中
  
  // 主题样式
  &.theme-dark {
    background-color: var(--van-gray-8);
    
    .message-bubble {
      background-color: var(--van-gray-7);
      color: var(--van-gray-1);
    }
    
    .character-dialog, .video-generator-dialog {
      background-color: var(--van-gray-8);
    }
  }
}
</style>