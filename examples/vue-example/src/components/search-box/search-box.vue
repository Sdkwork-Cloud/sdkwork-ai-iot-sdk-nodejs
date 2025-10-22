<template>
  <div class="search-box">
    <sdkwork-search-bar
      :model-value="modelValue"
      :placeholder="placeholder"
      :shape="shape"
      :background="background"
      @update:model-value="$emit('update:modelValue', $event)"
      @search="$emit('search', $event)"
      class="custom-search"
    >
      <template #left-icon>
        <slot name="left-icon">
          <div class="search-icon">
            <Icon icon="mingcute:search-line" width="16" height="16" />
          </div>
        </slot>
      </template>
      <template #right-icon>
        <slot name="right-icon">
          <div class="clear-icon-wrapper">
            <Icon 
              v-if="modelValue" 
              icon="mingcute:close-circle-fill" 
              width="16" 
              height="16"
              @click="handleClear"
              class="clear-icon"
            />
          </div>
        </slot>
      </template>
    </sdkwork-search-bar>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  modelValue: string
  placeholder?: string
  shape?: 'round' | 'square'
  background?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '搜索',
  shape: 'round',
  background: '#f7f8fa'
})

const emit = defineEmits<Emits>()

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped lang="scss">
.search-box {
  width: 100%;
  
  :deep(.custom-search) {
    padding: 8px 12px;
    
    .sdkwork-search-bar__content {
      background: v-bind('props.background');
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      
      &:focus-within {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
      }
      
      .van-field__left-icon {
        margin-right: 8px;
        
        .search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #969799;
          transition: color 0.3s ease;
        }
      }
      
      .van-field__right-icon {
        .clear-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          
          .clear-icon {
            cursor: pointer;
            color: #c8c9cc;
            transition: all 0.3s ease;
            border-radius: 50%;
            
            &:hover {
              color: #969799;
              transform: scale(1.1);
              background: rgba(0, 0, 0, 0.05);
            }
          }
        }
      }
      
      .van-field__control {
        font-size: 14px;
        color: #333;
        
        &::placeholder {
          color: #969799;
          font-size: 14px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .search-box {
    :deep(.custom-search) {
      padding: 8px;
      
      .sdkwork-search-bar__content {
        border-radius: 16px;
        
        .van-field__control {
          font-size: 16px; // 移动端字体稍大
        }
      }
    }
  }
}
</style>