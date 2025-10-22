import template from 'nunjucks';
export default class StringUtils {
  /*
   * ----------------------------------------------------------------
   */
  static startsWith(str: string, strSearch: string): boolean {
    if (!str || !strSearch) {
      return false;
    }
    return str.startsWith(strSearch);
  }

  /*
   * ----------------------------------------------------------------
   */
  static endsWith(str: string, strSearch: string): boolean {
    if (!str || !strSearch) {
      return false;
    }
    return str.endsWith(strSearch);
  }

  /*
   * ----------------------------------------------------------------
   */
  static trim(str: string): string {
    return str.trim();
  }

  /*
   * ----------------------------------------------------------------
   */
  static isBlank(str: string): boolean {
    if (!str || str.length <= 0) {
      return true;
    }
    const s = StringUtils.trim(str);
    return s.length <= 0;
  }

  /*
   * ----------------------------------------------------------------
   */
  static replaceForBlank(valor: string): string {
    if (valor == null || valor == 'null' || valor == '') {
      return '';
    }
    return valor;
  }

  /*
   * ----------------------------------------------------------------
   */
  static nullToEmpty(str: string) {
    return str == null ? '' : str;
  }

  /*
 * ----------------------------------------------------------------
 	Faz a complementacao de uma string

	Exemplo de Utilização:
	var mes = "9";
	alert(mes.pad(2, "0", String.PAD_LEFT)); // exibe "09"
*/
  static PAD_LEFT = 0;

  static PAD_RIGHT = 1;

  static PAD_BOTH = 2;

  static leftPad(str: string, size: number, pad = ' '): string {
    return StringUtils.pad(str, size, pad, StringUtils.PAD_LEFT);
  }

  static rightPad(str: string, size: number, pad = ' '): string {
    return StringUtils.pad(str, size, pad, StringUtils.PAD_RIGHT);
  }

  static padBoth(str: string, size: number, pad = ' '): string {
    return StringUtils.pad(str, size, pad, StringUtils.PAD_BOTH);
  }

  static repeat(str: string, repeat: number, seperator?: string): string {
    if (StringUtils.isBlank(str)) {
      return str;
    }
    if (!seperator) {
      seperator = '';
    }
    const array: Array<string> = [];
    for (let i = 0; i < repeat; i++) {
      array.push(str);
    }
    return array.join(seperator);
  }

  static left(str: string, len: number): string {
    if (StringUtils.isBlank(str)) {
      return str;
    }
    return str.substring(0, len);
  }

  static right(str: string, len: number): string {
    if (StringUtils.isBlank(str)) {
      return str;
    }
    return str.substring(str.length - len);
  }

  static pad(str: string, size: number, pad = ' ', side: number): string {
    let append = '';
    size -= str.length;
    if (side == StringUtils.PAD_BOTH) {
      str = StringUtils.pad(str, Math.floor(size / 2) + str.length, pad, StringUtils.PAD_LEFT);
      return StringUtils.pad(str, Math.ceil(size / 2) + str.length, pad, StringUtils.PAD_RIGHT);
    }
    while ((size -= pad.length) > 0) {
      append += pad;
    }
    append += pad.substring(0, size + pad.length);
    return side == StringUtils.PAD_LEFT ? append.concat(str) : str.concat(append);
  }

  static replaceAll = function (str: string, strSearch: string, strReplace: string): string {
    let p = str.indexOf(strSearch);
    while (p != -1) {
      str = str.replace(strSearch, strReplace);
      p = str.indexOf(strSearch);
    }
    return str;
  };

  static removeStart(str: string, remove: string) {
    if (StringUtils.isBlank(str) || StringUtils.isBlank(remove)) {
      return str;
    }
    if (str.startsWith(remove)) {
      return str.substring(remove.length);
    }
    return str;
  }

  static randomAlphanumeric(n: number) {
    let randomString = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < n; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
  }

  static randomAlphabetic(n: number) {
    let randomString = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < n; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
  }

  static randomNumeric(n: number) {
    let randomString = '';
    const characters = '0123456789';

    for (let i = 0; i < n; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
  }

  static render(s: string, parameters: Object) {
    return template.renderString(s, parameters);
  }

  static toArray(s: any) {
    if (!s) {
      return s;
    }
    if (typeof s === 'string') {
      return [s];
    }
    return s;
  }
}
