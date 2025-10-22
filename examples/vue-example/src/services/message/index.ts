/**
 * 消息模块统一导出
 */

export { MessageBuilder } from './builder'; 

export { MessageHandlerType } from './types';
export type { MessageHandler } from './types';

export { DefaultMessageHandlerFactory } from './factory';
export type { MessageHandlerFactoryConfig } from './factory';

export type { MessageEventEmitter, MessageEventAdapter } from './event';
export { MessageEventType } from './event';