<template>
    <div class="chat-input">
        <!-- 输入区域 -->
        <div class="input-area flex flex-row items-center">
            <!-- 左侧语音按钮 -->
            <div class="input-left ">
                <button v-if="enableVoice" class="tool-button" @click="toggleVoiceInput">
                    <Icon v-if="isVoiceInput" icon="mdi:microphone" width="18" height="18" class="voice-active-icon" />
                    <Icon v-else icon="mdi:microphone-outline" width="18" height="18" class="voice-icon" />
                </button>
            </div>

            <!-- 主输入区域 -->
            <div class="input-main">
                <!-- 文本输入模式 -->
                <ChatInputTextArea v-if="!isVoiceInput" v-model="inputText" :placeholder="placeholder"
                    :max-length="maxLength" :enable-emoji="enableEmoji" @text-change="handleTextChange"
                    @keydown="handleKeyDown" @keyup="handleKeyUp" @keypress="handleKeyPress"
                    @focus="() => emitEvent(ChatInputEventType.INPUT_FOCUS)"
                    @blur="() => emitEvent(ChatInputEventType.INPUT_BLUR)" @input-event="handleInputEvent"
                    @composition-start="handleCompositionStart" @composition-update="handleCompositionUpdate"
                    @composition-end="handleCompositionEnd" @scroll="handleScroll" @paste="handlePaste" @cut="handleCut"
                    @copy="handleCopy" @selection-change="handleSelectionChange"
                    @toggle-emoji-panel="toggleEmojiPanel" />

                <!-- 语音输入模式 -->
                <ChatInputVoice v-else @start-recording="startVoiceRecording" @stop-recording="stopVoiceRecording" />
            </div>

            <!-- 右侧工具栏 -->
            <div class="input-right">
                <!-- 工具按钮 -->
                <button class="tool-button" :class="{ active: showToolPanel }" @click="toggleToolPanel">
                    <Icon icon="mdi:plus" width="18" height="18" class="tool-icon" />
                </button>

                <!-- 发送按钮 - 仅在非语音输入模式下显示 -->
                <ChatInputSendButton v-if="!isVoiceInput" :can-send="canSend" @send="handleSend" />
            </div>
        </div>

        <!-- 底部面板区域 -->
        <div class="bottom-panels">
            <!-- 工具面板 -->
            <div v-if="showToolPanel" class="tool-panel">
                <ChatInputToolPanel @select-tool="handleToolSelect" @send-image="handleImageUpload"
                    @send-file="handleFileUpload" @send-video="handleVideoUpload"
                    @send-rtc-request="(type, targetUserId) => emitEvent(ChatInputEventType.SEND_RTC_REQUEST, { type, targetUserId })"
                    @send-location="(latitude, longitude, address) => emitEvent(ChatInputEventType.SEND_LOCATION, { latitude, longitude, address })" />
            </div>

            <!-- 表情面板 -->
            <ChatInputEmojiPanel v-if="showEmojiPanel && enableEmoji" @select-emoji="insertEmoji" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import type { ChatMessageVO } from '@/services'
import { AudioFormat, ChatContext, Message, MessageType } from 'sdkwork-sdk-api-typescript'
import { useAuthStore } from '@/stores/modules/auth'
import {
    ChatInputEventType,
    ChatInputEventData,
    SendMessagePayload,
    SendVoicePayload,
    SendFilePayload,
    SendRtcRequestPayload,
    SendLocationPayload,
    TextChangePayload,
    UploadProgressPayload
} from '@/stores/modules/chat/types'
import { MessageBuilder, type MessageBuilderConfig } from '@/services/message/builder'
import type { UploadRequestParam, UploadResponse, UploadProgress } from '@/core/upload/types'
import { useConversationStore } from '@/stores/modules/conversation'

