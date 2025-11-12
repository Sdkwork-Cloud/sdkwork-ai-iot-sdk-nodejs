<template>
  <div class="character-manager">
    <van-cell-group title="角色管理">
      <!-- 角色列表 -->
      <div class="character-list">
        <van-swipe-cell v-for="character in characters" :key="character.id">
          <van-cell
            :title="character.name"
            :label="character.description"
            is-link
            @click="selectCharacter(character)"
            :class="{ 'selected': selectedCharacterId === character.id }"
          >
            <template #icon>
              <div class="character-avatar">
                <img v-if="character.avatar" :src="character.avatar" :alt="character.name" />
                <div v-else class="avatar-placeholder">{{ character.name.charAt(0).toUpperCase() }}</div>
              </div>
            </template>
            <template #right-icon>
              <div class="cell-actions">
                <van-tag type="primary" v-if="selectedCharacterId === character.id">{{ getRoleTypeLabel(character.roleType) }}</van-tag>
                <van-icon 
                  v-if="selectedCharacterId === character.id" 
                  name="cross" 
                  class="delete-icon" 
                  @click.stop="deleteSelectedCharacter(character.id)"
                />
              </div>
            </template>
          </van-cell>
          
          <template #right>
            <van-button square type="primary" text="编辑" @click="editCharacter(character)" />
            <van-button square type="danger" text="删除" @click="deleteCharacter(character.id)" />
          </template>
        </van-swipe-cell>
      </div>
      
      <!-- 添加角色按钮 -->
      <van-cell>
        <template #title>
          <van-button type="primary" size="small" icon="plus" @click="showAddDialog = true">
            添加角色
          </van-button>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 添加/编辑角色弹窗 -->
    <van-popup v-model:show="showAddDialog" position="bottom" round>
      <div class="character-dialog">
        <div class="dialog-header">
          <span class="dialog-title">{{ editingCharacter ? '编辑角色' : '添加角色' }}</span>
          <van-icon name="cross" @click="closeDialog" />
        </div>
        
        <div class="dialog-content">
          <van-field label="角色名称" v-model="characterForm.name" placeholder="请输入角色名称" />
          <van-field label="角色描述" v-model="characterForm.description" type="textarea" rows="2" placeholder="请输入角色描述" />
          <van-field label="头像URL" v-model="characterForm.avatar" placeholder="请输入头像URL" />
          <van-field label="角色类型">
            <template #input>
              <van-radio-group v-model="characterForm.roleType" direction="horizontal">
                <van-radio name="main">主</van-radio>
                <van-radio name="supporting">配</van-radio>
                <van-radio name="extra">群</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          
          <van-cell-group title="外观设置">
            <van-field label="性别">
              <template #input>
                <van-radio-group v-model="characterForm.appearance.gender" direction="horizontal">
                  <van-radio name="male">男性</van-radio>
                  <van-radio name="female">女性</van-radio>
                  <van-radio name="other">其他</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field label="年龄" v-model="characterForm.appearance.age" placeholder="请输入年龄" />
            <van-field label="风格" v-model="characterForm.appearance.style" placeholder="如：商务、休闲、正式" />
            <van-field label="外观描述" v-model="characterForm.appearance.description" type="textarea" rows="2" placeholder="请输入外观描述" />
          </van-cell-group>
          
          <van-cell-group title="语音设置">
            <van-field label="语音类型" v-model="characterForm.voice.voiceId" placeholder="请选择语音类型" />
            <van-field label="音调" type="number" v-model="characterForm.voice.pitch" placeholder="0.5-2.0" />
            <van-field label="语速" type="number" v-model="characterForm.voice.speed" placeholder="0.5-2.0" />
            <van-field label="情感风格" v-model="characterForm.voice.emotion" placeholder="如：开心、严肃、温柔" />
          </van-cell-group>
        </div>
        
        <div class="dialog-footer">
          <van-button block type="primary" @click="saveCharacter">
            {{ editingCharacter ? '保存' : '添加' }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import type { DialogueCharacter } from '../types'

// Props定义
interface Props {
  /** 当前选中的角色ID */
  selectedCharacterId?: string
}

// Events定义
interface Emits {
  (e: 'select-character', character: DialogueCharacter | null): void
  (e: 'character-added', character: DialogueCharacter): void
  (e: 'character-updated', character: DialogueCharacter): void
  (e: 'character-deleted', characterId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedCharacterId: ''
})

const emit = defineEmits<Emits>()

// 响应式数据
const characters = ref<DialogueCharacter[]>([
  // 默认角色数据
  {
    id: 'character_1',
    name: '小明',
    description: '一个活泼开朗的男孩',
    roleType: 'main',
    appearance: {
      gender: 'male',
      age: '20岁',
      style: '休闲',
      description: '短发，穿着休闲装，笑容阳光'
    },
    voice: {
      voiceId: 'male_young',
      pitch: 1.0,
      speed: 1.0,
      emotion: '开朗'
    }
  },
  {
    id: 'character_2',
    name: '小红',
    description: '一个温柔文静的女孩',
    roleType: 'supporting',
    appearance: {
      gender: 'female',
      age: '19岁',
      style: '甜美',
      description: '长发，穿着连衣裙，文静温柔'
    },
    voice: {
      voiceId: 'female_young',
      pitch: 1.2,
      speed: 0.9,
      emotion: '温柔'
    }
  }
])

const showAddDialog = ref(false)
const editingCharacter = ref<DialogueCharacter | null>(null)

// 角色表单
const characterForm = reactive<DialogueCharacter>({
  id: '',
  name: '',
  description: '',
  avatar: '',
  roleType: 'main',
  appearance: {
    gender: 'male',
    age: '',
    style: '',
    description: ''
  },
  voice: {
    voiceId: 'standard',
    pitch: 1.0,
    speed: 1.0,
    emotion: '普通'
  }
})

// 选择角色
const selectCharacter = (character: DialogueCharacter) => {
  emit('select-character', character)
}

// 编辑角色
const editCharacter = (character: DialogueCharacter) => {
  editingCharacter.value = character
  characterForm.id = character.id
  characterForm.name = character.name
  characterForm.description = character.description || ''
  characterForm.avatar = character.avatar || ''
  characterForm.appearance = { ...character.appearance }
  characterForm.voice = { ...character.voice }
  showAddDialog.value = true
}

// 删除角色
const deleteCharacter = async (characterId: string) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这个角色吗？'
    })
    
    const index = characters.value.findIndex(c => c.id === characterId)
    if (index !== -1) {
      characters.value.splice(index, 1)
      emit('character-deleted', characterId)
      showToast('角色已删除')
    }
  } catch {
    // 用户取消删除
  }
}

