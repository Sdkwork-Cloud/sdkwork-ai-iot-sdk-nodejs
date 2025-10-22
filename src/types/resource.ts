import { MediaResourceType } from './enums';

/**
 * Media Resource Interface
 *
 * Base interface for all media resources (images, audio, video, etc.)
 */
export interface MediaResource {
  /**
   * Resource URL if available
   */
  url?: string;

  /**
   * Raw binary data of the resource
   */
  bytes?: Uint8Array;

  /**
   * Base64 encoded data of the resource
   */
  base64?: string;

  /**
   * Type of the media resource
   */
  type: MediaResourceType;

  /**
   * Size of the resource in bytes
   */
  size?: number;

  /**
   * Metadata tags associated with the resource
   */
  tags?: TagsContent;
}

/**
 * Tags Content Interface
 *
 * Contains metadata tags for resources
 */
export interface TagsContent {
  /**
   * Array of tag strings describing the resource
   */
  tags: string[];
}

export interface ImageMediaResource extends MediaResource {
  type: MediaResourceType.IMAGE;

  /**
   * Width of the image in pixels
   */
  width: number;

  /**
   * Height of the image in pixels
   */
  height: number;
}

export interface VideoMediaResource extends MediaResource {
  type: MediaResourceType.VIDEO;

  /**
   * Width of the video in pixels
   */
  width: number;

  /**
   * Height of the video in pixels
   */
  height: number;
}

export interface AudioMediaResource extends MediaResource {
  type: MediaResourceType.AUDIO;

  /**
   * Duration of the audio in seconds
   */
  duration?: number;

  /**
   * Sample rate in Hz
   */
  sample_rate?: number;

  /**
   * Number of audio channels (1 for mono, 2 for stereo)
   */
  channels?: number;
}

export interface FileMediaResource extends MediaResource {
  type: MediaResourceType.FILE;

  /**
   * File extension (e.g. 'pdf', 'docx')
   */
  extension: string;

  /**
   * MIME type of the file
   */
  mime_type: string;
}
