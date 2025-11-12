import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { KeyApi } from './key';

export class ShardingApi extends BaseSdkApi {
    key: KeyApi = new KeyApi(this._client);
}