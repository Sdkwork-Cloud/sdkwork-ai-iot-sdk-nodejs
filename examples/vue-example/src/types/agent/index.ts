import { BaseObject } from '../base';
import { ChatOptions } from '../chat';
import { TagsContent } from '../tags';



// 媒体资源类型
export enum MediaResourceType {
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
  DOCUMENT = 4,
  FILE = 5
}

// 媒体资源基类
export interface MediaResource extends BaseObject {
  url?: string;
  bytes?: number[];
  base64?: string;
  type?: MediaResourceType;
  size?: number;
  tags?: TagsContent;
}

// 图像媒体资源
export interface ImageMediaResource extends MediaResource {
  width?: number;
  height?: number;
}

// 视频媒体资源
export interface VideoMediaResource extends MediaResource {
  duration?: number;
}

// 所有者类型
export enum PlatformOwner {
  DEFAULT = 0,
  TENANT = 1,
  ORGANIZATION = 2
}
 

// Agent类型枚举
export enum AgentType {
  AGENT = 0,
  CHAT = 1,
  TOOL = 2,
  CUSTOM = 3,
  TEAM = 99
}
 
// Agent状态枚举
export enum AgentStatus {
  DEFAULT = 0,
  ACTIVE = 1,
  INACTIVE = 2,
  DELETED = 3
}

// Agent基础配置
export interface AgentBaseConfig {
  welcome?: string;
  questions?: string[];
  saveFiles?: boolean;
  enableMemory?: boolean;
  maxHistoryMessages?: number;
  useKnowledgeBase?: boolean;
  properties?: Record<string, any>;
}

// Agent知识库配置项
export interface AgentKnowledgeItem {
  id?: number;
}

// Agent知识库配置
export interface AgentKnowledgeConfig {
  list?: AgentKnowledgeItem[];
}

// Profile配置项
export interface ProfileItem {
  name?: string;
  label?: string;
  values?: string[];
  custom?: boolean;
  updateCount?: number;
  samples?: string[];
  description?: string;
}

// MemoryProfile类型
export enum MemoryProfileType {
  // 根据实际枚举值补充
}

// Agent内存配置
export interface AgentMemoryConfig {
  profile?: {
    items?: ProfileItem[];
    customs?: Map<MemoryProfileType, ProfileItem[]>;
    description?: string;
  };
}

// 工具使用配置
export interface UseTool {
  id?: number;
  name?: string;
  description?: string;
  enable?: boolean;
}

// Agent工具配置
export interface AgentToolConfig {
  tools?: UseTool[];
}

// 语音说话人信息
export interface VoiceSpeakerInfo {
  provider?: string;
  product?: string;
  id?: string;
  model?: string;
  voice?: string;
  displayName?: string;
  tags?: TagsContent;
  motion?: {
    motions?: string[];
  };
  style?: {
    styles?: string[];
  };
  description?: string;
}

// 语音配置相关接口
export interface SpeechSpeakerConfig {
  speaker?: VoiceSpeakerInfo;
  speakerId?: number;
  volume?: number;
  pitch?: number;
  language?: string;
  speed?: number;
  format?: string;
}

export interface SpeechTranscriptionConfig {
  provider?: string;
  options?: any; // AudioTranscriptionOptions的具体定义需要另外定义
}

export interface VadConfig {
  silenceThreshold?: number;
  minSpeechDurationMs?: number;
  maxSilenceDurationMs?: number;
  windowSize?: number;
  stepSize?: number;
}

export interface AecConfig {
  echoMode?: number;
  delayEstimation?: number;
  noiseSuppression?: number;
  echoTailMs?: number;
  sampleRate?: number;
}

// 音频格式枚举
export enum AudioFormat {
  WAV = 1,
  MP3 = 2,
  AAC = 3,
  FLAC = 4,
  OGG = 5,
  PCM = 6,
  AIFF = 7,
  AU = 8,
  OPUS = 9
}

export interface AudioCodecConfig {
  inputFormat?: AudioFormat;
  outputFormat?: AudioFormat;
}

export interface SpeechConfig {
  speakerConfig?: SpeechSpeakerConfig;
  transcriptionConfig?: SpeechTranscriptionConfig;
  vadConfig?: VadConfig;
  aecConfig?: AecConfig;
  audioCodecConfig?: AudioCodecConfig;
}
 

// Prompt实体
export interface AiPrompt extends BaseObject {
  content?: string;
  // 根据实际类定义补充其他字段
  [key: string]: any;
}



// Agent实体主类
export interface Agent extends BaseObject {
  name?: string;
  faceImage?: ImageMediaResource;
  faceVideo?: VideoMediaResource; 
  icon?: string;
  description?: string;
  tags?: TagsContent;
  type?: AgentType; 
  status?: AgentStatus;
  baseConfig?: AgentBaseConfig;
  knowledgeConfig?: AgentKnowledgeConfig;
  memoryConfig?: AgentMemoryConfig;
  speechConfig?: SpeechConfig;
  toolConfig?: AgentToolConfig;
  chatOptions?: ChatOptions; 
  prompt?: AiPrompt; 
}