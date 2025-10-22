/**
 * 统一消息构建器
 * 处理不同类型的消息输入，包括文本、语音、视频、图片等
 * 支持IM消息和大模型交互消息的不同格式
 * 返回ChatMessageVO格式，方便在store和页面中使用
 */

import { MessageType } from 'sdkwork-sdk-api-typescript';
import type {
  MessageBody,
  MsgPayload,
  ChatCompletion,
  ChatCompletionChunk,
  MsgTextContent,
  MsgAudioContent,
  MsgVideoContent,
  MsgImageContent,
  MsgFileContent,
  MsgLocationContent,
  MsgMusicContent,
  GeoPoint
} from 'sdkwork-sdk-api-typescript';
import type { ChatMessageVO } from '@/services/src';

/**
 * 消息构建器配置
 */
export interface MessageBuilderConfig {
  messageType: MessageType;
  conversationId?: string;
  userId?: string;
  timestamp?: number;
  metadata?: Map<string, Object>;
}

/**
 * 统一消息构建器
 * 提供便捷的方法来创建不同类型的消息
 */
export class MessageBuilder {
  /**
   * 创建文本消息（IM格式）
   */
  static createTextMessage(text: string, config: MessageBuilderConfig): ChatMessageVO {
    const textContent: MsgTextContent = {
      content: text
    };

    const payload: MsgPayload = {
      text: textContent
    };

    const body: MessageBody = {
      payload, 
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    return {
      uuid: window.$uuid(),
      type: MessageType.TEXT as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata: config.metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 创建音频消息（IM格式）- ArrayBuffer方式
   */
  static createAudioMessage(audioData: ArrayBuffer, config: MessageBuilderConfig & { duration?: number; format?: string }): ChatMessageVO {
    // 将ArrayBuffer转换为base64字符串
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData)));
    const audioUrl = `data:audio/${config.format || 'wav'};base64,${base64Audio}`;

    const audioContent: MsgAudioContent = {
      content: audioUrl,
      resource: {
        url: audioUrl,
        duration: config.duration
      }
    };

    const payload: MsgPayload = {
      audio: audioContent
    };

    const body: MessageBody = {
      payload, 
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    return {
      uuid: window.$uuid(),
      type: MessageType.AUDIO as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata: config.metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 创建音频消息（IM格式）- URL方式
   */
  static createAudioMessageByUrl(audioUrl: string, config: MessageBuilderConfig & { duration?: number; format?: string }): ChatMessageVO {
    const audioContent: MsgAudioContent = {
      content: audioUrl,
      resource: {
        url: audioUrl,
        duration: config.duration
      }
    };

    const payload: MsgPayload = {
      audio: audioContent
    };

    const body: MessageBody = {
      payload, 
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    return {
      uuid: window.$uuid(),
      type: MessageType.AUDIO as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata: config.metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 创建图片消息（IM格式）
   */
  static createImageMessage(imageUrl: string, config: MessageBuilderConfig & { caption?: string; width?: number; height?: number }): ChatMessageVO {
    const imageContent: MsgImageContent = {
      content: imageUrl,
      resource: {
        url: imageUrl,
        width: config.width,
        height: config.height
      }
    };

    const payload: MsgPayload = {
      image: imageContent
    };

    const body: MessageBody = {
      payload, 
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    return {
      uuid: window.$uuid(),
      type: MessageType.IMAGE as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata: config.metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 创建视频消息（IM格式）
   */
  static createVideoMessage(videoUrl: string, config: MessageBuilderConfig & { duration?: number }): ChatMessageVO {
    const videoContent: MsgVideoContent = {
      content: videoUrl,
      resource: {
        url: videoUrl,
        duration: config.duration
      }
    };

    const payload: MsgPayload = {
      video: videoContent
    };

    const body: MessageBody = {
      payload, 
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    return {
      uuid: window.$uuid(),
      type: MessageType.VIDEO as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata: config.metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 创建文件消息（IM格式）
   */
  static createFileMessage(fileUrl: string, fileName: string, fileSize: number, config: MessageBuilderConfig & { mimeType?: string }): ChatMessageVO {
    const fileContent: MsgFileContent = {
      content: fileUrl,
      resource: {
        url: fileUrl,
        size: fileSize
      }
    };

    const payload: MsgPayload = {
      file: fileContent
    };

    const body: MessageBody = {
      payload, 
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    return {
      uuid: window.$uuid(),
      type: MessageType.FILE as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata: config.metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 创建位置消息（IM格式）
   */
  static createLocationMessage(latitude: number, longitude: number, config: MessageBuilderConfig & { address?: string; name?: string }): ChatMessageVO {
    const locationPoint: GeoPoint = {
      latitude,
      longitude
    };

    const locationContent: MsgLocationContent = {
      content: config.address || '',
      location: locationPoint
    };

    const payload: MsgPayload = {
      location: locationContent
    };

    const body: MessageBody = {
      payload, 
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    return {
      uuid: window.$uuid(),
      type: MessageType.LOCATION as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata: config.metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 创建音乐消息（IM格式）
   */
  static createMusicMessage(title: string, artist: string, url: string, config: MessageBuilderConfig & { album?: string; duration?: number; cover?: string }): ChatMessageVO {
    const textContent: MsgTextContent = {
      content: `${title} - ${artist}`
    };

    const payload: MsgPayload = {
      text: textContent
    };

    const body: MessageBody = {
      payload, 
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    const metadata = new Map<string, Object>();
    if (config.metadata) {
      config.metadata.forEach((value, key) => metadata.set(key, value));
    }
    metadata.set('music', {
      title,
      artist,
      album: config.album,
      duration: config.duration,
      url,
      cover: config.cover
    });

    return {
      uuid: window.$uuid(),
      type: MessageType.TEXT as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 创建大模型聊天消息
   */
  static createChatCompletionMessage(content: string, config: MessageBuilderConfig & { role?: string; modelId?: string; temperature?: number }): ChatMessageVO {
    const textContent: MsgTextContent = {
      content
    };

    const payload: MsgPayload = {
      text: textContent
    };

    const body: MessageBody = {
      payload,  
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    return {
      uuid: window.$uuid(),
      type: MessageType.TEXT as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata: config.metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 创建流式聊天消息块
   */
  static createChatCompletionChunk(content: string, config: MessageBuilderConfig & { chunkId?: string; isLast?: boolean }): ChatMessageVO {
    const textContent: MsgTextContent = {
      content
    };

    const payload: MsgPayload = {
      text: textContent
    };

    const body: MessageBody = {
      payload, 
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };

    return {
      uuid: window.$uuid(),
      type: MessageType.TEXT as MessageType | undefined,
      content: body,
      userId: config.userId,
      conversationId: config.conversationId,
      timestamp: config.timestamp || Date.now(),
      metadata: config.metadata,
      children: [],
      actions: [],
      createdAt: window.$date.format(new Date()),
      updatedAt: window.$date.format(new Date())
    } as ChatMessageVO;
  }

  /**
   * 从原始数据创建消息
   */
  static fromRawData(data: any, config: MessageBuilderConfig): ChatMessageVO {
    if (data.content && data.content.payload) {
      // IM消息格式
      return {
        ...data,
        type: config.messageType,
        userId: config.userId,
        conversationId: config.conversationId,
        timestamp: config.timestamp || Date.now(),
        metadata: config.metadata,
        uuid: data.uuid || window.$uuid(),
        children: data.children || [],
        actions: data.actions || [],
        createdAt: data.createdAt || window.$date.format(new Date()),
        updatedAt: data.updatedAt || window.$date.format(new Date())
      } as ChatMessageVO;
    } else if (data.content && data.content.completion) {
      // 大模型消息格式
      return {
        ...data,
        type: config.messageType,
        userId: config.userId,
        conversationId: config.conversationId,
        timestamp: config.timestamp || Date.now(),
        metadata: config.metadata,
        uuid: data.uuid || window.$uuid(),
        children: data.children || [],
        actions: data.actions || [],
        createdAt: data.createdAt || window.$date.format(new Date()),
        updatedAt: data.updatedAt || window.$date.format(new Date())
      } as ChatMessageVO;
    } else {
      // 默认格式
      return {
        ...data,
        type: config.messageType,
        userId: config.userId,
        conversationId: config.conversationId,
        timestamp: config.timestamp || Date.now(),
        metadata: config.metadata,
        uuid: data.uuid || window.$uuid(),
        children: data.children || [],
        actions: data.actions || [],
        createdAt: data.createdAt || window.$date.format(new Date()),
        updatedAt: data.updatedAt || window.$date.format(new Date())
      } as ChatMessageVO;
    }
  }

  /**
   * 验证消息格式
   */
  static validateMessage(message: ChatMessageVO): boolean {
    if (!message.type || !message.content) {
      return false;
    }

    const body = message.content as MessageBody;

    if (body.payload) {
      return this.validateIMMessage(message);
    } else if (body.completion) {
      return this.validateChatMessage(message);
    }

    return true;
  }

  /**
   * 验证IM消息
   */
  private static validateIMMessage(message: ChatMessageVO): boolean {
    const body = message.content as MessageBody;
    if (!body.payload) {
      return false;
    }

    const payload = body.payload;
    return !!(payload.text || payload.audio || payload.image || payload.video || payload.file || payload.location || payload.music);
  }

  /**
   * 验证聊天消息
   */
  private static validateChatMessage(message: ChatMessageVO): boolean {
    const body = message.content as MessageBody;
    return !!(body.completion);
  }
}