<template>
  <div class="glow-card" :class="{ interactive }">
    <div class="glow" aria-hidden="true"></div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ interactive?: boolean }>(), { interactive: true })
</script>

<style scoped>
.glow-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(12px);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.35s ease,
              box-shadow 0.35s ease;
}

.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(240px circle at var(--x, 50%) var(--y, 50%),
              rgba(129, 140, 248, 0.22), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.content { position: relative; }

.glow-card.interactive:hover {
  transform: translateY(-4px);
  border-color: rgba(129, 140, 248, 0.4);
  box-shadow: 0 20px 60px -20px rgba(99, 102, 241, 0.45);
}
.glow-card.interactive:hover .glow { opacity: 1; }
</style>
