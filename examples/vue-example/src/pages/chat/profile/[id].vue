<template>
  <sdkwork-page-container>  
      <!-- 集成 sdkwork-chat-profile 组件 -->
      <sdkwork-chat-profile
        ref="profileRef"
        :profile-type="profileType"
        :profile-info="profileInfo"
        :group-info="groupInfo"
        :agent-info="agentInfo"
        :customer-service-info="customerServiceInfo"
        :show-online-status="true"
        :show-user-id="true"
        :is-blocked="isBlocked"
        :theme-mode="themeMode"
        @header-click="handleHeaderClick"
        @avatar-click="handleAvatarClick"
        @name-click="handleNameClick"
        @send-message="handleSendMessage"
        @enter-group="handleEnterGroup"
        @chat-with-agent="handleChatWithAgent"
        @phone-click="handlePhoneClick"
        @email-click="handleEmailClick"
        @view-members="handleViewMembers"
        @view-owner="handleViewOwner"
        @view-notice="handleViewNotice"
        @view-qrcode="handleViewQRCode"
        @set-remark="handleSetRemark"
        @search-chat="handleSearchChat"
        @send-contact="handleSendContact"
        @add-to-contacts="handleAddToContacts"
        @group-manage="handleGroupManage"
        @complaint="handleComplaint"
        @block="handleBlock"
        @unblock="handleUnblock"
        @custom-action="handleCustomAction"
      >
        <!-- 自定义头部标签 -->
        <template #header-tags>
          <van-tag type="primary" size="medium">详情页</van-tag>
          <van-tag v-if="isOnline" type="success" size="medium">在线</van-tag>
          <van-tag v-else type="default" size="medium">离线</van-tag>
        </template>

        <!-- 自定义头部操作 -->
        <template #header-actions>
          <van-button 
            v-if="profileType === 'user'" 
            type="primary" 
            size="small" 
            @click="handleSendMessage"
          >
            发消息
          </van-button>
          <van-button 
            v-else-if="profileType === 'group'" 
            type="primary" 
            size="small" 
            @click="handleEnterGroup"
          >
            进入群聊
          </van-button>
          <van-button 
            v-else-if="profileType === 'agent'" 
            type="primary" 
            size="small" 
            @click="handleChatWithAgent"
          >
            对话
          </van-button>
        </template>

        <!-- 自定义内容 -->
        <template #custom-content>
          <div class="custom-content-section">
            <van-cell-group title="自定义信息" :border="true" :card="true">
              <van-cell title="页面ID" :value="route.params.id" />
              <van-cell title="详情类型" :value="profileType" />
              <van-cell title="创建时间" :value="new Date().toLocaleString()" />
            </van-cell-group>
          </div>
        </template>
      </sdkwork-chat-profile> 
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import SdkworkChatProfile from '@/components/sdkwork-chat-profile/sdkwork-chat-profile.vue'
import type {
  BaseProfileInfo,
  GroupInfo,
  AgentInfo,
  CustomerServiceInfo,
  ProfileType,
  ComponentRefs
} from '@/components/sdkwork-chat-profile/types'

const route:any = useRoute()
const router = useRouter()

// 组件引用
const profileRef = ref<ComponentRefs>()

// 响应式数据
const loading = ref(true)
const error = ref(false)
const profileType = ref<ProfileType>('user')
const profileInfo = ref<BaseProfileInfo>()
const groupInfo = ref<GroupInfo>()
const agentInfo = ref<AgentInfo>()
const customerServiceInfo = ref<CustomerServiceInfo>()
const isBlocked = ref(false)
const themeMode = ref<'light' | 'dark' | 'auto'>('auto')

// 计算属性
const pageTitle = computed(() => {
  switch (profileType.value) {
    case 'user': return '用户详情'
    case 'group': return '群组详情'
    case 'agent': return '智能体详情'
    case 'customer-service': return '客服详情'
    default: return '详情'
  }
})

const isOnline = computed(() => {
  return profileInfo.value?.isOnline ?? false
})

