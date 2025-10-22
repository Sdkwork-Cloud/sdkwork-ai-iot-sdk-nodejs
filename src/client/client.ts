import { Emitter, EventType } from 'mitt';
import mitt from 'mitt';
import { OpusDecoderWebWorker } from 'opus-decoder';
import { event_message_types } from '../types/event';
import { TransportProvider, TransportConfig } from '../transport';
import { WebSocketTransportProvider } from '../transport/providers';
import {
  SdkworkAIotConfig,
  IoTEvent,
  SensorData,
  ControlCommand,
  EventCallback,
  DataCallback,
  ErrorCallback,
  TransportProtocol,
  AuthType,
  IotEventType,
  ListenMode,
  ListenState,
  ChatContext,
  ChatFeatures,
  DeviceAudioParams,
  MessageType,
  AudioStreamPayload,
} from '../types';
import {
  AIoTClient,
  AIoTClientEvents,
  ConnectionState,
  MessageCallback,
  ToolCallback,
} from '../types/client';
import { Message } from '../types/';
import { ProtocolDecoder, ProtocolEncoder } from '../protocol/codec';
import { ProtocolCodecFactory } from '../protocol';
import {
  EventPayload,
  EventRequestProtocol,
  HelloRequestProtocol,
  ImMessageRequestProtocol,
  ImMessageResponseProtocol,
  ListenEventData,
  McpResponseProtocol,
  RequestProtocol,
  ResponseProtocol,
} from '../types/protocol';

type Events = AIoTClientEvents;

/**
 * SDKWork AIoT客户端主类
 * 提供设备连接、语音交互、数据收发等核心功能
 */
export class SdkworkAIoTClient implements AIoTClient {
  private transportProvider: TransportProvider;
  private config: SdkworkAIotConfig;
  private emitter: Emitter<Events> = mitt<Events>();
  private isInitialized = false;
  private audioDecoderWorker?: OpusDecoderWebWorker<16000>;
  private protocolEncoder: ProtocolEncoder;
  private protocolDecoder: ProtocolDecoder;

  constructor(config: SdkworkAIotConfig) {
    this.config = this.normalizeConfig(config);
    this.transportProvider = this.createTransportProvider();
    this.protocolDecoder = ProtocolCodecFactory.createDecoder(this.config.protocol || 'sdkwork');
    this.protocolEncoder = ProtocolCodecFactory.createEncoder(this.config.protocol || 'sdkwork');
    this.setupEventListeners();
  }

  /**
   * 初始化客户端
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // 创建并初始化Opus解码Worker
    try {
      this.audioDecoderWorker = new OpusDecoderWebWorker({
        sampleRate: 16000,
        channels: 1,
        forceStereo: false,
        preSkip: 0,
      });

      console.log('Opus decoder worker created, waiting for ready state...');

      // 等待解码器准备就绪
      await this.audioDecoderWorker.ready;

      console.log('Opus decoder worker is ready');
    } catch (error) {
      console.error('Failed to initialize audio decoder worker:', error);
      this.handleError(error as Error);
      throw new Error('Failed to initialize audio decoder worker');
    }

    const transportConfig = this.getTransportConfig();

    try {
      await this.transportProvider.connect(transportConfig);
      this.isInitialized = true;
      this.emit('connected', {
        type: 'connected',
        deviceId: this.config.deviceId,
        data: {},
        timestamp: new Date(),
      });
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.transportProvider) {
      this.transportProvider.disconnect();
    }
    this.isInitialized = false;
    this.emit('disconnected', {
      type: 'disconnected',
      deviceId: this.config.deviceId,
      data: {},
      timestamp: new Date(),
    });
  }

  /**
   * 开始语音监听
   */
  startListening(): void {
    if (!this.isInitialized) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    const data: ListenEventData = {
      mode: ListenMode.AUTO,
      state: ListenState.START,
    };
    const payload: EventPayload = {
      listen: data,
    };
    this.sendEvent(IotEventType.LISTEN, payload);
  }

