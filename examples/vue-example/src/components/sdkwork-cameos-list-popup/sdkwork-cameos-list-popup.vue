<template>
  <sdkwork-popup
    v-model:show="visible"
    position="bottom"
    :style="{ height: height }"
    round
    closeable
    :close-on-click-overlay="false"
    :theme-mode="themeMode"
    :title="title"
  >
    <div class="cameos-list-popup">
      <!-- 搜索区域 -->
      <div class="search-section">
        <van-search
          v-model="searchKeyword"
          placeholder="搜索角色"
          @search="handleSearch"
          shape="round"
          background="transparent"
        />
      </div>

      <!-- 角色列表内容 -->
      <div class="popup-content">
        <div class="cameos-grid">
          <div
            v-for="cameo in filteredCameos"
            :key="cameo.id"
            :class="['cameo-card', { selected: selectedCameo?.id === cameo.id }]"
            @click="selectCameo(cameo)"
          >
            <div class="cameo-avatar">
              <img :src="cameo.avatar" :alt="cameo.name" />
            </div>
            <div class="cameo-info">
              <div class="cameo-name">{{ cameo.name }}</div>
              <div class="cameo-tags">
                <span v-for="tag in cameo.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
            <div v-if="selectedCameo?.id === cameo.id" class="selected-icon">✓</div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredCameos.length === 0" class="empty-state">
          <van-empty description="暂无匹配角色" image="search">
            <template #description>
              <p>没有找到匹配的角色</p>
              <p class="empty-tip">请尝试其他搜索关键词</p>
            </template>
          </van-empty>
        </div>
      </div>

      <!-- 底部按钮区域 -->
      <div class="popup-footer">
        <van-button
          type="primary"
          size="large"
          block
          @click="handleConfirm"
          :disabled="!selectedCameo"
          class="confirm-btn"
        >
          {{ confirmText }}
        </van-button>
      </div>
    </div>
  </sdkwork-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Page, Pageable } from 'sdkwork-commons-typescript'
import type { Cameo } from '../sdkwork-cameos-list/types'

// Props 定义
interface Props {
  modelValue?: boolean
  title?: string
  height?: string
  confirmText?: string
  api?: (params: Pageable) => Promise<Page<Cameo>>|any
  params?: Record<string, any>
  selectedCameoId?: string | number
  themeMode?: 'dark' | 'light' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '选择角色',
  height: '70vh',
  confirmText: '确认选择',
  params: () => ({}),
  themeMode: 'auto'
})

// Emits 定义
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', cameo: Cameo): void
  (e: 'close'): void
  (e: 'select', cameo: Cameo): void
  (e: 'search', keyword: string): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const visible = ref(props.modelValue)
const selectedCameo = ref<Cameo | null>(null)
const searchKeyword = ref('')

// 角色数据
const cameos = ref<Cameo[]>([
  {
    id: 'char1',
    name: '商务精英',
    avatar: 'https://example.com/avatar1.jpg',
    tags: ['商务', '专业'],
    description: '专业的商务形象',
    type: 'character',
    cameoCount: 0,
    remixCount: 0,
    viewCount: 0,
    likeCount: 0,
    rating: 0,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 'char2',
    name: '甜美主播',
    avatar: 'https://example.com/avatar2.jpg',
    tags: ['主播', '甜美'],
    description: '温柔甜美的形象',
    type: 'character',
    cameoCount: 0,
    remixCount: 0,
    viewCount: 0,
    likeCount: 0,
    rating: 0,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 'char3',
    name: '知识讲师',
    avatar: 'https://example.com/avatar3.jpg',
    tags: ['教育', '讲师'],
    description: '知识渊博的讲师形象',
    type: 'character',
    cameoCount: 0,
    remixCount: 0,
    viewCount: 0,
    likeCount: 0,
    rating: 0,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 'char4',
    name: '可爱儿童',
    avatar: 'https://example.com/avatar4.jpg',
    tags: ['儿童', '可爱'],
    description: '活泼可爱的儿童形象',
    type: 'character',
    cameoCount: 0,
    remixCount: 0,
    viewCount: 0,
    likeCount: 0,
    rating: 0,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 'char5',
    name: '活力青年',
    avatar: 'https://example.com/avatar5.jpg',
    tags: ['青年', '活力'],
    description: '充满活力的青年形象',
    type: 'character',
    cameoCount: 0,
    remixCount: 0,
    viewCount: 0,
    likeCount: 0,
    rating: 0,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 'char6',
    name: '权威专家',
    avatar: 'https://example.com/avatar6.jpg',
    tags: ['专家', '权威'],
    description: '专业权威的专家形象',
    type: 'character',
    cameoCount: 0,
    remixCount: 0,
    viewCount: 0,
    likeCount: 0,
    rating: 0,
    createdAt: '',
    updatedAt: ''
  }
])

