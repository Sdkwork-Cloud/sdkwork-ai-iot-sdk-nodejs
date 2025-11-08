<template>
    <sdkwork-page-container>
        <sdkwork-device-activation
            :device-id="deviceId"
            :client="client"
            :auto-fill-from-url="true"
            @activated="handleActivated"
            @failed="handleFailed"
            @back="handleBack"
            @url-code-filled="handleUrlCodeFilled"
        />
    </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import SdkworkDeviceActivation from '@/components/sdkwork-device-activation/sdkwork-device-activation.vue'

// 路由和路由实例
const route:any = useRoute()
const router = useRouter()

// 设备ID（从路由参数获取）
const deviceId = ref('')

// SDK客户端实例（根据实际情况配置）
const client = ref()

// 生命周期
onMounted(() => {
    // 从路由参数获取设备ID
    const id = route.params.id as string
    if (id) {
        deviceId.value = id
        console.log('设备激活页面 - 设备ID:', id)
    } else {
        showToast('设备ID未找到') 
    }
    
    // 初始化SDK客户端（根据实际项目配置）
    // client.value = new SdkworkAIoTClient({/* 配置参数 */})
})

// 事件处理
const handleActivated = (deviceId: string, activationCode: string) => {
    console.log('设备激活成功:', { deviceId, activationCode })
    
    // 可以在这里处理激活成功后的逻辑
    // 例如：更新设备状态、跳转到设备详情页等
    
    showToast('设备激活成功')
}

const handleFailed = (error: string) => {
    console.error('设备激活失败:', error)
    
    // 可以在这里处理激活失败的逻辑
    // 例如：显示错误详情、重试机制等
    
    showToast(`激活失败: ${error}`)
}

const handleUrlCodeFilled = (code: string) => {
    console.log('从URL参数获取到激活码:', code)
    
    // 可以在这里处理URL参数激活码填充后的逻辑
    // 例如：记录日志、发送分析事件等
    
    showToast(`已自动填充激活码: ${code}`)
}

const handleBack = () => {
    // 返回上一页或设备列表页
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/device')
    }
}

// 暴露方法供外部调用（如果需要）
defineExpose({
    /** 获取设备ID */
    getDeviceId: () => deviceId.value,
    
    /** 重新加载页面 */
    reload: () => {
        // 重新加载设备信息等
        const id = route.params.id as string
        if (id) {
            deviceId.value = id
        }
    }
})
</script>

<style scoped lang="scss">
.sdkwork-page-container {
    height: 100vh;
    background: #f7f8fa;
}
</style>