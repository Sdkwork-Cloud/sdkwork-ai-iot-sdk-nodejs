<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 页面头部 -->
    <template #header>
      <sdkwork-navbar
        title="音频上传组件演示"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
      />
    </template>

    <!-- 演示内容区域 -->
    <div class="demo-content">
      <sdkwork-cell-group title="基础功能演示">
        <sdkwork-cell title="单个音频上传" is-link @click="showSingleAudio = true" />
        <sdkwork-cell title="多个音频上传" is-link @click="showMultiAudio = true" />
        <sdkwork-cell title="音频播放控制" is-link @click="showPlayControl = true" />
        <sdkwork-cell title="音频时长检测" is-link @click="showDurationDetection = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="高级功能演示">
        <sdkwork-cell title="波形显示效果" is-link @click="showWaveformDemo = true" />
        <sdkwork-cell title="音频格式识别" is-link @click="showFormatRecognition = true" />
        <sdkwork-cell title="音频时长限制" is-link @click="showDurationLimit = true" />
        <sdkwork-cell title="播放状态管理" is-link @click="showPlaybackState = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="特殊场景演示">
        <sdkwork-cell title="音乐上传" is-link @click="showMusicUpload = true" />
        <sdkwork-cell title="语音消息上传" is-link @click="showVoiceMessage = true" />
        <sdkwork-cell title="播客音频上传" is-link @click="showPodcastUpload = true" />
      </sdkwork-cell-group>
    </div>

    <!-- 单个音频上传演示 -->
    <sdkwork-popup v-model:show="showSingleAudio" position="center" title="单个音频上传" :width="450">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="singleAudios"
          :multiple="false"
          :auto-upload="true"
          title="选择单个音频"
          subtitle="支持MP3、WAV、OGG等格式"
          @upload-success="handleAudioUploadSuccess"
          @audio-play="handleAudioPlay"
        />
        <div v-if="singleAudios.length > 0" class="audio-info">
          <p>已选择音频: {{ singleAudios.length }} 个</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 多个音频上传演示 -->
    <sdkwork-popup v-model:show="showMultiAudio" position="center" title="多个音频上传" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="multiAudios"
          :multiple="true"
          :auto-upload="true"
          :max-count="5"
          :max-size="50 * 1024 * 1024"
          title="选择多个音频"
          subtitle="最多5个音频，每个最大50MB"
          @upload-success="handleAudioUploadSuccess"
        />
      </div>
    </sdkwork-popup>

    <!-- 音频播放控制演示 -->
    <sdkwork-popup v-model:show="showPlayControl" position="center" title="音频播放控制" :width="600">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="playControlAudios"
          :multiple="true"
          :auto-upload="false"
          title="播放控制演示"
          subtitle="支持播放、暂停、停止控制"
          @audio-play="handleAudioPlay"
          @audio-pause="handleAudioPause"
          @audio-ended="handleAudioEnded"
        />
        <div class="play-control-info">
          <h4>播放控制功能:</h4>
          <ul>
            <li>点击播放按钮开始播放</li>
            <li>播放时显示暂停按钮</li>
            <li>支持播放状态管理</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 音频时长检测演示 -->
    <sdkwork-popup v-model:show="showDurationDetection" position="center" title="音频时长检测" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="durationDetectionAudios"
          :multiple="true"
          :auto-upload="false"
          title="时长检测演示"
          subtitle="自动检测音频时长信息"
          @audio-metadata="handleAudioDuration"
        />
        <div class="duration-info" v-if="durationData.length > 0">
          <h4>音频时长:</h4>
          <div v-for="item in durationData" :key="item.fileName" class="duration-item">
            <span>{{ item.fileName }}</span>
            <span>{{ formatDuration(item.duration) }}</span>
          </div>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 波形显示效果演示 -->
    <sdkwork-popup v-model:show="showWaveformDemo" position="center" title="波形显示效果" :width="600">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="waveformAudios"
          :multiple="true"
          :auto-upload="false"
          title="波形显示演示"
          subtitle="播放时显示动态波形效果"
        />
        <div class="waveform-info">
          <h4>波形显示功能:</h4>
          <ul>
            <li>播放时显示动态波形</li>
            <li>增强音频播放体验</li>
            <li>可视化音频播放状态</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 音频格式识别演示 -->
    <sdkwork-popup v-model:show="showFormatRecognition" position="center" title="音频格式识别" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="formatRecognitionAudios"
          :multiple="true"
          :auto-upload="false"
          title="格式识别演示"
          subtitle="自动识别音频文件格式"
        />
        <div class="format-info" v-if="formatRecognitionAudios.length > 0">
          <h4>支持的音频格式:</h4>
          <ul>
            <li>MP3 - MPEG Audio Layer III</li>
            <li>WAV - Waveform Audio File Format</li>
            <li>OGG - Ogg Vorbis</li>
            <li>AAC - Advanced Audio Coding</li>
            <li>FLAC - Free Lossless Audio Codec</li>
            <li>M4A - MPEG-4 Audio</li>
            <li>WMA - Windows Media Audio</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 音频时长限制演示 -->
    <sdkwork-popup v-model:show="showDurationLimit" position="center" title="音频时长限制" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="durationLimitAudios"
          :multiple="true"
          :auto-upload="true"
          :max-duration="300"
          title="时长限制演示"
          subtitle="最大时长: 5分钟"
          @upload-error="handleDurationLimitError"
        />
        <div class="limit-info">
          <p>时长限制: 5分钟</p>
          <p>超过限制的音频将被拒绝</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 播放状态管理演示 -->
    <sdkwork-popup v-model:show="showPlaybackState" position="center" title="播放状态管理" :width="600">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="playbackStateAudios"
          :multiple="true"
          :auto-upload="false"
          title="播放状态管理"
          subtitle="管理多个音频的播放状态"
        />
        <div class="playback-state-info">
          <h4>播放状态管理:</h4>
          <ul>
            <li>同时只能播放一个音频</li>
            <li>播放状态自动切换</li>
            <li>高亮显示当前播放项</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 音乐上传演示 -->
    <sdkwork-popup v-model:show="showMusicUpload" position="center" title="音乐上传" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="musicAudios"
          :multiple="true"
          :auto-upload="true"
          :max-duration="600"
          :max-size="20 * 1024 * 1024"
          title="音乐上传"
          subtitle="最大时长: 10分钟，最大文件: 20MB"
          @upload-success="handleMusicUpload"
        />
        <div class="music-tips">
          <p>音乐上传要求:</p>
          <ul>
            <li>支持主流音乐格式</li>
            <li>音质清晰，无杂音</li>
            <li>文件大小适中</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 语音消息上传演示 -->
    <sdkwork-popup v-model:show="showVoiceMessage" position="center" title="语音消息上传" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="voiceMessageAudios"
          :multiple="true"
          :auto-upload="true"
          :max-duration="60"
          :max-size="5 * 1024 * 1024"
          title="语音消息上传"
          subtitle="最大时长: 1分钟，最大文件: 5MB"
          @upload-success="handleVoiceMessageUpload"
        />
        <div class="voice-message-tips">
          <p>语音消息要求:</p>
          <ul>
            <li>时长不超过1分钟</li>
            <li>声音清晰可辨</li>
            <li>文件体积小</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 播客音频上传演示 -->
    <sdkwork-popup v-model:show="showPodcastUpload" position="center" title="播客音频上传" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-audio
          v-model="podcastAudios"
          :multiple="true"
          :auto-upload="true"
          :max-duration="3600"
          :max-size="100 * 1024 * 1024"
          title="播客音频上传"
          subtitle="最大时长: 60分钟，最大文件: 100MB"
          @upload-success="handlePodcastUpload"
        />
        <div class="podcast-tips">
          <p>播客音频要求:</p>
          <ul>
            <li>时长可长达60分钟</li>
            <li>音质清晰，内容完整</li>
            <li>支持长时间播放</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import SdkworkPopup from '@/components/sdkwork-popup/sdkwork-popup.vue'
