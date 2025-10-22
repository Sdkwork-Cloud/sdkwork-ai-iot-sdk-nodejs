import { AxiosResponse } from "axios";
import {
  ExceptionResponseHandler,
  SdkResponse,
} from "sdkwork-commons-typescript";

export class DefaultExceptionResponseHandler
  implements ExceptionResponseHandler
{
  onAccessDenied<T>(response: AxiosResponse): SdkResponse<T> {
    const { t } = window.$i18n;
    window.$message.error(t("common.server.forbidden"));

    const result: SdkResponse<any> = {
      data: null,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
    return result;
  }
  onUnauthorized<T>(response: AxiosResponse): SdkResponse<T> {
    const { t } = window.$i18n;
    window.$message.error(t("common.server.unauthorized"));
    window.$router.push("/login");
    const result: SdkResponse<any> = {
      data: null,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
    return result;
  }
  onException<T>(response: AxiosResponse): SdkResponse<T> {
    const { t } = window.$i18n;
    window.$message.error(t("common.server.error"));
    const result: SdkResponse<any> = {
      data: null,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
    };
    return result;
  }
}
