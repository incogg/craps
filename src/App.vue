<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const transitionName = ref('enter-game')
const router = useRouter()

router.beforeEach((to, from) => {
  const toDepth = to.meta.depth ?? 1
  const fromDepth = from.meta.depth ?? 1
  transitionName.value = toDepth > fromDepth ? 'enter-game' : 'enter-home'
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');

:root {
  --page-bg: #080808;
  --card-bg: #111111;
  --text: #f2f2f2;
  --text-muted: rgba(255,255,255,0.45);
  --text-dim: rgba(255,255,255,0.22);
  --correct: #34d399;
  --wrong: #ef4444;
  --border-page: rgba(255,255,255,0.07);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--page-bg);
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
  background-size: 22px 22px;
  min-height: 100vh;
  font-family: 'Outfit', sans-serif;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 80px;
}

@media (min-width: 768px) {
  body {
    justify-content: center;
    min-height: 100vh;
    padding: 40px 20px;
  }
}

/* Home → Game: home recedes, game slides up */
.enter-game-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(.6,0,1,.4);
}
.enter-game-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-8px);
}
.enter-game-enter-active {
  transition: opacity 0.38s cubic-bezier(.2,.7,.3,1), transform 0.38s cubic-bezier(.2,.7,.3,1);
}
.enter-game-enter-from {
  opacity: 0;
  transform: translateY(28px) scale(0.98);
}

/* Game → Home: game drops away, home emerges */
.enter-home-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(.6,0,1,.4);
}
.enter-home-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}
.enter-home-enter-active {
  transition: opacity 0.38s cubic-bezier(.2,.7,.3,1), transform 0.38s cubic-bezier(.2,.7,.3,1);
}
.enter-home-enter-from {
  opacity: 0;
  transform: scale(0.97) translateY(-10px);
}
</style>
