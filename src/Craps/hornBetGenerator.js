/**
 * hornBetGenerator.js
 *
 * Generates randomised craps horn bets for dealer payout testing.
 *
 * Usage:
 *   import { generateHornBet } from './hornBetGenerator.js'
 *   const { bets, areas, totalUnits, totalDollars } = generateHornBet('medium')
 *
 * The returned `bets` object is ready to pass directly as the :bets prop:
 *   <HornBoard :bets="bets" />
 *
 * bets shape:
 *   {
 *     hi2:    <dollars on Horn High 2>,
 *     hi3:    <dollars on Horn High 3>,
 *     hi11:   <dollars on Horn High 11>,
 *     hi12:   <dollars on Horn High 12>,
 *     two:    <dollars on 2 straight>,
 *     three:  <dollars on 3 straight>,
 *     eleven: <dollars on 11 straight>,
 *     twelve: <dollars on 12 straight>,
 *   }
 *
 * All values are in dollars (unit * UNIT_VALUE).
 * Fields with no action are 0.
 *
 * `areas` is an array of bet objects for display/debugging:
 *   [
 *     { type: 'horn',     units: 20, dollars: 100 },
 *     { type: 'hornhigh', units: 15, dollars: 75, high: 12 },
 *     { type: 'split',    units: 2,  dollars: 10, num: 3 },
 *   ]
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Dollar value of one unit. */
export const UNIT_VALUE = 5;

/** The four horn numbers. */
const HORN_NUMS = [2, 3, 11, 12];

/**
 * Maps a horn number to the Horn High bet id used in your layout,
 * and to the straight (zoom cell) id.
 */
const NUM_TO_IDS = {
    2: { high: "hi2", straight: "two" },
    3: { high: "hi3", straight: "three" },
    11: { high: "hi11", straight: "eleven" },
    12: { high: "hi12", straight: "twelve" },
};

// ---------------------------------------------------------------------------
// Difficulty profiles
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} Profile
 * @property {number}   totalMin       - Minimum total units for the whole bet
 * @property {number}   totalMax       - Maximum total units for the whole bet
 * @property {number[]} numAreasPool   - Pool to randomly draw number of betting areas from
 * @property {number}   hornWeight     - Relative weight for choosing a Horn bet
 * @property {number}   hhWeight       - Relative weight for choosing a Horn High bet
 * @property {number[]} hhPool         - Which numbers can be the Horn High
 * @property {number}   kickerChance   - 0–100 probability of a straight kicker per area
 * @property {number}   kickerMaxUnits - Max units for a kicker (0 = no kickers)
 */

