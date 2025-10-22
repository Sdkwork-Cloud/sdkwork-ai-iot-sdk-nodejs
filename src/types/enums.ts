// 连接状态枚举
export enum ConnectionStateEnum {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

// 设备状态枚举
export enum DeviceState {
  IDLE = 'idle',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  PROCESSING = 'processing',
  ERROR = 'error',
}

// Speech-to-Text (STT) State Enum
export enum SttState {
  // STT process is active/started
  start = 1,

  // STT process is inactive/stopped
  stop = 2,
}

// Audio Format Enumeration
export enum AudioFormat {
  // WAV format - Uncompressed audio format developed by Microsoft and IBM
  WAV = 1,

  /**
   * MP3 format - Lossy compressed audio format with high compression ratio
   * Use cases: Music playback, streaming, online audio where file size matters
   */
  MP3 = 2,

  /**
   * AAC format - Advanced Audio Coding, more efficient than MP3
   * Use cases: Apple platforms (iTunes, iPhone), mobile devices
   */
  AAC = 3,

  /**
   * FLAC format - Free Lossless Audio Codec
   * Use cases: Music archiving, professional audio processing requiring lossless quality
   */
  FLAC = 4,

  /**
   * OGG format - Open source container format typically with Vorbis encoding
   * Use cases: Open source software, game audio, web streaming
   */
  OGG = 5,

  /**
   * PCM format - Uncompressed digital audio (Pulse Code Modulation)
   * Use cases: CD audio, digital audio processing, intermediate format for codecs
   */
  PCM = 6,

  /**
   * AIFF format - Audio Interchange File Format by Apple
   * Use cases: Mac systems, professional audio workstations in Apple ecosystem
   */
  AIFF = 7,

  /**
   * AU format - Audio format developed by Sun Microsystems
   * Use cases: Unix systems, early network audio
   */
  AU = 8,

  /**
   * OPUS format - Open, royalty-free audio codec with variable bitrate
   * Use cases: VoIP, video conferencing, live streaming for real-time communication
   */
  OPUS = 9,
}

/**
 * Listening Mode Enumeration
 *
 * Defines voice listening modes for smart devices
 */
export enum ListenMode {
  /**
   * Auto mode - Device automatically detects voice activity to start/stop recording
   */
  AUTO = 1,

  /**
   * Manual mode - Requires explicit start/stop commands to control recording
   */
  MANUAL = 2,

  /**
   * Realtime mode - Streams audio data in real-time (typically for AEC scenarios)
   */
  REALTIME = 3,
}

/**
 * Listening State Enumeration
 *
 * Defines states for device listening process
 */
export enum ListenState {
  /**
   * Listening started
   */
  START = 1,

  /**
   * Listening stopped
   */
  STOP = 2,

  /**
   * Wake-up detection triggered
   */
  DETECT = 3,
}

/**
 * Transport Type Enumeration
 *
 * Defines communication protocols supported by IoT devices
 */
export enum TransportType {
  /**
   * WebSocket protocol
   */
  websocket = 1,

  /**
   * MQTT protocol
   */
  mqtt = 2,

  /**
   * WUKONGIM protocol
   */
  wukongim = 3,
}

/**
 * Text-to-Speech (TTS) State Enum
 *
 * Defines the states for text-to-speech synthesis process
 */
export enum TtsState {
  /**
   * TTS process is active/started
   */
  start = 1,

  /**
   * TTS process is inactive/stopped
   */
  stop = 2,

  /**
   * TTS is processing a new sentence
   */
  sentence_start = 3,
}

/**
 * Media Resource Type Enum
 *
 * Defines types of media resources with numeric values
 */
export enum MediaResourceType {
  /**
   * Image resource type
   */
  IMAGE = 1,

  /**
   * Video resource type
   */
  VIDEO = 2,

  /**
   * Audio resource type
   */
  AUDIO = 3,

  /**
   * Document resource type
   */
  DOCUMENT = 4,

  /**
   * Generic file resource type
   */
  FILE = 5,
}

// 消息类型枚举
export enum MessageType {
  DEFAULT = 0,
  TEXT = 1,
  IMAGE = 2,
  FILE = 3,
  AUDIO = 4,
  VIDEO = 5,
  CODE = 6,
  MARKDOWN = 7,
  MIXED = 8,
  LOCATION = 9,
  BINARY = 99,
}

export enum IotEventType {
  /** Connection request */
  CONNECT_REQUEST = 'CONNECT_REQUEST',
  /** Device registration on connection */
  CONNECT_REGISTER = 'CONNECT_REGISTER',
  /** Device connected */
  CONNECTED = 'CONNECTED',
  /** Device disconnected */
  DISCONNECTED = 'DISCONNECTED',
  /** Data reporting */
  REPORT = 'REPORT',
  /** Status change */
  STATUS = 'STATUS',
  /** Command issued */
  COMMAND = 'COMMAND',
  /** Command response */
  RESPONSE = 'RESPONSE',
  /** Alert event */
  ALERT = 'ALERT',
  /** Firmware upgrade */
  UPGRADE = 'UPGRADE',
  /** Device authentication */
  AUTH = 'AUTH',
  /** Device registration */
  REGISTER = 'REGISTER',
  /** Device needs to be bound and activated */
  BIND_AND_ACTIVATE = 'BIND_AND_ACTIVATE',
  /** Voice recognition start */
  LISTEN = 'LISTEN',
  /** Voice interaction interrupted */
  ABORT = 'ABORT',
  /** Low balance */
  LOW_BALANCE = 'LOW_BALANCE',
  /** Speech recognition start */
  STT_START = 'STT_START',
  /** Speech recognition stop */
  STT_STOP = 'STT_STOP',
  /** Text-to-speech start */
  TTS_START = 'TTS_START',
  /** Text-to-speech sentence start */
  TTS_SENTENCE_START = 'TTS_SENTENCE_START',
  /** Text-to-speech stop */
  TTS_STOP = 'TTS_STOP',
  /** Task start */
  TASK_START = 'TASK_START',
  /** Task stop */
  TASK_STOP = 'TASK_STOP',
  /** Custom event */
  CUSTOM = 'CUSTOM',
}
