<template>
  <div class="qr-wrapper-container">


    <!-- 二维码主容器 -->
    <div ref="qrCodeContainer" class="sdkwork-qr-code" :class="customClass">
      <!-- 顶部区域：使用 header slot -->
      <div v-if="$slots.header" class="qr-header-section">
        <slot name="header"></slot>
      </div>
      <div v-else-if="showAvatar || showInfo" class="qr-default-header">
        <!-- 默认头像区域 -->
        <div v-if="showAvatar" class="avatar-section">
          <div class="avatar-container">
            <img v-if="avatar" :src="avatar" :alt="title" class="avatar-image" />
            <div v-else class="avatar-placeholder">
              <van-icon :name="avatarIcon || 'user-circle-o'" size="48" />
            </div>
            <div v-if="showAvatarBorder" class="avatar-border"></div>
          </div>
        </div>

        <!-- 默认名称和描述区域 -->
        <div v-if="showInfo" class="info-section">
          <h3 v-if="title" class="title">{{ title }}</h3>
          <p v-if="description" class="description">{{ description }}</p>
        </div>
      </div>
      <!-- 二维码区域 -->
      <div class="qr-section">
        <div class="qr-container" :style="{
          width: qrSize + 'px',
          height: qrSize + 'px',
          filter: blur ? 'blur(8px)' : 'none'
        }">
          <div v-if="loading" class="qr-loading">
            <van-loading size="24px" />
          </div>
          <div v-else-if="!qrCodeUrl" class="qr-empty">
            <van-icon name="qr-invalid" size="48" />
            <p>二维码生成失败</p>
          </div>
          <div v-else class="qr-wrapper">
            <img :src="qrCodeUrl" :alt="title || 'QR Code'" class="qr-image" />
            <!-- 二维码中心的logo -->
            <div v-if="logo" class="qr-logo">
              <img :src="logo" :alt="title || 'Logo'" />
            </div>
          </div>

          <!-- 二维码上方自定义内容 -->
          <div v-if="$slots.qrOverlay" class="qr-overlay">
            <slot name="qrOverlay"></slot>
          </div>
        </div>
      </div>

      <!-- 提示信息区域 -->
      <div v-if="showTip" class="tip-section">
        <p v-if="tipText" class="tip-text">{{ tipText }}</p>
        <!-- 自定义提示slot -->
        <slot name="tip"></slot>
      </div>

      <!-- 二维码底部信息slot -->
      <slot name="qr-footer"></slot>
    </div>

    <!-- 底部区域 -->
    <div class="footer-section">
      <!-- 默认操作按钮区域 -->
      <div v-if="showActions && !blur" class="actions-section">
        <div class="actions-row">
          <van-button v-if="allowSave" type="primary" block @click="saveQRCode" :loading="saving" class="action-btn">
            <van-icon name="save" />
            保存二维码
          </van-button>
        </div>

        <div class="actions-row">
          <van-button v-if="allowShare" type="default" block @click="shareQRCode" class="action-btn">
            <van-icon name="share" />
            分享
          </van-button>
        </div>

        <div v-if="allowRefresh" class="actions-row">
          <van-button type="default" block @click="refreshQRCode" :loading="refreshing" class="action-btn">
            <van-icon name="replay" />
            刷新
          </van-button>
        </div>

        <!-- 自定义操作按钮slot -->
        <slot name="actions"></slot>
      </div>

      <!-- 自定义底部内容 -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useClipboard, useElementSize } from '@vueuse/core'
import { toPng, toJpeg, toSvg } from 'html-to-image'
import QRCode from 'qrcode'
import { showToast } from 'vant'

// Props定义
interface Props {
  // 基础信息
  title?: string  // 标题，如群名称或用户名
  description?: string  // 描述信息
  avatar?: string  // 头像URL
  logo?: string  // 二维码中心的logo URL

