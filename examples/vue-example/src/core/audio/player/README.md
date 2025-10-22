# 音频播放器模块

本模块提供了完整的音频播放解决方案，支持文件播放、Blob播放和流式音频播放，并内置了浏览器自动播放策略处理。

## 核心接口

### IAudioPlayer 接口
基础音频播放器接口，支持文件、Blob播放和基本控制：

```typescript
interface IAudioPlayer {
  // 播放音频文件
  playFile(file: File | string): Promise<void>;
  
  // 播放音频Blob
  playBlob(blob: Blob): Promise<void>;
  
  // 暂停播放
  pause(): void;
  
  // 恢复播放
  resume(): void;
  
  // 停止播放
  stop(): void;
  
  // 设置音量 (0-1)
  setVolume(volume: number): void;
  
  // 获取当前音量
  getVolume(): number;
}
```

### IStreamAudioPlayer 接口
流式音频播放器接口，扩展了IAudioPlayer，支持实时音频流：

```typescript
interface IStreamAudioPlayer extends IAudioPlayer {
  // 启动流式播放
  startStream(): Promise<void>;
  
  // 停止流式播放
  stopStream(): void;
  
  // 追加音频数据
  appendAudioData(data: Float32Array | Int16Array | ArrayBuffer): void;
}
```

## 播放器实现

### SdkworkAudioPlayer
基于Web Audio API的标准音频播放器，支持文件、Blob播放和自动播放处理。

### SdkworkStreamAudioPlayer
基于recorder-core的流式音频播放器，支持实时音频流处理和自动播放处理。

## 自动播放处理

### 自动播放状态

```typescript
export enum AutoplayStatus {
  UNKNOWN = 'unknown',              // 状态未知
  ALLOWED = 'allowed',              // 自动播放允许
  ALLOWED_MUTED = 'allowed_muted',  // 仅允许静音自动播放
  DISALLOWED = 'disallowed'         // 不允许自动播放
}

export enum AudioPlayerState {
  IDLE = 'idle',                    // 播放器空闲
  LOADING = 'loading',              // 加载中
  READY = 'ready',                  // 准备就绪
  PLAYING = 'playing',              // 播放中
  PAUSED = 'paused',                // 已暂停
  ENDED = 'ended',                  // 播放结束
  ERROR = 'error',                  // 错误状态
  WAITING_FOR_INTERACTION = 'waiting_for_interaction' // 等待用户交互
}
```

### 自动播放事件

播放器会触发以下自动播放相关事件：

- `onAutoplayBlocked`: 自动播放被浏览器阻止时触发，提供详细的权限结果信息
- `onAutoplayStatusChange`: 自动播放状态发生变化时触发，提供详细的权限结果信息

### 自动播放权限结果

```typescript
interface AutoplayPermissionResult {
  status: AutoplayStatus;           // 自动播放状态
  requiresUserInteraction: boolean; // 是否需要用户交互
  requiresMuted: boolean;           // 是否需要静音播放
  error?: Error;                    // 错误信息（如果有）
}
```

## 使用示例

### 基本使用

```typescript
import { SdkworkAudioPlayer } from './sdkwork_player';

// 创建播放器实例
const player = new SdkworkAudioPlayer();

// 播放音频文件
await player.playFile('/path/to/audio.mp3');

// 设置音量
player.setVolume(0.8);

// 暂停播放
player.pause();

// 恢复播放
player.resume();

// 停止播放
player.stop();
```

### 流式音频播放

```typescript
import { SdkworkStreamAudioPlayer } from './sdkwork_stream_player';

// 创建流式播放器实例
const streamPlayer = new SdkworkStreamAudioPlayer();

// 启动流式播放
await streamPlayer.startStream();

// 追加音频数据
streamPlayer.appendAudioData(audioData);

// 停止流式播放
streamPlayer.stopStream();
```

## 开发者接口

### 自动播放状态检测

