<template>
  <div class="example-page">
    <h2>默认使用方式</h2>
    <div class="example-container">
      <sdkwork-qr-code 
        value="https://example.com" 
        title="示例二维码" 
        description="这是一个示例二维码"
      />
    </div>

    <h2>自定义头部和隐藏操作按钮</h2>
    <div class="example-container">
      <sdkwork-qr-code 
        value="https://example.com" 
        tipText="扫描二维码了解更多"
        :showActions="false"
        :showInfo="false"
        :showAvatar="false"
      >
        <template #header>
          <div class="custom-header">
            <img src="/logo.png" alt="Logo" class="logo" />
            <h2>自定义标题</h2>
            <p>自定义描述信息</p>
          </div>
        </template>
        
        <template #footer>
          <div class="custom-footer">
            <p>这是自定义底部内容</p>
          </div>
        </template>
      </sdkwork-qr-code>
    </div>

    <h2>自定义操作按钮</h2>
    <div class="example-container">
      <sdkwork-qr-code 
        value="https://example.com" 
        title="示例二维码"
        :showActions="false"
        @save="handleSave"
        @share="handleShare"
      >
        <template #actions>
          <div class="custom-actions">
            <van-button type="primary" block @click="customAction1">自定义操作1</van-button>
            <van-button type="default" block @click="customAction2">自定义操作2</van-button>
          </div>
        </template>
      </sdkwork-qr-code>
    </div>
  </div>
</template>

<script setup>
import { SdkworkQrCode } from '@/components'

const handleSave = (qrCodeUrl) => {
  console.log('保存二维码:', qrCodeUrl)
}

const handleShare = (qrCodeUrl) => {
  console.log('分享二维码:', qrCodeUrl)
}

const customAction1 = () => {
  console.log('自定义操作1')
}

const customAction2 = () => {
  console.log('自定义操作2')
}
</script>

<style scoped>
.example-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.example-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
}

h2 {
  margin-bottom: 16px;
  color: #333;
}

.custom-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 16px;
}

.custom-footer {
  text-align: center;
  margin-top: 16px;
  color: #666;
  font-size: 14px;
}

.custom-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}
</style>