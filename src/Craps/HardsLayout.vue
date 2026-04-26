<script setup>
import DieSvg from '@/Common/DieSvg.vue'

defineProps({
  betId: { type: String, default: '' },
  wager: { type: Number, default: 0 },
})

const CELLS = [
  { id: 'h6',  label: 'HARD 6',  ratio: '9½ TO 1', dice: [3, 3] },
  { id: 'h8',  label: 'HARD 8',  ratio: '9½ TO 1', dice: [4, 4] },
  { id: 'h10', label: 'HARD 10', ratio: '7½ TO 1', dice: [5, 5] },
  { id: 'h4',  label: 'HARD 4',  ratio: '7½ TO 1', dice: [2, 2] },
]
</script>

<template>
  <div class="table-card">
    <div class="prop-layout">

      <!-- Any Seven (display-only) -->
      <div class="bar-row bar-top">
        <span class="bar-name">ANY SEVEN</span>
        <div class="bar-ratio">4 <span class="to">TO</span> 1</div>
      </div>

      <!-- Hardways 2×2 grid -->
      <div class="hard-wrap">
        <div class="hard-grid">
          <div
            v-for="cell in CELLS"
            :key="cell.id"
            class="hard-cell"
          >
            <div class="hard-dice">
              <DieSvg v-for="(n, i) in cell.dice" :key="i" :n="n" :size="28" />
            </div>
            <div class="chip" :class="{ active: betId === cell.id }">
              ${{ betId === cell.id ? wager : 0 }}
            </div>
            <div class="hard-ratio">{{ cell.ratio }}</div>
            <div class="hard-label">{{ cell.label }}</div>
          </div>
        </div>
      </div>

      <!-- Horn High (display-only label) -->
      <div class="bar-row bar-bot">
        <span class="bar-name neutral">HORN HIGH</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.table-card {
  background: #062a1a;
  border: 2px solid #06402b;
  border-radius: 14px;
  overflow: hidden;
}
.prop-layout { display: flex; flex-direction: column; }

.bar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px;
}
.bar-top { border-bottom: 1px solid rgba(149,212,179,0.10); }
.bar-bot { border-top:    1px solid rgba(149,212,179,0.10); }
.bar-name {
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  color: #ef4444;
  letter-spacing: -0.02em;
  white-space: nowrap;
}
.bar-name.neutral { color: var(--text); }
.bar-ratio {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.02em;
  color: var(--text);
  white-space: nowrap;
}
.bar-ratio .to { font-weight: 700; }

.hard-wrap { background: #04200f; }
.hard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  min-height: 320px;
}
.hard-cell {
  border-right: 1px solid rgba(149,212,179,0.10);
  border-bottom: 1px solid rgba(149,212,179,0.10);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 22px 10px;
}
.hard-cell:nth-child(2) { border-right: none; }
.hard-cell:nth-child(3),
.hard-cell:nth-child(4) { border-bottom: none; }
.hard-cell:nth-child(4) { border-right: none; }

.hard-dice { display: flex; gap: 8px; justify-content: center; }
.hard-ratio {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #95d4b3;
}
.hard-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: #95d4b3;
  text-transform: uppercase;
}

.chip {
  min-width: 44px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  color: var(--text-muted);
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  white-space: nowrap;
  transition: all 200ms ease;
}
.chip.active {
  background: #e9c349;
  color: #1a1200;
  box-shadow: 0 0 16px rgba(233,195,73,0.45);
}
</style>
