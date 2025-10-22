import BigNumber from 'bignumber.js'; 
import axios from 'axios'; 
import UrlUtils from './UrlUtils';
import { ICONS, MIME_MAPPING, CODE_EXTENSIONS } from './file_mapping'; 
const AUDIO_EXTENSIONS = ['MP1', 'MP2', 'MP3', 'M4A', 'M3A', 'WAV', 'AIF', 'AIFF', 'MID', 'RMI', 'AU', 'RA', 'RAM'];
export default class FileUtils {
	static getIconUrl(file: any) {
		if (!file) {
			return 'https://disk-1253947560.cos.ap-beijing.myqcloud.com/icon/icon_file.png';
		}
		const fileType = (file.fileType || '').toUpperCase();
		const extensionType = (file.extension || file.extensionType || '').toUpperCase();
		if (fileType === 'DIRECTORY') {
			return 'https://disk-1253947560.cos.ap-beijing.myqcloud.com/icon/icon_folder.png';
		}
		if (!extensionType) {
			return 'https://disk-1253947560.cos.ap-beijing.myqcloud.com/icon/icon_file.png';
		}
		if (ICONS[extensionType]) {
			return `https://disk-1253947560.cos.ap-beijing.myqcloud.com/icon/${ICONS[extensionType]}`;
		}
		return 'https://disk-1253947560.cos.ap-beijing.myqcloud.com/icon/icon_file.png';
	}

	/**
	 * 格式化文件大小, 输出成带单位的字符串
	 * @param {Number} size 文件大小
	 * @param {Number} [pointLength=2] 精确到的小数点数。
	 * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。
	 *    如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
	 */
	static sizeText(size: BigNumber, inputUnits?: string[]): string {
		const units = inputUnits || ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		let i = 0;
		let fileSize = new BigNumber(size);
		const thousand = new BigNumber(1024);

		while (fileSize.gte(thousand) && i < units.length - 1) {
			fileSize = fileSize.dividedBy(thousand);
			i++;
		}
         
		return fileSize.toFormat(2) + " " + units[i];
	}
	static toBytes(sizeText: string): BigNumber | null {
		const units: { [key: string]: BigNumber } = {
			"B": new BigNumber(1),
			"KB": new BigNumber(1024),
			"MB": new BigNumber(1024).exponentiatedBy(2),
			"GB": new BigNumber(1024).exponentiatedBy(3),
			"TB": new BigNumber(1024).exponentiatedBy(4),
			"PB": new BigNumber(1024).exponentiatedBy(5),
			"EB": new BigNumber(1024).exponentiatedBy(6),
			"ZB": new BigNumber(1024).exponentiatedBy(7),
			"YB": new BigNumber(1024).exponentiatedBy(8)
		};

		const match = sizeText.match(/^(\d+(?:\.\d+)?)\s*(\S+)$/);
		if (match && match[1] && match[2]) {
			const value = new BigNumber(match[1]);
			const unit = match[2].toUpperCase();
			if (units.hasOwnProperty(unit)) {
				return value.times(units[unit]);
			}
		}

		throw new Error("Invalid size text format");
	}

	static mergeFile(files: Array<File | Blob | undefined>, mimeType = ''): Promise<Blob> {
		const resultFile: Blob = new Blob(files as any, { type: mimeType });
		return Promise.resolve(resultFile);
	}




	static fileSizeText(file: any) {
		if (FileUtils.isDirectory(file)) {
			return '-';
		}
		const encryptedFileSize = parseInt(file.encryptedFileSize || 0);
		const fileSize = parseInt(file.fileSize || 0);
		const realFileSize = encryptedFileSize > 0 ? encryptedFileSize : fileSize;
		return FileUtils.sizeText(new BigNumber(realFileSize));
	}

	static getExtension(file: any) {
		return file.extension || file.extensionType;
	}

	static isImage(file: any) {
		const extension = (FileUtils.getExtension(file) || '').toUpperCase();
		return (
			extension === 'JPG' ||
			extension === 'PNG' ||
			extension === 'JPEG' ||
			extension === 'GIF' ||
			extension === 'BMP' ||
			extension === 'SVG'
		);
	}
 

