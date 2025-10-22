<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
  >
    <!-- 页面头部 -->
    <template #header>
      <sdkwork-navbar
        title="通用文件上传组件演示"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
      />
    </template>

    <!-- 演示内容区域 -->
    <div class="demo-content">
      <sdkwork-cell-group title="基础功能演示">
        <sdkwork-cell title="单文件上传" is-link @click="showSingleUpload = true" />
        <sdkwork-cell title="多文件上传" is-link @click="showMultiUpload = true" />
        <sdkwork-cell title="拖拽上传" is-link @click="showDragUpload = true" />
        <sdkwork-cell title="手动上传" is-link @click="showManualUpload = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="高级功能演示">
        <sdkwork-cell title="文件大小限制" is-link @click="showSizeLimit = true" />
        <sdkwork-cell title="文件数量限制" is-link @click="showCountLimit = true" />
        <sdkwork-cell title="自定义文件类型" is-link @click="showCustomType = true" />
        <sdkwork-cell title="禁用状态" is-link @click="showDisabled = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="事件监听演示">
        <sdkwork-cell title="上传进度监听" is-link @click="showProgressDemo = true" />
        <sdkwork-cell title="上传状态监听" is-link @click="showStatusDemo = true" />
        <sdkwork-cell title="文件操作监听" is-link @click="showFileOpsDemo = true" />
      </sdkwork-cell-group>
    </div>

    <!-- 单文件上传演示 -->
    <sdkwork-popup v-model:show="showSingleUpload" position="center" title="单文件上传" :width="400">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="singleFiles"
          :multiple="false"
          :auto-upload="true"
          title="选择单个文件"
          subtitle="支持所有文件类型"
          @upload-success="handleSingleUploadSuccess"
          @upload-error="handleUploadError"
        />
        <div v-if="singleFiles.length > 0" class="file-info">
          <p>已选择文件: {{ singleFiles.length }} 个</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 多文件上传演示 -->
    <sdkwork-popup v-model:show="showMultiUpload" position="center" title="多文件上传" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="multiFiles"
          :multiple="true"
          :auto-upload="true"
          :max-count="5"
          title="选择多个文件"
          subtitle="最多选择5个文件"
          @upload-success="handleMultiUploadSuccess"
          @upload-error="handleUploadError"
        />
        <div v-if="multiFiles.length > 0" class="file-info">
          <p>已选择文件: {{ multiFiles.length }} 个</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 拖拽上传演示 -->
    <sdkwork-popup v-model:show="showDragUpload" position="center" title="拖拽上传" :width="450">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="dragFiles"
          :multiple="true"
          :auto-upload="true"
          title="拖拽文件到此处"
          subtitle="支持拖拽上传文件"
          @file-add="handleFileAdd"
        />
      </div>
    </sdkwork-popup>

    <!-- 手动上传演示 -->
    <sdkwork-popup v-model:show="showManualUpload" position="center" title="手动上传" :width="480">
      <div class="popup-content">
        <sdkwork-uploader-file
          ref="manualUploaderRef"
          v-model="manualFiles"
          :multiple="true"
          :auto-upload="false"
          title="手动控制上传"
          subtitle="选择文件后手动触发上传"
        />
        <div class="upload-actions" v-if="manualFiles.length > 0">
          <van-button type="primary" block @click="startManualUpload">开始上传</van-button>
          <van-button type="default" block @click="clearManualFiles">清空文件</van-button>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 文件大小限制演示 -->
    <sdkwork-popup v-model:show="showSizeLimit" position="center" title="文件大小限制" :width="450">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="sizeLimitFiles"
          :multiple="true"
          :auto-upload="true"
          :max-size="10 * 1024 * 1024"
          title="文件大小限制"
          subtitle="最大文件大小: 10MB"
          @upload-error="handleSizeLimitError"
        />
      </div>
    </sdkwork-popup>

    <!-- 文件数量限制演示 -->
    <sdkwork-popup v-model:show="showCountLimit" position="center" title="文件数量限制" :width="450">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="countLimitFiles"
          :multiple="true"
          :auto-upload="true"
          :max-count="3"
          title="文件数量限制"
          subtitle="最多上传3个文件"
        />
      </div>
    </sdkwork-popup>

    <!-- 自定义文件类型演示 -->
    <sdkwork-popup v-model:show="showCustomType" position="center" title="自定义文件类型" :width="450">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="customTypeFiles"
          :multiple="true"
          :auto-upload="true"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          title="文档文件上传"
          subtitle="仅支持PDF、Word、Excel文档"
        />
      </div>
    </sdkwork-popup>

    <!-- 禁用状态演示 -->
    <sdkwork-popup v-model:show="showDisabled" position="center" title="禁用状态" :width="400">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="disabledFiles"
          :multiple="true"
          :auto-upload="true"
          :disabled="true"
          title="禁用状态"
          subtitle="上传组件已被禁用"
        />
        <van-button type="primary" block @click="toggleDisabled">切换禁用状态</van-button>
      </div>
    </sdkwork-popup>

    <!-- 上传进度监听演示 -->
    <sdkwork-popup v-model:show="showProgressDemo" position="center" title="上传进度监听" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="progressFiles"
          :multiple="true"
          :auto-upload="true"
          title="进度监听演示"
          @upload-progress="handleUploadProgress"
        />
        <div class="progress-info" v-if="progressData.length > 0">
          <h4>上传进度:</h4>
          <div v-for="item in progressData" :key="item.fileName" class="progress-item">
            <span>{{ item.fileName }}</span>
            <span>{{ item.progress }}%</span>
          </div>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 上传状态监听演示 -->
    <sdkwork-popup v-model:show="showStatusDemo" position="center" title="上传状态监听" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="statusFiles"
          :multiple="true"
          :auto-upload="true"
          title="状态监听演示"
          @upload-start="handleUploadStart"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
          @upload-complete="handleUploadComplete"
        />
        <div class="status-info">
          <h4>上传状态:</h4>
          <p>{{ uploadStatus }}</p>
        </div>
      </div>
    </sdkwork-popup>

    <!-- 文件操作监听演示 -->
    <sdkwork-popup v-model:show="showFileOpsDemo" position="center" title="文件操作监听" :width="500">
      <div class="popup-content">
        <sdkwork-uploader-file
          v-model="fileOpsFiles"
          :multiple="true"
          :auto-upload="true"
          title="文件操作监听"
          @file-add="handleFileAdd"
          @file-remove="handleFileRemove"
          @file-clear="handleFileClear"
        />
        <div class="ops-info">
          <h4>操作记录:</h4>
          <div v-for="(log, index) in operationLogs" :key="index" class="log-item">
            {{ log }}
          </div>
        </div>
      </div>
    </sdkwork-popup>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import SdkworkPopup from '@/components/sdkwork-popup/sdkwork-popup.vue'
