// 全局类型声明文件
// 为小程序和uniapp环境提供类型定义

declare global {
  // 微信小程序全局对象
  interface WxMiniProgram {
    connectSocket(options: any): any;
    onSocketOpen(callback: Function): void;
    onSocketMessage(callback: Function): void;
    onSocketError(callback: Function): void;
    onSocketClose(callback: Function): void;
    sendSocketMessage(options: any): void;
    closeSocket(options?: any): void;
  }

  // 微信小程序全局变量
  declare const wx: WxMiniProgram | undefined;

  // uniapp全局对象
  interface UniApp {
    connectSocket(options: any): any;
    onSocketOpen(callback: Function): void;
    onSocketMessage(callback: Function): void;
    onSocketError(callback: Function): void;
    onSocketClose(callback: Function): void;
    sendSocketMessage(options: any): void;
    closeSocket(options?: any): void;
  }

  // uniapp全局变量
  declare const uni: UniApp | undefined;
}

export {};
