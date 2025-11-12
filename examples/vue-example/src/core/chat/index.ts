/**
 * Chat消息处理工具类 - 实现ChatMessageVO的通用处理方法
 * 提供统一的Chat消息处理API，包括获取文本内容、消息体、载荷等
 * 基于sdkwork-sdk-api-typescript中的MessageBody和MsgPayload类型
 */

import type { ChatMessageVO } from '@/services'
import {
    type MessageBody,
    type MsgPayload,
    type BaseMsgContent,
    MessageStatus,
    type ChatCompletion,
    type ChatCompletionChunk,
    AudioFormat,
    Message
} from 'sdkwork-sdk-api-typescript'

class ChatMessageProcessor {
    messageToVO(message: Message): ChatMessageVO {
        // 基础字段映射
        const chatMessageVO: ChatMessageVO = {
            uuid: message.uuid || '',
            children: [],
            conversationId: message.conversationId,
            groupId: message.groupId,
            receiver: message.receiver,
            sender: message.sender,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            type: message.type,
            body: message.body,
            channelClientMsgId: (message.id || message.msgId) as any,
            channelMsgId: message.msgId, 
            
            // ChatMessageVO 特有字段初始化
            reasoning_content: undefined,
            messageState: undefined,
            actions: [],
            
            // ChatMessageResponse 基础字段初始化
            errorCode: undefined,
            receiveAt: undefined,
            modelId: undefined,
            role: undefined,
            metadata: undefined,
            sendAt: undefined,
            model: undefined,
            chatOptions: undefined,
            parentMessageId: undefined,
            temperature: undefined,
            receiverId: undefined,
            isError: false,
            senderId: undefined,
            usedRag: undefined,
            processingTime: undefined,
            userId: undefined,
            readAt: undefined,
            tokenCount: undefined,
            errorMessage: undefined,
            status: undefined
        };

        // 处理 receiverId 和 senderId
        if (message.receiver?.id) {
            chatMessageVO.receiverId = message.receiver.id;
        }
        if (message.sender?.id) {
            chatMessageVO.senderId = message.sender.id as any;
        }

        // 处理 userId（优先使用 sender.id，如果没有则使用 receiver.id）
        if (message.sender?.id) {
            chatMessageVO.userId = message.sender.id;
        } else if (message.receiver?.id) {
            chatMessageVO.userId = message.receiver.id;
        }

        return chatMessageVO;
    }
    /**
     * 将ChatMessageVO转换为Message对象
     * @param messageVO ChatMessageVO实例
     * @returns Message对象
     */
    voToMessage(messageVO: ChatMessageVO): Message {
        // 基础字段映射
        const message: Message = {
            uuid: messageVO.uuid || '',
            conversationId: messageVO.conversationId,
            groupId: messageVO.groupId,
            receiver: messageVO.receiver,
            sender: messageVO.sender,
            createdAt: messageVO.createdAt,
            updatedAt: messageVO.updatedAt,
            type: messageVO.type,
            body: messageVO.body,
            id: messageVO.channelClientMsgId as string,
            msgId: messageVO.channelMsgId
        };

        // 处理 receiver 和 sender 对象
        if (messageVO.receiverId && !message.receiver) {
            message.receiver = { id: messageVO.receiverId };
        }
        if (messageVO.senderId && !message.sender) {
            message.sender = { id: messageVO.senderId };
        }

        // 处理 userId（如果存在）
        if (messageVO.userId) {
            if (!message.sender) {
                message.sender = { id: messageVO.userId };
            } else if (!message.sender.id) {
                message.sender.id = messageVO.userId;
            }
        }

        return message;
    }

