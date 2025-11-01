/**
 * 自动生成的TypeScript枚举定义
 * 对应Java枚举: com.sdkwork.ai.iot.type.IotEventType
 */

export enum IotEventType {
    /**
     * CONNECT_REQUEST
     */
    CONNECT_REQUEST = 'CONNECT_REQUEST',
    /**
     * CONNECT_REGISTER
     */
    CONNECT_REGISTER = 'CONNECT_REGISTER',
    /**
     * CONNECTED
     */
    CONNECTED = 'CONNECTED',
    /**
     * DISCONNECTED
     */
    DISCONNECTED = 'DISCONNECTED',
    /**
     * REPORT
     */
    REPORT = 'REPORT',
    /**
     * STATUS
     */
    STATUS = 'STATUS',
    /**
     * COMMAND
     */
    COMMAND = 'COMMAND',
    /**
     * RESPONSE
     */
    RESPONSE = 'RESPONSE',
    /**
     * ALERT
     */
    ALERT = 'ALERT',
    /**
     * UPGRADE
     */
    UPGRADE = 'UPGRADE',
    /**
     * AUTH
     */
    AUTH = 'AUTH',
    /**
     * REGISTER
     */
    REGISTER = 'REGISTER',
    /**
     * BIND_AND_ACTIVATE
     */
    BIND_AND_ACTIVATE = 'BIND_AND_ACTIVATE',
    /**
     * SPEAKING
     */
    SPEAKING = 'SPEAKING',
    /**
     * ABORT
     */
    ABORT = 'ABORT',
    /**
     * LOW_BALANCE
     */
    LOW_BALANCE = 'LOW_BALANCE',
    /**
     * STT_START
     */
    STT_START = 'STT_START',
    /**
     * STT_STOP
     */
    STT_STOP = 'STT_STOP',
    /**
     * TTS_START
     */
    TTS_START = 'TTS_START',
    /**
     * TTS_STOP
     */
    TTS_STOP = 'TTS_STOP',
    /**
     * TTS_SENTENCE_START
     */
    TTS_SENTENCE_START = 'TTS_SENTENCE_START',
    /**
     * TASK_START
     */
    TASK_START = 'TASK_START',
    /**
     * TASK_STOP
     */
    TASK_STOP = 'TASK_STOP',
    /**
     * LISTEN
     */
    LISTEN = 'LISTEN',
    /**
     * WAKEWORD_DETECT
     */
    WAKEWORD_DETECT = 'WAKEWORD_DETECT',
    /**
     * CUSTOM
     */
    CUSTOM = 'CUSTOM'
}
/**
 * 自动生成的TypeScript枚举定义
 * 对应Java枚举: com.sdkwork.ai.iot.type.TtsState
 */

export enum TtsState {
    /**
     * start
     */
    start = 'start',
    /**
     * stop
     */
    stop = 'stop',
    /**
     * sentence_start
     */
    sentence_start = 'sentence_start'
}
/**
 * 自动生成的TypeScript枚举定义
 * 对应Java枚举: com.sdkwork.ai.iot.type.SttState
 */

export enum SttState {
    /**
     * start
     */
    start = 'start',
    /**
     * stop
     */
    stop = 'stop'
}
/**
 * 自动生成的TypeScript枚举定义
 * 对应Java枚举: com.sdkwork.ai.iot.type.ListenMode
 */

export enum ListenMode {
    /**
     * AUTO
     */
    AUTO = 'AUTO',
    /**
     * MANUAL
     */
    MANUAL = 'MANUAL',
    /**
     * REALTIME
     */
    REALTIME = 'REALTIME'
}
/**
 * 自动生成的TypeScript枚举定义
 * 对应Java枚举: com.sdkwork.ai.iot.type.ListenState
 */

export enum ListenState {
    /**
     * IDLE
     */
    IDLE = 'IDLE',
    /**
     * START
     */
    START = 'START',
    /**
     * STOP
     */
    STOP = 'STOP',
    /**
     * DETECT
     */
    DETECT = 'DETECT'
}
/**
 * 自动生成的TypeScript枚举定义
 * 对应Java枚举: com.sdkwork.ai.iot.type.TransportType
 */

export enum TransportType {
    /**
     * websocket
     */
    websocket = 'websocket',
    /**
     * mqtt
     */
    mqtt = 'mqtt',
    /**
     * wukongim
     */
    wukongim = 'wukongim'
}
