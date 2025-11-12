import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { ChatApi } from './chat';

export class SearchApi extends BaseSdkApi {
    chat: ChatApi = new ChatApi(this._client);
}