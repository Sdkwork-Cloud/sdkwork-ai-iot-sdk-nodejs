// 微信小程序和微信公众号 API 类型声明
declare const wx: {
    // 小程序环境检测
    miniProgram?: {
        getEnv?(callback: (res: { miniprogram: boolean }) => void): void;
    };

    // 基础API（小程序和公众号通用）
    scanCode?(options: { success?: (res: any) => void; fail?: (err: any) => void }): void;
    scanQRCode?(options: { success?: (res: any) => void; fail?: (err: any) => void }): void; // 公众号扫码
    getUserProfile?(options: { desc: string; success?: (res: any) => void; fail?: (err: any) => void }): void; // 小程序
    getUserInfo?(options: { success?: (res: any) => void; fail?: (err: any) => void }): void; // 公众号
    login?(options: { success?: (res: any) => void; fail?: (err: any) => void }): void; // 小程序
    checkJsApi?(options: { success?: (res: any) => void; fail?: (err: any) => void }): void; // 公众号检测
    getLocation?(options: { type: string; success?: (res: any) => void; fail?: (err: any) => void }): void;

    // 媒体API
    chooseImage?(options: { count: number; sizeType: string[]; sourceType: string[]; success?: (res: any) => void; fail?: (err: any) => void }): void;
    previewImage?(options: { urls: string[]; current?: string; success?: () => void; fail?: (err: any) => void }): void;
    saveImageToPhotosAlbum?(options: { filePath: string; success?: () => void; fail?: (err: any) => void }): void;

    // 支付API
    requestPayment?(options: { timeStamp: string; nonceStr: string; package: string; signType: string; paySign: string; success?: () => void; fail?: (err: any) => void }): void; // 小程序
    chooseWXPay?(options: { timestamp: string; nonceStr: string; package: string; signType: string; paySign: string; success?: () => void; fail?: (err: any) => void }): void; // 公众号

    // 分享API
    shareAppMessage?(options: { title?: string; imageUrl?: string; query?: string; path?: string; success?: () => void; fail?: (err: any) => void }): void; // 小程序
    onMenuShareAppMessage?(options: { title?: string; desc?: string; link?: string; imgUrl?: string; success?: () => void; fail?: (err: any) => void }): void; // 公众号
    updateAppMessageShareData?(options: { title?: string; desc?: string; link?: string; imgUrl?: string; success?: () => void; fail?: (err: any) => void }): void; // 公众号新版分享

    // UI交互API
    showLoading?(options: { title: string }): void;
    hideLoading?(): void;
    showToast?(options: { title: string; icon: 'success' | 'error' | 'loading' | 'none' }): void;
    showModal?(options: { title?: string; content: string; showCancel?: boolean; cancelText?: string; confirmText?: string; success?: (res: { confirm: boolean }) => void }): void;
    setNavigationBarTitle?(options: { title: string }): void;

    // 系统API
    getSystemInfo?(options: { success?: (res: any) => void; fail?: (err: any) => void }): void;
    getNetworkType?(options: { success?: (res: { networkType: string }) => void; fail?: (err: any) => void }): void;
    vibrateShort?(): void;
    vibrateLong?(): void;
    setClipboardData?(options: { data: string; success?: () => void; fail?: (err: any) => void }): void;
    getClipboardData?(options: { success?: (res: { data: string }) => void; fail?: (err: any) => void }): void;
    openLocation?(options: { latitude: number; longitude: number; name?: string; address?: string; scale?: number; success?: () => void; fail?: (err: any) => void }): void;
    chooseLocation?(options: { success?: (res: any) => void; fail?: (err: any) => void }): void;
    makePhoneCall?(options: { phoneNumber: string }): void;

    // 公众号JS-SDK相关
    ready?(callback: () => void): void;
    error?(callback: (err: any) => void): void;
    config?(options: { debug?: boolean; appId: string; timestamp: number; nonceStr: string; signature: string; jsApiList: string[] }): void;

    // 小程序API检测
    canIUse?(schema: string): boolean;

    // 新的系统信息API（基础库 2.20.1+）
    getSystemSetting?(): any;
    getAppAuthorizeSetting?(): any;
    getDeviceInfo?(): any;
    getWindowInfo?(): any;
    getAppBaseInfo?(): any;
} | undefined;

