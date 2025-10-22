import { defineStore } from "pinia";
import { ref } from 'vue'
import { ChatService } from "@/services";
import { ConversationService } from "@/services";
import { ChatMessageService } from "@/services";
import type { ChatMessageVO, ConversationVO } from "@/services";
import { ChatCompletionParam, MessageRole } from "sdkwork-sdk-api-typescript";
import { useAuthStore } from "../auth";
import type { ChatStoreState } from "./types";
import { 
  DefaultMessageHandlerFactory, 
  MessageHandlerFactoryConfig
} from "@/services/message/factory";
import type { MessageHandler } from "@/services/message/types";
import type { MessageEventEmitter, MessageEventAdapter } from "@/services/message/event";
import { MessageHandlerType } from "@/services/message/types";
import { MessageBuilder } from "@/services/message/builder";
import { MessageType } from "sdkwork-sdk-api-typescript";


// 统一时间格式化函数
const formatDateTime = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
};

export const useChatStore = defineStore("chat", {
  state: (): ChatStoreState => ({
    loading: false,
    error: null,
    initialized: false,

    // 会话初始化为空数组，后续按updatedAt降序排列
    conversations: [],
    currentConversationId: null,
    searchResults: null,

    // 消息初始化为空数组
    messages: [],

    // 流式状态
    streaming: false,
    currentStream: null,

    // 工具调用状态
    toolCalls: [],
    toolResults: [],

    // 聊天配置
    options: {
      model: undefined,
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    },

    // 消息处理器相关状态
    currentHandlerType: MessageHandlerType.IOT, // 默认使用IoT
    messageHandler: null,
    handlerConnected: false,
  }),
  getters: {
    // 基础状态
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isInitialized: (state) => state.initialized,

    // 会话相关
    currentConversation: (state) =>
      state.currentConversationId
        ? state.conversations.find((c) => {
          return (
            c.id === state.currentConversationId ||
            c.uuid === state.currentConversationId
          );
        }) || null
        : null,

    // 按updatedAt降序排列的会话列表
    sortedConversations: (state) =>
      [...state.conversations].sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime()
      ),

    currentConversationTitle: (state) =>
      state.currentConversationId
        ? state.conversations.find((c) => {
          return (
            c.id === state.currentConversationId ||
            c.uuid === state.currentConversationId
          );
        })?.title
        : "New Conversation",

    searchResults: (state) => state.searchResults,

    // 消息相关
    currentMessages: (state) => state.messages,

    messageCount: (state) => state.messages.length,

    lastMessage: (state) => state.messages[state.messages.length - 1] || null,

    // 流式状态
    isStreaming: (state) => state.streaming,

    // 工具调用状态
    hasActiveToolCalls: (state) => state.toolCalls.length > 0,

    // 配置状态
    currentOptions: (state) => state.options,

    // 消息处理器相关getter
    currentMessageHandler: (state) => state.messageHandler,
    isHandlerConnected: (state) => state.handlerConnected,
    currentHandlerType: (state) => state.currentHandlerType,
    
    // 未读消息计数
    unreadCount: (state) => {
      // 计算所有会话的未读消息总数
      return state.conversations.reduce((total, conversation) => {
        return total + (conversation.unreadCount || 0);
      }, 0);
    },
  },
  actions: {
    // 初始化store
    async initialize() {
      try {
        this.loading = true;
        const conversationService = new ConversationService();

        // Load conversations with pagination parameters
        const pageable = await conversationService.listByPage(
          {},
          { page: 0, size: 20 }
        ); // Default: page 1, 20 items per page
        this.conversations = pageable.content || [];

        // Sort conversations by updatedAt descending
        this.sortConversations();

        // Set the first conversation as active if none is set
        if (this.conversations.length > 0 && !this.currentConversationId) {
          this.currentConversationId = this.conversations[0].id as string;
          await this.loadMessages(this.currentConversationId as string);
        }

        // 初始化消息处理器
        await this.initializeMessageHandler();

        this.initialized = true;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 初始化消息处理器
    async initializeMessageHandler() {
      try {
        // 创建消息处理器工厂配置
        const factoryConfig: MessageHandlerFactoryConfig = {
          config: await this.getIotConfig(),
          eventEmitter: this.createEventEmitter(),
          eventAdapter: this.createEventAdapter()
        };

        // 创建消息处理器工厂
        const factory = new DefaultMessageHandlerFactory();
        
        // 创建消息处理器
        this.messageHandler = await factory.createHandler(this.currentHandlerType, factoryConfig);

        // 初始化处理器
        await this.messageHandler?.initialize();

        // 更新连接状态
        this.handlerConnected = this.messageHandler?.isConnected();
      } catch (error) {
        this.error = error as Error;
        throw error;
      }
    },

    // 切换消息处理器类型
    async switchHandlerType(handlerType: MessageHandlerType) {
      try {
        this.loading = true;
        
        // 断开当前处理器
        if (this.messageHandler) {
          await this.messageHandler.destroy();
          this.messageHandler = null;
        }

        // 更新处理器类型
        this.currentHandlerType = handlerType;

        // 重新初始化处理器
        await this.initializeMessageHandler();
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 获取IoT配置
    async getIotConfig() {
      // 这里需要返回AIoT配置
      // 实际实现中应该从配置文件中读取或动态生成
      return {
        // 基础配置
        baseUrl: 'ws://localhost:8080',
        reconnect: true,
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
        
        // 认证配置
        auth: {
          token: 'your-auth-token',
          appId: 'your-app-id'
        },
        
        // 设备配置
        device: {
          deviceId: 'your-device-id',
          deviceType: 'web'
        }
      } as any;
    },

    // 创建事件发射器
    createEventEmitter() {
      // 这里需要返回一个事件发射器实例
      // 实际实现中应该使用Vue的事件系统或其他事件库
      return {
        emit: (event: any) => {
          // 处理事件发射
          this.handleEvent(event);
        }
      } as MessageEventEmitter;
    },

    // 创建事件适配器
    createEventAdapter() {
      // 这里需要返回一个事件适配器实例
      // 实际实现中应该使用我们定义的事件适配器
      return {
        adaptConnectionChange: (state: any) => ({ type: 'CONNECTION_CHANGE', state }),
        adaptMessageReceived: (message: any) => ({ type: 'MESSAGE_RECEIVED', message }),
        adaptAudioStreamReceived: (audio: any) => ({ type: 'AUDIO_STREAM_RECEIVED', audio }),
        adaptDataReceived: (data: any) => ({ type: 'DATA_RECEIVED', data }),
        adaptToolCallReceived: (tool: any) => ({ type: 'TOOL_CALL_RECEIVED', tool }),
        adaptErrorOccurred: (error: any) => ({ type: 'ERROR_OCCURRED', error }),
        adaptIotEventReceived: (type: any, event: any) => ({ type: 'IOT_EVENT_RECEIVED', eventType: type, event })
      } as unknown as MessageEventAdapter;
    },

    // 处理事件
    handleEvent(event: any) {
      switch (event.type) {
        case 'CONNECTION_CHANGE':
          this.handlerConnected = event.state.connected;
          break;
        case 'MESSAGE_RECEIVED':
          this.handleReceivedMessage(event.message);
          break;
        case 'AUDIO_STREAM_RECEIVED':
          // 处理音频流
          this.handleReceivedAudioStream(event.audio);
          break;
        case 'DATA_RECEIVED':
          // 处理数据
          break;
        case 'TOOL_CALL_RECEIVED':
          // 处理工具调用
          break;
        case 'ERROR_OCCURRED':
          this.error = event.error;
          break;
        case 'IOT_EVENT_RECEIVED':
          // 处理IoT事件
          break;
      }
    },

    // 发送消息（使用统一的消息处理器）
    async sendMessage(content: string) {
      try {
        this.loading = true;

        if (!this.messageHandler || !this.handlerConnected) {
          throw new Error('消息处理器未连接')
        } 

        // 使用消息构建器创建IM格式消息
        const authStore = useAuthStore();
        const message = MessageBuilder.createTextMessage(content, {
          messageType: MessageType.TEXT,
          conversationId: this.currentConversationId as string,
          userId: authStore.currentUser?.id as string,
          timestamp: Date.now()
        });

        // 发送消息
        this.messageHandler.send(message, {
          conversation_id: this.currentConversationId as string
        });

        // 添加到本地消息列表
        this.messages.push(message);

        return message.uuid;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 发送音频消息
    async sendAudio(audioData: ArrayBuffer) {
      try {
        this.loading = true;

        if (!this.messageHandler || !this.handlerConnected) {
          throw new Error('消息处理器未连接')
        }

        // 使用消息构建器创建音频消息
        const authStore = useAuthStore();
        const message = MessageBuilder.createAudioMessage(audioData, {
          messageType: MessageType.AUDIO,
          conversationId: this.currentConversationId as string,
          userId: authStore.currentUser?.id as string,
          timestamp: Date.now(),
          duration: 0, // 实际应用中应该计算音频时长
          format: 'wav'
        });

        // 发送音频数据
        if (this.messageHandler.sendAudioData) {
          this.messageHandler.sendAudioData(audioData);
        }

        // 添加到本地消息列表
        this.messages.push(message);

        // 触发音频发送事件
        window.dispatchEvent(new CustomEvent('sdk:audioSent', { 
          detail: { 
            type: 'AUDIO_SENT', 
            audioData: audioData,
            message: message
          } 
        }));

        return message.uuid;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 开始语音监听
    startVoiceListening() {
      if (this.messageHandler && this.handlerConnected) {
        this.messageHandler.startListening();
      }
    },

    // 停止语音监听
    stopVoiceListening() {
      if (this.messageHandler && this.handlerConnected) {
        this.messageHandler.stopListening();
      }
    },

    // 处理接收到的消息
    handleReceivedMessage(event: any) {
      const message: any = {
        id: event.id,
        content: event.content,
        role: "assistant",
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
      }))
    }, 

    async loadMoreConversations(page: number, pageSize: number = 20) {
      try {
        this.loading = true;
        const conversationService = new ConversationService();

        const pageResult = await conversationService.listByPage(
          {},
          { page, size: pageSize }
        );
        this.conversations = [
          ...this.conversations,
          ...(pageResult.content || []),
        ];
        this.sortConversations();
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async sortConversations() {
      this.conversations.sort(
        (a, b) =>
          window.$date.parse(b.updatedAt as string).getTime() -
          window.$date.parse(a.updatedAt as string).getTime()
      );
    },
    async createConversationRemote(options?: any) {
      const conversationService = new ConversationService();
      if (options?.title) {
        options.title = options.title.substring(0, 20);
      }
      const conversation = await conversationService.create({
        ...options,
      });
      this._updateConversation(conversation);

      return conversation;
    },
    async _updateConversation(conversation: any) {
      const index = this.conversations.findIndex((item) =>
        this.isSameConversation(item, conversation)
      );
      if (index >= 0) {
        this.conversations[index] = {
          ...this.conversations[index],
          ...conversation,
        };
        this.conversations = [...this.conversations];
        this.conversations[index].updatedAt = window.$date.format(new Date())
      } else {
        conversation.updatedAt = window.$date.format(new Date())
        this.conversations.push(conversation);
      }
      await this.sortConversations();

    },
    isSameConversation(c1: ConversationVO, c2: ConversationVO) {
      if (!c1 || !c2) {
        return false;
      }
      return (
        (c1.id && c1.id === c2.id) ||
        (c1.uuid && c1.uuid === c2.uuid) ||
        (c1.id && c1.id === c2.uuid) ||
        (c1.uuid && c1.uuid === c2.id)
      );
    },

    // 以SSE的方式发送消息发送消息
    async sendSSE(
      content: string,
      options?: Partial<any>
    ) {
      if (!content) {
        return;
      }
      try {
        this.loading = true;
        let conversation = null;
        if (!this.currentConversationId) {
          conversation = await this.createConversationRemote();
          console.error('conversation ========bb=============', conversation)
          this.currentConversationId = conversation.uuid as string;
        } else {
          conversation = this.findCurrentConversation();
          if (!conversation) {
            conversation = await this.createConversationRemote();
            console.error('conversation ========aa=============', conversation)
            this.currentConversationId = conversation.uuid as string;
          }
        }
        if (!conversation.id) {
          const newConversation = await this.createConversationRemote();
          Object.assign(conversation, newConversation);
        }
        if (content && !conversation.title) {
          Object.assign(conversation, { title: content.substring(0, 20) });
          this._updateConversation(conversation);
        }
        const storeMessage: any = {
          content,
          role: "user",
          id: window.$uuid(),
          isOwn: true,
        };
        // 添加到当前会话的消息列表
        this.messages.push(storeMessage);

        // Message saving will be handled by message service
        // chatService.saveMessage(
        //   this.currentConversationId as string,
        //   storeMessage as ChatMessage
        // );
        // 更新会话最后更新时间
        if (this.currentConversationId) {
          if (conversation) {
            conversation.updatedAt = formatDateTime(new Date());
            // 重新排序会话列表
            this.sortConversations();
          }
        }

        // 调用服务发送消息
        const { response_format, ...filteredOptions } = this.options;
        const response = await this.createStreamingCompletion({
          ...filteredOptions,
          ...options,
          messages: [storeMessage],
        });
        return response;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async reSendSSE(
      message: any,
      options?: Partial<any>
    ) {
      console.log('reSendMessage', message, options)


    },

    // 处理单个chunk数据
    async handleChunk(chunk: any, states: Record<string, any>, lastMessage: ChatMessageVO | undefined | null): Promise<ChatMessageVO | undefined | null> {
      let messageState: any = states[chunk.id];

      // 处理没有delta数据的chunk（如usage信息）
      if (!chunk.choices || !chunk.choices[0] || !chunk.choices[0].delta) {
        if (chunk.usage) {
          if (messageState) {
            messageState.isThinking = false;
            if (!messageState.thinkEnd) {
              messageState.thinkEnd = Date.now();
            }
            this.updateMessageChunk(lastMessage, messageState, chunk);
          }
        }
        return lastMessage;
      }

      // 处理usage信息
      if (chunk.usage && messageState) {
        messageState.isThinking = false;
        if (!messageState.thinkEnd) {
          messageState.thinkEnd = Date.now();
        }
      }

      // 初始化messageState
      if (!messageState) {
        messageState = {
          fullResponse: "",
          reasoning_content: "",
          isThinking: false,
        };
        states[chunk.id] = messageState;
      }

      // 处理delta数据
      const delta = chunk.choices[0].delta;
      if (delta.reasoning_content) {
        if (!messageState.reasoning_content) {
          messageState.isThinking = true;
          messageState.thinkStart = new Date().getTime();
        }
        messageState.reasoning_content += delta.reasoning_content;
      }
      if (delta.content) {
        messageState.isThinking = false;
        messageState.fullResponse += delta.content;
        if (!messageState.thinkEnd) {
          messageState.thinkEnd = Date.now();
        }
      }

      // 更新消息内容
      if (this.messages.length > 0) {
        lastMessage = this.findMessageByChunk(chunk);
        if (lastMessage && lastMessage.role === MessageRole.ASSISTANT) {
          this.updateMessageChunk(lastMessage, messageState, chunk);
        } else {
          this.messages.push({
            id: chunk.id,
            uuid: chunk.id,
            parentMessageId: chunk.metadata?.parentMessageId,
            role: MessageRole.ASSISTANT,
            children: [
              {
                id: chunk.id,
                uuid: chunk.id,
                parentMessageId: chunk.metadata?.parentMessageId,
                role: MessageRole.ASSISTANT,
                content: messageState.fullResponse,
                reasoning_content: messageState.reasoning_content,
                children: [],
                messageState: {
                  isThinking: messageState.isThinking,
                  thinkStart: messageState.thinkStart,
                  thinkEnd: messageState.thinkEnd,
                },
                metadata: {
                  ...chunk.metadata,
                },
              },
            ],
            actions: [],
          });
        }
      }

      return lastMessage;
    },

    // 创建流式响应
    async createStreamingCompletion(request: ChatCompletionParam) {
      try {
        this.streaming = true;
        const chatService = new ChatService();
        const conversation = this.findCurrentConversation();
        console.log("conversation: ", conversation);
        this.currentStream = await chatService.create(
          {
            ...request,
            stream: true,
          },
          { conversationId: this.currentConversationId as string }
        );

        const states: Record<string, any> = {};
        let lastMessage: ChatMessageVO | undefined | null = undefined;

        for await (const chunk of this.currentStream!) {
          lastMessage = await this.handleChunk(chunk, states, lastMessage);
        }

        // 更新会话最后更新时间
        if (conversation) {
          conversation.updatedAt = formatDateTime(new Date());
          // 重新排序会话列表
          this.sortConversations();
        }

        let fullContent = "";
        lastMessage?.children?.forEach((child) => {
          fullContent += child.content;
        });
        return fullContent;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.streaming = false;
        this.currentStream = null;
      }
    },
    findCurrentConversation() {
      return this.findConversation(this.currentConversationId as string);
    },
    findConversation(id: string) {
      const conversation = this.conversations.find((c) => {
        return c.id === id || c.uuid === id;
      });
      return conversation;
    },

    // 处理工具调用
    async handleToolCalls(toolCalls: any[]) {
      try {
        this.loading = true;
        this.toolCalls = toolCalls;

        return this.toolResults;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 创建会话
    async createConversation(title?: string) {
      try {
        this.loading = true;
        const conversation: any = {
          uuid: window.$uuid(),
          title: title
        };

        // 添加到状态并排序
        this.conversations.unshift(conversation);
        this.currentConversationId = conversation.uuid || conversation.id;

        // 初始化消息列表
        this.messages = [];

        return conversation;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    findMessage(id: string) {
      if (!this.messages) {
        return null;
      }
      return this.messages.find((message) => {
        return id && (id === message.id || id === message.uuid);
      });
    },
    findMessageByChunk(chunk: any): ChatMessageVO | null | undefined {
      if (!this.messages) {
        return null;
      }
      const message = this.messages.find((message) => {
        const chunkMetadata = chunk.metadata || {};
        if (chunkMetadata.parentMessageId) {
          if (chunkMetadata.parentMessageId === message.parentMessageId) {
            return true;
          }
        }
        let id = chunk.id;
        return id && (id === message.id || id === message.uuid);
      });
      return message;
    },
    updateMessageChunk(
      message: any,
      messageState: any,
      chunk: any
    ) {
      if (chunk && chunk.metadata && chunk.metadata.actions) {
        if (!message.metadata) {
          message.metadata = {
            actions: [],
          };
        }
        message.metadata.actions = message.metadata.actions || [];
        message.metadata.actions.push(...chunk.metadata.actions);
      }
      let childMessage: any = message.children.find((child: any) => {
        return child.id === chunk.id || child.uuid === chunk.id;
      });
      if (!childMessage) {
        childMessage = {
          id: chunk.id,
          uuid: chunk.id,
          parentMessageId: chunk.metadata?.parentMessageId,
          role: "assistant",
          content: messageState.fullResponse,
          reasoning_content: messageState.reasoning_content,
          messageState: {
            isThinking: messageState.isThinking,
            thinkStart: messageState.thinkStart,
            thinkEnd: messageState.thinkEnd,
          },
          children: [],
          metadata: {
            ...chunk.metadata,
          },
        };
        message.children.push(childMessage);
      }
      if (childMessage.messageState) {
        childMessage.messageState.isThinking = messageState.isThinking;
        childMessage.messageState.thinkStart = messageState.thinkStart;
        childMessage.messageState.thinkEnd = messageState.thinkEnd;
      } else {
        childMessage.messageState = {
          isThinking: messageState.isThinking,
          thinkStart: messageState.thinkStart,
          thinkEnd: messageState.thinkEnd,
        };
      }
      childMessage.content = messageState.fullResponse;
      childMessage.reasoning_content = messageState.reasoning_content;
      childMessage.thinking = messageState.isThinking;
      childMessage.metadata = {
        ...childMessage.metadata,
        ...chunk.metadata,
      }
    },

    // 加载消息
    async loadMessages(conversationId: string) {
      try {
        this.loading = true;
        const chatMessageService = new ChatMessageService();
        const params: any = {};
        if (conversationId.indexOf("-") > 0) {
          params.conversationUuid = conversationId;
        } else {
          params.conversationId = conversationId;
        }

        const pageResult = await chatMessageService.listByPage(params);
        this.messages = this.convertDBMessages(pageResult.content || []);
        return pageResult.content;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 加载会话消息（别名方法，与loadMessages功能相同）
    async loadConversationMessages(conversationId: string) {
      return this.loadMessages(conversationId);
    },

    // 清除当前会话的消息
    async clearCurrentConversation() {
      try {
        this.loading = true;
        
        if (this.currentConversationId) {
          // 清除当前会话的消息
          this.messages = [];
          
          // 更新会话最后更新时间
          const conversation = this.findConversation(this.currentConversationId);
          if (conversation) {
            conversation.updatedAt = formatDateTime(new Date());
            // 重新排序会话列表
            this.sortConversations();
          }
        }
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    convertDBMessages(messages: any) {
      if (!messages) {
        return [];
      }
      return messages.map((message: any) => {
        return this.convertDBMessage(message);
      });

    },
    convertDBMessage(dbMessage: any) {
      const authStore = useAuthStore();
      const isOwn = authStore.isLoginUser(dbMessage.userId);
      const message: any = {
        id: dbMessage.id,
        uuid: dbMessage.uuid,
        parentMessageId: dbMessage.parentMessageId,
        role: dbMessage.role,
        isOwn: isOwn && dbMessage.role?.toLowerCase() === "user",
        content: dbMessage.content?.content,
        reasoning_content: dbMessage.reasoning_content,
        thinking: false,
        messageState: {
          isThinking: dbMessage.messageState?.isThinking,
          thinkStart: dbMessage.messageState?.thinkStart,
          thinkEnd: dbMessage.messageState?.thinkEnd,
        },
        children: this.convertMessageChildren(dbMessage),
        metadata: {
          ...dbMessage.metadata,
        },
      };
      return message;
    },
    convertMessageChildren(dbMessage: any, isOwn: boolean = false) {
      if (!dbMessage.content || !dbMessage.content.groups) {
        return [];
      }
      const groupMap = dbMessage.content.groups || {};
      return Object.keys(groupMap).map((key: any) => {
        return this.convertMessageCompletionChunks(dbMessage, groupMap[key], isOwn);
      })
    },
    convertMessageCompletionChunks(dbMessage: any, chunks: any, isOwn: boolean = false) {
      let reasoning_content = "";
      let content = "";
      let messageState: any = { isThinking: false, thinkStart: dbMessage.content.thinkStart, thinkEnd: dbMessage.content.thinkEnd };
      chunks.forEach((chunk: any) => {
        const choices = chunk.choices || [];
        if (choices.length <= 0) {
          return;
        }
        const delta = choices[0].delta || {};
        if (delta && delta.content) {
          content += delta.content;
        }
        if (delta && delta.reasoning_content) {
          reasoning_content += delta.reasoning_content;
        }
      });

      return {
        id: dbMessage.id,
        uuid: dbMessage.uuid,
        parentMessageId: dbMessage.parentMessageId,
        role: dbMessage.role,
        isOwn: isOwn && isOwn && dbMessage.role?.toLowerCase() === "user",
        content: content,
        reasoning_content: reasoning_content,
        thinking: false,
        messageState
      }
    },

    // 切换会话
    async switchConversation(id: string) {
      try {
        this.loading = true;

        if (
          this.conversations.some((c) => {
            return id && (c.id === id || c.uuid === id);
          })
        ) {
          this.currentConversationId = id;
          await this.loadMessages(id);
        }
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 清除会话消息
    async clearMessages(conversationId: string) {
      try {
        this.loading = true;

        // clearMessages方法不存在于ChatService中，需要检查正确的API
        // await chatService.clearMessages(conversationId);

        // 如果清除的是当前会话的消息
        if (this.currentConversationId === conversationId) {
          this.messages = [];
        }

        // 更新会话最后更新时间
        const conversation = this.findConversation(conversationId);
        if (conversation) {
          conversation.updatedAt = formatDateTime(new Date());
          // 重新排序会话列表
          this.sortConversations();
        }
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 删除会话
    async deleteConversation(id: string) {
      try {
        this.loading = true;
        const chatService = new ChatService();

        // deleteConversation方法不存在于ChatService中，需要检查正确的API
        // await chatService.deleteConversation(id);

        // 更新状态
        this.conversations = this.conversations.filter((c) => c.id !== id);

        // 如果删除的是当前会话，重置当前会话
        if (this.currentConversationId === id) {
          this.currentConversationId = this.conversations[0]?.id as string;
          if (this.currentConversationId) {
            await this.loadMessages(this.currentConversationId);
          }
        }
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新会话
    async updateConversation(
      id: string,
      updates: Partial<any>
    ) {
      try {
        this.loading = true;
        const chatService = new ChatService();

        // updateConversation方法不存在于ChatService中，需要检查正确的API
        // const updated = await chatService.updateConversation(id, updates);
        console.error("updated: ", updates);
        const index = this.conversations.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.conversations[index] = {
            ...this.conversations[index],
            ...updates,
          };
          // 重新排序会话列表
          this.sortConversations();
        }

        return updates;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async handleMessageFeedback(
      message: any,
      state: 'like' | 'dislike'
    ) {
      const chatService = new ChatService();
      // feedback方法不存在于ChatService中，需要检查正确的API
      // chatService.feedback(
      //   this.currentConversationId as string,
      //   message,
      //   state
      // );
      message.feedbackState = state;
    },

    // 搜索会话
    async search(query: string) {
      try {
        this.loading = true;
        const chatService = new ChatService();
        // search方法不存在于ChatService中，需要检查正确的API
        // this.searchResults = await chatService.search(query);
        return this.searchResults;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 更新配置
    async updateOptions(options: Partial<any>) {
      this.options = {
        ...this.options,
        ...options,
      };
    },
    stop() {
      const chatService = new ChatService();
      chatService.stop({ conversationId: this.currentConversationId as string });
    },

    // 重置状态
    reset() {
      this.conversations = [];
      this.currentConversationId = null;
      this.searchResults = null;
      this.messages = [];
      this.streaming = false;
      this.currentStream = null;
      this.toolCalls = [];
      this.toolResults = [];
      this.loading = false;
      this.error = null;
      this.initialized = false;
    },
  },
});