  /**
   * 停止语音监听
   */
  stopListening(): void {
    if (!this.isInitialized) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    const data: ListenEventData = {
      mode: ListenMode.AUTO,
      state: ListenState.STOP,
    };
    const payload: EventPayload = {
      listen: data,
    };
    this.sendEvent(IotEventType.LISTEN, payload);
  }
  sendHello(
    content: string,
    options: { features?: ChatFeatures; audioParams?: DeviceAudioParams; chatContext: ChatContext }
  ): void {
    if (!this.isInitialized) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    const protocol: HelloRequestProtocol = {
      type: 'hello',
      features: options.features || this.config.features,
      audio_params: options.audioParams || this.config.audioParams,
      chat_context: options.chatContext,
      text: content,
    };
    this.transportProvider.sendMessage(protocol);
  }
  /**
   * 发送语音数据
   */
  sendAudioData(audioData: ArrayBuffer, protocolVersion?: number): void {
    if (!this.isInitialized) {
      throw new Error('Client not initialized. Call initialize() first.');
    }

    this.transportProvider.sendAudioData(audioData, protocolVersion);
  }
  /**
   * 发送消息
   */
  send(message: Message | string, chatContext: ChatContext): void {
    if (!this.isInitialized) {
      throw new Error('Client not initialized. Call initialize() first.');
    }
    if (typeof message === 'string') {
      message = {
        type: MessageType.TEXT as MessageType | undefined,
        body: {
          payload: {
            text: {
              content: message,
            },
          },
        },
      } as Message;
    }
    const protocol: ImMessageRequestProtocol = {
      type: 'im',
      message: message as Message,
      chat_context: chatContext,
    };
    this.transportProvider.sendMessage(protocol);
  }
  /**
   * 发送事件
   * @param type
   * @param payload
   */
  sendEvent(type: IotEventType, payload: EventPayload): void {
    const protocol: EventRequestProtocol = {
      type: 'listen',
      event_type: type,
      payload: payload,
    };
    this.transportProvider.sendMessage(protocol);
  }
  /**
   * 发送协议
   * @param protocol
   */
  sendProtocol(protocol: RequestProtocol): void {
    this.transportProvider.sendMessage(protocol);
  }
  /**
   * 获取连接状态
   */
  getConnectionState(): ConnectionState {
    return this.transportProvider.getConnectionState();
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.transportProvider.isConnected();
  }

  /**
   * Register event listener
   */
  onEvent(eventType: IotEventType, callback: EventCallback): void {
    this.emitter.on(eventType, callback);
  }

  /**
   * Remove event listener
   */
  offEvent(eventType: IotEventType, callback: EventCallback): void {
    this.emitter.off(eventType, callback);
  }

  /**
   * Register audio stream callback
   */
  onAudioStream(callback: (data: AudioStreamPayload) => void): void {
    this.emitter.on('audio-stream', callback);
  }
  /**
   * Register audio callback
   */
  onMessage(callback: MessageCallback): void {
    this.emitter.on('message', callback);
  }
  onToolCall(callback: ToolCallback): void {
    this.emitter.on('tool-call', callback);
  }
  /**
   * Register data callback
   */
  onData(callback: DataCallback): void {
    this.emitter.on('data', callback);
  }
  /**
   * Remove data callback
   */
  offData(callback: DataCallback): void {
    this.emitter.off('data', callback);
  }

  /**
   * Register error callback
   */
  onError(callback: ErrorCallback): void {
    this.emitter.on('error', callback);
  }
  /**
   * Remove error callback
   */
  offError(callback: ErrorCallback): void {
    this.emitter.off('error', callback);
  }

  /**
   * Destroy client
   */
  async destroy(): Promise<void> {
    this.disconnect();
    this.emitter.all.clear();
    this.transportProvider.destroy();
    if (this.audioDecoderWorker) {
      await this.audioDecoderWorker.free();
      this.audioDecoderWorker = undefined;
    }
  }

  /**
   * 验证认证配置
   */
  private validateAuthConfig(config: SdkworkAIotConfig): void {
    const hasApiKey = !!config.apiKey;
    const hasAuthorization = !!config.authorization;

    if (!hasApiKey && !hasAuthorization) {
      throw new Error('Either apiKey or authorization must be provided for authentication');
    }

    if (hasApiKey && hasAuthorization) {
      console.warn(
        'Both apiKey and authorization provided. Using authorization for better security.'
      );
    }

    if (!config.deviceId) {
      throw new Error('deviceId is required for authentication');
    }
  }

  /**
   * 检测认证类型
   */
  private detectAuthType(config: SdkworkAIotConfig): AuthType {
    // 如果用户明确指定了认证类型，使用指定的类型
    if (config.authType) {
      return config.authType;
    }

    // 自动检测认证类型
    if (config.authorization) {
      return 'authorization';
    }

    if (config.apiKey) {
      return 'apiKey';
    }

    // 默认使用apiKey（向后兼容）
    return 'apiKey';
  }

