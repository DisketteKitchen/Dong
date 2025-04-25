<script setup lang="ts">
import {Card} from '@/components/ui/card'</script>

<template>
  <Card class="w-auto h-auto m-5 absolute inset-x-0 bottom-0 ">
    <div class="inline-flex ">
      <Card class="bg-pink-400 w-full ms-5 me-5"></Card>
      <Card class="bg-yellow-300 w-full  me-5"></Card>

      <img class="m-auto w-40" src="/logo.png" alt="logo">

      <Card class="bg-yellow-300 w-full ms-5 me-5"></Card>
      <Card class="bg-pink-400 w-full me-5"></Card>

    </div>
  </Card>
</template>

<style scoped>

</style>