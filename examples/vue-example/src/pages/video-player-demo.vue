<template>
  <div class="demo-container">
    <h1>SDKWork Video Player Demo 导航</h1>
    
    <div class="demo-section">
      <h2>选择演示模式</h2>
      <div class="mode-links">
        <router-link to="/video-player-card-demo" class="mode-link">
          <div class="mode-icon">📱</div>
          <h3>Card Mode</h3>
          <p>卡片模式，适合在列表中展示</p>
        </router-link>
        
        <router-link to="/video-player-fullscreen-demo" class="mode-link">
          <div class="mode-icon">🖥️</div>
          <h3>Fullscreen Mode</h3>
          <p>全屏模式，沉浸式体验</p>
        </router-link>
        
        <router-link to="/video-player-theater-demo" class="mode-link">
          <div class="mode-icon">🎭</div>
          <h3>Theater Mode</h3>
          <p>影院模式，宽屏体验</p>
        </router-link>
        
        <router-link to="/video-player-mini-demo" class="mode-link">
          <div class="mode-icon">🔍</div>
          <h3>Mini Mode</h3>
          <p>迷你模式，小窗口播放</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Handle ESC key to close popup
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    // Handle escape key if needed
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin: 40px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  position: relative;
}

.mode-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.mode-link {
  display: block;
  padding: 24px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  background: white;
}

.mode-link:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.mode-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
}

.mode-link h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.mode-link p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}
</style>