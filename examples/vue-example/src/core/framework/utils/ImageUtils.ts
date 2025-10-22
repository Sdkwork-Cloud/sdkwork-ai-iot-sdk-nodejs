import UrlUtils from './UrlUtils';
import qs from "qs";

export default class ImageUtils {
	static toImageUrl(url: string | Array<string>): string {
		if (!url) {
			return '';
		}
		if (url instanceof Array && url.length) {
			return UrlUtils.toFullUrl(url[0]) as string;
		}
		return UrlUtils.toFullUrl(url) as string;
	}

	static verifyCodeUrl(biz: string, options?: {
		width?: number;
		height?: number,
		length?: number,
		noiseCount?: number,
		codeType?: string,
		type?: string,
		t?: string
	}) {
		const queryStr = qs.stringify(options)
		const url = import.meta.env.VITE_GLOB_API_BASE_URL + "/captcha/code_img/" + biz
		if (!queryStr) {
			return url;
		}
		return url + "?" + queryStr
	}
}