// 过滤后的角色列表
const filteredCameos = computed(() => {
  if (!searchKeyword.value) {
    return cameos.value
  }
  return cameos.value.filter(cameo =>
    cameo.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    cameo.tags.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  )
})

// 监听 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

// 监听 visible 变化
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    emit('close')
  }
})

// 监听选中的角色ID变化
watch(() => props.selectedCameoId, (newId) => {
  if (newId) {
    const found = cameos.value.find(cameo => cameo.id === newId)
    if (found) {
      selectedCameo.value = found
    }
  }
})

// 处理确认选择
const handleConfirm = () => {
  if (selectedCameo.value) {
    emit('confirm', selectedCameo.value)
    visible.value = false
  }
}

// 处理角色选择
const selectCameo = (cameo: Cameo) => {
  selectedCameo.value = cameo
  emit('select', cameo)
}

// 处理搜索
const handleSearch = () => {
  emit('search', searchKeyword.value)
}
</script>

<style scoped>
.cameos-list-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-section {
  padding: 0 16px;
  border-bottom: 1px solid var(--border-color);
}

:deep(.van-search) {
  padding: 8px 0;
}

:deep(.van-search__content) {
  background: var(--bg-secondary);
}

.popup-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.cameos-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.cameo-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: var(--bg-card);
}

.cameo-card:hover {
  border-color: var(--accent-blue);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.cameo-card.selected {
  border-color: var(--accent-blue);
  background: rgba(24, 144, 255, 0.1);
}

.cameo-avatar {
  text-align: center;
  margin-bottom: 8px;
}

.cameo-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-color);
}

.cameo-info {
  text-align: center;
}

.cameo-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-size: 14px;
}

.cameo-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
}

.selected-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: var(--accent-blue);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-tip {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 8px;
}

.popup-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
}

.confirm-btn {
  background: var(--gradient-primary);
  border: none;
  border-radius: 8px;
  font-weight: 600;
}

.confirm-btn:disabled {
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

/* 科技蓝主题 - 深色模式 */
:root {
  --bg-primary: #0a1629;
  --bg-secondary: #1a2438;
  --bg-card: #1e2a3d;
  --text-primary: #ffffff;
  --text-secondary: #8fa3c4;
  --accent-blue: #1890ff;
  --accent-blue-light: #40a9ff;
  --accent-blue-dark: #096dd9;
  --border-color: #2d3a4e;
  --gradient-primary: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  --gradient-secondary: linear-gradient(135deg, #1a2438 0%, #2d3a4e 100%);
  --shadow-glow: 0 0 20px rgba(24, 144, 255, 0.3);
}

/* 科技蓝主题 - 浅色模式 */
@media (prefers-color-scheme: light) {
  :root {
    --bg-primary: #f0f8ff;
    --bg-secondary: #e6f7ff;
    --bg-card: #ffffff;
    --text-primary: #1f2937;
    --text-secondary: #4b5563;
    --accent-blue: #1890ff;
    --accent-blue-light: #40a9ff;
    --accent-blue-dark: #096dd9;
    --border-color: #d1e9ff;
    --gradient-primary: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
    --gradient-secondary: linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 100%);
    --shadow-glow: 0 0 15px rgba(24, 144, 255, 0.2);
  }
}

/* 强制深色模式 */
html[data-theme="dark"] {
  --bg-primary: #0a1629;
  --bg-secondary: #1a2438;
  --bg-card: #1e2a3d;
  --text-primary: #ffffff;
  --text-secondary: #8fa3c4;
  --accent-blue: #1890ff;
  --accent-blue-light: #40a9ff;
  --accent-blue-dark: #096dd9;
  --border-color: #2d3a4e;
  --gradient-primary: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  --gradient-secondary: linear-gradient(135deg, #1a2438 0%, #2d3a4e 100%);
  --shadow-glow: 0 0 20px rgba(24, 144, 255, 0.3);
}
</style>