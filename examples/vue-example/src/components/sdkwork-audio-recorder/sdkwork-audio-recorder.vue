<template>
    <div class="sdkwork-audio-recorder" :class="containerClass" :style="containerStyle">
        <!-- 顶部操作栏 -->
        <RecorderTopBar 
            :config="config"
            :show-record-list="showRecordList"
            :show-setting-button="showSettingButton"
            :show-back-button="showBackButton"
            :theme-mode="themeMode"
            :mobile-optimized="mobileOptimized"
            @back="handleBackClick"
            @show-record-list="handleShowRecordList"
            @update:config="handleConfigUpdate"
            @setting-click="handleSettingClick"
        />

        <!-- 主要内容区域 -->
        <div class="recorder-main" style="display: flex;flex-direction: column;justify-content: space-between;height: 100%;">
            <div style="display: flex;flex-direction: column;width: 100%;height: calc(100% - 300px)">
                <!-- 波形显示区域 -->
                <div class="wave-section">
                    <slot name="wave">
                        <div v-if="config.enableWave" ref="waveContainer" class="wave-display-container" :style="{
                            width: waveWidth + 'px',
                            height: waveHeight + 'px',
                            minWidth: waveWidth + 'px',
                            minHeight: waveHeight + 'px'
                        }" />
                    </slot>
                </div>

                <!-- 计时器区域 -->
                <div class="timer-section">
                    <TimerDisplay :duration="currentDuration" :format="'auto'" />
                </div>

                <!-- 最新录音记录 -->
                <div v-if="showRecordList" class="latest-record-section">
                    <LatestRecord :active-record-id="currentRecord?.id"
                        @record-click="handleRecordClick" @record-play="handleRecordPlay"
                        @record-pause="handleRecordPause" @record-delete="handleRecordDelete" />
                </div>

                <!-- 默认插槽 -->
                <slot />
            </div>
            <!-- 控制按钮区域 -->
            <div class="controls-section" style="min-height: 300px;">
                <ControlButtons @record-start="handleRecordStart"
                    @record-pause="handleRecordPause" @record-resume="handleRecordResume"
                    @record-cancel="handleRecordCancel" @record-finish="handleRecordFinish">

                    <!-- 录制提示信息 -->
                    <template #hint>
                        <div class="recording-hints">
                            <div class="max-duration-hint">
                                最大可录制时长: {{ config.maxDuration && config.maxDuration > 0 ? config.maxDuration + '秒' :
                                '无限制' }}
                            </div>
                            <div class="marker-hint">
                                双击屏幕可以添加标记
                            </div>
                        </div>
                    </template>
                </ControlButtons>
            </div>
        </div>

        <!-- 取消录制确认对话框 -->
        <div v-if="cancelConfirmVisible" class="confirm-dialog-overlay">
            <div class="confirm-dialog">
                <div class="confirm-dialog__header">
                    <h3 class="confirm-dialog__title">确认取消录制</h3>
                </div>
                <div class="confirm-dialog__body">
                    <p class="confirm-dialog__message">
                        确定要取消录制吗？取消后将不会保存录制内容。
                    </p>
                </div>
                <div class="confirm-dialog__footer">
                    <button class="confirm-dialog__btn confirm-dialog__btn--cancel" @click="cancelConfirm(false)">
                        继续录制
                    </button>
                    <button class="confirm-dialog__btn confirm-dialog__btn--confirm" @click="cancelConfirm(true)">
                        确认取消
                    </button>
                </div>
            </div>
        </div>

        <!-- 录制完成保存对话框 -->
        <RecordSaveDialog v-if="saveDialogVisible" :show="saveDialogVisible" :record="currentAudioRecord"
            :theme-mode="props.themeMode" @save="handleRecordSave" @cancel="handleRecordSaveCancel"
            @close="closeSaveDialog" />

        <!-- 录音记录弹窗 -->
        <RecordListPopup v-if="recordListDialogVisible" :show="recordListDialogVisible"
            :active-record-id="currentRecord?.id" :max-records="20" :theme-mode="props.themeMode"
            @close="handleCloseRecordListPopup" @record-click="handleRecordClick" @record-play="handleRecordPlay"
            @record-download="handleRecordDownload" @record-delete="handleRecordDelete"
            @record-clear="handleRecordClear" />

        <!-- 设置弹窗 -->
        <RecorderSetting 
            ref="recorderSettingRef"
            :show="settingDialogVisible"
            :config="config" 
            :theme-mode="props.themeMode"
            :mobile-optimized="props.mobileOptimized"
            @update:config="handleConfigUpdate" 
            @close="handleCloseSettingDialog"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRecorderStore } from '@/stores/modules/recorder' 
