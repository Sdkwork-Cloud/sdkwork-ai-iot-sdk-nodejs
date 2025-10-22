<template>
  <div class="chat-avatar">
    <div class="caller-info">
      <div class="caller-avatar">
        <!-- 头像容器 -->
        <div class="avatar-container" :class="{ 'speaking-active': isSpeaking }">
          <!-- 科技感光环效果 -->
          <div class="tech-halo" :class="{ active: isSpeaking }">
            <div class="halo-ring halo-1"></div>
            <div class="halo-ring halo-2"></div>
            <div class="halo-ring halo-3"></div>
          </div>
          
          <!-- 使用iconify图标作为默认头像 -->
          <div v-if="useDefaultAvatar" class="default-avatar-icon">
            <Icon :icon="defaultAvatarIcon" width="80" height="80" />
          </div>
          <img 
            v-else
            :src="displayAvatar" 
            alt="对方头像" 
            class="avatar-image"
            @error="handleAvatarError"
          />
          
          <!-- 动态粒子效果 -->
          <div class="particles-container" v-if="isSpeaking">
            <div class="particle" v-for="particle in particles" :key="particle.id" 
                 :style="particle.style"></div>
          </div>
          
          <!-- AI助手标识 -->
          <div class="ai-badge" v-if="callerName.includes('AI')">
            <span>🤖 AI</span>
          </div>
        </div>
      </div>
      <div class="caller-name">{{ callerName }}</div>
      
      <!-- 状态文字提示 -->
      <div class="status-text" :class="{ active: isSpeaking }">
        {{ speakStateText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useAgent } from '@/hooks/useAgent'

interface Props {
  callerName: string
  callerAvatar: string
  isSpeaking?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSpeaking: false
})

const { speakStateText } = useAgent()

// 默认头像图标
const defaultAvatarIcon = ref('mdi:account-circle')
const useDefaultAvatar = ref(false)

// 显示的头像URL
const displayAvatar = ref(props.callerAvatar)

// 头像加载错误处理
const handleAvatarError = () => {
  console.warn('头像加载失败，使用默认头像')
  useDefaultAvatar.value = true
}

// 根据callerName选择不同的默认图标
const updateDefaultAvatarIcon = () => {
  if (props.callerName.includes('AI') || props.callerName.includes('助手')) {
    defaultAvatarIcon.value = 'mdi:robot'
  } else if (props.callerName.includes('客服')) {
    defaultAvatarIcon.value = 'mdi:headset'
  } else if (props.callerName.includes('管理员')) {
    defaultAvatarIcon.value = 'mdi:shield-account'
  } else {
    defaultAvatarIcon.value = 'mdi:account-circle'
  }
}

// 粒子效果
interface Particle {
  id: number
  style: {
    left: string
    top: string
    animationDelay: string
    backgroundColor: string
  }
}

const particles = ref<Particle[]>([])

// 生成粒子效果
const generateParticles = () => {
  particles.value = []
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const distance = 70 + Math.random() * 30
    const left = 50 + Math.cos(angle) * distance
    const top = 50 + Math.sin(angle) * distance
    
    particles.value.push({
      id: i,
      style: {
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${i * 0.2}s`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
      }
    })
  }
}

// 语音波形动画状态
const waveAmplitudes = ref([0.3, 0.5, 0.7, 0.9, 0.7, 0.5, 0.3, 0.1])

// 获取波形样式
const getWaveStyle = (index: number) => {
  const amplitude = waveAmplitudes.value[index - 1]
  return {
    height: `${amplitude * 100}%`,
    animationDelay: `${index * 0.1}s`
  }
}

// 更新波形动画
let waveInterval: number

const updateWaveAnimation = () => {
  if (props.isSpeaking) {
    waveAmplitudes.value = waveAmplitudes.value.map(() => 
      Math.random() * 0.6 + 0.4 // 0.4 到 1.0 之间的随机高度
    )
  } else {
    // 不说话时波形逐渐减小
    waveAmplitudes.value = waveAmplitudes.value.map(amp => 
      Math.max(0.1, amp * 0.8)
    )
  }
}

onMounted(() => {
  // 启动波形动画
  waveInterval = setInterval(updateWaveAnimation, 200)
  
  // 如果初始头像为空，直接使用默认头像
  if (!props.callerAvatar) {
    useDefaultAvatar.value = true
  }
  
  // 更新默认头像图标
  updateDefaultAvatarIcon()
  
  // 监听说话状态变化
  watch(() => props.isSpeaking, (newVal) => {
    if (newVal) {
      generateParticles()
    }
  }, { immediate: true })
  
  // 监听callerName变化
  watch(() => props.callerName, () => {
    updateDefaultAvatarIcon()
  })
})

onUnmounted(() => {
  clearInterval(waveInterval)
})
</script>

<style scoped lang="scss">
.chat-avatar {
  .caller-info {
    margin-bottom: 40px;
    text-align: center;
    
    .caller-avatar {
      position: relative;
      margin-bottom: 20px;
      
      .avatar-container {
        position: relative;
        display: inline-block;
        transition: all 0.5s ease;
        
        &.speaking-active {
          transform: scale(1.05);
          filter: drop-shadow(0 0 20px rgba(76, 217, 100, 0.5));
        }
        
        // 科技感光环效果
        .tech-halo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 180px;
          height: 180px;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.5s ease;
          
          &.active {
            opacity: 1;
          }
          
          .halo-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            border: 2px solid transparent;
            animation: haloRotate 3s linear infinite;
            
            &.halo-1 {
              width: 180px;
              height: 180px;
              border-color: rgba(76, 217, 100, 0.6);
              animation-delay: 0s;
            }
            
            &.halo-2 {
              width: 200px;
              height: 200px;
              border-color: rgba(102, 126, 234, 0.4);
              animation-delay: 1s;
            }
            
            &.halo-3 {
              width: 220px;
              height: 220px;
              border-color: rgba(150, 76, 234, 0.3);
              animation-delay: 2s;
            }
          }
          
          @keyframes haloRotate {
            0% {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
        }
        
        .avatar-image {
          width: 120px;
          height: 120px;
          border-radius: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          z-index: 2;
          position: relative;
          transition: all 0.3s ease;
        }
        
        // 默认头像图标样式
        .default-avatar-icon {
          width: 120px;
          height: 120px;
          border-radius: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 4px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          position: relative;
          transition: all 0.3s ease;
          
          :deep(svg) {
            color: white;
            opacity: 0.9;
          }
        }
        
        // 动态粒子效果
        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          
          .particle {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            animation: particleFloat 2s ease-in-out infinite;
            
            @keyframes particleFloat {
              0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0;
              }
              50% {
                transform: translate(var(--tx, 0), var(--ty, 0)) scale(1.5);
                opacity: 1;
              }
            }
          }
        }
        
        // AI助手标识
        .ai-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          z-index: 4;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      }
    }
    
    .caller-name {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    // 状态文字提示
    .status-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      transition: all 0.3s ease;
      opacity: 0.7;
      
      &.active {
        color: #4CD964;
        opacity: 1;
        font-weight: 600;
        animation: textGlow 2s ease-in-out infinite;
        
        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(76, 217, 100, 0.5);
          }
          50% {
            text-shadow: 0 0 15px rgba(76, 217, 100, 0.8);
          }
        }
      }
    }
  }
}
</style>