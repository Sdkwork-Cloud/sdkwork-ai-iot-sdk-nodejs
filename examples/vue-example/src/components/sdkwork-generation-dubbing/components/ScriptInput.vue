<template>
  <div class="script-input">
    <div class="section-header">
      <h4>口播文字</h4>
      <div class="char-count">{{ charCount }}/{{ maxLength }}</div>
    </div>

    <!-- AI生成区域 -->
    <div class="ai-generate-section">
      <div class="ai-input-group">
        <van-field
          v-model="aiKeywords"
          placeholder="输入关键词，让AI帮您生成口播文字..."
          class="ai-input"
          @keyup.enter="generateWithAI"
        >
          <template #button>
            <van-button 
              type="primary" 
              size="small" 
              @click="generateWithAI"
              :loading="isGeneratingAI"
              class="ai-generate-btn"
            >
              AI生成
            </van-button>
          </template>
        </van-field>
      </div>
      
      <!-- AI建议关键词 -->
      <div class="ai-suggestions" v-if="aiSuggestions.length > 0">
        <div class="suggestions-title">热门关键词建议：</div>
        <div class="suggestion-tags">
          <van-tag 
            v-for="suggestion in aiSuggestions" 
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
    </div>

    <!-- 文字输入区域 -->
    <div class="text-input-section">
      <van-field
        v-model="localScript"
        type="textarea"
        :rows="6"
        autosize
        :maxlength="maxLength"
        show-word-limit
        placeholder="请输入口播文字内容，或使用AI生成..."
        class="script-field"
      />
      
      <!-- 文字编辑工具 -->
      <div class="text-tools">
        <van-button 
          size="mini" 
          @click="clearText"
          class="tool-btn"
        >
          <van-icon name="delete" />
          清空
        </van-button>
        
        <van-button 
          size="mini" 
          @click="copyText"
          class="tool-btn"
        >
          <van-icon name="copy" />
          复制
        </van-button>
        
        <van-button 
          size="mini" 
          @click="pasteText"
          class="tool-btn"
        >
          <van-icon name="passed" />
          粘贴
        </van-button>
        
        <div class="tool-spacer"></div>
        
        <van-button 
          size="mini" 
          @click="formatText"
          class="tool-btn"
        >
          <van-icon name="edit" />
          格式化
        </van-button>
      </div>
    </div>

    <!-- 文字分析 -->
    <div class="text-analysis" v-if="charCount > 0">
      <div class="analysis-item">
        <span class="analysis-label">字数：</span>
        <span class="analysis-value">{{ charCount }}</span>
      </div>
      <div class="analysis-item">
        <span class="analysis-label">预计时长：</span>
        <span class="analysis-value">{{ estimatedDuration }}秒</span>
      </div>
      <div class="analysis-item">
        <span class="analysis-label">难度：</span>
        <span class="analysis-value">{{ difficultyLevel }}</span>
      </div>
    </div>

    <!-- 文字模板 -->
    <div class="text-templates">
      <div class="templates-header">
        <span class="templates-title">常用模板</span>
        <van-button 
          size="mini" 
          @click="showTemplates = !showTemplates"
          class="toggle-btn"
        >
          {{ showTemplates ? '收起' : '展开' }}
        </van-button>
      </div>
      
      <div class="templates-list" v-if="showTemplates">
        <div 
          v-for="template in textTemplates" 
          :key="template.id"
          class="template-item"
          @click="applyTemplate(template)"
        >
          <div class="template-title">{{ template.title }}</div>
          <div class="template-preview">{{ template.preview }}</div>
          <div class="template-tags">
            <van-tag 
              v-for="tag in template.tags" 
              :key="tag"  
              type="primary"
            >
              {{ tag }}
            </van-tag>
          </div>
        </div>
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
  (e: 'ai-generate', keywords: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localScript = ref(props.modelValue)
const aiKeywords = ref('')
const isGeneratingAI = ref(false)
const showTemplates = ref(false)
const maxLength = 1000

// AI建议关键词
const aiSuggestions = ref([
  '产品介绍', '知识科普', '情感故事', '商务演讲',
  '教育讲解', '娱乐搞笑', '励志激励', '节日祝福'
])

// 文字模板
const textTemplates = ref([
  {
    id: 'template1',
    title: '产品介绍模板',
    preview: '大家好，今天给大家介绍一款优秀的产品...',
    tags: ['商务', '产品']
  },
  {
    id: 'template2',
    title: '知识科普模板',
    preview: '你知道吗？关于这个话题，其实有很多有趣的知识...',
    tags: ['教育', '科普']
  },
  {
    id: 'template3',
    title: '情感故事模板',
    preview: '曾经有一个故事，让我深深感动...',
    tags: ['情感', '故事']
  },
  {
    id: 'template4',
    title: '节日祝福模板',
    preview: '在这个美好的节日里，我想对大家说...',
    tags: ['节日', '祝福']
  }
])

// 计算属性
const charCount = computed(() => localScript.value.length)

const estimatedDuration = computed(() => {
  // 按平均语速250字/分钟计算
  return Math.ceil(charCount.value / 4.17)
})

const difficultyLevel = computed(() => {
  if (charCount.value === 0) return '--'
  if (charCount.value < 100) return '简单'
  if (charCount.value < 300) return '中等'
  return '复杂'
})

// 方法
const generateWithAI = async () => {
  if (!aiKeywords.value.trim()) {
    console.log('请输入关键词')
    return
  }
  
  isGeneratingAI.value = true
  
  try {
    // 触发AI生成事件
    emit('ai-generate', aiKeywords.value.trim())
    
    // 模拟AI生成延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 清空关键词输入框
    aiKeywords.value = ''
  } catch (error) {
    console.error('AI生成失败:', error)
  } finally {
    isGeneratingAI.value = false
  }
}

const applySuggestion = (suggestion: string) => {
  aiKeywords.value = suggestion
  generateWithAI()
}

const clearText = () => {
  localScript.value = ''
}

const copyText = async () => {
  try {
    await navigator.clipboard.writeText(localScript.value)
    console.log('文字已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
  }
}

const pasteText = async () => {
  try {
    const text = await navigator.clipboard.readText()
    localScript.value += text
  } catch (error) {
    console.error('粘贴失败:', error)
  }
}

const formatText = () => {
  // 简单的文字格式化：去除多余空格和换行
  localScript.value = localScript.value
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()
}

const applyTemplate = (template: any) => {
  localScript.value = template.preview
  showTemplates.value = false
}

// 监听输入变化
watch(localScript, (newValue) => {
  emit('update:modelValue', newValue)
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  localScript.value = newValue
})
</script>

<style scoped>
.script-input {
  background: var(--bg-card);
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid var(--border-color);
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
}

.char-count {
  color: var(--text-secondary);
  font-size: 12px;
}

.ai-generate-section {
  margin-bottom: 16px;
}

.ai-input-group {
  margin-bottom: 12px;
}

:deep(.ai-input .van-field__body) {
  background: var(--bg-secondary);
  border-radius: 6px;
}

.ai-generate-btn {
  background: var(--accent-blue);
  border: none;
  border-radius: 4px;
}

.ai-suggestions {
  margin-top: 12px;
}

.suggestions-title {
  color: var(--text-secondary);
  font-size: 12px;
  margin-bottom: 8px;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-tag:hover {
  transform: scale(1.05);
}

.text-input-section {
  margin-bottom: 16px;
}

:deep(.script-field .van-field__body) {
  background: var(--bg-secondary);
  border-radius: 6px;
  min-height: 120px;
}

.text-tools {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.tool-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
}

.tool-btn .van-icon {
  margin-right: 2px;
  font-size: 10px;
}

.tool-spacer {
  flex: 1;
}

.text-analysis {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.analysis-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.analysis-label {
  color: var(--text-secondary);
  font-size: 10px;
  margin-bottom: 2px;
}

.analysis-value {
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
}

.text-templates {
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
}

.templates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.templates-title {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.toggle-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 10px;
}

.templates-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.template-item {
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-item:hover {
  border-color: var(--accent-blue);
  background: rgba(24, 144, 255, 0.05);
}

.template-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 12px;
}

.template-preview {
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.3;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.template-tags {
  display: flex;
  gap: 4px;
}

:deep(.template-tags .van-tag) {
  font-size: 9px;
  padding: 1px 4px;
}
</style>