  /**
   * 获取认证令牌
   */
  private getAuthorization(): string {
    const authType = this.config.authType || this.detectAuthType(this.config);

    switch (authType) {
      case 'authorization':
        if (!this.config.authorization) {
          throw new Error('Authorization token is required for authorization auth type');
        }
        return this.config.authorization;

      case 'apiKey':
        if (!this.config.apiKey) {
          throw new Error('API Key is required for apiKey auth type');
        }
        return this.config.apiKey;

      default:
        throw new Error(`Unsupported auth type: ${authType}`);
    }
  }

  /**
   * 标准化配置
   */
  private normalizeConfig(config: SdkworkAIotConfig): SdkworkAIotConfig {
    // 验证认证配置
    this.validateAuthConfig(config);

    return {
      ...config,
      authType: this.detectAuthType(config),
      transport: config.transport || 'websocket',
      baseUrl: config.baseUrl || 'wss://api.sdkwork.com/iot/ws/v1/xiaozhi/1',
      timeout: config.timeout || 10000,
      maxRetries: config.maxRetries || 3,
      audioParams: {
        format: 'opus',
        sample_rate: 16000,
        channels: 1,
        frame_duration: 60,
        ...config.audioParams,
      },
      features: {
        mcp: true,
        ...config.features,
      },
      logLevel: config.logLevel || (config.debug ? 'debug' : 'error'),
    };
  }

  /**
   * 创建传输提供者实例
   */
  private createTransportProvider(): TransportProvider {
    const protocol = this.config.transport || 'websocket';

    switch (protocol) {
      case 'websocket':
        return new WebSocketTransportProvider();

      case 'mqtt':
        // TODO: 实现MQTT传输提供者
        throw new Error('MQTT transport provider not yet implemented');

      case 'wukongim':
        // TODO: 实现悟空IM传输提供者
        throw new Error('WukongIM transport provider not yet implemented');

      case 'http':
        // TODO: 实现HTTP传输提供者
        throw new Error('HTTP transport provider not yet implemented');

      default:
        throw new Error(`Unsupported transport protocol: ${protocol}`);
    }
  }
  /**
   * 获取传输配置
   */
  private getTransportConfig(): TransportConfig {
    const authorization = this.getAuthorization();

    return {
      url: this.config.baseUrl!,
      authorization: authorization,
      deviceId: this.config.deviceId,
      clientId: this.config.clientId,
      timeout: this.config.timeout!,
      version: 1,
      audioParams: this.config.audioParams,
      features: this.config.features,
      protocolEncoder: this.protocolEncoder,
      protocolDecoder: this.protocolDecoder,
    };
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    this.transportProvider.on('connected', () => {
      this.emit('transport-connected', {
        type: 'transport-connected',
        deviceId: this.config.deviceId,
        data: {},
        timestamp: new Date(),
      });
    });

    this.transportProvider.on('disconnected', () => {
      this.emit('transport-disconnected', {
        type: 'transport-disconnected',
        deviceId: this.config.deviceId,
        data: {},
        timestamp: new Date(),
      });
    });

    this.transportProvider.on('message', (message: any) => {
      this.handleIncomingMessage(message);
    });

    this.transportProvider.on('audio-data', (data: any) => {
      this.handleAudioData(data);
    });

    this.transportProvider.on('error', (error: string) => {
      this.handleError(new Error(error));
    });
  }
  private isIncommingEvent(message: any) {
    return event_message_types.includes(message.type);
  }
  private isIncommingMcpToolCall(protocol: McpResponseProtocol) {
    const payload = protocol.payload;
    return protocol.type === 'mcp' && payload.method === 'tools/call';
  }
  private isIncommingMessage(protocol: ResponseProtocol) {
    const types = ['im', 'chat'];
    if (types.includes(protocol.type)) {
      return true;
    }
    return true;
  }

