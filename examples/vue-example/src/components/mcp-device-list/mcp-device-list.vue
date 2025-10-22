<template>
    
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);

const doubleCount = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<style scoped>
.double {
  color: red;
}
</style>    