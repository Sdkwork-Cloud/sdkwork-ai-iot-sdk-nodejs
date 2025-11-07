import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { IotEventType } from 'sdkwork-ai-iot-sdk'
import type { SdkworkAIoTClient, SdkworkAIotConfig } from 'sdkwork-ai-iot-sdk'
import { useDeviceStore } from '@/stores/modules/device'
import { appConfig } from '@/config/app' 
import { tokenManager } from '@/core/framework/token'

interface UseIotClientReturn {
    sdkClient: SdkworkAIoTClient | undefined
    isConnected: Ref<boolean>
    globalLoading: Ref<boolean>
    sdkConfig: SdkworkAIotConfig
    createSDK: () => Promise<SdkworkAIoTClient | null>
    initSDK: (sdkConfig?: SdkworkAIotConfig) => Promise<void>
    destroySDK: () => Promise<void>
    startListening: () => void
    stopListening: () => void
    sendAudioStream: (audioData: ArrayBuffer) => void
    handleOnline: () => void
    handleOffline: () => void
}

// 全局SDK客户端实例
let globalSdkClient: SdkworkAIoTClient | undefined = undefined

/**
 * IoT客户端Hook
 * 提供SDK客户端的初始化、连接管理和事件监听功能
 */
export const useIotClient = (): UseIotClientReturn => {
    const globalLoading = ref(false)
    const isConnected = ref(false)
    const deviceStore = useDeviceStore()

    // 初始化设备ID
    deviceStore.initDeviceIds()

    // SDK配置
    const sdkConfig: SdkworkAIotConfig = {
        baseUrl: appConfig.websocketBaseURL,
        authorization: tokenManager.getAuthToken() as string,
        deviceId: deviceStore.deviceId,
        clientId: deviceStore.clientId,
        maxRetries: 5
    }

    /**
     * 设置事件监听器
     */
    const setupEventListeners = (): void => {
        if (!globalSdkClient) return

        // 连接事件
        globalSdkClient.onEvent((event: any) => {
            if (IotEventType.CONNECTED === event.event_type) {
                window.dispatchEvent(new CustomEvent('sdk:connected', { detail: event }))
            }
            if (IotEventType.DISCONNECTED === event.event_type) {
                isConnected.value = false
                window.dispatchEvent(new CustomEvent('sdk:disconnected', { detail: event }))
            }

        })

        // 消息事件
        globalSdkClient.onMessage((message) => {
            console.log('收到消息:', message)
            window.dispatchEvent(new CustomEvent('sdk:message', { detail: message }))
        })
        globalSdkClient.onToolCall((message) => {
            console.log('收到工具调用消息:', message)
            window.dispatchEvent(new CustomEvent('sdk:toolCall', { detail: message }))
        })
        // 错误处理
        globalSdkClient.onError((error) => {
            console.error('SDK错误:', error)
            window.dispatchEvent(new CustomEvent('sdk:error', { detail: error }))
        })
    }

    /**
     * 创建SDK客户端实例
     */
    const createSDK = async (): Promise<SdkworkAIoTClient | null> => {
        try {
            if (!sdkConfig.baseUrl) {
                console.error('SDK配置错误: baseUrl 为空')
                return null
            }
            if (globalSdkClient) {
                return globalSdkClient
            }
            globalLoading.value = true
            console.log('开始创建SDK客户端实例...')

            // 如果全局实例已存在，直接返回
            if (globalSdkClient) {
                console.log('使用已存在的全局SDK客户端实例')
                return globalSdkClient
            }

            // 创建SDK客户端实例
            const { SdkworkAIoTClient } = await import('sdkwork-ai-iot-sdk')
            globalSdkClient = new SdkworkAIoTClient(sdkConfig)

            console.log('SDK客户端实例创建成功')
            return globalSdkClient
        } catch (error) {
            console.error('SDK客户端实例创建失败:', error)
            throw error
        } finally {
            globalLoading.value = false
        }
    }


    /**
     * 初始化SDK客户端
     */
    const initSDK = async (sdkConfig?: SdkworkAIotConfig): Promise<void> => {
        try {
            globalLoading.value = true
            console.log('开始初始化SDK客户端...')
            await createSDK();
            if (!globalSdkClient) {
                throw new Error('SDK客户端实例未创建，请先调用createSdk方法')
            }
            // 初始化SDK（包含音频解码Worker的初始化）
            await globalSdkClient.initialize(sdkConfig)

            isConnected.value = true
            setupEventListeners()
            console.log('SDK客户端初始化成功')
        } catch (error) {
            console.error('SDK初始化失败:', error)
            throw error
        } finally {
            globalLoading.value = false
        }
    }

    /**
     * 销毁SDK客户端
     */
    const destroySDK = async (): Promise<void> => {
        console.log('开始销毁SDK客户端...')

        if (globalSdkClient) {
            try {
                await globalSdkClient.destroy()
                console.log('SDK客户端销毁成功')
                globalSdkClient = undefined
            } catch (error) {
                console.error('SDK客户端销毁失败:', error)
            }
        }
        isConnected.value = false
        console.log('SDK客户端销毁完成')
    }

    /**
     * 开始语音监听
     */
    const startListening = (): void => {
        if (globalSdkClient && isConnected.value) {
            globalSdkClient.startListening()
        }
    }

    /**
     * 停止语音监听
     */
    const stopListening = (): void => {
        if (globalSdkClient && isConnected.value) {
            globalSdkClient.stopListening()
        }
    }

    /**
     * 发送音频数据
     */
    const sendAudioStream = (audioData: ArrayBuffer): void => {
        if (globalSdkClient && isConnected.value) {
            globalSdkClient.sendAudioStream(audioData)
        }
    }

    /**
     * 网络连接恢复处理
     */
    const handleOnline = (): void => {
        console.log('网络连接已恢复')
        // 可以在这里添加网络恢复后的重连逻辑
        if (!isConnected.value && globalSdkClient) {
            console.log('尝试重新连接SDK...')
            initSDK(sdkConfig).catch((error: Error) => {
                console.error('重新连接失败:', error)
            })
        }
    }

    /**
     * 网络断开处理
     */
    const handleOffline = (): void => {
        console.warn('网络连接已断开')
        // 可以在这里添加网络断开后的处理逻辑
    }

    return {
        sdkClient: globalSdkClient,
        isConnected,
        globalLoading,
        sdkConfig,
        createSDK,
        initSDK,
        destroySDK,
        startListening,
        stopListening,
        sendAudioStream,
        handleOnline,
        handleOffline
    }
}