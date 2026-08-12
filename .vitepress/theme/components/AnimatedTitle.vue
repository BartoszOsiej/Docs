<template>
  <span class="animated-title">
    <slot />
  </span>
</template>

<style scoped>
.animated-title {
  display: inline-block;
  background: linear-gradient(
    120deg,
    #818cf8 0%,
    #e879f9 25%,
    #22d3ee 50%,
    #fbbf24 75%,
    #818cf8 100%
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmer 6s linear infinite;
}

@keyframes shimmer {
  to { background-position: 300% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .animated-title { animation: none; }
}
</style>
