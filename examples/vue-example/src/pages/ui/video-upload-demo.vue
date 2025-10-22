<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 页面头部 -->
    <template #header>
      <sdkwork-navbar
        title="视频上传组件演示"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
      />
    </template>

    <!-- 演示内容区域 -->
    <div class="demo-content">
      <sdkwork-cell-group title="基础功能演示">
        <sdkwork-cell title="单个视频上传" is-link @click="showSingleVideo = true" />
        <sdkwork-cell title="多个视频上传" is-link @click="showMultiVideo = true" />
        <sdkwork-cell title="视频预览功能" is-link @click="showPreviewDemo = true" />
        <sdkwork-cell title="视频时长检测" is-link @click="showDurationDetection = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="高级功能演示">
        <sdkwork-cell title="视频尺寸检测" is-link @click="showSizeDetection = true" />
        <sdkwork-cell title="视频时长限制" is-link @click="showDurationLimit = true" />
        <sdkwork-cell title="视频播放控制" is-link @click="showPlayControl = true" />
        <sdkwork-cell title="缩略图生成" is-link @click="showThumbnailDemo = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="特殊场景演示">
        <sdkwork-cell title="短视频上传" is-link @click="showShortVideo = true" />
        <sdkwork-cell title="教学视频上传" is-link @click="showTeachingVideo = true" />
        <sdkwork-cell title="产品演示视频" is-link @click="showProductVideo = true" />
      </sdkwork-cell-group>
    </div>

    <!-- 单个视频上传演示 -->
    <sdkwork-popup v-model:show="showSingleVideo" position="center" title="单个视频上传" :width="450">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="singleVideos"
          :multiple="false"
          :auto-upload="true"
          title="选择单个视频"
          subtitle="支持MP4、AVI、MOV等格式"
          @upload-success="handleVideoUploadSuccess"
          @video-preview="handleVideoPreview"
        />
        <div v-if="singleVideos.length > 0" class="video-info">
          <p>已选择视频: {{ singleVideos.length }} 个</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 多个视频上传演示 -->
    <sdkwork-popup v-model:show="showMultiVideo" position="center" title="多个视频上传" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="multiVideos"
          :multiple="true"
          :auto-upload="true"
          :max-count="3"
          :max-size="200 * 1024 * 1024"
          title="选择多个视频"
          subtitle="最多3个视频，每个最大200MB"
          @upload-success="handleVideoUploadSuccess"
        />
      </div>
    </sdkwork-popup>

    <!-- 视频预览功能演示 -->
    <sdkwork-popup v-model:show="showPreviewDemo" position="center" title="视频预览功能" :width="600">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="previewVideos"
          :multiple="true"
          :auto-upload="false"
          title="视频预览演示"
          subtitle="支持缩略图预览和播放功能"
          @video-preview="handleVideoPreview"
          @video-metadata="handleVideoMetadata"
        />
        <div class="preview-info" v-if="previewVideos.length > 0">
          <h4>预览信息:</h4>
          <div v-for="video in previewVideos" :key="video.name" class="preview-item">
            <span>{{ video.name }}</span>
            <span>{{ formatFileSize(video.size) }}</span>
          </div>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 视频时长检测演示 -->
    <sdkwork-popup v-model:show="showDurationDetection" position="center" title="视频时长检测" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="durationDetectionVideos"
          :multiple="true"
          :auto-upload="false"
          title="时长检测演示"
          subtitle="自动检测视频时长信息"
          @video-metadata="handleVideoDuration"
        />
        <div class="duration-info" v-if="durationData.length > 0">
          <h4>视频时长:</h4>
          <div v-for="item in durationData" :key="item.fileName" class="duration-item">
            <span>{{ item.fileName }}</span>
            <span>{{ formatDuration(item.duration) }}</span>
          </div>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 视频尺寸检测演示 -->
    <sdkwork-popup v-model:show="showSizeDetection" position="center" title="视频尺寸检测" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="sizeDetectionVideos"
          :multiple="true"
          :auto-upload="false"
          title="尺寸检测演示"
          subtitle="自动检测视频分辨率"
          @video-metadata="handleVideoDimensions"
        />
        <div class="dimension-info" v-if="dimensionData.length > 0">
          <h4>视频分辨率:</h4>
          <div v-for="item in dimensionData" :key="item.fileName" class="dimension-item">
            <span>{{ item.fileName }}</span>
            <span>{{ item.width }}×{{ item.height }}</span>
          </div>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 视频时长限制演示 -->
    <sdkwork-popup v-model:show="showDurationLimit" position="center" title="视频时长限制" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="durationLimitVideos"
          :multiple="true"
          :auto-upload="true"
          :max-duration="300"
          title="时长限制演示"
          subtitle="最大时长: 5分钟"
          @upload-error="handleDurationLimitError"
        />
        <div class="limit-info">
          <p>时长限制: 5分钟</p>
          <p>超过限制的视频将被拒绝</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 视频播放控制演示 -->
    <sdkwork-popup v-model:show="showPlayControl" position="center" title="视频播放控制" :width="600">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="playControlVideos"
          :multiple="true"
          :auto-upload="false"
          title="播放控制演示"
          subtitle="支持视频预览播放功能"
        />
        <div class="play-info">
          <p>播放功能:</p>
          <ul>
            <li>点击播放按钮预览视频</li>
            <li>支持全屏播放模式</li>
            <li>播放控制按钮</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 缩略图生成演示 -->
    <sdkwork-popup v-model:show="showThumbnailDemo" position="center" title="缩略图生成" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="thumbnailVideos"
          :multiple="true"
          :auto-upload="false"
          title="缩略图生成演示"
          subtitle="自动生成视频第一帧作为缩略图"
        />
        <div class="thumbnail-info">
          <p>缩略图功能:</p>
          <ul>
            <li>自动提取视频第一帧</li>
            <li>生成预览缩略图</li>
            <li>提升用户体验</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 短视频上传演示 -->
    <sdkwork-popup v-model:show="showShortVideo" position="center" title="短视频上传" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="shortVideos"
          :multiple="true"
          :auto-upload="true"
          :max-duration="60"
          :max-size="50 * 1024 * 1024"
          title="短视频上传"
          subtitle="最大时长: 1分钟，最大文件: 50MB"
          @upload-success="handleShortVideoUpload"
        />
        <div class="short-video-tips">
          <p>短视频要求:</p>
          <ul>
            <li>时长不超过1分钟</li>
            <li>文件大小不超过50MB</li>
            <li>支持主流视频格式</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 教学视频上传演示 -->
    <sdkwork-popup v-model:show="showTeachingVideo" position="center" title="教学视频上传" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="teachingVideos"
          :multiple="true"
          :auto-upload="true"
          :max-duration="1800"
          :max-size="500 * 1024 * 1024"
          title="教学视频上传"
          subtitle="最大时长: 30分钟，最大文件: 500MB"
          @upload-success="handleTeachingVideoUpload"
        />
        <div class="teaching-tips">
          <p>教学视频要求:</p>
          <ul>
            <li>时长不超过30分钟</li>
            <li>清晰度建议720p以上</li>
            <li>声音清晰，内容完整</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 产品演示视频上传演示 -->
    <sdkwork-popup v-model:show="showProductVideo" position="center" title="产品演示视频" :width="600">
      <div class="popup-content">
        <sdkwork-uploader-video
          v-model="productVideos"
          :multiple="true"
          :auto-upload="true"
          :max-duration="600"
          :max-size="200 * 1024 * 1024"
          title="产品演示视频"
          subtitle="最大时长: 10分钟，最大文件: 200MB"
          @upload-success="handleProductVideoUpload"
        />
        <div class="product-video-tips">
          <p>产品演示视频要求:</p>
          <ul>
            <li>展示产品功能特点</li>
            <li>画面清晰，解说清楚</li>
            <li>时长适中，突出重点</li>
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
import SdkworkUploaderVideo from '@/components/sdkwork-uploader-video/sdkwork-uploader-video.vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'

