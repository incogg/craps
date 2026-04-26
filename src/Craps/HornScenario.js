import HornLayout from './HornLayout.vue'

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

const UNIT_VALUE = 5
const HORN_NUMS = [2, 3, 11, 12]
const NUM_TO_IDS = {
    2:  { high: 'hi2',  straight: 'two'    },
    3:  { high: 'hi3',  straight: 'three'  },
    11: { high: 'hi11', straight: 'eleven' },
    12: { high: 'hi12', straight: 'twelve' },
}

const PROFILES = {
    easy: {
        totalMin: 4, totalMax: 20,
        numAreasPool: [1],
        hornWeight: 60, hhWeight: 40,
        hhPool: [11, 12],
        kickerChance: 0, kickerMaxUnits: 0,
    },
    medium: {
        totalMin: 12, totalMax: 80,
        numAreasPool: [2, 2, 3],
        hornWeight: 30, hhWeight: 70,
        hhPool: [2, 3, 11, 12],
        kickerChance: 25, kickerMaxUnits: 2,
    },
    hard: {
        totalMin: 12, totalMax: 200,
        numAreasPool: [3, 3, 4, 4, 5],
        hornWeight: 20, hhWeight: 80,
        hhPool: [2, 3, 11, 12],
        kickerChance: 50, kickerMaxUnits: 5,
    },
}

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randChoice(arr)   { return arr[Math.floor(Math.random() * arr.length)] }

function snapToMultiple(value, step, minVal, maxVal) {
    const snapped = Math.round(value / step) * step
    const lo = Math.ceil(minVal / step) * step
    const hi = Math.floor(maxVal / step) * step
    if (lo > hi) return null
    return Math.min(Math.max(snapped, lo), hi)
}

function buildHorn(units, dist) {
    const each = units / 4
    HORN_NUMS.forEach(n => { dist[n] += each })
    return { id: 'horn', value: units * UNIT_VALUE }
}

function buildHornHigh(units, highNum, dist) {
    const layers = units / 5
    HORN_NUMS.forEach(n => { dist[n] += layers })
    dist[highNum] += layers
    return { id: NUM_TO_IDS[highNum].high, value: units * UNIT_VALUE }
}

function buildSplit(units, num, dist) {
    dist[num] += units
    return { id: NUM_TO_IDS[num].straight, value: units * UNIT_VALUE }
}

function buildArea(profile, budgetUnits, dist) {
    const { hornWeight, hhWeight, hhPool } = profile
    const canHorn = budgetUnits >= 4
    const canHH   = budgetUnits >= 5
    if (!canHorn && !canHH) return null
    const isHorn = Math.random() * ((canHorn ? hornWeight : 0) + (canHH ? hhWeight : 0)) < (canHorn ? hornWeight : 0)
    if (isHorn) {
        const units = snapToMultiple(budgetUnits, 4, 4, budgetUnits)
        return units ? buildHorn(units, dist) : null
    }
    const units = snapToMultiple(budgetUnits, 5, 5, budgetUnits)
    return units ? buildHornHigh(units, randChoice(hhPool), dist) : null
}

function generateBets(difficulty) {
    const profile = PROFILES[difficulty] || PROFILES.easy
    const dist = { 2: 0, 3: 0, 11: 0, 12: 0 }
    const areas = {}

    const numAreas   = randChoice(profile.numAreasPool)
    const totalBudget = randInt(profile.totalMin, profile.totalMax)
    const weights    = Array.from({ length: numAreas }, () => Math.random() * 0.6 + 0.7)
    const wSum       = weights.reduce((s, w) => s + w, 0)
    const budgets    = weights.map(w => Math.max(4, Math.round((w / wSum) * totalBudget)))

    for (let i = 0; i < numAreas; i++) {
        const bet = buildArea(profile, budgets[i], dist)
        if (!bet) continue
        areas[bet.id] = (areas[bet.id] || 0) + bet.value
        if (profile.kickerMaxUnits > 0 && Math.random() * 100 < profile.kickerChance) {
            const kickNum   = randChoice(HORN_NUMS)
            const kickUnits = randInt(1, profile.kickerMaxUnits)
            const split     = buildSplit(kickUnits, kickNum, dist)
            areas[split.id] = (areas[split.id] || 0) + split.value
        }
    }
    return [areas, dist]
}

// ---------------------------------------------------------------------------
// Payout
// ---------------------------------------------------------------------------

const ROLLS = [2, 3, 11, 12]
const COMBINATIONS = {
    2:  [[1,1]],
    3:  [[1,2],[2,1]],
    11: [[5,6],[6,5]],
    12: [[6,6]],
}
const ODDS = { 2: 33, 3: 16, 11: 16, 12: 33 }

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
// Scenario
// ---------------------------------------------------------------------------

export default {
    id: 'horns',
    label: 'Horns',
    layout: HornLayout,

    generate(difficulty) {
        const roll       = randChoice(ROLLS)
        const [d1, d2]   = randChoice(COMBINATIONS[roll])
        const [bets, dist] = generateBets(difficulty)
        return { d1, d2, bets, dist }
    },

    layoutProps(round) {
        return { bets: round.bets }
    },

    computePayout(round) {
        const sum = round.d1 + round.d2
        let units = 0
        ROLLS.forEach(n => {
            if (n === sum) units += round.dist[n] * ODDS[n]
            else units -= round.dist[n]
        })
        return units * UNIT_VALUE
    },

    correctDetail() {
        return randChoice(CORRECT_MESSAGES)
    },
}
