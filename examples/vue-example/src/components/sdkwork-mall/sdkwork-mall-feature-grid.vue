<template>
  <sdkwork-section content-padding="0px">
    <sdkwork-grid
      :columns="columns"
      :gutter="gutter"
      :bordered="bordered"
      :center="center"
      theme-mode="auto"
      contentPadding="0px" 
    >
      <sdkwork-grid-item
        v-for="feature in features"
        :key="feature.id"
        :text="feature.name"
        :icon="feature.icon"
        :clickable="true"
        :bordered="true"
        @click="handleFeatureClick(feature)"
      >
        <template #badge>
          <van-badge 
            v-if="feature.badge" 
            :content="feature.badge" 
            :color="feature.badgeColor"
          />
        </template>
      </sdkwork-grid-item>
    </sdkwork-grid>
  </sdkwork-section>
</template>

<script setup lang="ts">

interface FeatureItem {
  id: string
  name: string
  icon: string
  badge?: string | null
  badgeColor?: string
}

interface Props {
  features: FeatureItem[]
  columns?: number
  gutter?: number
  bordered?: boolean
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  columns: 4,
  gutter: 2,
  bordered: false,
  center: true
})

const emit = defineEmits<{
  click: [feature: FeatureItem]
}>()

const handleFeatureClick = (feature: FeatureItem) => {
  emit('click', feature)
}
</script>

<style scoped lang="scss">
.feature-grid-section { 
  background: #fff;
  margin-bottom: 10px;
  
  :deep(.sdkwork-grid-item) {
    background: transparent !important;
    border: none !important;
    
    .sdkwork-grid-item__text {
      font-size: 12px;
      margin-top: 4px;
    }
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .feature-grid-section {
    background: #2d3748;
  }
}
</style>