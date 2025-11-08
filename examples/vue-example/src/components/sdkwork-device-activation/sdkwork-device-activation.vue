<template>
  <div class="sdkwork-device-activation">

    <!-- 激活码输入区域 -->
    <div class="activation-content">
      <div class="activation-icon">
        <Icon icon="mdi:key" width="60" color="#1989fa" />
      </div>

      <div class="activation-title">输入激活码</div>
      <div v-if="urlCode" class="activation-subtitle">已从链接获取激活码，请确认后激活</div>
      <div v-else class="activation-subtitle">请输入您的设备激活码，激活后将可正常使用设备功能</div>

      <!-- 激活码输入框 -->
      <van-field v-model="activationCode" :placeholder="urlCode ? '从链接获取的激活码' : '请输入激活码'" :maxlength="20" clearable
        :readonly="isLoading" class="activation-input" @input="handleInput">
        <template #extra>
          <Icon icon="mdi:qrcode-scan" width="20" color="#1989fa" @click="handleScan" />
        </template>
      </van-field>

      <!-- 激活按钮 -->
      <van-button type="primary" size="large" :loading="isLoading" :disabled="!isValidCode" @click="handleActivate"
        class="activation-button">
        {{ isLoading ? '激活中...' : '激活设备' }}
      </van-button>

      <!-- 激活状态显示 -->
      <div v-if="activationStatus" class="activation-status">
        <Icon :icon="activationStatus.icon" :color="activationStatus.color" width="24" />
        <span :class="['status-text', activationStatus.type]">
          {{ activationStatus.message }}
        </span>

        <!-- 激活成功后的返回按钮 -->
        <van-button v-if="activationStatus.type === 'success'" type="default" size="small" @click="handleBack"
          class="back-button">
          返回
        </van-button>
      </div>

      <!-- 帮助信息 -->
      <div class="help-section">
        <van-cell title="找不到激活码？" is-link @click="showHelp = true">
          <template #icon>
            <Icon icon="mdi:help-circle-outline" width="18" color="#969799" />
          </template>
        </van-cell>
      </div>
    </div>

    <!-- 帮助弹窗 -->
    <van-popup :show="showHelp" @update:show="showHelp = $event" round position="bottom" :style="{ height: '60%' }">
      <div class="help-popup">
        <van-nav-bar title="激活帮助" left-text="关闭" @click-left="showHelp = false" />

        <div class="help-content">
          <van-cell-group title="激活码获取方式">
            <van-cell title="1. 查看设备包装盒" value="通常在设备底部或侧面" />
            <van-cell title="2. 联系客服获取" value="提供设备序列号" />
            <van-cell title="3. 购买凭证" value="查看购买订单详情" />
          </van-cell-group>

          <van-cell-group title="常见问题">
            <van-cell title="激活码无效" value="请检查输入是否正确" />
            <van-cell title="已激活的设备" value="无需重复激活" />
            <van-cell title="激活失败" value="请检查网络连接" />
          </van-cell-group>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import { Icon } from '@iconify/vue'
import type { SdkworkAIoTClient } from 'sdkwork-ai-iot-sdk'
import { IotDeviceService } from '@/services'

// Props 定义
interface Props {
  /** 设备ID */
  deviceId?: string
  /** SDK 客户端实例 */
  client?: SdkworkAIoTClient
  /** 是否从URL参数读取激活码 */
  autoFillFromUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  deviceId: '',
  client: undefined,
  autoFillFromUrl: true
})

// Emit 事件定义
const emit = defineEmits<{
  /** 激活成功事件 */
  activated: [deviceId: string, activationCode: string]
  /** 激活失败事件 */
  failed: [error: string]
  /** 返回事件 */
  back: []
  /** URL参数激活码已填充事件 */
  urlCodeFilled: [code: string]
}>()

// 响应式数据
const activationCode = ref('')
const isLoading = ref(false)
const activationStatus = ref<{
  type: 'success' | 'error' | 'warning'
  message: string
  icon: string
  color: string
} | null>(null)
const showHelp = ref(false)
const urlCode = ref('') // 从URL参数获取的激活码

// 计算属性
const isValidCode = computed(() => {
  const code = activationCode.value.trim()
  return code.length >= 8 && code.length <= 20 && /^[A-Z0-9]+$/.test(code)
})

// 方法
/** 从URL参数获取激活码 */
const getCodeFromUrl = (): string => {
  if (typeof window === 'undefined') return ''

  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code') || urlParams.get('activationCode') || urlParams.get('key')

  if (code && isValidCodeFormat(code)) {
    return code.toUpperCase()
  }

  return ''
}

/** 验证激活码格式 */
const isValidCodeFormat = (code: string): boolean => {
  const trimmedCode = code.trim()
  return trimmedCode.length >= 8 && trimmedCode.length <= 20 && /^[A-Z0-9]+$/i.test(trimmedCode)
}

/** 填充URL参数中的激活码 */
const fillCodeFromUrl = () => {
  if (!props.autoFillFromUrl) return

  const codeFromUrl = getCodeFromUrl()
  if (codeFromUrl) {
    urlCode.value = codeFromUrl
    activationCode.value = codeFromUrl
    console.log('从URL参数获取激活码:', codeFromUrl)
    emit('urlCodeFilled', codeFromUrl)

    // 显示提示信息
    showToast('已从链接获取激活码')
  }
}

const handleBack = () => {
  emit('back')
}