	static isVideo(file: any) {
		const extension = (FileUtils.getExtension(file) || '').toUpperCase();
		return (
			extension === 'MP4' ||
			extension === 'AVI' ||
			extension === 'MOV' ||
			extension === 'RMVB' ||
			extension === 'RM' ||
			extension === 'FLV' ||
			extension === '3GP' ||
			extension === 'M4V'
		);
	}

	static isAudio(file: any) {
		const extension = (FileUtils.getExtension(file) || '').toUpperCase();
		return AUDIO_EXTENSIONS.indexOf(extension) >= 0;
	}
 

	static isEncrypt(file: any) {
		return file.encrypt;
	}

	static isPdf(file: any) {
		const extension = (FileUtils.getExtension(file) || '').toUpperCase();
		return extension === 'pdf' || extension === 'PDF';
	}

	static isExcel(file: any) {
		const extension = (FileUtils.getExtension(file) || '').toUpperCase();
		return extension === 'XLS' || extension === 'XLSX';
	}

	static isWord(file: any) {
		const extension = (FileUtils.getExtension(file) || '').toUpperCase();
		return extension === 'DOC' || extension === 'DOCX';
	}

	static isPpt(file: any) {
		const extension = (FileUtils.getExtension(file) || '').toUpperCase();
		return extension === 'PPT' || extension === 'PPTX';
	}

	static openImage(file:any, fileList:any) {
		let title = file.name||file.title;
		const imgFileList =
			fileList.filter((item:any) => {
				if (item.contentType === 'IMAGE' || FileUtils.isImage(item)) {
					return true;
				}
				return false;
			}) || [];
		// const imgList =
		//   imgFileList
		//     .filter(item => {
		//       if (item.contentType === 'IMAGE' || FileUtils.isImage(item)) {
		//         return true;
		//       }
		//       return false;
		//     })
		//     .map(item => {
		//       return ImageUtils.toImageUrl(item.url);
		//     }) || [];
		window.$emit("show-popup", {
			type: "modal",
			name: 'preview-image',
			title: title, 
			data: { file, fileList: imgFileList }
		});
	}

	static isCodeFile(file:any) {
		const extension = (FileUtils.getExtension(file) || '').toLowerCase();
		return CODE_EXTENSIONS.indexOf(extension) >= 0;
	}

	static isTextFile(file:any) {
		const extensions = ['txt', 'log'];
		const extension = (FileUtils.getExtension(file) || '').toLowerCase();
		return extensions.indexOf(extension) >= 0;
	}

