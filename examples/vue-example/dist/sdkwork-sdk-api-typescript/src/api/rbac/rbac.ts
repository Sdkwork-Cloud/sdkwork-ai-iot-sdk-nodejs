import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { UserApi } from './user';

export class RbacApi extends BaseSdkApi {
    user: UserApi = new UserApi(this._client);
}