```typescript
// 检测当前自动播放状态
const status = await player.detectAutoplaySupport();
console.log('自动播放状态:', status);

// 请求自动播放权限
const result = await player.requestAutoplayPermission();
console.log('权限请求结果:', result);

// 获取当前播放器状态
const state = player.getState();
if (state === AudioPlayerState.WAITING_FOR_INTERACTION) {
  console.log('播放器正在等待用户交互');
}
```

### 手动恢复播放

```typescript
// 在用户交互后手动恢复播放
await player.resumeAfterInteraction();

// 或者使用更通用的恢复方法
await player.resume();
```

### 自动播放被拦截处理示例

### 监听自动播放被阻止事件

```typescript
import { SdkworkAudioPlayer } from './sdkwork_player';

const player = new SdkworkAudioPlayer();

// 监听自动播放被阻止事件
player.emitter.on('onAutoplayBlocked', () => {
  console.log('自动播放被浏览器阻止，需要用户交互');
  
  // 显示播放按钮或提示用户
  const playButton = document.getElementById('play-button');
  playButton.style.display = 'block';
  playButton.textContent = '点击播放';
});

// 监听自动播放状态变化
player.emitter.on('onAutoplayStatusChange', (result: AutoplayPermissionResult) => {
  console.log('自动播放状态变化:', result.status);
  if (result.requiresUserInteraction) {
    console.log('需要用户交互才能播放');
  }
  if (result.requiresMuted) {
    console.log('需要静音播放');
  }
});

// 尝试播放音频
try {
  await player.playFile('/path/to/audio.mp3');
} catch (error) {
  if (player.getState() === AudioPlayerState.WAITING_FOR_INTERACTION) {
    // 显示播放按钮，等待用户点击
    const playButton = document.getElementById('play-button');
    playButton.style.display = 'block';
    playButton.onclick = async () => {
      await player.resumeAfterInteraction();
      playButton.style.display = 'none';
    };
  } else {
    console.error('播放失败:', error);
  }
  if (error.message.includes('autoplay')) {
    // 自动播放被阻止，等待用户交互
    console.log('等待用户点击播放按钮...');
  }
}
```

### 用户交互后恢复播放

```typescript
// 用户点击播放按钮后
playButton.addEventListener('click', async () => {
  try {
    // 隐藏播放按钮
    playButton.style.display = 'none';
    
    // 恢复播放
    await player.resumeAfterInteraction();
    
    console.log('用户交互后播放已恢复');
  } catch (error) {
    console.error('恢复播放失败:', error);
    
    // 重新显示播放按钮
    playButton.style.display = 'block';
    playButton.textContent = '播放失败，点击重试';
  }
});
```

### 完整的自动播放处理组件示例

```vue
<template>
  <div class="audio-player">
    <!-- 音频播放控件 -->
    <div class="controls">
      <button @click="play">播放</button>
      <button @click="pause">暂停</button>
      <button @click="stop">停止</button>
    </div>
    
    <!-- 自动播放被阻止时的提示 -->
    <div v-if="showAutoplayBlocked" class="autoplay-blocked">
      <p>音频播放被浏览器阻止，请点击下方按钮允许播放</p>
      <button @click="resumeAfterInteraction">允许播放</button>
    </div>
    
    <!-- 音量控制 -->
    <div class="volume-control">
      <label>音量:</label>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1" 
        :value="volume" 
        @input="setVolume($event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { SdkworkAudioPlayer } from './sdkwork_player';

const player = new SdkworkAudioPlayer();
const showAutoplayBlocked = ref(false);
const volume = ref(1);

// 监听自动播放事件
const setupAutoplayListeners = () => {
  player.emitter.on('onAutoplayBlocked', () => {
    showAutoplayBlocked.value = true;
  });
  
  player.emitter.on('onAutoplayStatusChange', (status) => {
    console.log('自动播放状态:', status);
    if (status === 'allowed') {
      showAutoplayBlocked.value = false;
    }
  });
};

// 播放音频
const play = async () => {
  try {
    await player.playFile('/path/to/audio.mp3');
    showAutoplayBlocked.value = false;
  } catch (error) {
    if (error.message.includes('autoplay')) {
      showAutoplayBlocked.value = true;
    }
  }
};

// 用户交互后恢复播放
const resumeAfterInteraction = async () => {
  try {
    await player.resumeAfterInteraction();
    showAutoplayBlocked.value = false;
  } catch (error) {
    console.error('恢复播放失败:', error);
  }
};

// 设置音量
const setVolume = (newVolume) => {
  volume.value = newVolume;
  player.setVolume(newVolume);
};

// 暂停播放
const pause = () => {
  player.pause();
};

// 停止播放
const stop = () => {
  player.stop();
};

onMounted(() => {
  setupAutoplayListeners();
});

onUnmounted(() => {
  player.destroy();
});
</script>

<style scoped>
.autoplay-blocked {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.autoplay-blocked button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.autoplay-blocked button:hover {
  background-color: #0056b3;
}
</style>
```

