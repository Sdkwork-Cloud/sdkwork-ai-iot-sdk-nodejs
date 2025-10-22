# SDKWork Audio Recorder 组件

一个功能完整的音频录制组件，支持实时录制、波形显示、录音管理等功能。

## 功能特性

- 🎤 **音频录制**：支持PCM格式音频录制
- 📊 **波形显示**：实时音频波形可视化
- ⏱️ **计时器**：精确的录制时长显示
- 📱 **移动端优化**：响应式设计，支持移动设备
- 🌙 **主题支持**：亮色/暗色主题切换
- 💾 **录音管理**：录音记录保存、播放、删除
- ⚡ **实时录制**：支持实时音频流处理
- 🔧 **配置灵活**：丰富的录制参数配置

## 安装与使用

### 基本使用

```vue
<template>
  <sdkwork-audio-recorder 
    :config="recorderConfig"
    @record-complete="handleRecordComplete"
    @record-error="handleRecordError"
  />
</template>

<script setup>
import { ref } from 'vue'

const recorderConfig = ref({
  sampleRate: 16000,
  format: 'pcm',
  enableWave: true,
  realtime: false,
  maxDuration: 300 // 最大录制5分钟
})

const handleRecordComplete = (record) => {
  console.log('录制完成:', record)
}

const handleRecordError = (error) => {
  console.error('录制错误:', error)
}
</script>
```

## Props 配置

### 基础配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| config | RecorderConfig | 见下文 | 录制器配置 |
| api | ApiConfig | {} | API配置 |
| showRecordList | boolean | true | 是否显示录音列表 |
| showSubtitle | boolean | true | 是否显示字幕 |
| waveWidth | number | 400 | 波形显示宽度 |
| waveHeight | number | 120 | 波形显示高度 |
| waveLineColor | string | '#409EFF' | 波形线条颜色 |
| containerClass | string | '' | 容器类名 |
| themeMode | 'light'\|'dark'\|'auto' | 'auto' | 主题模式 |
| mobileOptimized | boolean | true | 是否启用移动端优化 |
| showSettingButton | boolean | true | 是否显示设置按钮 |
| showBackButton | boolean | false | 是否显示返回按钮 |
| onBack | Function | - | 返回按钮点击事件 |

### RecorderConfig 配置

```typescript
interface RecorderConfig {
  sampleRate: number      // 采样率，默认16000
  format: 'pcm'           // 音频格式
  enableWave: boolean     // 是否启用波形显示
  realtime: boolean       // 是否实时录制
  recordToFile: boolean   // 是否录制到文件
  maxDuration: number     // 最大录制时长（秒），0表示无限制
  autoSendInterval: number // 自动发送间隔
}
```

## Events 事件

### 录制控制事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| start | - | 开始录制 |
| pause | - | 暂停录制 |
| resume | - | 恢复录制 |
| stop | - | 停止录制 |
| cancel | - | 取消录制 |

### 录制结果事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| record-complete | AudioRecord | 录制完成 |
| record-error | Error | 录制错误 |

### 录音记录操作事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| record-save | { AudioRecord, title } | 保存录音 |
| record-save-cancel | AudioRecord | 取消保存 |
| record-click | AudioRecord | 点击录音 |
| record-play | AudioRecord | 播放录音 |
| record-pause | AudioRecord | 暂停播放 |
| record-download | AudioRecord | 下载录音 |
| record-delete | AudioRecord | 删除录音 |
| record-remove | AudioRecord | 移除录音 |
| record-clear | - | 清空录音 |

### 配置更新事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:config | RecorderConfig | 配置更新 |

### UI 控制事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| back | - | 返回按钮点击 |
| show-record-list | - | 显示录音列表 |
| setting-click | - | 设置按钮点击 |

## Store 状态管理

组件使用 Pinia Store 进行状态管理，可通过 `useRecorderStore()` 访问。

### Store 状态

```typescript
interface RecorderStoreState {
  config: RecorderConfig           // 当前配置
  currentState: RecordState        // 当前状态
  currentDuration: number          // 当前录制时长
  currentRecord: AudioRecord \| null // 当前录音
  records: AudioRecord[]           // 录音记录列表
  errorMessage: string             // 错误信息
  settingDialogVisible: boolean   // 设置对话框可见性
  recordListDialogVisible: boolean // 录音列表对话框可见性
  saveDialogVisible: boolean       // 保存对话框可见性
  cancelConfirmVisible: boolean    // 取消确认对话框可见性
  currentPlayingRecordId: string \| null // 当前播放录音ID
  isPlaying: boolean              // 是否正在播放
  currentTime: number              // 当前播放时间
  totalDuration: number            // 总播放时长
}
```

### 录制状态枚举

```typescript
enum RecordState {
  IDLE = 'idle',           // 空闲
  INITIALIZING = 'initializing', // 初始化中
  RECORDING = 'recording', // 录制中
  PAUSED = 'paused',       // 已暂停
  PROCESSING = 'processing', // 处理中
  STOPPED = 'stopped',     // 已停止
  ERROR = 'error'          // 错误
}
```

### Store Actions

| 方法名 | 参数 | 说明 |
|--------|------|------|
| startRecording | - | 开始录制 |
| pauseRecording | - | 暂停录制 |
| resumeRecording | - | 恢复录制 |
| stopRecording | - | 停止录制 |
| cancelRecording | - | 取消录制 |
| updateConfig | Partial<RecorderConfig> | 更新配置 |
| resetConfig | - | 重置配置 |
| playRecord | AudioRecord | 播放录音 |
| pausePlayback | - | 暂停播放 |
| stopPlayback | - | 停止播放 |
| addRecord | AudioRecord | 添加录音记录 |
| removeRecord | string | 删除录音记录 |
| clearRecords | - | 清空录音记录 |