import SdkworkUploaderFile from '@/components/sdkwork-uploader-file/sdkwork-uploader-file.vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'

// 弹窗显示状态
const showSingleUpload = ref(false)
const showMultiUpload = ref(false)
const showDragUpload = ref(false)
const showManualUpload = ref(false)
const showSizeLimit = ref(false)
const showCountLimit = ref(false)
const showCustomType = ref(false)
const showDisabled = ref(false)
const showProgressDemo = ref(false)
const showStatusDemo = ref(false)
const showFileOpsDemo = ref(false)

// 文件数据
const singleFiles = ref<File[]>([])
const multiFiles = ref<File[]>([])
const dragFiles = ref<File[]>([])
const manualFiles = ref<File[]>([])
const sizeLimitFiles = ref<File[]>([])
const countLimitFiles = ref<File[]>([])
const customTypeFiles = ref<File[]>([])
const disabledFiles = ref<File[]>([])
const progressFiles = ref<File[]>([])
const statusFiles = ref<File[]>([])
const fileOpsFiles = ref<File[]>([])

// 手动上传引用
const manualUploaderRef = ref<InstanceType<typeof SdkworkUploaderFile>>()

// 进度数据
const progressData = ref<Array<{fileName: string, progress: number}>>([])

// 上传状态
const uploadStatus = ref('等待上传')

// 操作日志
const operationLogs = ref<string[]>([])

// 事件处理函数
const handleSingleUploadSuccess = (file: File, response: any) => {
  showToast(`单文件上传成功: ${file.name}`)
  console.log('上传响应:', response)
}

const handleMultiUploadSuccess = (file: File, response: any) => {
  showToast(`多文件上传成功: ${file.name}`)
}

const handleUploadError = (file: File, error: Error) => {
  showToast(`上传失败: ${file.name}`)
  console.error('上传错误:', error)
}

const handleSizeLimitError = (file: File, error: Error) => {
  showToast(`文件过大: ${file.name}`)
}

const handleFileAdd = (files: File[]) => {
  showToast(`添加了 ${files.length} 个文件`)
}

const handleUploadProgress = (file: File, progress: number) => {
  const existingIndex = progressData.value.findIndex(item => item.fileName === file.name)
  if (existingIndex !== -1) {
    progressData.value[existingIndex].progress = progress
  } else {
    progressData.value.push({ fileName: file.name, progress })
  }
}

const handleUploadStart = (file: File) => {
  uploadStatus.value = `开始上传: ${file.name}`
  operationLogs.value.push(`开始上传: ${file.name}`)
}

const handleUploadSuccess = (file: File, response: any) => {
  uploadStatus.value = `上传成功: ${file.name}`
  operationLogs.value.push(`上传成功: ${file.name}`)
}

const handleUploadComplete = (files: File[]) => {
  uploadStatus.value = '所有文件上传完成'
  operationLogs.value.push('所有文件上传完成')
}

const handleFileRemove = (file: File) => {
  operationLogs.value.push(`移除文件: ${file.name}`)
}

const handleFileClear = () => {
  operationLogs.value.push('清空所有文件')
}

// 手动上传控制
const startManualUpload = () => {
  if (manualUploaderRef.value) {
    manualUploaderRef.value.uploadFiles()
    showToast('开始手动上传')
  }
}

const clearManualFiles = () => {
  if (manualUploaderRef.value) {
    manualUploaderRef.value.clearFiles()
    showToast('已清空文件')
  }
}

// 禁用状态切换
const toggleDisabled = () => {
  // 这里需要实现禁用状态的切换逻辑
  showToast('切换禁用状态')
}

// 页面加载事件处理
const handlePageLoad = () => {
  console.log('文件上传演示页面加载完成')
}
</script>

<style scoped lang="scss">
.file-upload-demo-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
}

.demo-content {
  padding: 16px;
}

.popup-content {
  padding: 20px;
  
  .file-info {
    margin-top: 16px;
    padding: 12px;
    background-color: #f8f9fa;
    border-radius: 8px;
    
    p {
      margin: 0;
      color: #666;
    }
  }
  
  .upload-actions {
    margin-top: 16px;
    display: flex;
    gap: 12px;
    
    .van-button {
      flex: 1;
    }
  }
  
  .progress-info,
  .status-info,
  .ops-info {
    margin-top: 16px;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 8px;
    
    h4 {
      margin: 0 0 8px 0;
      color: #333;
    }
    
    .progress-item {
      display: flex;
      justify-content: space-between;
      margin: 4px 0;
      color: #666;
    }
    
    .log-item {
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