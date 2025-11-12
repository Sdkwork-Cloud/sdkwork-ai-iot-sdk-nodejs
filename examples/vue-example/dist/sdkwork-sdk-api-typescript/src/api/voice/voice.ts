import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { SpeakerApi } from './speaker';

export class VoiceApi extends BaseSdkApi {
    speaker: SpeakerApi = new SpeakerApi(this._client);
}