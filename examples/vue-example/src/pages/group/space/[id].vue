<template> 
  <sdkwork-page-container safe-area theme-mode="auto" scrollable>
    <sdkwork-group-space :group-id="id" @back="handleBack" @enter-group="handleEnterGroup" />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import SdkworkGroupSpace from '@/components/sdkwork-group-space/sdkwork-group-space.vue'

// 获取路由参数
const route: any = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

definePage({
  meta: {
    title: '群空间',
    hideHeader: true
  }
})

// 处理返回
const handleBack = () => {
  router.back()
}

// 处理进入群组
const handleEnterGroup = (group: any) => { 
  // 实际项目中这里可以跳转到群聊页面
  // router.push(`/chat/${group.id}`)
}
</script>

<style scoped>
.group-space-page {
  height: 100vh;
  background: var(--bg-page, #f7f8fa);
}

/* 主题样式 */
.theme-light {
  --bg-page: #f7f8fa;
}

.theme-dark {
  --bg-page: #0a0a0a;
}
</style>