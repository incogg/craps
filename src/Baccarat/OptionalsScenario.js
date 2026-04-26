import BaccaratLayout from './Layout.vue'

// ---------------------------------------------------------------------------
// Card helpers
// ---------------------------------------------------------------------------

const SUITS  = ['♠', '♥', '♦', '♣']
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function randCard() {
    return { val: VALUES[Math.floor(Math.random() * 13)], suit: SUITS[Math.floor(Math.random() * 4)] }
}

function cardPoints(val) {
    if (['10', 'J', 'Q', 'K'].includes(val)) return 0
    if (val === 'A') return 1
    return parseInt(val)
}

function handTotal(cards) {
    return cards.reduce((s, c) => s + cardPoints(c.val), 0) % 10
}

// Full baccarat deal according to standard drawing rules
function dealFull() {
    const pCards = [randCard(), randCard()]
    const bCards = [randCard(), randCard()]
    const pT2    = handTotal(pCards)
    const bT2    = handTotal(bCards)

    // Naturals — no draw
    if (pT2 >= 8 || bT2 >= 8) return { playerCards: pCards, bankerCards: bCards }

    // Player draws on 0–5
    if (pT2 <= 5) pCards.push(randCard())

    // Banker drawing rules
    const pDrew = pCards.length === 3
    if (!pDrew) {
        if (bT2 <= 5) bCards.push(randCard())
    } else {
        const p3 = cardPoints(pCards[2].val)
        let draw = false
        if (bT2 <= 2)      draw = true
        else if (bT2 === 3) draw = p3 !== 8
        else if (bT2 === 4) draw = [2, 3, 4, 5, 6, 7].includes(p3)
        else if (bT2 === 5) draw = [4, 5, 6, 7].includes(p3)
        else if (bT2 === 6) draw = [6, 7].includes(p3)
        if (draw) bCards.push(randCard())
    }

    return { playerCards: pCards, bankerCards: bCards }
}

// Rejection-sample a valid hand for the given bet
function genForBet(betId) {
    for (let i = 0; i < 10000; i++) {
        const { playerCards, bankerCards } = dealFull()
        const pTotal  = handTotal(playerCards)
        const bTotal  = handTotal(bankerCards)
        const pCount  = playerCards.length
        const bCount  = bankerCards.length
        const result  = pTotal > bTotal ? 'player' : bTotal > pTotal ? 'banker' : 'tie'

        switch (betId) {
            case 'small-dragon':  if (result === 'player' && pTotal === 7 && pCount === 2) return { playerCards, bankerCards }; break
            case 'big-dragon':    if (result === 'player' && pTotal === 7 && pCount === 3) return { playerCards, bankerCards }; break
            case 'dragon-tiger':  if (result === 'player' && pTotal === 7 && bTotal === 6) return { playerCards, bankerCards }; break
            case 'dragon-tie':    if (result === 'tie'    && pTotal === 7)                 return { playerCards, bankerCards }; break
            case 'small-tiger':   if (result === 'banker' && bTotal === 6 && bCount === 2) return { playerCards, bankerCards }; break
            case 'big-tiger':     if (result === 'banker' && bTotal === 6 && bCount === 3) return { playerCards, bankerCards }; break
            case 'tiger':         if (result === 'banker' && bTotal === 6)                 return { playerCards, bankerCards }; break
            case 'dt-tie':        if (result === 'tie')                                    return { playerCards, bankerCards }; break
            case 'tiger-tie':     if (result === 'tie'    && bTotal === 6)                 return { playerCards, bankerCards }; break
        }
    }
    // Fallback — practically unreachable
    return dealFull()
}

// ---------------------------------------------------------------------------
// Bets definition
// ---------------------------------------------------------------------------

