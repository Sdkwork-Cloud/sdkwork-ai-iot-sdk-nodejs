<template>
    <div class="sdkwork-group-profile" :class="themeClass"> 

        <!-- 群组详细信息列表 -->
        <div class="profile-content">
            <van-cell-group inset>
                <!-- 群头像 - 第一个选项 -->
                <van-cell title="群头像" is-link @click="handleAvatarClick" :value="group?.avatar ? '已设置' : '未设置'">
                    <template #icon>
                        <div>
                            <Icon icon="carbon:image" class="cell-icon" />
                        </div>

                    </template>
                </van-cell>

                <!-- 群二维码 -->
                <van-cell title="群二维码" is-link @click="handleQRCodeClick" value="点击查看">
                    <template #icon>
                        <div>
                            <Icon icon="mdi:qrcode" class="cell-icon" />
                        </div>
                    </template>
                </van-cell>

                <!-- 群公告 -->
                <van-cell title="群公告" is-link @click="handleAnnouncementClick" :value="announcement || '未设置'">
                    <template #icon>
                        <div>
                            <Icon icon="tabler:volume" class="cell-icon" />
                        </div>

                    </template>
                </van-cell>
            </van-cell-group>

            <van-cell-group inset>
                <!-- 群标签 -->
                <van-cell title="群标签">
                    <template #icon>
                        <div>
                            <Icon icon="tabler:tag" class="cell-icon" />
                        </div>

                    </template>
                    <template #value>
                        <div class="tags-container">
                            <van-tag v-for="tag in group?.tags?.slice(0, 3)" :key="tag" type="primary" plain
                                class="group-tag">
                                {{ tag }}
                            </van-tag>
                            <span v-if="group?.tags && group.tags.length > 3" class="more-tags">
                                +{{ group.tags.length - 3 }}
                            </span>
                            <span v-if="!group?.tags || group.tags.length === 0" class="no-tags">暂无标签</span>
                        </div>
                    </template>
                </van-cell>

                <!-- 群类型 -->
                <van-cell title="群类型" :value="groupType">
                    <template #icon>
                        <div>
                            <Icon icon="carbon:apps" class="cell-icon" />
                        </div>

                    </template>
                </van-cell>

                <!-- 群创建时间 -->
                <van-cell title="创建时间" :value="formatDate(group?.createdAt)">
                    <template #icon>
                        <div>
                            <Icon icon="carbon:time" class="cell-icon" />
                        </div>

                    </template>
                </van-cell>
            </van-cell-group>

            <van-cell-group inset>
                <!-- 成员数量 -->
                <van-cell title="成员数量"
                    :value="`${group?.memberCount || 0}人${group?.maxMembers ? `/ ${group.maxMembers}人` : ''}`">
                    <template #icon>
                        <div>
                            <Icon icon="tabler:users-group" class="cell-icon" />
                        </div>

                    </template>
                </van-cell>

                <!-- 消息数量 -->
                <van-cell title="消息数量" :value="`${formatNumber(group?.messageCount || 0)}条`">
                    <template #icon>
                        <div>
                            <Icon icon="tabler:message-circle" class="cell-icon" />
                        </div>

                    </template>
                </van-cell>

                <!-- 群价格 -->
                <van-cell title="入群费用" :value="`¥${group?.price || 0}`">
                    <template #icon>
                        <div>
                            <Icon icon="tabler:coin" class="cell-icon" />
                        </div>

                    </template>
                </van-cell>
            </van-cell-group>

            <!-- 管理选项 - 仅群管理员可见 -->
            <van-cell-group inset v-if="isGroupAdmin">
                <van-cell title="群管理" is-link @click="handleGroupManagement">
                    <template #icon>
                        <div>
                            <Icon icon="tabler:settings" class="cell-icon" />
                        </div>

                    </template>
                </van-cell>

                <van-cell title="成员管理" is-link @click="handleMemberManagement">
                    <template #icon>
                        <div>
                            <Icon icon="tabler:user-shield" class="cell-icon" />
                        </div>

                    </template>
                </van-cell>
            </van-cell-group>

            <!-- 危险区域 -->
            <van-cell-group inset>
                <van-cell title="举报群组" is-link @click="handleReportGroup">
                    <template #icon>
                        <div>
                            <Icon icon="tabler:alert-triangle" class="cell-icon danger" />
                        </div>

                    </template>
                </van-cell>
            </van-cell-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { useTheme } from '@/hooks/theme/useTheme'
import { Icon } from '@iconify/vue'

// 定义类型
interface Group {
    id: string
    name: string
    avatar?: string
    coverImage?: string
    description?: string
    tags?: string[]
    memberCount: number
    maxMembers?: number
    messageCount: number
    price: number
    isOfficial?: boolean
    isVerified?: boolean
    isHot?: boolean
    isJoined?: boolean
    type?: string
    createdAt?: string
}

// Props定义
interface Props {
    group?: Group
    isGroupAdmin?: boolean
    announcement?: string
}

