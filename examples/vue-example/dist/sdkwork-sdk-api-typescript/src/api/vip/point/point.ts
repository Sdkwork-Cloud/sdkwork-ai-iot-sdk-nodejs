import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { ChangeApi } from './change';

export class PointApi extends BaseSdkApi {
    change: ChangeApi = new ChangeApi(this._client);
}