import {
    RecorderConfig,
    ApiConfig,
    AudioRecord,
    RecordState,
    RecordStats
} from '../../stores/modules/recorder/types'

// 导入子组件
import TimerDisplay from './components/TimerDisplay.vue'
import ControlButtons from './components/ControlButtons.vue'
import LatestRecord from './components/LatestRecord.vue'
import RecordListPopup from './components/RecordListPopup.vue'
import RecorderSetting from './components/RecorderSetting.vue'
import RecordSaveDialog from './components/RecordSaveDialog.vue'
import RecorderTopBar from './components/RecorderTopBar.vue'

// 使用录制器 store
const recorderStore = useRecorderStore()

interface Props {
    /** 录制器配置 */
    config?: RecorderConfig
    /** API 配置 */
    api?: ApiConfig
    /** 是否显示录制列表 */
    showRecordList?: boolean
    /** 是否显示字幕 */
    showSubtitle?: boolean
    /** 波形显示宽度 */
    waveWidth?: number
    /** 波形显示高度 */
    waveHeight?: number
    /** 波形线条颜色 */
    waveLineColor?: string
    /** 容器类名 */
    containerClass?: string
    /** 主题模式 */
    themeMode?: 'light' | 'dark' | 'auto'
    /** 是否启用移动端优化 */
    mobileOptimized?: boolean
    /** 是否显示设置按钮 */
    showSettingButton?: boolean
    /** 是否显示返回按钮 */
    showBackButton?: boolean
    /** 返回按钮点击事件 */
    onBack?: () => void
}

const props = withDefaults(defineProps<Props>(), {
    config: () => ({
        sampleRate: 16000,
        format: 'pcm',
        enableWave: true,
        realtime: false,
        recordToFile: true,
        maxDuration: 0,
        autoSendInterval: 0
    }),
    api: () => ({}),
    showRecordList: true,
    showSubtitle: true,
    waveWidth: 400,
    waveHeight: 120,
    waveLineColor: '#409EFF',
    containerClass: '',
    themeMode: 'auto',
    mobileOptimized: true,
    showSettingButton: true,
    showBackButton: false
})

// 定义事件
const emit = defineEmits<{
    // 录制控制事件 - 这些事件应该由父组件监听并调用 store 方法
    'start': []
    'pause': []
    'resume': []
    'stop': []
    'cancel': []
    
    // 录制结果事件 - 这些事件由组件内部触发，通知父组件录制结果
    'record-complete': [data: AudioRecord]
    'record-error': [error: Error]
    
    // 录制记录操作事件
    'record-save': [data: { record: AudioRecord; title: string }]
    'record-save-cancel': [data: AudioRecord]
    'record-click': [record: AudioRecord]
    'record-play': [record: AudioRecord]
    'record-pause': [record: AudioRecord]
    'record-download': [record: AudioRecord]
    'record-delete': [record: AudioRecord]
    'record-remove': [record: AudioRecord]
    'record-clear': []
    
    // 配置更新事件
    'update:config': [config: RecorderConfig]
    
    // UI 控制事件
    'back': []
    'show-record-list': []
    'setting-click': []
}>()

// 响应式数据 
const waveContainer = ref<HTMLElement>()

// RecorderSetting组件引用
const recorderSettingRef = ref<InstanceType<typeof RecorderSetting>>()

// 使用 store 中的数据
const currentState = computed(() => recorderStore.currentState)
const currentDuration = computed(() => recorderStore.currentDuration)
const currentRecord = computed(() => recorderStore.currentRecord) 
const cancelConfirmVisible = computed(() => recorderStore.cancelConfirmVisible)
const saveDialogVisible = computed(() => recorderStore.saveDialogVisible)
const recordListDialogVisible = computed(() => recorderStore.recordListDialogVisible)
const settingDialogVisible = computed(() => recorderStore.settingDialogVisible)
const currentAudioRecord = ref<AudioRecord>()

// 主题检测
const isDarkMode = computed(() => {
    if (props.themeMode === 'dark') return true
    if (props.themeMode === 'light') return false
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
})

