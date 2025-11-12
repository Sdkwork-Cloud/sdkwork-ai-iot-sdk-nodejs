import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { AuthenticationApi } from './authentication';
import { AuthorizationApi } from './authorization';
import { OauthApi } from './oauth';
import { VerificationApi } from './verification';

export class AuthApi extends BaseSdkApi {
    authentication: AuthenticationApi = new AuthenticationApi(this._client);
    authorization: AuthorizationApi = new AuthorizationApi(this._client);
    oauth: OauthApi = new OauthApi(this._client);
    verification: VerificationApi = new VerificationApi(this._client);
}