<template>
  <div class="song-input">
    <div class="input-header">
      <h4>歌曲信息</h4>
      <div class="char-count">{{ charCount }}/{{ maxLength }}</div>
    </div>
    
    <van-field
      v-model="inputValue"
      type="textarea"
      placeholder="请输入歌曲标题或描述，如：一首轻快的流行歌曲"
      :maxlength="maxLength"
      :rows="3"
      autosize
      show-word-limit
      class="song-field"
    />
    <!-- 歌曲建议 -->
    <div class="song-suggestions" v-if="suggestions.length > 0">
      <h5>歌曲类型建议</h5>
      <div class="suggestion-list">
        <van-tag 
          v-for="suggestion in suggestions" 
          :key="suggestion"
          type="primary" 
          size="medium"
          @click="applySuggestion(suggestion)"
          class="suggestion-tag"
        >
          {{ suggestion }}
        </van-tag>
      </div>
    </div>
    <!-- 底部操作栏 -->
    <div class="input-footer">
      <!-- 配置按钮和配置面板 -->
      <van-button 
        type="default" 
        size="small" 
        @click="$emit('showConfig')"
        class="config-btn"
      >
        <van-icon name="setting-o" />
        配置
      </van-button>
      
      <!-- 歌词开关 -->
      <div class="lyrics-toggle">
        <van-switch 
          v-model="lyricsEnabled" 
          size="20"
        />
        <span class="toggle-label">歌词</span>
      </div>
    </div>
    
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: string
  showLyrics?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'toggleLyrics', value: boolean): void
  (e: 'showConfig'): void
}

const props = withDefaults(defineProps<Props>(), {
  showLyrics: false
})
const emit = defineEmits<Emits>()

const maxLength = 200

// 使用计算属性处理输入值
const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 使用本地ref管理switch状态
const lyricsEnabled = ref(props.showLyrics)

// 监听外部变化更新本地状态
watch(() => props.showLyrics, (newValue) => {
  if (newValue !== lyricsEnabled.value) {
    lyricsEnabled.value = newValue
  }
}, { immediate: true })

// 监听本地变化并触发事件
watch(lyricsEnabled, (newValue) => {
  if (newValue !== props.showLyrics) {
    emit('toggleLyrics', newValue)
  }
})

// 歌曲建议
const suggestions = ref([
  '一首轻快的流行歌曲',
  '浪漫的钢琴曲',
  '动感的电子音乐',
  '治愈的民谣歌曲',
  '激情的摇滚音乐',
  '宁静的古典音乐'
])

// 字符计数
const charCount = computed(() => inputValue.value.length)

// 应用建议
const applySuggestion = (suggestion: string) => {
  if (inputValue.value) {
    inputValue.value += ', ' + suggestion
  } else {
    inputValue.value = suggestion
  }
}
</script>

<style scoped>
.song-input {
  background: var(--bg-card);
  border-radius: 8px; 
  margin-bottom: 16px;
  border: 1px solid var(--border-color); 
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.input-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.char-count {
  color: var(--text-secondary);
  font-size: 12px;
}

.song-field {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-bottom: 16px;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.config-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
}

.config-btn .van-icon {
  margin-right: 4px;
  font-size: 14px;
}

.lyrics-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.song-suggestions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.song-suggestions h5 {
  margin: 0 0 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-tag {
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.suggestion-tag:hover {
  background-color: var(--accent-blue);
  color: white;
}

:deep(.van-field__word-limit) {
  color: var(--text-secondary);
}

:deep(.van-field__body) {
  min-height: 60px;
}

:deep(.van-field__control) {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary);
}
 
</style>