import ChatInputToolPanel from './chat-input-tool-panel/chat-input-tool-panel.vue'
import ChatInputTextArea from './components/chat-input-text-area.vue'
import ChatInputVoice from './components/chat-input-voice.vue'
import ChatInputSendButton from './components/chat-input-send-button.vue'
import ChatInputEmojiPanel from './components/chat-input-emoji-panel.vue'
import { useMessageStore } from '@/stores/modules/message'
import { AudioUtils } from '@/core/audio/utils/AudioUtils'

interface Props {
    placeholder?: string
    maxLength?: number
    disabled?: boolean
    enableVoice?: boolean
    enableEmoji?: boolean
    enableFileUpload?: boolean
    enableCamera?: boolean
    currentUserId?: string
    conversationId?: string
    allowedFileTypes?: string[]
    allowMultipleFiles?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: '输入消息...',
    maxLength: 1000,
    disabled: false,
    enableVoice: true,
    enableEmoji: true,
    enableFileUpload: true,
    enableCamera: true,
    allowedFileTypes: () => ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx'],
    allowMultipleFiles: false
})

interface Emits {
    'chat-input-event': [event: ChatInputEventData]
    'send': [message: Message]
}

const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const conversationStore = useConversationStore()
const messageStore = useMessageStore()

// 响应式数据
const inputText = ref('')
const showToolPanel = ref(false)
const showEmojiPanel = ref(false)
const isVoiceInput = ref(false)
const isRecording = ref(false)
const recordingStartTime = ref(0)
const lastScrollTop = ref(0)
const keyboardVisible = ref(false)
const keyboardHeight = ref(0)

// 计算属性
const canSend = computed(() => {
    return inputText.value.trim().length > 0 || isRecording.value
})

/**
 * 统一的事件发射函数
 */
const emitEvent = (type: ChatInputEventType, payload?: any, metadata?: Record<string, any>) => {
    const eventData: ChatInputEventData = {
        type,
        payload,
        timestamp: Date.now(),
        metadata
    }
    emit('chat-input-event', eventData)
}

/**
 * 创建聊天上下文
 */
const createChatContext = (): ChatContext => {
    const currentConversation = conversationStore.currentConversation
    const message = messageStore.lastMessage

    return {
        conversation_id: currentConversation?.id || props.conversationId || '' as any,
        user_id: authStore.currentUser?.id as any,
        knowledge_base_id: currentConversation?.knowledgeBaseId || '',
        agent_id: currentConversation?.agentId || '',
        datasource_id: currentConversation?.dataSourceId || '' as any,
        parent_message_id: message?.id as any,
        save_audio: false
    }
}

// 方法
const handleTextChange = (text: string) => {
    inputText.value = text
    emitEvent(ChatInputEventType.TEXT_CHANGE, { text })
}

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSend()
    }

    // 发射键盘按下事件
    emitEvent(ChatInputEventType.KEY_DOWN, {
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
        shiftKey: event.shiftKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        event: event
    })
}

const handleKeyUp = (event: KeyboardEvent) => {
    emitEvent(ChatInputEventType.KEY_UP, {
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
        shiftKey: event.shiftKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        event: event
    })
}

const handleKeyPress = (event: KeyboardEvent) => {
    emitEvent(ChatInputEventType.KEY_PRESS, {
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
        shiftKey: event.shiftKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        event: event
    })
}

const handleInputEvent = (event: InputEvent) => {
    emitEvent(ChatInputEventType.INPUT, {
        value: inputText.value,
        inputType: event.inputType,
        data: event.data,
        event: event
    })
}

const handleCompositionStart = (event: CompositionEvent) => {
    emitEvent(ChatInputEventType.COMPOSITION_START, {
        data: event.data,
        event: event
    })
}

const handleCompositionUpdate = (event: CompositionEvent) => {
    emitEvent(ChatInputEventType.COMPOSITION_UPDATE, {
        data: event.data,
        event: event
    })
}