import SdkworkUploaderAudio from '@/components/sdkwork-uploader-audio/sdkwork-uploader-audio.vue'

// 弹窗显示状态
const showSingleAudio = ref(false)
const showMultiAudio = ref(false)
const showPlayControl = ref(false)
const showDurationDetection = ref(false)
const showWaveformDemo = ref(false)
const showFormatRecognition = ref(false)
const showDurationLimit = ref(false)
const showPlaybackState = ref(false)
const showMusicUpload = ref(false)
const showVoiceMessage = ref(false)
const showPodcastUpload = ref(false)

// 音频数据
const singleAudios = ref<File[]>([])
const multiAudios = ref<File[]>([])
const playControlAudios = ref<File[]>([])
const durationDetectionAudios = ref<File[]>([])
const waveformAudios = ref<File[]>([])
const formatRecognitionAudios = ref<File[]>([])
const durationLimitAudios = ref<File[]>([])
const playbackStateAudios = ref<File[]>([])
const musicAudios = ref<File[]>([])
const voiceMessageAudios = ref<File[]>([])
const podcastAudios = ref<File[]>([])

// 时长数据
const durationData = ref<Array<{fileName: string, duration: number}>>([])

// 事件处理函数
const handleAudioUploadSuccess = (file: File, response: any) => {
  showToast(`音频上传成功: ${file.name}`)
  console.log('音频上传响应:', response)
}

