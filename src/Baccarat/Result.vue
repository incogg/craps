<script setup>
defineProps({
  bankerCards: { type: Array, required: true },
  playerCards: { type: Array, required: true },
  bFinal: { type: Number, required: true },
  pFinal: { type: Number, required: true },
  result: { type: String, required: true } // 'banker' | 'player' | 'tie'
})

const RED_SUITS = new Set(['♥', '♦'])
function isRed(suit) { return RED_SUITS.has(suit) }

function handLabel(total) {
  if (total === 8 || total === 9) return 'NATURAL ' + total
  return 'TOTAL ' + total
}
</script>

<template>
  <div class="card">
    <div style="padding: 12px 20px 0">
      <span class="overline">Card Draw</span>
    </div>
    <div class="draw-inner">

      <!-- Banker side (right-aligned, toward divider) -->
      <div class="draw-side align-right">
        <div class="draw-side-label">Banker</div>
        <div class="draw-cards">
          <!-- 3-card: third card sideways first (leftmost = outermost on right-aligned side) -->
          <template v-if="bankerCards.length === 3">
            <div class="card-sideways-wrapper">
              <div class="playing-card card-sideways" :class="isRed(bankerCards[2].suit) ? 'red' : 'black'">
                <div class="card-val">{{ bankerCards[2].val }}</div>
                <div class="card-suit">{{ bankerCards[2].suit }}</div>
              </div>
            </div>
            <div class="playing-card" :class="isRed(bankerCards[0].suit) ? 'red' : 'black'">
              <div class="card-val">{{ bankerCards[0].val }}</div>
              <div class="card-suit">{{ bankerCards[0].suit }}</div>
            </div>
            <div class="playing-card" :class="isRed(bankerCards[1].suit) ? 'red' : 'black'">
              <div class="card-val">{{ bankerCards[1].val }}</div>
              <div class="card-suit">{{ bankerCards[1].suit }}</div>
            </div>
          </template>
          <template v-else>
            <div v-for="(card, i) in bankerCards" :key="i" class="playing-card" :class="isRed(card.suit) ? 'red' : 'black'">
              <div class="card-val">{{ card.val }}</div>
              <div class="card-suit">{{ card.suit }}</div>
            </div>
          </template>
        </div>
        <div class="draw-total" :class="{ winner: result === 'banker' }">{{ bFinal }}</div>
        <div class="draw-total-label">{{ handLabel(bFinal) }}{{ result === 'banker' ? ' · WINS' : '' }}</div>
      </div>

      <div class="draw-divider"></div>

      <!-- Player side (left-aligned) -->
      <div class="draw-side">
        <div class="draw-side-label">Player</div>
        <div class="draw-cards">
          <template v-for="(card, i) in playerCards" :key="i">
            <div v-if="i !== 2" class="playing-card" :class="isRed(card.suit) ? 'red' : 'black'">
              <div class="card-val">{{ card.val }}</div>
              <div class="card-suit">{{ card.suit }}</div>
            </div>
            <div v-else class="card-sideways-wrapper">
              <div class="playing-card card-sideways" :class="isRed(card.suit) ? 'red' : 'black'">
                <div class="card-val">{{ card.val }}</div>
                <div class="card-suit">{{ card.suit }}</div>
              </div>
            </div>
          </template>
        </div>
        <div class="draw-total" :class="{ winner: result === 'player' }">{{ pFinal }}</div>
        <div class="draw-total-label">{{ handLabel(pFinal) }}{{ result === 'player' ? ' · WINS' : '' }}</div>
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
.draw-inner {
  padding: 18px 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.draw-side { flex: 1; }
.draw-side-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.draw-cards {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: flex-end;
}
.playing-card {
  width: 38px; height: 54px;
  background: #f8f4ef;
  border-radius: 5px;
  border: 1px solid #d0c8b8;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 4px 5px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.card-val { font-size: 14px; font-weight: 900; line-height: 1; }
.card-suit { font-size: 11px; line-height: 1; }
.playing-card.red .card-val,
.playing-card.red .card-suit { color: #c0392b; }
.playing-card.black .card-val,
.playing-card.black .card-suit { color: #1a1a1a; }

.draw-total {
  font-size: 36px;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-top: 10px;
  color: var(--text);
}
.draw-total.winner { color: #e9a93a; }
.draw-total-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 4px;
}
.draw-divider {
  width: 1px;
  background: var(--border-page);
  align-self: stretch;
  margin: 0 4px;
}

.draw-side.align-right { align-items: flex-end; }
.draw-side.align-right .draw-cards { justify-content: flex-end; }
.draw-side.align-right .draw-total { text-align: right; }
.draw-side.align-right .draw-total-label { text-align: right; }
.draw-side.align-right .draw-side-label { text-align: right; }

.card-sideways-wrapper {
  width: 54px; height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.playing-card.card-sideways { transform: rotate(-90deg); }
</style>
