<script setup>
defineProps({
  bets:        { type: Object, default: () => ({}) },
  activeBetId: { type: String, default: '' },
  dtTier:      { type: Number, default: 0 },
})

const DT_CELLS = [
  { id: 'dragon-tiger', label: 'Dragon Tiger', bg: 'bg-dragon', tiers: [
    { odds: '30:1',  cond: '4-card', tier: 30  },
    { odds: '40:1',  cond: '5-card', tier: 40  },
    { odds: '100:1', cond: '6-card', tier: 100 },
  ]},
  { id: 'dragon-tie',   label: 'Dragon Tie',   bg: 'bg-dragon', tiers: [
    { odds: '42:1', cond: 'Standard', tier: 42 },
  ]},
  { id: 'tiger',        label: 'Tiger',         bg: 'bg-tiger',  tiers: [
    { odds: '12:1', cond: '2-card', tier: 12 },
    { odds: '22:1', cond: '3-card', tier: 22 },
  ]},
  { id: 'big-dragon',   label: 'Big Dragon',    bg: 'bg-dragon', tiers: [
    { odds: '30:1', cond: 'Standard', tier: 30 },
  ]},
  { id: 'dt-tie',       label: 'Tie',           bg: 'bg-tie',    tiers: [
    { odds: '8:1', cond: 'Standard', tier: 8 },
  ]},
  { id: 'big-tiger',    label: 'Big Tiger',     bg: 'bg-tiger',  tiers: [
    { odds: '55:1', cond: 'Standard', tier: 55 },
  ]},
  { id: 'small-dragon', label: 'Small Dragon',  bg: 'bg-dragon', tiers: [
    { odds: '15:1', cond: 'Standard', tier: 15 },
  ]},
  { id: 'tiger-tie',    label: 'Tiger Tie',     bg: 'bg-tiger',  tiers: [
    { odds: '45:1', cond: 'Standard', tier: 45 },
  ]},
  { id: 'small-tiger',  label: 'Small Tiger',   bg: 'bg-tiger',  tiers: [
    { odds: '22:1', cond: 'Standard', tier: 22 },
  ]},
]
</script>

<template>
  <div class="table-card">

    <!-- Main bets -->
    <div class="main-bets">
      <div class="main-bet-row banker-row">
        <div class="row-left">
          <div class="row-name">Banker</div>
        </div>
        <div class="row-right">
          <div class="chip" :class="{ active: (bets['banker'] || 0) > 0 }">
            ${{ bets['banker'] || 0 }}
          </div>
          <div class="row-ratio">0.95 TO 1</div>
        </div>
      </div>
      <div class="main-bet-row player-row">
        <div class="row-left">
          <div class="row-name">Player</div>
        </div>
        <div class="row-right">
          <div class="chip" :class="{ active: (bets['player'] || 0) > 0 }">
            ${{ bets['player'] || 0 }}
          </div>
          <div class="row-ratio">1 TO 1</div>
        </div>
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
        <div class="dt-tier-list">
          <div
            v-for="t in cell.tiers" :key="t.tier"
            class="dt-tier"
            :class="{ active: activeBetId === cell.id && dtTier === t.tier }"
          >
            <span class="tier-odds">{{ t.odds }}</span>
            <span class="tier-cond">{{ t.cond }}</span>
          </div>
        </div>
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
}
.banker-row { background: rgba(91,74,158,0.35); }
.player-row { background: rgba(91,74,158,0.15); }
.row-left  { display: flex; align-items: center; gap: 12px; }
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
  color: rgba(255,255,255,0.45);
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

/* Dragon/Tiger grid */
.dt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
.dt-cell {
  padding: 16px 10px 14px;
  min-height: 116px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  border: 1px solid rgba(0,0,0,0.18);
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
  margin-top: 2px;
}

/* Tiered payout list */
.dt-tier-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  width: 100%;
  padding-top: 2px;
  border-top: 1px solid rgba(255,255,255,0.10);
  margin-top: auto;
  min-height: 52px;
  justify-content: flex-end;
}
.dt-tier {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.2;
  color: rgba(255,255,255,0.55);
}
.tier-odds {
  color: rgba(255,255,255,0.85);
  font-weight: 700;
  min-width: 38px;
  text-align: right;
}
.tier-cond {
  color: rgba(255,255,255,0.42);
  font-size: 8px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

</style>
