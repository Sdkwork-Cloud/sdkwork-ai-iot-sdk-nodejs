<template>
 <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto" 
    backgroundColor="black !important"
    contentBackgroundColor="black !important"
  >

    <!-- 视频口播生成器组件 -->
    <sdkwork-generation-dubbing @show-help="showHelp" />
    
    <!-- 帮助弹窗 -->
    <van-popup 
      v-model:show="showHelpPanel" 
      position="bottom" 
      round
      class="help-panel"
    >
      <div class="help-content">
        <h3>使用帮助</h3>
        <div class="help-section">
          <h4>功能说明</h4>
          <p>视频口播生成器可以帮助您快速创建专业的口播视频，支持以下功能：</p>
          <ul>
            <li>📸 上传图片或选择角色库中的角色</li>
            <li>🗣️ 选择多种发音人（中英文支持）</li>
            <li>✍️ 输入口播文字，支持AI智能生成</li>
            <li>🎬 选择不同的场景和风格</li>
            <li>⚙️ 自定义视频参数配置</li>
          </ul>
        </div>
        
        <div class="help-section">
          <h4>使用步骤</h4>
          <ol>
            <li>选择角色或上传图片</li>
            <li>选择发音人</li>
            <li>输入口播文字（可使用AI生成）</li>
            <li>选择场景和风格</li>
            <li>配置视频参数</li>
            <li>点击生成按钮</li>
          </ol>
        </div>
        
        <van-button 
          type="primary" 
          size="large"
          @click="showHelpPanel = false"
          class="close-help-btn"
        >
          知道了
        </van-button>
      </div>
    </van-popup>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SdkworkGenerationDubbing from '@/components/sdkwork-generation-dubbing/sdkwork-generation-dubbing.vue'
definePage({
    meta: {
        title: '口播视频' 
    }
})
const router = useRouter()
const showHelpPanel = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 显示帮助
const showHelp = () => {
  showHelpPanel.value = true
}
</script>

<style scoped>
.dubbing-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.page-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 6px;
  width: 32px;
  height: 32px;
}

.page-title {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.help-btn {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 6px;
  width: 32px;
  height: 32px;
}

/* 帮助弹窗样式 */
.help-panel {
  height: 70vh;
}

.help-content {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.help-content h3 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.help-section {
  margin-bottom: 20px;
}

.help-section h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.help-section p {
  margin: 0 0 12px 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.help-section ul,
.help-section ol {
  margin: 0;
  padding-left: 20px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.help-section li {
  margin-bottom: 4px;
}

.close-help-btn {
  margin-top: 20px;
  border-radius: 8px;
  background: var(--gradient-primary);
  border: none;
}

/* 科技蓝主题 - 深色模式 */
:root {
  --bg-primary: #0a1629;
  --bg-secondary: #1a2438;
  --bg-card: #1e2a3d;
  --text-primary: #ffffff;
  --text-secondary: #8fa3c4;
  --accent-blue: #1890ff;
  --accent-blue-light: #40a9ff;
  --accent-blue-dark: #096dd9;
  --border-color: #2d3a4e;
  --gradient-primary: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  --gradient-secondary: linear-gradient(135deg, #1a2438 0%, #2d3a4e 100%);
  --shadow-glow: 0 0 20px rgba(24, 144, 255, 0.3);
}

/* 科技蓝主题 - 浅色模式 */
@media (prefers-color-scheme: light) {
  :root {
    --bg-primary: #f0f8ff;
    --bg-secondary: #e6f7ff;
    --bg-card: #ffffff;
    --text-primary: #1f2937;
    --text-secondary: #4b5563;
    --accent-blue: #1890ff;
    --accent-blue-light: #40a9ff;
    --accent-blue-dark: #096dd9;
    --border-color: #d1e9ff;
    --gradient-primary: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
    --gradient-secondary: linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 100%);
    --shadow-glow: 0 0 15px rgba(24, 144, 255, 0.2);
  }
}

/* 强制深色模式 */
html[data-theme="dark"] {
  --bg-primary: #0a1629;
  --bg-secondary: #1a2438;
  --bg-card: #1e2a3d;
  --text-primary: #ffffff;
  --text-secondary: #8fa3c4;
  --accent-blue: #1890ff;
  --accent-blue-light: #40a9ff;
  --accent-blue-dark: #096dd9;
  --border-color: #2d3a4e;
  --gradient-primary: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  --gradient-secondary: linear-gradient(135deg, #1a2438 0%, #2d3a4e 100%);
  --shadow-glow: 0 0 20px rgba(24, 144, 255, 0.3);
}
</style>