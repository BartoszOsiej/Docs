<template>
  <div class="aurora-bg" aria-hidden="true">
    <div class="aurora aurora-1"></div>
    <div class="aurora aurora-2"></div>
    <div class="aurora aurora-3"></div>
    <div class="grid-overlay"></div>
    <div class="noise-overlay"></div>
  </div>
</template>

<style scoped>
.aurora-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background: var(--aurora-base, #0a0e1a);
}

.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  will-change: transform;
  animation: drift 22s ease-in-out infinite alternate;
}

.aurora-1 {
  width: 55vw;
  height: 55vw;
  top: -18%;
  left: -12%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.5), transparent 65%);
}

.aurora-2 {
  width: 45vw;
  height: 45vw;
  top: 30%;
  right: -14%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent 65%);
  animation-delay: -7s;
  animation-duration: 26s;
}

.aurora-3 {
  width: 40vw;
  height: 40vw;
  bottom: -16%;
  left: 24%;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.35), transparent 65%);
  animation-delay: -13s;
  animation-duration: 30s;
}

@keyframes drift {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(4vw, 2vh) scale(1.12); }
  66%  { transform: translate(-3vw, -2vh) scale(0.94); }
  100% { transform: translate(2vw, 3vh) scale(1.05); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, black 40%, transparent 100%);
}

.noise-overlay {
  position: absolute;
  inset: 0;
  opacity: 0.35;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .aurora { animation: none; }
}
</style>
