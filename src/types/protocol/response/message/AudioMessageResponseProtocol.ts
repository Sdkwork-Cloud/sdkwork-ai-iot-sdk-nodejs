import { BaseBinaryResponseProtocol } from '../BaseBinaryResponseProtocol';
import { BinaryResponseProtocol } from '../../base';
export interface AudioMessageResponseProtocol
  extends BaseBinaryResponseProtocol,
    BinaryResponseProtocol {
  /** Text content */
  text?: string;
}
