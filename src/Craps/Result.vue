<script setup>
defineProps({
  d1: { type: Number, required: true },
  d2: { type: Number, required: true },
  sum: { type: Number, required: true }
})

const ROLL_LABELS = {
  2: 'Snake Eyes', 3: 'Ace Deuce', 4: 'Little Joe',
  5: 'Fever Five', 6: 'Easy/Hard Six', 7: 'Seven Out',
  8: 'Easy/Hard Eight', 9: 'Nina', 10: 'Big Dick',
  11: 'Yo', 12: 'Midnight'
}

const DOT_POS = {
  1: [[50,50]],
  2: [[28,28],[72,72]],
  3: [[28,28],[50,50],[72,72]],
  4: [[28,28],[72,28],[28,72],[72,72]],
  5: [[28,28],[72,28],[50,50],[28,72],[72,72]],
  6: [[28,24],[72,24],[28,50],[72,50],[28,76],[72,76]]
}
</script>

<template>
  <div class="card">
    <div style="padding: 12px 20px 0">
      <span class="overline">Dice Roll</span>
    </div>
    <div class="dice-inner">
      <div class="dice-pair">
        <svg v-for="(n, i) in [d1, d2]" :key="i" width="46" height="46" viewBox="0 0 100 100" class="die-svg">
          <rect width="100" height="100" rx="18" fill="#f0ece0"/>
          <circle v-for="([x, y], j) in (DOT_POS[n] || [])" :key="j" :cx="x" :cy="y" r="9" fill="#1a1a1a"/>
        </svg>
      </div>
      <div class="roll-right">
        <div class="roll-total">{{ sum }}</div>
        <div class="roll-label">{{ ROLL_LABELS[sum] || '' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--card-bg);
  border: 1px solid var(--border-page);
  border-radius: 14px;
  overflow: hidden;
}
.overline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.dice-inner {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.dice-pair {
  display: flex;
  gap: 10px;
  align-items: center;
}
.die-svg { display: block; }
.roll-right { text-align: right; }
.roll-total {
  font-size: 52px;
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  color: #34d399;
}
.roll-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 6px;
}
</style>
