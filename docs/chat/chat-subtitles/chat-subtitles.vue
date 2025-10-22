<template>
  <div class="chat-subtitles" v-if="showSubtitles">
    <!-- 实时歌词字幕 -->
    <div class="lyrics-display">
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
    <div class="lyrics-scroll-area">
      <div class="lyrics-list">
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
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  showSubtitles: boolean
  conversationTexts: Array<{ speaker: string; text: string; time: string }>
}

const props = defineProps<Props>()

const currentSubtitle = ref('')
const currentSpeaker = ref('')
const subtitleIndex = ref(0)

// 实时字幕更新
const updateSubtitles = () => {
  if (props.showSubtitles && props.conversationTexts.length > 0) {
    if (subtitleIndex.value < props.conversationTexts.length) {
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
    height: 120px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    
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
      width: 95%;
      max-width: 95%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .speaker-info {
        font-size: 16px;
        color: #FFD700;
        font-weight: 500;
        margin-bottom: 8px;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
      }
      
      .lyric-text {
        font-size: 20px;
        text-align: center;
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
      width: 400px;
      max-width: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }
  }
  
  .lyrics-scroll-area {
    max-height: 540px;
    height: 540px;
    overflow-y: auto;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    .lyrics-list {
      .lyric-item {
        padding: 12px 16px;
        margin-bottom: 8px;
        border-radius: 8px;
        transition: all 0.3s ease;
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
          transform: scale(1.02);
          
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