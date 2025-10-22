<template>
    <div class="card-mode" :style="{ '--theme-color': themeColor, width: width, height: height }">
        <div class="card-content">
            <!-- 顶部：封面和歌曲信息 -->
            <div class="card-header">
                <div style="display: flex; flex-direction: row;">
                    <CoverComponent :cover="cover" :title="title" :artist="artist" :theme-color="themeColor"
                        mode="card">
                        <template #cover-custom>
                            <slot name="card-cover"></slot>
                        </template>
                    </CoverComponent>


                    <div class="track-info">
                        <div class="track-title">{{ title }}</div>
                        <div class="track-artist">{{ artist }}</div>
                    </div>
                </div>

                <div class="header-actions">
                    <button class="action-btn" @click="$emit('like')">
                        <Icon :icon="isLiked ? 'mdi:heart' : 'mdi:heart-outline'" :class="{ liked: isLiked }" />
                    </button>
                    <MoreActionsComponent mode="card" :is-liked="isLiked" 
                        @close-player="$emit('close-player')" @like="$emit('like')" @share="$emit('share')" />
                </div>
            </div>

            <!-- 中间内容区域：进度条和波形 -->
            <div class="card-middle-section">
                <!-- 进度条和波形组件 -->
                <ProgressComponent v-if="showProgress || showWaveform" :theme-color="themeColor" mode="card"
                    :show-waveform="showWaveform" :wave-type="waveType" class="card-progress-component" />
            </div>

            <!-- 底部：控制按钮 -->
            <div class="card-controls">
                <ControlComponent mode="card">
                    <template #control-custom>
                        <slot name="card-controls"></slot>
                    </template>
                </ControlComponent>
            </div>
        </div>

        <slot name="card-custom"></slot>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'
import CoverComponent from './CoverComponent.vue'
import ControlComponent from './ControlComponent.vue'
import WaveformComponent from './WaveformComponent.vue'
import ProgressComponent from './ProgressComponent.vue'
import MoreActionsComponent from './MoreActionsComponent.vue'
import { PlayerState } from '@/stores/modules/player/types'

interface Props {
    cover?: string
    title?: string
    artist?: string
    themeColor?: string
    width?: string
    height?: string
    showProgress?: boolean
    showWaveform?: boolean
    waveType?: 'bar' | 'line' | 'circle'
    isLiked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    cover: '',
    title: '',
    artist: '',
    themeColor: '#3b82f6',
    width: '100%',
    height: 'auto',
    showProgress: true,
    showWaveform: true,
    waveType: 'bar' as 'bar' | 'line' | 'circle',
    isLiked: false
})

const emit = defineEmits<{
    'like': []
    'close-player': []
    'share': []
}>()

const playerStore = usePlayerStore()

// 计算属性 - 优先使用props传入的值，其次使用store中的当前曲目
const currentTrack = computed(() => playerStore.currentTrack)
const cover = computed(() => props.cover || currentTrack.value?.cover || '')
const title = computed(() => props.title || currentTrack.value?.title || 'Unknown Title')
const artist = computed(() => props.artist || currentTrack.value?.artist || 'Unknown Artist')
const currentTime = computed(() => playerStore.currentTime)
const duration = computed(() => playerStore.duration)
const buffered = computed(() => playerStore.buffered)
const isPlaying = computed(() => playerStore.playbackState.state === PlayerState.PLAYING)
const hasPrevious = computed(() => playerStore.hasPrevious)
const hasNext = computed(() => playerStore.hasNext)

// 进度百分比
const progressPercentage = computed(() => {
    if (duration.value <= 0) return 0
    return (currentTime.value / duration.value) * 100
})

// 时间格式化函数
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 迷你波形数据
const miniWaveformBars = computed(() => {
    const bars = []
    const barCount = 40

    for (let i = 0; i < barCount; i++) {
        bars.push({
            height: Math.random() * 20 + 5 // 5% - 25% 高度
        })
    }
    return bars
})
</script>

<style scoped>
.card-mode {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0;
    position: relative;
}

/* 顶部区域：封面和歌曲信息（固定高度） */
.card-header {
    flex: 0 0 auto;
    margin-bottom: 20px;
}

/* 中间内容区域（可伸缩，用于填充空间） */
.card-middle-section {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 8px;
}

/* 进度条和波形区域 */
.card-progress-component {
    width: 100%;
    margin: 0;
}

/* 底部控制区域（固定在底部） */
.card-controls {
    flex: 0 0 auto;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    position: relative;
}

/* 添加底部装饰线 */
.card-controls::before {
    content: '';
    position: absolute;
    top: 0;
    left: 25%;
    right: 25%;
    height: 1px;
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(0, 0, 0, 0.1) 20%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.1) 80%,
            transparent 100%);
}

/* 暗色模式下的底部边框 */
@media (prefers-color-scheme: dark) {
    .card-controls {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
}

.card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.7;
}

.action-btn:hover {
    opacity: 1;
    transform: scale(1.05);
}

.action-btn.liked {
    color: #ef4444;
}

.card-progress-section {
    margin: 16px 0 8px 0;
}

.progress-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-progress-bar {
    width: 100%;
}

.card-progress-bar :deep(.van-progress__portion) {
    border-radius: 3px;
}

.card-progress-bar :deep(.van-progress__pivot) {
    background: transparent;
    color: #666;
    font-size: 10px;
    padding: 0 4px;
}

.time-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #666;
    margin-top: 2px;
}

.current-time {
    font-weight: 600;
    color: var(--theme-color);
    font-size: 11px;
}

.duration {
    opacity: 0.8;
    font-size: 11px;
}

.card-waveform-section {
    margin: 8px 0 16px 0;
    height: 40px;
    border-radius: 8px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.05);
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.card-controls {
    margin-top: 8px;
}

.waveform-mini {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    height: 30px;
    gap: 1px;
}

.waveform-bar-mini {
    flex: 1;
    background: var(--theme-color);
    border-radius: 1px;
    opacity: 0.3;
    transition: height 0.3s ease;
    min-height: 2px;
}

.waveform-bar-mini:nth-child(odd) {
    opacity: 0.2;
}

.waveform-bar-mini:nth-child(3n) {
    opacity: 0.4;
}

.waveform-bar-mini:nth-child(5n) {
    opacity: 0.6;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
    .card-mode {
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .action-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .card-mode {
        padding: 16px;
        border-radius: 12px;
    }

    .card-content {
        gap: 12px;
    }

    .card-header {
        gap: 12px;
    }

    .header-actions {
        gap: 6px;
    }

    .action-btn {
        width: 28px;
        height: 28px;
    }
}

@media (max-width: 480px) {
    .card-mode {
        padding: 12px;
        border-radius: 8px;
    }

    .card-content {
        gap: 8px;
    }

    .waveform-mini {
        height: 20px;
    }
}

/* 动画效果 */
.card-mode {
    animation: fadeInScale 0.3s ease;
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* 悬停效果 */
.card-mode:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

/* 紧凑模式 */
.card-mode.compact {
    padding: 12px;
}

.card-mode.compact .card-content {
    gap: 8px;
}

.card-mode.compact .card-header {
    align-items: center;
}

.card-mode.compact .waveform-mini {
    display: none;
}

.track-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.track-artist {
    font-size: 14px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.track-info {
    flex: 1;
    min-width: 0;
    margin-left: 10px;
} 
</style>