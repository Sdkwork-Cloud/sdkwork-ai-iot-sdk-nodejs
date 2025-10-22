import qs from "qs";
const globSetting = {
  baseApiUrl: import.meta.env.VITE_GLOB_API_BASE_URL,
  urlPrefix: ''
};
export default class UrlUtils {
  static getBaseUrl() {
    if (!globSetting.baseApiUrl) {
      return `${window.location.protocol}//${window.location.host}`;
    }
    // if (
    //   window.location.port &&
    //   window.location.port !== '80' &&
    //   window.location.port !== '443' &&
    //   globSetting.baseApiUrl.indexOf('8080') < 0
    // ) {
    //   return window.location.protocol + '//' + window.location.host;
    // }
    if (!globSetting.baseApiUrl.startsWith('http')) {
      if (globSetting.baseApiUrl.startsWith('//')) {
        return window.location.protocol + globSetting.baseApiUrl;
      } else if (globSetting.baseApiUrl.startsWith('://')) {
        return window.location.protocol + globSetting.baseApiUrl.substring(1);
      }
      return `${window.location.protocol}//${globSetting.baseApiUrl}`;
    }
    return globSetting.baseApiUrl;
  }
  static toApiUrl(uri:string){
    return UrlUtils.buildUrl(UrlUtils.getBaseUrl(), uri)
  }
  static isValid(url: string): boolean {
    if (!url) {
      return false;
    }
    return url.startsWith("http://") || url.startsWith("https://");
  }

  // 定义一个函数，接受一个字符串作为参数
  static isValidUrl(string: string): boolean {
    // 尝试用URL构造函数创建一个URL对象
    try {
      // 如果字符串是合法的URL，不会抛出错误
      const url = new URL(string);
      // 检查URL的协议是否是http或https
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
      // 如果字符串不是合法的URL，会抛出错误
      // 返回false表示不合法
      return false;
    }
  }

  static toFullUrl(
    url: any,
    protocol?: string,
    decodeURI = false
  ): string | undefined {
    if (!url) {
      return url;
    }
    if(url.startsWith('"')){
      url=url.substring(1)
    }
    if(url.endsWith('"')){
      url=url.substring(0,url.length-1)
    } 
    // Handle decoding if needed
    if (decodeURI && typeof url === "string") {
      try {
        url = decodeURIComponent(url);
      } catch (e) {
        console.error("Error decoding URL:", e);
      }
    } 

    // If url is an empty array or an invalid array, return undefined
    if (Array.isArray(url) && !url.length) {
      return undefined;
    }

    // If the url is an array, take the first element
    if (Array.isArray(url)) {
      url = url[0];
    }

    // Ensure url is a string before further processing
    if (typeof url !== "string") {
      return undefined;
    }

    // Check if URL already contains a protocol
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    if (!protocol) {
      protocol = "http";
    }

    // Handle different types of URL formats
    if (url.startsWith("://")) {
      return protocol + url;
    }
    if (url.startsWith("//")) {
      return `${protocol}:${url}`;
    }
    if (url.startsWith("/")) {
      return `${protocol}://${url}`;
    }

    return `${protocol}://${url}`;
  }

  static buildUrl(root: string | undefined, sub: string | undefined): string {
    if (!sub) {
      return `${root}`;
    }
    if (!root) {
      return `${sub}`;
    }
    if (root.endsWith("/")) {
      if (sub.startsWith("/")) {
        return root + sub.substring(1);
      }
      return root + sub;
    }
    if (sub.startsWith("/")) {
      return root + sub;
    }
    return `${root}/${sub}`;
  }

  // 定义一个函数，接受一个字符串参数，返回一个布尔值
  static isValidDomain(domain: string): boolean {
    // 定义一个正则表达式，匹配域名的格式
    const domainRegex =
      /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z0-9-]{1,63}(?<!-))+)$/;
    // 使用正则表达式的 test 方法，检查域名是否符合格式
    return domainRegex.test(domain);
  } 
}