  // 二维码相关
  value?: string  // 二维码内容，如链接或文本
  qrSize?: number  // 二维码尺寸，默认200px
  qrMode?: 'image' | 'generate'  // 二维码模式：image-使用图片URL，generate-通过文本生成

  // 提示信息
  tipText?: string  // 提示文本，如"扫描二维码，加入群聊"

  // 显示控制
  showAvatar?: boolean  // 是否显示头像
  showInfo?: boolean  // 是否显示信息
  showTip?: boolean  // 是否显示提示
  showActions?: boolean  // 是否显示操作按钮
  showAvatarBorder?: boolean  // 是否显示头像边框

  // 操作控制
  allowSave?: boolean  // 是否允许保存二维码
  allowShare?: boolean  // 是否允许分享
  allowRefresh?: boolean  // 是否允许刷新

  // 样式控制
  avatarIcon?: string  // 头像占位图标
  customClass?: string  // 自定义CSS类

  // 二维码配置
  qrColor?: string  // 二维码前景色
  qrBgColor?: string  // 二维码背景色
  qrErrorLevel?: string  // 二维码容错级别
  qrMargin?: number  // 二维码边距
  blur?: boolean  // 是否显示模糊效果，用于会员未购买时显示
}

const props = withDefaults(defineProps<Props>(), {
  qrSize: 200,
  qrMode: 'generate',  // 默认使用生成模式
  showAvatar: true,
  showInfo: true,
  showTip: true,
  showActions: true,
  showAvatarBorder: true,
  allowSave: true,
  allowShare: true,
  allowRefresh: false,
  qrColor: '#000000',
  qrBgColor: '#FFFFFF',
  qrErrorLevel: 'M',
  qrMargin: 0,
  blur: false,
})

// 事件定义
interface Emits {
  (e: 'save', qrCodeUrl: string): void  // 保存二维码
  (e: 'share', qrCodeUrl: string): void  // 分享二维码
  (e: 'refresh'): void  // 刷新二维码
  (e: 'load', qrCodeUrl: string): void  // 二维码加载完成
  (e: 'error', error: Error): void  // 二维码生成错误
}

const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(true)
const saving = ref(false)
const refreshing = ref(false)
const qrCodeUrl = ref('')
const qrCodeContainer = ref<HTMLElement>()
const { copy } = useClipboard()

// VueUse ElementSize 处理
const { width, height } = useElementSize(qrCodeContainer)
 
const pendingBase64 = ref(false)

// 生成二维码
const generateQRCode = async () => {
  if (!props.value) {
    const error = new Error('二维码内容不能为空')
    emit('error', error)
    return
  }

  loading.value = true

  try {
    if (props.qrMode === 'image') {
      // 图片模式：直接使用传入的图片URL
      qrCodeUrl.value = props.value

      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 500))
    } else {
      // 生成模式：使用qrcode.js库生成二维码
      const qrOptions = {
        width: props.qrSize,
        margin: props.qrMargin,
        color: {
          dark: props.qrColor,
          light: props.qrBgColor
        },
        errorCorrectionLevel: props.qrErrorLevel
      }

      // 使用qrcode.js生成Data URL
      qrCodeUrl.value = await new Promise<string>((resolve, reject) => {
        QRCode.toDataURL(props.value!, qrOptions as any, (error, url) => {
          if (error) {
            reject(error);
          } else {
            resolve(url);
          }
        });
      });
    }

    loading.value = false
    emit('load', qrCodeUrl.value)
  } catch (error) {
    loading.value = false
    emit('error', error as Error)
  }
}

// 使用 VueUse 的方式下载文件
const downloadFile = (dataUrl: string, filename: string) => {
  try {
    // 创建一个 Blob 对象
    const response = fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        // 创建下载链接
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()

        // 清理
        setTimeout(() => {
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }, 100)
      })

    return Promise.resolve()
  } catch (error) {
    // 降级处理：直接使用 dataUrl
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
    }, 100)
  }
}

