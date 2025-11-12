import { BaseSdkApi } from 'sdkwork-commons-typescript';

import { OrderApi } from './order';
import { PaymentApi } from './payment';
import { RefundApi } from './refund';
import { ShoppingApi } from './shopping';

export class TradeApi extends BaseSdkApi {
    order: OrderApi = new OrderApi(this._client);
    payment: PaymentApi = new PaymentApi(this._client);
    refund: RefundApi = new RefundApi(this._client);
    shopping: ShoppingApi = new ShoppingApi(this._client);
}