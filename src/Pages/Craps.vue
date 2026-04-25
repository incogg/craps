<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import CrapsResult from "@/Craps/Result.vue";
import CrapsLayout from "@/Craps/Layout.vue";
import PayoutArea from "@/Common/PayoutArea.vue";
import DiffDock from "@/Common/DiffDock.vue";
import generateHornBets, { UNIT_VALUE } from "@/Craps/hornBetGenerator";
import { useDifficulty } from "@/Common/useDifficulty";

const BETS = [
    { id: "any-seven", label: "ANY SEVEN" },
    { id: "any-craps", label: "ANY CRAPS" },
    { id: "hi2", label: "HORN HIGH 2" },
    { id: "hi12", label: "HORN HIGH 12" },
    { id: "hi3", label: "HORN HIGH 3" },
    { id: "hi11", label: "HORN HIGH 11" },
    { id: "two", label: "HORN 2 (ACES)" },
    { id: "twelve", label: "HORN 12 (MIDNIGHT)" },
    { id: "three", label: "HORN 3 (ACE DEUCE)" },
    { id: "eleven", label: "HORN 11 (YO)" },
];

const ROLLS = [2, 3, 11, 12];
const COMBINATIONS = {
    2: [[1,1]],
    3: [[1,2], [2,1]],
    11: [[5,6], [6,5]],
    12: [[6,6]],
}
const ODDS = {
    2: 33,
    3: 16,
    11: 16,
    12: 33,
}
const CORRECT_MESSAGES = [
  'Well done.',
  'Correct.',
  'Nice work.',
  'Spot on.',
  'That\'s the one.',
  'Right on the money.',
  'You\'re not just a pretty face.',
  'Calculator who?',
  'Textbook.',
  'Boxy approves.',
  'Sharp.',
  'You\'ve done this before.',
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const d1 = ref(1);
const d2 = ref(1);
const sum = computed(() => d1.value + d2.value);

const bets = ref({});
const dist = ref({});
const { difficulty } = useDifficulty();

const status = ref('idle');
const correct = ref(0);
const feedbackHtml = ref('');

function reset() {
    const roll = pick(ROLLS);
    [d1.value, d2.value] = pick(COMBINATIONS[roll]);
    [bets.value, dist.value] = generateHornBets(difficulty.value);
}

watch(difficulty, reset);

function onSubmit(value) {
    let units = 0;
    ROLLS.forEach((n) => {
        if (n == sum.value) units += dist.value[n] * ODDS[n];
        else units -= dist.value[n];
    });

    correct.value = units * UNIT_VALUE;
    const wasCorrect = value == correct.value;
    status.value = wasCorrect ? 'correct' : 'incorrect';
    if (!wasCorrect) feedbackHtml.value = `The correct payout was <span class='hi'>$${correct.value}</span>`;
    else feedbackHtml.value = pick(CORRECT_MESSAGES);
    console.log(dist.value, correct.value);
}

function onNext() {
    status.value = 'idle';
    reset();
}

reset();
</script>

<template>
    <div class="page">
        <nav class="top-nav">
            <RouterLink to="/" class="nav-back">← Home</RouterLink>
            <DiffDock />
            <span class="nav-game">Craps</span>
        </nav>

        <CrapsResult :d1="d1" :d2="d2" :sum="sum" />
        <CrapsLayout :bets="bets" />
        <PayoutArea
            :status="status"
            :correct="0"
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
.nav-back:hover {
    color: var(--text);
}
.nav-game {
    font-family: "JetBrains Mono", monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3em;
    color: var(--text-muted);
    text-transform: uppercase;
}
</style>