// 弹窗显示状态
const showSingleVideo = ref(false)
const showMultiVideo = ref(false)
const showPreviewDemo = ref(false)
const showDurationDetection = ref(false)
const showSizeDetection = ref(false)
const showDurationLimit = ref(false)
const showPlayControl = ref(false)
const showThumbnailDemo = ref(false)
const showShortVideo = ref(false)
const showTeachingVideo = ref(false)
const showProductVideo = ref(false)

// 视频数据
const singleVideos = ref<File[]>([])
const multiVideos = ref<File[]>([])
const previewVideos = ref<File[]>([])
const durationDetectionVideos = ref<File[]>([])
const sizeDetectionVideos = ref<File[]>([])
const durationLimitVideos = ref<File[]>([])
const playControlVideos = ref<File[]>([])
const thumbnailVideos = ref<File[]>([])
const shortVideos = ref<File[]>([])
const teachingVideos = ref<File[]>([])
const productVideos = ref<File[]>([])

// 时长数据
const durationData = ref<Array<{fileName: string, duration: number}>>([])

// 尺寸数据
const dimensionData = ref<Array<{fileName: string, width: number, height: number}>>([])

// 事件处理函数
const handleVideoUploadSuccess = (file: File, response: any) => {
  showToast(`视频上传成功: ${file.name}`)
  console.log('视频上传响应:', response)
}

const handleVideoPreview = (file: File, previewUrl: string) => {
  console.log('视频预览:', file.name, previewUrl)
  showToast(`生成预览: ${file.name}`)
}

const handleVideoMetadata = (file: File, metadata: any) => {
  console.log('视频元数据:', file.name, metadata)
}

const handleVideoDuration = (file: File, metadata: any) => {
  if (metadata && metadata.duration) {
    durationData.value.push({
      fileName: file.name,
      duration: metadata.duration
    })
  }
}

const handleVideoDimensions = (file: File, metadata: any) => {
  if (metadata && metadata.width && metadata.height) {
    dimensionData.value.push({
      fileName: file.name,
      width: metadata.width,
      height: metadata.height
    })
  }
}

const handleDurationLimitError = (file: File, error: Error) => {
  showToast(`视频时长超出限制: ${file.name}`)
}

const handleShortVideoUpload = (file: File, response: any) => {
  showToast(`短视频上传成功: ${file.name}`)
}

const handleTeachingVideoUpload = (file: File, response: any) => {
  showToast(`教学视频上传成功: ${file.name}`)
}

const handleProductVideoUpload = (file: File, response: any) => {
  showToast(`产品演示视频上传成功: ${file.name}`)
}

// 文件大小格式化
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 时长格式化
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 页面加载事件处理
const handlePageLoad = () => {
  console.log('视频上传演示页面加载完成')
}
</script>

<style scoped lang="scss">
.video-upload-demo-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
}

.demo-content {
  padding: 16px;
}

.popup-content {
  padding: 20px;
  
  .video-info {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    
    p {
      margin: 0;
      color: #666;
    }
  }
  
  .preview-info,
  .duration-info,
  .dimension-info,
  .limit-info,
  .play-info,
  .thumbnail-info,
  .short-video-tips,
  .teaching-tips,
  .product-video-tips {
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
    
    .preview-item,
    .duration-item,
    .dimension-item {
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