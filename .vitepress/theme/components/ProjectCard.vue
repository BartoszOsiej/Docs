<template>
  <a :href="withBase(link)" class="project-card" @mousemove="onMove">
    <div class="glow" aria-hidden="true"></div>
    <div class="icon" :style="{ backgroundColor: tint + '22' }">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div class="tags" v-if="tags && tags.length">
      <span v-for="t in tags" :key="t" class="tag">{{ t }}</span>
    </div>
    <span class="arrow" aria-hidden="true">→</span>
  </a>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'

withDefaults(defineProps<{
  link: string
  icon?: string
  title: string
  description: string
  tags?: string[]
  tint?: string
}>(), { icon: '🚀', tint: '#818cf8', tags: () => [] })

function onMove(e: MouseEvent) {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--x', `${e.clientX - rect.left}px`)
  card.style.setProperty('--y', `${e.clientY - rect.top}px`)
}
</script>

<style scoped>
.project-card {
  position: relative;
  display: block;
  border-radius: 18px;
  padding: 1.6rem 1.7rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.4s ease,
              box-shadow 0.4s ease;
}

.project-card:hover {
  transform: translateY(-6px) scale(1.01);
  border-color: rgba(129, 140, 248, 0.45);
  box-shadow: 0 24px 70px -22px rgba(99, 102, 241, 0.5);
}

.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(300px circle at var(--x, 50%) var(--y, 50%),
              rgba(129, 140, 248, 0.18), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.project-card:hover .glow { opacity: 1; }

.icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 26px;
  margin-bottom: 1rem;
}

h3 { margin: 0 0 0.5rem; font-size: 1.15rem; font-weight: 650; }
p { margin: 0 0 1rem; font-size: 0.92rem; opacity: 0.78; line-height: 1.55; }

.tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.tag {
  font-size: 0.72rem;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  background: rgba(129, 140, 248, 0.12);
  border: 1px solid rgba(129, 140, 248, 0.25);
  color: #a5b4fc;
}

.arrow {
  position: absolute;
  top: 1.5rem;
  right: 1.6rem;
  font-size: 1.3rem;
  opacity: 0.35;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s;
}
.project-card:hover .arrow { transform: translateX(5px); opacity: 1; }
</style>
