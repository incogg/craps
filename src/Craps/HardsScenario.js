import HardsLayout from './HardsLayout.vue'

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

const BETS = [
    { id: 'h4',  label: 'HARD 4',  total: 4,  ratio: 7.5, pair: 2 },
    { id: 'h6',  label: 'HARD 6',  total: 6,  ratio: 9.5, pair: 3 },
    { id: 'h8',  label: 'HARD 8',  total: 8,  ratio: 9.5, pair: 4 },
    { id: 'h10', label: 'HARD 10', total: 10, ratio: 7.5, pair: 5 },
]

// Base wager ranges by difficulty (inclusive, $5 increments)
// bias10: probability that the wager is forced to a multiple of 10
const RANGES = {
    easy:   { min: 10,  max: 100,  bias10: 0.8 },
    medium: { min: 25,  max: 400,  bias10: 0.6 },
    hard:   { min: 200, max: 1500, bias10: 0.1 },
}

// Per-bet wager caps; easy/med share one cap, hard has its own
const CAPS = {
    h6:  { easymed: 400,  hard: 1000 },
    h8:  { easymed: 400,  hard: 1000 },
    h4:  { easymed: 600,  hard: 1500 },
    h10: { easymed: 600,  hard: 1500 },
}

function randomWager(bet, difficulty) {
    const { min, max, bias10 } = RANGES[difficulty] || RANGES.easy
    const capKey = difficulty === 'hard' ? 'hard' : 'easymed'
    const effectiveMax = Math.min(max, CAPS[bet.id][capKey])

    if (Math.random() < bias10) {
        const lo = Math.ceil(min / 10) * 10
        const steps = Math.floor((effectiveMax - lo) / 10)
        return lo + Math.floor(Math.random() * (steps + 1)) * 10
    }

    const steps = (effectiveMax - min) / 5
    return min + Math.floor(Math.random() * (steps + 1)) * 5
}

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

function generate(difficulty) {
    const bet   = pick(BETS)
    const wager = randomWager(bet, difficulty)
    const d1    = bet.pair
    const d2    = bet.pair
    const payout = wager * bet.ratio
    return { d1, d2, bet, wager, win: true, payout }
}

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------

export default {
    id: 'hardways',
    label: 'Hardways',
    layout: HardsLayout,

    generate(difficulty) {
        return generate(difficulty)
    },

    layoutProps(round) {
        return { betId: round.bet.id, wager: round.wager }
    },

    computePayout(round) {
        return round.payout
    },

    correctDetail() {
        return pick(CORRECT_MESSAGES)
    },

    wrongDetail(round, correct) {
        return `${round.bet.label} · $${round.wager} × ${round.bet.ratio} = <span class='hi'>$${correct}</span>`
    },
}
