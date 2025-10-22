<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 主要内容区域 -->
    <div class="page-content">
      <SdkworkTextToSpeech
        @synthesis-complete="handleSynthesisComplete"
        @synthesis-error="handleSynthesisError"
        class="tts-component"
      />
    </div>

    <!-- 使用说明 -->
    <div class="usage-guide">
      <sdkwork-collapse v-model="activeNames">
        <sdkwork-collapse-item title="使用说明" name="guide">
          <div class="guide-content">
            <h4>语音合成功能说明</h4>
            <ul>
              <li><strong>文本输入：</strong>输入要合成的文本内容，支持中英文</li>
              <li><strong>发音人选择：</strong>点击"选择发音人"按钮，从发音人列表中选择合适的发音人</li>
              <li><strong>合成设置：</strong>可以调整语速、音量、音调等参数</li>
              <li><strong>试听功能：</strong>选择发音人后可以点击"试听"按钮预览发音效果</li>
              <li><strong>开始合成：</strong>点击"开始合成"按钮生成语音文件</li>
              <li><strong>播放控制：</strong>合成完成后可以播放、暂停、停止音频</li>
            </ul>
            
            <h4>支持的功能</h4>
            <ul>
              <li>多种发音人选择（男声、女声、不同语言）</li>
              <li>实时参数调整</li>
              <li>音频文件下载</li>
              <li>响应式设计，支持移动端</li>
            </ul>
          </div>
        </sdkwork-collapse-item>
      </sdkwork-collapse>
    </div>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import SdkworkTextToSpeech from '@/components/sdkwork-text-to-speech/sdkwork-text-to-speech.vue'

// 页面配置
definePage({
  meta: {
    title: '语音合成',
    requiresAuth: false,
  }
})

const router = useRouter()
const activeNames = ref<string[]>(['guide'])

/**
 * 处理返回
 */
const handleBack = () => {
  router.back()
}

/**
 * 处理合成完成
 */
const handleSynthesisComplete = (audioData: any) => {
  console.log('语音合成完成:', audioData)
  showToast('语音合成完成')
}

/**
 * 处理合成错误
 */
const handleSynthesisError = (error: any) => {
  console.error('语音合成失败:', error)
  showToast('合成失败，请重试')
}
</script>

<style scoped lang="scss">
.text-to-speech-page {
  min-height: 100dvh;
  background: var(--van-background);
  
  .page-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
  }
  
  .page-content {
    padding: 16px;
    
    .tts-component {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
  }
  
  .usage-guide {
    padding: 0 16px 16px;
    
    .guide-content {
      h4 {
        margin: 16px 0 8px;
        color: var(--van-text-color);
        font-size: 14px;
        font-weight: 600;
        
        &:first-child {
          margin-top: 0;
        }
      }
      
      ul {
        margin: 0;
        padding-left: 20px;
        
        li {
          margin-bottom: 8px;
          font-size: 13px;
          line-height: 1.5;
          color: var(--van-text-color-2);
          
          strong {
            color: var(--van-text-color);
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .text-to-speech-page {
    .page-content {
      padding: 12px;
    }
    
    .usage-guide {
      padding: 0 12px 12px;
    }
  }
}
</style>