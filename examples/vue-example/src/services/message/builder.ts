/**
 * 统一消息构建器
 * 处理不同类型的消息输入，包括文本、语音、视频、图片等
 * 支持IM消息和大模型交互消息的不同格式
 * 返回ChatMessageVO格式，方便在store和页面中使用
 */

import { ChatCompletionRole, MessageType } from 'sdkwork-sdk-api-typescript';
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
  GeoPoint,
  Message,
  ChatContext,
  ChatCompletionParam,
  AudioFormat
} from 'sdkwork-sdk-api-typescript';

/**
 * 消息构建器配置
 */
export interface MessageBuilderConfig {
  messageType: MessageType;
  context?: ChatContext;
  metadata?: Map<string, Object>;
  userId?: string;
  conversationId?: string;
  timestamp?: number;
}

/**
 * 统一消息构建器
 * 提供便捷的方法来创建不同类型的消息
 */
export class MessageBuilder {
  static toCompletionParam(message: Message): ChatCompletionParam {
    let text = window.$chat.getTextFromPayload(message.body?.payload as any)

    return {
      messages: [
        {
          role: ChatCompletionRole.user,
          content: text
        }
      ],
      stream: true
    };
  }
  static toCompletionChunk(text: string, metadata: { id: string, channelMsgId: string,model?:string,created?:number }): ChatCompletionChunk {
    const chunk: ChatCompletionChunk = {
      id: metadata.id,
      object: 'chat.completion.chunk',
      created: metadata.created,
      model: metadata.model,
      choices: [
        {
          index: 0,
          delta: {
            role: 'assistant',
            content: text
          }, 
        }
      ], 
    };
    return chunk;
  }

  /**
   * 通用消息创建方法
   * 支持所有类型的消息创建，第一个参数为消息内容对象，第二个参数为配置对象
   */
  static createMessage(params: any, config: MessageBuilderConfig): Message {
    const { messageType } = config;

    switch (messageType) {
      case MessageType.TEXT:
        return this.createTextMessage(params, config);

      case MessageType.AUDIO:
        if (params.url) {
          return this.createAudioMessageByUrl(params, config);
        } else if (params.file) {
          return this.createAudioMessage(params, config);
        }
        break;

      case MessageType.IMAGE:
        if (params.url) {
          return this.createImageMessageByUrl(params, config);
        } else if (params.file) {
          return this.createImageMessage(params, config);
        }
        break;

      case MessageType.VIDEO:
        if (params.url) {
          return this.createVideoMessageByUrl(params, config);
        } else if (params.file) {
          return this.createVideoMessage(params, config);
        }
        break;

      case MessageType.FILE:
        if (params.url) {
          return this.createFileMessageByUrl(params, config);
        } else if (params.file) {
          return this.createFileMessage(params, config);
        }
        break;

      case MessageType.LOCATION:
        if (params.latitude !== undefined && params.longitude !== undefined) {
          return this.createLocationMessage(params, config);
        }
        break;

      case MessageType.MUSIC:
        if (params.title && params.artist && params.url) {
          return this.createMusicMessage(params, config);
        }
        break;

      // case MessageType.CHAT_COMPLETION:
      //   return this.createChatCompletionMessage(params, config);

      // case MessageType.CHAT_COMPLETION_CHUNK:
      //   return this.createChatCompletionChunk(params, config);
    }

    throw new Error(`不支持的消息类型: ${messageType} 或缺少必要的参数`);
  }

  /**
   * 创建文本消息（IM格式）
   */
  static createTextMessage(params: { content: string }, config: MessageBuilderConfig): Message {
    const textContent: MsgTextContent = {
      content: params.content
    };

    const payload: MsgPayload = {
      text: textContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.TEXT, body);

    return {
      ...commonPart
    } as Message;
  }


