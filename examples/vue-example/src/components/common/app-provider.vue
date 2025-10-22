<script setup lang="ts">
import { createTextVNode, defineComponent, ref, computed } from 'vue';
import { showLoadingToast, closeToast, showDialog, showNotify, showToast } from 'vant';
import { useRouter, useRoute } from 'vue-router';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { buildUUID } from '@/utils/uuid';
import DateUtils from '@/core/framework/utils/DateUtils';
import mitt from 'mitt';
import { createUploader } from '@/core/upload'
import fileChooser from '@/core/files';
import chatMessageProcessor from '@/core/chat';
import musicPlayerManager from '@/core/music';
import MusicPlayerPanel from './music-player-panel.vue';
defineOptions({
  name: 'AppProvider'
});
const emitter = mitt()


function _getParameter(name: string) {
  try { 
    const route = useRoute();
     
    
    // 如果路由对象存在且有效，从路由对象中获取参数
    if (route && (route.params || route.query)) { 
      if (route.params && (route.params as Record<string, any>)[name]) {
        return (route.params as Record<string, any>)[name];
      }
      if (route.query && (route.query as Record<string, any>)[name]) {
        return (route.query as Record<string, any>)[name];
      }
    }
    
    // 如果路由对象为空或无法获取参数，从URL中解析
    const url = window.location.href;
    const urlObj = new URL(url);
    
    // 尝试从URL查询参数中获取
    if (urlObj.searchParams.has(name)) {
      return urlObj.searchParams.get(name);
    }
    
    // 尝试从URL路径中解析参数（简单实现，可能需要根据实际路由规则调整）
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const pathParamNames = window.$router?.currentRoute?.value?.matched[0]?.path.split('/').filter((s:any) => s.startsWith(':')) || [];
    
    for (let i = 0; i < pathParamNames.length; i++) {
      const paramName = pathParamNames[i].substring(1); // 去掉':'前缀
      if (paramName === name && i < pathSegments.length) {
        return pathSegments[i];
      }
    }
    
    return null;
  } catch (error) {
    console.error('获取路由参数失败:', error);
    return null;
  }
}
function getParameter(name: string | any) {
  if (typeof name === 'string') {
    return _getParameter(name);
  }
  if (Array.isArray(name)) {
    for (let n of name) {
      let v = _getParameter(n);
      if (v) return v;
    }
  }
  return null;
}
const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    function register() {
      const { t } = useI18n();
      // Loading bar
      window.$loadingBar = {
        start: () => showLoadingToast({ duration: 0, forbidClick: true }),
        finish: () => closeToast(),
        error: () => closeToast()
      };
      window.$router = useRouter();
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

      window.$getParameter = getParameter;
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
    }

    register();

    return () => createTextVNode();
  }
});
</script>

<template>
  <ContextHolder />
  <slot></slot>
  
  <!-- 音乐播放器面板 -->
  <MusicPlayerPanel />
</template>

<style scoped></style>