// 获取当前主题背景色
const getThemeBackgroundColor = () => {
  // 获取计算后的CSS变量值
  const computedStyle = window.getComputedStyle(qrCodeContainer.value || document.documentElement);
  const bgCard = computedStyle.getPropertyValue('--bg-card').trim();
  
  // 如果有明确的背景色变量，使用它
  if (bgCard && bgCard !== '') {
    // 如果是CSS变量，需要进一步解析
    if (bgCard.startsWith('var(')) {
      const varName = bgCard.slice(4, -1).trim();
      return window.getComputedStyle(document.documentElement)
        .getPropertyValue(varName).trim() || '#ffffff';
    }
    return bgCard;
  }
  
  // 默认返回白色背景
  return '#ffffff';
}

// 保存二维码
const saveQRCode = async () => {
  if (!qrCodeContainer.value) return

  saving.value = true

  try {
    // 临时移除外边距，避免图片左侧空白
    const originalMargin = qrCodeContainer.value.style.margin;
    qrCodeContainer.value.style.margin = '0';

    // 临时移除模糊效果，确保保存的图片清晰
    const qrContainers = qrCodeContainer.value.querySelectorAll('.qr-container');
    const originalFilters: string[] = [];
    qrContainers.forEach(container => {
      originalFilters.push((container as HTMLElement).style.filter);
      (container as HTMLElement).style.filter = 'none';
    });

    // 获取当前主题背景色，确保保存的图片与展示的一致
    const themeBackgroundColor = getThemeBackgroundColor();

    // 使用 html-to-image 库将组件转换为图片
    const dataUrl = await toPng(qrCodeContainer.value, {
      backgroundColor: themeBackgroundColor,
      pixelRatio: 2, // 提高图片质量
      quality: 0.95,
      cacheBust: true,
      // 过滤掉不需要导出的元素，如操作按钮区域
      filter: (node) => {
        // 过滤掉保存按钮等操作元素和footer
        if (node.classList?.contains('actions-section') ||
          node.classList?.contains('footer-section')) {
          return false
        }
        return true
      }
    })

    // 恢复原始样式
    qrCodeContainer.value.style.margin = originalMargin;
    qrContainers.forEach((container, index) => {
      (container as HTMLElement).style.filter = originalFilters[index];
    });

    // 创建下载链接
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${props.title || 'qrcode'}_${Date.now()}.png`
    link.style.display = 'none'
    document.body.appendChild(link)

    // 尝试多种方式触发下载
    try {
      // 使用click方法
      link.click()
    } catch (e) {
      // 如果click失败，尝试其他方式
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })
      link.dispatchEvent(event)
    }

    // 清理资源
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link)
      }
    }, 100)

    showToast('二维码已保存')
    emit('save', dataUrl)
  } catch (error) {
    console.error('保存二维码失败:', error)
    showToast('保存失败，请重试')
  } finally {
    saving.value = false
    pendingBase64.value = false
  }
}

// 分享二维码
const shareQRCode = async () => {
  if (!qrCodeContainer.value) return

  try {
    // 临时移除外边距，避免图片左侧空白
    const originalMargin = qrCodeContainer.value.style.margin;
    qrCodeContainer.value.style.margin = '0';

    // 临时移除模糊效果，确保保存的图片清晰
    const qrContainers = qrCodeContainer.value.querySelectorAll('.qr-container');
    const originalFilters: string[] = [];
    qrContainers.forEach(container => {
      originalFilters.push((container as HTMLElement).style.filter);
      (container as HTMLElement).style.filter = 'none';
    });

    // 获取当前主题背景色，确保分享的图片与展示的一致
    const themeBackgroundColor = getThemeBackgroundColor();

    // 使用 html-to-image 库生成完整的二维码图片
    const dataUrl = await toPng(qrCodeContainer.value, {
      backgroundColor: themeBackgroundColor,
      pixelRatio: 2, // 提高图片质量
      quality: 0.95,
      cacheBust: true,
      // 过滤掉不需要导出的元素
      filter: (node) => {
        // 过滤掉保存按钮等操作元素和footer
        if (node.classList?.contains('actions-section') ||
          node.classList?.contains('footer-section')) {
          return false
        }
        return true
      }
    })

    // 恢复原始样式
    qrCodeContainer.value.style.margin = originalMargin;
    qrContainers.forEach((container, index) => {
      (container as HTMLElement).style.filter = originalFilters[index];
    });

    // 尝试使用Web Share API分享图片
    if (navigator.share) {
      // 将data URL转换为Blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], `${props.title || 'qrcode'}.png`, { type: 'image/png' })

      await navigator.share({
        title: props.title || '二维码',
        text: props.description || '',
        files: [file],
      })

      showToast('分享成功')
    } else {
      // 降级方案1：复制图片到剪贴板
      if (navigator.clipboard && navigator.clipboard.write) {
        // 将data URL转换为Blob
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const clipboardItem = new ClipboardItem({ 'image/png': blob })

        await navigator.clipboard.write([clipboardItem])
        showToast('二维码已复制到剪贴板')
      } else {
        // 降级方案2：复制链接
        await copy(props.value || dataUrl)
        showToast('链接已复制到剪贴板')
      }
    }

    emit('share', dataUrl)
  } catch (error) {
    console.error('分享二维码失败:', error)
    showToast('分享失败，请重试')
  }
}

// 刷新二维码
const refreshQRCode = () => {
  refreshing.value = true
  generateQRCode().finally(() => {
    refreshing.value = false
  })
  emit('refresh')
}

// 监听二维码内容变化
watch(() => props.value, () => {
  generateQRCode()
})

// 监听其他可能影响二维码的属性
watch([
  () => props.qrSize,
  () => props.qrColor,
  () => props.qrBgColor,
  () => props.qrErrorLevel,
  () => props.qrMargin,
  () => props.logo
], () => {
  generateQRCode()
})

// 组件挂载时生成二维码
onMounted(() => {
  generateQRCode()
})
</script>

<style scoped>
/* 最外层容器 - 100%高度，垂直居中 */
.qr-wrapper-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}

/* 头部区域 - 使用slot传入 */
.qr-header-section {
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
}

.qr-default-header {
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
}

/* 二维码主容器 - 负责二维码本身和提示信息 */
.sdkwork-qr-code {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: var(--bg-card, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  width: 100%; 
}

/* 头像区域 */
.avatar-section {
  margin-bottom: 16px;
  width: 100%;
}

.avatar-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--bg-gray, #f5f5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light, #999);
}

.avatar-border {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  border: 2px solid var(--color-primary, #1989fa);
}

/* 信息区域 */
.info-section {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary, #333);
}

.description {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary, #666);
  line-height: 1.4;
}

/* 二维码区域 */
.qr-section {
  margin-bottom: 16px;
}

.qr-container {
  position: relative;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.qr-loading,
.qr-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--text-light, #999);
}

.qr-empty p {
  margin: 8px 0 0;
  font-size: 14px;
}

.qr-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.qr-image {
  width: 100%;
  height: 100%;
  display: block;
}

.qr-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-logo img {
  width: 90%;
  height: 90%;
  object-fit: contain;
}

.qr-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 提示区域 */
.tip-section {
  text-align: center;
  margin-bottom: 16px;
}

.tip-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary, #666);
}

/* 底部区域 - 默认显示 */
.footer-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 340px;
  margin-top: 20px;
}

/* 操作按钮区域 - 位于footer内部 */
.actions-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  justify-content: space-between;
}

.actions-row {
  display: flex;
  width: 100%;
  justify-content: center;
}

.action-btn {
  width: 100%;
}
</style>