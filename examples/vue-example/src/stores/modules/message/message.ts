import { defineStore } from "pinia";
import { ChatMessageService } from "@/services";
import type { ChatMessageVO } from "@/services";
import { useConversationStore } from "../conversation";

import { chatMessageProcessor } from '@/core/chat';
import { MessageStoreState, SendMessageOptions, LoadMessagesOptions, MessageSendStatus } from "./types";
import { MessageBuilder } from "@/services/message/builder";
import { ChatCompletionChunk, ChatContext, Message, MessageRole, MessageType, MessageType as SdkMessageType } from "sdkwork-sdk-api-typescript";
 
export const useMessageStore = defineStore("message", {
    state: (): MessageStoreState => ({
        loading: false,
        error: null,
        initialized: false,

        // 消息初始化为空数组
        messages: [],

        // 分页状态
        currentPage: 1,
        pageSize: 20,
        hasMore: true,
        totalCount: 0,

        // 流式状态
        streaming: false,
        currentStream: null,

        // 工具调用状态
        toolCalls: [],
        toolResults: [],
    }),
    getters: {
        // 基础状态
        isLoading: (state) => state.loading,
        getError: (state) => state.error,
        isInitialized: (state) => state.initialized,

        // 消息相关
        currentMessages: (state) => state.messages,
        messageCount: (state) => state.messages.length,
        lastMessage: (state) => state.messages[state.messages.length - 1] || null,

        // 流式状态
        isStreaming: (state) => state.streaming,

        // 工具调用状态
        hasActiveToolCalls: (state) => state.toolCalls.length > 0,

        // 按时间排序的消息列表
        sortedMessages: (state) =>
            [...state.messages].sort(
                (a, b) => {
                    const aTime = a.sendAt ? window.$date.parse(a.sendAt).getTime() : 0;
                    const bTime = b.sendAt ? window.$date.parse(b.sendAt).getTime() : 0;
                    return aTime - bTime;
                }
            ),

        // 未读消息数量
        unreadCount: (state) => state.messages.filter(msg => !msg.readAt).length,

        // 发送中的消息
        sendingMessages: (state) => state.messages.filter(msg =>
            msg.metadata?.get?.('sendStatus') === MessageSendStatus.SENDING
        ),

        // 发送失败的消息
        failedMessages: (state) => state.messages.filter(msg =>
            msg.metadata?.get?.('sendStatus') === MessageSendStatus.FAILED
        ),

        // 分页相关
        getCurrentPage: (state) => state.currentPage,
        getPageSize: (state) => state.pageSize,
        getHasMore: (state) => state.hasMore,
        getTotalCount: (state) => state.totalCount,
    },
    actions: {
        // 初始化store
        async initialize() {
            try {
                this.loading = true;
                this.initialized = true;
            } catch (error) {
                this.error = error as Error;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 加载消息
        async loadMessages(options: LoadMessagesOptions) {
            try {
                this.loading = true;
                const chatMessageService = new ChatMessageService();

                const params: any = {};
                
                // 从conversation store获取当前会话信息
                const conversationStore = useConversationStore();
                const currentConversation = conversationStore.currentConversation;
                
                // 优先使用当前会话的id和uuid
                if (currentConversation) {
                    if (currentConversation.id) {
                        params.conversationId = currentConversation.id;
                    }
                    if (currentConversation.uuid) {
                        params.conversationUuid = currentConversation.uuid;
                    }
                } else {
                    // 如果没有当前会话，使用传入的conversationId
                    params.conversationId = options.conversationId;
                }

                if (options.page !== undefined) {
                    params.page = options.page;
                }
                if (options.size !== undefined) {
                    params.size = options.size;
                }

                const pageResult = await chatMessageService.listByPage(params);
                this.messages = pageResult.content || [];
            } catch (error) {
                this.error = error as Error;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 加载更多消息（分页）
        async loadMoreMessages(options: LoadMessagesOptions) {
            try {
                this.loading = true;
                const chatMessageService = new ChatMessageService();

                const params: any = {};
                
                // 从conversation store获取当前会话信息
                const conversationStore = useConversationStore();
                const currentConversation = conversationStore.currentConversation;
                
                // 优先使用当前会话的id和uuid
                if (currentConversation) {
                    if (currentConversation.id) {
                        params.conversationId = currentConversation.id;
                    }
                    if (currentConversation.uuid) {
                        params.conversationUuid = currentConversation.uuid;
                    }
                } else {
                    // 如果没有当前会话，使用传入的conversationId
                    params.conversationId = options.conversationId;
                }

                // 优先使用基于最后同步消息ID的查询，更好地利用索引
                if (options.lastSyncMessageId) {
                    params.lastSyncMessageId = options.lastSyncMessageId;
                } else if (this.messages.length > 0) {
                    // 如果没有显式指定，使用当前消息列表中的第一条消息ID
                    const firstMessage = this.messages[0];
                    if (firstMessage && firstMessage.id) {
                        params.lastSyncMessageId = firstMessage.id;
                    }
                }

                if (options.page !== undefined) {
                    params.page = options.page;
                }
                if (options.size !== undefined) {
                    params.size = options.size;
                }

                const pageResult = await chatMessageService.loadMore(params);
                this.messages = [
                    ...this.messages,
                    ...(pageResult.content || []),
                ];

            } catch (error) {
                this.error = error as Error;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async saveMessage(message: Message, chatContext?: ChatContext) {
            const messageVO = chatMessageProcessor.messageToVO(message)
            this.saveMessageVO(messageVO, chatContext)
        },

        // 发送通用消息
        async saveMessageVO(message: ChatMessageVO, chatContext?: ChatContext) {
            try {
                this.loading = true;

                // 确保消息有必要的字段
                if (!message.uuid) {
                    message.uuid = window.$uuid();
                }
                if (!message.sendAt) {
                    message.sendAt = window.$date.format(new Date());
                }
                const authStore = useAuthStore();
                const currentUser = authStore.currentUser;
                // 自动填充sender和senderId字段
                if (!message.sender || !message.senderId) {


                    if (currentUser) {
                        // 填充senderId
                        if (!message.senderId && currentUser.id) {
                            message.senderId = currentUser.id;
                        }

                        // 填充sender
                        if (!message.sender) {
                            message.sender = {
                                id: currentUser.id,
                                name: currentUser.nickname || currentUser.username,
                                uuid: currentUser.uuid
                            };
                        }
                    }
                }

                // 设置发送状态
                this.setMessageSendStatus(message, MessageSendStatus.SENDING);

                // 添加chatContext到消息元数据
                if (chatContext) {
                    message.metadata = message.metadata || new Map();
                    message.metadata.set('chatContext', chatContext);
                }
                if (message.senderId && message.senderId === currentUser?.id) {
                    message.isOwn = true
                }

                // 添加到本地消息列表
                this.messages.push(message);
                console.error('message========================', message)

                // 触发通用消息发送事件
                window.dispatchEvent(new CustomEvent('sdk:messageSent', {
                    detail: {
                        type: 'GENERIC_MESSAGE_SENT',
                        message: message,
                        chatContext: chatContext
                    }
                }));

                return message;
            } catch (error) {
                this.error = error as Error;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 处理接收到的消息
        handleReceivedMessage(event: any) {
            const message: any = {
                id: event.id,
                content: event.content,
                role: MessageRole.ASSISTANT,
                isOwn: false,
                timestamp: event.timestamp,
                sender: event.sender,
                metadata: event.metadata
            };

            this.messages.push(message);

            // 触发消息接收事件
            window.dispatchEvent(new CustomEvent('sdk:message', {
                detail: {
                    type: 'MESSAGE_RECEIVED',
                    message: message
                }
            }));
        },

        // 处理接收到的音频流
        handleReceivedAudioStream(audioData: any) {
            // 触发音频流接收事件
            window.dispatchEvent(new CustomEvent('sdk:audioStream', {
                detail: {
                    type: 'AUDIO_STREAM_RECEIVED',
                    audio: audioData
                }
            }));
        },

        // 将字符串role转换为MessageRole枚举
        convertRoleToEnum(roleStr: string | undefined): MessageRole | undefined {
            if (!roleStr) return undefined;
            
            // 将字符串转换为大写，然后映射到枚举
            const upperRole = roleStr.toUpperCase();
            switch (upperRole) {
                case 'USER':
                    return MessageRole.USER;
                case 'ASSISTANT':
                    return MessageRole.ASSISTANT;
                case 'SYSTEM':
                    return MessageRole.SYSTEM;
                case 'FUNCTION':
                    return MessageRole.FUNCTION;
                case 'DEFAULT':
                    return MessageRole.DEFAULT;
                default:
                    // 如果无法识别，返回undefined
                    return undefined;
            }
        },

        // 处理接收到的流式消息块
        handleReceivedChunk(params: { channelMsgId: string; id?: string | number; chunk: ChatCompletionChunk }) {
            try { 
                const { channelMsgId, id, chunk } = params;
                if(!chunk){
                    return;
                }
                
                // 设置流式状态
                this.streaming = true;

                // 解析chunk数据
                const isFinal = chunk.choices?.[0]?.finish_reason !== undefined && chunk.choices[0].finish_reason !== null;
                const delta = chunk.choices?.[0]?.delta;
                const content = delta?.content || '';
                const reasoningContent = delta?.reasoning_content || '';
                
                // 将字符串role转换为MessageRole枚举
                const role:MessageRole = this.convertRoleToEnum(delta?.role) || MessageRole.ASSISTANT;

                // 使用channelMsgId进行分组，查找或创建对应的消息
                let targetMessage: ChatMessageVO | undefined= this.messages.find(msg => 
                    msg.channelMsgId === channelMsgId || msg.id === id || msg.uuid === id
                );

                if (!targetMessage) {
                    // 创建新的流式消息
                    targetMessage = {
                        id: id || window.$uuid(),
                        uuid: window.$uuid(),
                        channelMsgId: channelMsgId, 
                        reasoning_content: reasoningContent || '',
                        type: MessageType.TEXT,
                        role: role,
                        isOwn: false,
                        sendAt: window.$date.format(new Date()),
                        createdAt: window.$date.format(new Date()),
                        metadata: new Map<string, any>([
                            ['streaming', true],
                            ['isFinal', false],
                            ['chunkCount', 1]
                        ]),
                        children: [],
                        messageState: {
                            isThinking: chunk.choices?.[0]?.delta?.reasoning_content ? true : false,
                            thinkStart: Date.now(),
                            thinkEnd: undefined
                        },
                        actions: chunk.metadata?.actions || [],
                        errorCode: undefined,
                        receiveAt: undefined,
                        modelId: chunk.model ? parseInt(chunk.model) : undefined,
                        model: chunk.model,
                        chatOptions: undefined,
                        parentMessageId: chunk.metadata?.parent_message_id,
                        temperature: undefined,
                        receiverId: undefined,
                        isError: false,
                        senderId: undefined,
                        usedRag: false,
                        processingTime: undefined,
                        userId: undefined,
                        readAt: undefined,
                        tokenCount: chunk.usage?.total_tokens,
                        errorMessage: undefined, 
                        body: {
                            id: chunk.id,
                            groups: new Map<string, ChatCompletionChunk[]>([[channelMsgId, [chunk]]]),
                            completion: undefined,
                            payload: undefined,
                            thinkStart: undefined,
                            thinkEnd: undefined
                        }
                    };

                    // 添加到消息列表
                    this.messages.push(targetMessage);
                } else {
                    // 更新现有消息内容 
                    if (reasoningContent) {
                        targetMessage.reasoning_content = (targetMessage.reasoning_content || '') + reasoningContent;
                    }
                    
                    // 更新消息状态
                    if (targetMessage.messageState) {
                        targetMessage.messageState.isThinking = reasoningContent ? true : false;
                        // 如果是最终块，设置思考结束时间
                        if (isFinal && targetMessage.messageState.isThinking) {
                            targetMessage.messageState.thinkEnd = Date.now();
                        }
                    }

                    // 更新chunk分组
                    if (targetMessage.body?.groups) {
                        const group = targetMessage.body.groups.get(channelMsgId) || [];
                        group.push(chunk);
                        targetMessage.body.groups.set(channelMsgId, group);
                    } 
                }
 

                // 如果是第一个chunk，触发消息接收事件（消息开始显示）
                if (!targetMessage.body?.groups?.get(channelMsgId) || targetMessage.body.groups.get(channelMsgId)?.length === 1) {
                    // 触发消息接收完成事件
                    window.dispatchEvent(new CustomEvent('sdk:message', {
                        detail: {
                            type: 'MESSAGE_RECEIVED',
                            message: targetMessage
                        }
                    }));
                } else {
                    // 触发流式更新事件
                    window.dispatchEvent(new CustomEvent('sdk:message', {
                        detail: {
                            type: 'MESSAGE_STREAM_UPDATE',
                            message: targetMessage,
                            chunk: chunk
                        }
                    }));
                }

                // 如果是最终块，结束流式状态
                if (isFinal) { 
                    // 可以在这里添加流式结束的处理逻辑
                }

                return targetMessage;
            } catch (error) {
                console.error('处理流式消息块失败:', error);
                this.streaming = false;
                throw error;
            }
        },

        // 设置消息发送状态
        setMessageSendStatus(message: ChatMessageVO, status: MessageSendStatus) {
            message.metadata = message.metadata || new Map();
            message.metadata.set('sendStatus', status);
            message.metadata.set('sendTimestamp', Date.now());

            if (status === MessageSendStatus.FAILED) {
                message.metadata.set('sendError', '消息发送失败');
            }
        },

        // 更新消息发送状态
        updateMessageSendStatus(messageId: string, status: MessageSendStatus, error?: string) {
            const message = this.messages.find(msg => msg.id === messageId || msg.uuid === messageId);
            if (message) {
                this.setMessageSendStatus(message, status);
                if (error) {
                    message.metadata?.set('sendError', error);
                }
            }
        },

        // 标记消息为已读
        async markMessageAsRead(messageId: string) {
            const message = this.messages.find(msg => msg.id === messageId || msg.uuid === messageId);
            if (message) {
                message.readAt = window.$date.format(new Date());
            }
        },

        // 删除消息
        async deleteMessage(messageId: string) {
            try {
                this.loading = true;

                // 从本地消息列表中删除
                this.messages = this.messages.filter(msg => msg.id !== messageId && msg.uuid !== messageId);

                // TODO: 调用远程API删除消息
                // const chatMessageService = new ChatMessageService();
                // await chatMessageService.delete(messageId);

            } catch (error) {
                this.error = error as Error;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 清除消息
        async clearMessages(conversationId?: string) {
            try {
                this.loading = true;

                if (conversationId) {
                    // 清除指定会话的消息
                    this.messages = this.messages.filter(msg => msg.conversationId !== conversationId);
                } else {
                    // 清除所有消息
                    this.messages = [];
                }
            } catch (error) {
                this.error = error as Error;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 搜索消息
        async searchMessages(query: string, conversationId?: string) {
            try {
                this.loading = true;

                let messagesToSearch = this.messages;
                if (conversationId) {
                    messagesToSearch = messagesToSearch.filter(msg => msg.conversationId === conversationId);
                }

                const results = messagesToSearch.filter(msg => {
                    const content = chatMessageProcessor.getText(msg);
                    if (!content) {
                        return false;
                    }
                    return content.includes(query.toLowerCase());
                }
                );

                return results;
            } catch (error) {
                this.error = error as Error;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 获取会话的最后一条消息
        getLastMessageByConversation(conversationId: string) {
            const conversationMessages = this.messages.filter(msg => msg.conversationId === conversationId);
            return conversationMessages[conversationMessages.length - 1] || null;
        },

        // 获取会话的消息数量
        getMessageCountByConversation(conversationId: string) {
            return this.messages.filter(msg => msg.conversationId === conversationId).length;
        },

        // 重置状态
        reset() {
            this.messages = [];
            this.streaming = false;
            this.currentStream = null;
            this.toolCalls = [];
            this.toolResults = [];
        },
    },
});