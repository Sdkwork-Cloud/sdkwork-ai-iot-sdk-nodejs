import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { RoleApi } from './role';

export class UserApi extends BaseSdkApi {
    role: RoleApi = new RoleApi(this._client);
}