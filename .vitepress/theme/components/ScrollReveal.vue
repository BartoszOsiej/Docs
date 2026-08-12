<template>
  <div ref="el" class="scroll-reveal" :style="{ transitionDelay: `${delay}ms` }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ delay?: number }>()

const el = ref<HTMLElement | null>(null)

onMounted(() => {
  const node = el.value
  if (!node) return
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.classList.add('visible')
          io.unobserve(node)
        }
      })
    },
    { threshold: 0.1 }
  )
  io.observe(node)
})
</script>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.scroll-reveal.visible {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal { opacity: 1; transform: none; transition: none; }
}
</style>