const handleCompositionEnd = (event: CompositionEvent) => {
    emitEvent(ChatInputEventType.COMPOSITION_END, {
        data: event.data,
        event: event
    })
}

const handleScroll = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight

    // 检测滚动方向
    const scrollDirection = scrollTop > (lastScrollTop.value || 0) ? 'down' : 'up'
    lastScrollTop.value = scrollTop

    emitEvent(ChatInputEventType.SCROLL, {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollDirection,
        event: event
    })

    // 检测是否滚动到顶部或底部
    if (scrollTop === 0) {
        emitEvent(ChatInputEventType.SCROLL_TOP, {
            scrollTop,
            scrollHeight,
            clientHeight,
            event: event
        })
    }

    if (scrollTop + clientHeight >= scrollHeight - 10) { // 10px 容差
        emitEvent(ChatInputEventType.SCROLL_BOTTOM, {
            scrollTop,
            scrollHeight,
            clientHeight,
            event: event
        })
    }
}

const handlePaste = (event: ClipboardEvent) => {
    const data = event.clipboardData?.getData('text') || ''
    emitEvent(ChatInputEventType.PASTE, {
        data,
        type: 'paste',
        event: event
    })
}

const handleCut = (event: ClipboardEvent) => {
    const data = event.clipboardData?.getData('text') || ''
    emitEvent(ChatInputEventType.CUT, {
        data,
        type: 'cut',
        event: event
    })
}

const handleCopy = (event: ClipboardEvent) => {
    const data = event.clipboardData?.getData('text') || ''
    emitEvent(ChatInputEventType.COPY, {
        data,
        type: 'copy',
        event: event
    })
}

const handleSelectionChange = () => {
    const textarea = document.querySelector('.text-input') as HTMLTextAreaElement
    if (textarea) {
        emitEvent(ChatInputEventType.SELECTION_CHANGE, {
            selectionStart: textarea.selectionStart,
            selectionEnd: textarea.selectionEnd,
            selectedText: textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)
        })
    }
}

// 键盘显示/隐藏检测
const detectKeyboardVisibility = () => {
    if (typeof window === 'undefined') return

    const viewportHeight = window.innerHeight
    const documentHeight = document.documentElement.clientHeight

    // 如果视口高度明显小于文档高度，说明键盘显示
    const isKeyboardVisible = viewportHeight < documentHeight - 100

    if (isKeyboardVisible !== keyboardVisible.value) {
        keyboardVisible.value = isKeyboardVisible
        keyboardHeight.value = Math.max(0, documentHeight - viewportHeight)

        emitEvent(isKeyboardVisible ? ChatInputEventType.KEYBOARD_SHOW : ChatInputEventType.KEYBOARD_HIDE, {
            keyboardHeight: keyboardHeight.value,
            viewportHeight: viewportHeight,
            isVisible: isKeyboardVisible
        })
    }
}

// 监听窗口大小变化（用于检测键盘显示/隐藏）
const handleResize = () => {
    detectKeyboardVisibility()
}

// 组件挂载时添加监听
onMounted(() => {
    window.addEventListener('resize', handleResize)
    // 初始检测
    detectKeyboardVisibility()
})

// 组件卸载时移除监听
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

const toggleToolPanel = () => {
    showToolPanel.value = !showToolPanel.value
    showEmojiPanel.value = false
}

const toggleVoiceInput = () => {
    isVoiceInput.value = !isVoiceInput.value
    showToolPanel.value = false
    showEmojiPanel.value = false
}

const toggleEmojiPanel = () => {
    showEmojiPanel.value = !showEmojiPanel.value
    showToolPanel.value = false
}

const insertEmoji = (emoji: string) => {
    inputText.value += emoji
    emitEvent(ChatInputEventType.TEXT_CHANGE, { text: inputText.value })
}

