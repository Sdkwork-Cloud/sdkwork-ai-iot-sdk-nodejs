import { AudioFormat } from '../enums';
export type ProtocolPayloadType =
  | 'hello'
  | 'listen'
  | 'mcp'
  | 'abort'
  | 'iot'
  | 'chat'
  | 'im'
  | 'image'
  | 'vision';
export interface Protocol {
  /** Session identifier */
  session_id?: string;
  /** Protocol version */
  version?: string;
  /** Protocol type */
  type: ProtocolPayloadType;
}

export interface RequestProtocol extends Protocol {
  /** Chat context information */
  chat_context?: any;
}

export interface ResponseProtocol extends Protocol {}

export interface EventProtocol extends Protocol {}

export interface BinaryProtocol extends Protocol {
  /** Binary data content */
  data?: Uint8Array;
  /** Original binary data */
  original_data?: Uint8Array;
  /** Frame data list */
  frames?: Uint8Array[];
  /** Audio format */
  format?: AudioFormat;
}

export interface BinaryRequestProtocol extends BinaryProtocol, RequestProtocol {}

export interface BinaryResponseProtocol extends BinaryProtocol, ResponseProtocol {}

export interface MessageRequestProtocol extends RequestProtocol {}

export interface BaseRequestProtocol extends RequestProtocol {}

export interface BaseResponseProtocol extends ResponseProtocol {}

export interface BaseMcpProtocol extends Protocol {
  payload: any;
}

export interface JsonPayload extends Protocol {
  /** JSON-RPC version */
  jsonrpc?: string;
  /** Method name */
  method?: string;
  /** Method parameters */
  params?: Map<string, any>;
  /** Request identifier */
  id?: number;
  /** Method execution result */
  result?: Map<string, any>;
  /** Error information */
  error?: any;
}
