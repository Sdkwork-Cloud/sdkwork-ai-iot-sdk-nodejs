<template>
  <div
    class="character-item"
    :class="{ active: selected }"
    @click="handleClick"
  >
    <!-- 左上角角色类型标记 -->
    <div class="role-type-badge" :class="roleType">
      {{ roleTypeLabel }}
    </div>
    
    <!-- 右上角删除按钮 -->
    <div class="delete-button" @click.stop="handleDelete">
      <van-icon name="cross" />
    </div>
    
    <!-- 角色头像 -->
    <div class="character-avatar">
      <img v-if="character.avatar" :src="character.avatar" :alt="character.name" />
      <div v-else class="avatar-placeholder">{{ character.name.charAt(0).toUpperCase() }}</div>
    </div>
    
    <!-- 角色名称 -->
    <div class="character-name">{{ character.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DialogueCharacter } from '../types'

// Props定义
interface Props {
  character: DialogueCharacter
  selected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false
})

// Emits定义
const emit = defineEmits<{
  'select-character': [character: DialogueCharacter]
  'delete-character': [characterId: string]
}>()

// 角色类型标签
const roleTypeLabel = computed(() => {
  const roleMap = {
    'main': '主',
    'supporting': '配',
    'extra': '群'
  }
  return roleMap[props.character.roleType || 'main'] || '未定义'
})

// 角色类型类名
const roleType = computed(() => props.character.roleType || 'main')

// 处理点击事件
const handleClick = () => {
  emit('select-character', props.character)
}

// 处理删除事件
const handleDelete = () => {
  emit('delete-character', props.character.id)
}
</script>

<style scoped>
.character-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--van-background-color);
}

.character-item:hover {
  background-color: var(--van-background-color-light);
}

.character-item.active {
  background-color: var(--van-primary-color-light);
  border: 1px solid var(--van-primary-color);
}

/* 左上角角色类型标记 */
.role-type-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  color: white;
  z-index: 1;
}

.role-type-badge.main {
  background-color: var(--van-primary-color);
}

.role-type-badge.supporting {
  background-color: var(--van-warning-color);
}

.role-type-badge.extra {
  background-color: var(--van-gray-6);
}

/* 右上角删除按钮 */
.delete-button {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--van-danger-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.character-item:hover .delete-button {
  opacity: 1;
}

.delete-button:hover {
  background-color: var(--van-danger-color-dark);
}

/* 角色头像 */
.character-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
}

.character-avatar img {
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
  font-size: 16px;
}

/* 角色名称 */
.character-name {
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>