// 模拟数据加载
const loadProfileData = async () => {
  try {
    loading.value = true
    error.value = false
    
    // 根据路由参数确定详情类型
    const id = route.params.id as string
    
    // 根据ID前缀判断类型
    if (id.startsWith('user_')) {
      profileType.value = 'user'
      profileInfo.value = {
        id: id,
        name: `用户 ${id.slice(5)}`,
        avatar: 'https://via.placeholder.com/80x80',
        description: '这是一个用户详情示例',
        phone: '13800138000',
        email: 'user@example.com',
        location: '北京市',
        gender: '男',
        company: '示例公司',
        position: '工程师',
        isOnline: Math.random() > 0.5
      }
    } else if (id.startsWith('group_')) {
      profileType.value = 'group'
      profileInfo.value = {
        id: id,
        name: `群组 ${id.slice(6)}`,
        avatar: 'https://via.placeholder.com/80x80',
        description: '这是一个群组详情示例'
      }
      groupInfo.value = {
        memberCount: 150,
        owner: {
          id: 'user_001',
          name: '群主',
          avatar: 'https://via.placeholder.com/40x40'
        },
        createTime: '2024-01-01',
        notice: '欢迎加入本群组！',
        qrCode: 'https://via.placeholder.com/100x100'
      }
    } else if (id.startsWith('agent_')) {
      profileType.value = 'agent'
      profileInfo.value = {
        id: id,
        name: `智能体 ${id.slice(6)}`,
        avatar: 'https://via.placeholder.com/80x80',
        description: '这是一个智能体详情示例'
      }
      agentInfo.value = {
        model: 'GPT-4',
        version: '1.0.0',
        category: '助手',
        usageCount: 1000,
        rating: 4.5,
        description: '这是一个功能强大的智能体'
      }
    } else if (id.startsWith('service_')) {
      profileType.value = 'customer-service'
      profileInfo.value = {
        id: id,
        name: `客服 ${id.slice(8)}`,
        avatar: 'https://via.placeholder.com/80x80',
        description: '这是一个客服详情示例'
      }
      customerServiceInfo.value = {
        workTime: '09:00-18:00',
        department: '技术支持',
        skill: '问题解决',
        responseTime: '5分钟内',
        satisfaction: 4.8
      }
    } else {
      // 默认用户类型
      profileType.value = 'user'
      profileInfo.value = {
        id: id,
        name: `用户 ${id}`,
        avatar: 'https://via.placeholder.com/80x80',
        description: '默认用户详情',
        isOnline: true
      }
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
  } catch (err) {
    console.error('加载详情数据失败:', err)
    error.value = true
    showToast('加载失败，请重试')
  } finally {
    loading.value = false
  }
}

// 事件处理函数
const handleBack = () => {
  router.back()
}

const handleHeaderClick = (event: Event) => {
  console.log('头部点击:', event)
}

const handleAvatarClick = (event: Event) => {
  console.log('头像点击:', event)
  showToast('点击了头像')
}

const handleNameClick = (event: Event) => {
  console.log('名称点击:', event)
  showToast('点击了名称')
}

const handleSendMessage = () => {
  console.log('发送消息')
  showToast('开始发送消息')
}

const handleEnterGroup = () => {
  console.log('进入群聊')
  showToast('进入群聊')
}

const handleChatWithAgent = () => {
  console.log('与智能体对话')
  showToast('开始与智能体对话')
}

const handlePhoneClick = (phone: string) => {
  console.log('手机号点击:', phone)
  showDialog({
    title: '拨打电话',
    message: `是否拨打 ${phone}？`,
    showCancelButton: true
  }).then(() => {
    showToast(`拨打: ${phone}`)
  })
}

const handleEmailClick = (email: string) => {
  console.log('邮箱点击:', email)
  showDialog({
    title: '发送邮件',
    message: `是否发送邮件到 ${email}？`,
    showCancelButton: true
  }).then(() => {
    showToast(`发送邮件到: ${email}`)
  })
}

const handleViewMembers = () => {
  console.log('查看群成员')
  showToast('查看群成员')
}

const handleViewOwner = (owner: { id: string; name: string; avatar?: string }) => {
  console.log('查看群主:', owner)
  showToast(`查看群主: ${owner.name}`)
}

const handleViewNotice = (notice: string) => {
  console.log('查看群公告:', notice)
  showToast('查看群公告')
}

const handleViewQRCode = (qrCode: string) => {
  console.log('查看群二维码:', qrCode)
  showToast('查看群二维码')
}

const handleSetRemark = () => {
  console.log('设置备注')
  showToast('设置备注和标签')
}

const handleSearchChat = () => {
  console.log('查找聊天记录')
  showToast('查找聊天记录')
}

const handleSendContact = () => {
  console.log('发送名片')
  showToast('发送名片')
}

const handleAddToContacts = () => {
  console.log('添加到通讯录')
  showToast('添加到通讯录')
}

const handleGroupManage = () => {
  console.log('群管理')
  showToast('群管理')
}

const handleComplaint = () => {
  console.log('投诉')
  showToast('投诉')
}

const handleBlock = () => {
  console.log('加入黑名单')
  isBlocked.value = true
  showToast('已加入黑名单')
}

const handleUnblock = () => {
  console.log('移出黑名单')
  isBlocked.value = false
  showToast('已移出黑名单')
}

const handleCustomAction = (action: string, data?: any) => {
  console.log('自定义操作:', action, data)
  showToast(`自定义操作: ${action}`)
}

// 生命周期
onMounted(() => {
  loadProfileData()
})

// 暴露方法
defineExpose({
  reload: loadProfileData,
  getProfileType: () => profileType.value,
  getProfileInfo: () => profileInfo.value
})
</script>

<style scoped lang="scss"> 
</style>