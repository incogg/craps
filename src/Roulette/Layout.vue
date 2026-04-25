<script setup>
import { computed } from 'vue'

const props = defineProps({
  scenario: { type: Object, required: true }
})

const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36])

function numClass(n) {
  if (n === 0) return 'z'
  return RED.has(n) ? 'r' : 'b'
}

function checkOutside(betType, spin) {
  if (spin === 0 || spin === '00') return false
  if (betType === 'RED')    return RED.has(spin)
  if (betType === 'BLACK')  return !RED.has(spin)
  if (betType === 'ODD')    return spin % 2 !== 0
  if (betType === 'EVEN')   return spin % 2 === 0
  if (betType === 'LOW')    return spin >= 1 && spin <= 18
  if (betType === 'HIGH')   return spin >= 19 && spin <= 36
  if (betType === 'DOZEN1') return spin >= 1 && spin <= 12
  if (betType === 'DOZEN2') return spin >= 13 && spin <= 24
  if (betType === 'DOZEN3') return spin >= 25 && spin <= 36
  if (betType === 'COL1')   return spin % 3 === 1
  if (betType === 'COL2')   return spin % 3 === 2
  if (betType === 'COL3')   return spin % 3 === 0
  return false
}

// Build grid: col 0-11, row 0-2 → n = col*3 + (3-row)
const gridCells = computed(() => {
  const cells = []
  for (let col = 0; col < 12; col++) {
    for (let row = 0; row < 3; row++) {
      const n = col * 3 + (3 - row)
      const betSet = new Set(props.scenario.isOutside ? [] : props.scenario.betNumbers)
      const isHit = betSet.has(n)
      const isOutHit = props.scenario.isOutside && n > 0 && checkOutside(props.scenario.betType, n)
      const isPrimary = isHit && props.scenario.betNumbers[0] === n
      cells.push({ n, row, col, isHit, isOutHit, isPrimary, cls: numClass(n) })
    }
  }
  return cells
})

const focusBadgeText = computed(() => {
  const s = props.scenario
  if (!s.isOutside) return s.betNumbers[0]
  return s.betType.replace('DOZEN', 'DOZ ').replace('COL ', 'COL')
})

const outsideRow1 = [
  { key: 'RED',   label: 'RED',   ratio: '1:1' },
  { key: 'BLACK', label: 'BLACK', ratio: '1:1' },
  { key: 'ODD',   label: 'ODD',   ratio: '1:1' },
  { key: 'EVEN',  label: 'EVEN',  ratio: '1:1' },
  { key: 'LOW',   label: '1–18',  ratio: '1:1' },
  { key: 'HIGH',  label: '19–36', ratio: '1:1' },
]
const outsideRow2 = [
  { key: 'DOZEN1', label: '1ST 12', ratio: '2:1' },
  { key: 'COL1',   label: 'COL 1',  ratio: '2:1' },
  { key: 'DOZEN2', label: '2ND 12', ratio: '2:1' },
  { key: 'COL2',   label: 'COL 2',  ratio: '2:1' },
  { key: 'DOZEN3', label: '3RD 12', ratio: '2:1' },
  { key: 'COL3',   label: 'COL 3',  ratio: '2:1' },
]
</script>

<template>
  <div class="table-card">
    <!-- Header -->
    <div class="table-header">
      <div class="table-title">{{ scenario.isOutside ? 'OUTSIDE BETS' : 'INSIDE BETS' }}</div>
      <div class="focus-pill">
        <span class="focus-label">Focus</span>
        <span class="focus-badge">{{ focusBadgeText }}</span>
      </div>
    </div>

    <!-- Number grid -->
    <div class="grid-wrap">
      <div class="number-grid">
        <!-- 0 cell spanning all 3 rows -->
        <div class="gcell zero" :class="{ hit: !scenario.isOutside && scenario.betNumbers.includes(0) }">
          <span class="gcell-num">0</span>
          <div v-if="!scenario.isOutside && scenario.betNumbers[0] === 0" class="chip">
            ${{ scenario.wager }}
          </div>
        </div>

        <!-- Numbers 1–36 -->
        <div
          v-for="cell in gridCells" :key="cell.n"
          class="gcell"
          :class="[cell.cls, { hit: cell.isHit || cell.isOutHit }]"
          :style="{ gridRow: cell.row + 1, gridColumn: cell.col + 2 }"
        >
          <span class="gcell-num">{{ cell.n }}</span>
          <div v-if="cell.isPrimary" class="chip">${{ scenario.wager }}</div>
        </div>
      </div>
    </div>

    <!-- Outside bet strips (shown only for outside bets) -->
    <template v-if="scenario.isOutside">
      <div class="outside-strip">
        <div
          v-for="cell in outsideRow1" :key="cell.key"
          class="outside-cell"
          :class="{ hit: scenario.betType === cell.key }"
        >
          <div class="outside-label">{{ cell.label }}</div>
          <div class="outside-ratio">{{ cell.ratio }}</div>
          <div v-if="scenario.betType === cell.key" class="outside-chip">${{ scenario.wager }}</div>
        </div>
      </div>
      <div class="outside-strip">
        <div
          v-for="cell in outsideRow2" :key="cell.key"
          class="outside-cell"
          :class="{ hit: scenario.betType === cell.key }"
        >
          <div class="outside-label">{{ cell.label }}</div>
          <div class="outside-ratio">{{ cell.ratio }}</div>
          <div v-if="scenario.betType === cell.key" class="outside-chip">${{ scenario.wager }}</div>
        </div>
      </div>
    </template>

    <!-- Bet info bar -->
    <div class="bet-info">
      <span class="bet-name-label">{{ scenario.betType }}</span>
      <span class="bet-ratio-label">{{ scenario.ratio }} TO 1</span>
    </div>
  </div>
