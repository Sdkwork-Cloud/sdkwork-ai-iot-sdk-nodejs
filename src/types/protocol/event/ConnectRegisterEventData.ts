import { BaseObject } from '../../common';
/**
 * Connect register event data
 */
export interface ConnectRegisterEventData extends BaseObject {
  /**
   * Device ID
   */
  device_id: string;

  /**
   * Client ID
   */
  client_id: string;

  /**
   * MAC address
   */
  mac_address: string;
}
