import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { BucketApi } from './bucket';
import { FilesApi } from './files';

export class OssApi extends BaseSdkApi {
    bucket: BucketApi = new BucketApi(this._client);
    files: FilesApi = new FilesApi(this._client);
}