### Store Getters

| Getter名 | 返回值 | 说明 |
|----------|--------|------|
| isIdle | boolean | 是否空闲状态 |
| isRecording | boolean | 是否正在录制 |
| isPaused | boolean | 是否已暂停 |
| isProcessing | boolean | 是否处理中 |
| isError | boolean | 是否错误状态 |
| latestRecord | AudioRecord \| null | 最新录音 |
| recordCount | number | 录音数量 |
| hasRecords | boolean | 是否有录音 |
| isRealtimeEnabled | boolean | 是否启用实时录制 |
| isWaveEnabled | boolean | 是否启用波形显示 |
| isRecordToFile | boolean | 是否录制到文件 |
| currentPlayingRecord | AudioRecord \| null | 当前播放录音 |
| progressPercentage | number | 播放进度百分比 |

## 自定义插槽

### 默认插槽

```vue
<sdkwork-audio-recorder>
  <!-- 自定义内容 -->
  <div class="custom-content">
    自定义录制界面内容
  </div>
</sdkwork-audio-recorder>
```

### 波形显示插槽

```vue
<sdkwork-audio-recorder>
  <template #wave>
    <!-- 自定义波形显示组件 -->
    <custom-wave-display />
  </template>
</sdkwork-audio-recorder>
```

### 提示信息插槽

```vue
<sdkwork-audio-recorder>
  <template #hint>
    <!-- 自定义录制提示信息 -->
    <div class="custom-hints">
      自定义录制提示
    </div>
  </template>
</sdkwork-audio-recorder>
```

## 样式定制

### CSS 类名

组件提供以下CSS类名用于样式定制：

- `.sdkwork-audio-recorder` - 主容器
- `.sdkwork-recorder--light` - 亮色主题
- `.sdkwork-recorder--dark` - 暗色主题
- `.sdkwork-recorder--mobile` - 移动端样式
- `.state-{state}` - 状态相关样式

### 主题定制

```css
/* 自定义主题 */
.sdkwork-audio-recorder {
  --primary-color: #007bff;
  --background-color: #f8f9fa;
  --text-color: #212529;
}

.sdkwork-recorder--dark {
  --primary-color: #0d6efd;
  --background-color: #212529;
  --text-color: #f8f9fa;
}
```

## 高级用法

### 实时录制模式

```vue
<template>
  <sdkwork-audio-recorder 
    :config="{
      sampleRate: 16000,
      format: 'pcm',
      realtime: true,
      enableWave: true
    }"
    @record-complete="handleRealtimeRecord"
  />
</template>

<script setup>
const handleRealtimeRecord = (record) => {
  // 处理实时录制的音频数据
  console.log('实时录制数据:', record.data)
}
</script>
```

### 集成外部API

```vue
<template>
  <sdkwork-audio-recorder 
    :api="apiConfig"
    @record-complete="uploadToAPI"
  />
</template>

<script setup>
const apiConfig = {
  uploadUrl: '/api/audio/upload',
  headers: {
    'Authorization': 'Bearer token'
  }
}

const uploadToAPI = async (record) => {
  try {
    const formData = new FormData()
    formData.append('audio', new Blob([record.data]))
    
    const response = await fetch(apiConfig.uploadUrl, {
      method: 'POST',
      headers: apiConfig.headers,
      body: formData
    })
    
    if (response.ok) {
      console.log('上传成功')
    }
  } catch (error) {
    console.error('上传失败:', error)
  }
}
</script>
```

## 错误处理

### 错误类型

组件可能抛出以下错误：

- **权限错误**：麦克风访问权限被拒绝
- **设备错误**：音频设备不可用
- **格式错误**：不支持的音频格式
- **超时错误**：录制超时
- **网络错误**：API调用失败

### 错误处理示例

```vue
<template>
  <sdkwork-audio-recorder 
    @record-error="handleRecordError"
  />
  
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const errorMessage = ref('')

const handleRecordError = (error) => {
  errorMessage.value = error.message
  
  // 根据错误类型进行不同处理
  if (error.name === 'NotAllowedError') {
    console.error('麦克风权限被拒绝')
  } else if (error.name === 'NotFoundError') {
    console.error('未找到音频设备')
  }
  
  // 3秒后清除错误信息
  setTimeout(() => {
    errorMessage.value = ''
  }, 3000)
}
</script>
```

## 移动端适配

### 安全区域支持

组件自动处理移动端安全区域：

```css
/* 自动添加安全区域间距 */
.sdkwork-audio-recorder {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### 触摸优化

- 支持双击添加标记
- 优化的触摸反馈
- 手势操作支持

## 性能优化

### 内存管理

- 自动清理录音记录（最多保存50条）
- 计时器自动销毁
- 音频资源自动释放

### 录制优化

- 支持暂停/恢复录制
- 实时波形显示性能优化
- 音频数据流式处理

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 注意事项

1. **HTTPS要求**：在移动端需要HTTPS环境才能访问麦克风
2. **用户授权**：首次使用需要用户授权麦克风权限
3. **移动端限制**：部分移动浏览器有录制时长限制
4. **文件大小**：长时间录制可能产生较大文件

## 更新日志

### v1.0.0
- 初始版本发布
- 基础录制功能
- 波形显示支持
- 录音管理功能

## 技术支持

如有问题或建议，请联系技术支持团队。