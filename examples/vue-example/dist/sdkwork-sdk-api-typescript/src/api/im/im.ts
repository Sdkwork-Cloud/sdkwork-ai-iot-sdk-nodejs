import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { MessageApi } from './message';
import { GroupApi } from './group';

export class ImApi extends BaseSdkApi {
    message: MessageApi = new MessageApi(this._client);
    group: GroupApi = new GroupApi(this._client);
}