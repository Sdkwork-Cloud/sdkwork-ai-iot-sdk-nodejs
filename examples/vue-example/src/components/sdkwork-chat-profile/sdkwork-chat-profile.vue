<template>
  <div class="sdkwork-chat-profile">
    <!-- 用户详情组件 -->
    <sdkwork-chat-user-profile
      v-if="profileType === 'user'"
      :profile-info="profileInfo"
      :show-online-status="showOnlineStatus"
      :show-user-id="showUserId"
      :is-blocked="isBlocked"
      :theme-mode="themeMode"
      @header-click="handleHeaderClick"
      @avatar-click="handleAvatarClick"
      @name-click="handleNameClick"
      @send-message="handleSendMessage"
      @phone-click="handlePhoneClick"
      @email-click="handleEmailClick"
      @set-remark="handleSetRemark"
      @search-chat="handleSearchChat"
      @send-contact="handleSendContact"
      @add-to-contacts="handleAddToContacts"
      @complaint="handleComplaint"
      @block="handleBlock"
      @unblock="handleUnblock"
      @custom-action="handleCustomAction"
    >
      <!-- 头部标签插槽 -->
      <template #header-tags>
        <slot name="header-tags" />
      </template>
      
      <!-- 头部操作插槽 -->
      <template #header-actions>
        <slot name="header-actions" />
      </template>
      
      <!-- 自定义内容插槽 -->
      <slot name="custom-content" />
    </sdkwork-chat-user-profile>

    <!-- 群组详情组件 -->
    <sdkwork-chat-group-profile
      v-else-if="profileType === 'group'"
      :profile-info="profileInfo"
      :group-info="groupInfo"
      :show-online-status="showOnlineStatus"
      :show-user-id="showUserId"
      :is-blocked="isBlocked"
      :theme-mode="themeMode"
      @header-click="handleHeaderClick"
      @avatar-click="handleAvatarClick"
      @name-click="handleNameClick"
      @enter-group="handleEnterGroup"
      @view-members="handleViewMembers"
      @view-owner="handleViewOwner"
      @view-notice="handleViewNotice"
      @view-qrcode="handleViewQRCode"
      @set-remark="handleSetRemark"
      @search-chat="handleSearchChat"
      @send-contact="handleSendContact"
      @group-manage="handleGroupManage"
      @complaint="handleComplaint"
      @block="handleBlock"
      @unblock="handleUnblock"
      @custom-action="handleCustomAction"
    >
      <!-- 头部标签插槽 -->
      <template #header-tags>
        <slot name="header-tags" />
      </template>
      
      <!-- 头部操作插槽 -->
      <template #header-actions>
        <slot name="header-actions" />
      </template>
      
      <!-- 自定义内容插槽 -->
      <slot name="custom-content" />
    </sdkwork-chat-group-profile>

    <!-- 智能体详情组件 -->
    <sdkwork-chat-agent-profile
      v-else-if="profileType === 'agent'"
      :profile-info="profileInfo"
      :agent-info="agentInfo"
      :show-online-status="showOnlineStatus"
      :show-user-id="showUserId"
      :is-blocked="isBlocked"
      :theme-mode="themeMode"
      @header-click="handleHeaderClick"
      @avatar-click="handleAvatarClick"
      @name-click="handleNameClick"
      @chat-with-agent="handleChatWithAgent"
      @rate-agent="handleRateAgent"
      @set-remark="handleSetRemark"
      @search-chat="handleSearchChat"
      @complaint="handleComplaint"
      @block="handleBlock"
      @unblock="handleUnblock"
      @custom-action="handleCustomAction"
    >
      <!-- 头部标签插槽 -->
      <template #header-tags>
        <slot name="header-tags" />
      </template>
      
      <!-- 头部操作插槽 -->
      <template #header-actions>
        <slot name="header-actions" />
      </template>
      
      <!-- 自定义内容插槽 -->
      <slot name="custom-content" />
    </sdkwork-chat-agent-profile>

    <!-- 客服详情组件 -->
    <sdkwork-chat-service-profile
      v-else-if="profileType === 'customer-service'"
      :profile-info="profileInfo"
      :service-info="customerServiceInfo"
      :show-online-status="showOnlineStatus"
      :show-user-id="showUserId"
      :is-blocked="isBlocked"
      :theme-mode="themeMode"
      @header-click="handleHeaderClick"
      @avatar-click="handleAvatarClick"
      @name-click="handleNameClick"
      @send-message="handleSendMessage"
      @phone-click="handlePhoneClick"
      @email-click="handleEmailClick"
      @set-remark="handleSetRemark"
      @search-chat="handleSearchChat"
      @complaint="handleComplaint"
      @block="handleBlock"
      @unblock="handleUnblock"
      @custom-action="handleCustomAction"
    >
      <!-- 头部标签插槽 -->
      <template #header-tags>
        <slot name="header-tags" />
      </template>
      
      <!-- 头部操作插槽 -->
      <template #header-actions>
        <slot name="header-actions" />
      </template>
      
      <!-- 自定义内容插槽 -->
      <slot name="custom-content" />
    </sdkwork-chat-service-profile>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import SdkworkChatUserProfile from './components/sdkwork-chat-user-profile.vue'
import SdkworkChatGroupProfile from './components/sdkwork-chat-group-profile.vue'
import SdkworkChatAgentProfile from './components/sdkwork-chat-agent-profile.vue'
import SdkworkChatServiceProfile from './components/sdkwork-chat-service-profile.vue'
import type {
  SdkworkChatProfileProps,
  SdkworkChatProfileEmits,
  BaseProfileInfo,
  GroupInfo,
  AgentInfo,
  CustomerServiceInfo
} from './types'

