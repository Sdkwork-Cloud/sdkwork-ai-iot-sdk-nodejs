<template>
  <div class="group-profile-page">
    <SdkworkGroupProfile
      :group="groupData"
      :is-group-admin="isGroupAdmin"
      :announcement="announcement"
      @back="handleBack"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SdkworkGroupProfile from '@/components/sdkwork-group-profile/sdkwork-group-profile.vue'
definePage({
    meta: {
        title: '群信息'
    }
})
// 路由
const router = useRouter()
const route:any = useRoute()

// 获取群组ID
const groupId = ref((route.params.id as string) || '')

// 群组数据
const groupData = ref({
  id: groupId.value,
  name: '示例群组',
  avatar: 'https://picsum.photos/seed/group-avatar/200/200.jpg',
  coverImage: 'https://picsum.photos/seed/group-cover/800/300.jpg',
  description: '这是一个示例群组，用于展示群组资料页面。',
  tags: ['技术交流', '前端开发', 'Vue.js'],
  memberCount: 128,
  maxMembers: 200,
  messageCount: 3567,
  price: 9.9,
  isOfficial: true,
  isVerified: true,
  isHot: true,
  isJoined: true,
  type: 'public',
  createdAt: '2023-01-15T08:30:00Z'
})

// 是否是群管理员
const isGroupAdmin = ref(false)

// 群公告
const announcement = ref('欢迎加入本群！请遵守群规，文明交流。')

// 处理返回
const handleBack = () => {
  router.back()
}

// 获取群组数据
const fetchGroupData = async () => {
  try {
    // 这里应该调用API获取群组数据
    // const response = await api.getGroupById(groupId.value)
    // groupData.value = response.data
    
    // 模拟数据加载
    console.log('加载群组数据:', groupId.value)
    
    // 检查当前用户是否是群管理员
    // const adminResponse = await api.checkGroupAdmin(groupId.value)
    // isGroupAdmin.value = adminResponse.data.isAdmin
  } catch (error) {
    console.error('获取群组数据失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchGroupData()
})
</script>

<style scoped>
.group-profile-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>