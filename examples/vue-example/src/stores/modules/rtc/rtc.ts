// ==================== RTC Store 实现 ====================

import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import {
    RTCStoreState,
    RTCConnectionState,
    RTCCallType,
    RTCDirection,
    RTCCallStatus,
    RTCDeviceType,
    RTCDeviceInfo,
    RTCCallInfo,
    RTCStats,
    RTCStoreConfig,
    RTCEventType,
    RTCEventData,
    RTCCallRequest,
    RTCCallResponse
} from './types'

// 默认配置
const DEFAULT_CONFIG: RTCStoreConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ],
    audioConstraints: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    },
    videoConstraints: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
    },
    screenConstraints: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
    },
    dataChannel: true,
    autoAnswer: false,
    maxCallDuration: 3600 // 1小时
}

// 默认状态
const DEFAULT_STATE: RTCStoreState = {
    // 基础状态
    loading: false,
    error: null,
    initialized: false,

    // RTC客户端
    rtcClient: null,
    connectionState: RTCConnectionState.DISCONNECTED,
    iceConnectionState: 'new' as RTCIceConnectionState,
    signalingState: 'stable' as RTCSignalingState,

    // 当前通话
    currentCall: null,
    activeCalls: [],
    callHistory: [],

    // 媒体设备
    availableDevices: [],
    selectedDevices: {
        camera: undefined,
        microphone: undefined,
        speaker: undefined
    },

    // 媒体状态
    isAudioEnabled: true,
    isVideoEnabled: true,
    isScreenSharing: false,
    isMuted: false,
    isSpeakerEnabled: true,

    // 统计数据
    stats: null,
    callDuration: 0,

    // 配置
    config: { ...DEFAULT_CONFIG }
}

