<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import RouletteResult from '@/Roulette/Result.vue'
import RouletteLayout from '@/Roulette/Layout.vue'
import PayoutArea from '@/Common/PayoutArea.vue'
import DiffDock from '@/Common/DiffDock.vue'

const RED = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36])

const WAGERS = [5, 10, 25, 50, 100]

const INSIDE_BETS = [
  { type: 'STRAIGHT UP', ratio: 35 },
  { type: 'SPLIT',       ratio: 17 },
  { type: 'STREET',      ratio: 11 },
  { type: 'CORNER',      ratio: 8  },
  { type: 'SIX LINE',    ratio: 5  },
]

const OUTSIDE_BETS = [
  { type: 'RED',    ratio: 1 },
  { type: 'BLACK',  ratio: 1 },
  { type: 'ODD',    ratio: 1 },
  { type: 'EVEN',   ratio: 1 },
  { type: 'LOW',    ratio: 1 },
  { type: 'HIGH',   ratio: 1 },
  { type: 'DOZEN1', ratio: 2 },
  { type: 'DOZEN2', ratio: 2 },
  { type: 'DOZEN3', ratio: 2 },
  { type: 'COL1',   ratio: 2 },
  { type: 'COL2',   ratio: 2 },
  { type: 'COL3',   ratio: 2 },
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function rand(n) { return Math.floor(Math.random() * n) }

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

function generateScenario() {
  const wager = pick(WAGERS)
  const isInside = Math.random() < 0.65
  let betNumbers = [], ratio, betType, isOutside = false, outsideBet = null

  if (isInside) {
    const bet = pick(INSIDE_BETS)
    betType = bet.type; ratio = bet.ratio

    if (betType === 'STRAIGHT UP') {
      betNumbers = [rand(37)]
    } else if (betType === 'SPLIT') {
      const splits = []
      for (let n = 1; n <= 36; n++) {
        const col = Math.floor((n - 1) / 3), row = (n - 1) % 3
        if (col < 11) splits.push([n, n + 3])
        if (row < 2) splits.push([n, n + 1])
      }
      betNumbers = pick(splits)
    } else if (betType === 'STREET') {
      const c = rand(12), base = c * 3 + 1
      betNumbers = [base, base + 1, base + 2]
    } else if (betType === 'CORNER') {
      const corners = []
      for (let n = 1; n <= 36; n++) {
        if ((n - 1) % 3 < 2 && Math.floor((n - 1) / 3) < 11) corners.push([n, n+1, n+3, n+4])
      }
      betNumbers = pick(corners)
    } else if (betType === 'SIX LINE') {
      const c = rand(11), base = c * 3 + 1
      betNumbers = [base, base+1, base+2, base+3, base+4, base+5]
    }
  } else {
    isOutside = true
    outsideBet = pick(OUTSIDE_BETS)
    betType = outsideBet.type
    ratio = outsideBet.ratio
  }

  let spin
  if (Math.random() < 0.8) {
    if (isOutside) {
      const winners = Array.from({ length: 37 }, (_, i) => i).filter(n => checkOutside(betType, n))
      spin = pick(winners.length ? winners : [1])
    } else {
      spin = pick(betNumbers)
    }
  } else {
    const all = Array.from({ length: 37 }, (_, i) => i)
    const losers = isOutside
      ? all.filter(n => !checkOutside(betType, n))
      : all.filter(n => !betNumbers.includes(n))
    spin = pick(losers.length ? losers : [0])
  }

  const win = isOutside ? checkOutside(betType, spin) : betNumbers.includes(spin)
  const payout = win ? wager * ratio : 0
  const history = [spin, rand(37), rand(37), rand(37)]

  return { betType, ratio, wager, betNumbers, isOutside, outsideBet, spin, win, payout, history }
}

const scenario = ref(generateScenario())
const status = ref('idle')
const feedbackHtml = ref('')

function onSubmit(val) {
  const correct = scenario.value.payout
  if (val === correct) {
    if (scenario.value.win) {
      feedbackHtml.value = `${scenario.value.betType} · $${scenario.value.wager} × ${scenario.value.ratio} = <span class="hi">$${correct}</span>`
    } else {
      feedbackHtml.value = 'Bet lost. No payout.'
    }
    status.value = 'correct'
  } else {
    feedbackHtml.value = `The correct payout was <span class="hi">$${correct}</span>`
    status.value = 'wrong'
  }
}

function onNext() {
  scenario.value = generateScenario()
  status.value = 'idle'
  feedbackHtml.value = ''
}
</script>

<template>
  <div class="page">
    <nav class="top-nav">
      <RouterLink to="/" class="nav-back">← Home</RouterLink>
      <DiffDock />
      <span class="nav-game">Roulette</span>
    </nav>

    <RouletteResult :spin="scenario.spin" :history="scenario.history"/>
    <RouletteLayout :scenario="scenario"/>
    <PayoutArea
      :status="status"
      :correct="scenario.payout"
      :feedback-html="feedbackHtml"
      @submit="onSubmit"
      @next="onNext"
    />
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  max-width: 560px;
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.top-nav {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
}
:deep(.diff-dock) { justify-self: center; }
.nav-back {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--text-muted);
  text-decoration: none;
  text-transform: uppercase;
}
.nav-back:hover { color: var(--text); }
.nav-game {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--text-muted);
  text-transform: uppercase;
}
</style>
