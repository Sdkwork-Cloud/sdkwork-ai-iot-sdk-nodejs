import { SdkworkAIoTClient } from './client/client';
import * as Transport from './transport';
import type { SdkworkAIotConfig } from './types';

// 导出主要类
const SDKWorkAIoT = {
  SdkworkAIoTClient,
  Transport,
};

// 使用globalThis进行跨平台全局注册
try {
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).SDKWorkAIoT = SDKWorkAIoT;
  }
} catch (error) {
  // 在某些环境中globalThis可能不可用，静默失败
  console.warn('Failed to register SDK globally:', error);
}

export { SdkworkAIoTClient, SdkworkAIotConfig };
export * from './transport';
export * from './types';
export { IotEventType } from 'sdkwork-sdk-api-typescript';
export default SDKWorkAIoT;
