<template>
  <div class="sdkwork-product-spec">
    <sdkwork-cell-group title="规格选择">
      <sdkwork-cell
        title="已选"
        :value="selectedSpecsText"
        is-link
        @click="showSpecPopup = true"
      />
    </sdkwork-cell-group>

    <!-- 规格选择弹窗 -->
    <van-popup 
      v-model:show="showSpecPopup" 
      position="bottom" 
      round
      :style="{ height: '60%' }"
    >
      <div class="spec-popup">
        <div class="popup-header">
          <div class="popup-title">选择规格</div>
          <van-icon name="cross" @click="showSpecPopup = false" />
        </div>
        
        <div class="popup-content">
          <div class="spec-options">
            <div 
              v-for="spec in availableSpecs" 
              :key="spec.value"
              class="spec-option"
              :class="{ active: selectedSpecs.includes(spec.value) }"
              @click="selectSpec(spec.value)"
            >
              {{ spec.label }}
            </div>
          </div>
        </div>
        
        <div class="popup-footer">
          <van-button type="primary" block @click="confirmSpecs">
            确定
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import SdkworkCell from '../../sdkwork-cell/sdkwork-cell.vue'
import SdkworkCellGroup from '../../sdkwork-cell-group/sdkwork-cell-group.vue'

// 组件属性
interface Props {
  /** 可用规格列表 */
  availableSpecs?: Array<{ label: string; value: string }>
  /** 默认选中的规格 */
  defaultSpecs?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  availableSpecs: () => [
    { label: '黑色', value: 'black' },
    { label: '白色', value: 'white' },
    { label: '红色', value: 'red' },
    { label: '64GB', value: '64gb' },
    { label: '128GB', value: '128gb' },
    { label: '256GB', value: '256gb' }
  ],
  defaultSpecs: () => []
})

// 事件定义
interface Emits {
  (e: 'specs-change', specs: string[]): void
  (e: 'specs-confirm', specs: string[]): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const showSpecPopup = ref(false)
const selectedSpecs = ref<string[]>([])

// 计算属性
const selectedSpecsText = computed(() => {
  if (selectedSpecs.value.length === 0) return '请选择规格'
  
  const selectedLabels = selectedSpecs.value.map(specValue => {
    const spec = props.availableSpecs.find(s => s.value === specValue)
    return spec?.label || specValue
  })
  
  return selectedLabels.join(', ')
})

// 方法
const selectSpec = (specValue: string) => {
  const index = selectedSpecs.value.indexOf(specValue)
  if (index > -1) {
    selectedSpecs.value.splice(index, 1)
  } else {
    selectedSpecs.value.push(specValue)
  }
  
  emit('specs-change', selectedSpecs.value)
}

const confirmSpecs = () => {
  if (selectedSpecs.value.length === 0) {
    showToast('请选择至少一个规格')
    return
  }
  
  showSpecPopup.value = false
  emit('specs-confirm', selectedSpecs.value)
  showToast('规格选择成功')
}

// 初始化默认规格
if (props.defaultSpecs.length > 0) {
  selectedSpecs.value = [...props.defaultSpecs]
} else if (props.availableSpecs.length > 0) {
  selectedSpecs.value = [props.availableSpecs[0].value]
}

// 暴露方法
defineExpose({
  /** 获取当前选中的规格 */
  getSelectedSpecs: () => selectedSpecs.value,
  
  /** 设置选中的规格 */
  setSelectedSpecs: (specs: string[]) => {
    selectedSpecs.value = specs
    emit('specs-change', specs)
  },
  
  /** 打开规格选择弹窗 */
  openSpecPopup: () => {
    showSpecPopup.value = true
  },
  
  /** 关闭规格选择弹窗 */
  closeSpecPopup: () => {
    showSpecPopup.value = false
  },
  
  /** 清空选中的规格 */
  clearSelectedSpecs: () => {
    selectedSpecs.value = []
    emit('specs-change', [])
  }
})
</script>

<style scoped lang="scss">
.sdkwork-product-spec {
  background: var(--sdkwork-product-spec-background, #fff);
}

.spec-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid var(--sdkwork-product-spec-popup-border, #f0f0f0);
    
    .popup-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--sdkwork-product-spec-popup-title-color, #333);
    }
  }
  
  .popup-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    
    .spec-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .spec-option {
        padding: 8px 16px;
        border: 1px solid var(--sdkwork-product-spec-option-border, #ddd);
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &.active {
          border-color: var(--sdkwork-product-spec-option-active-border, #1989fa);
          background: var(--sdkwork-product-spec-option-active-background, #1989fa);
          color: #fff;
        }
        
        &:hover {
          border-color: var(--sdkwork-product-spec-option-hover-border, #1989fa);
        }
      }
    }
  }
  
  .popup-footer {
    padding: 16px;
    border-top: 1px solid var(--sdkwork-product-spec-popup-border, #f0f0f0);
  }
}
</style>