  /**
   * 创建音频消息（IM格式）- URL方式
   */
  static createAudioMessageByUrl(params: {
    url: string;
    content?: string;
    duration?: number;
    format?: string;
  }, config: MessageBuilderConfig): Message {
    const audioContent: MsgAudioContent = {
      content: params.content,
      resource: {
        url: params.url,
        duration: params.duration
      }
    };

    const payload: MsgPayload = {
      audio: audioContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.AUDIO, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建音频消息（IM格式）- File方式
   */
  static createAudioMessage(params: {
    file: Blob | ArrayBuffer | File;
    content?: string;
    duration?: number;
    format?: AudioFormat;
  }, config: MessageBuilderConfig): Message {
    // 将文件转换为base64 URL
    const audioUrl = this.fileToDataURL(params.file, params.format || 'wav');

    const audioContent: MsgAudioContent = {
      content: params.content,
      resource: {
        url: audioUrl,
        duration: params.duration,
        localFile: params.file,
        format: params.format
      }
    };

    const payload: MsgPayload = {
      audio: audioContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.AUDIO, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建图片消息（IM格式）- URL方式
   */
  static createImageMessageByUrl(params: {
    url: string;
    content?: string;
    width?: number;
    height?: number;
    size?: number;
    caption?: string;
    name?: string;
    extension?: string;
  }, config: MessageBuilderConfig): Message {
    const imageContent: MsgImageContent = {
      content: params.content,
      resource: {
        url: params.url,
        width: params.width,
        height: params.height,
        name: params.name,
        extension: params.extension
      }
    };

    const payload: MsgPayload = {
      image: imageContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.IMAGE, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建图片消息（IM格式）- File方式
   */
  static createImageMessage(params: {
    file: Blob | ArrayBuffer | File;
    content?: string;
    width?: number;
    height?: number;
    caption?: string;
    name?: string;
    extension?: string;
  }, config: MessageBuilderConfig): Message {
    // 将文件转换为base64 URL
    const imageUrl = this.fileToDataURL(params.file, 'image');

    const imageContent: MsgImageContent = {
      content: params.content,
      resource: {
        url: imageUrl,
        width: params.width,
        height: params.height,
        name: params.name,
        extension: params.extension,
        localFile: params.file
      }
    };

    const payload: MsgPayload = {
      image: imageContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.IMAGE, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建视频消息（IM格式）- URL方式
   */
  static createVideoMessageByUrl(params: {
    url: string;
    content?: string;
    duration?: number;
    size?: string | number;
    name?: string;
    extension?: string;
  }, config: MessageBuilderConfig): Message {
    const videoContent: MsgVideoContent = {
      content: params.content,
      resource: {
        url: params.url,
        duration: params.duration,
        size: params.size,
        name: params.name,
        extension: params.extension
      }
    };

    const payload: MsgPayload = {
      video: videoContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.VIDEO, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建视频消息（IM格式）- File方式
   */
  static createVideoMessage(params: {
    file: Blob | ArrayBuffer | File;
    content?: string;
    duration?: number;
    name?: string;
    extension?: string;
  }, config: MessageBuilderConfig): Message {
    // 将文件转换为base64 URL
    const videoUrl = this.fileToDataURL(params.file, 'video');

    const videoContent: MsgVideoContent = {
      content: params.content,
      resource: {
        url: videoUrl,
        duration: params.duration,
        localFile: params.file
      }
    };

    const payload: MsgPayload = {
      video: videoContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.VIDEO, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建文件消息（IM格式）- URL方式
   */
  static createFileMessageByUrl(params: {
    url: string;
    content?: string;
    name: string;
    size: number;
    mimeType?: string;
    extension?: string;
  }, config: MessageBuilderConfig): Message {
    const fileContent: MsgFileContent = {
      content: params.content,
      resource: {
        url: params.url,
        size: params.size,
        name: params.name,
        extension: params.extension
      }
    };

    const payload: MsgPayload = {
      file: fileContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.FILE, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建文件消息（IM格式）- File方式
   */
  static createFileMessage(params: {
    file: Blob | ArrayBuffer | File;
    content?: string;
    name: string;
    mimeType?: string;
    extension?: string;
  }, config: MessageBuilderConfig): Message {
    // 将文件转换为base64 URL
    const fileUrl = this.fileToDataURL(params.file, params.mimeType || 'application/octet-stream');

    // 获取文件大小
    const fileSize = params.file instanceof Blob || params.file instanceof File ? params.file.size : params.file.byteLength;

    const fileContent: MsgFileContent = {
      content: params.content,
      resource: {
        url: fileUrl,
        size: fileSize,
        name: params.name,
        extension: params.extension,
        localFile: params.file
      }
    };

    const payload: MsgPayload = {
      file: fileContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.FILE, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建位置消息（IM格式）
   */
  static createLocationMessage(params: {
    latitude: number;
    longitude: number;
    address?: string;
    name?: string;
  }, config: MessageBuilderConfig): Message {
    const locationPoint: GeoPoint = {
      latitude: params.latitude,
      longitude: params.longitude
    };

    const locationContent: MsgLocationContent = {
      content: params.address || '',
      location: locationPoint
    };

    const payload: MsgPayload = {
      location: locationContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.LOCATION, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建音乐消息（IM格式）
   */
  static createMusicMessage(params: {
    title: string;
    artist: string;
    url: string;
    album?: string;
    duration?: number;
    cover?: string;
  }, config: MessageBuilderConfig): Message {
    const textContent: MsgTextContent = {
      content: `${params.title} - ${params.artist}`
    };

    const payload: MsgPayload = {
      text: textContent
    };

    const body = this.createBaseMessageBody(payload);

    // 合并音乐元数据
    const metadata = new Map<string, Object>();
    if (config.metadata) {
      config.metadata.forEach((value, key) => metadata.set(key, value));
    }
    metadata.set('music', {
      title: params.title,
      artist: params.artist,
      album: params.album,
      duration: params.duration,
      url: params.url,
      cover: params.cover
    });

    const commonPart = this.createCommonPart({ ...config, metadata }, MessageType.TEXT, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建大模型聊天消息
   */
  static createChatCompletionMessage(params: {
    content: string;
    role?: string;
    modelId?: string;
    temperature?: number;
  }, config: MessageBuilderConfig): Message {
    const textContent: MsgTextContent = {
      content: params.content
    };

    const payload: MsgPayload = {
      text: textContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.TEXT, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 创建流式聊天消息块
   */
  static createChatCompletionChunk(params: {
    content: string;
    chunkId?: string;
    isLast?: boolean;
  }, config: MessageBuilderConfig): Message {
    const textContent: MsgTextContent = {
      content: params.content
    };

    const payload: MsgPayload = {
      text: textContent
    };

    const body = this.createBaseMessageBody(payload);
    const commonPart = this.createCommonPart(config, MessageType.TEXT, body);

    return {
      ...commonPart
    } as Message;
  }

  /**
   * 从原始数据创建消息
   */
  static fromRawData(data: any, config: MessageBuilderConfig): Message {
    // 确定消息体
    let body: MessageBody;
    if (data.content && data.content.payload) {
      // IM消息格式
      body = data.content;
    } else if (data.content && data.content.completion) {
      // 大模型消息格式
      body = data.content;
    } else {
      // 默认格式
      body = data.content || { thinkStart: Date.now(), thinkEnd: Date.now() };
    }

    // 使用通用方法创建消息
    const commonPart = this.createCommonPart(config, config.messageType, body);

    return {
      ...data,
      ...commonPart,
      // 保留原始数据中的特定字段，但优先使用通用方法生成的字段
      uuid: data.uuid || commonPart.uuid,
      createdAt: data.createdAt || commonPart.createdAt,
      updatedAt: data.updatedAt || commonPart.updatedAt
    } as Message;
  }

  /**
   * 验证消息格式
   */
  static validateMessage(message: Message): boolean {
    if (!message.type || !message.body) {
      return false;
    }

    const body = message.body as MessageBody;

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
  private static validateIMMessage(message: Message): boolean {
    const body = message.body as MessageBody;
    if (!body.payload) {
      return false;
    }

    const payload = body.payload;
    return !!(payload.text || payload.audio || payload.image || payload.video || payload.file || payload.location || payload.music);
  }

  /**
   * 验证聊天消息
   */
  private static validateChatMessage(message: Message): boolean {
    const body = message.body as MessageBody;
    return !!(body.completion);
  }

  /**
   * 创建基础消息体
   */
  private static createBaseMessageBody(payload: MsgPayload): MessageBody {
    return {
      payload,
      thinkStart: Date.now(),
      thinkEnd: Date.now()
    };
  }
  /**
  * 创建消息的通用部分
  */
  private static createCommonPart(config: MessageBuilderConfig, messageType: MessageType, body: MessageBody): Partial<Message> {
    const currentTime = window.$date.format(new Date());

    // 简化 ChatContext 字段映射
    const contextFields = this.mapChatContextFields(config.context);

    return {
      uuid: window.$uuid(),
      type: messageType,
      body: body,
      conversationId: config.conversationId,
      sendAt: currentTime,
      metadata: config.metadata,
      createdAt: currentTime,
      updatedAt: currentTime,
      ...contextFields
    };
  }

  /**
   * 映射 ChatContext 字段到消息字段
   */
  private static mapChatContextFields(context?: ChatContext): Partial<Message> {
    if (!context) return {};

    const fields: Partial<Message> = {};

    // 定义字段映射规则
    const fieldMappings = {
      conversation_id: 'conversationId',
      user_id: (val: number) => ({ userId: val.toString() }),
      knowledge_base_id: 'knowledgeBaseId',
      agent_id: 'agentId',
      flow_id: 'flowId',
      datasource_id: 'datasourceId',
      indent: 'indent',
      parent_message_id: 'parentMessageId',
      save_audio: 'saveAudio'
    } as const;

    // 遍历映射规则
    Object.entries(fieldMappings).forEach(([contextKey, messageKey]) => {
      const value = context[contextKey as keyof ChatContext];
      if (value !== undefined && value !== null) {
        if (typeof messageKey === 'function') {
          Object.assign(fields, messageKey(value as number));
        } else {
          // 确保 messageKey 是字符串类型
          fields[messageKey as keyof Message] = value as any;
        }
      }
    });

    return fields;
  }

  /**
   * 将文件对象转换为base64 data URL
   */
  private static fileToDataURL(file: Blob | ArrayBuffer | File, mimeType: string): string {
    if (file instanceof ArrayBuffer) {
      // 处理ArrayBuffer
      const base64 = btoa(String.fromCharCode(...new Uint8Array(file)));
      return `data:${mimeType};base64,${base64}`;
    } else {
      // 处理Blob或File - 同步方式，使用URL.createObjectURL
      if (file instanceof Blob) {
        return URL.createObjectURL(file);
      } else {
        // 对于File对象也使用createObjectURL
        return URL.createObjectURL(file);
      }
    }
  }
}