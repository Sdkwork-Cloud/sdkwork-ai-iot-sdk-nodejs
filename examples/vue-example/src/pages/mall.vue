<template>
  <sdkwork-page-container safe-area scrollable theme-mode="auto">
    <sdkwork-mall />
  </sdkwork-page-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
definePage({
  meta: {
    hideBackButton: true
  }
})


// 组件挂载
onMounted(() => {
  console.log('商城首页初始化完成')
})
</script>

<style scoped lang="scss"></style>

<route>
{
  meta: {
    layout: 'tabbar',
    title: '商城'
  }
}
</route>