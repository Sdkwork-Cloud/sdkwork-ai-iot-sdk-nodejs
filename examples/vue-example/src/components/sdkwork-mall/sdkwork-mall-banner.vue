<template>
 <sdkwork-section content-padding="5px">
    <van-swipe 
      :autoplay="autoplay" 
      :indicator-color="indicatorColor"
      class="banner-swipe"
    >
      <van-swipe-item 
        v-for="banner in banners" 
        :key="banner.id"
        class="banner-item"
      >
        <img :src="banner.image" :alt="banner.title" class="banner-image" />
        <div class="banner-content">
          <h3 class="banner-title">{{ banner.title }}</h3>
          <p class="banner-desc">{{ banner.description }}</p>
        </div>
      </van-swipe-item>
    </van-swipe>
  </sdkwork-section >
</template>

<script setup lang="ts">

interface BannerItem {
  id: number
  image: string
  title: string
  description: string
}

interface Props {
  banners: BannerItem[]
  autoplay?: number
  indicatorColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: 3000,
  indicatorColor: '#1989fa'
})
</script>

<style scoped lang="scss">
.banner-section {
  padding: 0 0px;
  
  .banner-swipe {
    border-radius: 8px;
    overflow: hidden;
    
    .banner-item {
      position: relative;
      height: 150px;
      
      .banner-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      
      .banner-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 12px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
        color: white;
        
        .banner-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        
        .banner-desc {
          font-size: 12px;
          margin: 0;
          opacity: 0.9;
        }
      }
    }
  }
}
</style>