<script setup>
defineProps({
  spin: { type: Number, required: true },
  history: { type: Array, required: true } // [current, prev1, prev2, prev3]
})

const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36])

function numClass(n) {
  if (n === 0 || n === '00') return 'z'
  return RED.has(n) ? 'r' : 'b'
}

function numProps(n) {
  if (n === 0) return 'GREEN · ZERO'
  if (n === '00') return 'GREEN · DOUBLE ZERO'
  const color = RED.has(n) ? 'RED' : 'BLACK'
  const parity = n % 2 === 0 ? 'EVEN' : 'ODD'
  const range = n <= 18 ? 'LOW' : 'HIGH'
  return `${color} · ${range} · ${parity}`
}
</script>

<template>
  <div class="card">
    <div style="padding: 12px 20px 0; display:flex; align-items:center; justify-content:space-between">
      <span class="overline">Last Spin</span>
    </div>
    <div class="result-inner">
      <div class="spin-history">
        <div
          v-for="(n, i) in history" :key="i"
          class="spin-pill"
          :class="[numClass(n), { 'is-current': i === 0 }]"
        >
          {{ n }}
        </div>
      </div>
      <div class="result-right">
        <div class="result-big" :class="numClass(spin)">{{ spin }}</div>
        <div class="result-props">{{ numProps(spin) }}</div>
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
.result-inner {
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.spin-history {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.spin-pill {
  width: 38px; height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  flex-shrink: 0;
}
.spin-pill.is-current { width: 46px; height: 46px; font-size: 17px; }
.spin-pill.r {
  background: rgba(239,107,107,0.12);
  color: #ef6b6b;
  border: 1.5px solid rgba(239,107,107,0.32);
}
.spin-pill.b {
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.92);
  border: 1.5px solid rgba(255,255,255,0.13);
}
.spin-pill.z {
  background: rgba(52,211,153,0.1);
  color: #34d399;
  border: 1.5px solid rgba(52,211,153,0.25);
}
.result-right { text-align: right; flex-shrink: 0; }
.result-big {
  font-size: 48px;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
}
.result-big.r { color: #ef6b6b; }
.result-big.b { color: rgba(255,255,255,0.92); }
.result-big.z { color: #34d399; }
.result-props {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-top: 6px;
}
</style>
