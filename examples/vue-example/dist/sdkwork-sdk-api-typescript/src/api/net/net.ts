import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { DnsApi } from './dns';
import { HostApi } from './host';

export class NetApi extends BaseSdkApi {
    dns: DnsApi = new DnsApi(this._client);
    host: HostApi = new HostApi(this._client);
}