</template>

<style scoped>
.table-card {
  background: #210d17;
  border: 1px solid rgba(212,75,106,0.28);
  border-radius: 14px;
  overflow: hidden;
}
.table-header {
  padding: 12px 18px;
  background: #160810;
  border-bottom: 1px solid rgba(212,75,106,0.28);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-title {
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  color: #ef4444;
  letter-spacing: -0.01em;
}
.focus-pill { display: flex; align-items: center; gap: 8px; }
.focus-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.focus-badge {
  background: #d44b6a;
  color: white;
  font-size: 11px;
  font-weight: 900;
  padding: 3px 10px;
  border-radius: 99px;
  min-width: 26px;
  text-align: center;
}

.grid-wrap { padding: 14px; }
.number-grid {
  display: grid;
  grid-template-columns: 34px repeat(12, 1fr);
  grid-template-rows: repeat(3, 46px);
  border: 1px solid rgba(212,75,106,0.28);
  border-radius: 8px;
  overflow: hidden;
}
.gcell {
  border: 1px solid rgba(212,75,106,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.gcell.zero {
  grid-row: 1 / 4;
  grid-column: 1;
  background: rgba(52,211,153,0.05);
}
.gcell-num {
  font-size: 15px;
  font-weight: 900;
  letter-spacing: -0.02em;
  user-select: none;
}
.gcell.r .gcell-num { color: #ef6b6b; }
.gcell.b .gcell-num { color: rgba(255,255,255,0.85); }
.gcell.zero .gcell-num { color: #34d399; font-size: 17px; }
.gcell.hit {
  background: rgba(212,75,106,0.14);
  box-shadow: inset 0 0 0 2px rgba(212,75,106,0.42);
}
.gcell.hit::after {
  content: '';
  position: absolute;
  inset: 5px;
  border: 1.5px dashed rgba(212,75,106,0.48);
  border-radius: 2px;
  pointer-events: none;
}

/* Inside chip (circular) */
.chip {
  position: absolute;
  width: 30px; height: 30px;
  border-radius: 50%;
  background: #d44b6a;
  color: #160810;
  font-family: 'Outfit', sans-serif;
  font-size: 8px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 14px rgba(212,75,106,0.6);
  border: 1.5px solid #160810;
  z-index: 2;
  white-space: nowrap;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

/* Outside strips */
.outside-strip {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  border-top: 1px solid rgba(212,75,106,0.12);
  margin: 0 14px;
}
.outside-cell {
  border: 1px solid rgba(212,75,106,0.12);
  padding: 8px 4px;
  text-align: center;
  position: relative;
}
.outside-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-muted);
  line-height: 1.3;
}
.outside-ratio {
  font-size: 9px;
  font-weight: 700;
  color: var(--text-dim);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.1em;
}
.outside-cell.hit {
  background: rgba(212,75,106,0.14);
  box-shadow: inset 0 0 0 2px rgba(212,75,106,0.42);
}
.outside-cell.hit::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1.5px dashed rgba(212,75,106,0.48);
  border-radius: 2px;
  pointer-events: none;
}
.outside-chip {
  position: absolute;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #d44b6a;
  color: #160810;
  font-size: 7px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(212,75,106,0.55);
  border: 1.5px solid #160810;
  z-index: 2;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.bet-info {
  padding: 11px 18px;
  border-top: 1px solid rgba(212,75,106,0.12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,0.22);
  margin-top: 14px;
}
.bet-name-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.bet-ratio-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(212,75,106,0.85);
}
</style>
