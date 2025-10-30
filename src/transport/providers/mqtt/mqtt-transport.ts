import { BaseTransportProvider, TransportProvider, TransportConfig } from '../../transport'; 
import {
  type RequestProtocol,
  type ResponseProtocol,
  type HelloRequestProtocol,
  type HelloResponseProtocol,
} from '../../../types/protocol';

/**
 * MQTT传输提供者实现
 * 支持MQTT协议的消息传输
 */
export class MqttTransportProvider extends BaseTransportProvider {
  public readonly name = 'mqtt';
  public readonly version = '1.0.0';
  public readonly supported = false; // 暂不支持

  constructor() {
    super();
  }

  async connect(config: any): Promise<void> {
    throw new Error('MQTT transport not implemented yet');
  }

  disconnect(): void {
    throw new Error('MQTT transport not implemented yet');
  }

  sendHello(params: HelloRequestProtocol): void {
    throw new Error('MQTT transport not implemented yet');
  }

  sendMessage(message: RequestProtocol): void {
    throw new Error('MQTT transport not implemented yet');
  }

  sendAudioStream(audioData: ArrayBuffer, protocolVersion?: number): void {
    throw new Error('MQTT transport not implemented yet');
  }

  isConnected(): boolean {
    return false;
  }

  destroy(): void {
    throw new Error('MQTT transport not implemented yet');
  }
}
