<template>
  <div class="chat-network">
    <div class="call-quality">
      <div class="quality-indicator" :class="getQualityClass(networkQuality)">
        <Icon icon="mingcute:signal-fill" width="16" height="16" />
        <span>网络质量: {{ networkQualityText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

type NetworkQuality = 'excellent' | 'good' | 'fair' | 'poor'

const networkQuality = ref<NetworkQuality>('excellent')

const networkQualityText = computed(() => {
  switch (networkQuality.value) {
    case 'excellent': return '优秀'
    case 'good': return '良好'
    case 'fair': return '一般'
    case 'poor': return '较差'
    default: return '未知'
  }
})

const getQualityClass = (quality: string) => {
  return `quality-${quality}`
}

// 真正的网络质量检测
const detectNetworkQuality = async (): Promise<NetworkQuality> => {
  try {
    // 使用navigator.connection API检测网络状态
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      if (connection) {
        const { effectiveType, downlink, rtt } = connection
        
        // 根据网络类型和性能指标评估质量
        if (effectiveType === '4g' && downlink > 10 && rtt < 100) return 'excellent'
        if (effectiveType === '4g' && downlink > 5 && rtt < 200) return 'good'
        if (effectiveType === '3g' && downlink > 2 && rtt < 300) return 'fair'
        return 'poor'
      }
    }
    
    // 备用方案：使用ping检测
    const latency = await measureLatency()
    if (latency < 50) return 'excellent'
    if (latency < 100) return 'good'
    if (latency < 200) return 'fair'
    return 'poor'
    
  } catch (error) {
    console.warn('网络质量检测失败:', error)
    // 默认返回良好状态
    return 'good'
  }
}

// 测量网络延迟
const measureLatency = (): Promise<number> => {
  return new Promise((resolve) => {
    const startTime = performance.now()
    
    // 使用真实的网络请求测量延迟
    fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      cache: 'no-cache',
      mode: 'no-cors'
    })
    .then(() => {
      const endTime = performance.now()
      resolve(endTime - startTime)
    })
    .catch(() => {
      // 如果请求失败，返回一个较大的延迟值
      resolve(500)
    })
  })
}
 

let qualityInterval: number
let lastQuality: NetworkQuality = 'good'
let updateCount = 0

// 防抖更新函数
const debouncedUpdateQuality = (newQuality: NetworkQuality) => {
  // 只有当质量真正变化时才更新界面
  if (newQuality !== lastQuality) {
    networkQuality.value = newQuality
    lastQuality = newQuality
    updateCount = 0
  } else {
    updateCount++
    // 每5次相同结果才更新一次，避免频繁渲染
    if (updateCount >= 5) {
      networkQuality.value = newQuality
      updateCount = 0
    }
  }
}

onMounted(() => {
  // 初始检测
  detectNetworkQuality().then(quality => {
    debouncedUpdateQuality(quality)
  })
  
  // 延长检测间隔，减少干扰（15秒一次）
  qualityInterval = setInterval(() => {
    detectNetworkQuality().then(quality => {
      debouncedUpdateQuality(quality)
    })
  }, 15000)
})

onUnmounted(() => {
  clearInterval(qualityInterval)
})
</script>

<style scoped lang="scss">
.chat-network {
  .call-quality {
    .quality-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      font-size: 14px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      &.quality-excellent {
        color: #4CD964;
        background: rgba(76, 217, 100, 0.1);
      }
      
      &.quality-good {
        color: #34C759;
        background: rgba(52, 199, 89, 0.1);
      }
      
      &.quality-fair {
        color: #FF9500;
        background: rgba(255, 149, 0, 0.1);
      }
      
      &.quality-poor {
        color: #FF3B30;
        background: rgba(255, 59, 48, 0.1);
      }
    }
  }
}
</style>