## API 参考

### SdkworkAudioPlayer

#### 构造函数
```typescript
constructor(options?: AudioPlayerOptions)
```

#### 方法
- `playFile(file: File | string): Promise<void>` - 播放音频文件
- `playBlob(blob: Blob): Promise<void>` - 播放音频Blob
- `pause(): void` - 暂停播放
- `resume(): void` - 恢复播放
- `stop(): void` - 停止播放
- `setVolume(volume: number): void` - 设置音量 (0-1)
- `getVolume(): number` - 获取当前音量
- `destroy(): void` - 销毁播放器实例
- `resumeAfterInteraction(): Promise<void>` - 用户交互后恢复播放
- `requestAutoplayPermission(): Promise<AutoplayPermissionResult>` - 请求自动播放权限

### SdkworkStreamAudioPlayer

#### 构造函数
```typescript
constructor(options?: AudioPlayerOptions)
```

#### 方法
- `startStream(): Promise<void>` - 启动流式播放
- `stopStream(): void` - 停止流式播放
- `appendAudioData(data: Float32Array | Int16Array | ArrayBuffer): void` - 追加音频数据
- (继承自SdkworkAudioPlayer的所有方法)

## 事件系统

播放器使用mitt事件库，支持以下事件：

### 播放事件
- `onPlay` - 播放开始
- `onPause` - 播放暂停
- `onStop` - 播放停止
- `onEnd` - 播放结束
- `onError` - 播放错误

### 自动播放事件
- `onAutoplayBlocked` - 自动播放被阻止
- `onAutoplayStatusChange` - 自动播放状态变化

### 状态事件
- `onStateChange` - 播放器状态变化
- `onVolumeChange` - 音量变化

## 浏览器兼容性

- 支持所有现代浏览器 (Chrome, Firefox, Safari, Edge)
- 自动处理浏览器自动播放策略
- 支持移动端浏览器

## 注意事项

1. **自动播放策略**: 现代浏览器要求用户交互后才能自动播放音频
2. **用户交互**: 必须在用户手势（点击、触摸等）后触发播放
3. **错误处理**: 始终处理播放错误，特别是自动播放相关的错误
4. **资源清理**: 使用完成后调用destroy()方法清理资源

## 故障排除

### 常见问题

1. **自动播放被阻止**
   - 确保在用户交互后调用resumeAfterInteraction()
   - 检查浏览器控制台是否有相关错误信息

2. **播放没有声音**
   - 检查音量设置
   - 确认音频文件格式支持
   - 验证音频数据是否正确

3. **流式播放中断**
   - 检查网络连接
   - 确认音频数据追加频率和格式

### 调试建议

```javascript
// 启用详细日志
localStorage.debug = 'sdkwork-audio-player:*';

// 监听所有事件
player.emitter.on('*', (event, data) => {
  console.log('事件:', event, data);
});
```

## 更新日志

### v1.0.0
- 初始版本发布
- 支持文件、Blob播放
- 支持流式音频播放
- 内置浏览器自动播放处理
- 完整的事件系统

## 许可证

MIT License