const props = withDefaults(defineProps<Props>(), {
    group: undefined,
    isGroupAdmin: false,
    announcement: ''
})

// 事件定义
interface Emits {
    (e: 'back'): void
}

const emit = defineEmits<Emits>()

// 路由
const router = useRouter()

// 主题hook
const { currentTheme } = useTheme()
const themeClass = computed(() => `theme-${currentTheme.value}`)

// 默认图片
const defaultAvatar = 'https://picsum.photos/seed/default-avatar/200/200.jpg'

// 计算属性
const groupType = computed(() => {
    if (!props.group?.type) return '普通群'

    const typeMap: Record<string, string> = {
        'public': '公开群',
        'private': '私密群',
        'paid': '付费群',
        'official': '官方群'
    }

    return typeMap[props.group.type] || '普通群'
})

// 处理返回
const handleBack = () => {
    emit('back')
}

// 处理头像点击 - 进入群二维码页面
const handleAvatarClick = () => {
    if (props.group?.id) {
        router.push(`/group/qr-code/${props.group.id}`)
    }
}

// 处理二维码点击
const handleQRCodeClick = () => {
    if (props.group?.id) {
        router.push(`/group/qr-code/${props.group.id}`)
    }
}

// 处理群公告点击
const handleAnnouncementClick = () => {
    showToast('群公告功能开发中')
}

// 处理群管理
const handleGroupManagement = () => {
    showToast('群管理功能开发中')
}

// 处理成员管理
const handleMemberManagement = () => {
    showToast('成员管理功能开发中')
}

// 处理举报群组
const handleReportGroup = () => {
    showConfirmDialog({
        title: '举报群组',
        message: '确定要举报该群组吗？',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    })
        .then(() => {
            showToast('举报已提交')
        })
        .catch(() => {
            // 取消举报
        })
}

// 处理头像错误
const handleAvatarError = () => {
    console.log('头像加载失败')
}

// 格式化数字
const formatNumber = (num: number) => {
    if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w'
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
}

// 格式化日期
const formatDate = (dateStr?: string) => {
    if (!dateStr) return '未知'

    try {
        const date = new Date(dateStr)
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    } catch {
        return '未知'
    }
}
</script>

<style scoped>
.sdkwork-group-profile {
    min-height: 100vh;
    background-color: var(--bg-page, #f7f8fa);
}

.profile-header {
    position: relative;
    padding: 20px 16px;
    background: linear-gradient(135deg, var(--color-primary, #1989fa), var(--color-primary-light, #4da6ff));
    color: white;
    overflow: hidden;
}

.profile-header::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
    transform: rotate(30deg);
    pointer-events: none;
}

.avatar-section {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.avatar-section:hover {
    transform: translateY(-2px);
}

.avatar-container {
    position: relative;
    margin-right: 16px;
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-large, 12px);
    border: 3px solid rgba(255, 255, 255, 0.3);
    box-shadow: var(--shadow-light);
    object-fit: cover;
}

.official-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--color-warning, #ff976a);
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 8px;
    box-shadow: var(--shadow-light);
    font-weight: 500;
}

.verified-badge {
    position: absolute;
    bottom: -4px;
    right: -4px;
    background: var(--color-success, #07c160);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: var(--shadow-light);
}

.arrow-icon {
    color: rgba(255, 255, 255, 0.8);
    margin-left: 8px;
}

.basic-info {
    flex: 1;
}

.group-name {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.group-description {
    font-size: 14px;
    opacity: 0.9;
    margin: 0;
    line-height: 1.5;
}

.profile-content {
    padding: 16px 0;
    padding-bottom: 24px;
}

/* 为每个cell-group添加间距 */
.profile-content .van-cell-group {
    margin-bottom: 12px;
}

/* 最后一个cell-group不需要底部间距 */
.profile-content .van-cell-group:last-child {
    margin-bottom: 0;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}

.group-tag {
    font-size: 12px;
}

.more-tags {
    font-size: 12px;
    color: var(--text-secondary, #969799);
}

.no-tags {
    font-size: 13px;
    color: var(--text-secondary, #969799);
}

.cell-icon {
    font-size: 16px;
    margin-right: 8px;
    color: var(--color-primary, #1989fa);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cell-icon.danger {
    color: var(--color-danger, #ee0a24);
}

/* 主题样式变量 */
.theme-light {
    --bg-page: #f7f8fa;
    --bg-card: #ffffff;
    --text-primary: #323233;
    --text-secondary: #969799;
    --color-primary: #1989fa;
    --color-primary-light: #4da6ff;
    --color-success: #07c160;
    --color-danger: #ee0a24;
    --color-warning: #ff976a;
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
    --color-primary-light: #1a3c5c;
    --color-success: #07c160;
    --color-danger: #ee0a24;
    --color-warning: #ff976a;
    --shadow-light: 0 1px 4px rgba(0, 0, 0, 0.2);
    --radius: 8px;
    --radius-large: 12px;
}
</style>