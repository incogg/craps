<template>
    <div class="view-container">
        <DiceRoll :die1="currentRoll.d1" :die2="currentRoll.d2" />

        <HornBetLayout id="layout" :bets="currentBets" />

        <PayoutSubmitArea
            @submit="onSubmit"
            @reset="onReset"
            :status="state"
            :correct-total="correctPayout"
        />
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { currentBets, randomiseBets, calculatePayout } from "./Bets.js";
import DiceRoll from "./components/DiceRoll.vue";
import HornBetLayout from "./components/HornBetLayout.vue";
import PayoutSubmitArea from "./components/PayoutSubmitArea.vue";

const state = ref("normal");
const correctPayout = ref(0);
const currentRoll = ref({ d1: 2, d2: 1 });
const rollValue = computed(() => currentRoll.value.d1 + currentRoll.value.d2);

const combinations = {
    2:  [[1,1]],
    3:  [[1,2], [2,1]],
    11: [[5,6], [6,5]],
    12: [[6,6]]
};

const randomiseRoll = () => {
    const totals = [2, 3, 11, 12];
    const total = totals[Math.floor(Math.random() * totals.length)];
    const options = combinations[total];
    const [d1, d2] = options[Math.floor(Math.random() * options.length)];
    currentRoll.value = { d1, d2 };
};

const onReset = () => {
    randomiseRoll();
    randomiseBets();
    state.value = "normal";
}

const onSubmit = (value) => {
    const correct = calculatePayout(rollValue.value);
    if (value != correct) {
        state.value = "incorrect"
        correctPayout.value = correct;
    } else state.value = "correct"
};

onReset();
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,700,0,0");

*, *::before, *::after {
    box-sizing: border-box;
}

body {
    background-color: #131313;
    background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 24px 24px;
    color: #e5e2e1;
    font-family: "Manrope", sans-serif;
    overflow: scroll;
}

#app {
    display: flex;
    margin: 0;
    min-height: 100dvh;
    justify-content: center;
    align-items: center;
    width: 100%;
}

#layout {
    min-height: 500px;
}

.view-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    width: 100%;
    max-width: 600px;
    height: 100dvh;
    max-height: 1100px;
}

/* This pushes the payout area to the bottom */
.view-container > *:nth-child(2) {
    flex: 1;
    min-height: 0;
}

/* FIX: Prevent the payout area from shrinking or growing when state changes */
.view-container > *:nth-child(3) {
    flex-shrink: 0;
    flex-grow: 0;
}
</style>
