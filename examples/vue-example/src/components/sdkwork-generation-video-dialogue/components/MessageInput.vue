<template>
  <div class="message-input">
    <!-- 输入框区域 -->
    <div class="input-container">
      <van-field
        v-model="message"
        type="textarea"
        placeholder="输入对话内容，如：小明和小红讨论周末计划"
        autosize
        maxlength="500"
        show-word-limit
        class="message-field"
      />
      
      <div class="input-actions">
        <!-- 生成对话按钮 -->
        <van-button 
          type="primary" 
          size="small" 
          @click="generateDialogue"
          :loading="generating"
          :disabled="!message.trim() || !selectedCharacterId"
        >
          生成对话
        </van-button>
      </div>
    </div>
    
    <!-- 生成选项 -->
    <div v-if="showOptions" class="generation-options">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="生成选项" name="options">
          <div class="options-content">
            <van-field label="对话数量" type="number" v-model="dialogueCount" :min="1" :max="10" />
            <van-field label="对话风格">
              <template #input>
                <van-radio-group v-model="dialogueStyle" direction="horizontal">
                  <van-radio name="casual">日常</van-radio>
                  <van-radio name="formal">正式</van-radio>
                  <van-radio name="humorous">幽默</van-radio>
                </van-radio-group>
              </template>
            </van-field>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { showToast } from 'vant'

// Props定义
interface Props {
  /** 当前选中的角色ID */
  selectedCharacterId?: string
  /** 是否正在生成对话 */
  generating?: boolean
}

// Events定义
interface Emits {
  (e: 'generate-dialogue', params: {
    content: string
    count: number
    style: string
  }): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedCharacterId: '',
  generating: false
})

const emit = defineEmits<Emits>()

// 响应式数据
const message = ref('')
const showOptions = ref(false)
const activeNames = ref(['options'])
const dialogueCount = ref(5)
const dialogueStyle = ref('casual')

// 生成对话
const generateDialogue = () => {
  if (!message.value.trim()) {
    showToast('请输入对话内容')
    return
  }
  
  if (!props.selectedCharacterId) {
    showToast('请选择一个角色')
    return
  }

  const params = {
    content: message.value.trim(),
    count: dialogueCount.value,
    style: dialogueStyle.value
  }
  
  emit('generate-dialogue', params)
}
</script>

<style lang="scss" scoped>
.message-input {
  background-color: #fff;
  border-top: 1px solid #ebedf0;
  padding: 16px;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  
  .message-field {
    flex: 1;
  }
  
  .input-actions {
    display: flex;
    gap: 8px;
  }
}

.generation-options {
  margin-top: 12px;
  
  .options-content {
    padding: 8px 0;
  }
}
</style>