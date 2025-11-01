interface LoadingBarInstance {
  start: () => void;
  finish: () => void;
  error: () => void;
}

interface DialogOptions {
  title?: string;
  content: string;
  [key: string]: any;
}

interface DialogInstance {
  info: (options: DialogOptions) => Promise<void>;
  success: (options: DialogOptions) => Promise<void>;
  warning: (options: DialogOptions) => Promise<void>;
  error: (options: DialogOptions) => Promise<void>;
  confirm: (options: DialogOptions) => Promise<boolean>;
}

interface MessageInstance {
  info: (content: string) => void;
  success: (content: string) => void;
  warning: (content: string) => void;
  error: (content: string) => void;
}

interface NotificationOptions {
  title?: string;
  message: string;
  [key: string]: any;
}

interface NotificationInstance {
  info: (options: NotificationOptions) => void;
  success: (options: NotificationOptions) => void;
  warning: (options: NotificationOptions) => void;
  error: (options: NotificationOptions) => void;
}

interface Window {
  /** NProgress instance */
  NProgress?: import("nprogress").NProgress;
  /** Loading bar instance */
  $loadingBar: LoadingBarInstance|any;
  /** Dialog instance */
  $dialog: DialogInstance|any;
  /** Message instance */
  $message: MessageInstance|any;
  /** Notification instance */
  $notification?: NotificationInstance|any;
 
  $getParameter: (name: string|array) => string;
  $copy: (text: string) => Promise<void>;
  $uuid: () => string;
   /** Sdkwork client instance */
  $client?: any;
  /** Sdkwork uploader instance */
  $uploader?: any;
  /**
   *   Sdkwork Service instance
   */
  $sdkwork?: any;
  $music?: any;
  $framework?: any;
  $i18n: any;
  $router: any;
  $emit: any;
  $on: any;
  $off: any;
  $isWechatBrowser: ()=>boolean;
  $getHeightVH:(height:number)=>string
  $date: {
    format: (date: Date|string|number|any, format?: string) => string;
    parse: (date: string) => Date;
  }
}

