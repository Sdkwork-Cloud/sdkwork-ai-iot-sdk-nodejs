<template>
  <div class="sdkwork-tabbar-example">
    <h2>SDKWork Tabbar 示例</h2>
    
    <!-- 基本用法 -->
    <div class="example-section">
      <h3>基本用法</h3>
      <sdkwork-tabbar v-model="activeTab1">
        <sdkwork-tabbar-item name="home" icon="home">
          首页
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="search" icon="search">
          搜索
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="friends" icon="friends">
          好友
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="setting" icon="setting">
          设置
        </sdkwork-tabbar-item>
      </sdkwork-tabbar>
      <p>当前选中: {{ activeTab1 }}</p>
    </div>
    
    <!-- 带徽标 -->
    <div class="example-section">
      <h3>带徽标</h3>
      <sdkwork-tabbar v-model="activeTab2">
        <sdkwork-tabbar-item name="home" icon="home" badge="3">
          首页
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="search" icon="search" dot>
          搜索
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="friends" icon="friends" badge="99+">
          好友
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="setting" icon="setting">
          设置
        </sdkwork-tabbar-item>
      </sdkwork-tabbar>
      <p>当前选中: {{ activeTab2 }}</p>
    </div>
    
    <!-- 自定义图标 -->
    <div class="example-section">
      <h3>自定义图标</h3>
      <sdkwork-tabbar v-model="activeTab3" active-color="#07c160">
        <sdkwork-tabbar-item name="home">
          <template #icon="{ active }">
            <div :style="{ color: active ? '#07c160' : '#646566' }">
              {{ active ? '🏠' : '🏡' }}
            </div>
          </template>
          首页
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="search">
          <template #icon="{ active }">
            <div :style="{ color: active ? '#07c160' : '#646566' }">
              {{ active ? '🔍' : '🔎' }}
            </div>
          </template>
          搜索
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="friends">
          <template #icon="{ active }">
            <div :style="{ color: active ? '#07c160' : '#646566' }">
              {{ active ? '👥' : '👤' }}
            </div>
          </template>
          好友
        </sdkwork-tabbar-item>
      </sdkwork-tabbar>
      <p>当前选中: {{ activeTab3 }}</p>
    </div>
    
    <!-- 路由模式 -->
    <div class="example-section">
      <h3>路由模式</h3>
      <sdkwork-tabbar v-model="activeTab4" route>
        <sdkwork-tabbar-item name="home" to="/home">
          首页
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="category" to="/category">
          分类
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="cart" to="/cart">
          购物车
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="user" to="/user">
          我的
        </sdkwork-tabbar-item>
      </sdkwork-tabbar>
      <p>当前选中: {{ activeTab4 }}</p>
    </div>
    
    <!-- 固定底部 -->
    <div class="example-section">
      <h3>固定底部</h3>
      <div style="height: 200px; background: #f7f8fa; margin-bottom: 60px;">
        <p>内容区域</p>
      </div>
      <sdkwork-tabbar v-model="activeTab5" fixed>
        <sdkwork-tabbar-item name="home" icon="home">
          首页
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="search" icon="search">
          搜索
        </sdkwork-tabbar-item>
        <sdkwork-tabbar-item name="friends" icon="friends">
          好友
        </sdkwork-tabbar-item>
      </sdkwork-tabbar>
      <p>当前选中: {{ activeTab5 }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 响应式数据
const activeTab1 = ref('home')
const activeTab2 = ref('home')
const activeTab3 = ref('home')
const activeTab4 = ref('home')
const activeTab5 = ref('home')
</script>

<style scoped>
.sdkwork-tabbar-example {
  padding: 20px;
}

.example-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.example-section h3 {
  margin: 0 0 16px 0;
  color: #323233;
  font-size: 16px;
}

.example-section p {
  margin: 16px 0 0 0;
  color: #646566;
  font-size: 14px;
}
</style>