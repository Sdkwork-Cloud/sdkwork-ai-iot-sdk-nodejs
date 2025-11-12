import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { BenefitApi } from './benefit';
import { LevelApi } from './level';
import { PointApi } from './point';
import { RechargeApi } from './recharge';
import { UserApi } from './user';

export class VipApi extends BaseSdkApi {
    benefit: BenefitApi = new BenefitApi(this._client);
    level: LevelApi = new LevelApi(this._client);
    point: PointApi = new PointApi(this._client);
    recharge: RechargeApi = new RechargeApi(this._client);
    user: UserApi = new UserApi(this._client);
}