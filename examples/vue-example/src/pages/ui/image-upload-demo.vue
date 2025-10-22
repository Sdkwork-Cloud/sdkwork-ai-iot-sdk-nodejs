<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 页面头部 -->
    <template #header>
      <sdkwork-navbar
        title="图片上传组件演示"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
      />
    </template>

    <!-- 演示内容区域 -->
    <div class="demo-content">
      <sdkwork-cell-group title="基础功能演示">
        <sdkwork-cell title="单张图片上传" is-link @click="showSingleImage = true" />
        <sdkwork-cell title="多张图片上传" is-link @click="showMultiImage = true" />
        <sdkwork-cell title="图片预览功能" is-link @click="showPreviewDemo = true" />
        <sdkwork-cell title="图片尺寸检测" is-link @click="showSizeDetection = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="高级功能演示">
        <sdkwork-cell title="图片质量压缩" is-link @click="showQualityCompress = true" />
        <sdkwork-cell title="图片尺寸限制" is-link @click="showDimensionLimit = true" />
        <sdkwork-cell title="网格布局展示" is-link @click="showGridLayout = true" />
        <sdkwork-cell title="自定义图片格式" is-link @click="showCustomFormat = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="特殊场景演示">
        <sdkwork-cell title="头像上传" is-link @click="showAvatarUpload = true" />
        <sdkwork-cell title="产品图片上传" is-link @click="showProductImage = true" />
        <sdkwork-cell title="相册批量上传" is-link @click="showAlbumUpload = true" />
      </sdkwork-cell-group>
    </div>

    <!-- 单张图片上传演示 -->
    <sdkwork-popup v-model:show="showSingleImage" position="center" title="单张图片上传" :width="400">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="singleImages"
          :multiple="false"
          :auto-upload="true"
          title="选择单张图片"
          subtitle="支持JPG、PNG、GIF、WEBP格式"
          @upload-success="handleImageUploadSuccess"
          @image-preview="handleImagePreview"
        />
        <div v-if="singleImages.length > 0" class="image-info">
          <p>已选择图片: {{ singleImages.length }} 张</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 多张图片上传演示 -->
    <sdkwork-popup v-model:show="showMultiImage" position="center" title="多张图片上传" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="multiImages"
          :multiple="true"
          :auto-upload="true"
          :max-count="6"
          :max-size="5 * 1024 * 1024"
          title="选择多张图片"
          subtitle="最多6张图片，每张最大5MB"
          @upload-success="handleImageUploadSuccess"
        />
      </div>
    </sdkwork-popup>

    <!-- 图片预览功能演示 -->
    <sdkwork-popup v-model:show="showPreviewDemo" position="center" title="图片预览功能" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="previewImages"
          :multiple="true"
          :auto-upload="false"
          :show-list="true"
          title="图片预览演示"
          subtitle="支持缩略图预览和尺寸显示"
          @image-preview="handleImagePreview"
        />
        <div class="preview-info" v-if="previewImages.length > 0">
          <h4>预览信息:</h4>
          <div v-for="image in previewImages" :key="image.name" class="preview-item">
            <span>{{ image.name }}</span>
            <span>{{ formatFileSize(image.size) }}</span>
          </div>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 图片尺寸检测演示 -->
    <sdkwork-popup v-model:show="showSizeDetection" position="center" title="图片尺寸检测" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="sizeDetectionImages"
          :multiple="true"
          :auto-upload="false"
          title="尺寸检测演示"
          subtitle="自动检测图片宽度和高度"
          @image-preview="handleImageDimensions"
        />
        <div class="dimension-info" v-if="dimensionData.length > 0">
          <h4>图片尺寸:</h4>
          <div v-for="item in dimensionData" :key="item.fileName" class="dimension-item">
            <span>{{ item.fileName }}</span>
            <span>{{ item.width }}×{{ item.height }}</span>
          </div>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 图片质量压缩演示 -->
    <sdkwork-popup v-model:show="showQualityCompress" position="center" title="图片质量压缩" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="qualityImages"
          :multiple="true"
          :auto-upload="true"
          :quality="0.6"
          title="质量压缩演示"
          subtitle="图片质量压缩至60%"
          @upload-success="handleQualityCompress"
        />
        <div class="quality-info">
          <p>压缩质量: 60%</p>
          <p>适用于需要减小文件大小的场景</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 图片尺寸限制演示 -->
    <sdkwork-popup v-model:show="showDimensionLimit" position="center" title="图片尺寸限制" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="dimensionLimitImages"
          :multiple="true"
          :auto-upload="true"
          :max-width="2000"
          :max-height="2000"
          title="尺寸限制演示"
          subtitle="最大尺寸: 2000×2000像素"
          @upload-error="handleDimensionLimitError"
        />
      </div>
    </sdkwork-popup>

    <!-- 网格布局展示演示 -->
    <sdkwork-popup v-model:show="showGridLayout" position="center" title="网格布局展示" :width="600">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="gridImages"
          :multiple="true"
          :auto-upload="false"
          :show-list="true"
          title="网格布局演示"
          subtitle="图片以网格形式排列展示"
        />
        <div class="grid-info">
          <p>当前布局: 响应式网格布局</p>
          <p>支持不同屏幕尺寸的自适应</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 自定义图片格式演示 -->
    <sdkwork-popup v-model:show="showCustomFormat" position="center" title="自定义图片格式" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="customFormatImages"
          :multiple="true"
          :auto-upload="true"
          accept="image/jpeg,image/png"
          title="自定义格式演示"
          subtitle="仅支持JPG和PNG格式"
        />
        <div class="format-info">
          <p>支持格式: JPG, PNG</p>
          <p>其他格式将被过滤</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 头像上传演示 -->
    <sdkwork-popup v-model:show="showAvatarUpload" position="center" title="头像上传" :width="400">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="avatarImages"
          :multiple="false"
          :auto-upload="true"
          :max-size="2 * 1024 * 1024"
          :max-width="500"
          :max-height="500"
          title="上传头像"
          subtitle="建议尺寸: 200×200像素"
          @upload-success="handleAvatarUpload"
        />
        <div class="avatar-tips">
          <p>头像上传要求:</p>
          <ul>
            <li>正方形图片</li>
            <li>建议尺寸: 200×200</li>
            <li>最大文件: 2MB</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 产品图片上传演示 -->
    <sdkwork-popup v-model:show="showProductImage" position="center" title="产品图片上传" :width="550">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="productImages"
          :multiple="true"
          :auto-upload="true"
          :max-count="5"
          :max-size="10 * 1024 * 1024"
          title="产品图片上传"
          subtitle="最多5张产品图片"
          @upload-success="handleProductImageUpload"
        />
        <div class="product-tips">
          <p>产品图片要求:</p>
          <ul>
            <li>支持多角度展示</li>
            <li>建议尺寸: 800×600以上</li>
            <li>清晰度高，背景简洁</li>
          </ul>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 相册批量上传演示 -->
    <sdkwork-popup v-model:show="showAlbumUpload" position="center" title="相册批量上传" :width="600">
      <div class="popup-content">
        <sdkwork-uploader-image
          v-model="albumImages"
          :multiple="true"
          :auto-upload="true"
          :max-count="20"
          :max-size="20 * 1024 * 1024"
          title="相册批量上传"
          subtitle="最多20张图片，支持批量操作"
          @upload-complete="handleAlbumUploadComplete"
        />
        <div class="album-info" v-if="albumImages.length > 0">
          <p>已选择 {{ albumImages.length }} 张图片</p>
          <p>支持批量上传和管理</p>
        </div>
      </div>
    </sdkwork-popup>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import SdkworkPopup from '@/components/sdkwork-popup/sdkwork-popup.vue'
