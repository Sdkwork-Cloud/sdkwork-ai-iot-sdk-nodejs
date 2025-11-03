import type { ChatMessageVO } from "@/services";
import type { ChatOptions } from "sdkwork-sdk-api-typescript";
import type { MessageHandler } from "@/services/message/types";
import type { MessageHandlerType } from "@/services/message/types";
import { IStreamAudioPlayer } from "@/core/audio/player";
import { DeviceAudioParams } from "sdkwork-ai-iot-sdk";

/**
 * 语音状态枚举
 */
export type SpeakState = 'IDLE' | 'LISTENING' | 'SPEAKING'

/**
 * 聊天输入事件类型枚举
 */
export enum ChatInputEventType {
  SEND_MESSAGE = 'send-message',
  SEND_VOICE = 'send-voice',
  SEND_FILE = 'send-file',
  SEND_IMAGE = 'send-image',
  SEND_VIDEO = 'send-video',
  SEND_RTC_REQUEST = 'send-rtc-request',
  SEND_LOCATION = 'send-location',
  INPUT_FOCUS = 'input-focus',
  INPUT_BLUR = 'input-blur',
  TEXT_CHANGE = 'text-change',
  UPLOAD_PROGRESS = 'upload-progress',
  
  // 键盘相关事件
  KEY_DOWN = 'key-down',
  KEY_UP = 'key-up',
  KEY_PRESS = 'key-press',
  
  // 输入相关事件
  INPUT = 'input',
  COMPOSITION_START = 'composition-start',
  COMPOSITION_UPDATE = 'composition-update',
  COMPOSITION_END = 'composition-end',
  
  // 滚动相关事件
  SCROLL = 'scroll',
  SCROLL_TOP = 'scroll-top',
  SCROLL_BOTTOM = 'scroll-bottom',
  
  // 键盘显示/隐藏事件
  KEYBOARD_SHOW = 'keyboard-show',
  KEYBOARD_HIDE = 'keyboard-hide',
  
  // 其他输入事件
  PASTE = 'paste',
  CUT = 'cut',
  COPY = 'copy',
  SELECTION_CHANGE = 'selection-change'
}

/**
 * 统一的事件数据结构
 */
export interface ChatInputEventData {
  type: ChatInputEventType;
  payload?: any;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * 具体的事件负载类型
 */
export interface SendMessagePayload {
  message: Omit<ChatMessageVO, 'id' | 'status' | 'timestamp'>;
}

export interface SendVoicePayload {
  audioBlob: Blob;
  duration: number;
}

export interface SendFilePayload {
  file: File;
  fileType: 'file' | 'image' | 'video';
}

export interface SendRtcRequestPayload {
  type: 'video' | 'voice';
  targetUserId: string;
}

export interface SendLocationPayload {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface TextChangePayload {
  text: string;
}

export interface UploadProgressPayload {
  fileName: string;
  progress: number;
  loaded: number;
  total: number;
}

/**
 * 键盘事件负载
 */
export interface KeyEventPayload {
  key: string;
  code: string;
  keyCode: number;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  event: KeyboardEvent;
}

/**
 * 输入事件负载
 */
export interface InputEventPayload {
  value: string;
  inputType: string;
  data: string | null;
  event: InputEvent;
}

/**
 * 滚动事件负载
 */
export interface ScrollEventPayload {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  scrollDirection: 'up' | 'down';
  event: Event;
}

/**
 * 键盘显示/隐藏事件负载
 */
export interface KeyboardEventPayload {
  keyboardHeight: number;
  viewportHeight: number;
  isVisible: boolean;
}

/**
 * 剪贴板事件负载
 */
export interface ClipboardEventPayload {
  data: string;
  type: 'paste' | 'cut' | 'copy';
  event: ClipboardEvent;
}

/**
 * 选择改变事件负载
 */
export interface SelectionChangePayload {
  selectionStart: number;
  selectionEnd: number;
  selectedText: string;
}

/**
 * 聊天存储状态定义
 */
export interface ChatStoreState {
  // 基础状态
  loading: boolean;
  error: Error | null;
  initialized: boolean;

  // 聊天配置
  options: Partial<ChatOptions>;

  // 消息处理器相关状态
  /** 当前消息处理器类型 */
  currentHandlerType: MessageHandlerType;
  /** 当前消息处理器实例 */
  messageHandler: MessageHandler | null;
  /** 处理器连接状态 */
  handlerConnected: boolean;
  /** 音频播放器 */
  _streamPlayer: IStreamAudioPlayer | null;
  audioParams: DeviceAudioParams | null;
  
  // 语音状态管理
  /** 语音状态 */
  speakState: SpeakState; 
  
  // 聊天模式状态
  /** 当前聊天模式 */
  currentChatMode: 'text' | 'voice' | 'rtc' | null;
  
  // 日志计数器
  /** 音频流日志计数器 */
  _audioStreamLogCounter: number;
}