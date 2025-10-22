import { AudioMediaResource } from '@/types/resource';
import { BaseBinaryRequestProtocol } from '../BaseBinaryRequestProtocol';
import { MessageRequestProtocol } from '../MessageRequestProtocol';

export interface BinaryAudioMessageRequestProtocol
  extends BaseBinaryRequestProtocol,
    MessageRequestProtocol {
  /** Audio media resource */
  audio?: AudioMediaResource;
}
