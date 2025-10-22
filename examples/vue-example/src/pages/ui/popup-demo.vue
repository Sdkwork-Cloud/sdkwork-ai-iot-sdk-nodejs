<template>
  <sdkwork-page-container
    safe-area
    scrollable
    theme-mode="auto"
    @load="handlePageLoad"
  >
    <!-- 页面头部 -->
    <template #header>
      <sdkwork-navbar
        title="Vant弹窗组件演示"
        left-text="返回"
        left-arrow
        @click-left="$router.back()"
      />
    </template>

    <!-- 演示内容区域 -->
    <div class="demo-content">
      <sdkwork-cell-group title="基础弹窗演示">
        <sdkwork-cell title="居中弹窗" is-link @click="showCenterPopup = true" />
        <sdkwork-cell title="底部弹窗" is-link @click="showBottomPopup = true" />
        <sdkwork-cell title="顶部弹窗" is-link @click="showTopPopup = true" />
        <sdkwork-cell title="左侧弹窗" is-link @click="showLeftPopup = true" />
        <sdkwork-cell title="右侧弹窗" is-link @click="showRightPopup = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="自定义弹窗演示">
        <sdkwork-cell title="带标题弹窗" is-link @click="showTitlePopup = true" />
        <sdkwork-cell title="自定义尺寸弹窗" is-link @click="showCustomSizePopup = true" />
        <sdkwork-cell title="带操作按钮弹窗" is-link @click="showActionPopup = true" />
        <sdkwork-cell title="表单弹窗" is-link @click="showFormPopup = true" />
      </sdkwork-cell-group>

      <sdkwork-cell-group title="高级功能演示">
        <sdkwork-cell title="嵌套弹窗" is-link @click="showNestedPopup = true" />
        <sdkwork-cell title="异步关闭弹窗" is-link @click="showAsyncPopup = true" />
        <sdkwork-cell title="禁用遮罩关闭" is-link @click="showNoClosePopup = true" />
      </sdkwork-cell-group>
    </div>

    <!-- 基础弹窗演示 -->
    <sdkwork-popup v-model:show="showCenterPopup" position="center">
      <div class="popup-content">
        <h3>居中弹窗</h3>
        <p>这是一个居中的弹窗演示内容</p>
        <van-button type="primary" block @click="showCenterPopup = false">关闭</van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup v-model:show="showBottomPopup" position="bottom">
      <div class="popup-content">
        <h3>底部弹窗</h3>
        <p>这是一个从底部弹出的弹窗</p>
        <van-button type="primary" block @click="showBottomPopup = false">关闭</van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup v-model:show="showTopPopup" position="top">
      <div class="popup-content">
        <h3>顶部弹窗</h3>
        <p>这是一个从顶部弹出的弹窗</p>
        <van-button type="primary" block @click="showTopPopup = false">关闭</van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup v-model:show="showLeftPopup" position="left" width="80%">
      <div class="popup-content">
        <h3>左侧弹窗</h3>
        <p>这是一个从左侧弹出的弹窗</p>
        <van-button type="primary" block @click="showLeftPopup = false">关闭</van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup v-model:show="showRightPopup" position="right" width="80%">
      <div class="popup-content">
        <h3>右侧弹窗</h3>
        <p>这是一个从右侧弹出的弹窗</p>
        <van-button type="primary" block @click="showRightPopup = false">关闭</van-button>
      </div>
    </sdkwork-popup>

    <!-- 自定义弹窗演示 -->
    <sdkwork-popup 
      v-model:show="showTitlePopup" 
      position="center" 
      title="带标题的弹窗"
      :closeable="true"
    >
      <div class="popup-content">
        <p>这是一个带标题和关闭按钮的弹窗</p>
        <van-button type="primary" block @click="showTitlePopup = false">确认</van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup 
      v-model:show="showCustomSizePopup" 
      position="center" 
      :width="300"
      :height="400"
      title="自定义尺寸"
    >
      <div class="popup-content">
        <h3>300x400 尺寸弹窗</h3>
        <p>这是一个自定义尺寸的弹窗演示</p>
        <van-button type="primary" block @click="showCustomSizePopup = false">关闭</van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup 
      v-model:show="showActionPopup" 
      position="bottom"
      title="操作弹窗"
    >
      <template #footer>
        <div class="popup-actions">
          <van-button type="default" block @click="showActionPopup = false">取消</van-button>
          <van-button type="primary" block @click="handleConfirm">确认</van-button>
        </div>
      </template>
      <div class="popup-content">
        <p>请确认您的操作</p>
      </div>
    </sdkwork-popup>

    <sdkwork-popup 
      v-model:show="showFormPopup" 
      position="center" 
      title="表单弹窗"
      :width="320"
    >
      <div class="popup-content">
        <van-form @submit="handleFormSubmit">
          <sdkwork-cell-group>
            <van-field
              v-model="formData.name"
              label="姓名"
              placeholder="请输入姓名"
              :rules="[{ required: true, message: '请填写姓名' }]"
            />
            <van-field
              v-model="formData.email"
              label="邮箱"
              placeholder="请输入邮箱"
              :rules="[{ required: true, message: '请填写邮箱' }]"
            />
            <van-field
              v-model="formData.phone"
              label="手机号"
              placeholder="请输入手机号"
              :rules="[{ required: true, message: '请填写手机号' }]"
            />
          </sdkwork-cell-group>
          <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>
      </div>
    </sdkwork-popup>

    <!-- 高级功能演示 -->
    <sdkwork-popup v-model:show="showNestedPopup" position="center" title="嵌套弹窗">
      <div class="popup-content">
        <p>点击下面的按钮打开嵌套弹窗</p>
        <van-button type="primary" block @click="showInnerPopup = true">打开内层弹窗</van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup v-model:show="showInnerPopup" position="center" title="内层弹窗">
      <div class="popup-content">
        <p>这是内层弹窗</p>
        <van-button type="primary" block @click="showInnerPopup = false">关闭内层</van-button>
        <van-button type="default" block @click="showNestedPopup = false; showInnerPopup = false">关闭全部</van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup 
      v-model:show="showAsyncPopup" 
      position="center" 
      title="异步操作"
      :close-on-click-overlay="false"
    >
      <div class="popup-content">
        <p>正在处理中，请稍候...</p>
        <van-button 
          :loading="isLoading" 
          loading-text="处理中..."
          type="primary" 
          block 
          @click="handleAsyncOperation"
        >
          开始处理
        </van-button>
      </div>
    </sdkwork-popup>

    <sdkwork-popup 
      v-model:show="showNoClosePopup" 
      position="center" 
      title="禁用遮罩关闭"
      :close-on-click-overlay="false"
      :closeable="false"
    >
      <div class="popup-content">
        <p>这个弹窗只能通过按钮关闭</p>
        <van-button type="primary" block @click="showNoClosePopup = false">手动关闭</van-button>
      </div>
    </sdkwork-popup>
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import SdkworkPopup from '@/components/sdkwork-popup/sdkwork-popup.vue'
import SdkworkPageContainer from '@/components/sdkwork-page-container/sdkwork-page-container.vue'

