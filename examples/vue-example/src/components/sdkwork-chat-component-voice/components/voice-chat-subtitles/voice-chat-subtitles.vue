<template>
  <div class="chat-subtitles" v-if="showSubtitles" :style="containerStyle">
    <!-- 实时歌词字幕 -->
    <div class="lyrics-display" :style="{ height: displayHeight + 'px' }">
      <div class="current-lyric" v-if="currentSubtitle">
        <div class="speaker-info" v-if="currentSpeaker">
          {{ currentSpeaker }}：
        </div>
        <div class="lyric-text">
          {{ currentSubtitle }}
        </div>
      </div>
      <div class="lyrics-placeholder" v-else>
        等待语音识别...
      </div>
    </div>
    
    <!-- 歌词滚动区域 -->
    <div class="lyrics-scroll-area" v-if="showScrollArea">
      <div class="lyrics-list" ref="scrollAreaRef">
        <div 
          class="lyric-item" 
          v-for="(text, index) in conversationTexts" 
          :key="index"
          :class="{ active: index === subtitleIndex - 1 }"
        >
          <div class="lyric-header">
            <span class="speaker-badge">{{ text.speaker }}</span>
            <span class="lyric-time">{{ text.time }}</span>
          </div>
          <span class="lyric-text">{{ text.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  showSubtitles: boolean
  conversationTexts: Array<{ speaker: string; text: string; time: string }>
  displayHeight?: number
  showScrollArea?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  displayHeight: 0,
  showScrollArea: false
})

const currentSubtitle = ref('')
const currentSpeaker = ref('')
const subtitleIndex = ref(0)
const scrollAreaRef = ref<HTMLDivElement>()
const savedScrollPosition = ref<number>(0)

// 计算容器总高度
const containerStyle = computed(() => {
  const totalHeight = props.displayHeight + (props.showScrollArea ? 540 : 0) + 20 // 20px 为间距
  return {
    height: totalHeight + 'px'
  }
})

// 保存滚动位置到本地变量
const saveScrollPosition = () => {
  if (scrollAreaRef.value) {
    savedScrollPosition.value = scrollAreaRef.value.scrollTop
  }
}

// 恢复滚动位置
const restoreScrollPosition = () => {
  nextTick(() => {
    if (scrollAreaRef.value && savedScrollPosition.value > 0) {
      // 使用 requestAnimationFrame 确保在浏览器重绘后执行
      requestAnimationFrame(() => {
        scrollAreaRef.value!.scrollTop = savedScrollPosition.value
      })
    }
  })
}

// 实时字幕更新
const updateSubtitles = () => {
  if (props.showSubtitles && props.conversationTexts.length > 0) {
    // 如果有滚动区域，保存当前滚动位置
    if (props.showScrollArea) {
      saveScrollPosition()
    }
    
    const wasLastItem = subtitleIndex.value === props.conversationTexts.length - 1
    
    if (subtitleIndex.value < props.conversationTexts.length - 1) {
      const currentText = props.conversationTexts[subtitleIndex.value]
      currentSubtitle.value = currentText.text
      currentSpeaker.value = currentText.speaker
      subtitleIndex.value++
    } else {
      // 循环播放字幕
      subtitleIndex.value = 0
      const currentText = props.conversationTexts[0]
      currentSubtitle.value = currentText.text
      currentSpeaker.value = currentText.speaker
      
      // 如果是最后一个项目且显示滚动区域，重置滚动位置到顶部
      if (wasLastItem && props.showScrollArea) {
        savedScrollPosition.value = 0
      }
    }
    
    // 如果有滚动区域，恢复滚动位置
    if (props.showScrollArea) {
      restoreScrollPosition()
    }
  }
}

let subtitleInterval: number

onMounted(() => {
  // 模拟字幕更新
  subtitleInterval = setInterval(() => {
    updateSubtitles()
  }, 3000)
})

onUnmounted(() => {
  clearInterval(subtitleInterval)
})
</script>

<style scoped lang="scss">
.chat-subtitles {
  position: absolute;
  top: 100px;
  left: 10px;
  right: 10px;
  z-index: 5;
  height: 400px;
  
  .lyrics-display {
    text-align: center;
    margin-bottom: 20px;
    height: 120px; /* 固定高度防止跳动 */
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative; /* 为绝对定位的子元素提供参考 */
    
    .current-lyric {
      font-size: 24px;
      font-weight: 600;
      color: #4CD964;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 2px solid rgba(76, 217, 100, 0.4);
      animation: lyricGlow 2s ease-in-out infinite;
      line-height: 1.4;
      min-height: 80px;
      max-height: 110px; /* 限制最大高度 */
      width: 95%;
      max-width: 95%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 15px 20px; /* 固定内边距 */
      box-sizing: border-box; /* 包含内边距在尺寸内 */
      overflow: hidden; /* 防止内容溢出 */
      
      .speaker-info {
        font-size: 16px;
        color: #FFD700;
        font-weight: 500;
        margin-bottom: 8px;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
        flex-shrink: 0; /* 防止压缩 */
      }
      
      .lyric-text {
        font-size: 20px;
        text-align: center;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 40px; /* 最小高度确保布局稳定 */
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      @keyframes lyricGlow {
        0%, 100% { 
          box-shadow: 0 4px 16px rgba(76, 217, 100, 0.3);
        }
        50% { 
          box-shadow: 0 6px 24px rgba(76, 217, 100, 0.6);
        }
      }
    }
    
    .lyrics-placeholder {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
      padding: 20px;
      min-height: 80px;
      max-height: 110px;
      width: 400px;
      max-width: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      box-sizing: border-box;
    }
  }
  
  .lyrics-scroll-area {
    max-height: 540px;
    height: 540px;
    overflow: hidden; /* 外层容器不滚动 */
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    .lyrics-list {
      height: 100%;
      overflow-y: auto; /* 内层列表滚动 */
      scroll-behavior: smooth; /* 平滑滚动 */
      
      .lyric-item {
        padding: 12px 16px;
        margin-bottom: 8px;
        border-radius: 8px;
        transition: background-color 0.3s ease, border-left 0.3s ease; /* 只对背景和边框应用过渡 */
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-height: 60px;
        
        .lyric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 8px;
          
          .speaker-badge {
            font-size: 12px;
            color: #FFD700;
            background: rgba(255, 215, 0, 0.2);
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 500;
            transition: background-color 0.3s ease, color 0.3s ease; /* 只对颜色应用过渡 */
          }
          
          .lyric-time {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
          }
        }
        
        &:last-child {
          margin-bottom: 0;
        }
        
        &.active {
          background: rgba(76, 217, 100, 0.3);
          border-left: 4px solid #4CD964;
          /* 移除 transform: scale(1.02) 防止布局跳动 */
          
          .speaker-badge {
            background: rgba(76, 217, 100, 0.4);
            color: #4CD964;
          }
          
          .lyric-text {
            color: #4CD964;
            font-weight: 700;
            font-size: 15px;
          }
        }
        
        .lyric-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          flex: 1;
          line-height: 1.4;
          transition: color 0.3s ease, font-weight 0.3s ease; /* 只对颜色和字体粗细应用过渡 */
        }
        
        .lyric-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin-left: 16px;
        }
      }
    }
  }
}
</style>