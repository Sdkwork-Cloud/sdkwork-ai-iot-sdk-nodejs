<template>
    <div class="bottom-bar-mode" :style="{ '--theme-color': themeColor }">
        <div class="bottom-bar-content">
            <!-- 左侧：封面和歌曲信息 -->
            <div class="left-section">
                <CoverComponent :cover="cover" :title="title" :artist="artist" :theme-color="themeColor"
                    mode="bottom-bar" @click="$emit('expand')">
                    <template #cover-custom>
                        <slot name="bottom-bar-cover"></slot>
                    </template>
                </CoverComponent>

            </div>
            <!-- 中间：进度条和波形 -->


            <!-- 右侧：附加控制 -->
            <div class="right-section" style="display: flex;flex-direction: column;padding-left: 10px;">
                <div
                    style="display: flex; flex-direction: row; gap: 12px; align-items: center;width: 100%;justify-content: space-between;">
                    <div class="track-info">
                        <div class="track-title">{{ title }}</div>
                        <div class="track-artist">{{ artist }}</div>
                    </div>
                     <div class="quick-controls">
                            <button class="quick-btn" @click="prev" :disabled="!hasPrevious">
                                <Icon icon="mdi:skip-previous" />
                            </button>
                            <button class="quick-btn" @click="togglePlay">
                                <Icon :icon="isPlaying ? 'mdi:pause' : 'mdi:play'" />
                            </button>
                            <button class="quick-btn" @click="next" :disabled="!hasNext">
                                <Icon icon="mdi:skip-next" />
                            </button>
                            <button class="action-btn" @click="$emit('expand')">
                                <Icon icon="mdi:chevron-up" />
                            </button>
                            <MoreActionsComponent mode="bottom-bar" :is-liked="false" 
                                @close-player="$emit('close-player')" @like="$emit('like')" @share="$emit('share')" />
                        </div>
                </div>


                <div class="progress-container">
                    <ProgressComponent :theme-color="themeColor" mode="bottom-bar" :show-waveform="showWaveform"
                        :wave-type="waveType">
                        <template #progress-custom>
                            <slot name="bottom-bar-progress"></slot>
                        </template>
                    </ProgressComponent>
                </div>
            </div>
        </div>

        <slot name="bottom-bar-custom"></slot>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'
import CoverComponent from './CoverComponent.vue'
import ProgressComponent from './ProgressComponent.vue'
import MoreActionsComponent from './MoreActionsComponent.vue'
import { PlayerState } from '@/stores/modules/player/types'
import { Icon } from '@iconify/vue'
interface Props {
    cover?: string
    title?: string
    artist?: string
    themeColor?: string
    showProgress?: boolean
    showWaveform?: boolean
    waveType?: string
}

const props = withDefaults(defineProps<Props>(), {
    cover: '',
    title: '',
    artist: '',
    themeColor: '#3b82f6',
    showProgress: true,
    showWaveform: false,
    waveType: 'bar'
})

const emit = defineEmits<{
    'expand': []
    'close-player': []
    'like': []
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

// 方法
const togglePlay = async () => {
    await playerStore.togglePlay()
}

const prev = () => {
    playerStore.previous()
}

const next = () => {
    playerStore.next()
}
</script>

<style scoped>
.bottom-bar-mode {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(30px);
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    z-index: 1000;
    /* 移动端安全区域适配 - 更紧凑版本 */
    padding: 6px max(12px, env(safe-area-inset-left, 12px)) max(6px, calc(6px + env(safe-area-inset-bottom, 0px))) max(12px, env(safe-area-inset-right, 12px));
    /* 确保底部有足够的安全区域 */
    box-sizing: border-box;
    box-shadow: 0 -1px 15px rgba(0, 0, 0, 0.06);
}

/* 为iOS设备添加额外的安全区域支持 */
@supports (padding: max(0px)) {
    .bottom-bar-mode {
        padding-bottom: max(8px, env(safe-area-inset-bottom));
    }
}

.bottom-bar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 42px; /* 优化高度，更加紧凑 */
    box-sizing: border-box;
}

.left-section {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.quick-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

.quick-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 50%;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}

.quick-btn:hover {
    background: rgba(0, 0, 0, 0.08);
    transform: scale(1.1);
}

.quick-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.quick-btn:disabled:hover {
    background: rgba(0, 0, 0, 0.03);
    transform: none;
}

.center-section {
    flex: 2;
    min-width: 0;
    max-width: 400px;
}

.right-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    min-height: 0;
    flex: 1;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease;
    opacity: 0.7;
}

.action-btn:hover {
    opacity: 1;
    transform: scale(1.05);
}

.progress-container {
    width: 100%;
    height: 16px;
    margin-top: 0;
    display: flex;
    align-items: center;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
    .bottom-bar-mode {
        background: rgba(0, 0, 0, 0.95);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .quick-btn {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }

    .quick-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .quick-btn:disabled:hover {
        background: rgba(255, 255, 255, 0.1);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .bottom-bar-mode {
        padding: 6px max(12px, env(safe-area-inset-left, 12px)) max(8px, calc(6px + env(safe-area-inset-bottom, 0px))) max(12px, env(safe-area-inset-right, 12px));
    }

    .bottom-bar-content {
        gap: 12px;
        min-height: 50px; /* 移动端适当减小高度 */
    }

    .left-section {
        gap: 8px;
    }

    .quick-controls {
        gap: 4px;
    }

    .quick-btn {
        width: 28px;
        height: 28px;
    }

    .action-btn {
        width: 28px;
        height: 28px;
    }
}

@media (max-width: 480px) {
    .center-section {
        display: none;
    }

    .right-section {
        gap: 4px;
    }
    
    /* 超小屏幕优化 */
    .bottom-bar-mode {
        padding: 4px max(8px, env(safe-area-inset-left, 8px)) max(6px, calc(4px + env(safe-area-inset-bottom, 0px))) max(8px, env(safe-area-inset-right, 8px));
    }
    
    .bottom-bar-content {
        min-height: 45px; /* 进一步减小高度 */
        gap: 8px;
    }
    
    .quick-controls {
        gap: 2px;
    }
    
    .quick-btn, .action-btn {
        width: 24px;
        height: 24px;
    }
    
    .track-title {
        font-size: 12px;
    }
    
    .track-artist {
        font-size: 10px;
    }
}

/* 动画效果 */
.bottom-bar-mode {
    animation: slideUp 0.3s ease;
}

.cover-info {
    text-align: center;
}

.track-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 2px;
}

.track-artist {
    font-size: 12px;
    opacity: 0.8;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>