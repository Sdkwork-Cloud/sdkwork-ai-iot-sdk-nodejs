import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { AccountApi } from './account';
import { ResourceApi } from './resource';

export class ChannelApi extends BaseSdkApi {
    account: AccountApi = new AccountApi(this._client);
    resource: ResourceApi = new ResourceApi(this._client);
}