<template>
    <div class="progress-component" :class="mode">
        
        <!-- 波形可视化 -->
        <WaveformComponent v-if="shouldShowWaveform" :mode="mode" :theme-color="themeColor" :waveType="waveType"
            class="waveform-component" />
        <!-- 进度条和时间显示 -->
        <div class="progress-bar-container">
            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <van-slider v-model="sliderValue" :max="duration || 0" :min="0" :step="0.1" :active-color="themeColor"
                :inactive-color="inactiveColor" :bar-height="barHeight" @change="handleSeek"
                @drag-start="handleSeekingStart" @drag-end="handleSeekingEnd" class="vant-progress">
                <!-- 缓冲进度显示 -->
                <div v-if="buffered > 0 && duration > 0" class="buffered-progress"
                    :style="{ width: `${(buffered / duration) * 100}%` }"></div>
            </van-slider>
            <span class="total-time">{{ formatTime(duration) }}</span>
        </div>


        <slot name="progress-custom" :current-time="currentTime" :duration="duration" :buffered="buffered"></slot>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'
import WaveformComponent from './WaveformComponent.vue'

interface Props {
    themeColor?: string
    mode?: 'card' | 'bottom-bar' | 'fullscreen'
    showWaveform?: boolean
    waveType?: string
    inactiveColor?: string
    barHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
    themeColor: '#3b82f6',
    mode: 'card',
    showWaveform: true,
    waveType: 'bar',
    inactiveColor: 'rgba(255, 255, 255, 0.3)',
    barHeight: '4px'
})

// 在bottom-bar模式下默认不显示波形
const shouldShowWaveform = computed(() => {
    return props.showWaveform && props.mode !== 'bottom-bar'
})

const emit = defineEmits<{
    'seek': [time: number]
    'seeking': [time: number]
    'seeking-start': []
    'seeking-end': []
}>()

const playerStore = usePlayerStore()
const sliderValue = ref(playerStore.currentTime)
const isSeeking = ref(false)

// 计算属性
const currentTime = computed(() => playerStore.currentTime)
const duration = computed(() => playerStore.duration)
const buffered = computed(() => playerStore.buffered)

const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '00:00'

    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleSeek = (value: number) => {
    playerStore.seek(value)
    emit('seek', value)
}

const handleSeekingStart = () => {
    isSeeking.value = true
    emit('seeking-start')
}

const handleSeekingEnd = () => {
    isSeeking.value = false
    emit('seeking-end')
}

// 监听currentTime变化，更新sliderValue
watch(currentTime, (newTime) => {
    if (!isSeeking.value) {
        sliderValue.value = newTime
    }
})

// 暴露方法给父组件
defineExpose({
    seekTo: (time: number) => {
        sliderValue.value = time
        playerStore.seek(time)
        emit('seek', time)
    },
    startSeeking: () => {
        isSeeking.value = true
        emit('seeking-start')
    },
    endSeeking: () => {
        isSeeking.value = false
        emit('seeking-end')
    }
})
</script>

<style scoped>
.progress-component {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    /* 安全区域适配 */
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
    box-sizing: border-box;
}

.progress-component.fullscreen {
    flex-direction: column;
    gap: 16px;
    /* 全屏模式安全区域适配 */
    padding-left: max(0px, env(safe-area-inset-left, 0px));
    padding-right: max(0px, env(safe-area-inset-right, 0px));
}

.progress-component.card {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
}

.progress-component.bottom-bar {
    flex-direction: row; 
    align-items: flex-start;
    margin-top: 0;
}

.time-display {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--text-secondary);
    min-width: 80px;
}

.progress-component.fullscreen .time-display {
    font-size: 14px;
    gap: 8px;
    color: rgba(255, 255, 255, 0.9);
}

.progress-component .vant-progress {
    margin: 4px 0;
}

.progress-component.bottom-bar .vant-progress {
    margin: 2px 0;
}

.progress-component .vant-progress :deep(.van-slider__bar) {
    border-radius: 3px;
}

.progress-component .vant-progress :deep(.van-slider__track) {
    border-radius: 3px;
    background: rgba(110, 109, 109, 0.3) !important;
}

.progress-component .vant-progress :deep(.van-slider__button) {
    width: 16px;
    height: 16px;
    background: var(--theme-color);
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Bottom-bar模式下的特殊样式 */
.progress-component.bottom-bar .vant-progress :deep(.van-slider__bar) {
    border-radius: 2px;
    height: 4px;
}

.progress-component.bottom-bar .vant-progress :deep(.van-slider__track) {
    border-radius: 2px;
    height: 4px;
    background: rgba(110, 109, 109, 0.3) !important;
}

.progress-component.bottom-bar .vant-progress :deep(.van-slider__button) {
    width: 12px;
    height: 12px;
    background: var(--theme-color);
    border: 1px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
}

.progress-component.bottom-bar .vant-progress :deep(.van-slider__button):hover {
    transform: scale(1.2);
}

.duration-separator {
    opacity: 0.5;
}

.progress-bar-container {
    display: flex;
    align-items: center; 
    width: 100%;
    /* 确保进度条在安全区域内 */ 
    box-sizing: border-box;
    margin-top: 16px;
}

/* Bottom-bar模式下进度条容器无上边距 */
.progress-component.bottom-bar .progress-bar-container {
    margin-top: 0;
}

.progress-bar-container .current-time {
    font-size: 11px;
    color: var(--theme-color);
    font-weight: 600;
    min-width: 35px;
}

.progress-bar-container .total-time {
    font-size: 11px;
    color: #666;
    opacity: 0.8;
    min-width: 35px;
    text-align: right;
}

.vant-progress {
    width: 100%;
    position: relative;
    flex: 1;
}

.buffered-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    pointer-events: none;
    z-index: 1;
}

.waveform-component {
    margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .progress-component {
        gap: 8px;
        padding-left: max(8px, env(safe-area-inset-left, 8px));
        padding-right: max(8px, env(safe-area-inset-right, 8px));
    }

    .time-display {
        font-size: 11px;
        min-width: 70px;
    }

    .progress-component.fullscreen .time-display {
        font-size: 13px;
    }
    
    .progress-bar-container {
        padding-left: max(8px, env(safe-area-inset-left, 8px));
        padding-right: max(8px, env(safe-area-inset-right, 8px));
    }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
    .buffered-progress {
        background: rgba(255, 255, 255, 0.05);
    }
}
</style>