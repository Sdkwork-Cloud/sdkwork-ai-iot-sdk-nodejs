<template>
    <div class="group-qr-code-page" :class="themeClass">
        <!-- 使用sdkwork-qr-code组件 -->
        <sdkwork-qr-code :title="groupData?.name || '群组名称'" :description="groupData?.description || '群组描述'"
            :avatar="groupData?.avatar || defaultAvatar" :value="qrCodeValue" tipText="扫描二维码加入群组" :showInfo="false"
            :showAvatar="false" @save="handleSaveQRCode" @share="handleShareQRCode">
            <!-- 使用header slot传入群组信息 -->
            <template #header>
                <div class="qr-header">
                    <div class="group-info">
                        <img :src="groupData?.avatar || defaultAvatar" :alt="groupData?.name" class="group-avatar" />
                        <h2 class="group-name">{{ groupData?.name || '群组名称' }}</h2>
                        <p class="group-description">{{ groupData?.description || '群组描述' }}</p>
                    </div>
                </div>
            </template>
        </sdkwork-qr-code>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme' 
definePage({
    meta: {
        title: '群二维码'
    }
})
// 路由
const router = useRouter()
const route: any = useRoute()

// 主题hook
const { currentTheme } = useTheme()
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 获取群组ID
const groupId = ref((route.params.id as string) || '')

// 群组数据
const groupData = ref({
    id: groupId.value,
    name: '示例群组',
    avatar: 'https://picsum.photos/seed/group-avatar/200/200.jpg',
    description: '这是一个示例群组，用于展示群二维码。'
})

// 默认头像
const defaultAvatar = 'https://picsum.photos/seed/default-avatar/200/200.jpg'

// 二维码内容 - 这里应该是实际的群组链接
const qrCodeValue = computed(() => {
    // 实际项目中应该是真实的群组邀请链接
    return `https://example.com/group/invite/${groupId.value}`
})

// 处理返回
const handleBack = () => {
    router.back()
}

// 处理保存二维码
const handleSaveQRCode = (qrCodeUrl: string) => {
    showToast('二维码已保存')
    console.log('保存二维码:', qrCodeUrl)
}

// 处理分享二维码
const handleShareQRCode = (qrCodeUrl: string) => {
    showToast('分享成功')
    console.log('分享二维码:', qrCodeUrl)
}

// 获取群组数据
const fetchGroupData = async () => {
    try {
        // 这里应该调用API获取群组数据
        // const response = await api.getGroupById(groupId.value)
        // groupData.value = response.data

        // 模拟数据加载
        console.log('加载群组数据:', groupId.value)
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
.group-qr-code-page {
    min-height: 100vh;
    background-color: var(--bg-page, #f7f8fa);
}

.qr-container {
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.qr-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
    text-align: center;
    width: 100%;
}

.group-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.group-avatar {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-large, 12px);
    margin-bottom: 16px;
    box-shadow: var(--shadow-light);
}

.group-name {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: var(--text-primary, #323233);
}

.group-description {
    font-size: 14px;
    color: var(--text-secondary, #969799);
    margin: 0;
    line-height: 1.5;
    max-width: 300px;
}

/* sdkwork-qr-code 组件样式覆盖 */
.sdkwork-qr-code {
    width: 100%;
    max-width: 340px;
}

/* 主题样式变量 */
.theme-light {
    --bg-page: #f7f8fa;
    --bg-card: #ffffff;
    --text-primary: #323233;
    --text-secondary: #969799;
    --color-primary: #1989fa;
    --border-color: #ebedf0;
    --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.05);
    --radius: 8px;
    --radius-large: 12px;
}

.theme-dark {
    --bg-page: #0a0a0a;
    --bg-card: #1a1a1a;
    --text-primary: #ffffff;
    --text-secondary: #c8c9cc;
    --color-primary: #1989fa;
    --border-color: #3a3a3a;
    --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.2);
    --radius: 8px;
    --radius-large: 12px;
}
</style>