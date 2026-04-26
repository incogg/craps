<script setup>
import DieSvg from '@/Common/DieSvg.vue'

defineProps({
  bets: { type: Object, default: () => ({}) }
})

const HORN_HIGH = [
  { id: 'hi2',  label: 'Hi 2' },
  { id: 'hi12', label: 'Hi 12' },
  { id: 'hi3',  label: 'Hi 3' },
  { id: 'hi11', label: 'Hi 11' },
]

const ZOOM_CELLS = [
  { id: 'two',    dice: [1,1], ratio: '33 TO 1', reversed: false },
  { id: 'twelve', dice: [6,6], ratio: '33 TO 1', reversed: false },
  { id: 'three',  dice: [1,2], ratio: '16 TO 1', reversed: true  },
  { id: 'eleven', dice: [5,6], ratio: '16 TO 1', reversed: true  },
]
</script>

<template>
  <div class="table-card">
    <div class="prop-layout">

      <!-- Any Seven -->
      <div class="bar-row bar-top">
        <div class="bar-left">
          <span class="bar-name">ANY SEVEN</span>
          <div class="chip" :class="{ active: (bets['any-seven'] || 0) > 0 }">
            ${{ bets['any-seven'] || 0 }}
          </div>
        </div>
        <div class="bar-ratio">4 <span class="to">TO</span> 1</div>
      </div>

      <!-- Horn High row -->
      <div class="horn-cells">
        <div
          v-for="cell in HORN_HIGH" :key="cell.id"
          class="horn-cell"
        >
          <div class="horn-cell-label">{{ cell.label }}</div>
          <div class="chip" :class="{ active: (bets[cell.id] || 0) > 0 }">
            ${{ bets[cell.id] || 0 }}
          </div>
        </div>
      </div>

      <!-- Main 2×2 zoom grid + center hub -->
      <div class="zoom-wrap">
        <div class="horn-grid">
          <div
            v-for="cell in ZOOM_CELLS" :key="cell.id"
            class="zoom-cell"
          >
            <template v-if="!cell.reversed">
              <div class="zoom-dice">
                <DieSvg v-for="(n, i) in cell.dice" :key="i" :n="n" :size="28"/>
              </div>
              <div class="chip" :class="{ active: (bets[cell.id] || 0) > 0 }">
                ${{ bets[cell.id] || 0 }}
              </div>
              <div class="zoom-ratio">{{ cell.ratio }}</div>
            </template>
            <template v-else>
              <div class="zoom-ratio">{{ cell.ratio }}</div>
              <div class="chip" :class="{ active: (bets[cell.id] || 0) > 0 }">
                ${{ bets[cell.id] || 0 }}
              </div>
              <div class="zoom-dice">
                <DieSvg v-for="(n, i) in cell.dice" :key="i" :n="n" :size="28"/>
              </div>
            </template>
          </div>

          <!-- Center Horn Bet hub -->
          <div class="horn-hub">
            <div class="horn-hub-label">HORN<br>BET</div>
            <div class="chip" :class="{ active: (bets['horn'] || 0) > 0 }">
              ${{ bets['horn'] || 0 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Any Craps -->
      <div class="bar-row bar-bot">
        <div class="bar-left">
          <span class="bar-name">ANY CRAPS</span>
          <div class="chip" :class="{ active: (bets['any-craps'] || 0) > 0 }">
            ${{ bets['any-craps'] || 0 }}
          </div>
        </div>
        <div class="bar-ratio">7½ <span class="to">TO</span> 1</div>
      </div>

    </div>
  </div>
</template>

<style scoped>
:root {
  --active-gold: #e9c349;
  --table-bg: #062a1a;
  --table-deep: #04200f;
  --border: rgba(149,212,179,0.22);
  --border-soft: rgba(149,212,179,0.10);
  --accent-dim: #95d4b3;
}

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
  position: relative;
}
.bar-top { border-bottom: 1px solid rgba(149,212,179,0.10); }
.bar-bot { border-top: 1px solid rgba(149,212,179,0.10); }
.bar-left { display: flex; align-items: center; gap: 14px; }
.bar-name {
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  color: #ef4444;
  letter-spacing: -0.02em;
  white-space: nowrap;
  flex-shrink: 0;
}
.bar-ratio {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.02em;
  color: var(--text);
  white-space: nowrap;
  flex-shrink: 0;
}
.bar-ratio .to { font-weight: 700; }

.horn-cells {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid rgba(149,212,179,0.10);
  border-bottom: 1px solid rgba(149,212,179,0.22);
  background: #04200f;
}
.horn-cell {
  padding: 18px 8px 16px;
  text-align: center;
  border-right: 1px solid rgba(149,212,179,0.10);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.horn-cell:last-child { border-right: none; }
.horn-cell-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #95d4b3;
}

.zoom-wrap {
  position: relative;
  background: #04200f;
}
.horn-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  min-height: 300px;
  position: relative;
}
.zoom-cell {
  border-right: 1px solid rgba(149,212,179,0.10);
  border-bottom: 1px solid rgba(149,212,179,0.10);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 22px 10px;
}
.zoom-cell:nth-child(2) { border-right: none; }
.zoom-cell:nth-child(3),
.zoom-cell:nth-child(4) { border-bottom: none; }
.zoom-cell:nth-child(4) { border-right: none; }

.zoom-dice { display: flex; gap: 8px; justify-content: center; }
.zoom-ratio {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #95d4b3;
}

.horn-hub {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: #062a1a;
  border: 1px solid rgba(149,212,179,0.10);
  padding: 12px 14px;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 4;
  min-width: 90px;
}
.horn-hub-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.18em;
  color: #95d4b3;
  text-align: center;
  line-height: 1.2;
  text-transform: uppercase;
}
/* Chip */
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
