<script setup lang="ts">
import { Progress } from '@/components/ui/progress'
import { ref, watchEffect } from 'vue'

const progress = ref(0)

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => progress.value = 15, 500)
  cleanupFn(() => clearTimeout(timer))
})
</script>

<template>
  <Progress v-model="progress" class="w-3/5 m-auto" />
  <Watermark />
</template>

<style scoped>

</style>