import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { DomainApi } from './domain';

export class HostApi extends BaseSdkApi {
    domain: DomainApi = new DomainApi(this._client);
}