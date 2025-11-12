import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { CardApi } from './card';
import { LevelApi } from './level';

export class MemberApi extends BaseSdkApi {
    card: CardApi = new CardApi(this._client);
    level: LevelApi = new LevelApi(this._client);
}