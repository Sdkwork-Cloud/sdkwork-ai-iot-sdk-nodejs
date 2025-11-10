<template>
  <div class="photo-settings">
    <!-- 写真设置 -->
    <div v-if="mode === 'portrait'" class="portrait-settings">
      <div class="settings-header">
        <van-icon name="setting" class="header-icon" />
        <span>写真设置</span>
      </div>
      
      <div class="settings-grid">
        <!-- 性别选择 -->
        <div class="setting-item">
          <label class="setting-label">性别</label>
          <div class="gender-options">
            <div 
              v-for="gender in genders" 
              :key="gender.value"
              class="gender-option"
              :class="{ active: settings.gender === gender.value }"
              @click="selectGender(gender.value)"
            >
              <van-icon :name="gender.icon" />
              <span>{{ gender.label }}</span>
            </div>
          </div>
        </div>
        
        <!-- 年龄选择 -->
        <div class="setting-item">
          <label class="setting-label">年龄</label>
          <van-field
            v-model="settings.age"
            placeholder="请输入年龄"
            type="number"
            class="age-input"
          />
        </div>
        
        <!-- 背景选择 -->
        <div class="setting-item">
          <label class="setting-label">背景</label>
          <div class="background-options">
            <div 
              v-for="bg in portraitBackgrounds" 
              :key="bg.value"
              class="background-option"
              :class="{ active: settings.background === bg.value }"
              @click="selectBackground(bg.value)"
            >
              <div class="bg-icon">{{ bg.icon }}</div>
              <span>{{ bg.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 证件照设置 -->
    <div v-else class="idphoto-settings">
      <div class="settings-header">
        <van-icon name="setting" class="header-icon" />
        <span>证件照设置</span>
      </div>
      
      <div class="settings-grid">
        <!-- 证件照类型 -->
        <div class="setting-item">
          <label class="setting-label">证件类型</label>
          <div class="id-type-options">
            <div 
              v-for="type in idTypes" 
              :key="type.value"
              class="id-type-option"
              :class="{ active: settings.idType === type.value }"
              @click="selectIdType(type.value)"
            >
              <div class="type-icon">{{ type.icon }}</div>
              <span>{{ type.label }}</span>
            </div>
          </div>
        </div>
        
        <!-- 证件照尺寸 -->
        <div class="setting-item">
          <label class="setting-label">证件照尺寸</label>
          <div class="id-size-options">
            <div 
              v-for="size in idSizes" 
              :key="size.value"
              class="id-size-option"
              :class="{ active: settings.idSize === size.value }"
              @click="selectIdSize(size.value)"
            >
              <div class="size-info">
                <div class="size-name">{{ size.name }}</div>
                <div class="size-dimensions">{{ size.dimensions }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 背景颜色 -->
        <div class="setting-item">
          <label class="setting-label">背景颜色</label>
          <div class="bg-color-options">
            <div 
              v-for="color in bgColors" 
              :key="color.value"
              class="bg-color-option"
              :class="{ active: settings.bgColor === color.value }"
              @click="selectBgColor(color.value)"
              :style="{ backgroundColor: color.color }"
            >
              <span>{{ color.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: {
    gender: string
    age: string
    background: string
    idType?: string
    idSize?: string
    bgColor?: string
  }
  mode?: 'portrait' | 'idphoto'
}

interface Emits {
  (e: 'update:modelValue', value: { 
    gender: string; 
    age: string; 
    background: string;
    idType?: string;
    idSize?: string;
    bgColor?: string;
  }): void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'portrait'
})
const emit = defineEmits<Emits>()

const settings = ref<any>({
  gender: props.modelValue.gender || '',
  age: props.modelValue.age || '',
  background: props.modelValue.background || '',
  idType: props.modelValue.idType || '',
  idSize: props.modelValue.idSize || '',
  bgColor: props.modelValue.bgColor || ''
})

const genders = [
  { value: 'male', label: '男性', icon: 'man' },
  { value: 'female', label: '女性', icon: 'woman' },
  { value: 'other', label: '其他', icon: 'user-circle-o' }
]

const portraitBackgrounds = [
  { value: 'studio', label: '摄影棚', icon: '🏢' },
  { value: 'nature', label: '自然', icon: '🌳' },
  { value: 'urban', label: '城市', icon: '🏙️' },
  { value: 'indoor', label: '室内', icon: '🏠' },
  { value: 'beach', label: '海滩', icon: '🏖️' },
  { value: 'gradient', label: '渐变', icon: '🌈' }
]

// 证件照类型
const idTypes = [
  { value: 'idcard', label: '身份证', icon: '🆔' },
  { value: 'passport', label: '护照', icon: '🛂' },
  { value: 'driver', label: '驾驶证', icon: '🚗' },
  { value: 'work', label: '工作证', icon: '💼' },
  { value: 'student', label: '学生证', icon: '🎓' }
]

// 证件照尺寸（标准尺寸）
const idSizes = [
  { value: 'idcard_standard', name: '身份证', dimensions: '358px × 441px' },
  { value: 'passport_standard', name: '护照', dimensions: '354px × 472px' },
  { value: 'driver_standard', name: '驾驶证', dimensions: '354px × 472px' },
  { value: 'one_inch', name: '一寸', dimensions: '295px × 413px' },
  { value: 'two_inch', name: '二寸', dimensions: '413px × 579px' },
  { value: 'custom', name: '自定义', dimensions: '自定义尺寸' }
]

// 背景颜色
const bgColors = [
  { value: 'red', label: '红色', color: '#ff6b6b' },
  { value: 'blue', label: '蓝色', color: '#4dabf7' },
  { value: 'white', label: '白色', color: '#ffffff' },
  { value: 'gray', label: '灰色', color: '#adb5bd' },
  { value: 'green', label: '绿色', color: '#69db7c' },
  { value: 'custom', label: '自定义', color: '#ced4da' }
]

const selectGender = (gender: string) => {
  settings.value.gender = gender
  emitUpdate()
}

const selectBackground = (background: string) => {
  settings.value.background = background
  emitUpdate()
}

// 证件照相关方法
const selectIdType = (idType: string) => {
  settings.value.idType = idType
  emitUpdate()
}

const selectIdSize = (idSize: string) => {
  settings.value.idSize = idSize
  emitUpdate()
}

const selectBgColor = (bgColor: string) => {
  settings.value.bgColor = bgColor
  emitUpdate()
}

const emitUpdate = () => {
  emit('update:modelValue', { ...settings.value })
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (JSON.stringify(newValue) !== JSON.stringify(settings.value)) {
    settings.value = { ...newValue }
  }
}, { deep: true })

// 监听内部设置变化
watch(settings, () => {
  emitUpdate()
}, { deep: true })
</script>

<style scoped>
.photo-settings {
  background: var(--bg-card);
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 12px;
}

.settings-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.header-icon {
  margin-right: 8px;
  color: var(--accent-blue);
  font-size: 16px;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 13px;
}

.gender-options {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  font-size: 12px;
}

  .gender-option:hover {
    border-color: var(--accent-blue);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .gender-option.active {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    font-weight: 600;
  }

.age-input {
  background: var(--bg-secondary);
  border-radius: 8px;
}

  .background-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .background-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 4px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    font-size: 11px;
  }

  .background-option:hover {
    border-color: var(--accent-blue);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .background-option.active {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    font-weight: 600;
  }

  .bg-icon {
    font-size: 16px;
    margin-bottom: 4px;
  }

  /* 证件照设置样式 */
  .id-type-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .id-type-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 4px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    font-size: 11px;
  }

  .id-type-option:hover {
    border-color: var(--accent-blue);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .id-type-option.active {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    font-weight: 600;
  }

  .type-icon {
    font-size: 16px;
    margin-bottom: 4px;
  }

  .id-size-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .id-size-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    text-align: center;
    min-height: 80px;
  }

  .id-size-option:hover {
    border-color: var(--accent-blue);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .id-size-option.active {
    background: var(--accent-blue);
    border-color: var(--accent-blue);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    font-weight: 600;
  }

  .id-size-option.active .size-dimensions {
    color: rgba(255, 255, 255, 0.8);
  }

  .size-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .size-name {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 4px;
  }

  .size-dimensions {
    font-size: 10px;
    color: var(--text-secondary);
    line-height: 1.2;
  }

  .bg-color-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .bg-color-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 4px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--border-color);
    font-size: 11px;
    height: 60px;
    position: relative;
    overflow: hidden;
  }

  .bg-color-option:hover {
    border-color: var(--accent-blue);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .bg-color-option.active {
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px var(--accent-blue), 0 4px 12px rgba(0, 123, 255, 0.3);
    transform: translateY(-2px);
    border-width: 2px;
  }

  .bg-color-option span {
    position: relative;
    z-index: 2;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    color: #333; /* 默认使用深色文字 */
  }

  /* 为深色背景设置白色文字 */
  .bg-color-option[style*="background-color: #000000"] span,
  .bg-color-option[style*="background-color: #333333"] span,
  .bg-color-option[style*="background-color: #666666"] span,
  .bg-color-option[style*="background-color: #999999"] span {
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* 为白色和浅色背景保持深色文字 */
  .bg-color-option[style*="background-color: #ffffff"] span,
  .bg-color-option[style*="background-color: #fff"] span,
  .bg-color-option[style*="background-color: #f0f0f0"] span,
  .bg-color-option[style*="background-color: #f8f8f8"] span,
  .bg-color-option[style*="background-color: #e0e0e0"] span {
    color: #333;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
  }

  /* 选中状态下的文字颜色 */
  .bg-color-option.active span {
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* 为白色背景添加边框阴影，提高可读性 */
  .bg-color-option[style*="background-color: #ffffff"],
  .bg-color-option[style*="background-color: #fff"] {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  }

  .bg-color-option[style*="background-color: #f0f0f0"],
  .bg-color-option[style*="background-color: #f8f8f8"],
  .bg-color-option[style*="background-color: #e0e0e0"] {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  }
</style>