// 弹窗显示状态
const showCenterPopup = ref(false)
const showBottomPopup = ref(false)
const showTopPopup = ref(false)
const showLeftPopup = ref(false)
const showRightPopup = ref(false)
const showTitlePopup = ref(false)
const showCustomSizePopup = ref(false)
const showActionPopup = ref(false)
const showFormPopup = ref(false)
const showNestedPopup = ref(false)
const showInnerPopup = ref(false)
const showAsyncPopup = ref(false)
const showNoClosePopup = ref(false)

// 表单数据
const formData = reactive({
  name: '',
  email: '',
  phone: ''
})

// 加载状态
const isLoading = ref(false)

// 事件处理
const handleConfirm = () => {
  showToast('操作已确认')
  showActionPopup.value = false
}

const handleFormSubmit = () => {
  showToast('表单提交成功')
  console.log('表单数据:', formData)
  showFormPopup.value = false
}

const handleAsyncOperation = async () => {
  isLoading.value = true
  
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isLoading.value = false
  showToast('处理完成')
  showAsyncPopup.value = false
}

// 页面加载事件处理
const handlePageLoad = () => {
  console.log('弹窗演示页面加载完成')
}
</script>

<style scoped lang="scss">
.popup-demo-page {
  min-height: 100dvh;
  background-color: #f5f5f5;
}

.demo-content {
  padding: 16px;
}

.popup-content {
  padding: 20px;
  
  h3 {
    margin: 0 0 12px 0;
    font-size: 18px;
    color: #333;
  }
  
  p {
    margin: 0 0 16px 0;
    color: #666;
    line-height: 1.5;
  }
}

.popup-actions {
  display: flex;
  gap: 12px;
  padding: 16px;
  
  .van-button {
    flex: 1;
  }
}

// 自定义弹窗样式
:deep(.sdkwork-popup) {
  &.sdkwork-popup--center {
    max-width: 90vw;
    max-height: 90vh;
  }
  
  &.sdkwork-popup--bottom {
    border-radius: 16px 16px 0 0;
  }
  
  &.sdkwork-popup--top {
    border-radius: 0 0 16px 16px;
  }
  
  &.sdkwork-popup--left,
  &.sdkwork-popup--right {
    height: 100dvh;
  }
}
</style>