<template>
  <div class="character-selector">
    <div class="section-header">
      <h4>角色选择</h4>
      <van-radio-group v-model="localMode" direction="horizontal">
        <van-radio name="upload">上传图片</van-radio>
        <van-radio name="library">角色库</van-radio>
      </van-radio-group>
    </div>

    <!-- 上传图片模式 -->
    <div v-if="localMode === 'upload'" class="upload-section">
      <div class="upload-area" @click="triggerFileUpload">
        <div v-if="!uploadedImage" class="upload-placeholder">
          <van-icon name="photograph" size="32" />
          <p>点击上传图片</p>
          <span class="upload-hint">支持 JPG、PNG 格式</span>
        </div>
        <div v-else class="upload-preview">
          <img :src="imagePreviewUrl" alt="上传的图片" />
          <div class="upload-actions">
            <van-button size="mini" @click.stop="removeImage">
              <van-icon name="delete" />
            </van-button>
          </div>
        </div>
      </div>
      <input 
        ref="fileInput" 
        type="file" 
        accept="image/*" 
        @change="handleFileUpload" 
        style="display: none"
      />
    </div>

    <!-- 角色库模式 -->
    <div v-else class="library-section">
      <van-search 
        v-model="searchKeyword" 
        placeholder="搜索角色" 
        @search="onSearch"
      />
      
      <div class="character-grid">
        <div 
          v-for="character in filteredCharacters" 
          :key="character.id"
          :class="['character-card', { selected: selectedCharacter === character.id }]"
          @click="selectCharacter(character)"
        >
          <div class="character-avatar">
            <img :src="character.avatar" :alt="character.name" />
          </div>
          <div class="character-info">
            <div class="character-name">{{ character.name }}</div>
            <div class="character-tags">
              <van-tag 
                v-for="tag in character.tags" 
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: string
  image?: File | null
  mode?: 'upload' | 'library'
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:image', value: File | null): void
  (e: 'update:mode', value: 'upload' | 'library'): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'upload'
})
const emit = defineEmits<Emits>()

const localMode = ref(props.mode)
const selectedCharacter = ref(props.modelValue)
const uploadedImage = ref<File | null>(props.image ?? null)
const imagePreviewUrl = ref('')
const searchKeyword = ref('')
const fileInput = ref<HTMLInputElement>()

// 角色库数据
const characterLibrary = ref([
  {
    id: 'char1',
    name: '商务精英',
    avatar: 'https://example.com/avatar1.jpg',
    tags: ['商务', '专业', '成人']
  },
  {
    id: 'char2',
    name: '甜美主播',
    avatar: 'https://example.com/avatar2.jpg',
    tags: ['主播', '甜美', '女性']
  },
  {
    id: 'char3',
    name: '知识讲师',
    avatar: 'https://example.com/avatar3.jpg',
    tags: ['教育', '讲师', '专业']
  },
  {
    id: 'char4',
    name: '可爱儿童',
    avatar: 'https://example.com/avatar4.jpg',
    tags: ['儿童', '可爱', '教育']
  },
  {
    id: 'char5',
    name: '活力青年',
    avatar: 'https://example.com/avatar5.jpg',
    tags: ['青年', '活力', '时尚']
  },
  {
    id: 'char6',
    name: '权威专家',
    avatar: 'https://example.com/avatar6.jpg',
    tags: ['专家', '权威', '专业']
  }
])

// 过滤后的角色列表
const filteredCharacters = computed(() => {
  if (!searchKeyword.value) {
    return characterLibrary.value
  }
  return characterLibrary.value.filter(character =>
    character.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    character.tags.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  )
})

// 触发文件上传
const triggerFileUpload = () => {
  fileInput.value?.click()
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      console.error('请上传图片文件')
      return
    }
    
    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      console.error('文件大小不能超过5MB')
      return
    }
    
    uploadedImage.value = file
    selectedCharacter.value = ''
    
    // 生成预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    emit('update:image', file)
    emit('update:modelValue', '')
  }
}

// 移除图片
const removeImage = () => {
  uploadedImage.value = null
  imagePreviewUrl.value = ''
  emit('update:image', null)
}

// 选择角色
const selectCharacter = (character: any) => {
  selectedCharacter.value = character.id
  uploadedImage.value = null
  imagePreviewUrl.value = ''
  
  emit('update:modelValue', character.id)
  emit('update:image', null)
}

// 搜索角色
const onSearch = () => {
  // 搜索逻辑已通过computed属性实现
}

// 监听模式变化
watch(localMode, (newMode) => {
  emit('update:mode', newMode)
  
  // 切换模式时清空选择
  if (newMode === 'upload') {
    selectedCharacter.value = ''
    emit('update:modelValue', '')
  } else {
    uploadedImage.value = null
    imagePreviewUrl.value = ''
    emit('update:image', null)
  }
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  selectedCharacter.value = newValue
})

watch(() => props.image, (newValue) => {
  uploadedImage.value = newValue ?? null
})

watch(() => props.mode, (newValue) => {
  localMode.value = newValue
})
</script>

<style scoped>
.character-selector {
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

:deep(.van-radio-group) {
  display: flex;
  gap: 12px;
}

:deep(.van-radio) {
  margin: 0;
}

:deep(.van-radio__label) {
  color: var(--text-secondary);
  font-size: 12px;
}

:deep(.van-radio__icon--checked .van-icon) {
  background-color: var(--accent-blue);
  border-color: var(--accent-blue);
}

.upload-section {
  text-align: center;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: var(--accent-blue);
  background: rgba(24, 144, 255, 0.05);
}

.upload-placeholder {
  color: var(--text-secondary);
}

.upload-placeholder .van-icon {
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.7;
}

.upload-preview {
  position: relative;
  display: inline-block;
}

.upload-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.upload-actions {
  position: absolute;
  top: 4px;
  right: 4px;
}

.library-section {
  margin-top: 16px;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.character-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.character-card:hover {
  border-color: var(--accent-blue);
  transform: translateY(-2px);
}

.character-card.selected {
  border-color: var(--accent-blue);
  background: rgba(24, 144, 255, 0.1);
}

.character-avatar {
  text-align: center;
  margin-bottom: 8px;
}

.character-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.character-info {
  text-align: center;
}

.character-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.character-tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2px;
}

:deep(.van-tag) {
  margin: 1px;
  font-size: 10px;
}
</style>