	static openFileMeta(file:any, proxy?:any, fileList?:any) {
		let title = file.name||file.title;
		window.$emit("show-popup", {
			type: "modal",
			name: 'preview-code',
			title: title, 
			data: { file: { ...file, url: `${file.url}.meta` }, fileList: fileList || [] }
		});
	} 
	static openFile(file:any, proxy:any, fileList:any) {
		let title = file.name||file.title;
		if (FileUtils.isCodeFile(file)) {
			window.$emit("show-popup", {
				type: "modal",
				name: 'preview-code',
				title: title, 
				data: { file, fileList }
			});
			return;
		}
		if (FileUtils.isTextFile(file)) {
			window.$emit("show-popup", {
				type: "modal",
				name: 'preview-code',
				title: title, 
				data: { file, fileList }
			});
			return;
		}
		switch (file.contentType) {
			case 'AUDIO':
				window.$emit("show-popup", {
					type: "modal",
					name: 'preview-audio',
					title: title, 
					data: { file, fileList }
				});
				break;
			case 'VIDEO':
				window.$emit("show-popup", {
					type: "modal",
					name: 'preview-video',
					title: title, 
					data: { file, fileList }
				});
				break;
			case 'IMAGE':
				// proxy.$refs['PHOTO_MODAL'].toggleShow(file, { fileList: fileList });
				FileUtils.openImage(file, fileList);
				break;
			case 'FILE':
			case 'DOC':
				if (FileUtils.isPdf(file)) {
					window.$emit("show-popup", {
						type: "modal",
						name: 'preview-pdf',
						title: title, 
						data: { file, fileList }
					});
					break;
				}
				if (FileUtils.isWord(file)) {
					window.$emit("show-popup", {
						type: "modal",
						name: 'preview-word',
						title: title, 
						data: { file, fileList }
					});
					break;
				}
				if (FileUtils.isExcel(file)) {
					window.$emit("show-popup", {
						type: "modal",
						name: 'preview-excel',
						title: title, 
						data: { file, fileList }
					});
					break;
				}
				if (FileUtils.isPpt(file)) {
					window.$emit("show-popup", {
						type: "modal",
						name: 'preview-ppt',
						title: title, 
						data: { file, fileList }
					});
					break;
				}
				if (FileUtils.isImage(file)) {
					// proxy.$refs['PHOTO_MODAL'].toggleShow(file, { fileList: fileList });
					FileUtils.openImage(file, fileList);
					break;
				}
				if (FileUtils.isVideo(file)) {
					window.$emit("show-popup", {
						type: "modal",
						name: 'preview-video',
						title: title, 
						data: { file, fileList }
					});
					break;
				}
				if (FileUtils.isAudio(file)) {
					window.$emit("show-popup", {
						type: "modal",
						name: 'preview-audio',
						title: title, 
						data: { file, fileList }
					});
					break;
				}
				break;
			default:
				if (FileUtils.isImage(file)) {
					// proxy.$refs['PHOTO_MODAL'].toggleShow(file, { fileList: fileList });
					FileUtils.openImage(file, fileList);
					break;
				}
				if (FileUtils.isVideo(file)) {
					window.$emit("show-popup", {
						type: "modal",
						name: 'preview-video',
						title: title, 
						data: { file, fileList }
					});
					break;
				}
				if (FileUtils.isAudio(file)) {
					window.$emit("show-popup", {
						type: "modal",
						name: 'preview-audio',
						title: title, 
						data: { file, fileList }
					});
					break;
				}
		}
	}
 

	static resolveExtension(name: string) {
		if (!name) {
			return '';
		}
		const index = name.lastIndexOf('.');
		if (index < 0) {
			return '';
		}
		return name.substring(index + 1).toLowerCase();
	}

	static resolveFileName(url: string) {
		if (!url) {
			return '-';
		}
		const index = url.lastIndexOf('/');
		if (index < 0) {
			return '-';
		}
		return url.substring(index + 1).split('?')[0];
	}

	static isDirectory(file: any) {
		return file.fileType === 'DIRECTORY';
	}

	static isFile(file: any) {
		return !FileUtils.isDirectory(file);
	}

	static getMimeType(file: any) {
		return MIME_MAPPING[file.extension.toLowerCase()];
	}

	static downloadByUrl(file: any) {
		const url = UrlUtils.toFullUrl(file.url);
		// 1.先创建一个a标签
		const a: any = document.createElement('a');
		// 2.给a标签的href赋上下载地址
		a.href = url;
		a.download = file.name;
		a.target = '_blank';
		// 3.让a标签不显示在视图中
		a.style.display = 'none';
		// 4.将a标签append到文档中
		document.body.appendChild(a);
		// 5.a标签自点击
		a.click();
		// 6.点击下载后，销毁这个节点
		document.body.removeChild(a);
	}  

	static getContent(file:any) {
		const url:any = UrlUtils.toFullUrl(file.url);
		return new Promise((resolve, reject) => {
			axios
				.get(url)
				.then(res => {
					if (res.data) {
						resolve(res.data);
					} else {
						resolve(null);
					}
				})
				.catch(e => {
					reject(e);
				});
		});
	}

	static getMetaContent(file: any) {
		const url: any = UrlUtils.toFullUrl(file.metaUrl);
		return new Promise((resolve, reject) => {
			axios
				.get(url)
				.then(res => {
					resolve(res.data);
				})
				.catch(e => {
					reject(e);
				});
		});
	}

