<template>
  <sdkwork-chat-component :conversation-id="conversationId" :default-mode="defaultMode" @back="handleBack" @mode-change="handleModeChange" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import SdkworkChatComponent from '@/components/sdkwork-chat-component/sdkwork-chat-component.vue'

const route = useRoute()
const router = useRouter()

// 从路由参数获取会话ID
const conversationId = computed(() => {
  const params = route.params as { id: string | string[] }
  const id = params.id
  return Array.isArray(id) ? id[0] : id || ''
})

// 从路由参数获取默认模式
const defaultMode = computed(() => {
  const query = route.query
  if (query.mode === 'voice') {
    return 'voice'
  }
  return 'text'
})

const handleBack = () => {
  router.back()
}

const handleModeChange = (newMode: 'text' | 'voice') => {
  console.log('模式切换:', newMode)
}

onMounted(() => {
  console.log('加载对话:', conversationId.value)
  console.log('默认模式:', defaultMode.value)
})
</script>

<style scoped lang="scss"></style>

<route>
{
  meta: {
    layout: 'default',
    title: '对话详情',
    hideHeader: true
  }
}
</route>