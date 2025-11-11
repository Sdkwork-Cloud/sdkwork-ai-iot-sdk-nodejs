<template>
  <div class="qr-demo-container">
    <h1>QR Code Component Demo</h1>
    
    <div class="demo-section">
      <h2>基础用法</h2>
      <div class="demo-wrapper">
        <SdkworkQrCode
          title="技术交流群"
          description="扫码加入我们的技术交流群，一起学习成长"
          avatar="https://picsum.photos/seed/avatar1/200/200.jpg"
          value="https://example.com/join-group"
          tip-text="扫描二维码，加入群聊"
        />
      </div>
    </div>
    
    <div class="demo-section">
      <h2>个人名片</h2>
      <div class="demo-wrapper">
        <SdkworkQrCode
          title="张三"
          description="前端开发工程师"
          avatar="https://picsum.photos/seed/avatar2/200/200.jpg"
          logo="https://picsum.photos/seed/logo1/100/100.jpg"
          value="https://example.com/profile/zhangsan"
          tip-text="扫码添加联系人"
          :qr-size="220"
          qr-color="#1989fa"
          @save="handleSave"
          @share="handleShare"
        >
          <template #info>
            <div class="custom-info">
              <p>邮箱：zhangsan@example.com</p>
              <p>电话：138****8888</p>
            </div>
          </template>
        </SdkworkQrCode>
      </div>
    </div>
    
    <div class="demo-section">
      <h2>自定义样式</h2>
      <div class="demo-wrapper">
        <SdkworkQrCode
          title="活动报名"
          description="扫码报名参加我们的活动"
          avatar="https://picsum.photos/seed/avatar3/200/200.jpg"
          value="https://example.com/event-registration"
          tip-text="二维码24小时后自动更新"
          qr-color="#ff6b6b"
          qr-bg-color="#f9f9f9"
          custom-class="custom-qr-style"
          :allow-refresh="true"
          @refresh="handleRefresh"
        >
          <template #tip>
            <div class="custom-tip">
              <van-icon name="info" />
              <p>二维码24小时后自动更新</p>
            </div>
          </template>
          
          <template #actions>
            <van-button type="warning" size="small" @click="customAction">
              报名统计
            </van-button>
          </template>
        </SdkworkQrCode>
      </div>
    </div>
    
    <div class="demo-section">
      <h2>无头像样式</h2>
      <div class="demo-wrapper">
        <SdkworkQrCode
          title="WiFi连接"
          description="扫码连接WiFi网络"
          value="WIFI:T:WPA;S:MyNetwork;P:MyPassword;;"
          tip-text="扫描连接WiFi"
          :show-avatar="false"
          avatar-icon="wifi-o"
          :allow-share="false"
        />
      </div>
    </div>
    
    <div class="demo-section">
      <h2>带有Logo的二维码</h2>
      <div class="demo-wrapper">
        <SdkworkQrCode
          title="公司主页"
          description="扫码访问我们的官方网站"
          avatar="https://picsum.photos/seed/avatar4/200/200.jpg"
          logo="https://picsum.photos/seed/logo2/100/100.jpg"
          value="https://example.com/company"
          tip-text="扫码了解更多"
          :qr-size="240"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import SdkworkQrCode from './index.ts'

const handleSave = (qrCodeUrl: string) => {
  showToast('二维码已保存到相册')
  console.log('QR code saved:', qrCodeUrl)
}

const handleShare = (qrCodeUrl: string) => {
  showToast('分享成功')
  console.log('QR code shared:', qrCodeUrl)
}

const handleRefresh = () => {
  showToast('二维码已刷新')
}

const customAction = () => {
  showToast('查看报名统计')
}
</script>

<style scoped>
.qr-demo-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.demo-section {
  margin-bottom: 40px;
}

h2 {
  margin-bottom: 20px;
  color: #666;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.demo-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

/* 自定义样式 */
:global(.custom-qr-style) {
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.custom-info {
  text-align: center;
  margin-top: 8px;
}

.custom-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

.custom-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.custom-tip p {
  margin: 0;
  font-size: 13px;
  color: #999;
}
</style>