// 安全的wx对象访问器
const safeWx = {
    // 获取wx对象，如果不存在则返回null
    getWx(): any | null {
        if (typeof wx !== 'undefined' && wx !== null) {
            return wx;
        }
        return null;
    },

    // 安全调用wx方法
    callMethod(methodName: string, options?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const wxObj = this.getWx();
            if (!wxObj || typeof wxObj[methodName] !== 'function') {
                reject(new Error(`wx.${methodName} 方法在当前环境不可用`));
                return;
            }

            try {
                wxObj[methodName]({
                    ...options,
                    success: (res: any) => {
                        resolve(res);
                    },
                    fail: (err: any) => {
                        reject(err);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },

    // 检查方法是否存在
    hasMethod(methodName: string): boolean {
        const wxObj = this.getWx();
        return wxObj !== null && typeof wxObj[methodName] === 'function';
    }
};

export class GlobalTools {
    /**
     * 检查是否在小程序环境中
     */
    isMiniProgram(): boolean {
        const wxObj = safeWx.getWx();
        return wxObj !== null &&
            (typeof wxObj.getSystemInfo === 'function' ||
                typeof wxObj.miniProgram !== 'undefined')
    }

    /**
     * 检查是否在微信公众号环境中
     */
    isWechatOfficialAccount(): boolean {
        const wxObj = safeWx.getWx();
        return wxObj !== null &&
            typeof wxObj.miniProgram === 'undefined' &&
            /micromessenger/i.test(navigator.userAgent)
    }

    /**
     * 检查是否在微信环境中（小程序或公众号）
     */
    isWechatEnvironment(): boolean {
        return this.isMiniProgram() || this.isWechatOfficialAccount()
    }

    /**
     * 检查是否在浏览器环境中
     */
    isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof document !== 'undefined'
    }

    /**
     * 获取当前环境类型
     */
    getEnvironment(): 'miniProgram' | 'officialAccount' | 'browser' | 'unknown' {
        if (this.isMiniProgram()) {
            return 'miniProgram'
        }
        if (this.isWechatOfficialAccount()) {
            return 'officialAccount'
        }
        if (this.isBrowser()) {
            return 'browser'
        }
        return 'unknown'
    }

    /**
     * 检查特定功能是否可用
     */
    canIUse(feature: string): boolean {
        const env = this.getEnvironment()

        // 功能可用性映射
        const featureMap: Record<string, Record<string, boolean>> = {
            miniProgram: {
                'scanQRCode': safeWx.hasMethod('scanCode'),
                'getUserInfo': safeWx.hasMethod('getUserProfile') || safeWx.hasMethod('getUserInfo'),
                'login': safeWx.hasMethod('login'),
                'getLocation': safeWx.hasMethod('getLocation'),
                'payment': safeWx.hasMethod('requestPayment'),
                'share': safeWx.hasMethod('shareAppMessage'),
                'vibrate': safeWx.hasMethod('vibrateShort'),
                'clipboard': safeWx.hasMethod('setClipboardData'),
                'camera': safeWx.hasMethod('chooseImage'),
                'navigation': safeWx.hasMethod('setNavigationBarTitle')
            },
            officialAccount: {
                'scanQRCode': safeWx.hasMethod('scanQRCode'),
                'getUserInfo': safeWx.hasMethod('getUserInfo'),
                'login': safeWx.hasMethod('checkJsApi'), // 公众号使用checkJsApi检测
                'getLocation': safeWx.hasMethod('getLocation'),
                'payment': safeWx.hasMethod('chooseWXPay'),
                'share': safeWx.hasMethod('onMenuShareAppMessage'), // 公众号分享API
                'vibrate': false, // 公众号通常不支持振动
                'clipboard': false, // 公众号通常不支持剪贴板
                'camera': safeWx.hasMethod('chooseImage'),
                'navigation': false // 公众号通常不支持导航栏设置
            },
            browser: {
                'scanQRCode': false,
                'getUserInfo': false,
                'login': false,
                'getLocation': typeof navigator?.geolocation?.getCurrentPosition === 'function',
                'payment': false,
                'share': typeof navigator?.share === 'function',
                'vibrate': typeof navigator?.vibrate === 'function',
                'clipboard': typeof navigator?.clipboard?.writeText === 'function',
                'camera': typeof navigator?.mediaDevices?.getUserMedia === 'function',
                'navigation': true // 浏览器支持页面标题设置
            }
        }

        return featureMap[env]?.[feature] ?? false
    }

    /**
     * 检查微信JS-SDK是否已准备好
     */
    isWechatJSReady(): Promise<boolean> {
        return new Promise((resolve) => {
            const wxObj = safeWx.getWx();
            if (wxObj !== null && wxObj.ready) {
                wxObj.ready(() => {
                    resolve(true)
                })
                wxObj.error(() => {
                    resolve(false)
                })
            } else {
                resolve(false)
            }
        })
    }

    /**
     * 获取小程序版本信息（使用最新的API）
     */
    getMiniProgramVersion(): Promise<string> {
        return new Promise((resolve, reject) => {
            const wxObj = safeWx.getWx();
            if (this.isMiniProgram() && wxObj !== null && wxObj.getAppBaseInfo) {
                try {
                    const appBaseInfo = wxObj.getAppBaseInfo()
                    resolve(appBaseInfo.version || appBaseInfo.SDKVersion || 'unknown')
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error('不在小程序环境中或API不可用'))
            }
        })
    }

    /**
     * 检查小程序是否支持特定基础库版本
     */
    compareVersion(version: string): Promise<number> {
        return new Promise((resolve, reject) => {
            const wxObj = safeWx.getWx();
            if (this.isMiniProgram() && wxObj !== null && wxObj.getAppBaseInfo) {
                try {
                    const appBaseInfo = wxObj.getAppBaseInfo()
                    const currentVersion = appBaseInfo.SDKVersion || '1.0.0'
                    const compareResult = this.compareVersions(currentVersion, version)
                    resolve(compareResult)
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error('不在小程序环境中或API不可用'))
            }
        })
    }

    /**
     * 获取系统设置信息（替代 getSystemInfo）
     */
    getSystemSetting(): Promise<any> {
        return new Promise((resolve, reject) => {
            const wxObj = safeWx.getWx();
            if (this.isMiniProgram() && wxObj.getSystemSetting) {
                try {
                    const systemSetting = wxObj.getSystemSetting()
                    resolve(systemSetting)
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error('获取系统设置功能不可用'))
            }
        })
    }

    /**
     * 获取应用授权设置
     */
    getAppAuthorizeSetting(): Promise<any> {
        return new Promise((resolve, reject) => {

            const wxObj = safeWx.getWx();
            if (this.isMiniProgram() && wxObj.getAppAuthorizeSetting) {
                try {
                    const authorizeSetting = wxObj.getAppAuthorizeSetting()
                    resolve(authorizeSetting)
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error('获取应用授权设置功能不可用'))
            }
        })
    }

    /**
     * 获取设备信息
     */
    getDeviceInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            const wxObj = safeWx.getWx();
            if (this.isMiniProgram() && wxObj.getDeviceInfo) {
                try {
                    const deviceInfo = wxObj.getDeviceInfo()
                    resolve(deviceInfo)
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error('获取设备信息功能不可用'))
            }
        })
    }

    /**
     * 获取窗口信息
     */
    getWindowInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            const wxObj = safeWx.getWx();
            if (this.isMiniProgram() && wxObj.getWindowInfo) {
                try {
                    const windowInfo = wxObj.getWindowInfo()
                    resolve(windowInfo)
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error('获取窗口信息功能不可用'))
            }
        })
    }

    /**
     * 获取应用基础信息
     */
    getAppBaseInfo(): Promise<any> {
        const wxObj = safeWx.getWx();
        return new Promise((resolve, reject) => {
            if (this.isMiniProgram() && wxObj.getAppBaseInfo) {
                try {
                    const appBaseInfo = wxObj.getAppBaseInfo()
                    resolve(appBaseInfo)
                } catch (error) {
                    reject(error)
                }
            } else {
                reject(new Error('获取应用基础信息功能不可用'))
            }
        })
    }

    /**
     * 比较版本号
     * @returns 1: 当前版本大于目标版本, 0: 相等, -1: 当前版本小于目标版本
     */
    private compareVersions(v1: string, v2: string): number {
        const v1Parts = v1.split('.').map(Number)
        const v2Parts = v2.split('.').map(Number)

        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const part1 = v1Parts[i] || 0
            const part2 = v2Parts[i] || 0

            if (part1 > part2) return 1
            if (part1 < part2) return -1
        }

        return 0
    }

    /**
     * 扫描二维码
     */
    scanQRCode(): Promise<string> {
        return safeWx.callMethod('scanCode')
            .then((res) => res.result)
            .catch(() => {
                // 如果scanCode不可用，尝试scanQRCode
                return safeWx.callMethod('scanQRCode')
                    .then((res) => res.result)
                    .catch(() => {
                        throw new Error('扫描二维码功能在当前环境不可用');
                    });
            });
    }

    /**
     * 获取用户信息
     */
    getUserInfo(): Promise<any> {
        // 优先使用getUserProfile（小程序）
        if (safeWx.hasMethod('getUserProfile')) {
            return safeWx.callMethod('getUserProfile', { desc: '用于完善用户资料' })
                .then((res) => res.userInfo);
        }

        // 其次使用getUserInfo（公众号）
        if (safeWx.hasMethod('getUserInfo')) {
            return safeWx.callMethod('getUserInfo')
                .then((res) => res.userInfo);
        }

        // 都不支持
        return Promise.reject(new Error('获取用户信息功能在当前环境不可用'));
    }

    /**
     * 微信登录
     */
    wxLogin(): Promise<any> {
        return safeWx.callMethod('login');
    }

    /**
     * 获取地理位置
     */
    getLocation(): Promise<any> {
        return safeWx.callMethod('getLocation', { type: 'wgs84' });
    }

    /**
     * 选择图片
     */
    chooseImage(count: number = 1): Promise<any> {
        return safeWx.callMethod('chooseImage', {
            count,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera']
        });
    }

    /**
     * 预览图片
     */
    previewImage(urls: string[], current?: string): Promise<void> {
        return safeWx.callMethod('previewImage', {
            urls,
            current: current || urls[0]
        });
    }

    /**
     * 保存图片到相册
     */
    saveImageToPhotosAlbum(filePath: string): Promise<void> {
        return safeWx.callMethod('saveImageToPhotosAlbum', { filePath });
    }

    /**
     * 发起支付
     */
    requestPayment(params: {
        timeStamp: string
        nonceStr: string
        package: string
        signType: string
        paySign: string
    }): Promise<void> {
        return safeWx.callMethod('requestPayment', params);
    }

    /**
     * 分享到朋友圈
     */
    shareTimeline(params: {
        title?: string
        imageUrl?: string
        query?: string
    }): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof wx !== 'undefined' && wx.shareAppMessage) {
                wx.shareAppMessage({
                    ...params,
                    success: () => resolve(),
                    fail: reject
                })
            } else {
                reject(new Error('分享功能在当前环境不可用'))
            }
        })
    }

    /**
     * 分享给朋友
     */
    shareAppMessage(params: {
        title?: string
        imageUrl?: string
        path?: string
    }): Promise<void> {
        return safeWx.callMethod('shareAppMessage', params);
    }

    /**
     * 显示加载提示
     */
    showLoading(title: string = '加载中'): void {
        const wxObj = safeWx.getWx();
        if (wxObj !== null && wxObj.showLoading) {
            wxObj.showLoading({ title })
        }
    }

    /**
     * 隐藏加载提示
     */
    hideLoading(): void {
        const wxObj = safeWx.getWx();
        if (wxObj !== null && wxObj.hideLoading) {
            wxObj.hideLoading()
        }
    }

    /**
     * 显示消息提示
     */
    showToast(title: string, icon: 'success' | 'error' | 'loading' | 'none' = 'none'): void {
        const wxObj = safeWx.getWx();
        if (wxObj !== null && wxObj.showToast) {
            wxObj.showToast({ title, icon })
        }
    }

    /**
     * 显示模态对话框
     */
    showModal(params: {
        title?: string
        content: string
        showCancel?: boolean
        cancelText?: string
        confirmText?: string
    }): Promise<boolean> {
        return new Promise((resolve) => {
            if (typeof wx !== 'undefined' && wx.showModal) {
                wx.showModal({
                    ...params,
                    success: (res) => {
                        resolve(res.confirm)
                    }
                })
            } else {
                resolve(false)
            }
        })
    }

    /**
     * 设置导航栏标题
     */
    setNavigationBarTitle(title: string): void {
        if (typeof wx !== 'undefined' && wx.setNavigationBarTitle) {
            wx.setNavigationBarTitle({ title })
        }
    }

    /**
     * 设置页面标题
     */
    setDocumentTitle(title: string): void {
        if (typeof document !== 'undefined') {
            document.title = title
        }
    }

    /**
     * 获取系统信息
     */
    getSystemInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof wx !== 'undefined' && wx.getSystemInfo) {
                wx.getSystemInfo({
                    success: (res) => {
                        resolve(res)
                    },
                    fail: reject
                })
            } else {
                // 浏览器环境
                resolve({
                    platform: 'browser',
                    system: navigator.platform,
                    version: navigator.userAgent
                })
            }
        })
    }

    /**
     * 检查网络状态
     */
    getNetworkType(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (typeof wx !== 'undefined' && wx.getNetworkType) {
                wx.getNetworkType({
                    success: (res) => {
                        resolve(res.networkType)
                    },
                    fail: reject
                })
            } else {
                // 浏览器环境
                resolve(navigator.onLine ? 'wifi' : 'none')
            }
        })
    }

    /**
     * 振动
     */
    vibrateShort(): void {
        if (typeof wx !== 'undefined' && wx.vibrateShort) {
            wx.vibrateShort()
        }
    }

    /**
     * 长振动
     */
    vibrateLong(): void {
        if (typeof wx !== 'undefined' && wx.vibrateLong) {
            wx.vibrateLong()
        }
    }

    /**
     * 复制文本到剪贴板
     */
    setClipboardData(data: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof wx !== 'undefined' && wx.setClipboardData) {
                wx.setClipboardData({
                    data,
                    success: () => resolve(),
                    fail: reject
                })
            } else {
                // 浏览器环境
                navigator.clipboard.writeText(data).then(resolve).catch(reject)
            }
        })
    }

    /**
     * 从剪贴板获取文本
     */
    getClipboardData(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (typeof wx !== 'undefined' && wx.getClipboardData) {
                wx.getClipboardData({
                    success: (res) => {
                        resolve(res.data)
                    },
                    fail: reject
                })
            } else {
                // 浏览器环境
                navigator.clipboard.readText().then(resolve).catch(reject)
            }
        })
    }

    /**
     * 打开地图查看位置
     */
    openLocation(params: {
        latitude: number
        longitude: number
        name?: string
        address?: string
        scale?: number
    }): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof wx !== 'undefined' && wx.openLocation) {
                wx.openLocation({
                    ...params,
                    success: () => resolve(),
                    fail: reject
                })
            } else {
                // 浏览器环境
                const url = `https://maps.google.com/maps?q=${params.latitude},${params.longitude}`
                window.open(url, '_blank')
                resolve()
            }
        })
    }

    /**
     * 选择位置
     */
    chooseLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (typeof wx !== 'undefined' && wx.chooseLocation) {
                wx.chooseLocation({
                    success: (res) => {
                        resolve(res)
                    },
                    fail: reject
                })
            } else {
                reject(new Error('选择位置功能在当前环境不可用'))
            }
        })
    }

    /**
     * 拨打电话
     */
    makePhoneCall(phoneNumber: string): void {
        if (typeof wx !== 'undefined' && wx.makePhoneCall) {
            wx.makePhoneCall({ phoneNumber })
        } else {
            // 浏览器环境
            window.location.href = `tel:${phoneNumber}`
        }
    }
}