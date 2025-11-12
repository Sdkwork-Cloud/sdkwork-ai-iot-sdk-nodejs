<template>
  <van-popup 
    v-model:show="show" 
    position="bottom" 
    :style="{ 
      height: '100vh', 
      borderRadius: '16px 16px 0 0',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff'
    }"
  >
    <div class="character-dialog">
      <div class="dialog-header">
        <van-tabs v-model:active="activeTab" shrink>
          <van-tab title="搜索添加" name="search"></van-tab>
          <van-tab title="最近使用" name="recent"></van-tab>
          <van-tab title="自定义添加" name="custom"></van-tab>
        </van-tabs>
        <van-icon name="cross" @click="close" />
      </div>
      
      <div class="dialog-content">
        <!-- 自定义添加面板 -->
        <CustomCharacterPanel
          v-if="activeTab === 'custom'"
          v-model="characterForm"
          @show-voice-selector="showVoiceSelector = true"
          ref="customPanelRef"
        />
        
        <!-- 搜索添加面板 -->
        <SearchCharacterPanel
          v-if="activeTab === 'search'"
          :preset-characters="presetCharacters"
          @select="handleSelectPreset"
        />
        
        <!-- 最近使用面板 -->
        <RecentCharacterPanel
          v-if="activeTab === 'recent'"
          :recent-characters="recentCharacters"
          @select="handleSelectRecent"
          ref="recentPanelRef"
        />
      </div>
      
      <div class="dialog-footer">
        <van-button block type="primary" @click="handleAdd" v-if="activeTab === 'custom'">添加</van-button>
        <div v-else class="search-footer">点击上方角色卡片添加</div>
      </div>
    </div>
  </van-popup>
  
  <!-- 语音选择弹窗 -->
  <sdkwork-voice-speaker-category-list-popup
    v-model="showVoiceSelector"
    :theme-mode="isDarkMode ? 'dark' : 'light'"
    title="选择语音"
    height="90vh"
    :show-clone-button="false"
    :z-index="9999"
    @confirm="handleVoiceSelected"
  />
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { showToast } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme'
import type { DialogueCharacter } from '../types'
import SdkworkVoiceSpeakerCategoryListPopup from '@/components/sdkwork-voice-speaker-category-list-popup/sdkwork-voice-speaker-category-list-popup.vue'

// 导入子组件
import CustomCharacterPanel from './CustomCharacterPanel.vue'
import SearchCharacterPanel from './SearchCharacterPanel.vue'
import RecentCharacterPanel from './RecentCharacterPanel.vue'

// Props
interface Props {
  modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'add', character: DialogueCharacter): void
}>()

// 响应式数据
const show = ref(props.modelValue)
const activeTab = ref('search') // 默认显示搜索添加
const showVoiceSelector = ref(false)

// 子组件引用
const customPanelRef = ref<InstanceType<typeof CustomCharacterPanel>>()
const recentPanelRef = ref<InstanceType<typeof RecentCharacterPanel>>()

// 角色表单
const characterForm = reactive({
  name: '',
  description: '',
  avatar: '',
  appearance: {
    gender: 'male' as 'male' | 'female' | 'other',
    age: '',
    style: '',
    description: ''
  },
  voice: {
    voiceId: 'standard',
    pitch: 0,
    speed: 1,
    emotion: 'neutral'
  }
})

// 预设角色数据
const presetCharacters = ref<DialogueCharacter[]>([])

// 最近使用角色
const recentCharacters = ref<DialogueCharacter[]>([])

// 使用主题
const { currentTheme, isDarkMode } = useTheme()

// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  show.value = newVal
})

// 监听show变化并触发update:modelValue
watch(show, (newVal) => {
  emit('update:modelValue', newVal)
})

// 关闭弹窗
const close = () => {
  show.value = false
}

// 重置表单
const resetForm = () => {
  characterForm.name = ''
  characterForm.description = ''
  characterForm.avatar = ''
  characterForm.appearance.gender = 'male'
  characterForm.appearance.age = ''
  characterForm.appearance.style = ''
  characterForm.appearance.description = ''
  characterForm.voice.voiceId = 'standard'
  
  // 调用子组件的重置方法
  customPanelRef.value?.resetForm()
}

// 处理添加角色（自定义）
const handleAdd = () => {
  if (!characterForm.name.trim()) {
    showToast('请输入角色名称')
    return
  }
  
  const newCharacter: DialogueCharacter = {
    id: `character_${Date.now()}`,
    name: characterForm.name,
    description: characterForm.description,
    avatar: characterForm.avatar,
    appearance: { ...characterForm.appearance },
    voice: { ...characterForm.voice }
  }
  
  emit('add', newCharacter)
  addToRecent(newCharacter) // 添加到最近使用
  resetForm()
  close()
}

