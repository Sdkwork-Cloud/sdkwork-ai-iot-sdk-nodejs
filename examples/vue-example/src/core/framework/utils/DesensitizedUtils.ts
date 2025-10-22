import StringUtils from './StringUtils';

export default class DesensitizedUtils {
  /**
   * 保留前面几位 比如 姓名 X**
   * @param str
   * @param index
   * @return
   */
  public static left(str: string, index: number): string {
    if (StringUtils.isBlank(str)) {
      return '';
    }
    const name = StringUtils.left(str, index);
    return StringUtils.rightPad(name, str.length, '*');
  }

  /**
   * 前面保留 index 位明文，后面保留 end 位明文,如：[身份证号] 110****58，前面保留3位明文，后面保留2位明文
   * @param str
   * @param index
   * @param end
   * @return
   */
  public static around(str: string, start: number, end: number) {
    if (StringUtils.isBlank(str)) {
      return '';
    }
    return StringUtils.left(str, start).concat(
      StringUtils.removeStart(
        StringUtils.leftPad(StringUtils.right(str, end), str.length, '*'),
        '***',
      ),
    );
  }

  /**
   * 保留后面几位 如手机号 *******5678
   * @param str
   * @param end
   * @return
   */
  public static right(str: string, end: number) {
    if (StringUtils.isBlank(str)) {
      return '';
    }
    return StringUtils.leftPad(StringUtils.right(str, end), str.length, '*');
  }
}
