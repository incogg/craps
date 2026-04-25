<script setup>
defineProps({
  n: { type: Number, required: true },
  size: { type: Number, default: 44 }
})

const DOT_POS = {
  1: [[50,50]],
  2: [[28,28],[72,72]],
  3: [[28,28],[50,50],[72,72]],
  4: [[28,28],[72,28],[28,72],[72,72]],
  5: [[28,28],[72,28],[50,50],[28,72],[72,72]],
  6: [[28,24],[72,24],[28,50],[72,50],[28,76],[72,76]]
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" style="display:block;flex-shrink:0">
    <rect width="100" height="100" rx="18" fill="#f0ece0"/>
    <circle v-for="([x, y], i) in (DOT_POS[n] || [])" :key="i" :cx="x" :cy="y" r="9" fill="#1a1a1a"/>
  </svg>
</template>
