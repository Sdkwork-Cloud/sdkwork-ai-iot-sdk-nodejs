<template>
  <div class="scene-selector">
    <div class="section-header">
      <h4>场景选择</h4>
      <div class="selected-scene-info" v-if="selectedScene">
        <span class="scene-label">当前选择：</span>
        <span class="scene-name">{{ selectedSceneName }}</span>
      </div>
    </div>

    <!-- 场景筛选 -->
    <div class="filter-section">
      <van-search 
        v-model="searchKeyword" 
        placeholder="搜索场景" 
        @search="onSearch"
      />
      
      <van-radio-group v-model="filterCategory" direction="horizontal">
        <van-radio name="all">全部</van-radio>
        <van-radio name="indoor">室内</van-radio>
        <van-radio name="outdoor">室外</van-radio>
        <van-radio name="special">特殊</van-radio>
      </van-radio-group>
    </div>

    <!-- 场景列表 -->
    <div class="scene-list">
      <div 
        v-for="scene in filteredScenes" 
        :key="scene.id"
        :class="['scene-card', { selected: selectedScene === scene.id }]"
        @click="selectScene(scene)"
      >
        <div class="scene-image">
          <div class="image-placeholder" :style="{ backgroundColor: scene.color }">
            {{ scene.icon }}
          </div>
        </div>
        
        <div class="scene-info">
          <div class="scene-name">{{ scene.name }}</div>
          <div class="scene-description">{{ scene.description }}</div>
          
          <div class="scene-meta">
            <van-tag  
              :type="scene.category === 'indoor' ? 'primary' : scene.category === 'outdoor' ? 'success' : 'warning'"
            >
              {{ scene.category === 'indoor' ? '室内' : scene.category === 'outdoor' ? '室外' : '特殊' }}
            </van-tag>
            <van-tag type="default">
              {{ scene.lighting }}
            </van-tag>
          </div>
        </div>

        <!-- 预览按钮 -->
        <div class="scene-actions">
          <van-button 
            size="mini" 
            @click.stop="previewScene(scene)"
            class="preview-btn"
          >
            <van-icon name="eye-o" />
            预览
          </van-button>
        </div>
      </div>
    </div>

    <!-- 场景预览面板 -->
    <van-popup 
      v-model:show="showPreviewPanel" 
      position="bottom" 
      round
      class="preview-panel"
    >
      <div class="preview-content">
        <div class="preview-header">
          <h4>场景预览：{{ previewSceneData?.name }}</h4>
          <van-button 
            size="mini" 
            @click="closePreview"
            class="close-btn"
          >
            <van-icon name="cross" />
          </van-button>
        </div>
        
        <div class="preview-details">
          <div class="preview-image">
            <div class="image-placeholder large" :style="{ backgroundColor: previewSceneData?.color }">
              {{ previewSceneData?.icon }}
            </div>
          </div>
          
          <div class="preview-info">
            <div class="info-item">
              <span class="info-label">场景类型：</span>
              <span class="info-value">{{ previewSceneData?.category === 'indoor' ? '室内' : previewSceneData?.category === 'outdoor' ? '室外' : '特殊' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">光照条件：</span>
              <span class="info-value">{{ previewSceneData?.lighting }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">适用风格：</span>
              <span class="info-value">{{ previewSceneData?.suitableStyles.join(', ') }}</span>
            </div>
          </div>
        </div>
        
        <div class="preview-description">
          {{ previewSceneData?.description }}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string
  scenes?: any[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  scenes: () => []
})
const emit = defineEmits<Emits>()

const selectedScene = ref(props.modelValue)
const searchKeyword = ref('')
const filterCategory = ref('all')
const showPreviewPanel = ref(false)
const previewSceneData = ref<any>(null)

// 场景数据
const sceneList = ref([
  {
    id: 'office',
    name: '办公室',
    icon: '🏢',
    category: 'indoor',
    lighting: '明亮',
    color: '#3498db',
    description: '专业商务环境，适合产品介绍和商务讲解',
    suitableStyles: ['专业商务', '知识科普']
  },
  {
    id: 'outdoor',
    name: '户外场景',
    icon: '🌳',
    category: 'outdoor',
    lighting: '自然光',
    color: '#27ae60',
    description: '自然环境，适合生活分享和户外活动',
    suitableStyles: ['轻松日常', '娱乐搞笑']
  },
  {
    id: 'studio',
    name: '演播室',
    icon: '🎬',
    category: 'indoor',
    lighting: '专业灯光',
    color: '#e74c3c',
    description: '专业录制环境，适合正式演讲和知识分享',
    suitableStyles: ['专业商务', '知识科普']
  },
  {
    id: 'home',
    name: '家居环境',
    icon: '🏠',
    category: 'indoor',
    lighting: '温馨',
    color: '#f39c12',
    description: '温馨家庭环境，适合情感故事和生活分享',
    suitableStyles: ['轻松日常', '情感故事']
  },
  {
    id: 'classroom',
    name: '教室',
    icon: '🎓',
    category: 'indoor',
    lighting: '教育照明',
    color: '#9b59b6',
    description: '教育环境，适合知识讲解和教学视频',
    suitableStyles: ['知识科普', '教育讲解']
  },
  {
    id: 'nature',
    name: '自然风光',
    icon: '⛰️',
    category: 'outdoor',
    lighting: '日光',
    color: '#1abc9c',
    description: '壮丽自然景观，适合旅游分享和风光展示',
    suitableStyles: ['励志激励', '娱乐搞笑']
  },
  {
    id: 'coffee',
    name: '咖啡馆',
    icon: '☕',
    category: 'indoor',
    lighting: '氛围灯光',
    color: '#d35400',
    description: '休闲社交环境，适合轻松谈话和故事分享',
    suitableStyles: ['轻松日常', '情感故事']
  },
  {
    id: 'beach',
    name: '海滩',
    icon: '🏖️',
    category: 'outdoor',
    lighting: '阳光充足',
    color: '#f1c40f',
    description: '海滨度假环境，适合休闲娱乐和旅游分享',
    suitableStyles: ['娱乐搞笑', '励志激励']
  }
])

// 过滤后的场景列表
const filteredScenes = computed(() => {
  return sceneList.value.filter(scene => {
    const categoryMatch = filterCategory.value === 'all' || scene.category === filterCategory.value
    const searchMatch = !searchKeyword.value || 
      scene.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      scene.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    return categoryMatch && searchMatch
  })
})

// 当前选择的场景名称
const selectedSceneName = computed(() => {
  const scene = sceneList.value.find(s => s.id === selectedScene.value)
  return scene ? scene.name : '未选择'
})

// 选择场景
const selectScene = (scene: any) => {
  selectedScene.value = scene.id
  emit('update:modelValue', scene.id)
}

// 预览场景
const previewScene = (scene: any) => {
  previewSceneData.value = scene
  showPreviewPanel.value = true
}

// 关闭预览面板
const closePreview = () => {
  showPreviewPanel.value = false
  previewSceneData.value = null
}

// 搜索场景
const onSearch = () => {
  // 搜索逻辑已通过computed属性实现
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  selectedScene.value = newValue
})
</script>

<style scoped>
.scene-selector {
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

.selected-scene-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.scene-label {
  color: var(--text-secondary);
  font-size: 12px;
}

.scene-name {
  color: var(--accent-blue);
  font-weight: 600;
  font-size: 12px;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-section .van-radio-group {
  margin-top: 12px;
}

:deep(.van-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.van-radio) {
  margin: 0;
}

:deep(.van-radio__label) {
  color: var(--text-secondary);
  font-size: 11px;
}

.scene-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.scene-card {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scene-card:hover {
  border-color: var(--accent-blue);
  transform: translateY(-1px);
}

.scene-card.selected {
  border-color: var(--accent-blue);
  background: rgba(24, 144, 255, 0.1);
}

.scene-image {
  margin-right: 12px;
}

.image-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.image-placeholder.large {
  width: 80px;
  height: 80px;
  font-size: 32px;
}

.scene-info {
  flex: 1;
}

.scene-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  font-size: 14px;
}

.scene-description {
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.3;
  margin-bottom: 6px;
}

.scene-meta {
  display: flex;
  gap: 4px;
}

.scene-actions {
  margin-left: 12px;
}

.preview-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
}

.preview-btn .van-icon {
  margin-right: 2px;
  font-size: 10px;
}

/* 预览面板样式 */
.preview-panel {
  height: 50vh;
}

.preview-content {
  padding: 20px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.preview-header h4 {
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.preview-details {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.preview-image {
  flex-shrink: 0;
}

.preview-info {
  flex: 1;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
}

.info-label {
  color: var(--text-secondary);
  font-size: 12px;
  min-width: 80px;
}

.info-value {
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 500;
}

.preview-description {
  background: var(--bg-secondary);
  border-radius: 6px;
  padding: 12px;
  color: var(--text-primary);
  font-size: 12px;
  line-height: 1.5;
}
</style>