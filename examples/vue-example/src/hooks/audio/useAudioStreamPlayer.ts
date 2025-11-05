import { ref, onUnmounted, type Ref } from 'vue'
import { SdkworkStreamAudioPlayer } from '@/core/audio/player/sdkwork_stream_player'
import { IStreamAudioPlayer } from '@/core/audio/player/types'

// 全局单例播放器实例
let globalPlayerInstance: IStreamAudioPlayer | null = null

/**
 * 音频流播放器Hook
 * 提供全局单例的音频流播放器实例
 */
export function useAudioStreamPlayer() {
    const player: Ref<IStreamAudioPlayer | null> = ref(null)
    const playerState: Ref<string> = ref('IDLE')
    const volume: Ref<number> = ref(1.0)

    // 初始化全局播放器实例
    const initializePlayer = (): IStreamAudioPlayer => {
        if (!globalPlayerInstance) {
            globalPlayerInstance = new SdkworkStreamAudioPlayer()
        }
        return globalPlayerInstance
    }

    // 开始实时音频流播放
    const start = async (sampleRate: number = 16000, channels: number = 1): Promise<void> => {
        const instance = initializePlayer()
        player.value = instance
        await instance.start(sampleRate, channels)
        playerState.value = 'PLAYING'
        volume.value = instance.getVolume()
    }

    // 向流中添加音频数据
    const appendStreamData = (data: Float32Array | Int16Array | ArrayBuffer): void => {
        if (player.value) {
            player.value.appendStreamData(data)
            // 状态保持不变，因为appendStreamData不会改变播放状态
        }
    } 
    // 暂停当前播放
    const pause = (): void => {
        if (player.value) {
            player.value.pause()
            playerState.value = 'PAUSED'
        }
    }

    // 恢复暂停的播放
    const resume = async (): Promise<void> => {
        if (player.value) {
            await player.value.resume()
            playerState.value = 'PLAYING'
        }
    }

    // 停止播放并重置到开始位置
    const stop = (): void => {
        if (player.value) {
            player.value.stop()
            playerState.value = 'STOPPED'
        }
    }

    // 设置音量
    const setVolume = (newVolume: number): void => {
        if (player.value) {
            player.value.setVolume(newVolume)
            volume.value = player.value.getVolume()
        }
    }

    // 获取当前音量
    const getVolume = (): number => {
        return player.value ? player.value.getVolume() : volume.value
    }

    // 获取当前播放状态
    const getState = (): string => {
        return playerState.value
    }

    // 清理资源并停止播放
    const destroy = (): void => {
        if (player.value) {
            player.value.destroy()
            player.value = null
            playerState.value = 'IDLE'
        }
    }

    // 组件卸载时清理资源
    onUnmounted(() => {
        // 注意：这里不销毁全局实例，因为它是单例的
        // 只在应用完全退出时才销毁全局实例
        player.value = null
    })

    return {
        player,
        playerState,
        volume,
        start,
        appendStreamData,
        pause, 
        resume,
        stop,
        setVolume,
        getVolume,
        getState,
        destroy
    }
}

/**
 * 获取全局播放器实例（直接访问，不通过hook）
 * 用于在非组件环境中使用播放器
 */
export function getGlobalAudioPlayer(): IStreamAudioPlayer | null {
    return globalPlayerInstance
}

/**
 * 销毁全局播放器实例
 * 在应用退出时调用
 */
export function destroyGlobalAudioPlayer(): void {
    if (globalPlayerInstance) {
        globalPlayerInstance.destroy()
        globalPlayerInstance = null
    }
}