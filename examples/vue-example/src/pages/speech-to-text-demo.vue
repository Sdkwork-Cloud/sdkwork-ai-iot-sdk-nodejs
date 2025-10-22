<template>
  <div class="speech-to-text-demo">
    <!-- 页面头部 -->
    <div class="demo-header">
      <sdkwork-navbar
        title="语音转文字演示"
        left-text="返回"
        left-arrow
        @click-left="handleBack"
      />
    </div>

    <!-- 功能说明 -->
    <div class="demo-intro">
      <van-card>
        <template #header>
          <div class="intro-header">
            <van-icon name="volume" size="24" color="#1989fa" />
            <h3>语音转文字功能演示</h3>
          </div>
        </template>
        
        <template #desc>
          <div class="intro-content">
            <p>这是一个完整的语音转文字功能演示，支持实时语音识别、多语言识别、识别历史记录等功能。</p>
            <div class="feature-list">
              <van-tag type="primary">实时识别</van-tag>
              <van-tag type="success">多语言支持</van-tag>
              <van-tag type="warning">历史记录</van-tag>
              <van-tag type="danger">音量监测</van-tag>
            </div>
          </div>
        </template>
      </van-card>
    </div>

    <!-- 语音转文字组件 -->
    <div class="demo-component">
      <SdkworkSpeechToText
        @recognition-start="handleRecognitionStart"
        @recognition-stop="handleRecognitionStop"
        @recognition-error="handleRecognitionError"
        @recognition-complete="handleRecognitionComplete"
        class="stt-demo"
      />
    </div>

    <!-- 使用场景示例 -->
    <div class="usage-scenarios">
      <sdkwork-collapse v-model="activeScenarios">
        <sdkwork-collapse-item title="使用场景示例" name="scenarios">
          <div class="scenarios-content">
            <h4>语音转文字的典型应用场景</h4>
            
            <van-grid :column-num="2" :gutter="10">
              <van-grid-item>
                <van-icon name="comment" size="24" color="#1989fa" />
                <div class="scenario-item">
                  <div class="scenario-title">会议记录</div>
                  <div class="scenario-desc">实时记录会议内容，自动生成文字纪要</div>
                </div>
              </van-grid-item>
              
              <van-grid-item>
                <van-icon name="notes" size="24" color="#07c160" />
                <div class="scenario-item">
                  <div class="scenario-title">语音笔记</div>
                  <div class="scenario-desc">快速记录想法和灵感，解放双手</div>
                </div>
              </van-grid-item>
              
              <van-grid-item>
                <van-icon name="audio" size="24" color="#ff976a" />
                <div class="scenario-item">
                  <div class="scenario-title">音频转写</div>
                  <div class="scenario-desc">将录音文件转换为可编辑的文字内容</div>
                </div>
              </van-grid-item>
              
              <van-grid-item>
                <van-icon name="globe" size="24" color="#ee0a24" />
                <div class="scenario-item">
                  <div class="scenario-title">多语言翻译</div>
                  <div class="scenario-desc">识别外语语音并转换为中文文字</div>
                </div>
              </van-grid-item>
            </van-grid>
          </div>
        </sdkwork-collapse-item>
      </sdkwork-collapse>
    </div>

    <!-- 操作指南 -->
    <div class="operation-guide">
      <van-steps :active="currentStep" direction="vertical">
        <van-step>
          <h3>第一步：选择语言</h3>
          <p>点击"识别语言"选择您要识别的语言类型</p>
        </van-step>
        <van-step>
          <h3>第二步：开始识别</h3>
          <p>点击"开始识别"按钮，开始语音输入</p>
        </van-step>
        <van-step>
          <h3>第三步：语音输入</h3>
          <p>对着麦克风说话，系统会实时显示识别结果</p>
        </van-step>
        <van-step>
          <h3>第四步：停止识别</h3>
          <p>点击"停止识别"结束语音输入，查看最终结果</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import SdkworkSpeechToText from '@/components/sdkwork-speech-to-text/sdkwork-speech-to-text.vue'

// 页面配置
definePage({
  meta: {
    title: '语音转文字演示',
    requiresAuth: false,
  }
})

const router = useRouter()
const activeScenarios = ref<string[]>(['scenarios'])
const currentStep = ref(0)

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
  currentStep.value = 1
  showToast('语音识别已开始')
}

/**
 * 处理识别停止
 */
const handleRecognitionStop = (result: string) => {
  console.log('语音识别停止，结果:', result)
  currentStep.value = 3
  
  if (result.trim()) {
    showToast(`识别完成，共${result.length}个字符`)
  }
}

/**
 * 处理识别错误
 */
const handleRecognitionError = (error: Error) => {
  console.error('语音识别错误:', error)
  showToast('识别过程中出现错误')
  currentStep.value = 0
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
.speech-to-text-demo {
  min-height: 100dvh;
  background: var(--van-background);
  padding-bottom: 20px;
  
  .demo-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
  }
  
  .demo-intro {
    padding: 16px;
    
    .intro-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      
      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--van-text-color);
      }
    }
    
    .intro-content {
      p {
        margin: 0 0 12px 0;
        font-size: 14px;
        line-height: 1.5;
        color: var(--van-text-color-2);
      }
      
      .feature-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
    }
  }
  
  .demo-component {
    padding: 0 16px 16px;
    
    .stt-demo {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
  
  .usage-scenarios {
    padding: 0 16px 16px;
    
    .scenarios-content {
      h4 {
        margin: 0 0 16px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--van-text-color);
      }
      
      .scenario-item {
        text-align: center;
        padding: 8px;
        
        .scenario-title {
          font-size: 14px;
          font-weight: 600;
          margin: 8px 0 4px;
          color: var(--van-text-color);
        }
        
        .scenario-desc {
          font-size: 12px;
          color: var(--van-text-color-2);
          line-height: 1.4;
        }
      }
    }
  }
  
  .operation-guide {
    padding: 0 16px;
    
    :deep(.van-step) {
      h3 {
        margin: 0 0 4px 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--van-text-color);
      }
      
      p {
        margin: 0;
        font-size: 13px;
        color: var(--van-text-color-2);
        line-height: 1.4;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .speech-to-text-demo {
    .demo-intro,
    .demo-component,
    .usage-scenarios,
    .operation-guide {
      padding: 0 12px 12px;
    }
  }
}
</style>