const BETS = [
    { id: 'dragon-tiger', label: 'DRAGON TIGER', tiered: true  },
    { id: 'dragon-tie',   label: 'DRAGON TIE',   ratio: 42     },
    { id: 'tiger',        label: 'TIGER',         tiered: true  },
    { id: 'big-dragon',   label: 'BIG DRAGON',    ratio: 30     },
    { id: 'dt-tie',       label: 'TIE',           ratio: 8      },
    { id: 'big-tiger',    label: 'BIG TIGER',     ratio: 55     },
    { id: 'small-dragon', label: 'SMALL DRAGON',  ratio: 15     },
    { id: 'tiger-tie',    label: 'TIGER TIE',     ratio: 45     },
    { id: 'small-tiger',  label: 'SMALL TIGER',   ratio: 22     },
]

const ALL_BET_IDS = BETS.map(b => b.id)

function dtTierForHand(betId, pCount, bCount) {
    if (betId === 'dragon-tiger') {
        const total = pCount + bCount
        if (total === 4) return 30
        if (total === 5) return 40
        return 100 // 6 cards
    }
    if (betId === 'tiger') return bCount === 2 ? 12 : 22
    return 0
}

function tierLabel(betId, pCount, bCount) {
    if (betId === 'dragon-tiger') return `${pCount + bCount}-CARD`
    if (betId === 'tiger') return bCount === 2 ? '2-CARD' : '3-CARD'
    return ''
}

// ---------------------------------------------------------------------------
// Wager — multiples of $25, range scales with difficulty
// ---------------------------------------------------------------------------

const WAGER_RANGES = {
    easy:   { min: 1, max:  4  },  // $25–$100
    medium: { min: 1, max: 20  },  // $25–$500
    hard:   { min: 1, max: 60  },  // $25–$1500
}

function randomWager(difficulty) {
    const { min, max } = WAGER_RANGES[difficulty] || WAGER_RANGES.easy
    return (min + Math.floor(Math.random() * (max - min + 1))) * 25
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const CORRECT_MESSAGES = [
    'Well done.',
    'Correct.',
    'Nice work.',
    'Spot on.',
    "That's the one.",
    'Right on the money.',
    "You're not just a pretty face.",
    'Calculator who?',
    'Textbook.',
    'Boxy approves.',
    'Sharp.',
    "You've done this before.",
]

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

function generate(difficulty) {
    const bet   = pick(BETS)
    const wager = randomWager(difficulty)
    const { playerCards, bankerCards } = genForBet(bet.id)
    const pTotal  = handTotal(playerCards)
    const bTotal  = handTotal(bankerCards)
    const pCount  = playerCards.length
    const bCount  = bankerCards.length
    const result  = pTotal > bTotal ? 'player' : bTotal > pTotal ? 'banker' : 'tie'

    let ratio, dtTier
    if (bet.tiered) {
        dtTier = dtTierForHand(bet.id, pCount, bCount)
        ratio  = dtTier
    } else {
        ratio  = bet.ratio
        dtTier = bet.ratio
    }

    return {
        betId:       bet.id,
        betLabel:    bet.label,
        wager,
        playerCards,
        bankerCards,
        pTotal,
        bTotal,
        pCount,
        bCount,
        result,
        ratio,
        dtTier,
        tierLabel:   tierLabel(bet.id, pCount, bCount),
        payout:      wager * ratio,
    }
}

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------

export default {
    id:     'optionals',
    label:  'Optionals',
    layout: BaccaratLayout,

    generate(difficulty) {
        return generate(difficulty)
    },

    layoutProps(round) {
        const bets = {}
        ALL_BET_IDS.forEach(id => { bets[id] = 0 })
        bets[round.betId] = round.wager
        return {
            bets,
            activeBetId: round.betId,
            dtTier:      round.dtTier,
        }
    },

    computePayout(round) {
        return round.payout
    },

    correctDetail() {
        return pick(CORRECT_MESSAGES)
    },

    wrongDetail(round, correct) {
        const label = round.tierLabel
            ? `${round.betLabel} · ${round.tierLabel}`
            : round.betLabel
        return `${label} · $${round.wager} × ${round.ratio} = <span class="hi">$${correct}</span>`
    },
}