  /**
   * 处理接收到的消息
   */
  private handleIncomingMessage(protocol: ResponseProtocol): void {
    try {
      if (this.isIncommingMessage(protocol)) {
        this.emit('message', protocol);
        return;
      }
      if (this.isIncommingMcpToolCall(protocol as McpResponseProtocol)) {
        this.emit('mcp-tool-call', protocol);
        return;
      }
      if (this.isIncommingEvent(protocol)) {
        this.emit('event', protocol);
        return;
      }
      this.emit('message', protocol);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * 处理音频数据
   */
  private handleAudioData(data: any): void {
    console.log('Received audio data for decoding:', data);

    // 检查数据格式并记录详细信息
    if (data) {
      console.log('Audio data details:', {
        type: typeof data,
        constructor: data.constructor?.name,
        isArrayBuffer: data instanceof ArrayBuffer,
        isUint8Array: data instanceof Uint8Array,
        byteLength: data.byteLength || data.length,
        keys: Object.keys(data),
      });

      // 如果是对象，记录其结构
      if (
        typeof data === 'object' &&
        !(data instanceof ArrayBuffer) &&
        !(data instanceof Uint8Array)
      ) {
        console.log(
          'Audio data object structure:',
          JSON.stringify(data, null, 2).substring(0, 500)
        );
      }
    } else {
      console.warn('Audio data is null or undefined');
    }

    this.decodeAudioOpus(data);
  }
  private async decodeAudioOpus(data: Blob): Promise<void> {
    if (!this.audioDecoderWorker) {
      console.error('Audio decoder worker not initialized');
      return;
    }

    try {
      // 检查data格式，确保是有效的音频数据
      if (!data) {
        console.warn('Audio data is null or undefined');
        return;
      }

      // 记录数据格式以便调试
      console.log('Audio data to decode:', {
        dataType: typeof data,
        constructor: data.constructor?.name,
        isBlob: data instanceof Blob,
        size: data.size,
        mimeType: data.type,
      });

      let audioData: Uint8Array;

      // 处理Blob数据
      if (
        data.constructor?.name === 'Blob' ||
        (typeof Blob !== 'undefined' && data instanceof Blob)
      ) {
        // 将Blob转换为ArrayBuffer
        const arrayBuffer = await (data as Blob).arrayBuffer();
        audioData = new Uint8Array(arrayBuffer);
      } else if (typeof data === 'object' && (data as any).data) {
        // 如果数据包含在对象中，提取data字段
        const dataObj = data as any;
        audioData =
          dataObj.data instanceof Uint8Array ? dataObj.data : new Uint8Array(dataObj.data);
      } else {
        console.warn('Unsupported audio data format:', data);
        return;
      }

      // 检查数据是否有效
      if (!audioData || audioData.length === 0) {
        console.warn('Empty audio data');
        return;
      }

      await this.audioDecoderWorker
        .decodeFrame(audioData)
        .then((decoded: any) => {
          console.log('Audio decoding successful:', {
            samplesDecoded: decoded.samplesDecoded,
            sampleRate: decoded.sampleRate,
            channels: decoded.channelData?.length || 1,
          });

          if (decoded && decoded.channelData && decoded.channelData.length > 0) {
            // 将Float32Array转换为Int16Array（PCM格式）
            const float32Data = decoded.channelData[0];
            const int16Data = this.float32ToInt16(float32Data);

            console.log(
              'Audio decoding successful，emit audio-stream,size:',
              int16Data.length,
              'samples'
            );
            this.emitter.emit('audio-stream', {
              type: 'audio-stream',
              format: 'pcm',
              sample_rate: decoded.sampleRate || 16000,
              channels: decoded.channelData.length,
              frame_duration: 60,
              data: {
                channelData: [int16Data],
                samplesDecoded: decoded.samplesDecoded,
                sampleRate: decoded.sampleRate,
              },
            });
          } else {
            console.warn('Decoded audio data is empty or invalid');
          }
        })
        .catch((error: any) => {
          console.error('Audio decoding failed');
          this.handleError(error);
        });
    } catch (error) {
      console.error('Audio decoding error:', error);
      this.handleError(error as Error);
    }
  }
  /**
   * 处理错误
   */
  private handleError(error: Error): void {
    this.emitter.emit('error', error);
  }

  /**
   * 将Float32Array转换为Int16Array（PCM格式）
   */
  private float32ToInt16(float32Array: Float32Array): Int16Array {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      // 将-1.0到1.0的浮点数转换为-32768到32767的整数
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = sample < 0 ? sample * 32768 : sample * 32767;
    }
    return int16Array;
  }

  /**
   * Emit event
   */
  private emit(eventType: string, event: any): void {
    this.emitter.emit(eventType, event);
  }
}

export default SdkworkAIoTClient;
