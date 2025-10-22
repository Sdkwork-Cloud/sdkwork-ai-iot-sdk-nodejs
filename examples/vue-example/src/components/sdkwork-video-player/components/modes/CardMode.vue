<template>
  <div class="card-mode" @click="togglePlay">
    <!-- Video cover/poster overlay -->
    <div v-if="showCover" class="video-cover" @click.stop="handlePlay">
      <img :src="poster" alt="Video cover" class="cover-image" />
      <div class="play-button">
        <van-icon name="play" size="24" />
      </div>
    </div>

    <!-- Control bar -->
    <ControlBar 
      :player="player"
      :show-time="true"
      :show-volume="true"
      :show-fullscreen="true"
      auto-hide
      @click.stop
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ControlBar from '../ControlBar.vue'

interface Props {
  player: any
  poster?: string
}

const props = withDefaults(defineProps<Props>(), {
  poster: ''
})

const showCover = computed(() => {
  return props.poster && props.player?.paused()
})

const handlePlay = () => {
  props.player.play()
}

const togglePlay = () => {
  if (props.player) {
    if (props.player.paused()) {
      props.player.play()
    } else {
      props.player.pause()
    }
  }
}
</script>

<style scoped>
.card-mode {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.video-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>