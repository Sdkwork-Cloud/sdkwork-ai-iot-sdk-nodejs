import type { MessageHandler } from './types'
import { MessageHandlerType } from './types'
import type { SdkworkAIotConfig } from 'sdkwork-ai-iot-sdk'
import type { MessageEventEmitter, MessageEventAdapter } from './event'

/**
 * 消息处理器工厂配置
 */
export interface MessageHandlerFactoryConfig {
  /** AIoT配置 */
  config: SdkworkAIotConfig
  /** 事件发射器 */
  eventEmitter: MessageEventEmitter
  /** 事件适配器 */
  eventAdapter: MessageEventAdapter
}

/**
 * 消息处理器工厂接口
 */
export interface MessageHandlerFactory {
  /**
   * 创建消息处理器
   */
  createHandler(type: MessageHandlerType, factoryConfig: MessageHandlerFactoryConfig): Promise<MessageHandler>
}

/**
 * 消息处理器工厂实现
 */
export class DefaultMessageHandlerFactory implements MessageHandlerFactory {
  /**
   * 创建消息处理器
   */
  async createHandler(type: MessageHandlerType, factoryConfig: MessageHandlerFactoryConfig): Promise<MessageHandler> {
    switch (type) {
      case MessageHandlerType.IOT:
        return await this.createIotHandler(factoryConfig)
      case MessageHandlerType.SSE:
        return this.createSseHandler(factoryConfig)
      case MessageHandlerType.IM:
        return this.createImHandler(factoryConfig)
      default:
        throw new Error(`不支持的消息处理器类型: ${type}`)
    }
  }

  /**
   * 创建IoT消息处理器
   */
  private async createIotHandler(factoryConfig: MessageHandlerFactoryConfig): Promise<MessageHandler> {
    const { IotMessageHandler } = await import('./iot/iot-handler')
    return new IotMessageHandler(
      factoryConfig.config,
      factoryConfig.eventEmitter,
      factoryConfig.eventAdapter
    )
  }

  /**
   * 创建SSE消息处理器
   */
  private async createSseHandler(factoryConfig: MessageHandlerFactoryConfig): Promise<MessageHandler> {
    const { SseMessageHandler } = await import('./sse/sse-handler')
    return new SseMessageHandler(factoryConfig.config, factoryConfig.eventEmitter, factoryConfig.eventAdapter)
  }

  /**
   * 创建IM消息处理器
   */
  private async createImHandler(factoryConfig: MessageHandlerFactoryConfig): Promise<MessageHandler> {
    const { ImMessageHandler } = await import('./im/im-handler')
    return new ImMessageHandler(factoryConfig.config)
  }
}