<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import DiffDock from '@/Common/DiffDock.vue'

const router = useRouter()

const GAMES = {
  baccarat: {
    title: 'BACCARAT',
    display: 'Baccarat',
    focus: 'SIDE BETS',
    desc: 'Dragon Tiger optional bets — small and big dragon, tiger variants, ties, and tiered payouts.',
    drills: [
      { name: 'Optionals', to: { path: '/baccarat', query: { scenario: 'optionals' } } },
    ],
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" style="--icon-sw:1.4" xmlns="http://www.w3.org/2000/svg"><rect x="3.5" y="5.5" width="8" height="11" rx="1.2" transform="rotate(-12 7.5 11)"/><rect x="8.5" y="3.5" width="8" height="11" rx="1.2" transform="rotate(12 12.5 9)"/></svg>`,
    route: '/baccarat',
  },
  roulette: {
    title: 'ROULETTE',
    display: 'Roulette',
    focus: 'ALL BETS',
    desc: 'Single-zero payouts across inside and outside bets. Straight, split, corner, column, dozen.',
    drills: [
      'Straight Up',
      'Split',
      'Corner',
      'Column / Dozen',
    ],
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7"/><line x1="10" y1="3" x2="10" y2="4.5"/><line x1="10" y1="15.5" x2="10" y2="17"/><line x1="3" y1="10" x2="4.5" y2="10"/><line x1="15.5" y1="10" x2="17" y2="10"/><line x1="4.95" y1="4.95" x2="6" y2="6"/><line x1="14" y1="14" x2="15.05" y2="15.05"/><line x1="15.05" y1="4.95" x2="14" y2="6"/><line x1="6" y1="14" x2="4.95" y2="15.05"/><circle class="dot" cx="10" cy="6.5" r="1.1"/></svg>`,
    route: '/roulette',
    disabled: true,
  },
  craps: {
    title: 'CRAPS',
    display: 'Craps',
    focus: 'CENTER ACTION',
    desc: 'Center action practice — horn bets and hardways.',
    drills: [
      { name: 'Horns',    to: { path: '/craps', query: { scenario: 'horns' } } },
      { name: 'Hardways', to: { path: '/craps', query: { scenario: 'hardways' } } },
    ],
    icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="14" height="14" rx="2"/><circle class="dot" cx="6.5" cy="6.5" r="1"/><circle class="dot" cx="13.5" cy="6.5" r="1"/><circle class="dot" cx="10" cy="10" r="1"/><circle class="dot" cx="6.5" cy="13.5" r="1"/><circle class="dot" cx="13.5" cy="13.5" r="1"/></svg>`,
    route: '/craps',
  },
}

const order = ['craps', 'baccarat', 'roulette']

const saved = localStorage.getItem('dealer-tab')
const active = ref(saved && GAMES[saved] && !GAMES[saved].disabled ? saved : order[0])

const data = computed(() => GAMES[active.value])
const tabCount = order.length
const indicatorLeft = computed(() => {
  const i = order.indexOf(active.value)
  return `calc(4px + ${i} * ((100% - 8px) / ${tabCount}))`
})

function select(game) {
  if (GAMES[game]?.disabled) return
  active.value = game
  localStorage.setItem('dealer-tab', game)
}

function onKey(e) {
  const n = parseInt(e.key)
  if (n >= 1 && n <= order.length) select(order[n - 1])
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const i = order.indexOf(active.value)
    let j = i
    do {
      j = e.key === 'ArrowRight'
        ? (j + 1) % order.length
        : (j - 1 + order.length) % order.length
    } while (GAMES[order[j]].disabled && j !== i)
    select(order[j])
  } else if (e.key === 'Enter') {
    router.push(data.value.route)
  }
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <main class="page">

    <!-- Wordmark + difficulty -->
    <header class="header-bar">
      <div class="wordmark"><b>DEALER</b> · PAYOUT TRAINING</div>
      <DiffDock />
    </header>

    <!-- Section head -->
    <div class="section-head">
      <span class="overline">TABLES</span>
      <span class="kbd-hint">SWITCH <span v-for="n in tabCount" :key="n" class="kbd">{{ n }}</span></span>
    </div>

    <!-- Tabs -->
    <nav class="tabs" :data-game="active" :style="{ '--tab-count': tabCount }" role="tablist">
      <div class="tabs-indicator" :style="{ left: indicatorLeft }"></div>
      <button
        v-for="g in order"
        :key="g"
        class="tab"
        :class="{ active: active === g, disabled: GAMES[g].disabled }"
        :data-game="g"
        :disabled="GAMES[g].disabled"
        role="tab"
        @click="select(g)"
      >
        <span class="t-name">{{ GAMES[g].display }}</span>
        <span v-if="!GAMES[g].disabled" class="t-icon" v-html="GAMES[g].icon"></span>
        <span v-else class="t-badge">SOON</span>
      </button>
    </nav>

    <!-- Panel -->
    <section class="panel" :data-game="active">
      <header class="panel-head">
        <span class="panel-head-game">{{ data.title }}</span>
        <span class="panel-head-meta">FOCUS · <b>{{ data.focus }}</b></span>
      </header>
      <div class="panel-body" :key="active">
        <h2 class="panel-title">{{ data.display }}</h2>
        <p class="panel-desc">{{ data.desc }}</p>

        <div class="panel-drills">
          <span class="drills-label">SCENARIOS</span>
          <RouterLink
            v-for="d in data.drills"
            :key="d.name"
            class="drill-btn"
            :to="d.to || data.route"
          >
            <span class="drill-btn-name">{{ d.name }}</span>
            <span class="drill-btn-suffix">→</span>
          </RouterLink>
        </div>

        <div class="cta-group">
          <span class="drills-label">ALL SCENARIOS</span>
          <RouterLink class="cta" :to="data.route">
            <span>START TRAINING</span>
            <span class="arrow">→</span>
          </RouterLink>
        </div>
      </div>
    </section>

  </main>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

/* Wordmark */
.wordmark {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-muted);
}
.wordmark b { color: var(--text); font-weight: 700; }

/* Section head */
.overline {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kbd-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  display: flex;
  gap: 6px;
  align-items: center;
}
.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px; height: 18px;
  padding: 0 5px;
  background: var(--card-bg, #111);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0;
}

/* Tabs */
.tabs {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--tab-count, 3), 1fr);
  background: var(--card-bg, #111);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 4px;
}
.tabs-indicator {
  position: absolute;
  top: 4px; bottom: 4px;
  width: calc((100% - 8px) / var(--tab-count, 3));
  background: var(--panel-table);
  border: 1px solid var(--panel-border);
  border-radius: 10px;
  transition:
    left 0.35s cubic-bezier(.2,.7,.3,1),
    background 0.35s cubic-bezier(.2,.7,.3,1),
    border-color 0.35s cubic-bezier(.2,.7,.3,1);
  z-index: 0;
}
.tab {
  position: relative;
  z-index: 1;
  background: transparent;
  border: none;
  padding: 14px 8px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 56px;
  font-family: inherit;
  color: var(--text-muted);
  transition: color 0.25s;
}
.tab:hover { color: var(--text); }
.tab.active { color: var(--text); }
.tab.disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.tab.disabled:hover { color: var(--text-muted); }
.t-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-muted);
  line-height: 1;
}
.t-name {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.t-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  opacity: 0.55;
  transition: opacity 0.2s;
}
.tab.active .t-icon { opacity: 1; }
.tab:hover .t-icon  { opacity: 0.85; }
:deep(.t-icon svg) { display: block; }
:deep(.t-icon svg *) {
  stroke: currentColor;
  stroke-width: var(--icon-sw, 1.4);
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
:deep(.t-icon svg .dot) { fill: currentColor; stroke: none; }

/* Panel */
.panel {
  position: relative;
  background: var(--panel-table);
  border: 2px solid var(--panel-border);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.panel-head {
  background: var(--panel-deep);
  padding: 14px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--panel-border-soft);
}
.panel-head-game {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--wrong, #ef4444);
}
.panel-head-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
}
.panel-head-meta b { color: #fff; font-weight: 700; }

.panel-body {
  padding: 28px 22px 22px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  animation: fadeIn 0.42s cubic-bezier(.2,.7,.3,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.panel-title {
  font-size: 56px;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 0.95;
  color: #fff;
}
.panel-desc {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.65);
  line-height: 1.45;
  max-width: 44ch;
}

/* Drill labels */
.drills-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.cta-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Drill buttons */
.panel-drills {
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* 4 × 52px buttons + 3 × 8px gaps = 232px — keeps panel height stable across tabs */
  min-height: 232px;
  justify-content: flex-end;
}
.drill-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--panel-border-soft);
  border-radius: 10px;
  padding: 14px 18px;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  min-height: 52px;
  transition: background 0.15s, border-color 0.15s, transform 0.15s;
  color: inherit;
}
.drill-btn:hover {
  background: rgba(0,0,0,0.5);
  border-color: var(--panel-accent);
  transform: translateY(-1px);
}
.drill-btn-name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #fff;
}
.drill-btn-suffix {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--panel-accent);
  flex-shrink: 0;
}

/* CTA */
.cta {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #f2f2f2;
  color: #0a0a0a;
  border: none;
  border-radius: 10px;
  padding: 16px 20px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  min-height: 52px;
  transition: background 0.15s, transform 0.15s;
}
.cta:hover {
  background: #fff;
  transform: translateY(-1px);
}
.arrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  transition: transform 0.15s;
}
.cta:hover .arrow { transform: translateX(3px); }

/* Per-game theming via CSS custom properties */
.tabs[data-game="baccarat"],
.panel[data-game="baccarat"] {
  --panel-table:       #2d1b5e;
  --panel-deep:        #1e1040;
  --panel-accent:      #e9a93a;
  --panel-border:      rgba(200,180,240,0.18);
  --panel-border-soft: rgba(200,180,240,0.09);
}
.tabs[data-game="roulette"],
.panel[data-game="roulette"] {
  --panel-table:       #210d17;
  --panel-deep:        #160810;
  --panel-accent:      #d44b6a;
  --panel-border:      rgba(212,75,106,0.28);
  --panel-border-soft: rgba(212,75,106,0.12);
}
.tabs[data-game="craps"],
.panel[data-game="craps"] {
  --panel-table:       #062a1a;
  --panel-deep:        #04200f;
  --panel-accent:      #34d399;
  --panel-border:      rgba(149,212,179,0.22);
  --panel-border-soft: rgba(149,212,179,0.12);
}
/*.tabs[data-game="blackjack"],
.panel[data-game="blackjack"] {
  --panel-table:       #0d1f0d;
  --panel-deep:        #071207;
  --panel-accent:      #f5c542;
  --panel-border:      rgba(245,197,66,0.22);
  --panel-border-soft: rgba(245,197,66,0.10);
}*/

@media (min-width: 768px) {
  .page { min-width: 580px; }
}

@media (max-width: 768px) {
  .panel-title { font-size: 44px; }
  .wordmark    { padding-top: 25px; }
}
</style>