const handleInput = () => {
  // 清除之前的激活状态
  if (activationStatus.value) {
    activationStatus.value = null
  }

  // 如果用户手动修改了URL参数中的激活码，清除URL标记
  if (urlCode.value && activationCode.value !== urlCode.value) {
    urlCode.value = ''
  }
}

const handleScan = () => {
  showToast('扫码功能暂未实现')
}

const handleActivate = async () => {
  if (!isValidCode.value) {
    showToast('请输入有效的激活码')
    return
  }

  isLoading.value = true

  try {
    // 使用 IotDeviceService 进行真实激活
    const deviceService = new IotDeviceService()
    let result

    // 根据设备ID是否为空选择不同的激活方法
    if (props.deviceId) {
      // 有设备ID时使用 activate 方法
      result = await deviceService.activate(props.deviceId, { code: activationCode.value })
    } else {
      // 设备ID为空时使用 activateByCode 方法
      result = await deviceService.activateByCode({ code: activationCode.value })
    }

    // 构建详细的激活成功信息
    let successMessage = '设备激活成功！'
    if (result.activateTime) {
      successMessage += `
激活时间: ${result.activateTime}`
    }
    if (result.name) {
      successMessage += `
设备名称: ${result.name}`
    }
    if (result.deviceId) {
      successMessage += `
设备ID: ${result.deviceId}`
    }
    if (result.status) {
      successMessage += `
设备状态: ${getStatusText(result.status)}`
    }

    // 激活成功
    activationStatus.value = {
      type: 'success',
      message: successMessage,
      icon: 'mdi:check-circle',
      color: '#07c160'
    }

    showToast('设备激活成功')

    // 获取实际的设备ID（可能是从激活结果中返回的）
    const actualDeviceId: any = result.deviceId || props.deviceId || '未知设备'
    emit('activated', actualDeviceId, activationCode.value)

  } catch (error) {
    // 激活失败
    const errorMessage = error instanceof Error ? error.message : '激活失败，请重试'
    activationStatus.value = {
      type: 'error',
      message: errorMessage,
      icon: 'mdi:close-circle',
      color: '#ee0a24'
    }

    showToast(errorMessage)
    emit('failed', errorMessage)
  } finally {
    isLoading.value = false
  }
}

/** 获取设备状态文本 */
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'WAIT_ACTIVATION': '等待激活',
    'INACTIVE': '未激活',
    'ACTIVE': '已激活',
    'ONLINE': '在线',
    'OFFLINE': '离线',
    'SLEEP': '休眠',
    'ERROR': '错误',
    'MAINTENANCE': '维护中',
    'UNKNOWN': '未知'
  }
  return statusMap[status] || status
}

// 生命周期钩子
onMounted(() => {
  fillCodeFromUrl()
})

// 暴露方法
defineExpose({
  /** 重置激活状态 */
  reset: () => {
    activationCode.value = ''
    activationStatus.value = null
    isLoading.value = false
    urlCode.value = ''
  },

  /** 获取激活状态 */
  getStatus: () => activationStatus.value,

  /** 设置激活码 */
  setActivationCode: (code: string) => {
    activationCode.value = code
    urlCode.value = ''
  },

  /** 从URL参数重新读取激活码 */
  refreshFromUrl: () => {
    fillCodeFromUrl()
  },

  /** 获取当前URL激活码状态 */
  getUrlCodeStatus: () => ({
    hasUrlCode: !!urlCode.value,
    urlCode: urlCode.value
  })
})
</script>

<style scoped lang="scss">
.sdkwork-device-activation {
  min-height: 100vh;
  background: #f7f8fa;

  .activation-content {
    padding: 32px 24px;
    text-align: center;

    .activation-icon {
      margin-bottom: 24px;
    }

    .activation-title {
      font-size: 20px;
      font-weight: 600;
      color: #323233;
      margin-bottom: 8px;
    }

    .activation-subtitle {
      font-size: 14px;
      color: #969799;
      line-height: 1.5;
      margin-bottom: 32px;
    }

    .activation-input {
      margin-bottom: 24px;
      border-radius: 8px;
      overflow: hidden;

      :deep(.van-field__body) {
        display: flex;
        align-items: center;
      }

      :deep(.van-field__control) {
        font-size: 16px;
        text-align: center;
        letter-spacing: 2px;
        flex: 1;
      }

      :deep(.van-field__extra) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;

        .iconify {
          font-size: 20px;
          color: #1989fa;
        }
      }
    }

    .activation-button {
      margin-bottom: 24px;
      border-radius: 8px;
      font-weight: 600;
    }

    .activation-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 24px;

      .status-text {
        font-size: 14px;
        font-weight: 500;
        text-align: center;

        &.success {
          color: #07c160;
        }

        &.error {
          color: #ee0a24;
        }

        &.warning {
          color: #ff976a;
        }
      }

      .back-button {
        margin-top: 8px;
        border-radius: 8px;
      }
    }

    .help-section {
      margin-top: 32px;

      :deep(.van-cell) {
        border-radius: 8px;

        .van-cell__left-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          .iconify {
            font-size: 18px;
            color: #969799;
          }
        }

        .van-cell__title {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .help-popup {
    height: 100%;

    .help-content {
      padding: 16px;

      :deep(.van-cell-group__title) {
        font-size: 16px;
        font-weight: 600;
        color: #323233;
        margin: 16px 0 8px;
      }

      :deep(.van-cell) {
        border-radius: 8px;
        margin-bottom: 8px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .sdkwork-device-activation {
    .activation-content {
      padding: 24px 16px;

      .activation-title {
        font-size: 18px;
      }

      .activation-subtitle {
        font-size: 13px;
      }
    }
  }
}
</style>