    /**
     * 获取消息的文本内容
     * @param message ChatMessageVO实例
     * @returns 消息的文本内容
     */
    getText(message: ChatMessageVO): string {
        if (!message) return ''

        // 如果content是字符串，直接返回
        if (typeof message.body === 'string') {
            return message.body
        }

        // 调用getBody获取消息体
        const messageBody = this.getBody(message)

        // 如果messageBody存在，使用getTextFromBody获取文本内容
        if (messageBody) {
            const textFromBody = this.getTextFromBody(messageBody)
            if (textFromBody) {
                return textFromBody
            }
        }

        // 最后尝试转换为字符串
        // JSON.stringify({
        //     type: message.type,
        //     id: message.id,
        //     channelClientMsgId: message.channelClientMsgId
        // })
        return ''
    }

    /**
     * 获取消息体
     * @param message ChatMessageVO实例
     * @returns 消息体对象
     */
    getBody(message: ChatMessageVO): MessageBody | null {
        if (!message) return null

        const body = message.body

        // 如果content是MessageBody对象，直接返回
        if (body && typeof body === 'object') {
            return body as MessageBody
        }

        // 如果content是字符串，返回null（需要根据业务逻辑处理）
        return null
    }

    /**
     * 从消息体中获取载荷
     * @param messageBody 消息体对象
     * @returns 消息载荷对象
     */
    getPayloadFromBody(messageBody: MessageBody | null): MsgPayload | null {
        if (!messageBody) return null
        return messageBody.payload || null
    }

    /**
     * 从载荷中获取文本内容
     * @param payload 消息载荷对象
     * @returns 文本内容
     */
    getTextFromPayload(payload: MsgPayload | null): string {
        if (!payload) return ''

        // 优先从payload.text获取文本内容
        if (payload.text?.content) {
            return payload.text.content
        } 

        // 从payload的其他类型获取内容
        if (payload.audio?.content) return payload.audio.content
        if (payload.video?.content) return payload.video.content
        if (payload.file?.content) return payload.file.content
        if (payload.music?.content) return payload.music.content
        if (payload.image?.content) return payload.image.content
        if (payload.location?.content) return payload.location.content

        return ''
    }

    /**
     * 从消息体中获取文本内容
     * @param messageBody 消息体对象
     * @returns 文本内容
     */
    getTextFromBody(messageBody: MessageBody | null): string {
        if (!messageBody) return ''

        // 首先尝试从payload获取文本内容
        const payload = this.getPayloadFromBody(messageBody)
        const textFromPayload = this.getTextFromPayload(payload)
        if (textFromPayload) {
            return textFromPayload
        }

        // 如果payload中没有内容，检查completion
        if (messageBody.completion) {
            const textFromCompletion = this.getTextFromCompletion(messageBody.completion)
            if (textFromCompletion) {
                return textFromCompletion
            }
        }

        // 如果completion也没有内容，检查groups
        if (messageBody.groups) {
            const textFromGroups = this.getTextFromGroups(messageBody.groups)
            if (textFromGroups) {
                return textFromGroups
            }
        }

        // 最后尝试转换为字符串
        return ''
    }

    /**
     * 从ChatCompletion中获取文本内容
     * @param completion ChatCompletion对象
     * @returns 文本内容
     */
    getTextFromCompletion(completion: ChatCompletion | null): string {
        if (!completion) return ''

        // 从choices中获取文本内容
        if (completion.choices && completion.choices.length > 0) {
            const content = completion.choices[0]?.message?.content
            if (content) {
                return content
            }
        }

        return ''
    }

    /**
     * 从groups中获取文本内容
     * @param groups groups对象
     * @returns 文本内容
     */
    getTextFromGroups(groups: Map<string, Array<ChatCompletionChunk>> | null): string {
        if (!groups) return ''

        const texts: string[] = []

        // 遍历groups的所有values
        for (const chunks of groups.values()) {
            if (chunks && chunks.length > 0) {
                // 遍历每个chunk数组
                for (const chunk of chunks) {
                    if (chunk.choices && chunk.choices.length > 0) {
                        // 从每个choice的delta中获取content
                        const content = chunk.choices[0]?.delta?.content
                        if (content) {
                            texts.push(content)
                        }
                    }
                }
            }
        }

        // 将所有文本内容连接起来
        return texts.join('')
    }