// 保存角色
const saveCharacter = () => {
  if (!characterForm.name.trim()) {
    showToast('请输入角色名称')
    return
  }
  
  if (editingCharacter.value) {
    // 编辑现有角色
    const index = characters.value.findIndex(c => c.id === characterForm.id)
    if (index !== -1) {
      characters.value[index] = { ...characterForm }
      emit('character-updated', characters.value[index])
      showToast('角色已更新')
    }
  } else {
    // 添加新角色
    const newCharacter: DialogueCharacter = {
      ...characterForm,
      id: `character_${Date.now()}`
    }
    characters.value.push(newCharacter)
    emit('character-added', newCharacter)
    showToast('角色已添加')
  }
  
  closeDialog()
}

// 关闭弹窗
const closeDialog = () => {
  showAddDialog.value = false
  editingCharacter.value = null
  
  // 重置表单
  characterForm.id = ''
  characterForm.name = ''
  characterForm.description = ''
  characterForm.avatar = ''
  characterForm.roleType = 'main'
  characterForm.appearance = {
    gender: 'male',
    age: '',
    style: '',
    description: ''
  }
  characterForm.voice = {
    voiceId: 'standard',
    pitch: 1.0,
    speed: 1.0,
    emotion: '普通'
  }
}

// 删除选中的角色（右上角叉号）
const deleteSelectedCharacter = async (characterId: string) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这个角色吗？'
    })
    
    const index = characters.value.findIndex(c => c.id === characterId)
    if (index !== -1) {
      characters.value.splice(index, 1)
      emit('character-deleted', characterId)
      showToast('角色已删除')
      
      // 如果删除的是当前选中的角色，清空选中状态
      if (props.selectedCharacterId === characterId) {
        emit('select-character', null)
      }
    }
  } catch {
    // 用户取消删除
  }
}

// 获取角色类型标签
const getRoleTypeLabel = (roleType: string|any) => {
  const roleMap:any = {
    'main': '主',
    'supporting': '配',
    'extra': '群'
  }
  return roleMap[roleType] || '未定义'
}

// 暴露方法给父组件
defineExpose({
  characters
})
</script>

<style lang="scss" scoped>
.character-manager {
  .character-list {
    .character-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 12px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .avatar-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--van-primary-color);
        color: white;
        font-weight: bold;
      }
    }
    
    .cell-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .delete-icon {
        color: var(--van-danger-color);
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.05);
        transition: background-color 0.2s;
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }
    
    .selected {
      background-color: var(--van-primary-color-light);
    }
  }
  
  .character-dialog {
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    padding: 16px;
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      .dialog-title {
        font-size: 18px;
        font-weight: 500;
      }
    }
    
    .dialog-content {
      margin-bottom: 20px;
    }
    
    .dialog-footer {
      margin-top: 20px;
    }
  }
}
</style>