const handleSend = async () => {
    if (!canSend.value) return

    const trimmedText = inputText.value.trim()
    if (trimmedText) {
        try {
            // 创建消息配置
            const config: MessageBuilderConfig = {
                messageType: MessageType.TEXT,
                context: createChatContext()
            }

            // 使用MessageBuilder创建消息
            const message = MessageBuilder.createTextMessage({
                content: trimmedText
            }, config)

            // 发射send事件
            emit('send', message)

            // 同时发射chat-input-event事件保持兼容性
            emitEvent(ChatInputEventType.SEND_MESSAGE, {
                message: {
                    senderId: authStore.currentUser?.id || '',
                    receiverId: '', // 应该从上下文获取
                    content: trimmedText,
                    type: MessageType.TEXT
                }
            })

            inputText.value = ''
            emitEvent(ChatInputEventType.TEXT_CHANGE, { text: '' })
        } catch (error) {
            console.error('发送消息失败:', error)
            // 可以添加错误处理逻辑，如显示错误提示
        }
    }
}

const startVoiceRecording = () => {
    isRecording.value = true
    recordingStartTime.value = Date.now()
    // 这里应该开始实际的录音逻辑
}

const stopVoiceRecording = async (audioData: Blob | ArrayBuffer, duration: number) => {
    if (!isRecording.value) return
    isRecording.value = false

    try {
        // 创建消息配置
        const config: MessageBuilderConfig = {
            messageType: MessageType.AUDIO,
            context: createChatContext()
        }

        let message: Message

        try {
            // 尝试上传音频文件并获取URL
            const audioUrl = await uploadFile(audioData, 'audio/wav')

            // 使用MessageBuilder创建音频消息（URL方式）
            message = MessageBuilder.createAudioMessageByUrl({
                url: audioUrl,
                duration: duration,
                format: AudioFormat.wav
            }, {
                ...config,
            })
        } catch (uploadError) {
            console.warn('音频上传失败，使用ArrayBuffer方式创建消息:', uploadError)

            // 上传失败时，使用ArrayBuffer方式创建消息 
            message = MessageBuilder.createAudioMessage({
                file: audioData,
                duration: duration,
                format: AudioFormat.wav
            }, {
                ...config
            })
        }

        // 发射send事件
        emit('send', message)

        // 同时发射chat-input-event事件保持兼容性
        emitEvent(ChatInputEventType.SEND_VOICE, { data: audioData, duration })
    } catch (error) {
        console.error('发送语音消息失败:', error)
    }
}

const handleToolSelect = (tool: string) => {
    console.log('选择工具:', tool)
    // 处理工具选择
}

/**
 * 使用window.$uploader上传文件
 * 获取文件或音频的URL
 */