const handleAudioPlay = (file: File) => {
  console.log('音频开始播放:', file.name)
  showToast(`开始播放: ${file.name}`)
}

const handleAudioPause = (file: File) => {
  console.log('音频暂停播放:', file.name)
  showToast(`暂停播放: ${file.name}`)
}

const handleAudioEnded = (file: File) => {
  console.log('音频播放结束:', file.name)
  showToast(`播放结束: ${file.name}`)
}

const handleAudioDuration = (file: File, metadata: any) => {
  if (metadata && metadata.duration) {
    durationData.value.push({
      fileName: file.name,
      duration: metadata.duration
    })
  }
}

const handleDurationLimitError = (file: File, error: Error) => {
  showToast(`音频时长超出限制: ${file.name}`)
}

const handleMusicUpload = (file: File, response: any) => {
  showToast(`音乐上传成功: ${file.name}`)
}

const handleVoiceMessageUpload = (file: File, response: any) => {
  showToast(`语音消息上传成功: ${file.name}`)
}

const handlePodcastUpload = (file: File, response: any) => {
  showToast(`播客音频上传成功: ${file.name}`)
}

// 时长格式化
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped lang="scss">
.audio-upload-demo-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
}

.demo-content {
  padding: 16px;
}

.popup-content {
  padding: 20px;
  
  .audio-info {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    
    p {
      margin: 0;
      color: #666;
    }
  }
  
  .play-control-info,
  .duration-info,
  .waveform-info,
  .format-info,
  .limit-info,
  .playback-state-info,
  .music-tips,
  .voice-message-tips,
  .podcast-tips {
    margin-top: 16px;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
    
    h4 {
      margin: 0 0 8px 0;
      color: #333;
    }
    
    p {
      margin: 4px 0;
      color: #666;
    }
    
    ul {
      margin: 8px 0;
      padding-left: 20px;
      
      li {
        margin: 4px 0;
        color: #666;
      }
    }
    
    .duration-item {
      display: flex;
      justify-content: space-between;
      margin: 4px 0;
      padding: 4px 8px;
      background-color: #e9ecef;
      border-radius: 4px;
      font-size: 12px;
      color: #495057;
    }
  }
}
</style>