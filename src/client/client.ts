import { Emitter, EventType } from 'mitt';
import mitt from 'mitt';
import { OpusDecoderWebWorker } from 'opus-decoder';
import { event_message_types } from '../types/event';
import { TransportProvider, TransportConfig } from '../transport';
import { WebSocketTransportProvider } from '../transport/providers';
import {
  SdkworkAIotConfig,
  ControlCommand,
  EventCallback,
  DataCallback,
  ErrorCallback,
  TransportProtocol,
  AuthType,
  ChatFeatures,
  DeviceAudioParams,
  AudioStreamPayload,
} from '../types';
import {
  AIoTClient,
  AIoTClientEvents,
  ConnectionState,
  MessageCallback,
  MessageChunkCallback,
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
import { ChatContext, IotEventType, ListenMode, ListenState, MessageType } from 'sdkwork-sdk-api-typescript';
import { AbortRequestProtocol } from '@/types/protocol/request/handshake/AbortRequestProtocol';

type Events = AIoTClientEvents;

/**
 * SDKWork AIoT Client Main Class
 * Provides core functionality for device connection, voice interaction, data transmission and reception
 */
export class SdkworkAIoTClient implements AIoTClient {
  private transportProvider: TransportProvider;
  private config: SdkworkAIotConfig;
  private emitter: Emitter<Events> = mitt<Events>();
  private isInitialized = false;
  private audioDecoderWorker?: OpusDecoderWebWorker<16000>;
  private protocolEncoder: ProtocolEncoder;
  private protocolDecoder: ProtocolDecoder;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private isReconnecting = false;

  constructor(config: SdkworkAIotConfig) {
    this.config = this.normalizeConfig(config);
    this.transportProvider = this.createTransportProvider();
    this.protocolDecoder = ProtocolCodecFactory.createDecoder(this.config.protocol || 'sdkwork');
    this.protocolEncoder = ProtocolCodecFactory.createEncoder(this.config.protocol || 'sdkwork');
    this.setupEventListeners();
  }



  /**
   * Initialize client
   */
  async initialize(sdkConfig?: SdkworkAIotConfig): Promise<void> {
    // If new config is provided, update configuration and reinitialize
    if (sdkConfig) {
      // Disconnect if already connected
      if (this.isInitialized) {
        this.disconnect();
      }

      // Update configuration
      this.config = this.normalizeConfig(sdkConfig);

      // Recreate transport provider with new config
      this.transportProvider = this.createTransportProvider();
      this.protocolDecoder = ProtocolCodecFactory.createDecoder(this.config.protocol || 'sdkwork');
      this.protocolEncoder = ProtocolCodecFactory.createEncoder(this.config.protocol || 'sdkwork');
      this.setupEventListeners();
    }

    // If already initialized and no new config provided, return early
    if (this.isInitialized) {
      return;
    }

    // Create and initialize Opus decoder Worker
    try {
      this.audioDecoderWorker = new OpusDecoderWebWorker({
        sampleRate: 16000,
        channels: 1,
        forceStereo: false,
        preSkip: 0,
      });

      console.log('Opus decoder worker created, waiting for ready state...');

      // Wait for decoder to be ready
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
  async reconnect(sdkConfig?: SdkworkAIotConfig): Promise<void> {
    console.log('IoT客户端重新连接...');

    // 先断开连接
    this.disconnect();

    // 如果有新的配置，更新配置
    if (sdkConfig) {
      this.config = this.normalizeConfig(sdkConfig);
      this.transportProvider = this.createTransportProvider();
      this.protocolDecoder = ProtocolCodecFactory.createDecoder(this.config.protocol || 'sdkwork');
      this.protocolEncoder = ProtocolCodecFactory.createEncoder(this.config.protocol || 'sdkwork');
      this.setupEventListeners();
    }

    // 重新初始化连接
    await this.initialize();
  }
  /**
   * Disconnect
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
   * Start voice listening
   */
  async startListening(): Promise<void> {
    await this.ensureConnected();

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
   * Stop voice listening
   */
  async stopListening(): Promise<void> {
    await this.ensureConnected();

    const data: ListenEventData = {
      mode: ListenMode.AUTO,
      state: ListenState.STOP,
    };
    const payload: EventPayload = {
      listen: data,
    };
    this.sendEvent(IotEventType.LISTEN, payload);
  }
  async sendHello(
    content: string,
    options: { features?: ChatFeatures; audioParams?: DeviceAudioParams; chatContext: ChatContext }
  ): Promise<void> {
    await this.ensureConnected();

    const protocol: HelloRequestProtocol = {
      type: 'hello',
      features: options.features || this.config.features,
      audio_params: options.audioParams || this.config.audioParams,
      chat_context: options.chatContext,
      text: content,
    };
    this.transportProvider.sendMessage(protocol);
  }
  async abort(optins: {reason: string }): Promise<void> {
    await this.ensureConnected();
    const protocol: AbortRequestProtocol = {
      type: 'abort',
      reason: optins.reason
    };
    this.transportProvider.sendMessage(protocol);
  }
  async enter(options: { chatContext: ChatContext }): Promise<void> {
    await this.ensureConnected(); 
    const protocol: EventRequestProtocol = {
      type: 'event',
      event_type: IotEventType.ENTER,
      chat_context: options.chatContext,
    };
    this.transportProvider.sendMessage(protocol);
  }
  async exit(options: { chatContext: ChatContext }): Promise<void> {
    await this.ensureConnected();

    const protocol: EventRequestProtocol = {
      type: 'event',
      event_type: IotEventType.EXIT,
      chat_context: options.chatContext,
    };
    this.transportProvider.sendMessage(protocol);
  }
  /**
   * Send audio data
   */
  async sendAudioStream(audioData: ArrayBuffer, protocolVersion?: number, chatContext?: ChatContext): Promise<void> {
    await this.ensureConnected();

    this.transportProvider.sendAudioStream(audioData, protocolVersion, chatContext);
  }
  /**
   * Send message
   */
  async send(message: Message | string, chatContext: ChatContext): Promise<void> {
    console.error('send iot message', message, this.isInitialized);

    await this.ensureConnected();

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
    console.error('send iot message after', message, this.isInitialized);
    const protocol: ImMessageRequestProtocol = {
      type: 'im',
      message: message as Message,
      chat_context: chatContext,
    };
    console.error('send protocol============', protocol);
    this.transportProvider.sendMessage(protocol);
  }
  /**
   * Send event
   * @param type
   * @param payload
   */
  async sendEvent(type: IotEventType, payload: EventPayload): Promise<void> {
    await this.ensureConnected();

    const protocol: EventRequestProtocol = {
      type: 'listen',
      event_type: type,
      payload: payload,
    };
    this.transportProvider.sendMessage(protocol);
  }
  /**
   * Send protocol
   * @param protocol
   */
  async sendProtocol(protocol: RequestProtocol): Promise<void> {
    await this.ensureConnected();

    this.transportProvider.sendMessage(protocol);
  }
  /**
   * Get connection state
   */
  getConnectionState(): ConnectionState {
    return this.transportProvider.getConnectionState();
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.transportProvider.isConnected();
  }

  /**
   * Register event listener
   */
  onEvent(callback: EventCallback): void {
    this.emitter.on("event", callback);
  }

  /**
   * Remove event listener
   */
  offEvent(callback: EventCallback): void {
    this.emitter.off("event", callback);
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
  onMessageChunk(callback: MessageChunkCallback): void {
    this.emitter.on('message-chunk', callback);
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
   * Validate authentication configuration
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
   * Detect authentication type
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
   * Get authorization token
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
   * Normalize configuration
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
   * Create transport provider instance
   */
  private createTransportProvider(): TransportProvider {
    const protocol = this.config.transport || 'websocket';

    switch (protocol) {
      case 'websocket':
        return new WebSocketTransportProvider();

      case 'mqtt':
        // TODO: Implement MQTT transport provider
        throw new Error('MQTT transport provider not yet implemented');

      case 'wukongim':
        // TODO: Implement WukongIM transport provider
        throw new Error('WukongIM transport provider not yet implemented');

      case 'http':
        // TODO: Implement HTTP transport provider
        throw new Error('HTTP transport provider not yet implemented');

      default:
        throw new Error(`Unsupported transport protocol: ${protocol}`);
    }
  }
  /**
   * Get transport configuration
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
   * Set up event listeners
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
  private isIncommingMessageChunk(protocol: ResponseProtocol) {
    const types = ['message-chunk'];
    if (types.includes(protocol.type)) {
      return true;
    }
    return false;
  }
  /**
   * Handle incoming message
   */
  private handleIncomingMessage(protocol: ResponseProtocol): void {
    try {
      if (this.isIncommingMessageChunk(protocol)) {
        this.emit('message-chunk', protocol);
        return;
      }
      if (this.isIncommingEvent(protocol)) {
        this.emit('event', protocol);
        return;
      }
      if (this.isIncommingMessage(protocol)) {
        this.emit('message', protocol);
        return;
      }
      if (this.isIncommingMcpToolCall(protocol as McpResponseProtocol)) {
        this.emit('mcp-tool-call', protocol);
        return;
      }

      this.emit('message', protocol);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Handle audio data
   */
  private handleAudioData(data: any): void {
    this.decodeAudioOpus(data);
  }
  private async decodeAudioOpus(data: Blob): Promise<void> {
    if (!this.audioDecoderWorker) {
      console.error('Audio decoder worker not initialized');
      return;
    }

    try {
      // Check data format to ensure it's valid audio data
      if (!data) {
        console.warn('Audio data is null or undefined');
        return;
      }

      let audioData: Uint8Array;

      // Handle Blob data
      if (
        data.constructor?.name === 'Blob' ||
        (typeof Blob !== 'undefined' && data instanceof Blob)
      ) {
        // Convert Blob to ArrayBuffer
        const arrayBuffer = await (data as Blob).arrayBuffer();
        audioData = new Uint8Array(arrayBuffer);
      } else if (typeof data === 'object' && (data as any).data) {
        // If data is contained in an object, extract the data field
        const dataObj = data as any;
        audioData =
          dataObj.data instanceof Uint8Array ? dataObj.data : new Uint8Array(dataObj.data);
      } else {
        console.warn('Unsupported audio data format:', data);
        return;
      }

      // Check if data is valid
      if (!audioData || audioData.length === 0) {
        console.warn('Empty audio data');
        return;
      }

      await this.audioDecoderWorker
        .decodeFrame(audioData)
        .then((decoded: any) => {

          if (decoded && decoded.channelData && decoded.channelData.length > 0) {
            // Convert Float32Array to Int16Array (PCM format)
            const float32Data = decoded.channelData[0];
            const int16Data = this.float32ToInt16(float32Data);
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
   * Handle error
   */
  private handleError(error: Error): void {
    this.emitter.emit('error', error);
  }

  /**
   * Ensure client is initialized
   * If not initialized, attempts auto-initialization
   */
  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.warn('Client not initialized. Attempting to auto-initialize...');
      await this.initialize();
      console.log('Auto-initialization successful');
    } catch (error) {
      console.error('Auto-initialization failed:', error);
      throw new Error(`Client not initialized and auto-initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensure client is connected and ready to send messages
   * If not connected, attempts reconnection with retry mechanism
   */
  private async ensureConnected(): Promise<void> {
    // Check if transport is already connected
    if (this.transportProvider.isConnected()) {
      return;
    }

    // If already reconnecting, throw error
    if (this.isReconnecting) {
      throw new Error('Client is currently reconnecting, please try again later');
    }

    this.isReconnecting = true;
    this.reconnectAttempts = 0;

    try {
      while (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.warn(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

        try {
          // Use reconnect() which handles both initialization and connection
          await this.reconnect();

          // Check if reconnection was successful
          if (this.transportProvider.isConnected()) {
            console.log('Reconnection successful');
            this.isReconnecting = false;
            this.reconnectAttempts = 0;
            return;
          }
        } catch (error) {
          console.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error);

          // If this is the last attempt, throw the error
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            throw new Error(`Failed to reconnect after ${this.maxReconnectAttempts} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }

          // Wait before next attempt (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 10000);
          console.log(`Waiting ${delay}ms before next reconnection attempt...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } finally {
      this.isReconnecting = false;
    }
    throw new Error(`Failed to establish connection after ${this.maxReconnectAttempts} attempts`);
  }

  /**
   * Convert Float32Array to Int16Array (PCM format)
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
