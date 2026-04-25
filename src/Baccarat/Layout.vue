<script setup>
defineProps({
  bets: { type: Object, default: () => ({}) }
})

const DT_CELLS = [
  { id: 'dragon-tiger', label: 'Dragon Tiger', ratio: '40 TO 1', bg: 'bg-dragon' },
  { id: 'dragon-tie',   label: 'Dragon Tie',   ratio: '40 TO 1', bg: 'bg-dragon' },
  { id: 'tiger',        label: 'Tiger',         ratio: '4 TO 1',  bg: 'bg-tiger'  },
  { id: 'big-dragon',   label: 'Big Dragon',    ratio: '30 TO 1', bg: 'bg-dragon' },
  { id: 'dt-tie',       label: 'Tie',           ratio: '8 TO 1',  bg: 'bg-tie'    },
  { id: 'big-tiger',    label: 'Big Tiger',     ratio: '30 TO 1', bg: 'bg-tiger'  },
  { id: 'small-dragon', label: 'Small Dragon',  ratio: '30 TO 1', bg: 'bg-dragon' },
  { id: 'tiger-tie',    label: 'Tiger Tie',     ratio: '35 TO 1', bg: 'bg-tiger'  },
  { id: 'small-tiger',  label: 'Small Tiger',   ratio: '8 TO 1',  bg: 'bg-tiger'  },
]
</script>

<template>
  <div class="table-card">

    <!-- Main bets -->
    <div class="main-bets">
      <div class="main-bet-row banker-row">
        <div class="row-left">
          <div class="row-name">Banker</div>
          <div class="chip" :class="{ active: (bets['banker'] || 0) > 0 }">
            ${{ bets['banker'] || 0 }}
          </div>
        </div>
        <div class="row-ratio">0.95 TO 1</div>
      </div>
      <div class="main-bet-row player-row">
        <div class="row-left">
          <div class="row-name">Player</div>
          <div class="chip" :class="{ active: (bets['player'] || 0) > 0 }">
            ${{ bets['player'] || 0 }}
          </div>
        </div>
        <div class="row-ratio">1 TO 1</div>
      </div>
    </div>

    <!-- Dragon / Tiger side bet grid (3×3) -->
    <div class="dt-grid">
      <div
        v-for="cell in DT_CELLS" :key="cell.id"
        class="dt-cell"
        :class="cell.bg"
      >
        <div class="chip" :class="{ active: (bets[cell.id] || 0) > 0 }">
          ${{ bets[cell.id] || 0 }}
        </div>
        <div class="dt-cell-name">{{ cell.label }}</div>
        <div class="dt-cell-ratio">{{ cell.ratio }}</div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.table-card {
  background: #2d1b5e;
  border: 1px solid rgba(200,180,240,0.18);
  border-radius: 14px;
  overflow: hidden;
}

/* Main bet rows */
.main-bets { display: flex; flex-direction: column; }
.main-bet-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(200,180,240,0.09);
  position: relative;
}
.banker-row { background: rgba(91,74,158,0.35); }
.player-row { background: rgba(91,74,158,0.15); }
.row-left { display: flex; align-items: center; gap: 12px; }
.row-right { display: flex; align-items: center; gap: 14px; }
.row-name {
  font-size: 19px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}
.banker-row .row-name { color: #ef4444; }
.player-row .row-name { color: #f2f2f2; }
.row-ratio {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(220,180,255,0.5);
}
.banker-row .row-ratio { color: rgba(255,180,180,0.5); }

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
  background: #e9a93a;
  color: #1a1200;
  box-shadow: 0 0 16px rgba(233,195,73,0.45);
}

/* Dragon/Tiger grid */
.dt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.dt-cell {
  padding: 18px 10px 14px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  border: 1px solid rgba(0,0,0,0.18);
  position: relative;
}
.bg-dragon { background: #5b4a9e; }
.bg-tiger  { background: #c98a2a; }
.bg-tie    { background: #1e1040; }

.dt-cell-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  text-align: center;
  line-height: 1.35;
}
.dt-cell-ratio {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.38);
}

</style>
