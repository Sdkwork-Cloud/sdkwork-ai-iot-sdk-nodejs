<template>
  <div class="chat-background">
    <!-- 背景选择按钮 - 左上角 -->
    <div class="background-toggle-top-left">
      <div class="background-toggle-btn" @click="toggleBackgroundMenu" :class="{ active: showBackgroundMenu }">
        <Icon icon="mingcute:palette-fill" width="20" height="20" />
      </div>
    </div>

    <!-- 背景选择菜单 -->
    <div class="background-menu" v-if="showBackgroundMenu">
      <div class="background-options">
        <div 
          class="background-option" 
          v-for="bg in backgroundOptions" 
          :key="bg.id"
          :class="{ active: selectedBackground === bg.id }"
          @click="selectBackground(bg.id)"
          :style="{ background: bg.gradient }"
        >
          <span class="bg-name">{{ bg.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'
import { Icon } from '@iconify/vue'

interface Props {
  selectedBackground: string
  backgroundOptions: Array<{ id: string; name: string; gradient: string }>
}

interface Emits {
  (e: 'update:selectedBackground', bgId: string): void
  (e: 'background-change', bgId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showBackgroundMenu = ref(false)

const toggleBackgroundMenu = () => {
  showBackgroundMenu.value = !showBackgroundMenu.value
}

const selectBackground = (bgId: string) => {
  emit('update:selectedBackground', bgId)
  emit('background-change', bgId)
  showBackgroundMenu.value = false
  showToast('背景已更换')
}
</script>

<style scoped lang="scss">
.chat-background {
  .background-toggle-top-left {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    
    .background-toggle-btn {
      width: 44px;
      height: 44px;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }
      
      &.active {
        background: rgba(0, 122, 255, 0.3);
        border-color: rgba(0, 122, 255, 0.6);
        box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
      }
    }
  }

  .background-menu {
    position: absolute;
    top: 80px;
    left: 20px;
    z-index: 20;
    
    .background-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
      padding: 16px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      
      .background-option {
        width: 80px;
        height: 60px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        
        &:hover {
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        &.active {
          border-color: #007AFF;
          box-shadow: 0 4px 16px rgba(0, 122, 255, 0.4);
        }
        
        .bg-name {
          font-size: 12px;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }
      }
    }
  }
}
</style>