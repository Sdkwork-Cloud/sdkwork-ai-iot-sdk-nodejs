import { useAppConfig } from "@/config/app";
import { TokenManager } from "sdkwork-commons-typescript";
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_REFRESH_TOKEN_KEY = "auth_refresh_token";
export class DefaultTokenManager implements TokenManager {
  private _authToken: string | null = null;
  private _refreshToken: string | null = null;
  private _accessToken: string | null = null;

  constructor() {
    // 初始化时从 localStorage 加载 token
    this._authToken = localStorage.getItem(AUTH_TOKEN_KEY);
    this._refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
    const appConfig = useAppConfig();
    this._accessToken = appConfig.accessToken;
  }

  getAuthToken(): string | null {
    const queryAuthToken = window.$getParameter([
      "authToken",
      "auth_token",
      "auth-token",
    ]);
    if (queryAuthToken) {
      return queryAuthToken;
    }
    // 优先返回内存中的值，如果不存在则从 localStorage 获取
    if (this._authToken === null) {
      this._authToken = localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return this._authToken;
  }

  getRefreshToken(): string | null {
    // 优先返回内存中的值，如果不存在则从 localStorage 获取
    if (this._refreshToken === null) {
      this._refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
    }
    return this._refreshToken;
  }

  getAccessToken(): string | null {
    const queryAuthToken = window.$getParameter([
      "accesssToken",
      "accesss_token",
      "accesss-token",
    ]);
    if (queryAuthToken) {
      return queryAuthToken;
    }
    // 优先返回内存中的值，如果不存在则从配置获取
    if (this._accessToken === null) {
      const appConfig = useAppConfig();
      this._accessToken = appConfig.accessToken;
    }
    return this._accessToken;
  }

  setAuthToken(token: string): void {
    // 同时更新内存和 localStorage
    this._authToken = token;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  setRefreshToken(token: string): void {
    // 同时更新内存和 localStorage
    this._refreshToken = token;
    localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, token);
  }

  setAccessToken(token: string): void {
    // 仅更新内存中的值
    this._accessToken = token;
  }

  clearTokens(): void {
    // 同时清除内存和 localStorage 中的值
    this._authToken = null;
    this._refreshToken = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  }
}
export const tokenManager = new DefaultTokenManager();