    /**
     * 获取消息载荷
     * @param message ChatMessageVO实例
     * @returns 消息载荷对象
     */
    getPayload(message: ChatMessageVO): MsgPayload | null {
        if (!message) return null

        const body = message.body

        // 如果content是MessageBody对象，返回payload
        if (body && typeof body === 'object') {
            const messageBody = body as MessageBody
            return this.getPayloadFromBody(messageBody)
        }

        return null
    }

    /**
     * 获取消息载荷内容
     * @param message ChatMessageVO实例
     * @returns 消息载荷的内容部分
     */
    getPayloadContent(message: ChatMessageVO): string {
        return this.getText(message)
    }

    /**
     * 检查消息是否包含错误
     * @param message ChatMessageVO实例
     * @returns 是否包含错误
     */
    hasError(message: ChatMessageVO): boolean {
        return message.isError === true || !!message.errorCode || !!message.errorMessage
    }

    /**
     * 获取消息状态文本
     * @param message ChatMessageVO实例
     * @returns 状态文本描述
     */
    getStatusText(message: ChatMessageVO): string {
        if (!message.status) return '未知'

        const statusMap: Record<string, string> = {
            'SENDING': '发送中',
            'SENT': '已发送',
            'DELIVERED': '已送达',
            'READ': '已读',
            'FAILED': '发送失败',
            'PENDING': '待处理',
            'PROCESSING': '处理中',
            'COMPLETED': '已完成',
            'ERROR': '错误'
        }

        return statusMap[message.status] || message.status
    }

    /**
     * 获取消息类型文本
     * @param message ChatMessageVO实例
     * @returns 类型文本描述
     */
    getTypeText(message: ChatMessageVO): string {
        if (!message.type) return '未知'

        const typeMap: Record<string, string> = {
            'TEXT': '文本',
            'IMAGE': '图片',
            'VIDEO': '视频',
            'AUDIO': '音频',
            'FILE': '文件',
            'SYSTEM': '系统',
            'NOTIFICATION': '通知',
            'COMMAND': '命令'
        }

        return typeMap[message.type] || message.type
    }

    /**
     * 获取消息角色文本
     * @param message ChatMessageVO实例
     * @returns 角色文本描述
     */
    getRoleText(message: ChatMessageVO): string {
        if (!message.role) return '未知'

        const roleMap: Record<string, string> = {
            'USER': '用户',
            'ASSISTANT': '助手',
            'SYSTEM': '系统',
            'FUNCTION': '函数'
        }

        return roleMap[message.role] || message.role
    }

    /**
     * 格式化消息创建时间
     * @param message ChatMessageVO实例
     * @param format 时间格式，默认'YYYY-MM-DD HH:mm:ss'
     * @returns 格式化后的时间字符串
     */
    formatCreatedAt(message: ChatMessageVO, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
        if (!message.createdAt) return ''

        try {
            // 使用Date对象处理日期格式
            const date = new Date(message.createdAt)
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        } catch (error) {
            console.error('格式化消息创建时间失败:', error)
            return message.createdAt
        }
    }

    /**
     * 格式化消息更新时间
     * @param message ChatMessageVO实例
     * @param format 时间格式，默认'YYYY-MM-DD HH:mm:ss'
     * @returns 格式化后的时间字符串
     */
    formatUpdatedAt(message: ChatMessageVO, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
        if (!message.updatedAt) return ''

        try {
            // 使用Date对象处理日期格式
            const date = new Date(message.updatedAt)
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        } catch (error) {
            console.error('格式化消息更新时间失败:', error)
            return message.updatedAt
        }
    }

    /**
     * 检查消息是否属于当前用户
     * @param message ChatMessageVO实例
     * @param currentUserId 当前用户ID
     * @returns 是否属于当前用户
     */
    isOwnMessage(message: ChatMessageVO, currentUserId: string | number): boolean {
        return message.userId === currentUserId || message.role === 'USER'
    }

