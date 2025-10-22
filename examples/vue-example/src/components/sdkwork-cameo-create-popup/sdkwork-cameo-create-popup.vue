<template>
  <van-popup 
    :show="show" 
    position="bottom" 
    round
    :style="{ height: '70%' }"
    @update:show="(value) => emit('update:show', value)"
  >
    <div class="cameo-create-popup">
      <div class="popup-header">
        <h3 class="popup-title">创建角色</h3>
        <van-icon name="cross" size="20" @click="handleClose" />
      </div>
      
      <div class="popup-content">
        <van-form @submit="handleSubmit">
          <van-cell-group>
            <van-field
              v-model="formData.name"
              label="角色名称"
              placeholder="请输入角色名称"
              :rules="[{ required: true, message: '请输入角色名称' }]"
            />
            
            <van-field
              v-model="formData.description"
              label="角色描述"
              type="textarea"
              placeholder="请输入角色描述"
              rows="3"
              autosize
              :rules="[{ required: true, message: '请输入角色描述' }]"
            />
            
            <van-field
              v-model="formData.personality"
              label="性格特点"
              placeholder="请输入性格特点"
            />
            
            <van-field
              v-model="formData.background"
              label="背景设定"
              placeholder="请输入背景设定"
            />
          </van-cell-group>
          
          <div class="popup-actions">
            <van-button 
              round 
              block 
              type="primary" 
              native-type="submit"
              :loading="loading"
            >
              创建角色
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { showToast } from 'vant'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm', data: any): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单数据
const formData = ref({
  name: '',
  description: '',
  personality: '',
  background: ''
})

// 加载状态
const loading = ref(false)

// 监听show变化
watch(() => props.show, (newVal) => {
  if (!newVal) {
    // 关闭时重置表单
    formData.value = {
      name: '',
      description: '',
      personality: '',
      background: ''
    }
  }
})

// 处理提交
const handleSubmit = async () => {
  loading.value = true
  
  try {
    // 模拟创建过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showToast('角色创建成功')
    emit('confirm', formData.value)
    emit('update:show', false)
  } catch (error) {
    showToast('创建失败，请重试')
  } finally {
    loading.value = false
  }
}

// 处理关闭
const handleClose = () => {
  emit('update:show', false)
  emit('close')
}
</script>

<style scoped lang="scss">
.cameo-create-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  .popup-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.popup-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.popup-actions {
  margin-top: 24px;
  padding: 0 16px 16px;
}

// 响应式设计
@media (max-width: 768px) {
  .popup-header {
    padding: 12px;
    
    .popup-title {
      font-size: 16px;
    }
  }
  
  .popup-content {
    padding: 12px;
  }
  
  .popup-actions {
    padding: 0 12px 12px;
  }
}
</style>