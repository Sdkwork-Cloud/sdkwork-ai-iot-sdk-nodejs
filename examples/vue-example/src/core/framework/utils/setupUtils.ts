import type { App } from 'vue'; 
import dateUtils from './DateUtils'; 
import fileUtils from './FileUtils';
import urlUtils from './UrlUtils';
import imageUtils from './ImageUtils';
import stringUtils from './StringUtils';
import desensitizedUtils from './DesensitizedUtils';
import cmsUtils from './CmsUtils'; 
import ArrayUtils from './ArrayUtils';

/**
 * 当前浏览器是否为移动端浏览器
 */
export const isMobile: boolean = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); 
// setup core
export async function setupUtils(app: App) { 
	app.config.globalProperties.$dateUtils = dateUtils; 
	app.config.globalProperties.$fileUtils = fileUtils;
	app.config.globalProperties.urlUtils = urlUtils;
	app.config.globalProperties.$urlUtils = urlUtils;
	app.config.globalProperties.$arrayUtils = ArrayUtils;
	app.config.globalProperties.$stringUtils = stringUtils;
	app.config.globalProperties.$desensitizedUtils = desensitizedUtils;
	app.config.globalProperties.$imageUtils = imageUtils;
	app.config.globalProperties.$toFullUrl = urlUtils.toFullUrl;
	app.config.globalProperties.$toImageUrl = imageUtils.toImageUrl;
	app.config.globalProperties.$openFile = fileUtils.openFile; 
	app.config.globalProperties.$cmsUtils = cmsUtils
	  
}
