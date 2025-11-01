import { createTextVNode, defineComponent, ref, computed } from 'vue';
import { showLoadingToast, closeToast, showDialog, showNotify, showToast } from 'vant';
import { useRouter } from 'vue-router';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { buildUUID } from '@/utils/uuid';
import DateUtils from '@/core/framework/utils/DateUtils';
import mitt from 'mitt';
import { createUploader } from '@/core/upload'
import fileChooser from '@/core/files';
import chatMessageProcessor from '@/core/chat';
import musicPlayerManager from '@/core/music';

export function useAppProvider() {
  const emitter = mitt()

  const registerGlobalMethods = () => {
    const { t } = useI18n();
    const router = useRouter();
    
    // Loading bar
    window.$loadingBar = {
      start: () => showLoadingToast({ duration: 0, forbidClick: true }),
      finish: () => closeToast(),
      error: () => closeToast()
    };
    
    window.$router = router;
    
    // Dialog
    window.$dialog = {
      info: (options: any) => showDialog({
        title: options.title || t('common.tip'),
        message: options.content,
        theme: 'round-button'
      }),
      success: (options: any) => showDialog({
        title: options.title || t('common.success'),
        message: options.content,
        theme: 'round-button'
      }),
      warning: (options: any) => showDialog({
        title: options.title || t('common.warning'),
        message: options.content,
        theme: 'round-button'
      }),
      error: (options: any) => showDialog({
        title: options.title || t('common.error'),
        message: options.content,
        theme: 'round-button'
      }),
      confirm: (options: any) => showDialog({
        title: options.title || t('common.confirm'),
        message: options.content,
        showCancelButton: true,
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel')
      })
    };

    // Message
    window.$message = {
      info: (content: string) => showToast({ message: content, type: 'text' }),
      success: (content: string) => showToast({ message: content, type: 'success' }),
      warning: (content: string) => showToast({ message: content, type: 'fail' }),
      error: (content: string) => showToast({ message: content, type: 'fail' })
    };

    // Notification
    window.$notification = {
      info: (options: any) => showNotify({ message: options.message || options, type: 'primary' }),
      success: (options: any) => showNotify({ message: options.message || options, type: 'success' }),
      warning: (options: any) => showNotify({ message: options.message || options, type: 'warning' }),
      error: (options: any) => showNotify({ message: options.message || options, type: 'danger' })
    };
    
    window.$uuid = () => {
      return buildUUID();
    }
    
    const { copy } = useClipboard();
    window.$copy = async (text: string, showMessage = true) => {
      try {
        await copy(text);
        if (showMessage) {
          window.$message.success(t('common.copySuccess'));
        }
      } catch (error) {
        if (showMessage) {
          window.$message.error(t('common.copyFailed'));
        }
      }
    };
    
    window.$date = {
      format: DateUtils.format,
      parse: DateUtils.parse
    }
    
    window.$i18n = {
      t: t
    }
    
    window.$emit = emitter.emit
    window.$on = emitter.on
    window.$off = emitter.off
    window.$uploader = createUploader()
    window.$files = fileChooser
    window.$chat = chatMessageProcessor
    window.$music = musicPlayerManager
    
    // 检测微信浏览器
    window.$isWechatBrowser = () => {
      const ua = navigator.userAgent.toLowerCase()
      return /micromessenger/.test(ua)
    }
    
    // 获取高度值，微信浏览器不支持dvh时使用vh
    window.$getHeightVH = (height: number): string => {
      if (window.$isWechatBrowser()) {
        // 微信浏览器不支持dvh，使用vh
        return `${height}vh`
      } else {
        // 其他浏览器支持dvh，使用dvh
        return `${height}dvh`
      }
    }
  };

  return {
    registerGlobalMethods,
    emitter
  };
}

// 创建 ContextHolder 组件（如果需要保持组件形式）
export const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    const { registerGlobalMethods } = useAppProvider();
    registerGlobalMethods();
    return () => createTextVNode();
  }
});