// 移动端检测
const isMobile = computed(() => {
    if (!props.mobileOptimized) return false
    if (typeof window !== 'undefined') {
        return window.innerWidth <= 768
    }
    return false
})

// 主题类名
const themeClass = computed(() => {
    return isDarkMode.value ? 'sdkwork-recorder--dark' : 'sdkwork-recorder--light'
})

// 移动端类名
const mobileClass = computed(() => {
    return isMobile.value ? 'sdkwork-recorder--mobile' : ''
})

// 容器样式
const containerStyle = computed(() => {
    const style: Record<string, string> = {}

    // 设置最大尺寸限制
    style.maxWidth = '100vw'
    style.width = '100vw'
    style.height = '100dvh'
    style.overflow = 'hidden'

    // 移动端安全区域支持
    if (isMobile.value) {
        style.paddingTop = 'env(safe-area-inset-top, 0px)'
        style.paddingBottom = 'env(safe-area-inset-bottom, 0px)'
        style.paddingLeft = 'env(safe-area-inset-left, 0px)'
        style.paddingRight = 'env(safe-area-inset-right, 0px)'
    }

    return style
})

// 计算属性
const containerClass = computed(() => [
    'sdkwork-audio-recorder',
    props.containerClass,
    `state-${currentState.value}`,
    themeClass.value,
    mobileClass.value
].filter(Boolean).join(' ')) 

// 事件处理
const handleBackClick = () => {
    if (props.onBack) {
        props.onBack()
    }
}

const handleShowRecordList = () => { 
    recorderStore.toggleRecordListDialog(true)
}

const handleSettingClick = () => {
    recorderStore.toggleSettingDialog(true)
}

const handleConfigUpdate = (config: RecorderConfig) => {
    recorderStore.updateConfig(config)
    emit('update:config', config)
}

const handleCloseSettingDialog = () => {
    recorderStore.toggleSettingDialog(false)
}

// 录制操作 - 直接调用 store 方法
const handleRecordStart = async () => {
    try {
        await recorderStore.startRecording({})
        emit('start')
    } catch (error) {
        handleError(error)
    }
}

const handleRecordPause = () => {
    recorderStore.pauseRecording()
    emit('pause')
}

const handleRecordResume = () => {
    recorderStore.resumeRecording()
    emit('resume')
}

const handleRecordCancel = () => {
    recorderStore.toggleCancelConfirm(true)
}

const handleRecordFinish = async () => {
    try {
        if(recorderStore.isPaused){
            recorderStore.resumeRecording()
        }
        const record = await recorderStore.stopRecording()
        if (record) {
            emit('stop')
            emit('record-complete', record)
        }
    } catch (error) {
        handleError(error)
    }
}

// 录制记录操作
const handleRecordClick = (record: AudioRecord) => {
    emit('record-click', record)
}

const handleRecordPlay = (record: AudioRecord) => {
    recorderStore.playRecord(record)
    emit('record-play', record)
}

const handleRecordPausePlayback = (record: AudioRecord) => {
    recorderStore.pausePlayback()
    emit('record-pause', record)
}

const handleRecordDelete = (record: AudioRecord) => {
    recorderStore.removeRecord(record.id)
    emit('record-remove', record)
}

const handleRecordDownload = (record: AudioRecord) => {
    // 实现下载逻辑
    console.log('下载录音:', record)
}

const handleRecordClear = () => {
    recorderStore.clearRecords()
    emit('record-clear')
}

// 保存对话框操作
const handleRecordSave = (data: { record: AudioRecord; title: string }) => {
    // 更新记录名称
    if (data.record.id) {
        recorderStore.updateRecord(data.record.id, { name: data.title })
    }
    emit('record-save', data)
    recorderStore.toggleSaveDialog(false)
}

const handleRecordSaveCancel = (data: AudioRecord) => {
    emit('record-save-cancel', data)
    recorderStore.toggleSaveDialog(false)
}

const closeSaveDialog = () => {
    recorderStore.toggleSaveDialog(false)
}

// 弹窗操作
const handleCloseRecordListPopup = () => {
    recorderStore.toggleRecordListDialog(false)
}