/** @type {Record<string, Profile>} */
const PROFILES = {
    /**
     * Easy — $20–$100 total.
     * One betting area. Horns and Horn Highs on 11 & 12 only. No kickers.
     */
    easy: {
        totalMin: 4,
        totalMax: 20,
        numAreasPool: [1],
        hornWeight: 60,
        hhWeight: 40,
        hhPool: [11, 12],
        kickerChance: 0,
        kickerMaxUnits: 0,
    },

    /**
     * Medium — $60–$400 total.
     * 2–3 betting areas. Horn Highs on all four numbers. Occasional kicker.
     */
    medium: {
        totalMin: 12,
        totalMax: 80,
        numAreasPool: [2, 2, 3],
        hornWeight: 30,
        hhWeight: 70,
        hhPool: [2, 3, 11, 12],
        kickerChance: 25,
        kickerMaxUnits: 2,
    },

    /**
     * Hard — $60–$1,000 total.
     * 3–5 betting areas. Horn Highs on all numbers including craps (2 & 3).
     * Frequent kickers, large amounts.
     */
    hard: {
        totalMin: 12,
        totalMax: 200,
        numAreasPool: [3, 3, 4, 4, 5],
        hornWeight: 20,
        hhWeight: 80,
        hhPool: [2, 3, 11, 12],
        kickerChance: 50,
        kickerMaxUnits: 5,
    },
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Snap `value` to the nearest multiple of `step`,
 * clamped to [minVal, maxVal].
 */
function snapToMultiple(value, step, minVal, maxVal) {
    const snapped = Math.round(value / step) * step;
    const lo = Math.ceil(minVal / step) * step;
    const hi = Math.floor(maxVal / step) * step;
    if (lo > hi) return null;
    return Math.min(Math.max(snapped, lo), hi);
}

// ---------------------------------------------------------------------------
// Bet builders
// Return a bet object and mutate the running dist accumulator.
// ---------------------------------------------------------------------------

/**
 * Build a Horn bet.
 * Total must be divisible by 4. Each number gets total/4 units.
 *
 * @param {number} units
 * @param {Record<number,number>} dist - running per-number unit accumulator
 * @returns {{ type: 'horn', units: number, dollars: number }}
 */
function buildHorn(units, dist) {
    const each = units / 4;
    HORN_NUMS.forEach((n) => {
        dist[n] += each;
    });
    return { id: "horn", value: units * UNIT_VALUE  };
}

/**
 * Build a Horn High bet.
 * Total must be divisible by 5. High number gets 2× layers, others get 1× layers.
 *
 * @param {number} units
 * @param {number} highNum - which of 2, 3, 11, 12 is the high
 * @param {Record<number,number>} dist
 * @returns {{ type: 'hornhigh', units: number, dollars: number, high: number }}
 */
function buildHornHigh(units, highNum, dist) {
    const layers = units / 5;
    HORN_NUMS.forEach((n) => {
        dist[n] += layers;
    });
    dist[highNum] += layers; // high number gets double
    return { id: NUM_TO_IDS[highNum].high, value: units * UNIT_VALUE  };
}

/**
 * Build a straight (split) bet on a single number.
 *
 * @param {number} units
 * @param {number} num - which of 2, 3, 11, 12
 * @param {Record<number,number>} dist
 * @returns {{ type: 'split', units: number, dollars: number, num: number }}
 */
function buildSplit(units, num, dist) {
    dist[num] += units;
    return { id: NUM_TO_IDS[num].straight, value: units * UNIT_VALUE  };
}

/**
 * Build one betting area (Horn or Horn High) from a given budget.
 * Snaps the budget to the nearest valid multiple.
 *
 * @param {Profile} profile
 * @param {number}  budgetUnits
 * @param {Record<number,number>} dist
 * @returns {object|null} bet object, or null if budget too small
 */
function buildArea(profile, budgetUnits, dist) {
    const { hornWeight, hhWeight, hhPool } = profile;

    const canHorn = budgetUnits >= 4;
    const canHH = budgetUnits >= 5;
    if (!canHorn && !canHH) return null;

    const hW = canHorn ? hornWeight : 0;
    const hhW = canHH ? hhWeight : 0;
    const isHorn = Math.random() * (hW + hhW) < hW;

    if (isHorn) {
        const units = snapToMultiple(budgetUnits, 4, 4, budgetUnits);
        if (!units) return null;
        return buildHorn(units, dist);
    } else {
        const units = snapToMultiple(budgetUnits, 5, 5, budgetUnits);
        if (!units) return null;
        return buildHornHigh(units, randChoice(hhPool), dist);
    }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} HornBetResult
 * @property {Record<string,number>} bets         - Ready-to-use :bets prop for your Vue component
 * @property {object[]}              areas        - Individual bet objects for display/debugging
 * @property {number}                totalUnits   - Sum of all bet units
 * @property {number}                totalDollars - Sum of all bet dollars
 * @property {'easy'|'medium'|'hard'} difficulty  - The difficulty used
 */

/**
 * Generate a randomised set of horn bets at the given difficulty.
 *
 * @param {'easy'|'medium'|'hard'} difficulty
 * @returns {HornBetResult}
 */
export default function generateHornBets(difficulty = "medium") {
    const profile = PROFILES[difficulty];
    if (!profile)
        throw new Error(
            `Unknown difficulty: "${difficulty}". Use 'easy', 'medium', or 'hard'.`,
        );

    const dist = { 2: 0, 3: 0, 11: 0, 12: 0 };
    const areas = {};

    // How many independent betting areas?
    const numAreas = randChoice(profile.numAreasPool);

    // Total budget in units, split roughly evenly with some variance
    const totalBudget = randInt(profile.totalMin, profile.totalMax);

    // Random weights so areas aren't identical sizes
    const weights = Array.from(
        { length: numAreas },
        () => Math.random() * 0.6 + 0.7,
    );
    const wSum = weights.reduce((s, w) => s + w, 0);
    const budgets = weights.map((w) =>
        Math.max(4, Math.round((w / wSum) * totalBudget)),
    );

    for (let i = 0; i < numAreas; i++) {
        const bet = buildArea(profile, budgets[i], dist);
        if (!bet) continue;
        console.log(bet);
        areas[bet.id] = (areas[bet.id] || 0) + bet.value;

        // Optional kicker (straight bet on one number) attached to this area
        if (
            profile.kickerMaxUnits > 0 &&
            Math.random() * 100 < profile.kickerChance
        ) {
            const kickNum = randChoice(HORN_NUMS);
            const kickUnits = randInt(1, profile.kickerMaxUnits);
            const split = buildSplit(kickUnits, kickNum, dist);
            areas[split.id] = (areas[split.id] || 0) + split.value;
        }
    }

    console.log(areas, dist)
    return [ areas, dist ];
}

/**
 * List of valid difficulty levels.
 * @type {string[]}
 */
export const DIFFICULTIES = ["easy", "medium", "hard"];
