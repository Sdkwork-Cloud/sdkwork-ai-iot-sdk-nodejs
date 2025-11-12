import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { CodeApi } from './code';
import { RelationApi } from './relation';

export class InvitationApi extends BaseSdkApi {
    code: CodeApi = new CodeApi(this._client);
    relation: RelationApi = new RelationApi(this._client);
}