    /**
     * 获取消息的显示名称
     * @param message ChatMessageVO实例
     * @param currentUserId 当前用户ID
     * @returns 显示名称
     */
    getDisplayName(message: ChatMessageVO, currentUserId: string | number): string {
        if (this.isOwnMessage(message, currentUserId)) {
            return '我'
        }

        return this.getRoleText(message)
    }

    /**
     * 检查消息是否可重试
     * @param message ChatMessageVO实例
     * @returns 是否可重试
     */
    canRetry(message: ChatMessageVO): boolean {
        return message.status === 'FAILED' || this.hasError(message)
    }

    /**
     * 检查消息是否正在发送
     * @param message ChatMessageVO实例
     * @returns 是否正在发送
     */
    isSending(message: ChatMessageVO): boolean {
        return message.status === MessageStatus.DEFAULT || message.status === MessageStatus.PROCESSING

    }

    /**
     * 检查消息是否已发送成功
     * @param message ChatMessageVO实例
     * @returns 是否已发送成功
     */
    isSent(message: ChatMessageVO): boolean {
        return message.status === 'SENT' || message.status === 'DELIVERED' || message.status === 'READ'
    }

    /**
     * 获取消息的处理时间（毫秒）
     * @param message ChatMessageVO实例
     * @returns 处理时间（毫秒）
     */
    getProcessingTimeMs(message: ChatMessageVO): number {
        if (typeof message.processingTime === 'number') {
            return message.processingTime
        }

        if (typeof message.processingTime === 'string') {
            const time = parseFloat(message.processingTime)
            return isNaN(time) ? 0 : time
        }

        return 0
    }

    /**
     * 获取消息的处理时间文本
     * @param message ChatMessageVO实例
     * @returns 处理时间文本
     */
    getProcessingTimeText(message: ChatMessageVO): string {
        const timeMs = this.getProcessingTimeMs(message)

        if (timeMs === 0) return ''

        if (timeMs < 1000) {
            return `${timeMs}ms`
        } else if (timeMs < 60000) {
            return `${(timeMs / 1000).toFixed(1)}s`
        } else {
            return `${(timeMs / 1000).toFixed(0)}s`
        }
    }



    /**
     * 创建消息体，支持传入Text或payload
     * @param content 文本内容或payload对象
     * @param options 可选参数
     * @returns 消息体对象
     */
    createBody(content: string | MsgPayload, options?: {
        type?: string
        format?: string
        metadata?: Record<string, any>
    }): MessageBody {
        let payload;
        if (typeof content === 'string') {
            payload = this.createTextPayload(content, options)
        }
        return {
            payload: payload
        }
    }

    /**
     * 创建文本载荷
     * @param text 文本内容
     * @param options 可选参数
     * @returns 文本载荷对象
     */
    createTextPayload(text: string, options?: {
        contentType?: string
        encoding?: string
        language?: string
        metadata?: Record<string, any>
    }): MsgPayload {
        return {
            text: {
                content: text
            }
        }
    }

    /**
     * 创建图片载荷
     * @param imageData 图片数据（base64或URL）
     * @param options 可选参数
     * @returns 图片载荷对象
     */
    createImagePayload(imageData: string, options?: {
        contentType?: string
        width?: number
        height?: number
        alt?: string
        caption?: string
        metadata?: Record<string, any>
    }): MsgPayload {
        return {
            image: {
                resource: {
                    width: options?.width,
                    height: options?.height,
                    url: imageData.startsWith('http') ? imageData : undefined,
                    base64: imageData.startsWith('data:') ? imageData : undefined
                },
                content: options?.caption || ''
            }
        }
    }

