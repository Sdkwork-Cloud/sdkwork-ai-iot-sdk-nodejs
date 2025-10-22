<template>
  <div class="mini-mode" @click="togglePlay">
    <!-- Minimal controls -->
    <ControlBar 
      :player="player"
      :show-time="false"
      :show-volume="false"
      :show-fullscreen="true"
      :show-progress="false"
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

defineExpose({ togglePlay })
</script>

<style scoped>
.mini-mode {
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