// 处理选择预设角色
const handleSelectPreset = (preset: DialogueCharacter) => {
  const newCharacter: DialogueCharacter = {
    ...preset,
    id: `character_${Date.now()}` // 生成新的ID以避免冲突
  }
  
  emit('add', newCharacter)
  addToRecent(preset) // 添加到最近使用
  resetForm()
  close()
}

// 处理选择最近使用角色
const handleSelectRecent = (recent: DialogueCharacter) => {
  const newCharacter: DialogueCharacter = {
    ...recent,
    id: `character_${Date.now()}` // 生成新的ID以避免冲突
  }
  
  emit('add', newCharacter)
  addToRecent(recent) // 更新使用时间
  resetForm()
  close()
}

// 添加角色到最近使用
const addToRecent = (character: DialogueCharacter) => {
  recentPanelRef.value?.addToRecent(character)
}

// 处理语音选择
const handleVoiceSelected = (voice: any) => {
  customPanelRef.value?.setVoice(voice)
  showVoiceSelector.value = false
}

// 初始化数据
onMounted(() => {
  // 预设角色数据
  presetCharacters.value = [
    {
      id: 'preset_1',
      name: '小明',
      description: '一个活泼开朗的男孩，喜欢运动和冒险',
      avatar: '',
      appearance: {
        gender: 'male',
        age: '20岁',
        style: '休闲运动风',
        description: '短发，穿着休闲运动装，笑容阳光'
      },
      voice: {
        voiceId: 'young_male'
      },
      tags: ['开朗', '活泼', '阳光']
    },
    {
      id: 'preset_2',
      name: '小红',
      description: '一个温柔文静的女孩，喜欢阅读和绘画',
      avatar: '',
      appearance: {
        gender: 'female',
        age: '19岁',
        style: '甜美文艺风',
        description: '长发，穿着连衣裙，文静温柔'
      },
      voice: {
        voiceId: 'young_female'
      },
      tags: ['温柔', '文静', '文艺']
    },
    {
      id: 'preset_3',
      name: '老教授',
      description: '知识渊博的教授，说话沉稳而有条理',
      avatar: '',
      appearance: {
        gender: 'male',
        age: '60岁',
        style: '学术风',
        description: '戴眼镜，穿着西装，沉稳稳重'
      },
      voice: {
        voiceId: 'mature_male'
      },
      tags: ['教授', '知识渊博', '严肃']
    },
    {
      id: 'preset_4',
      name: '小可爱',
      description: '天真可爱的孩子，说话语气稚嫩可爱',
      avatar: '',
      appearance: {
        gender: 'female',
        age: '8岁',
        style: '童装',
        description: '扎着小辫子，穿着可爱的童装'
      },
      voice: {
        voiceId: 'young_female'
      },
      tags: ['可爱', '孩子', '天真']
    }
  ]
})

// 暴露方法给父组件
defineExpose({
  resetForm,
  close
})
</script>

<style lang="scss" scoped>
.character-dialog {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    padding-bottom: 8px;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  .dialog-content {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px;
    padding-bottom: 16px;
  }
  
  .dialog-footer {
    padding: 16px;
    position: sticky;
    bottom: 0;
    border-top: 1px solid;
    
    .search-footer {
      text-align: center;
      font-size: 14px;
      padding: 12px 0;
    }
  }
}

// 主题相关样式
:root {
  --dialog-bg-color: #ffffff;
  --header-bg-color: #ffffff;
  --footer-bg-color: #ffffff;
  --border-color: #ebedf0;
  --character-item-bg: #f7f8fa;
  --character-item-active-bg: #ebedf0;
  --text-primary-color: #323233;
  --text-secondary-color: #646566;
  --text-hint-color: #969799;
}

html[data-theme="dark"] {
  --dialog-bg-color: #1a1a1a;
  --header-bg-color: #1a1a1a;
  --footer-bg-color: #1a1a1a;
  --border-color: #2a2a2a;
  --character-item-bg: #2a2a2a;
  --character-item-active-bg: #3a3a3a;
  --text-primary-color: #f0f0f0;
  --text-secondary-color: #c0c0c0;
  --text-hint-color: #a0a0a0;
}

.character-dialog {
  background-color: var(--dialog-bg-color);
  
  .dialog-header {
    background-color: var(--header-bg-color);
  }
  
  .dialog-footer {
    background-color: var(--footer-bg-color);
    border-top-color: var(--border-color);
    
    .search-footer {
      color: var(--text-hint-color);
    }
  }
}
</style>