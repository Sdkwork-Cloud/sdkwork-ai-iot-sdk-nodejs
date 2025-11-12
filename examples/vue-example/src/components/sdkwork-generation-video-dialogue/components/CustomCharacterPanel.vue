<template>
  <div class="custom-panel">
    <van-field 
      label="角色名称" 
      v-model="characterForm.name" 
      placeholder="请输入角色名称" 
    />
    <van-field 
      label="角色描述" 
      v-model="characterForm.description" 
      type="textarea" 
      rows="2" 
      placeholder="请输入角色描述" 
    />
    <div class="avatar-field">
      <div class="field-label">角色头像</div>
      <sdkwork-avatar 
        v-model="characterForm.avatar" 
        size="80px"
        :text="characterForm.name ? characterForm.name.charAt(0).toUpperCase() : 'U'"
        uploadable
        round
        @upload="handleAvatarUpload"
      />
    </div>
    
    <!-- 语音选择 -->
    <van-field 
      label="语音" 
      readonly 
      clickable 
      :value="selectedVoiceName" 
      placeholder="请选择语音" 
      @click="$emit('show-voice-selector')"
    >
      <template #right-icon>
        <van-icon name="arrow" />
      </template>
    </van-field>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import SdkworkAvatar from '@/components/sdkwork-avatar/sdkwork-avatar.vue'

// Props
interface Props {
  modelValue?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    name: '',
    description: '',
    avatar: '',
    appearance: {
      gender: 'male',
      age: '',
      style: '',
      description: ''
    },
    voice: {
      voiceId: 'standard'
    }
  })
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'show-voice-selector'): void
}>()

// 角色表单
const characterForm = reactive({ ...props.modelValue })

// 选中的语音
const selectedVoice = ref<any>(null)

// 计算属性：选中的语音名称
const selectedVoiceName = computed(() => {
  return selectedVoice.value ? selectedVoice.value.name : characterForm.voice.voiceId
})

// 监听表单变化并触发update
import { watch } from 'vue'
watch(characterForm, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// 处理头像上传
const handleAvatarUpload = (file: File) => {
  console.log('上传头像文件:', file.name)
  // 这里可以添加上传逻辑，组件已经自动处理了预览
}

// 设置语音
const setVoice = (voice: any) => {
  selectedVoice.value = voice
  characterForm.voice.voiceId = voice.id
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
  selectedVoice.value = null
}

// 暴露方法给父组件
defineExpose({
  resetForm,
  setVoice
})
</script>

<style lang="scss" scoped>
.custom-panel {
  .avatar-field {
    margin: 16px;
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    
    .field-label {
      font-size: 14px;
      color: var(--text-secondary-color);
      margin-bottom: 12px;
    }
    
    .sdkwork-avatar {
      align-self: flex-start;
    }
  }
}
</style>