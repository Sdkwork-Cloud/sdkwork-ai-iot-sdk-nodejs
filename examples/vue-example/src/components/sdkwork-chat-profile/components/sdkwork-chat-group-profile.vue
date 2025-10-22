<template>
  <div class="sdkwork-chat-group-profile">
    <!-- 头部信息展示 -->
    <sdkwork-header-cell
      :user-info="headerUserInfo"
      :avatar-size="80"
      :show-online-status="showOnlineStatus"
      :show-user-id="showUserId"
      :layout="'vertical'"
      :bordered="false"
      :round="8"
      class="chat-profile-header"
      @click="handleHeaderClick"
      @avatar-click="handleAvatarClick"
      @name-click="handleNameClick"
    >
      <!-- 标签区域插槽 -->
      <template #tags>
        <slot name="header-tags">
          <van-tag type="primary" size="medium">群聊</van-tag>
          <van-tag v-if="isOnline" type="success" size="medium">在线</van-tag>
          <van-tag v-else type="default" size="medium">离线</van-tag>
        </slot>
      </template>
      
      <!-- 操作区域插槽 -->
      <template #actions>
        <slot name="header-actions">
          <van-button 
            type="primary" 
            size="small" 
            @click="handleEnterGroup"
          >
            进入群聊
          </van-button>
        </slot>
      </template>
    </sdkwork-header-cell>

    <!-- 基本信息分组 -->
    <sdkwork-cell-group title="群组信息" :border="true" :card="true" class="basic-info-group" :customStyle="{padding: '0px !important',margin: '0px !important'}">
      <sdkwork-cell 
        v-if="profileInfo?.phone" 
        title="手机号" 
        :value="profileInfo.phone" 
        icon="mdi:phone"
        is-link
        @click="handlePhoneClick"
      />
      
      <sdkwork-cell 
        v-if="profileInfo?.email" 
        title="邮箱" 
        :value="profileInfo.email" 
        icon="mdi:email"
        is-link
        @click="handleEmailClick"
      />
      
      <sdkwork-cell 
        v-if="profileInfo?.location" 
        title="地区" 
        :value="profileInfo.location" 
        icon="mdi:map-marker"
      />
      
      <sdkwork-cell 
        v-if="profileInfo?.description" 
        title="群描述" 
        :value="profileInfo.description" 
        icon="mdi:information"
      />
    </sdkwork-cell-group>

    <!-- 群组信息分组 -->
    <sdkwork-cell-group title="群组详情" :border="true" :card="true" class="group-info-group" :customStyle="{padding: '0px !important',margin: '0px !important'}">
      <sdkwork-cell 
        title="群成员" 
        :value="`${groupInfo?.memberCount}人`" 
        icon="mdi:account-group"
        is-link
        @click="handleViewMembers"
      />
      
      <sdkwork-cell 
        v-if="groupInfo?.owner" 
        title="群主" 
        :value="groupInfo?.owner.name" 
        icon="mdi:crown"
        is-link
        @click="handleViewOwner"
      />
      
      <sdkwork-cell 
        v-if="groupInfo?.createTime" 
        title="创建时间" 
        :value="groupInfo?.createTime" 
        icon="mdi:calendar-plus"
      />
      
      <sdkwork-cell 
        v-if="groupInfo?.notice" 
        title="群公告" 
        :value="groupInfo?.notice" 
        icon="mdi:bullhorn"
        is-link
        @click="handleViewNotice"
      />
      
      <sdkwork-cell 
        v-if="groupInfo?.qrCode" 
        title="群二维码" 
        icon="mdi:qrcode"
        is-link
        @click="handleViewQRCode"
      >
        <template #value>
          <img :src="groupInfo?.qrCode" alt="群二维码" class="qr-code-image" />
        </template>
      </sdkwork-cell>
    </sdkwork-cell-group>

    <!-- 操作按钮分组 -->
    <sdkwork-cell-group title="更多操作" :border="true" :card="true" class="actions-group" :customStyle="{padding: '0px !important',margin: '0px !important'}">
      <sdkwork-cell 
        title="设置备注和标签" 
        icon="mdi:pencil"
        is-link
        @click="handleSetRemark"
      />
      
      <sdkwork-cell 
        title="查找聊天记录" 
        icon="mdi:magnify"
        is-link
        @click="handleSearchChat"
      />
      
      <sdkwork-cell 
        title="发送名片" 
        icon="mdi:card-account-details"
        is-link
        @click="handleSendContact"
      />
      
      <sdkwork-cell 
        title="群管理" 
        icon="mdi:cog"
        is-link
        @click="handleGroupManage"
      />
      
      <sdkwork-cell 
        title="投诉" 
        icon="mdi:alert"
        is-link
        @click="handleComplaint"
      />
      
      <sdkwork-cell 
        v-if="!isBlocked" 
        title="加入黑名单" 
        icon="mdi:block-helper"
        is-link
        @click="handleBlock"
      />
      
      <sdkwork-cell 
        v-else 
        title="移出黑名单" 
        icon="mdi:block-helper"
        is-link
        @click="handleUnblock"
      />
    </sdkwork-cell-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { showToast } from 'vant'
import type {
  SdkworkChatGroupProfileProps,
  SdkworkChatGroupProfileEmits,
  BaseProfileInfo,
  GroupInfo
} from '../types'

const props = withDefaults(defineProps<SdkworkChatGroupProfileProps>(), {
  showOnlineStatus: true,
  showUserId: true,
  isBlocked: false,
  themeMode: 'auto'
})

const emit = defineEmits<SdkworkChatGroupProfileEmits>() 
// 计算属性
const isOnline = computed(() => {
  return props.profileInfo?.isOnline ?? false
})

const headerUserInfo = computed(() => ({
  id: props.profileInfo?.id || '',
  name: props.profileInfo?.name || '未知群组',
  avatar: props.profileInfo?.avatar,
  description: props.profileInfo?.description,
  online: isOnline.value
}))

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

const handleEnterGroup = () => {
  emit('enter-group')
  showToast('进入群聊')
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
    emit('view-owner', props.groupInfo?.owner)
    showToast(`查看群主: ${props.groupInfo?.owner.name}`)
  }
}

const handleViewNotice = () => {
  if (props.groupInfo?.notice) {
    emit('view-notice', props.groupInfo?.notice)
    showToast('查看群公告')
  }
}

const handleViewQRCode = () => {
  if (props.groupInfo?.qrCode) {
    emit('view-qrcode', props.groupInfo?.qrCode)
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

// 暴露方法给父组件
defineExpose({
  /** 获取基本信息 */
  getProfileInfo: () => props.profileInfo,
  
  /** 获取群组信息 */
  getGroupInfo: () => props.groupInfo,
  
  /** 是否在线 */
  isOnline: () => isOnline.value,
  
  /** 是否在黑名单中 */
  isBlocked: () => props.isBlocked
})
</script>

<style scoped lang="scss">
.sdkwork-chat-group-profile {
  padding: 16px;
  
  .chat-profile-header {
    margin-bottom: 16px;
  }
  
  .basic-info-group,
  .group-info-group,
  .actions-group {
    margin-bottom: 16px;
  }
  
  .qr-code-image {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
}
</style>