// Props 定义
interface Props extends SdkworkChatProfileProps {
  /** 是否显示在线状态 */
  showOnlineStatus?: boolean
  /** 是否显示用户ID */
  showUserId?: boolean
  /** 是否已加入黑名单 */
  isBlocked?: boolean
  /** 主题模式 */
  themeMode?: 'light' | 'dark' | 'auto'
}

const props = withDefaults(defineProps<Props>(), {
  showOnlineStatus: true,
  showUserId: true,
  isBlocked: false,
  themeMode: 'auto'
})

// Emit 事件定义
const emit = defineEmits<{
  // 头部相关事件
  'header-click': [event: Event]
  'avatar-click': [event: Event]
  'name-click': [event: Event]
  
  // 操作事件
  'send-message': []
  'enter-group': []
  'chat-with-agent': []
  'phone-click': [phone: string]
  'email-click': [email: string]
  'view-members': []
  'view-owner': [owner: { id: string; name: string; avatar?: string }]
  'view-notice': [notice: string]
  'view-qrcode': [qrCode: string]
  'set-remark': []
  'search-chat': []
  'send-contact': []
  'add-to-contacts': []
  'group-manage': []
  'complaint': []
  'block': []
  'unblock': []
  
  // 自定义事件
  'custom-action': [action: string, data?: any]
}>()

// 计算属性
const isOnline = computed(() => {
  return props.profileInfo?.isOnline ?? false
})

const headerUserInfo = computed(() => ({
  id: props.profileInfo?.id || '',
  name: props.profileInfo?.name || '未知用户',
  avatar: props.profileInfo?.avatar,
  description: props.profileInfo?.description,
  online: isOnline.value
}))

const basicInfoTitle = computed(() => {
  switch (props.profileType) {
    case 'user': return '个人信息'
    case 'group': return '群组信息'
    case 'agent': return '智能体信息'
    case 'customer-service': return '客服信息'
    default: return '基本信息'
  }
})

// 事件处理函数
const handleHeaderClick = (event: Event) => {
  emit('header-click', event)
}

const handleAvatarClick = (event: Event) => {
  emit('avatar-click', event)
}

const handleNameClick = (event: Event) => {
  emit('name-click', event)
}

const handleSendMessage = () => {
  emit('send-message')
  showToast('开始发送消息')
}

const handleEnterGroup = () => {
  emit('enter-group')
  showToast('进入群聊')
}

const handleChatWithAgent = () => {
  emit('chat-with-agent')
  showToast('开始与智能体对话')
}

const handlePhoneClick = () => {
  if (props.profileInfo?.phone) {
    emit('phone-click', props.profileInfo.phone)
    showToast(`拨打电话: ${props.profileInfo.phone}`)
  }
}

const handleEmailClick = () => {
  if (props.profileInfo?.email) {
    emit('email-click', props.profileInfo.email)
    showToast(`发送邮件: ${props.profileInfo.email}`)
  }
}

const handleViewMembers = () => {
  emit('view-members')
  showToast('查看群成员')
}

const handleViewOwner = () => {
  if (props.groupInfo?.owner) {
    emit('view-owner', props.groupInfo.owner)
    showToast(`查看群主: ${props.groupInfo.owner.name}`)
  }
}

const handleViewNotice = () => {
  if (props.groupInfo?.notice) {
    emit('view-notice', props.groupInfo.notice)
    showToast('查看群公告')
  }
}

const handleViewQRCode = () => {
  if (props.groupInfo?.qrCode) {
    emit('view-qrcode', props.groupInfo.qrCode)
    showToast('查看群二维码')
  }
}

const handleSetRemark = () => {
  emit('set-remark')
  showToast('设置备注和标签')
}

const handleSearchChat = () => {
  emit('search-chat')
  showToast('查找聊天记录')
}

const handleSendContact = () => {
  emit('send-contact')
  showToast('发送名片')
}

const handleAddToContacts = () => {
  emit('add-to-contacts')
  showToast('添加到通讯录')
}

const handleGroupManage = () => {
  emit('group-manage')
  showToast('群管理')
}

const handleComplaint = () => {
  emit('complaint')
  showToast('投诉')
}

const handleBlock = () => {
  emit('block')
  showToast('已加入黑名单')
}

const handleUnblock = () => {
  emit('unblock')
  showToast('已移出黑名单')
}
const handleCustomAction = (action: string, data?: any) => {
  emit('custom-action', action, data)
}
const handleRateAgent = () => { 
  showToast('已评价智能体')
}
// 暴露方法给父组件
defineExpose({
  /** 获取详情类型 */
  getProfileType: () => props.profileType,
  
  /** 获取基本信息 */
  getProfileInfo: () => props.profileInfo,
  
  /** 获取群组信息 */
  getGroupInfo: () => props.groupInfo,
  
  /** 获取智能体信息 */
  getAgentInfo: () => props.agentInfo,
  
  /** 获取客服信息 */
  getCustomerServiceInfo: () => props.customerServiceInfo,
  
  /** 是否在线 */
  isOnline: () => isOnline.value,
  
  /** 是否在黑名单中 */
  isBlocked: () => props.isBlocked
})
</script>

<style scoped lang="scss">
.sdkwork-chat-profile { 
  
  .chat-profile-header {
    margin-bottom: 16px;
  }
  
  .basic-info-group,
  .group-info-group,
  .agent-info-group,
  .customer-service-group,
  .actions-group {
    margin-bottom: 16px;
  }
  
  .qr-code-image {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
  
  .satisfaction-text {
    color: #07c160;
    font-weight: 500;
  }
}
</style>