<script setup>
import { Link } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'

defineProps({
  links: Array,
})
</script>

<template>
  <nav class="relative flex justify-center mt-4 gap-1">
    <template v-for="link in links" :key="link.label">
      <Button
        :variant="link.active ? 'default' : 'outline'"
        class="w-10 h-10 flex items-center justify-center"
        as-child
      >
        <Link
          v-if="link.url"
          :href="link.url"
          v-html="link.label"
          :class="{
            'max-sm:hidden': !(link.label === '<' || link.label === '>' || link.active === true),
          }"
        />
        <span v-else v-html="link.label" class="text-gray-500" />
      </Button>
    </template>
  </nav>
</template>