const cancelConfirm = async (confirm: boolean) => {
    if (confirm) {
        try {
            // 执行取消录制操作
            recorderStore.cancelRecording()
            emit('cancel')
            
            // 确保状态正确重置
            await nextTick()
            console.log('录制已取消，当前状态:', recorderStore.currentState)
        } catch (error) {
            console.error('取消录制时出错:', error)
            handleError(error)
        }
    }
    
    // 关闭确认对话框
    recorderStore.toggleCancelConfirm(false)
}

// 错误处理
const handleError = (error: any) => {
    const errorMessage = error instanceof Error ? error.message : '录制出现错误'
    recorderStore.setError(errorMessage)
    emit('record-error', error instanceof Error ? error : new Error(errorMessage))
}

// 监听配置变化，更新波形容器
watch(() => props.config, (newConfig) => {
    recorderStore.updateConfig(newConfig)
    
    // 配置变化时重新设置波形容器
    if (waveContainer.value && newConfig.enableWave) {
        recorderStore.setWaveContainer(waveContainer.value)
        console.log('配置变化，波形容器已更新')
    }
}, { deep: true, immediate: true })

// 监听波形容器元素变化
watch(waveContainer, (newContainer) => {
    if (newContainer && props.config.enableWave) {
        recorderStore.setWaveContainer(newContainer)
        console.log('波形容器元素变化，已更新')
    }
})

// 生命周期
onMounted(async () => {
    // 初始化录制器配置
    recorderStore.updateConfig(props.config)
    
    // 初始化音频录制器
    try {
        await nextTick()
        
        // 设置波形容器
        if (waveContainer.value && props.config.enableWave) {
            recorderStore.setWaveContainer(waveContainer.value)
            console.log('波形容器已设置:', waveContainer.value)
        }
        
    } catch (error) {
        handleError(error)
    }
})

onUnmounted(() => {
    // 清理资源
    recorderStore.cleanup()
})
</script>

<style scoped>
.sdkwork-audio-recorder {
    position: relative;
    background: #000000;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow: hidden;
}

.recorder-main {
    flex: 1;
    min-height: 0;
}

.wave-section {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    min-height: 120px;
}

.wave-display-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    overflow: hidden;
}

.timer-section {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
}

.latest-record-section {
    padding: 0 20px 20px;
}

.controls-section {
    flex-shrink: 0;
}

.recording-hints {
    text-align: center;
    color: #888888 !important;
    font-size: 12px;
    margin-top: 8px;
}

.max-duration-hint,
.marker-hint {
    margin-bottom: 4px;
    color: #888888 !important;
}

/* 确认对话框样式 */
.confirm-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
}

.confirm-dialog {
    background: #1a1a1a;
    border-radius: 12px;
    padding: 24px;
    max-width: 320px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.confirm-dialog__header {
    margin-bottom: 16px;
}

.confirm-dialog__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
}

.confirm-dialog__body {
    margin-bottom: 24px;
}

.confirm-dialog__message {
    margin: 0;
    font-size: 14px;
    color: #cccccc;
    line-height: 1.5;
}

.confirm-dialog__footer {
    display: flex;
    gap: 12px;
}

.confirm-dialog__btn {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.confirm-dialog__btn--cancel {
    background: #333333;
    color: #ffffff;
}

.confirm-dialog__btn--cancel:hover {
    background: #444444;
}

.confirm-dialog__btn--confirm {
    background: #dc3545;
    color: #ffffff;
}

.confirm-dialog__btn--confirm:hover {
    background: #c82333;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .wave-section {
        padding: 16px;
        min-height: 100px;
    }
    
    .timer-section {
        padding: 16px 0;
    }
    
    .latest-record-section {
        padding: 0 16px 16px;
    }
    
    .confirm-dialog-overlay {
        padding: 16px;
    }
    
    .confirm-dialog {
        padding: 20px;
        max-width: 280px;
    }
}

@media (max-width: 480px) {
    .wave-section {
        padding: 12px;
        min-height: 80px;
    }
    
    .timer-section {
        padding: 12px 0;
    }
    
    .latest-record-section {
        padding: 0 12px 12px;
    }
    
    .confirm-dialog-overlay {
        padding: 12px;
    }
    
    .confirm-dialog {
        padding: 16px;
        max-width: 260px;
    }
    
    .confirm-dialog__title {
        font-size: 16px;
    }
    
    .confirm-dialog__message {
        font-size: 13px;
    }
    
    .confirm-dialog__btn {
        padding: 10px 14px;
        font-size: 13px;
    }
}
</style>