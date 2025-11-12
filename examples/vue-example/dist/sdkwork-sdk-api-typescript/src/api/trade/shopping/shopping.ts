import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { CartApi } from './cart';

export class ShoppingApi extends BaseSdkApi {
    cart: CartApi = new CartApi(this._client);
}