export const useRTCStore = defineStore('rtc', {
    // ==================== State ====================
    state: () => ({
        // 基础状态
        loading: false,
        error: null as string | null,
        initialized: false,

        // RTC客户端
        rtcClient: null as any,
        connectionState: RTCConnectionState.DISCONNECTED,
        iceConnectionState: 'new' as RTCIceConnectionState,
        signalingState: 'stable' as RTCSignalingState,

        // 当前通话
        currentCall: null as RTCCallInfo | null,
        activeCalls: [] as RTCCallInfo[],
        callHistory: [] as RTCCallInfo[],

        // 媒体设备
        availableDevices: [] as RTCDeviceInfo[],
        selectedDevices: {
            camera: undefined as string | undefined,
            microphone: undefined as string | undefined,
            speaker: undefined as string | undefined
        },

        // 媒体状态
        isAudioEnabled: true,
        isVideoEnabled: true,
        isScreenSharing: false,
        isMuted: false,
        isSpeakerEnabled: true,

        // 统计数据
        stats: null as RTCStats | null,
        callDuration: 0,

        // 配置
        config: { ...DEFAULT_CONFIG },

        // 私有状态（不会被响应式监听）
        _callTimer: null as number | null,
        _statsTimer: null as number | null,
        _startTime: 0,
        _eventListeners: [] as Function[],
        _peerConnection: null as RTCPeerConnection | null
    }),

    // ==================== Getters ====================
    getters: {
        // 连接状态检查
        isConnected: (state) =>
            state.connectionState === RTCConnectionState.CONNECTED,

        isConnecting: (state) =>
            state.connectionState === RTCConnectionState.CONNECTING,

        isDisconnected: (state) =>
            state.connectionState === RTCConnectionState.DISCONNECTED,

        isFailed: (state) =>
            state.connectionState === RTCConnectionState.FAILED,

        // 通话状态检查
        isCallActive: (state) =>
            state.currentCall?.status === RTCCallStatus.ACTIVE,

        isCallRinging: (state) =>
            state.currentCall?.status === RTCCallStatus.RINGING,

        isCallIdle: (state) =>
            !state.currentCall || state.currentCall.status === RTCCallStatus.IDLE,

        hasActiveCalls: (state) =>
            state.activeCalls.length > 0,

        // 通话信息
        currentCallInfo: (state) =>
            state.currentCall,

        activeCallCount: (state) =>
            state.activeCalls.length,

        callHistoryCount: (state) =>
            state.callHistory.length,

        // 设备信息
        availableCameras: (state) =>
            state.availableDevices.filter(device => device.type === RTCDeviceType.CAMERA),

        availableMicrophones: (state) =>
            state.availableDevices.filter(device => device.type === RTCDeviceType.MICROPHONE),

        availableSpeakers: (state) =>
            state.availableDevices.filter(device => device.type === RTCDeviceType.SPEAKER),

        selectedCamera: (state) =>
            state.availableDevices.find(device => 
                device.id === state.selectedDevices.camera && device.type === RTCDeviceType.CAMERA
            ),

        selectedMicrophone: (state) =>
            state.availableDevices.find(device => 
                device.id === state.selectedDevices.microphone && device.type === RTCDeviceType.MICROPHONE
            ),

        selectedSpeaker: (state) =>
            state.availableDevices.find(device => 
                device.id === state.selectedDevices.speaker && device.type === RTCDeviceType.SPEAKER
            ),

        // 媒体状态检查
        isAudioAvailable: (state) =>
            state.isAudioEnabled && !state.isMuted,

        isVideoAvailable: (state) =>
            state.isVideoEnabled,

        isScreenAvailable: (state) =>
            state.isScreenSharing,

        // 统计数据
        callStats: (state) =>
            state.stats,

        formattedCallDuration: (state) => {
            const hours = Math.floor(state.callDuration / 3600)
            const minutes = Math.floor((state.callDuration % 3600) / 60)
            const seconds = state.callDuration % 60
            
            if (hours > 0) {
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            }
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
    },

    // ==================== Actions ====================
    actions: {
        // 配置操作
        updateConfig(newConfig: Partial<RTCStoreConfig>) {
            Object.assign(this.config, newConfig)
        },

        resetConfig() {
            this.config = { ...DEFAULT_CONFIG }
        },

        // 初始化操作
        async initializeRTC() {
            if (this.initialized) {
                console.warn('RTC already initialized')
                return
            }

            this.loading = true
            this.error = null

            try {
                // 初始化媒体设备
                await this.initializeDevices()
                
                // 创建RTC客户端
                this._peerConnection = new RTCPeerConnection({
                    iceServers: this.config.iceServers
                })

                // 设置事件监听器
                this.setupEventListeners()

                this.initialized = true
                this.connectionState = RTCConnectionState.CONNECTED

            } catch (error) {
                this.error = error instanceof Error ? error.message : 'RTC初始化失败'
                this.connectionState = RTCConnectionState.FAILED
                console.error('RTC initialization failed:', error)
            } finally {
                this.loading = false
            }
        },

        // 设备管理
        async initializeDevices() {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices()
                this.availableDevices = devices.map(device => ({
                    id: device.deviceId,
                    label: device.label || `设备 ${device.kind}`,
                    type: this.mapDeviceKindToType(device.kind),
                    isDefault: !device.deviceId
                }))

                // 设置默认设备
                this.setDefaultDevices()

            } catch (error) {
                console.error('Device enumeration failed:', error)
                throw error
            }
        },

        mapDeviceKindToType(kind: string): RTCDeviceType {
            switch (kind) {
                case 'videoinput':
                    return RTCDeviceType.CAMERA
                case 'audioinput':
                    return RTCDeviceType.MICROPHONE
                case 'audiooutput':
                    return RTCDeviceType.SPEAKER
                default:
                    return RTCDeviceType.MICROPHONE
            }
        },

        setDefaultDevices() {
            const cameras = this.availableDevices.filter(d => d.type === RTCDeviceType.CAMERA)
            const mics = this.availableDevices.filter(d => d.type === RTCDeviceType.MICROPHONE)
            const speakers = this.availableDevices.filter(d => d.type === RTCDeviceType.SPEAKER)

            if (cameras.length > 0 && !this.selectedDevices.camera) {
                this.selectedDevices.camera = cameras[0].id
            }
            if (mics.length > 0 && !this.selectedDevices.microphone) {
                this.selectedDevices.microphone = mics[0].id
            }
            if (speakers.length > 0 && !this.selectedDevices.speaker) {
                this.selectedDevices.speaker = speakers[0].id
            }
        },

        // 设备选择
        selectCamera(deviceId: string) {
            this.selectedDevices.camera = deviceId
        },

        selectMicrophone(deviceId: string) {
            this.selectedDevices.microphone = deviceId
        },

        selectSpeaker(deviceId: string) {
            this.selectedDevices.speaker = deviceId
        },

        // 媒体控制
        toggleAudio() {
            this.isAudioEnabled = !this.isAudioEnabled
        },

        toggleVideo() {
            this.isVideoEnabled = !this.isVideoEnabled
        },

        toggleMute() {
            this.isMuted = !this.isMuted
        },

        toggleSpeaker() {
            this.isSpeakerEnabled = !this.isSpeakerEnabled
        },

        // 通话管理
        async makeCall(request: RTCCallRequest): Promise<string> {
            if (!this.initialized) {
                throw new Error('RTC not initialized')
            }

            if (this.currentCall && this.currentCall.status === RTCCallStatus.ACTIVE) {
                throw new Error('Already in an active call')
            }

            const callId = `call_${Date.now()}`
            const callInfo: RTCCallInfo = {
                id: callId,
                callId: callId,
                targetUserId: request.targetUserId,
                callType: request.callType,
                direction: RTCDirection.OUTGOING,
                status: RTCCallStatus.RINGING,
                startTime: Date.now(),
                isMuted: this.isMuted,
                isVideoEnabled: this.isVideoEnabled,
                isScreenSharing: false
            }

            this.currentCall = callInfo
            this.activeCalls.push(callInfo)

            try {
                // 创建媒体流
                const stream = await this.createMediaStream(request.callType)
                callInfo.localStream = stream

                // 创建offer
                const offer = await this._peerConnection!.createOffer()
                await this._peerConnection!.setLocalDescription(offer)

                // 这里应该发送offer到对方
                console.log('Call offer created:', offer)

                return callId

            } catch (error) {
                this.currentCall = null
                this.activeCalls = this.activeCalls.filter(call => call.id !== callId)
                throw error
            }
        },

        async answerCall(callId: string) {
            const call = this.activeCalls.find(c => c.id === callId)
            if (!call) {
                throw new Error('Call not found')
            }

            call.status = RTCCallStatus.ACTIVE
            this.currentCall = call

            try {
                // 创建媒体流
                const stream = await this.createMediaStream(call.callType)
                call.localStream = stream

                // 创建answer
                const answer = await this._peerConnection!.createAnswer()
                await this._peerConnection!.setLocalDescription(answer)

                // 这里应该发送answer到对方
                console.log('Call answer created:', answer)

                this.startCallTimer()

            } catch (error) {
                call.status = RTCCallStatus.ENDED
                this.currentCall = null
                throw error
            }
        },

        async rejectCall(callId: string) {
            const call = this.activeCalls.find(c => c.id === callId)
            if (!call) {
                throw new Error('Call not found')
            }

            call.status = RTCCallStatus.REJECTED
            call.endTime = Date.now()
            
            if (this.currentCall?.id === callId) {
                this.currentCall = null
            }

            this.moveCallToHistory(call)
        },

        async endCall(callId: string) {
            const call = this.activeCalls.find(c => c.id === callId)
            if (!call) {
                throw new Error('Call not found')
            }

            call.status = RTCCallStatus.ENDED
            call.endTime = Date.now()
            call.duration = this.callDuration
            
            if (this.currentCall?.id === callId) {
                this.currentCall = null
            }

            this.stopCallTimer()
            this.moveCallToHistory(call)

            // 关闭媒体流
            if (call.localStream) {
                call.localStream.getTracks().forEach(track => track.stop())
            }
        },

        // 媒体流管理
        async createMediaStream(callType: RTCCallType): Promise<MediaStream> {
            const constraints: MediaStreamConstraints = {}

            if (callType === RTCCallType.VOICE || callType === RTCCallType.VIDEO) {
                constraints.audio = {
                    ...this.config.audioConstraints,
                    deviceId: this.selectedDevices.microphone ? { exact: this.selectedDevices.microphone } : undefined
                }
            }

            if (callType === RTCCallType.VIDEO) {
                constraints.video = {
                    ...this.config.videoConstraints,
                    deviceId: this.selectedDevices.camera ? { exact: this.selectedDevices.camera } : undefined
                }
            }

            if (callType === RTCCallType.SCREEN_SHARE) {
                constraints.video = {
                    ...this.config.screenConstraints
                } as any
            }

            try {
                let stream: MediaStream
                
                if (callType === RTCCallType.SCREEN_SHARE) {
                    stream = await navigator.mediaDevices.getDisplayMedia(constraints)
                } else {
                    stream = await navigator.mediaDevices.getUserMedia(constraints)
                }

                return stream

            } catch (error) {
                console.error('Media stream creation failed:', error)
                throw error
            }
        },

        // 计时器管理
        startCallTimer() {
            this._startTime = Date.now()
            this.callDuration = 0
            
            this._callTimer = window.setInterval(() => {
                this.callDuration = Math.floor((Date.now() - this._startTime) / 1000)
            }, 1000)
        },

        stopCallTimer() {
            if (this._callTimer) {
                clearInterval(this._callTimer)
                this._callTimer = null
            }
        },

        // 事件监听器
        setupEventListeners() {
            if (!this._peerConnection) return

            const listeners = [
                // ICE连接状态变化
                () => this._peerConnection!.oniceconnectionstatechange = () => {
                    this.iceConnectionState = this._peerConnection!.iceConnectionState
                },
                
                // 信令状态变化
                () => this._peerConnection!.onsignalingstatechange = () => {
                    this.signalingState = this._peerConnection!.signalingState
                },
                
                // ICE候选
                () => this._peerConnection!.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log('New ICE candidate:', event.candidate)
                    }
                },
                
                // 远程流
                () => this._peerConnection!.ontrack = (event) => {
                    if (this.currentCall) {
                        this.currentCall.remoteStream = event.streams[0]
                    }
                }
            ]

            listeners.forEach(setup => setup())
            this._eventListeners = listeners
        },

        // 通话历史管理
        moveCallToHistory(call: RTCCallInfo) {
            this.activeCalls = this.activeCalls.filter(c => c.id !== call.id)
            this.callHistory.unshift(call)
            
            // 保持历史记录数量合理
            if (this.callHistory.length > 100) {
                this.callHistory = this.callHistory.slice(0, 100)
            }
        },

        clearCallHistory() {
            this.callHistory = []
        },

        // 错误处理
        setError(message: string) {
            this.error = message
        },

        clearError() {
            this.error = null
        },

        // 清理资源
        destroy() {
            // 停止所有计时器
            this.stopCallTimer()
            if (this._statsTimer) {
                clearInterval(this._statsTimer)
                this._statsTimer = null
            }

            // 结束所有活跃通话
            this.activeCalls.forEach(call => {
                if (call.localStream) {
                    call.localStream.getTracks().forEach(track => track.stop())
                }
            })

            // 关闭PeerConnection
            if (this._peerConnection) {
                this._peerConnection.close()
                this._peerConnection = null
            }

            // 移除事件监听器
            this._eventListeners.forEach(remove => remove())
            this._eventListeners = []

            // 重置状态
            Object.assign(this, DEFAULT_STATE)
        }
    }
})