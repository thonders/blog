<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import Navbar from '@/components/Navbar.vue'
import { useColorMode } from '@vueuse/core'

useColorMode()
</script>

<template>
  <div class="min-h-screen max-w-7xl w-full mx-auto">
    <Navbar />
    <slot />
  </div>
  <Toaster />
</template>
