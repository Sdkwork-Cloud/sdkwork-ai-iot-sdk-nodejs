<template>
  <sdkwork-page-container 
    safe-area
    scrollable
    theme-mode="auto" 
  >
 
      <!-- 语音克隆组件 -->
      <sdkwork-voice-clone
        :text="cloneText"
        :uploadable="true"
        :recordable="true"
        :accept="'audio/*'"
        :max-size="20"
        :disabled="isProcessing"
        @upload="handleAudioUpload"
        @record="handleAudioRecord"
        @clone="handleVoiceClone"
        @save="handleVoiceSave"
      /> 

    <!-- 处理状态提示 -->
    <van-overlay :show="isProcessing" class="processing-overlay">
      <div class="processing-content">
        <van-loading type="spinner" size="24px" />
        <div class="processing-text">{{ processingMessage }}</div>
      </div>
    </van-overlay>
  </sdkwork-page-container >
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog, showNotify } from 'vant'
import SdkworkVoiceClone from '@/components/sdkwork-voice-clone/sdkwork-voice-clone.vue'

definePage({
    meta: {
        title: '克隆你的声音',
        hideBackButton: true
    }
})
// 路由实例
const router = useRouter()

// 状态管理
const isProcessing = ref(false)
const processingMessage = ref('处理中...')

// 克隆文本
const cloneText = ref('请朗读以下文字：欢迎使用语音克隆功能，请清晰地朗读这段文字。语音克隆技术可以将您的声音特征提取并应用到其他文本上，生成具有您音色的语音。')

// 处理返回
const handleBack = () => {
  router.back()
}

// 处理音频上传
const handleAudioUpload = (file: File) => {
  console.log('音频上传:', file)
  isProcessing.value = true
  processingMessage.value = '正在处理上传的音频...'
  
  // 模拟处理过程
  setTimeout(() => {
    isProcessing.value = false
    showToast('音频上传成功')
    
    // 这里可以添加实际的音频处理逻辑
    // 例如：调用语音克隆API
  }, 2000)
}

// 处理音频录制
const handleAudioRecord = (audioBlob: Blob | ArrayBuffer) => {
  console.log('音频录制完成:', audioBlob)
  isProcessing.value = true
  processingMessage.value = '正在处理录制的音频...'
  
  // 模拟处理过程
  setTimeout(() => {
    isProcessing.value = false
    showToast('音频录制处理完成')
    
    // 这里可以添加实际的音频处理逻辑
    // 例如：调用语音克隆API
  }, 2000)
}

// 处理语音克隆
const handleVoiceClone = () => {
  showDialog({
    title: '开始语音克隆',
    message: '确定要开始语音克隆吗？这可能需要一些时间。',
    showCancelButton: true,
    confirmButtonText: '开始克隆',
    cancelButtonText: '取消'
  }).then(() => {
    isProcessing.value = true
    processingMessage.value = '正在进行语音克隆...'
    
    // 模拟克隆过程
    setTimeout(() => {
      isProcessing.value = false
      showNotify({
        type: 'success',
        message: '语音克隆完成！',
        duration: 3000
      })
      
      // 这里可以添加实际的克隆逻辑
      // 例如：调用语音克隆API并保存结果
    }, 5000)
  })
}

// 处理音色保存
const handleVoiceSave = (voiceName: string, audioData?: Blob | string) => {
  showDialog({
    title: '保存音色',
    message: `确定要保存音色"${voiceName}"吗？`,
    showCancelButton: true,
    confirmButtonText: '保存',
    cancelButtonText: '取消'
  }).then(() => {
    isProcessing.value = true
    processingMessage.value = '正在保存音色...'
    
    // 模拟保存过程
    setTimeout(() => {
      isProcessing.value = false
      showToast('音色保存成功')
      
      // 这里可以添加实际的保存逻辑
      // 例如：保存到本地存储或调用API
      console.log('保存音色:', voiceName, audioData)
    }, 2000)
  })
}

// 页面挂载时的初始化
onMounted(() => {
  console.log('语音克隆页面已加载')
})
</script>

<style scoped>
.voice-clone-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}

.page-header {
  flex-shrink: 0;
}

.page-content {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.processing-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}

.processing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 24px;
  min-width: 200px;
}

.processing-text {
  margin-top: 12px;
  font-size: 14px;
  color: #333;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .voice-clone-page {
    height: 100vh;
  }
  
  .page-content {
    padding: 0;
  }
}
</style>