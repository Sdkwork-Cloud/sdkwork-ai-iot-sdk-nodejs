import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { TemplateApi } from './template';

export class PptApi extends BaseSdkApi {
    template: TemplateApi = new TemplateApi(this._client);
}