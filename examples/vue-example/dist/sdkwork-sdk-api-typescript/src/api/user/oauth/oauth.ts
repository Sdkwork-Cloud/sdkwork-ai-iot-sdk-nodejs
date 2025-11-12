import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { AccountApi } from './account';

export class OauthApi extends BaseSdkApi {
    account: AccountApi = new AccountApi(this._client);
}