const uploadFile = async (fileData: File | Blob | ArrayBuffer, mimeType?: string): Promise<string> => {
    // 检查上传器是否可用
    if (!window.$uploader) {
        throw new Error('上传器未初始化，请确保window.$uploader = createUploader()已执行')
    }

    // 预处理文件数据
    const { fileToUpload, fileName, fileSize, detectedFormat } = await preprocessFileData(fileData, mimeType)
    
    // 确定contentType的优先级：传入的mimeType > 文件自身的type > 默认值
    const contentType = determineContentType(mimeType, fileToUpload.type)
    
    // 创建上传参数
    const uploadParam: UploadRequestParam = {
        file: fileToUpload,
        name: fileName,
        scene: 'chat-message',
        contentType,
        acl: 'public-read', // 聊天消息文件通常设置为公开可读
        metadata: {
            uploadTime: Date.now().toString(),
            source: 'chat-input',
            conversationId: props.conversationId || 'unknown',
            originalMimeType: mimeType as any,
            detectedFormat
        }
    }

    try {
        // 使用window.$uploader进行上传
        const response: UploadResponse = await window.$uploader.upload(uploadParam, (progress: UploadProgress) => {
            // 上传进度回调
            console.log(`上传进度: ${progress.percentage}%`)

            // 发射上传进度事件
            emitEvent(ChatInputEventType.UPLOAD_PROGRESS, {
                fileName,
                format: detectedFormat,
                progress: progress.percentage,
                loaded: progress.loaded,
                total: progress.total,
                contentType
            })
        })

        console.log('文件上传成功:', response.url)
        return response.url

    } catch (error) {
        console.error('文件上传失败:', error)
        throw new Error(`文件上传失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
}

/**
 * 预处理文件数据，统一转换为可上传的格式
 */
const preprocessFileData = async (fileData: File | Blob | ArrayBuffer, mimeType?: string) => {
    let fileToUpload: File | Blob
    let fileName: string
    let fileSize: number
    let detectedFormat = 'unknown'

    if (fileData instanceof File) {
        // 处理File对象
        fileToUpload = fileData
        fileName = fileData.name
        fileSize = fileData.size
        detectedFormat = getFileFormatFromName(fileName) || getFormatFromMimeType(fileData.type) as any
        console.log('上传文件:', fileName, '大小:', fileSize, '类型:', fileData.type, '格式:', detectedFormat)
    } else if (fileData instanceof Blob) {
        // 处理Blob对象
        detectedFormat = AudioUtils.detectAudioFormat(fileData) || getFormatFromMimeType(fileData.type)
        
        // 特殊处理PCM音频格式
        if (detectedFormat === 'pcm' || fileData.type === 'audio/pcm') {
            console.log('检测到PCM格式音频，转换为WAV格式')
            const arrayBuffer = await AudioUtils.blobToArrayBuffer(fileData)
            fileToUpload = AudioUtils.pcmToWav(arrayBuffer, 16000, 1, 16)
            detectedFormat = 'wav'
        } else {
            fileToUpload = fileData
        }
        
        fileName = `audio_${Date.now()}.${detectedFormat}`
        fileSize = fileToUpload.size
        console.log('上传Blob数据，类型:', mimeType, '格式:', detectedFormat)
    } else {
        // 处理ArrayBuffer
        fileToUpload = new Blob([fileData], { type: mimeType || 'application/octet-stream' })
        fileName = `file_${Date.now()}.dat`
        fileSize = fileToUpload.size
        detectedFormat = getFormatFromMimeType(mimeType) || 'binary'
        console.log('上传ArrayBuffer数据，类型:', mimeType, '格式:', detectedFormat)
    }

    return { fileToUpload, fileName, fileSize, detectedFormat }
}

/**
 * 确定contentType的优先级
 */
const determineContentType = (mimeType?: string, fileType?: string): string => {
    // 优先级：传入的mimeType > 文件自身的type > 默认值
    if (mimeType && mimeType !== 'application/octet-stream') {
        return mimeType
    }
    
    if (fileType && fileType !== 'application/octet-stream') {
        return fileType
    }
    
    // 默认值
    return 'application/octet-stream'
}

/**
 * 从文件名获取文件格式
 */
const getFileFormatFromName = (fileName: string): string | null => {
    const match = fileName.match(/\.([a-zA-Z0-9]+)$/)
    return match ? match[1].toLowerCase() : null
}

/**
 * 从MIME类型获取文件格式
 */
const getFormatFromMimeType = (mimeType?: string): string | null => {
    if (!mimeType) return null
    
    const mimeToFormat: Record<string, string> = {
        'audio/wav': 'wav',
        'audio/mp3': 'mp3',
        'audio/mpeg': 'mp3',
        'audio/ogg': 'ogg',
        'audio/flac': 'flac',
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'video/mp4': 'mp4',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
    }
    
    return mimeToFormat[mimeType] || null
}

/**
 * 处理文件上传
 */
const handleFileUpload = async (file: File) => {
    try {
        // 上传文件并获取URL
        const fileUrl = await uploadFile(file)

        // 创建消息配置
        const config: MessageBuilderConfig = {
            messageType: MessageType.FILE,
            context: createChatContext()
        }

        // 使用MessageBuilder创建文件消息
        const message = MessageBuilder.createFileMessageByUrl({ url: fileUrl, name: file.name, size: file.size }, config)

        // 发射send事件
        emit('send', message)

        // 同时发射chat-input-event事件保持兼容性
        emitEvent(ChatInputEventType.SEND_FILE, { file, fileType: 'file' })
    } catch (error) {
        console.error('发送文件消息失败:', error)
    }
}

/**
 * 处理图片上传
 */
const handleImageUpload = async (file: File) => {
    try {
        // 上传图片并获取URL
        const imageUrl = await uploadFile(file)

        // 创建消息配置
        const config: MessageBuilderConfig = {
            messageType: MessageType.IMAGE,
            context: createChatContext()
        }

        // 使用MessageBuilder创建图片消息
        const message = MessageBuilder.createImageMessageByUrl({
            url: imageUrl,
            name: file.name,
            size: file.size
        }, config)

        // 发射send事件
        emit('send', message)

        // 同时发射chat-input-event事件保持兼容性
        emitEvent(ChatInputEventType.SEND_IMAGE, { file, fileType: 'image' })
    } catch (error) {
        console.error('发送图片消息失败:', error)
    }
}

/**
 * 处理视频上传
 */
const handleVideoUpload = async (file: File) => {
    try {
        // 上传视频并获取URL
        const videoUrl = await uploadFile(file)

        // 创建消息配置
        const config: MessageBuilderConfig = {
            messageType: MessageType.VIDEO,
            context: createChatContext()
        }

        // 使用MessageBuilder创建视频消息
        const message = MessageBuilder.createVideoMessageByUrl({
            url: videoUrl,
            name: file.name,
            size: file.size,
        }, config)

        // 发射send事件
        emit('send', message)

        // 同时发射chat-input-event事件保持兼容性
        emitEvent(ChatInputEventType.SEND_VIDEO, { file, fileType: 'video' })
    } catch (error) {
        console.error('发送视频消息失败:', error)
    }
}

</script>

<style scoped>
.chat-input {
    background-color: #fff;
    border-top: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
}

.input-area {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 12px;
    flex-shrink: 0;
}

.input-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-main {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.input-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.tool-button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background-color: #f8f9fa;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.tool-button:hover {
    background-color: #e9ecef;
    transform: scale(1.05);
}

.tool-icon,
.voice-icon,
.voice-active-icon,
.emoji-icon {
    font-size: 18px;
}

.voice-active-icon {
    color: #ff4444;
}

.emoji-icon {
    transition: transform 0.2s ease;
}

.tool-button.active .emoji-icon {
    transform: scale(1.1);
    filter: brightness(1.2);
}

.bottom-panels {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
}

.tool-panel {
    background-color: #fff;
    border-top: 1px solid #e0e0e0;
    padding: 0;
    height: auto;
    /* 自动高度，确保所有内容可见 */
    overflow: visible;
    /* 允许内容正常显示 */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
    animation: slideUp 0.3s ease;
}

.tool-button.active {
    background-color: #007bff;
    color: white;
}

.tool-button.active .tool-icon,
.tool-button.active .emoji-icon {
    filter: brightness(0) invert(1);
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* 移动端适配 */
@media (max-width: 768px) {
    .input-area {
        padding: 8px;
    }

    .tool-button {
        width: 36px;
        height: 36px;
    }

    .tool-panel {
        height: auto;
        /* 移动端也使用自动高度 */
    }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
    .chat-input {
        background-color: #2d2d2d;
        border-top-color: #404040;
    }

    .tool-button {
        background-color: #3a3a3a;
    }

    .tool-button:hover {
        background-color: #4a4a4a;
    }

    .tool-panel {
        background-color: #2d2d2d;
        border-top-color: #404040;
    }
}
</style>