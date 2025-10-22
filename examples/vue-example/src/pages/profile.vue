<template>
  <sdkwork-page-container>
    <sdkwork-profile />
  </sdkwork-page-container> 
</template>

<script setup lang="ts">
import SdkworkProfile from '@/components/sdkwork-profile/sdkwork-profile.vue'
definePage({
    meta: { 
        hideHeader: true
    }
})

</script>

<style scoped lang="scss">
</style>
<route>
{
  meta: {
    layout: 'tabbar',
    title: '我的'
  }
}
</route>