import SdkworkUploaderImage from '@/components/sdkwork-uploader-image/sdkwork-uploader-image.vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'

// 弹窗显示状态
const showSingleImage = ref(false)
const showMultiImage = ref(false)
const showPreviewDemo = ref(false)
const showSizeDetection = ref(false)
const showQualityCompress = ref(false)
const showDimensionLimit = ref(false)
const showGridLayout = ref(false)
const showCustomFormat = ref(false)
const showAvatarUpload = ref(false)
const showProductImage = ref(false)
const showAlbumUpload = ref(false)

// 图片数据
const singleImages = ref<File[]>([])
const multiImages = ref<File[]>([])
const previewImages = ref<File[]>([])
const sizeDetectionImages = ref<File[]>([])
const qualityImages = ref<File[]>([])
const dimensionLimitImages = ref<File[]>([])
const gridImages = ref<File[]>([])
const customFormatImages = ref<File[]>([])
const avatarImages = ref<File[]>([])
const productImages = ref<File[]>([])
const albumImages = ref<File[]>([])

// 尺寸数据
const dimensionData = ref<Array<{fileName: string, width: number, height: number}>>([])

// 事件处理函数
const handleImageUploadSuccess = (file: File, response: any) => {
  showToast(`图片上传成功: ${file.name}`)
  console.log('图片上传响应:', response)
}

const handleImagePreview = (file: File, previewUrl: string) => {
  console.log('图片预览:', file.name, previewUrl)
  showToast(`生成预览: ${file.name}`)
}

const handleImageDimensions = (file: File, previewUrl: string) => {
  // 这里可以获取图片的实际尺寸
  console.log('图片尺寸检测:', file.name)
}

const handleQualityCompress = (file: File, response: any) => {
  showToast(`质量压缩完成: ${file.name}`)
}

const handleDimensionLimitError = (file: File, error: Error) => {
  showToast(`图片尺寸超出限制: ${file.name}`)
}

const handleAvatarUpload = (file: File, response: any) => {
  showToast(`头像上传成功: ${file.name}`)
}

const handleProductImageUpload = (file: File, response: any) => {
  showToast(`产品图片上传成功: ${file.name}`)
}

const handleAlbumUploadComplete = (files: File[]) => {
  showToast(`相册上传完成: ${files.length} 张图片`)
}

// 文件大小格式化
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 页面加载事件处理
const handlePageLoad = () => {
  console.log('图片上传演示页面加载完成')
}
</script>

<style scoped lang="scss">
.image-upload-demo-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
}

.demo-content {
  padding: 16px;
}

.popup-content {
  padding: 20px;
  
  .image-info {
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
  .dimension-info,
  .quality-info,
  .format-info,
  .avatar-tips,
  .product-tips,
  .album-info {
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
  
  .grid-info {
    margin-top: 16px;
    padding: 12px;
    background-color: #e7f3ff;
    border-radius: 8px;
    border-left: 4px solid #1890ff;
    
    p {
      margin: 4px 0;
      color: #1890ff;
      font-size: 14px;
    }
  }
}
</style>