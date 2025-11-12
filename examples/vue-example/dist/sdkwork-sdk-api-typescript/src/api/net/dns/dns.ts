import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { RecordApi } from './record';

export class DnsApi extends BaseSdkApi {
    record: RecordApi = new RecordApi(this._client);
}