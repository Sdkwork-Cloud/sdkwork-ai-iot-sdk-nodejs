import { defineStore } from "pinia";
import { ChatService } from "@/services";
import { ChatCompletionParam, ChatContext, Message, MessageRole, MessageType } from "sdkwork-sdk-api-typescript";
import { useAuthStore } from "../auth";
import { useConversationStore } from "../conversation";
import { useMessageStore } from "../message";
import type { ChatStoreState } from "./types";
import {
    DefaultMessageHandlerFactory,
    MessageHandlerFactoryConfig
} from "@/services/message/factory";
import type { MessageEventEmitter, MessageEventAdapter } from "@/services/message/event";
import { MessageHandlerType } from "@/services/message/types";
import { SdkworkAIotConfig } from "sdkwork-ai-iot-sdk";
import { MessageBuilder } from "@/services/message";
import { appConfig } from "@/config/app";
import { IStreamAudioPlayer, SdkworkStreamAudioPlayer } from "@/core/audio/player";
import { useRecorderStore } from "../recorder";
export const useChatStore = defineStore("chat", {
    state: (): ChatStoreState => ({
        loading: false,
        error: null,
        initialized: false,

        // 聊天配置
        options: {
            model: undefined,
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stream: true,
            modalities: ["text", "audio"]
        },

        // 消息处理器相关状态
        currentHandlerType: MessageHandlerType.IOT, // 默认使用IoT
        messageHandler: null,
        handlerConnected: false,
        audioParams: {
            sample_rate: 16000,
            channels: 1,
            format: "opus",
            frame_duration: 60
        },
        _streamPlayer: null,

        // 语音状态管理
        speakState: 'IDLE',

        // 聊天模式状态
        currentChatMode: null as 'text' | 'voice' | 'rtc' | null
    }),
    getters: {
        // 基础状态
        isLoading: (state) => state.loading,
        getError: (state) => state.error,
        isInitialized: (state) => state.initialized,

        // 配置状态
        currentOptions: (state) => state.options,

        // 消息处理器相关getter
        currentMessageHandler: (state) => state.messageHandler,
        isHandlerConnected: (state) => state.handlerConnected,

        // 语音状态相关getter
        isSpeaking: (state) => state.speakState === 'SPEAKING',
        isListening: (state) => state.speakState === 'LISTENING',
        isIdle: (state) => state.speakState === 'IDLE',
    },
    actions: {
        // 初始化store
        async initialize() {
            try {
                this.loading = true;

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
                this.messageHandler = await factory.createHandler(this.currentHandlerType || MessageHandlerType.IOT, factoryConfig);

                // 初始化处理器
                await this.messageHandler?.initialize();

                // 更新连接状态
                this.handlerConnected = this.messageHandler?.isConnected();
            } catch (error) {
                this.error = error as Error;
                throw error;
            }
        },
        // 进入聊天会话 - 统一入口，支持配置对象
        async enterChat(options: { mode?: 'text' | 'voice' | 'rtc'; forceReconnect?: boolean } = {}) {
            try {
                this.loading = true;

                const { mode = 'text', forceReconnect = false } = options;

                // 确保消息处理器已初始化
                if (!this.messageHandler || forceReconnect) {
                    console.log('初始化消息处理器...');
                    await this.initializeMessageHandler();
                }

                // 验证消息处理器连接状态
                if (!this.handlerConnected || forceReconnect) {
                    console.warn('消息处理器未连接，尝试重新连接...');
                    await this.messageHandler?.initialize();
                    this.handlerConnected = this.messageHandler?.isConnected() || false;
                }

                if (!this.handlerConnected) {
                    throw new Error('消息处理器连接失败');
                }

                // 初始化音频播放器
                console.log('初始化音频播放器...');
                await this.createStreamPlayer();

                // 根据模式调用不同的初始化方法
                switch (mode) {
                    case 'voice':
                        await this.initVoiceRoom();
                        break;
                    case 'rtc':
                        await this.initRtcRoom();
                        break;
                    case 'text':
                        // 文本模式不需要特殊初始化
                        break;
                }

                // 加载当前会话的消息
                console.log('加载当前会话消息...');
                await this.loadCurrentConversationMessages();

                // 更新当前聊天模式
                this.currentChatMode = mode;
 
            } catch (error) {
                this.error = error as Error;
                console.error(`进入聊天会话失败:`, error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 退出聊天会话 - 统一入口
        async exitChat() {
            try {
                this.loading = true;

                // 根据当前模式调用不同的退出方法
                const previousMode = this.currentChatMode;
                switch (previousMode) {
                    case 'voice':
                        await this.exitVoiceRoom();
                        break;
                    case 'rtc':
                        await this.exitRtcRoom();
                        break;
                    case 'text':
                        // 文本模式不需要特殊退出处理
                        break;
                }

                // 停止语音监听
                this.stopVoiceListening();

                // 停止音频播放器
                if (this._streamPlayer) {
                    await this._streamPlayer.stopStream();
                    this._streamPlayer.destroy();
                    this._streamPlayer = null;
                }

                // 停止recorder流数据监听
                this.stopListeningToRecorderStream();

                // 销毁消息处理器
                if (this.messageHandler) {
                    await this.messageHandler.destroy();
                    this.messageHandler = null;
                    this.handlerConnected = false;
                }

                // 重置语音状态
                this.speakState = 'IDLE';

                // 重置聊天模式
                this.currentChatMode = null;

                console.log(`成功退出${previousMode}聊天会话`);
            } catch (error) {
                this.error = error as Error;
                console.error('退出聊天会话失败:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 切换聊天模式 - 仅更新模式状态，不重新初始化资源
        async switchChatMode(mode: 'text' | 'voice' | 'rtc') {
            try {
                this.loading = true;

                // 先退出当前模式
                const previousMode = this.currentChatMode;
                if (previousMode) {
                    switch (previousMode) {
                        case 'voice':
                            await this.exitVoiceRoom();
                            break;
                        case 'rtc':
                            await this.exitRtcRoom();
                            break;
                        case 'text':
                            // 文本模式不需要特殊退出处理
                            break;
                    }
                }

                // 进入新模式
                switch (mode) {
                    case 'voice':
                        await this.initVoiceRoom();
                        break;
                    case 'rtc':
                        await this.initRtcRoom();
                        break;
                    case 'text':
                        // 文本模式不需要特殊初始化
                        break;
                }

                // 更新当前聊天模式
                this.currentChatMode = mode;

                console.log(`成功从${previousMode}切换到${mode}模式`);
            } catch (error) {
                this.error = error as Error;
                console.error(`切换聊天模式失败:`, error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 语音房间初始化方法
        async initVoiceRoom() {
            try {
                console.log('初始化语音房间...');

                // 开始监听recorder流数据
                console.log('开始监听recorder流数据...');
                this.listenToRecorderStream();

                console.log('语音房间初始化完成');

            } catch (error) {
                console.error('初始化语音房间失败:', error);
                throw error;
            }
        },

        // RTC房间初始化方法
        async initRtcRoom() {
            try {
                console.log('初始化RTC房间...');

                // RTC模式特定的初始化逻辑
                console.log('RTC房间初始化完成 - 暂不处理RTC相关操作');

            } catch (error) {
                console.error('初始化RTC房间失败:', error);
                throw error;
            }
        },

        // 进入语音房间 - 供语音组件调用，处理recorder相关初始化
        async enterVoiceRoom(options: {
            enableWave?: boolean
            waveContainer?: HTMLElement
            sampleRate?: number
            format?: 'pcm' | 'mp3' | 'wav'
            realtime?: boolean
            hello?:{
                send: boolean
                text?: string
            }
        } = {}) {
            try {
                console.log('进入语音房间，开始recorder初始化...');

                // 参数默认值
                const {
                    enableWave = true,
                    waveContainer = null,
                    sampleRate = 16000,
                    format = 'pcm',
                    realtime = true
                } = options;

                // 获取recorder store
                const recorderStore = useRecorderStore();

                // 初始化recorder配置
                await recorderStore.updateConfig({
                    realtime,
                    sampleRate,
                    format,
                    enableWave,
                    maxDuration: 0,
                    autoSendInterval: 0
                });

                // 设置wave容器
                if (waveContainer && enableWave) {
                    recorderStore.setWaveContainer(waveContainer);
                }

                // 开始recorder录制
                await recorderStore.startRecording({
                    realtime,
                    enableWave,
                    waveContainer: waveContainer as any,
                    sampleRate,
                    format,
                });

                console.log('语音房间recorder初始化完成');
                if(options.hello?.send){
                    this.sendHello(options.hello?.text||'')
                }

            } catch (error) {
                console.error('进入语音房间失败:', error);
                throw error;
            }
        },

        // 退出语音房间 - 供语音组件调用
        async exitVoiceRoom() {
            try {
                console.log('退出语音房间，开始recorder销毁...');

                // 获取recorder store
                const recorderStore = useRecorderStore();

                // 停止recorder录制
                await recorderStore.stopRecording();

                // 销毁recorder
                recorderStore.destroyRecorder();

                console.log('语音房间recorder销毁完成');

            } catch (error) {
                console.error('退出语音房间失败:', error);
                throw error;
            }
        },

        // 进入实时通信房间 - 仅打印日志
        async enterRtcRoom() {
            console.log('进入RTC房间 - 暂不处理RTC相关操作');
        },

        // 退出实时通信房间 - 仅打印日志
        async exitRtcRoom() {
            console.log('退出RTC房间 - 暂不处理RTC相关操作');
        },


        // 加载当前会话的消息
        async loadCurrentConversationMessages() {
            try {
                const conversationStore = useConversationStore();
                const messageStore = useMessageStore();

                // 获取当前会话
                const currentConversation = conversationStore.currentConversation;
                if (!currentConversation) {
                    console.warn('没有当前会话，跳过加载消息');
                    return;
                }

                // 加载消息
                await messageStore.loadMessages({
                    conversationId: currentConversation.id || currentConversation.uuid as any,
                    page: 1,
                    size: 20
                });

                console.log('成功加载当前会话消息');
            } catch (error) {
                console.error('加载当前会话消息失败:', error);
                throw error;
            }
        },


        // 创建流式音频播放器
        async createStreamPlayer(): Promise<IStreamAudioPlayer> {
            try {
                // 如果已经存在播放器实例，先销毁
                if (this._streamPlayer) {
                    this._streamPlayer.destroy();
                    this._streamPlayer = null;
                }

                this._streamPlayer = new SdkworkStreamAudioPlayer();
                this._streamPlayer.startStream(this.audioParams?.sample_rate, this.audioParams?.channels)
                console.log('流式音频播放器创建成功');
                return this._streamPlayer;
            } catch (error) {
                console.error('创建流式音频播放器失败:', error);
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

        // 获取设备信息
        getDeviceInfo() {
            // 生成基于浏览器指纹的设备ID
            const generateDeviceId = () => {
                // 使用浏览器指纹信息生成唯一ID
                const fingerprint = [
                    navigator.userAgent,
                    navigator.language,
                    navigator.hardwareConcurrency || '',
                    screen.width,
                    screen.height,
                    screen.colorDepth,
                    new Date().getTimezoneOffset()
                ].join('|');

                // 简单的哈希函数生成设备ID
                let hash = 0;
                for (let i = 0; i < fingerprint.length; i++) {
                    const char = fingerprint.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // 转换为32位整数
                }

                return `web-device-${Math.abs(hash).toString(36)}`;
            };

            // 尝试从localStorage获取已保存的设备ID
            const storedDeviceId = localStorage.getItem('sdkwork-device-id');
            let deviceId = storedDeviceId;

            if (!deviceId) {
                // 如果没有保存的设备ID，生成一个新的
                deviceId = generateDeviceId();
                // 保存到localStorage以便下次使用
                localStorage.setItem('sdkwork-device-id', deviceId);
            }

            return {
                deviceId: deviceId,
                deviceType: 'web',
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screenResolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
        },

        // 获取IoT配置
        async getIotConfig(): Promise<SdkworkAIotConfig> {
            // 获取真实的设备信息
            const deviceInfo = this.getDeviceInfo();

            // 从authStore获取token
            const authStore = useAuthStore();
            const token = authStore.token || 'your-auth-token';

            // 生成客户端ID（基于设备ID和随机数）
            const clientId = `${deviceInfo.deviceId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

            // 根据SdkworkAIotConfig接口调整配置
            return {
                // 必需字段
                deviceId: deviceInfo.deviceId,
                clientId: clientId,

                // 认证配置 - 使用authorization字段
                authorization: token,

                // 连接配置
                baseUrl: appConfig.websocketBaseURL,
                transport: 'websocket',
                protocol: 'sdkwork',
                timeout: 30000,
                maxRetries: 5,

                // 调试配置
                debug: true,
                logLevel: 'info',

                // 可选配置
                apiKey: undefined,
                authType: undefined,
                audioParams: {
                    format: 'opus',
                    // inputFormat: 'pcm',服务端input format
                    // outputFormat: 'opus',服务端output format
                    sample_rate: 16000,
                    channels: 1,
                    frame_duration: 60
                },
                features: undefined
            };
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
                adaptMessageChunkReceived: (message: any) => ({ type: 'MESSAGE_CHUNK_RECEIVED', message }),
                adaptAudioStreamReceived: (audio: any) => ({ type: 'AUDIO_STREAM_RECEIVED', audio }),
                adaptDataReceived: (data: any) => ({ type: 'DATA_RECEIVED', data }),
                adaptToolCallReceived: (tool: any) => ({ type: 'TOOL_CALL_RECEIVED', tool }),
                adaptErrorOccurred: (error: any) => ({ type: 'ERROR_OCCURRED', error }),
                adaptIotEventReceived: (type: any, event: any) => ({ type: 'IOT_EVENT_RECEIVED', eventType: type, event })
            } as unknown as MessageEventAdapter;
        },

        // 处理事件
        handleEvent(event: any) {
            const messageStore = useMessageStore();

            switch (event.type) {
                case 'CONNECTION_CHANGE':
                    this.handlerConnected = event.state.connected;
                    break;
                case 'MESSAGE_RECEIVED':
                    // 将接收到的消息转发给message store处理
                    messageStore.handleReceivedMessage(event.message);
                    break;
                case 'MESSAGE_CHUNK_RECEIVED':
                    console.error('event==============', event)
                    // 将接收到的消息块转发给message store处理
                    messageStore.handleReceivedChunk(event.message);
                    break;
                case 'AUDIO_STREAM_RECEIVED':
                    const data = event.audio.data;
                    if (data.channelData) {
                        const audioData: Int16Array = data.channelData[0];
                        // 检查channelData是否有效
                        if (!audioData || !audioData.length) {
                            console.warn('channelData无效，跳过播放')
                            return
                        }
                        this._streamPlayer?.appendStreamData(audioData)
                    }
                    // 将接收到的音频流转发给message store处理
                    messageStore.handleReceivedAudioStream(event.audio);
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
                    console.error('event====event=======IOT_EVENT_RECEIVED===', event)
                    break;
                default:
                    console.error('event====unknow==========', event)
                    break;
            }
        },
        async sendHello(text: string, context?: ChatContext){
               const conversationStore = useConversationStore()
                context = conversationStore.getOrCreateChatContext(context)
                if (context) {
                    context.chat_options = this.options
                }
                context = this.filterContext(context)
              // 发送消息
                this.messageHandler?.sendHello(text, {
                    chatContext: context,  
                    audioParams: this.audioParams as any
                });
        },
        async sendText(text: string, context?: ChatContext) {
            const conversationStore = useConversationStore()
            context = conversationStore.getOrCreateChatContext(context)
            if (context) {
                context.chat_options = this.options
            }
            context = this.filterContext(context)
            // 使用消息构建器创建IM格式消息
            const message = MessageBuilder.createTextMessage({
                content: text
            }, {
                messageType: MessageType.TEXT,
                context: context
            });
            return this.sendMessage(message, context)
        },


        // 发送消息（通过消息处理器）
        async sendMessage(message: Message, context?: ChatContext) {
            try {
                this.loading = true;

                // 发送消息前重启音频播放器
                await this.restartPlayer();
                console.error('restartPlayer', message)
                const conversationStore = useConversationStore()
                context = conversationStore.getOrCreateChatContext(context)
                if (context) {
                    context.chat_options = this.options
                }
                context = this.filterContext(context)
                // 保存消息到本地存储
                const messageStore = useMessageStore();
                console.error('messageStore.saveMessage', message)
                await messageStore.saveMessage(message, context);
                // 检查消息处理器连接状态
                if (!this.messageHandler) {
                    // 即使未连接也保存到本地，用于重发 
                    throw new Error('消息处理器未连接');
                }

                // 发送消息
                this.messageHandler.send(message, context);
                return message.uuid;
            } catch (error) {
                this.error = error as Error;
                console.error('sendMessage error', error)
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // 发送音频数据
        async sendAudioStream(audioData: ArrayBuffer | Blob, context?: ChatContext) {
            try {
                this.loading = true;

                // 检查消息处理器连接状态
                if (!this.messageHandler || !this.handlerConnected) {
                    throw new Error('消息处理器未连接');
                }
                const conversationStore = useConversationStore()
                context = conversationStore.getOrCreateChatContext(context)
                if (context) {
                    context.chat_options = this.options
                }
                context = this.filterContext(context)
                let audioDataBuffer: ArrayBuffer;
                if (audioData instanceof Blob) {
                    audioDataBuffer = await audioData.arrayBuffer()
                } else {
                    audioDataBuffer = audioData
                }
                // 发送音频数据
                if (this.messageHandler.sendAudioStream) { 
                    this.messageHandler.sendAudioStream(audioData, 1, context);
                }
            } catch (error) {
                this.error = error as Error;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        filterContext(context: ChatContext, overrideOptions?: Partial<ChatContext>){
            // 创建新的 context 对象，避免修改原始对象
            const filteredContext = { ...context }
            
            // 如果有覆盖选项，则应用覆盖
            if (overrideOptions) {
                Object.assign(filteredContext, overrideOptions)
            }
            
            return filteredContext
        },

        // 重启音频播放器
        async restartPlayer() {
            try {
                if (this._streamPlayer) {
                    await this._streamPlayer.pause(true)
                    await this._streamPlayer.resume()
                }
            } catch (error) {
                console.error('重启音频播放器失败:', error);
            }
        },
        async startPlayer() {
            try {
                if (this._streamPlayer) {
                    // 重新开始播放流
                    await this._streamPlayer.startStream(this.audioParams?.sample_rate, this.audioParams?.channels);
                    console.log('音频播放器重启成功');
                }
            } catch (error) {
                console.error('重启音频播放器失败:', error);
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

        // 重置状态
        reset() {
            this.messageHandler = null;
            this.handlerConnected = false;
            this.speakState = 'IDLE';
        },

        // 完整的生命周期清理
        async cleanup() {
            try {
                console.log('开始清理chatStore资源...');

                // 停止语音监听
                this.stopVoiceListening();

                // 停止recorder流数据监听
                this.stopListeningToRecorderStream();

                // 停止并销毁音频播放器
                if (this._streamPlayer) {
                    await this._streamPlayer.stopStream();
                    this._streamPlayer.destroy();
                    this._streamPlayer = null;
                }

                // 销毁消息处理器
                if (this.messageHandler) {
                    await this.messageHandler.destroy();
                    this.messageHandler = null;
                    this.handlerConnected = false;
                }

                // 重置所有状态
                this.reset();
                this.error = null;
                this.initialized = false;

                console.log('chatStore资源清理完成');
            } catch (error) {
                console.error('chatStore资源清理失败:', error);
                throw error;
            }
        },

        // 语音状态管理
        setSpeakState(state: SpeakState) {
            this.speakState = state;
        },

        // 设置语音状态为说话中
        setSpeaking() {
            this.speakState = 'SPEAKING';
        },

        // 设置语音状态为监听中
        setListening() {
            this.speakState = 'LISTENING';
        },

        // 设置语音状态为空闲
        setIdle() {
            this.speakState = 'IDLE';
        },

        // 监听recorder的流数据事件
        listenToRecorderStream() {
            // 如果 window.$on 不存在，直接返回
            if (!window.$on) {
                console.warn('window.$on 未定义，无法监听流数据事件');
                return;
            }

            // 使用 window.$on 监听流数据事件，绑定正确的this上下文
            window.$on('recorder:stream-data', this.handleRecorderStreamData.bind(this));
            console.log('已开始监听recorder流数据事件');
        },

        // 处理recorder流数据
        handleRecorderStreamData(data: ArrayBuffer) {
            try { 

                // 检查消息处理器是否连接
                if (!this.messageHandler) {
                    console.error('消息处理器未初始化，请先调用enterChat方法初始化聊天会话');
                    return;
                }

                // 检查连接状态
                if (!this.handlerConnected) {
                    console.warn('消息处理器未连接，当前无法处理音频数据');
                    return;
                }
 
                // 发送流数据到消息处理器
                this.sendAudioStream(data);
            } catch (error) {
                console.error('处理recorder流数据事件时发生错误:', error);
            }
        },

        // 停止监听recorder的流数据事件
        stopListeningToRecorderStream() {
            // 如果 window.$off 不存在，直接返回
            if (!window.$off) {
                console.warn('window.$off 未定义，无法取消监听流数据事件');
                return;
            }

            // 使用 window.$off 取消监听流数据事件
            window.$off('recorder:stream-data', this.handleRecorderStreamData);
            console.log('已停止监听recorder流数据事件');
        },
    },
});