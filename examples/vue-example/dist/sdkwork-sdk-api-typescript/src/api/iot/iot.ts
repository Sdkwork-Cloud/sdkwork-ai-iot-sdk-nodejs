import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { EventApi } from './event';
import { DeviceApi } from './device';
import { ThingApi } from './thing';

export class IotApi extends BaseSdkApi {
    event: EventApi = new EventApi(this._client);
    device: DeviceApi = new DeviceApi(this._client);
    thing: ThingApi = new ThingApi(this._client);
}