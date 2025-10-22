<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 主要内容区域 -->
    <div class="page-content">
      <SdkworkSpeechToText
        @recognition-start="handleRecognitionStart"
        @recognition-stop="handleRecognitionStop"
        @recognition-error="handleRecognitionError"
        @recognition-complete="handleRecognitionComplete"
        class="stt-component"
      />
    </div>

    <!-- 使用说明 -->
    <div class="usage-guide">
      <sdkwork-collapse v-model="activeNames">
        <sdkwork-collapse-item title="使用说明" name="guide">
          <div class="guide-content">
            <h4>语音转文字功能说明</h4>
            <ul>
              <li><strong>开始识别：</strong>点击"开始识别"按钮开始语音识别</li>
              <li><strong>停止识别：</strong>点击"停止识别"按钮结束语音识别</li>
              <li><strong>暂停/继续：</strong>识别过程中可以暂停和继续</li>
              <li><strong>语言选择：</strong>支持多种语言识别，包括中文、英文、日语等</li>
              <li><strong>识别模式：</strong>支持连续识别和单次识别两种模式</li>
              <li><strong>自动标点：</strong>自动为识别结果添加标点符号</li>
              <li><strong>静音检测：</strong>自动检测静音并停止识别</li>
            </ul>
            
            <h4>支持的功能</h4>
            <ul>
              <li>实时语音识别</li>
              <li>多语言支持</li>
              <li>识别历史记录</li>
              <li>结果复制功能</li>
              <li>音量实时监测</li>
              <li>响应式设计，支持移动端</li>
            </ul>
            
            <h4>使用技巧</h4>
            <ul>
              <li>在安静的环境中使用以获得更好的识别效果</li>
              <li>说话时保持适当的语速和音量</li>
              <li>连续识别模式下可以长时间录音</li>
              <li>单次识别模式适合短语音输入</li>
              <li>识别结果可以复制到其他应用中使用</li>
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
import SdkworkSpeechToText from '@/components/sdkwork-speech-to-text/sdkwork-speech-to-text.vue'

// 页面配置
definePage({
  meta: {
    title: '语音转文字',
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
 * 处理识别开始
 */
const handleRecognitionStart = () => {
  console.log('语音识别开始')
}

/**
 * 处理识别停止
 */
const handleRecognitionStop = (result: string) => {
  console.log('语音识别停止，结果:', result)
}

/**
 * 处理识别错误
 */
const handleRecognitionError = (error: Error) => {
  console.error('语音识别错误:', error)
  showToast('识别过程中出现错误')
}

/**
 * 处理识别完成
 */
const handleRecognitionComplete = (result: string) => {
  console.log('语音识别完成:', result)
  showToast('语音识别完成')
}
</script>

<style scoped lang="scss">
.speech-to-text-page {
  min-height: 100dvh;
  background: var(--van-background);
  
  .page-content {
    padding: 16px;
    
    .stt-component {
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
  .speech-to-text-page {
    .page-content {
      padding: 12px;
    }
    
    .usage-guide {
      padding: 0 12px 12px;
    }
  }
}
</style>