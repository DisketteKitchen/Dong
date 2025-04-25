<script setup lang="ts">
import {Card} from '@/components/ui/card'

</script>


<template>
  <Card class="w-auto h-full m-5 ">
    <h1 class="text-center font-bold text-9xl">Welcome</h1>
    <h1 class="text-center font-bold text-4xl">to Birds</h1>
    <UModal class="m-auto">
      <a class=" h-80 rounded rounded-full bg-emerald-600" href="/robot1                                                                                                          ">
        <Icon class="p-40 bg-white" name="tabler:bell-filled"/>
      </a>
    </UModal>
    <h1 class="text-center font-bold text-6xl italic">Ring</h1>
  </Card>
  <Watermark/>
</template>