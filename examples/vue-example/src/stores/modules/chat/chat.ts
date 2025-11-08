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
        currentChatMode: null as 'text' | 'voice' | 'rtc' | null,

        // 日志计数器
        _audioStreamLogCounter: 0,
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
                console.error(`初始化聊天Store失败:`, error);
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
            } catch (error) {
                this.error = error as Error;
                console.error(`初始化消息处理器失败:`, error);
            }
        },
        // 进入聊天会话 - 统一入口，支持配置对象
        async enterChat(options: { mode?: 'text' | 'voice' | 'rtc'; forceReconnect?: boolean } = {}) {
            try {
                this.loading = true;

                const { mode = 'text', forceReconnect = false } = options;

                // 确保消息处理器已初始化 - 消息处理器是应用级别的单例
                if (!this.messageHandler) {
                    console.log('初始化消息处理器...');
                    await this.initializeMessageHandler();
                } else {
                    // 消息处理器已存在，连接应该始终保持活跃
                    console.log('消息处理器已存在，连接保持活跃');
                    // 验证连接状态，但不进行重连操作
                    if (!this.messageHandler.isConnected()) {
                        console.warn('消息处理器连接异常，但整体应用连接应保持活跃');
                    }
                }
                // 调用MessageHandler的enter方法，进入聊天
                if (this.messageHandler) {
                    const conversationStore = useConversationStore();
                    const chatContext = conversationStore.getOrCreateChatContext();
                    if (chatContext) {
                        this.messageHandler.enter({ chatContext });
                        console.log('调用MessageHandler enter方法，进入聊天会话');
                    }
                }

                // 创建音频播放器（只在进入聊天时创建）
                console.log('创建音频播放器...');
                try {
                    await this.createStreamPlayer();
                    console.log('音频播放器创建成功');
                } catch (error) {
                    console.error('音频播放器创建失败:', error);
                    throw error; // 抛出错误，让调用方知道初始化失败
                }

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
                // 调用MessageHandler的exit方法，退出聊天
                if (this.messageHandler) {
                    const conversationStore = useConversationStore();
                    const chatContext = conversationStore.getOrCreateChatContext();
                    if (chatContext) {
                        this.messageHandler.exit({ chatContext });
                        console.log('调用MessageHandler exit方法，退出聊天会话');
                    }
                }
                // 销毁音频播放器（只在退出聊天时销毁）
                if (this._streamPlayer) {
                    await this.destroyStreamPlayer();
                }
                // 停止语音监听
                this.stopVoiceListening();



                // 停止recorder流数据监听
                this.stopListeningToRecorderStream();

                // 注意：消息处理器连接保持不断开，因为整体应用需要接收消息
                // 只重置聊天相关的状态，不操作消息处理器连接

                // 重置语音状态
                this.speakState = 'IDLE';

                // 重置聊天模式
                this.currentChatMode = null;

                console.log(`成功退出${previousMode}聊天会话，消息处理器连接保持活跃`);
            } catch (error) {
                this.error = error as Error;
                console.error('退出聊天会话失败:', error);
            } finally {
                this.loading = false;
            }
        },

        // 切换聊天模式 - 仅更新模式状态，不重新初始化消息处理器
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

                // 进入新模式 - 不重新初始化消息处理器，只处理模式相关资源
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
                throw error; // 重新抛出错误
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
            }
        },

        // 进入语音房间 - 供语音组件调用，处理recorder相关初始化
        async enterVoiceRoom(options: {
            enableWave?: boolean
            waveContainer?: HTMLElement
            sampleRate?: number
            format?: 'pcm' | 'mp3' | 'wav'
            realtime?: boolean
            hello?: {
                send: boolean
                text?: string
            }
        } = {}) {
            let recorderInitialized = false;

            try {
                console.log('进入语音房间，开始recorder初始化...');
                  // 调用MessageHandler的enter方法，进入聊天
                if (this.messageHandler) {
                    const conversationStore = useConversationStore();
                    const chatContext = conversationStore.getOrCreateChatContext();
                    if (chatContext) {
                        chatContext.chat_options={
                            ...chatContext.chat_options,
                            modalities:['text','audio']
                        }
                        this.messageHandler.enter({ chatContext });
                        console.log('调用MessageHandler enter方法，进入聊天会话');
                    }
                }
                if(this._streamPlayer?.isPlayEnd()||this._streamPlayer?.isStop()){
                    await this.createStreamPlayer()
                }
                // 确保播放器处于可播放状态
                console.log('检查音频播放器状态...');
                if (this._streamPlayer) {
                    console.log('播放器存在，检查状态:', {
                        isPlayable: this._streamPlayer.isPlayable(),
                        isStop: this._streamPlayer.isStop(),
                        isPause: this._streamPlayer.isPause(),
                        isPlayEnd: this._streamPlayer.isPlayEnd()
                    });
                    
                    // 如果播放器处于播放结束状态，需要重新启动
                    if (this._streamPlayer.isPlayEnd()) {
                        console.log('播放器处于播放结束状态，重新启动播放器...');
                        await this._streamPlayer.start(this.audioParams?.sample_rate, this.audioParams?.channels);
                        console.log('播放器重启完成');
                    }
                } else {
                    console.error('音频播放器不存在，语音房间无法正常工作');
                    throw new Error('音频播放器未初始化');
                }
                
                // 无论recorder初始化是否成功，都尝试发送hello消息
                if (options.hello?.send) {
                    try {
                        console.log('尝试发送hello消息...');
                        //await this.sendHello(options.hello?.text || '');
                        console.log('hello消息发送完成');
                    } catch (helloError) {
                        console.error('发送hello消息失败:', helloError);
                        // 记录hello发送错误，但不影响整体流程
                    }
                }
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

                // 设置wave容器
                if (waveContainer && enableWave) {
                    recorderStore.setWaveContainer(waveContainer);
                }

                // 开始recorder录制，配置参数在startRecording中统一处理
                // 使用更安全的错误处理，避免Promise reject中断整个流程
                try {
                    await recorderStore.startRecording({
                        realtime,
                        enableWave,
                        waveContainer: waveContainer as any,
                        sampleRate,
                        format,
                    });
                    console.log('语音房间recorder初始化完成');
                    recorderInitialized = true;
                } catch (error) {
                    console.error('recorder录制失败，但继续执行后续操作:', error);
                    this.error = error as Error;
                    // 记录错误但不中断流程
                }

            } catch (error) {
                console.error('进入语音房间失败，recorder初始化异常:', error);
                // 记录错误但不阻止后续操作
                this.error = error as Error;
            }


            // 返回recorder初始化状态，供调用方参考
            return { recorderInitialized };
        },

        // 退出语音房间 - 供语音组件调用
        async exitVoiceRoom() {
            try { 
                 if (this.messageHandler) {
                    const conversationStore = useConversationStore();
                    const chatContext = conversationStore.getOrCreateChatContext();
                    if (chatContext) {
                        chatContext.chat_options={
                            ...chatContext.chat_options,
                            modalities:['text']
                        }
                        this.messageHandler.exit({ chatContext }); 
                    }
                }

                // 获取recorder store
                const recorderStore = useRecorderStore();

                // 停止recorder录制
                await recorderStore.stopRecording();

                // 销毁recorder
                recorderStore.destroyRecorder();

                console.log('语音房间recorder销毁完成');

                // 重置播放器状态，确保重新进入时播放器可用
                if (this._streamPlayer) {
                    console.log('重置音频播放器状态...');
                    // 停止播放器但不销毁，因为播放器在exitChat中统一销毁
                    await this._streamPlayer.pause();
                    this._streamPlayer.clearInput();
                    console.log('音频播放器状态重置完成');
                }

            } catch (error) {
                console.error('退出语音房间失败:', error);
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
            }
        },


        // 创建流式音频播放器
        async createStreamPlayer(): Promise<IStreamAudioPlayer | any> {
            try {  
                // 如果播放器已存在，先完全销毁再创建
                if (this._streamPlayer) {
                    console.log('播放器已存在，先销毁旧播放器');
                    await this.destroyStreamPlayer(); 
                }
                
                // 创建新的播放器实例
                console.log('创建新的音频播放器实例');
                this._streamPlayer = new SdkworkStreamAudioPlayer({realtime:true});
                
                // 启动播放器流
                await this._streamPlayer.start(this.audioParams?.sample_rate, this.audioParams?.channels);
                
                console.log('流式音频播放器创建成功，当前状态:', {
                    isPlayable: this._streamPlayer.isPlayable(),
                    isStop: this._streamPlayer.isStop(),
                    isPause: this._streamPlayer.isPause(),
                    isPlayEnd: this._streamPlayer.isPlayEnd()
                });
                
                return this._streamPlayer;
            } catch (error) {
                console.error('创建流式音频播放器失败:', error);
                this._streamPlayer = null;
                throw error; // 重新抛出错误，让调用方处理
            }
        },

        // 销毁流式音频播放器
        async destroyStreamPlayer(): Promise<void> {
            try {
                if (this._streamPlayer) {
                    // 先停止所有播放操作
                    await this._streamPlayer.pause(); 
                    this._streamPlayer.clearInput();
                    this._streamPlayer.stop();
                    
                    // 确保播放器完全停止后再置为null
                    await new Promise(resolve => setTimeout(resolve, 100));
                    this._streamPlayer = null;
                    console.log('流式音频播放器销毁成功');
                }
            } catch (error) {
                console.error('销毁流式音频播放器失败:', error);
                this._streamPlayer = null;
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
                    // 连接状态变更事件，不再需要维护handlerConnected字段
                    break;
                case 'MESSAGE_RECEIVED':
                    // 将接收到的消息转发给message store处理
                    messageStore.handleReceivedMessage(event.message);
                    break;
                case 'MESSAGE_CHUNK_RECEIVED': 
                    // 将接收到的消息块转发给message store处理
                    messageStore.handleReceivedChunk(event.message);
                    break;
                case 'AUDIO_STREAM_RECEIVED':
                    // 增加日志输出频率控制
                    this._audioStreamLogCounter++;

                    // 每10次音频流事件输出一次日志
                    if (this._audioStreamLogCounter % 100 === 1) {
                        console.log(`[AUDIO_STREAM_RECEIVED] 接收到第${this._audioStreamLogCounter}次音频流数据`, {
                            hasData: !!event.audio?.data,
                            hasChannelData: !!(event.audio?.data?.channelData),
                            channelCount: event.audio?.data?.channelData?.length || 0
                        });
                    }

                    const data = event.audio.data;
                    if (data.channelData) {
                        const audioData: Int16Array = data.channelData[0];
                        // 检查channelData是否有效
                        if (!audioData || !audioData.length) {
                            console.warn('channelData无效，跳过播放')
                            return
                        }

                        // 检查播放器状态，确保可以播放
                        if (this._streamPlayer && this._streamPlayer.isPlayable()) {
                            this._streamPlayer.appendStreamData(audioData);
                        } else {
                            console.warn('音频播放器不可用，丢弃音频数据。播放器状态:', {
                                playerExists: !!this._streamPlayer,
                                isPlayable: this._streamPlayer ? this._streamPlayer.isPlayable() : false,
                                isStop: this._streamPlayer ? this._streamPlayer.isStop() : 'N/A',
                                isPause: this._streamPlayer ? this._streamPlayer.isPause() : 'N/A',
                                isPlayEnd: this._streamPlayer ? this._streamPlayer.isPlayEnd() : 'N/A'
                            });
                            // 不尝试重新创建播放器，应该在进入语音房间时确保播放器正常工作
                        }
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
        async sendHello(text: string, context?: ChatContext) {
            const conversationStore = useConversationStore()
            const chatContext = conversationStore.getOrCreateChatContext(context)
            if (chatContext) {
                chatContext.chat_options = this.options
            }
            const filteredContext = chatContext ? this.filterContext(chatContext) : this.createDefaultChatContext()
            // 发送消息
            this.messageHandler?.sendHello(text, {
                chatContext: filteredContext,
                audioParams: this.audioParams as any
            });
        },
        async sendText(text: string, context?: ChatContext) {
            const conversationStore = useConversationStore()
            const chatContext = conversationStore.getOrCreateChatContext(context)
            if (chatContext) {
                chatContext.chat_options = this.options
            }
            const filteredContext = chatContext ? this.filterContext(chatContext) : this.createDefaultChatContext()
            // 使用消息构建器创建IM格式消息
            const message = MessageBuilder.createTextMessage({
                content: text
            }, {
                messageType: MessageType.TEXT,
                context: filteredContext
            });
            return this.sendMessage(message, filteredContext)
        },


        // 发送消息（通过消息处理器）
        async sendMessage(message: Message, context?: ChatContext) {
            try {
                this.loading = true;

                // 智能检查播放器状态，只在需要时重启
                await this.ensurePlayerReady();
                const userStore = useUserStore()
                const currentUser = userStore.currentUser
                message.sender = {
                    id: currentUser?.id, 
                    name: currentUser?.nickname, 
                    face: currentUser?.faceImage
                }

                const conversationStore = useConversationStore()
                const chatContext = conversationStore.getOrCreateChatContext(context)
                if (chatContext) {
                    chatContext.chat_options = this.options
                }
                const filteredContext = chatContext ? this.filterContext(chatContext) : this.createDefaultChatContext()
                // 保存消息到本地存储
                const messageStore = useMessageStore();
                await messageStore.saveMessage(message, filteredContext);
                // 检查消息处理器连接状态
                if (!this.messageHandler) {
                    // 即使未连接也保存到本地，用于重发  
                    console.error('消息处理器未连接')
                    return;
                }

                // 发送消息
                this.messageHandler.send(message, context || this.createDefaultChatContext());
                return message.uuid;
            } catch (error) {
                this.error = error as Error;
                console.error('sendMessage error', error)
            } finally {
                this.loading = false;
            }
        },

        // 发送音频数据
        async sendAudioStream(audioData: ArrayBuffer | Blob, context?: ChatContext) {
            try {
                this.loading = true;

                // 检查消息处理器连接状态
                if (!this.messageHandler || !this.messageHandler.isConnected()) {
                    console.error('消息处理器未连接')
                    return;
                }
                const conversationStore = useConversationStore()
                const chatContext = conversationStore.getOrCreateChatContext(context)
                if (chatContext) {
                    chatContext.chat_options = this.options
                }
                const filteredContext = chatContext ? this.filterContext(chatContext) : this.createDefaultChatContext()
                let audioDataBuffer: ArrayBuffer;
                if (audioData instanceof Blob) {
                    audioDataBuffer = await audioData.arrayBuffer()
                } else {
                    audioDataBuffer = audioData
                }
                // 发送音频数据
                if (this.messageHandler.sendAudioStream) {
                    this.messageHandler.sendAudioStream(audioData, 1, context || this.createDefaultChatContext());
                }
            } catch (error) {
                this.error = error as Error;
                console.error('sendAudioStream error', error)
            } finally {
                this.loading = false;
            }
        },

        filterContext(context: ChatContext, overrideOptions?: Partial<ChatContext>) {
            // 创建新的 context 对象，避免修改原始对象
            const filteredContext = { ...context }

            // 如果有覆盖选项，则应用覆盖
            if (overrideOptions) {
                Object.assign(filteredContext, overrideOptions)
            }

            return filteredContext
        },

        // 检查播放器状态，确保可以播放
        async ensurePlayerReady(): Promise<void> {
            if (!this._streamPlayer) {
                // 播放器不存在，抛出错误，因为应该在enterChat时创建
                console.error('音频播放器不存在，请先调用enterChat方法初始化聊天会话');
                throw new Error('音频播放器未初始化');
            }

            // 检查播放器状态，确保可以播放
            console.log('当前播放器状态:', {
                isStop: this._streamPlayer.isStop(),
                isPause: this._streamPlayer.isPause(),
                isPlayEnd: this._streamPlayer.isPlayEnd(), 
            });

            // 如果播放器处于停止状态但未播放结束，需要启动
            if (this._streamPlayer.isStop() && !this._streamPlayer.isPlayEnd()) {
                console.log('播放器处于停止状态，启动播放器');
                await this._streamPlayer.start(this.audioParams?.sample_rate, this.audioParams?.channels);
            }  
        },
 
        async startPlayer() {
            try {
                if (!this._streamPlayer) {
                    console.error('音频播放器不存在，请先调用enterChat方法初始化聊天会话');
                    return;
                }
                
                // 重新开始播放流
                await this._streamPlayer.start(this.audioParams?.sample_rate, this.audioParams?.channels);
                console.log('音频播放器重启成功');
            } catch (error) {
                console.error('重启音频播放器失败:', error);
            }
        },
        // 开始语音监听
        startVoiceListening() {
            if (this.messageHandler && this.messageHandler.isConnected()) {
                this.messageHandler.startListening();
            }
        },

        // 停止语音监听
        stopVoiceListening() {
            if (this.messageHandler && this.messageHandler.isConnected()) {
                this.messageHandler.stopListening();
            }
        },

        // 重置状态
        reset() {
            this.messageHandler = null;
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

                // 销毁音频播放器
                if (this._streamPlayer) {
                    await this.destroyStreamPlayer();
                }

                // 注意：消息处理器连接保持不断开，因为整体应用需要接收消息
                // 只清理聊天相关的资源，不操作消息处理器连接

                // 重置所有状态
                this.reset();
                this.error = null;
                this.initialized = false;

                console.log('chatStore资源清理完成，消息处理器连接保持活跃');
            } catch (error) {
                console.error('chatStore资源清理失败:', error);

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
                if (!this.messageHandler?.isConnected()) {
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

        /**
         * 创建默认聊天上下文
         */
        createDefaultChatContext(): ChatContext {
            const conversationStore = useConversationStore()
            const conversationId = conversationStore.currentConversationId

            return {
                conversation_id: conversationId || undefined,
                conversation_uuid: conversationId || undefined,
                // 其他默认字段可以根据需要添加
            }
        },
    },
});