    /**
     * 创建视频载荷
     * @param videoData 视频数据（URL或base64）
     * @param options 可选参数
     * @returns 视频载荷对象
     */
    createVideoPayload(videoData: string, options?: {
        contentType?: string
        duration?: number
        width?: number
        height?: number
        thumbnail?: string
        caption?: string
        metadata?: Record<string, any>
    }): MsgPayload {
        return {
            video: {
                resource: {
                    duration: options?.duration,
                    width: options?.width,
                    height: options?.height,
                    url: videoData.startsWith('http') ? videoData : undefined,
                    base64: videoData.startsWith('data:') ? videoData : undefined,
                },
                content: options?.caption || ''
            }
        }
    }

    /**
     * 创建音频载荷
     * @param audioData 音频数据（URL或base64）
     * @param options 可选参数
     * @returns 音频载荷对象
     */
    createAudioPayload(audioData: string, options?: {
        contentType?: string
        duration?: number
        sampleRate?: number
        channels?: number
        caption?: string
        metadata?: Record<string, any>
    }): MsgPayload {
        return {
            audio: {
                resource: {
                    duration: options?.duration,
                    sampleRate: options?.sampleRate,
                    channels: options?.channels,
                    url: audioData.startsWith('http') ? audioData : undefined,
                    base64: audioData.startsWith('data:') ? audioData : undefined, 
                },
                content: options?.caption || ''
            }
        }
    }

    /**
     * 创建文件载荷
     * @param fileData 文件数据（URL或base64）
     * @param options 可选参数
     * @returns 文件载荷对象
     */
    createFilePayload(content: string, options?: {
        contentType?: string
        fileName?: string
        fileSize?: number
        encoding?: string
        metadata?: Record<string, any>
    }): MsgPayload {
        return {
            file: {
                resource: {
                    name: options?.fileName || 'file',
                    size: options?.fileSize,
                    url: content.startsWith('http') ? content : undefined,
                    base64: content.startsWith('data:') ? content : undefined,
                },
                content: options?.fileName || ''
            }
        }
    }

    /**
     * 创建位置载荷
     * @param latitude 纬度
     * @param longitude 经度
     * @param options 可选参数
     * @returns 位置载荷对象
     */
    createLocationPayload(latitude: number, longitude: number, options?: {
        address?: string
        name?: string
        radius?: number
        metadata?: Record<string, any>
    }): MsgPayload {
        return {
            location: {
                content: `${latitude},${longitude}`,
                location: {
                    latitude,
                    longitude,
                },
                address: options?.address || '',
                name: options?.name || '',
                radius: options?.radius,
            }
        }
    }

    /**
     * 创建音乐载荷
     * @param musicData 音乐数据（URL或base64）
     * @param options 可选参数
     * @returns 音乐载荷对象
     */
    createMusicPayload(musicData: string, options?: {
        contentType?: string
        duration?: number
        format?: AudioFormat
        caption?: string
        metadata?: Record<string, any>
    }): MsgPayload {
        return {
            music: {
                resource: { 
                    duration: options?.duration,
                    format: options?.format,
                    url: musicData.startsWith('http') ? musicData : undefined,
                    base64: musicData.startsWith('data:') ? musicData : undefined
                },
                content: options?.caption || ''
            }
        }
    }

    /**
     * 创建复合载荷（包含多种类型）
     * @param payloads 载荷数组
     * @param options 可选参数
     * @returns 复合载荷对象
     */
    createCompositePayload(payloads: MsgPayload[], options?: {
        type?: string
        metadata?: Record<string, any>
    }): MsgPayload {
        const compositePayload: MsgPayload = {}

        // 合并所有载荷
        payloads.forEach(payload => {
            if (payload.text) compositePayload.text = payload.text
            if (payload.image) compositePayload.image = payload.image
            if (payload.video) compositePayload.video = payload.video
            if (payload.audio) compositePayload.audio = payload.audio
            if (payload.file) compositePayload.file = payload.file
            if (payload.location) compositePayload.location = payload.location
            if (payload.music) compositePayload.music = payload.music
        })

        return {
            ...compositePayload
        }
    }
}

// 创建单例实例
export const chatMessageProcessor = new ChatMessageProcessor()

export default chatMessageProcessor