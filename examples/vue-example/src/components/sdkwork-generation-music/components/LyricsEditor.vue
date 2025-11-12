<template>
  <div class="lyrics-editor">
    <div class="editor-header">
      <h4>歌词编辑</h4>
      <div class="char-count">{{ charCount }}/{{ maxLength }}</div>
    </div>
    
    <van-field
      v-model="inputValue"
      type="textarea"
      placeholder="请输入歌词内容，支持多行输入..."
      :maxlength="maxLength"
      :rows="5"
      autosize
      show-word-limit
      class="lyrics-field"
    />
    
    <!-- 歌词格式提示 -->
    <div class="format-tips">
      <van-icon name="info-o" class="tip-icon" />
      <span class="tip-text">支持分段输入，每段歌词会生成对应的音乐段落</span>
    </div>
    
    <!-- 歌词模板 -->
    <div class="lyrics-templates" v-if="templates.length > 0">
      <h5>歌词模板</h5>
      <div class="template-list">
        <van-tag 
          v-for="template in templates" 
          :key="template.name"
          type="primary" 
          size="medium"
          @click="applyTemplate(template)"
          class="template-tag"
        >
          {{ template.name }}
        </van-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const maxLength = 1000

// 使用本地ref管理输入状态
const inputValue = ref(props.modelValue)

// 监听外部变化更新本地状态
watch(() => props.modelValue, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue
  }
}, { immediate: true })

// 监听本地变化并触发事件
watch(inputValue, (newValue) => {
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
  }
})

// 歌词模板
const templates = ref([
  {
    name: '流行歌曲模板',
    content: `[主歌]
Verse 1
Verse 2

[副歌]
Chorus 1
Chorus 2

[桥段]
Bridge

[尾奏]`
  },
  {
    name: '民谣模板',
    content: `[引子]
Intro

[主歌]
Verse 1
Verse 2

[副歌]
Chorus

[尾声]`
  },
  {
    name: '电子音乐模板',
    content: `[Intro]
[Build up]
[Drop]
[Breakdown]
[Outro]`
  }
])

// 字符计数
const charCount = computed(() => inputValue.value.length)

// 应用模板
const applyTemplate = (template: any) => {
  if (inputValue.value) {
    inputValue.value += '\n\n' + template.content
  } else {
    inputValue.value = template.content
  }
}
</script>

<style scoped>
.lyrics-editor {
  background: var(--bg-card);
  border-radius: 8px; 
  margin-bottom: 16px;
  border: 1px solid var(--border-color); 
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.editor-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.char-count {
  color: var(--text-secondary);
  font-size: 12px;
}

.lyrics-field {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-bottom: 16px;
}

.format-tips {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(0, 123, 255, 0.1);
  border: 1px solid rgba(0, 123, 255, 0.2);
  border-radius: 6px;
  margin-bottom: 16px;
}

.tip-icon {
  margin-right: 8px;
  color: var(--accent-blue);
  font-size: 14px;
}

.tip-text {
  color: var(--accent-blue);
  font-size: 12px;
  line-height: 1.4;
}

.lyrics-templates {
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.lyrics-templates h5 {
  margin: 0 0 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.template-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-tag {
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.template-tag:hover {
  background-color: var(--accent-blue);
  color: white;
}

:deep(.van-field__word-limit) {
  color: var(--text-secondary);
}

:deep(.van-field__body) {
  min-height: 100px;
}

:deep(.van-field__control) {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}
</style>