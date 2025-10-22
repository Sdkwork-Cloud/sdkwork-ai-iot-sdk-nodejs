export default class RandomUtils {
  // n位随机数生成字符串
  static randomString(n: any): string {
    let sString = '';
    const strings = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < n; i++) {
      const p = Math.floor(Math.random() * strings.length);
      sString += strings.charAt(p);
    }
    return sString;
  }
}
