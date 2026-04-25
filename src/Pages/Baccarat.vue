<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import BaccaratResult from '@/Baccarat/Result.vue'
import BaccaratLayout from '@/Baccarat/Layout.vue'
import PayoutArea from '@/Common/PayoutArea.vue'
import DiffDock from '@/Common/DiffDock.vue'

const SUITS = ['♠','♥','♦','♣']
const VALUES = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

function randCard() {
  return { val: VALUES[Math.floor(Math.random() * 13)], suit: SUITS[Math.floor(Math.random() * 4)] }
}
function cardPoints(val) {
  if (['10','J','Q','K'].includes(val)) return 0
  if (val === 'A') return 1
  return parseInt(val)
}
function handTotal(cards) {
  return cards.reduce((sum, c) => sum + cardPoints(c.val), 0) % 10
}

const MAIN_BETS = [
  { id: 'banker', label: 'BANKER', ratio: 0.95 },
  { id: 'player', label: 'PLAYER', ratio: 1 },
]
const DT_BETS = [
  { id: 'dragon-tiger', label: 'DRAGON TIGER', ratio: 40 },
  { id: 'dragon-tie',   label: 'DRAGON TIE',   ratio: 40 },
  { id: 'tiger',        label: 'TIGER',         ratio: 4  },
  { id: 'big-dragon',   label: 'BIG DRAGON',    ratio: 30 },
  { id: 'dt-tie',       label: 'TIE',           ratio: 8  },
  { id: 'big-tiger',    label: 'BIG TIGER',     ratio: 30 },
  { id: 'small-dragon', label: 'SMALL DRAGON',  ratio: 30 },
  { id: 'tiger-tie',    label: 'TIGER TIE',     ratio: 35 },
  { id: 'small-tiger',  label: 'SMALL TIGER',   ratio: 8  },
]
const WAGERS = [5, 10, 25, 50, 100]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function checkDTWin(betId, result, bFinal, pFinal) {
  if (betId === 'dragon-tiger') return result === 'banker' && bFinal >= 8
  if (betId === 'dragon-tie')   return result === 'tie'
  if (betId === 'tiger')        return result === 'player'
  if (betId === 'big-dragon')   return result === 'banker' && bFinal >= 7
  if (betId === 'dt-tie')       return result === 'tie'
  if (betId === 'big-tiger')    return result === 'player' && pFinal >= 7
  if (betId === 'small-dragon') return result === 'banker' && bFinal <= 6
  if (betId === 'tiger-tie')    return result === 'tie'
  if (betId === 'small-tiger')  return result === 'player' && pFinal <= 6
  return false
}

function dealHands() {
  const bankerCards = [randCard(), randCard()]
  const playerCards = [randCard(), randCard()]
  const bT = handTotal(bankerCards), pT = handTotal(playerCards)
  if (pT <= 5 && bT <= 7) playerCards.push(randCard())
  if (bT <= 5 && pT !== 6 && pT !== 7) bankerCards.push(randCard())
  return { bankerCards, playerCards }
}

function generateScenario() {
  const isMain = Math.random() < 0.4
  const bet = isMain ? pick(MAIN_BETS) : pick(DT_BETS)
  const wager = pick(WAGERS)
  const { bankerCards, playerCards } = dealHands()
  const bFinal = handTotal(bankerCards), pFinal = handTotal(playerCards)
  const result = bFinal > pFinal ? 'banker' : pFinal > bFinal ? 'player' : 'tie'

  let win = false
  if (bet.id === 'banker') win = result === 'banker'
  else if (bet.id === 'player') win = result === 'player'
  else win = checkDTWin(bet.id, result, bFinal, pFinal)

  if (!win && Math.random() < 0.8) return generateScenario()

  let payout = 0
  let pushNote = ''
  if ((bet.id === 'banker' || bet.id === 'player') && result === 'tie') {
    payout = 0; pushNote = 'PUSH — TIE RESULT'
  } else if (win) {
    payout = bet.id === 'banker' ? Math.floor(wager * 0.95) : wager * bet.ratio
  }

  return { bet, wager, bankerCards, playerCards, bFinal, pFinal, result, win, payout, pushNote }
}

const scenario = ref(generateScenario())
const status = ref('idle')
const feedbackHtml = ref('')

const ALL_BET_IDS = [
  'banker', 'player',
  'dragon-tiger', 'dragon-tie', 'tiger',
  'big-dragon', 'dt-tie', 'big-tiger',
  'small-dragon', 'tiger-tie', 'small-tiger',
]

const bets = computed(() => {
  const all = {}
  ALL_BET_IDS.forEach(id => { all[id] = 0 })
  all[scenario.value.bet.id] = scenario.value.wager
  return all
})

function buildFeedback(s, correct) {
  if (s.pushNote) return `${s.pushNote} — bet returned, no payout.`
  if (s.win) {
    const ratioStr = s.bet.id === 'banker' ? '× 0.95' : `× ${s.bet.ratio}`
    return `${s.bet.label} · $${s.wager} ${ratioStr} = <span class="hi">$${correct}</span>`
  }
  return 'Bet lost. No payout.'
}

function onSubmit(val) {
  const correct = scenario.value.payout
  if (val === correct) {
    feedbackHtml.value = buildFeedback(scenario.value, correct)
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
      <span class="nav-game">Baccarat</span>
    </nav>

    <BaccaratResult
      :banker-cards="scenario.bankerCards"
      :player-cards="scenario.playerCards"
      :b-final="scenario.bFinal"
      :p-final="scenario.pFinal"
      :result="scenario.result"
    />
    <BaccaratLayout :bets="bets"/>
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
