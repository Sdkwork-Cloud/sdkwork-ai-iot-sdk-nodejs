import { ref, onUnmounted } from 'vue'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/pcm'
import 'recorder-core/src/extensions/buffer_stream.player'
import { useChatStore } from '@/stores/modules/chat'
 

/**
 * 音频流播放器Hook
 */
export function useAudioStreamPlayer() {
    // 音频播放器实例
    const audioPlayer = ref<any>(null)
    // 标记是否已启动音频播放器
    const audioPlayerStarted = ref(false)
    // 用户是否同意使用语音功能
    const userConsent = ref(false)
    // 使用Chat Store
    const chatStore = useChatStore()

    /**
     * 初始化音频播放器
     */
    const initAudioPlayer = async (): Promise<void> => {
        if (!audioPlayer.value) {
            try {
                // 检查BufferStreamPlayer是否可用
                if (!Recorder.BufferStreamPlayer) {
                    const err = "H5需要在逻辑层中、App需要在renderjs模块中 import 'recorder-core/src/extensions/buffer_stream.player.js'"
                    console.error('缺少BufferStreamPlayer扩展文件:', err)
                    return
                }

                // 创建BufferStreamPlayer实例
                audioPlayer.value = Recorder.BufferStreamPlayer({
                    decode: false,
                    sampleRate: 16000,
                    onInputError: function (errMsg: string, inputIndex: number) {
                        console.error(`第${inputIndex}次的音频片段输入出错: ${errMsg}`)
                    },
                    onPlayEnd: function () {
                        console.log('音频播放结束')
                    }
                })

                console.log('音频播放器实例已创建，等待用户同意后启动')

            } catch (error) {
                console.error('音频播放器初始化失败:', error)
            }
        }
    }

    /**
     * 启动音频播放器（需要用户同意）
     */
    const startAudioPlayer = (): void => {
        if (!audioPlayer.value) {
            console.warn('音频播放器未初始化')
            return
        }

        if (audioPlayerStarted.value) {
            console.log('音频播放器已启动')
            return
        }

        try {
            // 添加额外的检查，确保不会重复启动
            if (audioPlayer.value.isStop === false) {
                console.log('音频播放器已经在运行中')
                audioPlayerStarted.value = true
                return
            }

            audioPlayer.value.start(() => {
                console.log('音频播放器已启动')
                audioPlayerStarted.value = true
            }, (err: string) => {
                console.error('音频播放器启动失败:', err)
                // 启动失败时重置状态
                audioPlayerStarted.value = false
            })
        } catch (error) {
            console.error('启动音频播放器失败:', error)
            audioPlayerStarted.value = false
        }
    }

    /**
     * 处理音频流数据
     */
    const handleAudioStream = (message: any): void => {
        console.log('开始处理音频流数据:', message)
        
        if (!audioPlayer.value) {
            console.warn('音频播放器未初始化')
            return
        }

        if (!audioPlayerStarted.value) {
            console.warn('音频播放器未启动')
            return
        }

        try { 
            // 优先使用chatStore的事件系统处理音频流
            if (chatStore.currentMessageHandler && chatStore.isHandlerConnected) {
                console.log('使用chatStore的消息处理器处理音频流')
                // 这里可以添加通过chatStore处理音频流的逻辑
                // 目前保持向后兼容性
            }
            
            // 检查数据结构 - 支持多种可能的格式
            if (message && message.data) {
                console.log('音频数据格式正确，包含data字段')
                
                // 检查是否有channelData（PCM格式）
                if (message.data.channelData) {
                    const audioData:Int16Array = message.data.channelData[0];
                    console.log('找到audioData，准备播放音频')
                    
                    // 检查channelData是否有效
                    if (!audioData || !audioData.length) {
                        console.warn('channelData无效，跳过播放')
                        return
                    }
                      
                    
                    // 使用转换后的Int16Array数据
                    audioPlayer.value.input(audioData)
                    console.log('PCM音频数据已发送到播放器')
                } 
                // 检查是否有ArrayBuffer（原始音频数据）
                else if (message.data instanceof ArrayBuffer) {
                    console.log('找到ArrayBuffer格式的音频数据')
                    audioPlayer.value.input(message.data)
                    console.log('ArrayBuffer音频数据已发送到播放器')
                }
                // 检查是否有Uint8Array
                else if (message.data instanceof Uint8Array) {
                    console.log('找到Uint8Array格式的音频数据')
                    audioPlayer.value.input(message.data)
                    console.log('Uint8Array音频数据已发送到播放器')
                }
                // 检查是否有base64编码的数据
                else if (typeof message.data === 'string' && message.data.startsWith('data:')) {
                    console.log('找到base64编码的音频数据')
                    // 这里需要将base64转换为ArrayBuffer
                    const base64Data = message.data.split(',')[1]
                    const binaryString = atob(base64Data)
                    const bytes = new Uint8Array(binaryString.length)
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i)
                    }
                    audioPlayer.value.input(bytes.buffer)
                    console.log('base64音频数据已转换并发送到播放器')
                }
                else {
                    console.warn('未知的音频数据格式:', message.data)
                    console.log('尝试直接使用message.data:', message.data)
                    // 尝试直接输入数据
                    audioPlayer.value.input(message.data)
                }
            } else {
                console.warn('未知的音频数据格式:', message)
                console.log('尝试直接使用message:', message)
                // 尝试直接输入整个message
                audioPlayer.value.input(message)
            }
        } catch (error) {
            console.error('音频播放失败:', error)
        }
    }

    /**
     * 请求用户同意使用语音功能
     */
    const requestUserConsent = (): Promise<boolean> => {
        return new Promise((resolve) => {
            // 显示对话框询问用户同意
            const confirmed = window.confirm(
                '是否同意使用语音对话功能？\n\n' +
                '此功能需要访问您的麦克风和扬声器，用于语音交互。\n' +
                '我们承诺保护您的隐私，语音数据仅用于当前会话。'
            )

            userConsent.value = confirmed
            resolve(confirmed)
        })
    }

    /**
     * 设置音频流监听器（与chatStore集成）
     */
    const setupAudioStreamListener = (): void => {
        // 监听chatStore的音频流事件
        const handleChatStoreAudioStream = (event: any) => {
            if (event.detail && event.detail.type === 'AUDIO_STREAM_RECEIVED') {
                console.log('通过chatStore接收到音频流:', event.detail.audio)
                handleAudioStream(event.detail.audio)
            }
        }

        onMounted(() => {
            window.addEventListener('sdk:audioStream', handleChatStoreAudioStream)
        })

        onUnmounted(() => {
            window.removeEventListener('sdk:audioStream', handleChatStoreAudioStream)
        })
    }

    /**
     * 清理音频播放器
     */
    const cleanupAudioPlayer = (): void => {
        if (audioPlayer.value) {
            // 停止播放器
            if (audioPlayer.value.stop) {
                audioPlayer.value.stop()
            }
            if (audioPlayer.value.destroy) {
                audioPlayer.value.destroy()
            }
            audioPlayer.value = null
        }
        audioPlayerStarted.value = false
    }

    // 自动清理
    onUnmounted(() => {
        cleanupAudioPlayer()
    })

    // 自动设置音频流监听器
    setupAudioStreamListener()

    return {
        audioPlayer,
        audioPlayerStarted,
        userConsent,
        initAudioPlayer,
        startAudioPlayer,
        handleAudioStream,
        requestUserConsent,
        cleanupAudioPlayer,
        setupAudioStreamListener
    }
}