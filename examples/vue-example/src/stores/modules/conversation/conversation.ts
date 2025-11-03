import { defineStore } from "pinia";
import { ConversationService } from "@/services";
import type { ConversationVO } from "@/services";
import type { ConversationStoreState, CreateConversationOptions, UpdateConversationOptions } from "./types";

import {
  isConversationMatch,
  isSameConversation,
  formatDateTime
} from "./conversation-helper";
import { ChatContext, ConversationOpenParam } from "sdkwork-sdk-api-typescript";

export const useConversationStore = defineStore("conversation", {
  state: (): ConversationStoreState => ({
    loading: false,
    error: null,
    initialized: false,

    // 会话初始化为空数组，后续按updatedAt降序排列
    conversations: [],
    currentConversationId: null,
    currentConversation: null,
    searchResults: null,

    // 聊天上下文状态
    chatContext: null,
  }),
  getters: {
    // 基础状态
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isInitialized: (state) => state.initialized,

    // 会话相关
    currentConversation: (state) =>
      state.currentConversationId
        ? state.conversations.find((c) => isConversationMatch(c, state.currentConversationId)) || null
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
        ? state.conversations.find((c) => isConversationMatch(c, state.currentConversationId))?.title
        : "New Conversation",



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
          { pageNumber: 0, pageSize: 20 }
        ); // Default: page 1, 20 items per page
        this.conversations = pageable.content || [];

        // Sort conversations by updatedAt descending
        this.sortConversations();

        // Set the first conversation as active if none is set
        if (this.conversations.length > 0 && !this.currentConversationId) {
          this.currentConversationId = this.conversations[0].id as string;
          this.currentConversation = this.conversations[0];
        }

        this.initialized = true;
      } catch (error) {
        this.error = error as Error;

      } finally {
        this.loading = false;
      }
    },

    // 加载更多会话
    async loadMoreConversations(pageNumber: number, pageSize: number = 20) {
      try {
        this.loading = true;
        const conversationService = new ConversationService();

        const pageResult = await conversationService.listByPage(
          {},
          { pageNumber, pageSize: pageSize }
        );
        
        // 如果是第一页，替换数据；否则追加数据
        if (pageNumber === 0) {
          this.conversations = pageResult.content || [];
        } else {
          this.conversations = [
            ...this.conversations,
            ...(pageResult.content || []),
          ];
        }
        this.sortConversations();
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 排序会话列表
    async sortConversations() {
      this.conversations.sort(
        (a, b) =>
          window.$date.parse(b.updatedAt as string).getTime() -
          window.$date.parse(a.updatedAt as string).getTime()
      );
    },

    // 创建会话（远程）
    async createConversationRemote(options?: CreateConversationOptions) {
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

    // 内部更新会话方法
    async _updateConversation(conversation: ConversationVO) {
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

    // 检查是否为相同会话
    isSameConversation(c1: ConversationVO, c2: ConversationVO) {
      return isSameConversation(c1, c2);
    },
    async open(agentId: string | number, chatContext?: ChatContext) {
      const conversationService = new ConversationService();
      const params: ConversationOpenParam = {
        agentId: agentId,
        ...chatContext
      }
      const conversation = await conversationService.open(params);
      this._updateConversation(conversation);
      
      // 设置当前会话
      this.currentConversationId = conversation.id as string;
      this.currentConversation = conversation;
      
      return conversation;
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
        this.currentConversation = conversation;

        return conversation;
      } catch (error) {
        this.error = error as Error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 查找会话
    findConversation(id: string) {
      return this.conversations.find((c) => isConversationMatch(c, id));
    },

    // 查找当前会话
    findCurrentConversation() {
      return this.findConversation(this.currentConversationId as string);
    },

    // 切换会话
    async switchConversation(id: string) {
      try {
        this.loading = true;

        if (this.conversations.some((c) => isConversationMatch(c, id))) {
          this.currentConversationId = id;
          this.currentConversation = this.findConversation(id) || null;
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

        // 更新状态
        this.conversations = this.conversations.filter((c) => c.id !== id);

        // 如果删除的是当前会话，重置当前会话
        if (this.currentConversationId === id) {
          this.currentConversationId = this.conversations[0]?.id as string;
          this.currentConversation = this.conversations[0] || null;
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
      updates: UpdateConversationOptions
    ) {
      try {
        this.loading = true;
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

    // 更新会话最后更新时间
    async updateConversationTimestamp(conversationId: string) {
      const conversation = this.findConversation(conversationId);
      if (conversation) {
        conversation.updatedAt = formatDateTime(new Date());
        // 重新排序会话列表
        this.sortConversations();
      }
    },

    // 设置聊天上下文
    setChatContext(context: ChatContext | null) {
      this.chatContext = context;
    },

    // 获取聊天上下文
    getChatContext(): ChatContext | null {
      return this.chatContext;
    },
    /**
     * 更新聊天上下文
     * 使用传入的部分上下文更新现有上下文，确保会话ID一致性
     */
    updateChatContext(context: Partial<ChatContext>): ChatContext | null {
      const currentConversationId = this.currentConversationId;

      // 如果当前没有上下文，创建一个新的并确保会话ID一致
      if (!this.chatContext) {
        this.chatContext = {
          conversation_id: currentConversationId || undefined,
          conversation_uuid: currentConversationId || undefined,
          ...context
        };
      } else {
        // 更新现有上下文，确保会话ID一致
        this.chatContext = {
          ...this.chatContext,
          ...context,
          // 强制更新会话ID以确保一致性
          conversation_id: currentConversationId || this.chatContext.conversation_id,
          conversation_uuid: currentConversationId || this.chatContext.conversation_uuid
        };
      }

      return this.chatContext;
    },

    /**
     * 获取或创建聊天上下文
     * 从currentConversation获取正确的id和uuid，避免混乱
     */
    getOrCreateChatContext(context?: ChatContext | null): ChatContext | null {
      // 获取当前会话的正确id和uuid
      const conversationId = this.currentConversation?.id as string || this.currentConversationId;
      const conversationUuid = this.currentConversation?.uuid as string || this.currentConversationId;

      // 如果已有上下文，检查会话ID是否一致
      if (this.chatContext) {
        // 如果当前会话ID与上下文中的会话ID不一致，更新上下文
        if (conversationId &&
          this.chatContext.conversation_id !== conversationId) {
          this.chatContext = {
            ...this.chatContext,
            conversation_id: conversationId,
            conversation_uuid: conversationUuid || undefined
          };
        }

        return this.chatContext;
      }

      // 如果传入的上下文有效，使用它
      if (context) {
        this.chatContext = context;

        // 确保传入的上下文与当前会话ID一致
        if (conversationId &&
          this.chatContext.conversation_id !== conversationId) {
          this.chatContext = {
            ...this.chatContext,
            conversation_id: conversationId,
            conversation_uuid: conversationUuid || undefined
          };
        }

        return this.chatContext;
      }

      // 创建默认上下文，关联当前会话
      const defaultContext: ChatContext = {
        conversation_id: conversationId || undefined,
        conversation_uuid: conversationUuid || undefined,
        // 其他字段可以根据需要设置默认值
      };

      this.chatContext = defaultContext;
      return this.chatContext;
    },

    // 合并聊天上下文
    mergeChatContext(newContext: Partial<ChatContext>) {
      if (this.chatContext) {
        this.chatContext = {
          ...this.chatContext,
          ...newContext,
        };
      } else {
        this.chatContext = newContext as ChatContext;
      }
    },

    // 重置状态
    reset() {
      this.conversations = [];
      this.currentConversationId = null;
      this.currentConversation = null;
      this.searchResults = null;
      this.chatContext = null;
    },
  },
});