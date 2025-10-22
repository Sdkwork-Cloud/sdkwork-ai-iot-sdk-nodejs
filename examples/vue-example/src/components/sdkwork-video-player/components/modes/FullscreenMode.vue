<template>
  <div class="fullscreen-mode" @click="togglePlay">
    <!-- Control bar with more options -->
    <ControlBar 
      :player="player"
      :show-time="true"
      :show-volume="true"
      :show-fullscreen="true"
      :show-settings="true"
      auto-hide
      @click.stop
    />
  </div>
</template>

<script setup lang="ts">
import ControlBar from '../ControlBar.vue'

interface Props {
  player: any
}

const props = defineProps<Props>()

const togglePlay = () => {
  if (props.player) {
    if (props.player.paused()) {
      props.player.play()
    } else {
      props.player.pause()
    }
  }
}

// Expose the function to template
defineExpose({ togglePlay })
</script>

<style scoped>
.fullscreen-mode {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>