	static getContentByUrl(url: any) {
		url = UrlUtils.toFullUrl(url);
		return new Promise((resolve, reject) => {
			axios
				.get(url)
				.then(res => {
					resolve(res.data);
				})
				.catch(e => {
					reject(e);
				});
		});
	} 

	static shortFileKey(file: File): Blob {
		if (file.size < 10 * 1024) {
			return file as Blob;
		}
		const head = 1024;
		const tail = file.size - 1024;
		const middle = file.size / 2;
		const headBlob = file.slice(0, head);
		const tailBlob = file.slice(tail, file.size);
		const middleBlob = file.slice(middle, middle + 1024);
		const s = `${file.size}_${file.lastModified}`;
		return new Blob([headBlob, tailBlob, middleBlob, s]);
	}

	static getFileKey(file: any): string {
		if (file.fileKey) {
			return file.fileKey;
		}
		if (file.url) {
			let key = file.url.replace('http://', '');
			key = key.replace('https://', '');
			if (key.startsWith('//')) {
				key = key.substring('//'.length);
			}
			if (key.startsWith('/')) {
				key = key.substring('/'.length);
			}
			key = key.substring(key.indexOf('/') + 1);
			return key;
		}
		return '';
	}

	static readAsText(file: File | Blob): Promise<string> {
		const a = new FileReader();
		return new Promise<string>((resolve, reject) => {
			a.onload = e => {
				if (e.target) {
					resolve(e.target.result as any);
				}
			};
			a.onerror = e => {
				reject(e);
			};
			a.readAsText(file);
		});
	}

	static base64ToBlob(base64: string, contentType = 'image/jpeg'): Blob {
		contentType = contentType || 'image/jpeg';
		const sliceSize = 1024;
		const byteCharacters = window.atob(base64);
		const bytesLength = byteCharacters.length;
		const slicesCount = Math.ceil(bytesLength / sliceSize);
		const byteArrays = new Array(slicesCount);

		for (let offset = 0; offset < bytesLength; offset += sliceSize) {
			const slice:any = byteCharacters.slice(offset, offset + sliceSize);
			byteArrays[Math.floor(offset / sliceSize)] = new Uint8Array(slice);
		}

		return new Blob(byteArrays, { type: contentType });
	}

	static async getFileUrl(file: any) {
		const url = file.url;
		return window.$framework.urlUtils.toFullUrl(url, 'https');
	}

	static createObjectURL(file: File): string {
		return URL.createObjectURL(file);
	}

	// 定义一个函数，接受一个文件对象作为参数
	static getVideoDuration(file: File): Promise<number> {
		// 返回一个Promise对象，用来异步处理结果
		return new Promise((resolve, reject) => {
			// 创建一个FileReader对象，用来读取文件内容
			const reader = new FileReader();
			// 为reader添加一个load事件监听器，当文件读取完成时触发
			reader.addEventListener('load', () => {
				// 创建一个Blob对象，用来存储文件的二进制数据
				const blob = new Blob([reader.result as ArrayBuffer], {
					type: file.type
				});
				// 创建一个URL对象，用来表示Blob对象的地址
				const url = URL.createObjectURL(blob);
				// 创建一个video元素，用来播放视频
				const video = document.createElement('video');
				// 为video添加一个loadedmetadata事件监听器，当视频元数据加载完成时触发
				video.addEventListener('loadedmetadata', () => {
					// 获取视频的时长，单位为秒
					const duration = video.duration;
					// 释放URL对象，避免内存泄漏
					URL.revokeObjectURL(url);
					// 将时长作为Promise的成功值返回
					resolve(duration);
				});
				// 为video添加一个error事件监听器，当视频加载出错时触发
				video.addEventListener('error', () => {
					// 将错误作为Promise的失败原因返回
					reject(video.error);
				});
				// 设置video的源地址为URL对象
				video.src = url;
			});
			// 为reader添加一个error事件监听器，当文件读取出错时触发
			reader.addEventListener('error', () => {
				// 将错误作为Promise的失败原因返回
				reject(reader.error);
			});
			// 以ArrayBuffer的形式读取文件
			reader.readAsArrayBuffer(file);
		});
	}
}
